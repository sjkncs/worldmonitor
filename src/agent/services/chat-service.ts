/**
 * Chat Service — Streaming LLM client for Agent UI.
 * Supports Ollama (local), Groq (cloud), OpenRouter (cloud).
 * All providers use OpenAI-compatible /v1/chat/completions with streaming.
 */

import type { ChatMessage, AgentSettings } from './conversation-store';

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

interface ProviderConfig {
  url: string;
  model: string;
  headers: Record<string, string>;
  extraBody?: Record<string, unknown>;
}

function getProviderConfig(settings: AgentSettings): ProviderConfig {
  if (settings.provider === 'ollama') {
    const baseUrl = settings.ollamaUrl || 'http://localhost:11434';
    return {
      url: `${baseUrl}/v1/chat/completions`,
      model: settings.ollamaModel || 'llama3.1:8b',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  if (settings.provider === 'groq') {
    return {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.1-8b-instant',
      headers: {
        'Authorization': `Bearer ${settings.groqKey}`,
        'Content-Type': 'application/json',
      },
    };
  }

  if (settings.provider === 'openrouter') {
    return {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'openrouter/auto',
      headers: {
        'Authorization': `Bearer ${settings.openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://worldmonitor.app',
        'X-Title': 'WorldMonitor Agent',
      },
    };
  }

  throw new Error(`Unknown provider: ${settings.provider}`);
}

function buildMessages(
  conversation: ChatMessage[],
  systemPrompt: string,
  toolMode?: string,
): Array<{ role: string; content: string }> {
  const msgs: Array<{ role: string; content: string }> = [];

  let system = systemPrompt;
  if (toolMode === 'deep-think') {
    system += '\n\nIMPORTANT: Think step by step. Show your reasoning process clearly. Break down complex problems into smaller parts.';
  } else if (toolMode === 'research') {
    system += '\n\nIMPORTANT: Provide in-depth research-level analysis. Cite sources when possible. Cover multiple perspectives and provide comprehensive analysis.';
  } else if (toolMode === 'code') {
    system += '\n\nIMPORTANT: Focus on code generation and technical solutions. Use code blocks with language annotations. Explain the code clearly.';
  } else if (toolMode === 'intel') {
    system += '\n\nIMPORTANT: Focus on intelligence analysis, geopolitical implications, and threat assessment. Use OSINT methodology.';
  } else if (toolMode === 'market') {
    system += '\n\nIMPORTANT: Focus on market analysis, financial implications, and economic indicators. Provide data-driven insights.';
  }

  msgs.push({ role: 'system', content: system });

  for (const msg of conversation) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      msgs.push({ role: msg.role, content: msg.content });
    }
  }

  return msgs;
}

let activeController: AbortController | null = null;

export function abortChat(): void {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

export async function streamChat(
  messages: ChatMessage[],
  settings: AgentSettings,
  toolMode: string | undefined,
  callbacks: StreamCallbacks,
): Promise<void> {
  abortChat();
  activeController = new AbortController();
  const { signal } = activeController;

  const config = getProviderConfig(settings);
  const chatMessages = buildMessages(messages, settings.systemPrompt, toolMode);

  const body: Record<string, unknown> = {
    model: config.model,
    messages: chatMessages,
    stream: true,
    temperature: settings.temperature,
    max_tokens: 4096,
    ...config.extraBody,
  };

  let fullText = '';

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          callbacks.onDone(fullText);
          activeController = null;
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            callbacks.onToken(delta);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    callbacks.onDone(fullText);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      callbacks.onDone(fullText);
    } else {
      const message = err instanceof Error ? err.message : String(err);
      callbacks.onError(message);
    }
  } finally {
    activeController = null;
  }
}

/**
 * Fetch available models from Ollama instance.
 */
export async function fetchOllamaModels(baseUrl: string): Promise<string[]> {
  try {
    const resp = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.models || [])
      .map((m: { name: string }) => m.name)
      .filter((name: string) => !name.includes('embed'));
  } catch {
    return [];
  }
}
