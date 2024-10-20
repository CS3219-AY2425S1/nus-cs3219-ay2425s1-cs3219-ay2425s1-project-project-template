import * as React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { LanguageMode } from '@/types/language-mode'
import { CsharpIcon, GolangIcon, JavaIcon, JavascriptIcon, PythonIcon, RubyIcon, TypeScriptIcon } from '@/assets/icons'

interface LanguageModeSelectProps {
    className: string
    onSelectChange: (value: LanguageMode) => void
}

const languageModeOptions = Object.values(LanguageMode)

const getLanguageIcon = (language: LanguageMode) => {
    switch (language) {
        case LanguageMode.Javascript:
            return <JavascriptIcon fill="white" height="14px" width="14px" />
        case LanguageMode.Csharp:
            return <CsharpIcon fill="white" height="14px" width="14px" />
        case LanguageMode.Golang:
            return <GolangIcon fill="white" height="14px" width="14px" />
        case LanguageMode.Java:
            return <JavaIcon fill="white" height="14px" width="14px" />
        case LanguageMode.Python:
            return <PythonIcon fill="white" height="12px" width="12px" />
        case LanguageMode.Ruby:
            return <RubyIcon fill="white" height="12px" width="12px" />
        case LanguageMode.Typescript:
            return <TypeScriptIcon fill="white" height="14px" width="14px" />
        default:
            return null
    }
}

const LanguageModeSelect = (props: LanguageModeSelectProps) => {
    const [displayValue, setDisplayValue] = React.useState(languageModeOptions[0])

    const handleValueChange = (val: string) => {
        const selectedLanguage = val as LanguageMode
        setDisplayValue(selectedLanguage)
        props.onSelectChange(selectedLanguage)
    }

    return (
        <div className={props.className}>
            <Select defaultValue={languageModeOptions[0]} value={displayValue} onValueChange={handleValueChange}>
                <SelectTrigger>
                    <SelectValue>
                        <div className="flex items-center gap-2">
                            {getLanguageIcon(displayValue)}
                            {displayValue}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {languageModeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default LanguageModeSelect
