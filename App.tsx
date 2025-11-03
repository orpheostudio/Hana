import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { QuickActions } from "./components/QuickActions";
import { ChatInput } from "./components/ChatInput";
import { AccessibilityPanel, AccessibilitySettings } from "./components/AccessibilityPanel";
import { LLMConfigPanel } from "./components/LLMConfigPanel";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { getBotResponse } from "./components/ChatbotResponses";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Sparkles, HelpCircle, Sun, Moon, Accessibility, Volume2, VolumeX, Brain, Star } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('sena-welcome-accepted');
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Olá! Eu sou a Sena, sua assistente digital kawaii! ✨💜

Estou aqui para ajudar você com tecnologia de forma simples, paciente e super fofa!

**Sou especialista em ajudar:**
• Pessoas com 60+ anos 👵🏻
• Pessoas com dificuldades visuais ou motoras ♿
• Quem está começando com tecnologia 🌱

**Posso te ensinar sobre:**
📱 Como usar o celular
💬 WhatsApp e mensagens
📧 E-mail
📸 Tirar e enviar fotos
🏦 Banco digital e PIX
🛒 Compras online seguras
⚙️ Configurações do celular

**🎤 NOVIDADE:** Agora você pode me ouvir e falar comigo!
• Clique no ícone de microfone para falar 🎙️
• Clique em "Ouvir" em qualquer mensagem 🔊
• Configure a acessibilidade no botão de configurações ⚙️

Escolha uma opção abaixo ou me conte sua dúvida! 💖✨`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showLLMConfigPanel, setShowLLMConfigPanel] = useState(false);
  const [speakFunction, setSpeakFunction] = useState<((text: string) => void) | null>(null);
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    ttsEnabled: false,
    autoReadMessages: false,
    reducedMotion: false,
    largeClickTargets: false,
    speechSpeed: 1.0,
    speechVolume: 0.7,
    keyboardNavigation: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!settings.reducedMotion) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      messagesEndRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, settings.reducedMotion]);

  // Aplicar configurações de acessibilidade
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
    
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }

    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc para limpar campo de texto ou fechar painéis
      if (e.key === 'Escape') {
        if (showAccessibilityPanel) {
          setShowAccessibilityPanel(false);
        }
      }
      
      // Ctrl/Cmd + Enter para nova conversa
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        clearChat();
      }

      // F1 para acessibilidade
      if (e.key === 'F1') {
        e.preventDefault();
        setShowAccessibilityPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAccessibilityPanel]);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Auto-ler mensagens do bot se habilitado
    if (isBot && settings.autoReadMessages && speakFunction) {
      setTimeout(() => {
        speakFunction(text);
      }, 500);
    }
  };

  const handleSendMessage = async (text: string) => {
    // Adiciona mensagem do usuário
    addMessage(text, false);
    
    // Simula o bot "digitando"
    setIsTyping(true);
    
    // Anunciar que está processando
    if (speakFunction && settings.ttsEnabled) {
      speakFunction("Entendi! Deixe-me pensar na melhor resposta para você.");
    }
    
    try {
      // Usar sistema NLP/LLM para resposta inteligente
      const response = await getBotResponse("", text);
      addMessage(response, true);
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      addMessage("Desculpe, tive um problema técnico. Pode repetir sua pergunta? 🥺", true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsTyping(true);
    
    // Anunciar ação selecionada
    if (speakFunction && settings.ttsEnabled) {
      const actionLabels: { [key: string]: string } = {
        'celular-basico': 'Vou te ensinar como usar o celular',
        'wifi': 'Vou explicar como conectar no WiFi',
        'whatsapp': 'Vou te ajudar com o WhatsApp',
        'email': 'Vou te ensinar sobre e-mail',
        'camera': 'Vou explicar como usar a câmera',
        'ligacao': 'Vou te ensinar a fazer ligações',
        'compras': 'Vou explicar sobre compras online',
        'banco': 'Vou te ajudar com banco digital',
        'configuracoes': 'Vou explicar as configurações',
        'outros': 'Vou te ajudar com outras dúvidas'
      };
      speakFunction(actionLabels[action] || 'Preparando sua resposta...');
    }
    
    try {
      // Usar sistema NLP/LLM para resposta inteligente
      const response = await getBotResponse(action);
      addMessage(response, true);
    } catch (error) {
      console.error('Erro ao obter resposta da ação:', error);
      addMessage("Desculpe, tive um problema ao processar esta opção. Tente novamente. 💫", true);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: `Olá! Eu sou a Sena, sua assistente digital kawaii! ✨💜

Estou aqui para ajudar você com tecnologia de forma simples e paciente.

O que você gostaria de aprender hoje? 🌸`,
        isBot: true,
        timestamp: new Date()
      }
    ]);

    if (speakFunction && settings.ttsEnabled) {
      speakFunction("Nova conversa iniciada! Como posso ajudar você hoje?");
    }
  };

  const handleWelcomeAccept = () => {
    localStorage.setItem('sena-welcome-accepted', 'true');
    setShowWelcome(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
    
    if (speakFunction && settings.ttsEnabled) {
      speakFunction(isDarkMode ? "Modo claro ativado" : "Modo escuro ativado");
    }
  };

  const toggleTTS = () => {
    const newTTSState = !settings.ttsEnabled;
    setSettings(prev => ({ ...prev, ttsEnabled: newTTSState }));
    
    if (speakFunction) {
      speakFunction(newTTSState ? "Leitura de voz ativada" : "Leitura de voz desativada");
    }
  };

  const handleSpeakText = useCallback((speakFunc: (text: string) => void) => {
    setSpeakFunction(() => speakFunc);
  }, []);

  const handleSpeakMessage = useCallback((text: string) => {
    if (speakFunction) {
      speakFunction(text);
    }
  }, [speakFunction]);

  if (showWelcome) {
    return <WelcomeScreen onAccept={handleWelcomeAccept} />;
  }

  return (
    <div className={`chat-container ${isDarkMode ? 'dark' : ''} ${
      settings.highContrast ? 'high-contrast' : ''
    } ${settings.keyboardNavigation ? 'keyboard-navigation' : ''} ${
      settings.largeClickTargets ? 'large-click-targets' : ''
    }`}>
      {/* Skip Link para acessibilidade */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50"
      >
        Pular para conteúdo principal
      </a>

      {/* Chat Header Kawaii */}
      <header className="chat-header">
        <div className="flex items-center gap-3">
          <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
            settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
          }`} style={{
            background: 'linear-gradient(135deg, #B894E8 0%, #FFB3C6 100%)',
            boxShadow: '0 4px 15px rgba(184, 148, 232, 0.3)'
          }}>
            <Sparkles className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="chat-header h1 gradient-text" style={{ fontSize: `${settings.fontSize + 4}px` }}>
              Sena ✨ Assistente Kawaii
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Tecnologia fofa e acessível para todos 💜🌸
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle TTS rápido */}
          <Button
            variant="outline"
            size={settings.largeClickTargets ? "default" : "sm"}
            onClick={toggleTTS}
            className={`${settings.largeClickTargets ? 'px-4 py-2' : 'p-2'} ${
              settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
            } rounded-2xl transition-all duration-300 hover:scale-105`}
            aria-label={settings.ttsEnabled ? "Desativar leitura automática" : "Ativar leitura automática"}
            title={settings.ttsEnabled ? "Desativar voz" : "Ativar voz"}
          >
            {settings.ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>

          <Button
            variant="outline"
            size={settings.largeClickTargets ? "default" : "sm"}
            onClick={toggleDarkMode}
            className={`${settings.largeClickTargets ? 'px-4 py-2' : 'p-2'} ${
              settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
            } rounded-2xl transition-all duration-300 hover:scale-105`}
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            title={isDarkMode ? "Modo claro" : "Modo escuro"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          <Button
            variant="outline"
            size={settings.largeClickTargets ? "default" : "sm"}
            onClick={() => setShowAccessibilityPanel(true)}
            className={`flex items-center gap-2 ${settings.largeClickTargets ? 'px-4 py-2' : ''} ${
              settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
            } rounded-2xl transition-all duration-300 hover:scale-105`}
            aria-label="Abrir configurações de acessibilidade"
            title="Acessibilidade (F1)"
          >
            <Accessibility size={16} />
            {settings.largeClickTargets && <span>Acessibilidade</span>}
          </Button>

          <Button
            variant="outline"
            size={settings.largeClickTargets ? "default" : "sm"}
            onClick={() => setShowLLMConfigPanel(true)}
            className={`flex items-center gap-2 ${settings.largeClickTargets ? 'px-4 py-2' : ''} ${
              settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
            } rounded-2xl transition-all duration-300 hover:scale-105`}
            aria-label="Configurar IA avançada"
            title="IA Avançada"
          >
            <Brain size={16} />
            {settings.largeClickTargets && <span>IA</span>}
          </Button>
          
          <Button
            variant="outline"
            size={settings.largeClickTargets ? "default" : "sm"}
            onClick={clearChat}
            className={`flex items-center gap-2 ${settings.largeClickTargets ? 'px-4 py-2' : ''} ${
              settings.highContrast ? 'border-2 border-gray-800 dark:border-white' : ''
            } rounded-2xl transition-all duration-300 hover:scale-105`}
            aria-label="Iniciar nova conversa"
            title="Nova conversa (Ctrl+Enter)"
          >
            <HelpCircle size={16} />
            {settings.largeClickTargets && <span>Nova conversa</span>}
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <main id="main-content" className="chat-messages" role="main" aria-label="Área de conversa com Sena">
        <div className="messages-container" role="log" aria-live="polite" aria-label="Conversa">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isBot ? 'message-bot' : 'message-user'} group`}>
              {message.isBot && (
                <div className="message-sender">
                  <div className="message-avatar bot">
                    <img 
                      src="https://i.imgur.com/Dc3f5ZQ.jpeg" 
                      alt="Sena"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span>Sena ✨</span>
                </div>
              )}
              
              {!message.isBot && (
                <div className="message-sender">
                  <Star className="h-4 w-4" aria-hidden="true" />
                  <span>Você</span>
                </div>
              )}
              
              <div className="message-content">
                <div className="message-text" style={{ fontSize: `${settings.fontSize}px` }}>
                  {message.text}
                </div>
                
                <div className="message-controls">
                  <ChatMessage
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                    onSpeakMessage={handleSpeakMessage}
                    settings={settings}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message message-bot group">
              <div className="message-sender">
                <div className="message-avatar bot">
                  <img 
                    src="https://i.imgur.com/Dc3f5ZQ.jpeg" 
                    alt="Sena"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span>Sena ✨</span>
              </div>
              
              <div className="message-content">
                <div className="typing-indicator">
                  <span style={{ fontSize: `${settings.fontSize}px` }}>
                    Sena está preparando sua resposta mágica...
                  </span>
                  {!settings.reducedMotion && (
                    <div className="typing-dots">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Actions - only show if no typing */}
        {!isTyping && messages.length === 1 && (
          <div className="messages-container">
            <QuickActions onActionClick={handleQuickAction} settings={settings} />
          </div>
        )}
      </main>

      {/* Chat Input */}
      <div className="chat-input">
        <div className="chat-input-container">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onSpeakText={handleSpeakText}
            disabled={isTyping} 
            settings={settings}
          />
        </div>
      </div>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* LLM Configuration Panel */}
      <LLMConfigPanel
        isOpen={showLLMConfigPanel}
        onClose={() => setShowLLMConfigPanel(false)}
      />
    </div>
  );
}
