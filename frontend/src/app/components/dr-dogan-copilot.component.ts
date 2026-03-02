import { Component, inject, signal, effect, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { I18nService } from '../core/services/i18n.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ContextData {
  currentPage: string;
  userJourney: string[];
  interests: string[];
  companyInfo?: string;
}

@Component({
  selector: 'app-dr-dogan-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Copilot Button -->
    <div class="copilot-trigger"
         [class.hidden]="isOpen()"
         (click)="toggleCopilot()">
      <div class="copilot-avatar">
        <div class="avatar-fallback">
          <span class="text-2xl font-bold text-white">DD</span>
        </div>
      </div>
      <div class="copilot-badge">
        <span class="pulse-dot"></span>
        <span class="text-xs font-medium">{{ i18n.t('AI Advisor', 'مستشار ذكي') }}</span>
      </div>
    </div>

    <!-- Copilot Chat Window -->
    @if (isOpen()) {
      <div class="copilot-window" @slideIn>
        <!-- Header -->
        <div class="copilot-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <span class="text-white font-bold">DD</span>
            </div>
            <div>
              <h3 class="font-semibold text-white">Dr. Dogan</h3>
              <p class="text-xs text-sky-200">{{ i18n.t('ICT Engineering Advisor', 'مستشار هندسة تقنية المعلومات') }}</p>
            </div>
          </div>
          <button (click)="toggleCopilot()" class="text-white/80 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Context Awareness Bar -->
        <div class="context-bar">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-sky-300">📍</span>
            <span class="text-white/70">{{ getCurrentContext() }}</span>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="messages-container" #messagesContainer>
          @if (messages().length === 0) {
            <div class="welcome-message">
              <div class="text-center space-y-4">
                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                  <span class="text-3xl text-white font-bold">DD</span>
                </div>
                <h3 class="text-lg font-semibold text-th-text">{{ i18n.t('Hello! I\'m Dr. Dogan', 'مرحباً! أنا الدكتور دوغان') }}</h3>
                <p class="text-th-text-2 text-sm max-w-xs mx-auto">{{ i18n.t('Your personal ICT engineering advisor. I can help you understand our services, find solutions, and guide you through your digital transformation journey.', 'مستشارك الشخصي في هندسة تقنية المعلومات. يمكنني مساعدتك في فهم خدماتنا، وإيجاد الحلول، وإرشادك خلال رحلة التحول الرقمي.') }}</p>

                <!-- Suggested Actions -->
                <div class="space-y-2 mt-4">
                  <div class="text-xs font-semibold text-th-text-3 uppercase tracking-wider">
                    {{ i18n.t('I can help with:', 'يمكنني المساعدة في:') }}
                  </div>
                  @for (suggestion of suggestions; track suggestion.id) {
                    <button
                      (click)="sendMessage(suggestion.text.en)"
                      class="suggestion-chip">
                      <svg class="w-5 h-5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="suggestionIconPaths[suggestion.id]" /></svg>
                      <span>{{ i18n.t(suggestion.text.en, suggestion.text.ar) }}</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          }

          @for (message of messages(); track message.timestamp) {
            <div class="message" [class.user-message]="message.role === 'user'" [class.assistant-message]="message.role === 'assistant'">
              @if (message.role === 'assistant') {
                <div class="message-avatar">DD</div>
              }
              <div class="message-bubble">
                <div class="message-content" [innerHTML]="formatMessage(message.content)"></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>
          }

          @if (isTyping()) {
            <div class="message assistant-message">
              <div class="message-avatar">DD</div>
              <div class="message-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="input-container">
          <form (ngSubmit)="sendMessage(userInput)" class="flex gap-2">
            <input
              [(ngModel)]="userInput"
              name="userInput"
              [placeholder]="i18n.t('Ask me anything...', 'اسألني أي شيء...')"
              class="flex-1 px-4 py-2 bg-th-card border border-th-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              [disabled]="isTyping()"
            />
            <button
              type="submit"
              [disabled]="!userInput.trim() || isTyping()"
              class="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Floating Trigger Button */
    .copilot-trigger {
      position: fixed;
      bottom: 5.5rem;
      right: 2rem;
      z-index: 1000;
      cursor: pointer;
      animation: float 3s ease-in-out infinite;
    }

    @media (min-width: 640px) {
      .copilot-trigger {
        bottom: 2rem;
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .copilot-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
      overflow: hidden;
      position: relative;
      transition: transform 0.3s ease;
    }

    .copilot-trigger:hover .copilot-avatar {
      transform: scale(1.1);
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
    }

    .copilot-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--card-bg, #ffffff);
      border-radius: 20px;
      padding: 4px 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* Chat Window */
    .copilot-window {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 380px;
      height: 600px;
      background: var(--card-bg, #ffffff);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 1001;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    .copilot-header {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      padding: 1rem;
      border-radius: 20px 20px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .context-bar {
      background: linear-gradient(90deg, rgba(14, 165, 233, 0.1), rgba(16, 185, 129, 0.1));
      padding: 0.5rem 1rem;
      border-bottom: 1px solid rgba(14, 165, 233, 0.1);
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background: var(--bg-secondary, #fafafa);
    }

    .welcome-message {
      padding: 2rem 1rem;
    }

    .suggestion-chip {
      width: 100%;
      padding: 0.75rem;
      background: var(--card-bg, #ffffff);
      border: 1px solid var(--border-default, #e5e7eb);
      border-radius: 12px;
      text-align: left;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .suggestion-chip:hover {
      background: var(--bg-secondary, #f9fafb);
      border-color: #0ea5e9;
      transform: translateX(4px);
    }

    .message {
      margin-bottom: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .user-message {
      justify-content: flex-end;
    }

    .assistant-message {
      justify-content: flex-start;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.75rem;
    }

    .message-bubble {
      max-width: 70%;
      padding: 0.75rem 1rem;
      border-radius: 18px;
      position: relative;
    }

    .user-message .message-bubble {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
    }

    .assistant-message .message-bubble {
      background: var(--card-bg, #ffffff);
      border: 1px solid var(--border-default, #e5e7eb);
      color: var(--text-secondary, #374151);
    }

    .message-time {
      font-size: 0.625rem;
      opacity: 0.7;
      margin-top: 0.25rem;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 0.5rem 0;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: var(--text-muted, #94a3b8);
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    .input-container {
      padding: 1rem;
      border-top: 1px solid var(--border-default, #e5e7eb);
      background: var(--card-bg, #ffffff);
      border-radius: 0 0 20px 20px;
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
      .copilot-window {
        width: 100%;
        height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }

      .copilot-header {
        border-radius: 0;
      }

      .input-container {
        border-radius: 0;
      }
    }
  `]
})
export class DrDoganCopilotComponent implements OnInit, AfterViewInit {
  i18n = inject(I18nService);
  private http = inject(HttpClient);

  isOpen = signal(false);
  messages = signal<Message[]>([]);
  isTyping = signal(false);
  userInput = '';

  private context = signal<ContextData>({
    currentPage: 'landing',
    userJourney: [],
    interests: []
  });

  // API key is handled server-side only — never expose in frontend
  private readonly ORG_ID = '439d259f-2c8e-48f1-a670-bb94e13cb309';

  readonly suggestionIconPaths: Record<number, string> = {
    1: 'M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 6v-3h4v3',
    2: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    3: 'M12 3s-7 3-7 9c0 4.5 3.5 8 7 9 3.5-1 7-4.5 7-9 0-6-7-9-7-9Zm-1.5 10.5 3.5-3.5M9 12l1.5 1.5',
    4: 'M6.5 19h11a4.5 4.5 0 0 0 .44-8.97 5.5 5.5 0 0 0-10.38-1.74A3.5 3.5 0 0 0 6.5 19Z',
  };

  suggestions = [
    { id: 1, text: { en: 'Tell me about your services', ar: 'أخبرني عن خدماتكم' } },
    { id: 2, text: { en: 'Get a project estimate', ar: 'احصل على تقدير المشروع' } },
    { id: 3, text: { en: 'Security assessment needed', ar: 'أحتاج تقييم أمني' } },
    { id: 4, text: { en: 'Cloud migration options', ar: 'خيارات الترحيل السحابي' } }
  ];

  ngOnInit() {
    this.trackUserJourney();
    this.initializeContextAwareness();
  }

  ngAfterViewInit() {
    // Scroll to bottom when new messages arrive
    const container = document.querySelector('.messages-container');
    if (container) {
      effect(() => {
        this.messages();
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      });
    }
  }

  toggleCopilot() {
    this.isOpen.update(v => !v);

    // Send welcome message on first open
    if (this.isOpen() && this.messages().length === 0) {
      setTimeout(() => {
        this.addWelcomeMessage();
      }, 500);
    }
  }

  private addWelcomeMessage() {
    const context = this.context();
    const welcomeMessage = this.i18n.lang() === 'ar'
      ? `مرحباً! أنا الدكتور دوغان، مستشارك في هندسة تقنية المعلومات. كيف يمكنني مساعدتك اليوم؟`
      : `Hello! I'm Dr. Dogan, your ICT engineering advisor. I see you're exploring our ${context.currentPage} section. How can I assist you today?`;

    this.messages.update(msgs => [...msgs, {
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
  }

  async sendMessage(message: string) {
    if (!message.trim()) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    this.userInput = '';
    this.isTyping.set(true);

    // Update context with user interest
    this.updateContext(message);

    try {
      // Call Anthropic API via backend proxy
      const response = await this.callAnthropicAPI(message);

      // Add assistant response
      this.messages.update(msgs => [...msgs, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      // Fallback to local responses if API fails
      const fallbackResponse = this.generateLocalResponse(message);
      this.messages.update(msgs => [...msgs, {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }]);
    } finally {
      this.isTyping.set(false);
    }
  }

  private async callAnthropicAPI(message: string): Promise<string> {
    const context = this.context();
    const systemPrompt = `You are Dr. Dogan, an expert ICT engineering advisor for Dogan Consult.
    You help visitors understand ICT services, provide technical guidance, and qualify leads.
    Current context: User is on ${context.currentPage}, interested in: ${context.interests.join(', ')}.
    Company specializes in: Network & Data Center, Cybersecurity, Cloud & DevOps, Systems Integration.
    Be concise, professional, and helpful. Guide users toward requesting a consultation when appropriate.`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post<any>('/api/v1/ai/copilot', {
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.messages().map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ],
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        temperature: 0.7
      }, { headers }).toPromise();

      return response.content || this.generateLocalResponse(message);
    } catch (error) {
      console.error('API Error:', error);
      return this.generateLocalResponse(message);
    }
  }

  private generateLocalResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return `We offer comprehensive ICT engineering services:

🔧 **Network & Data Center** - Design, build, and optimize enterprise networks
🔒 **Cybersecurity** - Complete security architecture and compliance
☁️ **Cloud & DevOps** - Migration, automation, and CI/CD pipelines
🔌 **Systems Integration** - Connect and streamline your IT ecosystem

Would you like to discuss a specific area or schedule a consultation?`;
    }

    if (lowerMessage.includes('estimate') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return `For accurate project estimates, I need to understand your requirements:

• Current infrastructure size
• Specific services needed
• Timeline expectations
• Compliance requirements

Would you like to schedule a free assessment call? We typically provide detailed proposals within 48 hours.`;
    }

    if (lowerMessage.includes('security') || lowerMessage.includes('cyber')) {
      return `Our cybersecurity services include:

• Security architecture design
• Vulnerability assessments
• SOC implementation
• Compliance (NCA-ECC, ISO 27001)
• Incident response planning

We follow NIST and CIS frameworks. What security challenges are you facing?`;
    }

    if (lowerMessage.includes('cloud') || lowerMessage.includes('migration')) {
      return `We specialize in cloud transformation:

• Multi-cloud strategy (Azure, AWS, Private)
• Migration planning and execution
• Cloud-native application development
• Cost optimization
• Disaster recovery

What's your current infrastructure, and what are your cloud goals?`;
    }

    // Default response
    return `I understand you're interested in "${message}". Let me connect you with our solutions team who can provide detailed information.

Would you prefer to:
📞 Schedule a call
📧 Receive detailed information via email
📄 Download our capability statement`;
  }

  private trackUserJourney() {
    // Track page navigation
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      this.context.update(ctx => ({
        ...ctx,
        currentPage: this.identifyPage(path),
        userJourney: [...ctx.userJourney, path].slice(-10) // Keep last 10 pages
      }));
    }
  }

  private identifyPage(path: string): string {
    if (path.includes('service')) return 'services';
    if (path.includes('case')) return 'case studies';
    if (path.includes('contact')) return 'contact';
    if (path.includes('about')) return 'about';
    return 'landing';
  }

  private initializeContextAwareness() {
    // Track scroll position and time on page
    if (typeof window !== 'undefined') {
      let scrollTimeout: any;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercentage > 75 && !this.isOpen()) {
            // User has scrolled 75% - might need help
            this.showProactiveHelp();
          }
        }, 1000);
      });
    }
  }

  private showProactiveHelp() {
    // Animate the copilot button to draw attention
    const trigger = document.querySelector('.copilot-trigger');
    if (trigger) {
      trigger.classList.add('animate-bounce');
      setTimeout(() => {
        trigger.classList.remove('animate-bounce');
      }, 3000);
    }
  }

  private updateContext(message: string) {
    const interests: string[] = [];
    if (message.includes('network')) interests.push('network');
    if (message.includes('security')) interests.push('security');
    if (message.includes('cloud')) interests.push('cloud');
    if (message.includes('integration')) interests.push('integration');

    this.context.update(ctx => ({
      ...ctx,
      interests: [...new Set([...ctx.interests, ...interests])]
    }));
  }

  getCurrentContext(): string {
    const ctx = this.context();
    return this.i18n.t(
      `Viewing: ${ctx.currentPage} • Interests: ${ctx.interests.join(', ') || 'exploring'}`,
      `تصفح: ${ctx.currentPage} • الاهتمامات: ${ctx.interests.join(', ') || 'استكشاف'}`
    );
  }

  formatMessage(content: string): string {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }
}