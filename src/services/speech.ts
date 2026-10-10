/**
 * Web Speech API Service
 * Supports speech-to-text voice commands and text-to-speech audio feedback
 * Designed for users who find typing difficult or need hands-free emergency SOS
 */

export type VoiceCommandAction = 
  | { type: 'NAVIGATE'; tab: 'incident' | 'overview' | 'vault' | 'network' | 'compliance' | 'emergency' }
  | { type: 'TRIGGER_SOS' }
  | { type: 'DISARM_SOS' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'UNKNOWN'; transcript: string };

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private onTranscriptCallbacks: ((transcript: string, isFinal: boolean) => void)[] = [];
  private onCommandCallbacks: ((action: VoiceCommandAction, feedbackText: string) => void)[] = [];
  private onStatusCallbacks: ((listening: boolean, error?: string) => void)[] = [];

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.notifyStatus(true);
      };

      this.recognition.onend = () => {
        // If meant to keep listening, auto-restart
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            this.isListening = false;
            this.notifyStatus(false);
          }
        } else {
          this.notifyStatus(false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event notice:', event.error);
        if (event.error === 'not-allowed') {
          this.isListening = false;
          this.notifyStatus(false, 'Microphone permission denied.');
        }
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          this.notifyTranscript(currentText, Boolean(finalTranscript));
        }

        if (finalTranscript) {
          this.processCommand(finalTranscript.toLowerCase().trim());
        }
      };
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) return;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch {
      // Already running or starting
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.notifyStatus(false);
  }

  toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  getListeningState(): boolean {
    return this.isListening;
  }

  // Text-To-Speech audio feedback
  speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech failed gracefully
    }
  }

  // Process natural language voice commands
  private processCommand(text: string) {
    // 1. Emergency Commands
    if (
      text.includes('sos') || 
      text.includes('emergency') || 
      text.includes('help') || 
      text.includes('panic') || 
      text.includes('danger') ||
      text.includes('distress')
    ) {
      this.notifyCommand({ type: 'TRIGGER_SOS' }, 'Activating Emergency SOS distress beacon!');
      this.speak('Emergency SOS activated. Starting countdown.');
      return;
    }

    if (
      text.includes('stop siren') || 
      text.includes('silence') || 
      text.includes('disarm') || 
      text.includes('cancel emergency') ||
      text.includes('safe')
    ) {
      this.notifyCommand({ type: 'DISARM_SOS' }, 'Silencing SOS alarm and disarming beacon.');
      this.speak('Emergency alarm silenced. Beacon safe.');
      return;
    }

    // 2. Navigation Commands
    if (text.includes('incident') || text.includes('malware') || text.includes('report') || text.includes('gracing') || text.includes('virus')) {
      this.notifyCommand({ type: 'NAVIGATE', tab: 'incident' }, 'Opening Incident #87795 security report.');
      this.speak('Opening Incident #87795 report.');
      return;
    }

    if (text.includes('network') || text.includes('domain') || text.includes('dns') || text.includes('website')) {
      this.notifyCommand({ type: 'NAVIGATE', tab: 'network' }, 'Navigating to Network and Domains.');
      this.speak('Navigating to Network and Domains.');
      return;
    }

    if (text.includes('overview') || text.includes('dashboard') || text.includes('home') || text.includes('milestone')) {
      this.notifyCommand({ type: 'NAVIGATE', tab: 'overview' }, 'Navigating to Overview Dashboard.');
      this.speak('Navigating to Overview Dashboard.');
      return;
    }

    if (text.includes('compliance') || text.includes('legal') || text.includes('privacy') || text.includes('rules')) {
      this.notifyCommand({ type: 'NAVIGATE', tab: 'compliance' }, 'Navigating to Legal and Compliance.');
      this.speak('Navigating to Legal and Compliance.');
      return;
    }

    if (text.includes('vault') || text.includes('backup') || text.includes('cloud') || text.includes('storage')) {
      this.notifyCommand({ type: 'NAVIGATE', tab: 'vault' }, 'Navigating to Cryptographic Vault.');
      this.speak('Navigating to Vault.');
      return;
    }

    // 3. AI Assistant & Theme Commands
    if (text.includes('chat') || text.includes('ask ai') || text.includes('assistant') || text.includes('question') || text.includes('explain')) {
      this.notifyCommand({ type: 'OPEN_CHAT' }, 'Opening AI Explainer Assistant.');
      this.speak('Opening AI Assistant. How can I help?');
      return;
    }

    if (text.includes('close chat') || text.includes('close assistant')) {
      this.notifyCommand({ type: 'CLOSE_CHAT' }, 'Closing AI Assistant.');
      return;
    }

    if (text.includes('theme') || text.includes('dark mode') || text.includes('light mode')) {
      this.notifyCommand({ type: 'TOGGLE_THEME' }, 'Toggling interface theme.');
      this.speak('Switching theme.');
      return;
    }

    // Default: Unknown command
    this.notifyCommand({ type: 'UNKNOWN', transcript: text }, `Command not recognized: "${text}"`);
  }

  // Subscription helpers
  onTranscript(fn: (transcript: string, isFinal: boolean) => void) {
    this.onTranscriptCallbacks.push(fn);
    return () => {
      this.onTranscriptCallbacks = this.onTranscriptCallbacks.filter((c) => c !== fn);
    };
  }

  onCommand(fn: (action: VoiceCommandAction, feedbackText: string) => void) {
    this.onCommandCallbacks.push(fn);
    return () => {
      this.onCommandCallbacks = this.onCommandCallbacks.filter((c) => c !== fn);
    };
  }

  onStatus(fn: (listening: boolean, error?: string) => void) {
    this.onStatusCallbacks.push(fn);
    return () => {
      this.onStatusCallbacks = this.onStatusCallbacks.filter((c) => c !== fn);
    };
  }

  private notifyTranscript(text: string, isFinal: boolean) {
    this.onTranscriptCallbacks.forEach((fn) => fn(text, isFinal));
  }

  private notifyCommand(action: VoiceCommandAction, feedback: string) {
    this.onCommandCallbacks.forEach((fn) => fn(action, feedback));
  }

  private notifyStatus(listening: boolean, error?: string) {
    this.onStatusCallbacks.forEach((fn) => fn(listening, error));
  }
}

export const speechService = new SpeechService();
