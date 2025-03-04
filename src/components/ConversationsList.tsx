
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageSquarePlus, Edit2, Check, X } from 'lucide-react';
import type { Conversation } from './ChatContainer';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

const ConversationsList = ({
  conversations,
  activeConversation,
  onSelect,
  onDelete,
  onCreate,
  onUpdateTitle
}: ConversationsListProps) => {
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const startEditing = (id: string, currentTitle: string) => {
    setEditingConversation(id);
    setEditTitle(currentTitle);
  };

  const saveTitle = (id: string) => {
    if (editTitle.trim()) {
      onUpdateTitle(id, editTitle);
    }
    setEditingConversation(null);
  };

  const cancelEditing = () => {
    setEditingConversation(null);
  };

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-3 px-4 hover:bg-primary/90 transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>Nouvelle conversation</span>
        </motion.button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        <AnimatePresence>
          {conversations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500 dark:text-gray-400"
            >
              Aucune conversation. Créez-en une nouvelle!
            </motion.div>
          )}
          
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer group ${
                activeConversation === conversation.id 
                ? 'bg-white dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors duration-150`}
              onClick={() => editingConversation !== conversation.id && onSelect(conversation.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {editingConversation === conversation.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-1 text-sm border rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          saveTitle(conversation.id);
                        }}
                        className="text-green-500 hover:text-green-600 dark:text-green-400"
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                        className="text-red-500 hover:text-red-600 dark:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                      {conversation.title}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conversation.id, conversation.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-opacity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </h3>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {new Date(conversation.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConversationsList;
