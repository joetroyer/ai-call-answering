import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { Agent } from '../types/agent';

export function AgentsPage() {
  const navigate = useNavigate();
  const agents: Agent[] = [];

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <button
          onClick={() => navigate('/create-agent')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Agent
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Plus className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No agents created yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first agent
            </p>
            <button
              onClick={() => navigate('/create-agent')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Agent
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-500">{agent.llmModel}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}