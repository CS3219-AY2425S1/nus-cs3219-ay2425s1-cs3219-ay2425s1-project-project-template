import { editor } from "monaco-editor";
import styles from "./toolbar.module.css";
import UndoIcon from "./icon/UndoIcon";
import RedoIcon from "./icon/RedoIcon";

type Props = {
    editor: editor.IStandaloneCodeEditor;
};

export function Toolbar({ editor } : Props) {
    return (
        <div className={styles.toolbar}>
            <button className={styles.button} onClick={(e) => {
                try {
                    editor.trigger('', 'undo', null)
                } catch {}
                }
                }>
                <UndoIcon />
            </button>
            <button className={styles.button} onClick={(e) => {
                try {
                    editor.trigger('', 'redo', null)
                } catch {}
                }}>
                <RedoIcon />
            </button>
        </div>
    );
}