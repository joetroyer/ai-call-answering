// Add new type for test templates
export interface TestTemplate {
  id: string;
  name: string;
  messages: TestMessage[];
}

export interface TestMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Add to existing Agent interface
export interface Agent {
  id: string;
  name: string;
  llmModel: LLMModel;
  voice: Voice;
  welcomeMessage: WelcomeMessageType;
  customWelcomeMessage?: string;
  prompt: string;
  speechSettings: SpeechSetting;
  functions: AgentFunction[];
  postCallAnalysis: PostCallField[];
  testTemplates: TestTemplate[];
  webhooks: {
    inbound?: string;
    agent?: string;
  };
}