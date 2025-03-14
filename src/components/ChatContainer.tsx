
import React from 'react';
import MessageSection from './MessageSection';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConversations } from '@/hooks/useConversations';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatContainer = () => {
  const { getActiveConversationData, addMessage } = useConversations();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const activeConversation = getActiveConversationData();
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4 transition-colors duration-200 overflow-hidden"
    >
      <div className="flex w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
        {/* Dark mode toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        
        {/* Main chat content taking full width */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <div className="flex-1 flex">
              <MessageSection
                conversation={activeConversation}
                onSendMessage={(content, attachment) => addMessage(activeConversation.id, content, 'user', attachment)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Création d'une nouvelle conversation...
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContainer;
