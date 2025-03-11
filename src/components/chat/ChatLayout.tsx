
import React from 'react';
import { motion } from 'framer-motion';
import ConversationsList from '../ConversationsList';
import MessageSection from '../MessageSection';
import ThemeToggle from './ThemeToggle';
import MobileMenuButton from './MobileMenuButton';
import EmptyState from './EmptyState';
import type { Conversation } from '../../types/chat';

interface ChatLayoutProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onCreateConversation: () => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onSendMessage: (conversationId: string, content: string, type: 'user', attachment?: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onDeleteConversation,
  onCreateConversation,
  onUpdateTitle,
  onSendMessage,
  isDarkMode,
  toggleDarkMode,
  sidebarOpen,
  toggleSidebar
}) => {
  const activeConversationData = activeConversation 
    ? conversations.find(c => c.id === activeConversation) 
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4 transition-colors duration-200 overflow-hidden"
    >
      <div className="flex w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
        <MobileMenuButton isOpen={sidebarOpen} toggle={toggleSidebar} />

        {/* Sidebar with conditional classes for mobile */}
        <div 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } absolute md:relative inset-y-0 left-0 z-10 md:translate-x-0 transition-transform duration-300 ease-in-out w-full max-w-[85vw] md:max-w-[280px] md:w-80`}
        >
          <ConversationsList
            conversations={conversations}
            activeConversation={activeConversation}
            onSelect={onSelectConversation}
            onDelete={onDeleteConversation}
            onCreate={onCreateConversation}
            onUpdateTitle={onUpdateTitle}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col relative">
          <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          
          {activeConversationData ? (
            <div className={`flex-1 flex ${!sidebarOpen ? 'md:pl-0' : 'md:pl-0'}`}>
              <MessageSection
                conversation={activeConversationData}
                onSendMessage={(content, attachment) => 
                  onSendMessage(activeConversationData.id, content, 'user', attachment)}
              />
            </div>
          ) : (
            <EmptyState onCreate={onCreateConversation} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatLayout;
