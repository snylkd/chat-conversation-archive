
import type { Conversation, Message, FileAttachment } from '../types/chat';

// Extract a title from the first user message
export const extractTitleFromMessage = (content: string): string => {
  if (!content) return "Nouvelle conversation";
  
  // Take the first 30 characters or the first sentence, whichever is shorter
  const firstSentence = content.split(/[.!?]/)[0].trim();
  const shortTitle = content.length > 30 ? content.substring(0, 30) + "..." : content;
  
  return firstSentence.length < shortTitle.length ? firstSentence : shortTitle;
};

// Create a new conversation object
export const createNewConversationObject = (id: number): Conversation => {
  return {
    id: Math.random().toString(36).substring(7),
    title: `Conversation ${id}`,
    messages: [],
    lastMessage: "Nouvelle conversation",
    timestamp: new Date(),
  };
};
