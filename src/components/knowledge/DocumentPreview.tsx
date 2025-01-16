import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'text';
  status: 'processing' | 'ready' | 'error';
  url?: string;
  content?: string;
  collection_id: string;
  created_at: string;
}

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

export function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {document.name}
              </h3>
              <div className="flex items-center space-x-2">
                {document.url && (
                  <>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => window.open(document.url, '_blank')}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = document.url!;
                        link.download = document.name;
                        link.click();
                      }}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button
                  className="p-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 h-[600px] overflow-y-auto">
              {document.type === 'pdf' && document.url ? (
                <iframe
                  src={document.url}
                  className="w-full h-full"
                  title={document.name}
                />
              ) : (
                <div className="prose max-w-none">
                  {document.content || 'No preview available'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}