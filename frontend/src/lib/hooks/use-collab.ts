import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import type { Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useEffect, useMemo, useRef, useState } from 'react';
import { yCollab } from 'y-codemirror.next';
import { SocketIOProvider } from 'y-socket.io';
import * as Y from 'yjs';

import { extensions as baseExtensions, getLanguage } from '@/lib/editor/extensions';
import { COLLAB_SERVICE } from '@/services/api-clients';

// credit: https://github.com/yjs/y-websocket
const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
];

const getRandomColor = () => {
  return usercolors[Math.floor(Math.random() * usercolors.length)];
};

// TODO: Test if collab logic works
export const useCollab = (roomId: string) => {
  const [code, setCode] = useState('');
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [extensions, setExtensions] = useState<Array<Extension>>(baseExtensions);
  const [language, setLanguage] = useState<LanguageName>('python');
  const langExtension = useMemo(() => {
    return getLanguage(language);
  }, [language]);

  useEffect(() => {
    if (editorRef.current) {
      const doc = new Y.Doc();
      let provider = null;
      try {
        provider = new SocketIOProvider(COLLAB_SERVICE, roomId, doc, {});
      } catch (err) {
        const { name, message } = err as Error;
        console.error(
          `An error occurred connecting to the Collab Server: ${JSON.stringify({ name, message })}`
        );
        return;
      }
      const ytext = doc.getText('codemirror');
      const undoManager = new Y.UndoManager(ytext);
      const awareness = provider.awareness;
      const { color, light } = getRandomColor();

      // TODO: Get user name
      awareness.setLocalStateField('user', {
        name: `Anon`,
        color: color,
        colorLight: light,
      });

      const collabExt = yCollab(ytext, awareness, { undoManager });
      setCode(ytext.toString());
      setExtensions([...extensions, collabExt]);
      return () => {
        doc.destroy();
        provider.disconnect();
      };
    }
  }, [editorRef]);
  return {
    editorRef,
    extensions: [...extensions, langExtension],
    language,
    setLanguage,
    code,
    setCode,
  };
};
