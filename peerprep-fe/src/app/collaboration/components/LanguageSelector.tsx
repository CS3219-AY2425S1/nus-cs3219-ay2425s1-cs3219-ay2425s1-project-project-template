'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { useState } from 'react';

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
  supportedLanguages: string[];
  className?: string;
}

const LanguageSelector = ({
  language,
  onSelect,
  supportedLanguages,
  className = '',
}: LanguageSelectorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);

  // Sync local state with prop
  const onValueChange = (selectedLang: string) => {
    onSelect(selectedLang);
    setCurrentLanguage(selectedLang);
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Select value={currentLanguage} onValueChange={onValueChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
