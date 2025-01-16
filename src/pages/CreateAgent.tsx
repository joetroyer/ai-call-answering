import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  ChevronRight,
  ChevronDown,
  Mic,
  MessageSquare,
  Volume2,
  Edit2,
  Trash2,
  Plus,
  PenTool,
  FileText,
  Shield,
  Webhook,
  Brain,
} from 'lucide-react';
import { LLMModel, SpeechSetting, WelcomeMessageType, Voice, TestTemplate } from '../types/agent';
import { useWorkspaceStore } from '../lib/store';
import { VoiceTest } from '../components/agent/VoiceTest';

export function CreateAgentPage() {
  const navigate = useNavigate();
  const [isTestingAudio, setIsTestingAudio] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useWorkspaceStore();
  
  // Form state
  const [name, setName] = useState('');
  const [selectedModel, setSelectedModel] = useState<LLMModel>('gpt-4');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [language, setLanguage] = useState('English');
  const [prompt, setPrompt] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessageType>('silent');
  const [customWelcomeMessage, setCustomWelcomeMessage] = useState('');
  const [speechSetting, setSpeechSetting] = useState<SpeechSetting>('none');
  const [templateText, setTemplateText] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<TestTemplate | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [functions, setFunctions] = useState<string[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);

  const models: LLMModel[] = [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
    'claude-3-opus',
    'claude-3-sonnet',
  ];

  const voices: Voice[] = [
    { provider: 'elevenlabs', id: 'adam', name: 'Adam', trait: 'Professional', sampleUrl: '' },
    { provider: 'elevenlabs', id: 'bella', name: 'Bella', trait: 'Friendly', sampleUrl: '' },
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];

  const welcomeMessageTypes = [
    { type: 'silent', label: 'User Initiates: AI remains silent until users speak first' },
    { type: 'dynamic', label: 'AI begins with a dynamic begin message' },
    { type: 'custom', label: 'AI begins with your defined begin message' },
  ];

  const speechSettings: SpeechSetting[] = [
    'none',
    'coffee-shop',
    'convention-hall',
    'summer-outdoor',
    'mountain-outdoor',
    'static-noise',
    'call-center',
  ];

  const handlePanelClick = (panel: string) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleTemplateSelect = (template: TestTemplate) => {
    setMessageInput(template.messages[0].content);
    setActivePanel(null);
  };

  const handleTemplateEdit = (template: TestTemplate) => {
    setEditingTemplate(template);
    setTemplateText(template.messages[0].content);
  };

  const handleTemplateDelete = (id: string) => {
    deleteTemplate(id);
  };

  const handleTemplateCreate = () => {
    if (!templateText) return;

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        ...editingTemplate,
        messages: [{ role: 'user', content: templateText }],
      });
      setEditingTemplate(null);
    } else {
      addTemplate({
        name: templateText.slice(0, 50),
        messages: [{ role: 'user', content: templateText }],
      });
    }
    setTemplateText('');
    setActivePanel(null);
  };

  // Get current agent configuration for testing
  const getCurrentAgentConfig = () => ({
    name: name || 'Test Agent',
    prompt: prompt || 'You are a helpful AI assistant.',
    llmModel: selectedModel,
    voice: selectedVoice || {
      provider: 'elevenlabs',
      voiceId: 'adam',
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Panel */}
      <div className="w-[500px] min-w-[500px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="px-6 py-4">
          <div className="mb-6">
            <button
              onClick={() => navigate('/agents')}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Agents
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent Name"
              className="text-xl font-semibold text-gray-900 w-full border-none focus:ring-0 p-0 mb-2"
            />
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>Agent ID: agent_383</span>
              <span className="mx-2">•</span>
              <span>$0.12/min</span>
              <span className="mx-2">•</span>
              <span>Estimated Latency: 1100-1250ms</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Model Selection */}
            <div className="relative">
              <button
                onClick={() => handlePanelClick('model')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span>{selectedModel}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'model' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'model' && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                  {models.map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setActivePanel(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Selection */}
            <div className="relative">
              <button
                onClick={() => handlePanelClick('voice')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                  <span>{selectedVoice?.name || 'Select Voice'}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'voice' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'voice' && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                  {voices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => {
                        setSelectedVoice(voice);
                        setActivePanel(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-sm text-gray-500">{voice.trait}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selection */}
            <div className="relative">
              <button
                onClick={() => handlePanelClick('language')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>{language}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'language' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'language' && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setActivePanel(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type in a universal prompt for your agent, such as its role, conversational style, objective, etc."
                className="w-full h-[200px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Welcome Message */}
            <div className="relative">
              <button
                onClick={() => handlePanelClick('welcome')}
                className="w-full px-4 py-3 flex items-center justify-between text-left border rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">
                  {welcomeMessageTypes.find((w) => w.type === welcomeMessage)?.label}
                </span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'welcome' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'welcome' && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                  {welcomeMessageTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => {
                        setWelcomeMessage(type.type as WelcomeMessageType);
                        setActivePanel(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {welcomeMessage === 'custom' && (
              <div>
                <textarea
                  value={customWelcomeMessage}
                  onChange={(e) => setCustomWelcomeMessage(e.target.value)}
                  placeholder="Enter your custom welcome message"
                  className="w-full h-[100px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Functions & Settings Panel */}
      <div className="w-[400px] min-w-[400px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Functions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => handlePanelClick('functions')}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <PenTool className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Functions</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'functions' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'functions' && (
                <div className="p-4 border-t">
                  <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                    + Add Function
                  </button>
                </div>
              )}
            </div>

            {/* Knowledge Base */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => handlePanelClick('knowledge')}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Knowledge Base</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'knowledge' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'knowledge' && (
                <div className="p-4 border-t">
                  <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                    + Add Knowledge Base
                  </button>
                </div>
              )}
            </div>

            {/* Speech Settings */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => handlePanelClick('speech')}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <Volume2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Speech Settings</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${activePanel === 'speech' ? 'rotate-180' : ''}`} />
              </button>
              {activePanel === 'speech' && (
                <div className="p-4 border-t">
                  <div className="space-y-3">
                    {speechSettings.map((setting) => (
                      <label key={setting} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={speechSetting === setting}
                          onChange={() => setSpeechSetting(setting)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">{setting.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Testing Panel */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsTestingAudio(true)}
                  className={`p-2 rounded-md ${
                    isTestingAudio
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsTestingAudio(false)}
                  className={`p-2 rounded-md ${
                    !isTestingAudio
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePanelClick('templates')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Insert Template
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            {isTestingAudio ? (
              <VoiceTest agent={getCurrentAgentConfig()} />
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-4 bg-gray-50 rounded-lg p-4">
                  {/* Chat messages will go here */}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Templates Popup */}
          {activePanel === 'templates' && (
            <div
              className="absolute right-0 top-16 w-96 bg-white border rounded-lg shadow-lg p-4"
              data-template-popup
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Test Templates</h3>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {templates.length > 0 ? (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="flex-1 text-left"
                      >
                        {template.name}
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTemplateEdit(template)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTemplateDelete(template.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No templates yet</p>
              )}

              <div className="mt-4">
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  placeholder="Type your template message..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleTemplateCreate}
                  className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingTemplate ? 'Save Template' : 'Create Template'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}