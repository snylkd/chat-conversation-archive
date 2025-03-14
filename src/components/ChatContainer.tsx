
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConversations } from '@/hooks/use-conversations';
import ChatLayout from './chat/ChatLayout';
import type { FileAttachment } from '../types/chat';

const ChatContainer = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const isMobile = useIsMobile();
  
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage
  } = useConversations();

  // Créer automatiquement une conversation au démarrage si aucune n'existe
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    } else if (!activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation, createNewConversation, setActiveConversation]);

  // Automatically close sidebar on mobile when conversation selected
  useEffect(() => {
    if (isMobile && activeConversation) {
      setSidebarOpen(false);
    }
  }, [activeConversation, isMobile]);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Generate AI response after user sends a message
  const handleSendMessage = (conversationId: string, content: string, type: 'user', attachment?: FileAttachment) => {
    addMessage(conversationId, content, type, attachment);
    
    // Simulate AI response after a delay
    if (type === 'user') {
      setTimeout(() => {
        const responseContent = attachment
          ? `J'ai bien reçu votre fichier: "${attachment.name}"`
          : `Réponse automatique à: "${content}"`;
        
        addMessage(conversationId, responseContent, 'assistant');
      }, 1000); // Wait 1 second before AI responds
    }
  };

  return (
    <ChatLayout 
      conversations={conversations}
      activeConversation={activeConversation}
      onSelectConversation={setActiveConversation}
      onDeleteConversation={deleteConversation}
      onCreateConversation={createNewConversation}
      onUpdateTitle={updateConversationTitle}
      onSendMessage={handleSendMessage}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  );
};

export default ChatContainer;
