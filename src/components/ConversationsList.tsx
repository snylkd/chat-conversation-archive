
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageSquarePlus } from 'lucide-react';
import type { Conversation } from './ChatContainer';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const ConversationsList = ({
  conversations,
  activeConversation,
  onSelect,
  onDelete,
  onCreate
}: ConversationsListProps) => {
  return (
    <div className="w-80 border-r border-gray-200 bg-gray-50">
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
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-4 border-b border-gray-200 cursor-pointer group ${
                activeConversation === conversation.id ? 'bg-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelect(conversation.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {conversation.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
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
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
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
