import React, { useState } from 'react';
import { useUserContext } from './UserContext';
import ReactCountryFlagsSelect from 'react-country-flags-select';

interface StartConversationProps {
  onLanguageSelected: () => void;
}

const StartConversation: React.FC<StartConversationProps> = ({ onLanguageSelected }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const { setLanguage } = useUserContext();

  // Gestion du changement de langue
  const handleLanguageChange = (countryCode: string) => {
    setSelectedLang(countryCode);
    const languageMap: Record<string, { code: string; label: string }> = {
      BG: { code: 'BG', label: 'Bulgarian' },
      CS: { code: 'CS', label: 'Czech' },
      DE: { code: 'DE', label: 'German' },
      GB: { code: 'GB', label: 'English (UK)' },
      US: { code: 'US', label: 'English (US)' },
      ES: { code: 'ES', label: 'Spanish' },
      FR: { code: 'FR', label: 'Français' },
      HU: { code: 'HU', label: 'Hungarian' },
      IT: { code: 'IT', label: 'Italian' },
      JP: { code: 'JP', label: 'Japanese' },
      NL: { code: 'NL', label: 'Dutch' },
      PL: { code: 'PL', label: 'Polish' },
      PT: { code: 'PT', label: 'Portuguese' },
      RO: { code: 'RO', label: 'Romanian' },
      SK: { code: 'SK', label: 'Slovak' },
      TR: { code: 'TR', label: 'Turkish' },
      UA: { code: 'UA', label: 'Ukrainian' },
      CN: { code: 'CN', label: 'Chinese' },
    };

    const selectedLanguage = languageMap[countryCode];
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  };

  const handleStart = () => {
    if (selectedLang) {
      onLanguageSelected(); // Action pour démarrer la conversation
    }
  };

  return (
    <div style={styles.container}>
      <h2>Bienvenue 👋</h2>
      <p>Veuillez choisir votre langue pour démarrer la conversation :</p>
      
      {/* Menu déroulant pour la sélection de la langue avec les drapeaux */}
      <ReactCountryFlagsSelect
        selected={selectedLang}
        onSelect={handleLanguageChange}
        countries={['BG', 'CS', 'DE', 'GB', 'US', 'ES', 'FR', 'HU', 'IT', 'JP', 'NL', 'PL', 'PT', 'RO', 'SK', 'TR', 'UA', 'CN']}
        labelWithCountryCode
        searchable
        selectPlaceholder="Choisissez une langue"
        searchPlaceholder="Rechercher une langue"
        style={styles.dropdown}
      />

      <button
        onClick={handleStart}
        disabled={!selectedLang}
        style={{
          ...styles.startButton,
          opacity: selectedLang ? 1 : 0.5,
          cursor: selectedLang ? 'pointer' : 'not-allowed',
        }}
      >
        Démarrer la conversation 💬
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '400px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  dropdown: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    marginTop: '1rem',
    width: '100%',
  },
  startButton: {
    marginTop: '1.5rem',
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
};

export default StartConversation;
