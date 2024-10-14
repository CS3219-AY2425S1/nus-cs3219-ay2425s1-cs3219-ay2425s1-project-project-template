import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import {
  extensions,
  getTheme,
  IEditorTheme,
  languages,
  themeOptions,
} from '@/lib/editor/extensions';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const EXTENSION_HEIGHT = 250;
const MIN_EDITOR_HEIGHT = 350;

type EditorProps = {
  room: string;
};

export const Editor = ({ room }: EditorProps) => {
  const { height } = useWindowSize();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<LanguageName>('python');
  const [theme, setTheme] = useState<IEditorTheme>('vscodeDark');
  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex gap-4'>
        <div className='flex flex-col gap-2'>
          <Label>Language</Label>
          <Select value={language} onValueChange={(val) => setLanguage(val as LanguageName)}>
            <SelectTrigger className='max-w-[150px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang, idx) => (
                <SelectItem value={lang} key={idx}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-2'>
          <Label>Theme</Label>
          <Select value={theme} onValueChange={(val) => setTheme(val as IEditorTheme)}>
            <SelectTrigger className='max-w-[150px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((theme, idx) => (
                <SelectItem value={theme} key={idx}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='border-border w-full text-clip rounded-lg border shadow-sm'>
        <CodeMirror
          style={{
            fontSize: '14px',
          }}
          height={`${Math.max((height as number) - EXTENSION_HEIGHT, MIN_EDITOR_HEIGHT)}px`}
          value={code}
          onChange={(value, _viewUpdate) => {
            setCode(value);
          }}
          theme={getTheme(theme)}
          extensions={extensions}
          lang={language}
        />
      </div>
    </div>
  );
};
