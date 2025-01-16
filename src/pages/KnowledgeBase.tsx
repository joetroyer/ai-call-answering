import React, { useState } from 'react';
import { ChevronRight, FileText, FolderIcon, Plus, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useWorkspaceStore } from '../lib/store';
import { CollectionModal } from '../components/knowledge/CollectionModal';
import { UploadModal } from '../components/knowledge/UploadModal';
import { DocumentPreview } from '../components/knowledge/DocumentPreview';

interface Collection {
  id: string;
  name: string;
  description: string;
  documentsCount: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  updated: string;
  collection_id: string;
  url?: string;
  content?: string;
}

export function KnowledgeBasePage() {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([
    { id: '1', name: 'Item Lookups', description: 'All item lookup related files', documentsCount: 3 },
    { id: '2', name: 'Orders', description: 'Order related documents', documentsCount: 2 },
    { id: '3', name: 'Inventory', description: 'Inventory documents', documentsCount: 1 },
  ]);
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: '1', 
      name: 'Item_lookup_1.xlsx', 
      type: 'xlsx', 
      updated: '05/10/2024 22:40', 
      collection_id: '1',
      url: 'https://example.com/files/item_lookup_1.xlsx',
      content: 'Sample content for Item Lookup 1'
    },
    { 
      id: '2', 
      name: 'Item_lookup.xlsx', 
      type: 'xlsx', 
      updated: '05/10/2024', 
      collection_id: '1',
      url: 'https://example.com/files/item_lookup.xlsx',
      content: 'Sample content for Item Lookup'
    },
    { 
      id: '3', 
      name: 'Order_Confirmation.pdf', 
      type: 'pdf', 
      updated: '05/10/2024', 
      collection_id: '2',
      url: 'https://example.com/files/order_confirmation.pdf'
    },
    { 
      id: '4', 
      name: 'Item_inventory.xlsx', 
      type: 'xlsx', 
      updated: '05/10/2024', 
      collection_id: '3',
      url: 'https://example.com/files/item_inventory.xlsx',
      content: 'Sample content for Item Inventory'
    },
  ]);

  const filteredDocuments = documents.filter(
    doc => selectedCollection && doc.collection_id === selectedCollection.id
  );

  const handleCreateCollection = (name: string, description: string) => {
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name,
      description,
      documentsCount: 0,
    };
    setCollections([...collections, newCollection]);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsCollectionModalOpen(true);
  };

  const handleDeleteCollection = (collectionId: string) => {
    // Delete all documents in the collection first
    const updatedDocuments = documents.filter(doc => doc.collection_id !== collectionId);
    setDocuments(updatedDocuments);

    // Then delete the collection
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    setCollections(updatedCollections);
    
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null);
    }
  };

  const handleUpdateCollection = (name: string, description: string) => {
    if (!editingCollection) return;
    
    const updatedCollections = collections.map(c => 
      c.id === editingCollection.id 
        ? { ...c, name, description }
        : c
    );
    setCollections(updatedCollections);
    
    if (selectedCollection?.id === editingCollection.id) {
      setSelectedCollection({ ...editingCollection, name, description });
    }
  };

  const handleUploadFiles = (files: File[]) => {
    if (!selectedCollection) return;

    const newDocuments = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.name.split('.').pop() || 'unknown',
      updated: new Date().toLocaleString(),
      collection_id: selectedCollection.id,
      url: URL.createObjectURL(file),
      content: file.type.startsWith('text/') ? 'Text content will be loaded here' : undefined
    }));

    setDocuments([...documents, ...newDocuments]);
    
    // Update document count for the collection
    const updatedCollections = collections.map(c =>
      c.id === selectedCollection.id
        ? { ...c, documentsCount: c.documentsCount + files.length }
        : c
    );
    setCollections(updatedCollections);
  };

  const handleDeleteDocument = (documentId: string) => {
    const documentToDelete = documents.find(d => d.id === documentId);
    if (!documentToDelete) return;

    // Remove the document
    const updatedDocuments = documents.filter(d => d.id !== documentId);
    setDocuments(updatedDocuments);

    // Update the collection's document count
    const updatedCollections = collections.map(c =>
      c.id === documentToDelete.collection_id
        ? { ...c, documentsCount: c.documentsCount - 1 }
        : c
    );
    setCollections(updatedCollections);

    // If the deleted document was being previewed, close the preview
    if (selectedDoc?.id === documentId) {
      setSelectedDoc(null);
      setIsPreviewModalOpen(false);
    }
  };

  const handlePreviewDocument = (document: Document) => {
    setSelectedDoc(document);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="flex h-full">
      {/* Collections Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium">Collections</h2>
          <button 
            onClick={() => {
              setEditingCollection(null);
              setIsCollectionModalOpen(true);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-57px)]">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`group relative px-4 py-2 hover:bg-gray-50 ${
                selectedCollection?.id === collection.id ? 'bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => setSelectedCollection(collection)}
                className="w-full flex items-center text-sm"
              >
                <FolderIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{collection.name}</span>
                <span className="ml-2 text-xs text-gray-400">
                  ({collection.documentsCount})
                </span>
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCollection(collection);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-medium">
            {selectedCollection ? selectedCollection.name : 'Select a Collection'}
          </h2>
          {selectedCollection && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Upload Files
            </button>
          )}
        </div>

        {selectedCollection ? (
          <div className="flex-1 overflow-y-auto p-6">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
                  >
                    <button
                      onClick={() => handlePreviewDocument(doc)}
                      className="flex items-center flex-1"
                    >
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          • {doc.type.toUpperCase()} • {doc.updated}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      className="hidden group-hover:block p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No documents</h3>
                <p className="text-sm text-gray-500">
                  Upload documents to this collection
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No collection selected</h3>
              <p className="text-sm text-gray-500">Select a collection to view its documents</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setEditingCollection(null);
        }}
        onSubmit={editingCollection ? handleUpdateCollection : handleCreateCollection}
        editingCollection={editingCollection}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
        collectionId={selectedCollection?.id || null}
      />

      {selectedDoc && (
        <DocumentPreview
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedDoc(null);
          }}
          document={selectedDoc}
        />
      )}
    </div>
  );
}