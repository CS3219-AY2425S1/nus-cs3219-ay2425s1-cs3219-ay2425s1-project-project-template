import { Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { LANGUAGE_VERSIONS, SupportedLanguages } from '../../utils/utils';

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue";

interface LanguageSelectorProps {
    language: SupportedLanguages;
    onSelect: (language: SupportedLanguages) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
    return (
        <div className='flex'>
            <p className='flex'>
                Language:
            </p>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                    >
                        {language}    
                    </Button>
                </DropdownTrigger>


                <DropdownMenu aria-label="Language selection">
                    {languages.map(([lang, version]) => (
                        <DropdownItem key={lang}
                            onClick={() => onSelect(lang as SupportedLanguages)}>
                            {lang}
                            &nbsp;
                            <p className="text-tiny text-black/40 uppercase font-bold">
                                ({version})
                            </p>
                        </DropdownItem>
                    ))}
                </DropdownMenu> 
            </Dropdown>
        </div>
    );
}

export default LanguageSelector;
