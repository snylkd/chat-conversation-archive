
import { useState, useEffect } from 'react';
import { Conversation, FileAttachment } from '../types/chat';
import { createNewConversation, addMessageToConversation } from '../utils/conversationUtils';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Load conversations from localStorage on component mount
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
        
        // Set the active conversation to the most recent one if available
        if (parsedConversations.length > 0) {
          setActiveConversation(parsedConversations[0].id);
        } else {
          // If no conversations are found, create a new one automatically
          const newConv = createNewConversation();
          setConversations([newConv]);
          setActiveConversation(newConv.id);
        }
      } catch (e) {
        console.error("Failed to parse saved conversations:", e);
        // If there's an error parsing, create a new conversation
        const newConv = createNewConversation();
        setConversations([newConv]);
        setActiveConversation(newConv.id);
      }
    } else {
      // If no conversations in localStorage, create a new one automatically
      const newConv = createNewConversation();
      setConversations([newConv]);
      setActiveConversation(newConv.id);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  const createConversation = () => {
    const newConversation = createNewConversation();
    setConversations(prevConversations => [newConversation, ...prevConversations]);
    setActiveConversation(newConversation.id);
    return newConversation;
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
      // If we just deleted the active conversation, create a new one if there are no more
      if (conversations.length <= 1) {
        createConversation();
      } else {
        // Set the next available conversation as active
        const nextConv = conversations.find(conv => conv.id !== id);
        if (nextConv) {
          setActiveConversation(nextConv.id);
        }
      }
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
        const updatedConversation = addMessageToConversation(conv, content, type, attachment);
        
        if (type === 'user') {
          setTimeout(() => {
            const responseContent = attachment
              ? `J'ai bien reçu votre fichier: "${attachment.name}"`
              : `Réponse automatique à: "${content}"`;
            
            addMessage(conversationId, responseContent, 'assistant');
          }, 1000); // Attendre 1 seconde avant la réponse de l'IA
        }

        return updatedConversation;
      }
      return conv;
    }));
  };

  const getActiveConversationData = (): Conversation | undefined => {
    if (!activeConversation) return undefined;
    return conversations.find(c => c.id === activeConversation);
  };

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    getActiveConversationData
  };
};
