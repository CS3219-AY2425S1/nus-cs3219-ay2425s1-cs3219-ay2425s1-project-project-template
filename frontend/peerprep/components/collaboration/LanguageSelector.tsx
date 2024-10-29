import { Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { LANGUAGE_VERSIONS, SupportedLanguages } from '../../utils/utils';
import { useTheme } from "next-themes";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue";

interface LanguageSelectorProps {
  language: SupportedLanguages;
  onSelect: (language: SupportedLanguages) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  const { theme } = useTheme();
  return (
    <div className='flex items-center space-x-2'>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            className="text-sm"
          >
            {language}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Language selection" className="bg-white dark:bg-gray-800">
          {languages.map(([lang, version]) => (
            <DropdownItem key={lang}
              onClick={() => onSelect(lang as SupportedLanguages)}
              className="flex items-center justify-between"
            >
              <span>{lang}</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                ({version})
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default LanguageSelector;
