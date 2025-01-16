import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { useVocode } from '../../hooks/useVocode';

interface VoiceTestProps {
  agent: {
    name: string;
    prompt: string;
    llmModel: string;
    voice: {
      provider: string;
      voiceId: string;
    };
  };
}

export function VoiceTest({ agent }: VoiceTestProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { isConnected, error, startAgent, stopAgent } = useVocode();

  const handleStart = async () => {
    try {
      await startAgent(agent);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start voice test:', err);
    }
  };

  const handleStop = async () => {
    try {
      await stopAgent();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop voice test:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-4">
        {error ? (
          <div className="text-red-500 mb-4">
            Error: {error.message}
          </div>
        ) : (
          <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
            isConnected ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Mic className={`h-8 w-8 ${
              isConnected ? 'text-green-500' : 'text-gray-400'
            }`} />
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Test your agent
      </h3>
      
      {!isRecording ? (
        <button
          onClick={handleStart}
          disabled={!isConnected}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          Start Test
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </button>
      )}
    </div>
  );
}