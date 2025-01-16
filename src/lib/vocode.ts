import { VocodeClient } from 'vocode';

export const createVocodeClient = () => {
  const client = new VocodeClient({
    baseUrl: 'http://localhost:3000',
    audioConfig: {
      samplingRate: 16000,
    },
  });

  return client;
};

// Start a conversation with an agent
export const startConversation = async (
  client: VocodeClient,
  agentConfig: {
    name: string;
    prompt: string;
    llmModel: string;
    voice: {
      provider: string;
      voiceId: string;
    };
  }
) => {
  try {
    await client.start({
      transcriber: {
        type: 'browser',
      },
      agent: {
        type: 'llm',
        config: {
          prompt: agentConfig.prompt,
          model: agentConfig.llmModel,
        },
      },
      synthesizer: {
        type: 'browser',
        voice: agentConfig.voice.voiceId,
      },
    });
  } catch (error) {
    console.error('Failed to start conversation:', error);
    throw error;
  }
};

// Stop the current conversation
export const stopConversation = async (client: VocodeClient) => {
  try {
    await client.stop();
  } catch (error) {
    console.error('Failed to stop conversation:', error);
    throw error;
  }
};