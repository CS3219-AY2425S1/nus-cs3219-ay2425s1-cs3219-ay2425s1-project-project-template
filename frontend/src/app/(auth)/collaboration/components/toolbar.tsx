import { editor } from "monaco-editor";
import styles from "./toolbar.module.css";
import UndoIcon from "./icon/UndoIcon";
import RedoIcon from "./icon/RedoIcon";

type Props = {
  editor: editor.IStandaloneCodeEditor;
  language: string;
};

export function Toolbar({ editor, language }: Props) {
  const languageCapitalized =
    language.charAt(0).toUpperCase() + language.slice(1);
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={(e) => {
          try {
            editor.trigger("", "undo", null);
          } catch {}
        }}
      >
        <UndoIcon />
      </button>
      <button
        className={styles.button}
        onClick={(e) => {
          try {
            editor.trigger("", "redo", null);
          } catch {}
        }}
      >
        <RedoIcon />
      </button>
      <div className="bg-yellow-500 text-black py-1 px-2 rounded-full text-xs">
        {languageCapitalized}
      </div>
    </div>
  );
}
