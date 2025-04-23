import React, { useState } from 'react';
import { useUserContext } from './UserContext';

interface StartConversationProps {
  onLanguageSelected: () => void;
}

const StartConversation: React.FC<StartConversationProps> = ({ onLanguageSelected }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const { setLanguage } = useUserContext();

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    setLanguage({ code: lang.toUpperCase(), label: lang === 'fr' ? 'Français' : 'English' });
  };

  const handleStart = () => {
    if (selectedLang) {
      onLanguageSelected();
    }
  };

  return (
    <div>
      <h2>Bienvenue 👋</h2>
      <p>Veuillez choisir votre langue pour démarrer la conversation :</p>
      <button onClick={() => handleSelect('fr')}>🇫🇷 Français</button>
      <button onClick={() => handleSelect('en')}>🇺🇸 English</button>
      <button onClick={handleStart} disabled={!selectedLang}>
        Démarrer la conversation 💬
      </button>
    </div>
  );
};

export default StartConversation;
