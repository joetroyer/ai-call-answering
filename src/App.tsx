import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { AgentsPage } from './pages/Agents';
import { CreateAgentPage } from './pages/CreateAgent';
import { KnowledgeBasePage } from './pages/KnowledgeBase';
import { PhoneNumbersPage } from './pages/PhoneNumbers';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /agents */}
        <Route path="/" element={<Navigate to="/agents" replace />} />
        
        <Route
          path="/create-agent"
          element={<CreateAgentPage />}
        />
        <Route
          path="*"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-gray-100">
                <Routes>
                  <Route path="/agents" element={<AgentsPage />} />
                  <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                  <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
                  {/* Catch all route - redirect to /agents */}
                  <Route path="*" element={<Navigate to="/agents" replace />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}