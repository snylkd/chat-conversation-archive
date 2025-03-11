import { useState, useEffect } from 'react';
import { Conversation, Message, FileAttachment } from '../types/chat';
import { extractTitleFromMessage, createNewConversationObject } from '../utils/conversationUtils';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        // Convert string dates back to Date objects
        parsedConversations.forEach((conv: any) => {
          conv.timestamp = new Date(conv.timestamp);
          conv.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
        });
        setConversations(parsedConversations);
      } catch (e) {
        console.error("Failed to parse saved conversations:", e);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation = createNewConversationObject(conversations.length + 1);
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation.id);
    
    // Add welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: Math.random().toString(36).substring(7),
        content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        type: 'assistant',
        timestamp: new Date()
      };
      
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === newConversation.id) {
            return {
              ...conv,
              messages: [welcomeMessage],
              lastMessage: welcomeMessage.content,
              timestamp: new Date()
            };
          }
          return conv;
        })
      );
    }, 500);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
    }
  };

  const updateConversationTitle = (id: string, newTitle: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          title: newTitle
        };
      }
      return conv;
    }));
  };

  const addMessage = (conversationId: string, content: string, type: 'user' | 'assistant', attachment?: FileAttachment) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          content,
          type,
          timestamp: new Date(),
          attachment
        };

        let updatedTitle = conv.title;
        if (type === 'user' && conv.messages.length === 0 && content) {
          updatedTitle = extractTitleFromMessage(content);
        }

        const updatedMessages = [...conv.messages, newMessage];
        
        return {
          ...conv,
          title: updatedTitle,
          messages: updatedMessages,
          lastMessage: content || (attachment ? `Fichier: ${attachment.name}` : ""),
          timestamp: new Date(),
        };
      }
      return conv;
    }));
  };

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage
  };
}
