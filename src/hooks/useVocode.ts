import { useState, useEffect, useCallback } from 'react';
import { VocodeClient } from 'vocode';
import { createVocodeClient, startConversation, stopConversation } from '../lib/vocode';

export const useVocode = () => {
  const [client, setClient] = useState<VocodeClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const vocodeClient = createVocodeClient();
        setClient(vocodeClient);
        setIsConnected(true);

        return () => {
          vocodeClient.stop();
        };
      } catch (err) {
        setError(err as Error);
      }
    };

    initClient();
  }, []);

  const startAgent = useCallback(async (agentConfig: {
    name: string;
    prompt: string;
    llmModel: string;
    voice: {
      provider: string;
      voiceId: string;
    };
  }) => {
    if (!client) throw new Error('Vocode client not initialized');
    
    try {
      await startConversation(client, agentConfig);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [client]);

  const stopAgent = useCallback(async () => {
    if (!client) return;
    
    try {
      await stopConversation(client);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [client]);

  return {
    client,
    isConnected,
    error,
    startAgent,
    stopAgent,
  };
};