/**
 * World Monitor Agent — Main Application Controller
 * Renders the full Agent UI: sidebar, chat, welcome screen, input.
 */

import {
  type Conversation,
  type ChatMessage,
  type AgentSettings,
  loadConversations,
  saveConversations,
  createConversation,
  deleteConversation,
  updateConversationTitle,
  loadSettings,
  saveSettings,
  generateId,
} from './services/conversation-store';

import { streamChat, abortChat, fetchOllamaModels } from './services/chat-service';

// ── SVG Icons ──

const ICON = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 4 7l3 3 3-3c2-1.5 4-4 4-7a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  newspaper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="12" y2="12"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
};

// ── Markdown rendering (lightweight) ──

function renderMarkdown(text: string): string {
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

// ── Main App Class ──

export class AgentApp {
  private root: HTMLElement;
  private conversations: Conversation[] = [];
  private activeConvId: string | null = null;
  private settings: AgentSettings;
  private isStreaming = false;
  private activeToolMode: string | null = null;
  private modelDropdownOpen = false;

  // DOM refs
  private convListEl!: HTMLElement;
  private chatAreaEl!: HTMLElement;
  private messagesEl!: HTMLElement;
  private welcomeEl!: HTMLElement;
  private textareaEl!: HTMLTextAreaElement;
  private sendBtnEl!: HTMLButtonElement;
  private modelSelectorEl!: HTMLElement;
  private modelDropdownEl!: HTMLElement;
  private settingsOverlayEl!: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.settings = loadSettings();
  }

  init(): void {
    this.showSplash();
    this.conversations = loadConversations();
    this.render();
    this.bindEvents();
    this.setupCodeCopyButtons();
    const first = this.conversations[0];
    if (first) {
      this.setActiveConversation(first.id);
    }
  }

  private showSplash(): void {
    const splash = document.createElement('div');
    splash.className = 'agent-splash';
    splash.innerHTML = `
      <div class="agent-splash-logo">
        <div class="agent-splash-logo-inner">W</div>
      </div>
      <div class="agent-splash-text"><span>Powered by World Monitor</span></div>
    `;
    document.body.appendChild(splash);
    setTimeout(() => {
      splash.classList.add('fade-out');
      splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    }, 1500);
  }

  // ── Render ──

  private render(): void {
    this.root.innerHTML = `
      <!-- Sidebar -->
      <aside class="agent-sidebar">
        <div class="agent-sidebar-header">
          <div class="agent-logo">W</div>
          <span class="agent-brand">World Monitor</span>
        </div>
        <button class="agent-new-chat-btn" id="new-chat-btn">
          ${ICON.plus} 新对话
        </button>
        <div class="agent-conv-section">对话历史</div>
        <div class="agent-conv-list" id="conv-list"></div>
        <div class="agent-sidebar-footer">
          <button class="agent-sidebar-footer-btn" id="dashboard-link">
            ${ICON.globe} Dashboard
          </button>
          <button class="agent-sidebar-footer-btn" id="settings-btn">
            ${ICON.settings} 设置
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="agent-main">
        <!-- Top bar -->
        <div class="agent-topbar">
          <div class="agent-topbar-left">
            <div class="agent-model-selector" id="model-selector">
              <span id="model-name">${this.getModelDisplayName()}</span>
              ${ICON.chevron}
            </div>
          </div>
          <div class="agent-topbar-right">
            <button class="agent-dashboard-btn" id="topbar-dashboard">
              ${ICON.globe} Dashboard
            </button>
          </div>
        </div>

        <!-- Model dropdown -->
        <div class="agent-model-dropdown" id="model-dropdown"></div>

        <!-- Welcome screen -->
        <div class="agent-welcome" id="welcome-screen">
          <div class="agent-welcome-logo">W</div>
          <div class="agent-welcome-greeting">你好，我是 World Monitor Agent</div>
          <div class="agent-welcome-sub">
            AI 驱动的全球情报分析助手 — 支持地缘政治、市场洞察、威胁评估、代码生成
          </div>
          <div class="agent-quick-actions">
            <div class="agent-quick-card" data-action="intel">
              <div class="agent-quick-card-icon intel">🌍</div>
              <div class="agent-quick-card-label">情报分析</div>
            </div>
            <div class="agent-quick-card" data-action="research">
              <div class="agent-quick-card-icon research">🔬</div>
              <div class="agent-quick-card-label">深度研究</div>
            </div>
            <div class="agent-quick-card" data-action="code">
              <div class="agent-quick-card-icon code">💻</div>
              <div class="agent-quick-card-label">代码</div>
            </div>
            <div class="agent-quick-card" data-action="market">
              <div class="agent-quick-card-icon market">📈</div>
              <div class="agent-quick-card-label">市场分析</div>
            </div>
            <div class="agent-quick-card" data-action="news">
              <div class="agent-quick-card-icon news">📰</div>
              <div class="agent-quick-card-label">新闻摘要</div>
            </div>
          </div>
        </div>

        <!-- Chat messages area -->
        <div class="agent-chat-area agent-hidden" id="chat-area">
          <div class="agent-messages" id="messages"></div>
        </div>

        <!-- Input area -->
        <div class="agent-input-area">
          <div class="agent-input-container">
            <div class="agent-input-row">
              <textarea class="agent-textarea" id="chat-input" rows="1"
                placeholder="向 World Monitor Agent 提问..."
              ></textarea>
              <button class="agent-send-btn" id="send-btn" disabled>
                ${ICON.send}
              </button>
            </div>
            <div class="agent-tool-bar">
              <button class="agent-tool-btn" data-tool="intel">
                ${ICON.globe} 情报助理
              </button>
              <button class="agent-tool-btn" data-tool="deep-think">
                ${ICON.brain} 深度思考
              </button>
              <button class="agent-tool-btn" data-tool="research">
                ${ICON.search} 深度研究
              </button>
              <button class="agent-tool-btn" data-tool="code">
                ${ICON.code} 代码
              </button>
              <button class="agent-tool-btn" data-tool="market">
                ${ICON.chart} 市场
              </button>
              <div class="agent-tool-separator"></div>
              <div class="agent-action-btns">
                <button class="agent-action-btn" title="Web Search" id="web-search-btn">
                  ${ICON.search}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Settings overlay -->
      <div class="agent-settings-overlay" id="settings-overlay">
        <div class="agent-settings-panel">
          <div class="agent-settings-title">⚙️ Agent 设置</div>

          <div class="agent-settings-group">
            <label class="agent-settings-label">AI 提供商</label>
            <select class="agent-settings-input" id="set-provider">
              <option value="ollama" ${this.settings.provider === 'ollama' ? 'selected' : ''}>Ollama (本地)</option>
              <option value="groq" ${this.settings.provider === 'groq' ? 'selected' : ''}>Groq (云端)</option>
              <option value="openrouter" ${this.settings.provider === 'openrouter' ? 'selected' : ''}>OpenRouter (云端)</option>
            </select>
          </div>

          <div class="agent-settings-group" id="set-ollama-group">
            <label class="agent-settings-label">Ollama API URL</label>
            <input class="agent-settings-input" id="set-ollama-url" value="${this.settings.ollamaUrl}" placeholder="http://localhost:11434" />
          </div>

          <div class="agent-settings-group" id="set-ollama-model-group">
            <label class="agent-settings-label">Ollama 模型</label>
            <input class="agent-settings-input" id="set-ollama-model" value="${this.settings.ollamaModel}" placeholder="llama3.1:8b" />
          </div>

          <div class="agent-settings-group agent-hidden" id="set-groq-group">
            <label class="agent-settings-label">Groq API Key</label>
            <input class="agent-settings-input" id="set-groq-key" type="password" value="${this.settings.groqKey}" placeholder="gsk_..." />
          </div>

          <div class="agent-settings-group agent-hidden" id="set-openrouter-group">
            <label class="agent-settings-label">OpenRouter API Key</label>
            <input class="agent-settings-input" id="set-openrouter-key" type="password" value="${this.settings.openrouterKey}" placeholder="sk-or-..." />
          </div>

          <div class="agent-settings-group">
            <label class="agent-settings-label">System Prompt</label>
            <textarea class="agent-settings-input" id="set-system-prompt" rows="4" style="resize:vertical">${this.settings.systemPrompt}</textarea>
          </div>

          <div class="agent-settings-group">
            <label class="agent-settings-label">Temperature (${this.settings.temperature})</label>
            <input type="range" id="set-temperature" min="0" max="1" step="0.1" value="${this.settings.temperature}" style="width:100%" />
          </div>

          <div class="agent-settings-actions">
            <button class="agent-btn-secondary" id="settings-cancel">取消</button>
            <button class="agent-btn-primary" id="settings-save">保存</button>
          </div>
        </div>
      </div>
    `;

    // Cache DOM refs
    this.convListEl = document.getElementById('conv-list')!;
    this.chatAreaEl = document.getElementById('chat-area')!;
    this.messagesEl = document.getElementById('messages')!;
    this.welcomeEl = document.getElementById('welcome-screen')!;
    this.textareaEl = document.getElementById('chat-input') as HTMLTextAreaElement;
    this.sendBtnEl = document.getElementById('send-btn') as HTMLButtonElement;
    this.modelSelectorEl = document.getElementById('model-selector')!;
    this.modelDropdownEl = document.getElementById('model-dropdown')!;
    this.settingsOverlayEl = document.getElementById('settings-overlay')!;

    this.renderConversationList();
    this.toggleSettingsFields();
  }

  // ── Bind Events ──

  private bindEvents(): void {
    // New chat
    document.getElementById('new-chat-btn')!.addEventListener('click', () => this.newChat());

    // Send
    this.sendBtnEl.addEventListener('click', () => this.handleSend());
    this.textareaEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Auto-resize textarea
    this.textareaEl.addEventListener('input', () => {
      this.textareaEl.style.height = 'auto';
      this.textareaEl.style.height = Math.min(this.textareaEl.scrollHeight, 200) + 'px';
      this.sendBtnEl.disabled = !this.textareaEl.value.trim() && !this.isStreaming;
    });

    // Tool mode buttons
    this.root.querySelectorAll('.agent-tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = (btn as HTMLElement).dataset.tool!;
        if (this.activeToolMode === tool) {
          this.activeToolMode = null;
          btn.classList.remove('active');
        } else {
          this.root.querySelectorAll('.agent-tool-btn').forEach(b => b.classList.remove('active'));
          this.activeToolMode = tool;
          btn.classList.add('active');
        }
      });
    });

    // Quick action cards
    this.root.querySelectorAll('.agent-quick-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = (card as HTMLElement).dataset.action!;
        this.activeToolMode = action;
        this.root.querySelectorAll('.agent-tool-btn').forEach(b => {
          b.classList.toggle('active', (b as HTMLElement).dataset.tool === action);
        });
        const prompts: Record<string, string> = {
          intel: '请分析当前全球最紧迫的地缘政治热点，包括潜在升级风险和各方立场',
          research: '请深入分析',
          code: '',
          market: '请分析当前全球金融市场状况，包括主要指数走势、风险信号和投资建议',
          news: '请总结今天最重要的全球新闻，重点关注地缘政治、军事和经济领域',
        };
        if (prompts[action]) {
          this.textareaEl.value = prompts[action];
          this.textareaEl.focus();
          this.sendBtnEl.disabled = false;
        } else {
          this.textareaEl.focus();
        }
      });
    });

    // Model selector
    this.modelSelectorEl.addEventListener('click', () => this.toggleModelDropdown());
    document.addEventListener('click', (e) => {
      if (this.modelDropdownOpen && !this.modelSelectorEl.contains(e.target as Node) && !this.modelDropdownEl.contains(e.target as Node)) {
        this.closeModelDropdown();
      }
    });

    // Settings
    document.getElementById('settings-btn')!.addEventListener('click', () => this.openSettings());
    document.getElementById('settings-cancel')!.addEventListener('click', () => this.closeSettings());
    document.getElementById('settings-save')!.addEventListener('click', () => this.saveSettingsFromUI());
    document.getElementById('set-provider')!.addEventListener('change', () => this.toggleSettingsFields());

    // Dashboard links
    const dashboardNav = () => { window.location.href = '/'; };
    document.getElementById('dashboard-link')!.addEventListener('click', dashboardNav);
    document.getElementById('topbar-dashboard')!.addEventListener('click', dashboardNav);

    // Temperature label update
    document.getElementById('set-temperature')!.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      const label = (e.target as HTMLElement).parentElement!.querySelector('.agent-settings-label')!;
      label.textContent = `Temperature (${val})`;
    });
  }

  // ── Conversation Management ──

  private newChat(): void {
    const conv = createConversation(this.getActiveModel());
    this.conversations.unshift(conv);
    saveConversations(this.conversations);
    this.setActiveConversation(conv.id);
    this.renderConversationList();
    this.textareaEl.focus();
  }

  private setActiveConversation(id: string): void {
    this.activeConvId = id;
    const conv = this.getActiveConversation();
    if (conv && conv.messages.length > 0) {
      this.showChatArea();
      this.renderMessages(conv.messages);
    } else {
      this.showWelcome();
    }
    this.renderConversationList();
  }

  private getActiveConversation(): Conversation | undefined {
    return this.conversations.find(c => c.id === this.activeConvId);
  }

  private renderConversationList(): void {
    this.convListEl.innerHTML = this.conversations.map(conv => `
      <div class="agent-conv-item ${conv.id === this.activeConvId ? 'active' : ''}" data-id="${conv.id}">
        <span class="conv-icon">${ICON.chat}</span>
        <span>${this.escapeHtml(conv.title)}</span>
        <button class="conv-delete" data-delete="${conv.id}" title="删除">${ICON.trash}</button>
      </div>
    `).join('');

    // Bind clicks
    this.convListEl.querySelectorAll('.agent-conv-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.conv-delete')) return;
        this.setActiveConversation((item as HTMLElement).dataset.id!);
      });
    });

    this.convListEl.querySelectorAll('.conv-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.delete!;
        this.conversations = deleteConversation(this.conversations, id);
        saveConversations(this.conversations);
        if (this.activeConvId === id) {
          this.activeConvId = this.conversations[0]?.id || null;
          if (this.activeConvId) {
            this.setActiveConversation(this.activeConvId);
          } else {
            this.showWelcome();
          }
        }
        this.renderConversationList();
      });
    });
  }

  // ── Chat Logic ──

  private async handleSend(): Promise<void> {
    if (this.isStreaming) {
      abortChat();
      this.isStreaming = false;
      this.sendBtnEl.innerHTML = ICON.send;
      return;
    }

    const text = this.textareaEl.value.trim();
    if (!text) return;

    // Ensure active conversation
    if (!this.activeConvId) {
      this.newChat();
    }
    const conv = this.getActiveConversation();
    if (!conv) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      toolMode: this.activeToolMode || undefined,
    };
    conv.messages.push(userMsg);
    conv.updatedAt = Date.now();
    updateConversationTitle(conv);
    saveConversations(this.conversations);
    this.renderConversationList();

    // Clear input
    this.textareaEl.value = '';
    this.textareaEl.style.height = 'auto';
    this.sendBtnEl.disabled = true;

    // Show chat area
    this.showChatArea();
    this.appendMessageToDOM(userMsg);

    // Start streaming
    this.isStreaming = true;
    this.sendBtnEl.innerHTML = ICON.stop;
    this.sendBtnEl.disabled = false;

    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: this.getActiveModel(),
    };

    // Create assistant bubble with typing indicator
    const bubbleEl = this.createAssistantBubble(assistantMsg.id);
    this.messagesEl.appendChild(bubbleEl);
    this.scrollToBottom();

    const contentEl = bubbleEl.querySelector('.agent-msg-content')!;
    contentEl.innerHTML = '<div class="agent-typing"><span></span><span></span><span></span></div>';

    await streamChat(
      conv.messages,
      this.settings,
      this.activeToolMode || undefined,
      {
        onToken: (token) => {
          assistantMsg.content += token;
          contentEl.innerHTML = renderMarkdown(assistantMsg.content);
          this.scrollToBottom();
        },
        onDone: (fullText) => {
          assistantMsg.content = fullText;
          contentEl.innerHTML = renderMarkdown(fullText || '*（无响应）*');
          conv.messages.push(assistantMsg);
          conv.updatedAt = Date.now();
          saveConversations(this.conversations);
          this.isStreaming = false;
          this.sendBtnEl.innerHTML = ICON.send;
          this.sendBtnEl.disabled = true;
          this.scrollToBottom();
        },
        onError: (error) => {
          contentEl.innerHTML = `<p style="color:var(--agent-danger)">⚠️ 错误: ${this.escapeHtml(error)}</p>
            <p style="color:var(--agent-text-muted);font-size:12px">请检查设置中的 AI 提供商配置是否正确。</p>`;
          this.isStreaming = false;
          this.sendBtnEl.innerHTML = ICON.send;
          this.sendBtnEl.disabled = true;
        },
      },
    );
  }

  // ── DOM Helpers ──

  private showChatArea(): void {
    this.welcomeEl.classList.add('agent-hidden');
    this.chatAreaEl.classList.remove('agent-hidden');
  }

  private showWelcome(): void {
    this.welcomeEl.classList.remove('agent-hidden');
    this.chatAreaEl.classList.add('agent-hidden');
    this.messagesEl.innerHTML = '';
  }

  private renderMessages(messages: ChatMessage[]): void {
    this.messagesEl.innerHTML = '';
    for (const msg of messages) {
      this.appendMessageToDOM(msg);
    }
    this.scrollToBottom();
  }

  private appendMessageToDOM(msg: ChatMessage): void {
    const div = document.createElement('div');
    div.className = 'agent-msg';
    div.dataset.id = msg.id;

    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (msg.role === 'user') {
      div.innerHTML = `
        <div class="agent-msg-avatar user">U</div>
        <div class="agent-msg-body">
          <div class="agent-msg-role">You <span class="agent-msg-time">${timeStr}</span></div>
          <div class="agent-msg-content">${renderMarkdown(msg.content)}</div>
          <div class="agent-msg-actions">
            <button class="agent-msg-action-btn copy-msg" data-text="${this.escapeAttr(msg.content)}">📋 复制</button>
          </div>
        </div>
      `;
    } else {
      div.innerHTML = `
        <div class="agent-msg-avatar assistant">W</div>
        <div class="agent-msg-body">
          <div class="agent-msg-role">World Monitor Agent${msg.model ? ` · ${msg.model}` : ''} <span class="agent-msg-time">${timeStr}</span></div>
          <div class="agent-msg-content">${renderMarkdown(msg.content)}</div>
          <div class="agent-msg-actions">
            <button class="agent-msg-action-btn copy-msg" data-text="${this.escapeAttr(msg.content)}">📋 复制</button>
          </div>
        </div>
      `;
    }

    // Bind copy buttons
    div.querySelectorAll('.copy-msg').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = (btn as HTMLElement).dataset.text || '';
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '✅ 已复制';
          setTimeout(() => { btn.textContent = '📋 复制'; }, 1500);
        });
      });
    });

    this.messagesEl.appendChild(div);
  }

  private createAssistantBubble(id: string): HTMLElement {
    const div = document.createElement('div');
    div.className = 'agent-msg';
    div.dataset.id = id;
    div.innerHTML = `
      <div class="agent-msg-avatar assistant">W</div>
      <div class="agent-msg-body">
        <div class="agent-msg-role">World Monitor Agent · ${this.getActiveModel()}</div>
        <div class="agent-msg-content"></div>
      </div>
    `;
    return div;
  }

  private scrollToBottom(): void {
    this.chatAreaEl.scrollTop = this.chatAreaEl.scrollHeight;
  }

  // ── Model Selector ──

  private getActiveModel(): string {
    if (this.settings.provider === 'ollama') return this.settings.ollamaModel;
    if (this.settings.provider === 'groq') return 'llama-3.1-8b-instant';
    return 'openrouter/auto';
  }

  private getModelDisplayName(): string {
    const model = this.getActiveModel();
    const provider = this.settings.provider.charAt(0).toUpperCase() + this.settings.provider.slice(1);
    return `${model} (${provider})`;
  }

  private async toggleModelDropdown(): Promise<void> {
    if (this.modelDropdownOpen) {
      this.closeModelDropdown();
      return;
    }

    this.modelDropdownOpen = true;
    this.modelDropdownEl.classList.add('open');

    const models: Array<{ name: string; desc: string; provider: string; model: string }> = [
      { name: 'Groq — Llama 3.1 8B', desc: '云端推理，速度极快', provider: 'groq', model: 'llama-3.1-8b-instant' },
      { name: 'OpenRouter — Auto', desc: '云端自动选择最佳模型', provider: 'openrouter', model: 'openrouter/auto' },
    ];

    // Try fetching Ollama models
    if (this.settings.ollamaUrl) {
      const ollamaModels = await fetchOllamaModels(this.settings.ollamaUrl);
      for (const m of ollamaModels) {
        models.unshift({ name: `Ollama — ${m}`, desc: '本地运行，无需 API 密钥', provider: 'ollama', model: m });
      }
      if (ollamaModels.length === 0) {
        models.unshift({ name: `Ollama — ${this.settings.ollamaModel}`, desc: '本地 (未检测到可用模型)', provider: 'ollama', model: this.settings.ollamaModel });
      }
    }

    this.modelDropdownEl.innerHTML = models.map(m => `
      <div class="agent-model-option ${m.provider === this.settings.provider && m.model === this.getActiveModel() ? 'selected' : ''}"
           data-provider="${m.provider}" data-model="${m.model}">
        <div class="agent-model-option-name">${m.name}</div>
        <div class="agent-model-option-desc">${m.desc}</div>
      </div>
    `).join('');

    this.modelDropdownEl.querySelectorAll('.agent-model-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const el = opt as HTMLElement;
        this.settings.provider = el.dataset.provider as AgentSettings['provider'];
        if (el.dataset.provider === 'ollama') {
          this.settings.ollamaModel = el.dataset.model!;
        }
        saveSettings(this.settings);
        document.getElementById('model-name')!.textContent = this.getModelDisplayName();
        this.closeModelDropdown();
      });
    });
  }

  private closeModelDropdown(): void {
    this.modelDropdownOpen = false;
    this.modelDropdownEl.classList.remove('open');
  }

  // ── Settings ──

  private openSettings(): void {
    this.settingsOverlayEl.classList.add('open');
  }

  private closeSettings(): void {
    this.settingsOverlayEl.classList.remove('open');
  }

  private toggleSettingsFields(): void {
    const provider = (document.getElementById('set-provider') as HTMLSelectElement)?.value || this.settings.provider;
    const toggle = (id: string, show: boolean) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('agent-hidden', !show);
    };
    toggle('set-ollama-group', provider === 'ollama');
    toggle('set-ollama-model-group', provider === 'ollama');
    toggle('set-groq-group', provider === 'groq');
    toggle('set-openrouter-group', provider === 'openrouter');
  }

  private saveSettingsFromUI(): void {
    this.settings.provider = (document.getElementById('set-provider') as HTMLSelectElement).value as AgentSettings['provider'];
    this.settings.ollamaUrl = (document.getElementById('set-ollama-url') as HTMLInputElement).value;
    this.settings.ollamaModel = (document.getElementById('set-ollama-model') as HTMLInputElement).value;
    this.settings.groqKey = (document.getElementById('set-groq-key') as HTMLInputElement).value;
    this.settings.openrouterKey = (document.getElementById('set-openrouter-key') as HTMLInputElement).value;
    this.settings.systemPrompt = (document.getElementById('set-system-prompt') as HTMLTextAreaElement).value;
    this.settings.temperature = parseFloat((document.getElementById('set-temperature') as HTMLInputElement).value);
    saveSettings(this.settings);
    document.getElementById('model-name')!.textContent = this.getModelDisplayName();
    this.closeSettings();
  }

  // ── Util ──

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private escapeAttr(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private setupCodeCopyButtons(): void {
    // Delegate click on code copy buttons
    document.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.agent-code-copy');
      if (!btn) return;
      const pre = btn.closest('pre');
      if (!pre) return;
      const code = pre.querySelector('code');
      if (!code) return;
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        btn.textContent = '✅ Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    });
  }
}
