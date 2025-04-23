import React, { useState } from 'react';
import ReactCountryFlagsSelect from 'react-country-flags-select';
import { useUserContext } from './UserContext';

const LanguageSelector: React.FC = () => {
  const { setLanguage } = useUserContext();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const handleLanguageChange = (countryCode: string) => {
    setSelectedLang(countryCode);
    const languageMap: Record<string, { code: string; label: string }> = {
      BG: { code: 'BG', label: 'Bulgarian' },
      CS: { code: 'CS', label: 'Czech' },
      DE: { code: 'DE', label: 'German' },
      GB: { code: 'GB', label: 'English (UK)' },
      US: { code: 'US', label: 'English (US)' },
      ES: { code: 'ES', label: 'Spanish' },
      FR: { code: 'FR', label: 'French' },
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

  return (
    <div>
      <h2>Sélectionnez votre langue :</h2>
      <ReactCountryFlagsSelect
        selected={selectedLang}
        onSelect={handleLanguageChange}
        countries={['BG', 'CS', 'DE', 'GB', 'US', 'ES', 'FR', 'HU', 'IT', 'JP', 'NL', 'PL', 'PT', 'RO', 'SK', 'TR', 'UA', 'CN']}
        labelWithCountryCode
        searchable
        selectPlaceholder="Choisissez une langue"
        searchPlaceholder="Rechercher une langue"
      />
    </div>
  );
};

export default LanguageSelector;
