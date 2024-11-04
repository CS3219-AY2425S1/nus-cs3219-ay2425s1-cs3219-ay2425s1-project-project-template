import { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';

interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodide: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

const PYODIDE_VERSION = 'v0.24.1';
const BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

const initPyodide = async () => {
  if (pyodide) {
    return pyodide;
  }

  if (pyodideLoading) {
    return await pyodideLoading;
  }

  pyodideLoading = (async () => {
    try {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `${BASE_URL}pyodide.js`;
          script.onload = () => resolve();
          script.onerror = (e) => {
            console.error('Failed to load Pyodide script:', e);
            reject(new Error('Failed to load Pyodide'));
          };
          document.head.appendChild(script);
        });
      }

      // Pass the indexURL explicitly
      const py = await window.loadPyodide({
        indexURL: BASE_URL,
      });

      pyodide = py;
      pyodideLoading = null;
      return py;
    } catch (error) {
      console.error('Error initializing Pyodide:', error);
      pyodideLoading = null;
      throw error;
    }
  })();

  return await pyodideLoading;
};

const createMarkerFromError = (
  error: any,
  monaco: Monaco,
): monacoEditor.editor.IMarkerData[] => {
  console.log('Python error:', error);

  const lineMatch = error.message.match(/line (\d+)/);
  const line = lineMatch ? parseInt(lineMatch[1]) : 1;

  const syntaxErrorMatch = error.message.match(
    /SyntaxError: (.*?) \((\d+),(\d+)\)/,
  );
  if (syntaxErrorMatch) {
    const [, message, lineNum, colNum] = syntaxErrorMatch;
    return [
      {
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: parseInt(lineNum),
        endLineNumber: parseInt(lineNum),
        startColumn: parseInt(colNum),
        endColumn: parseInt(colNum) + 1,
        message: message,
        source: 'pyodide',
      },
    ];
  }

  return [
    {
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: line,
      endLineNumber: line,
      startColumn: 1,
      endColumn: 1000,
      message: error.message,
      source: 'pyodide',
    },
  ];
};

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const createPyMarkers = debounce(
  async (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    try {
      const py = await initPyodide();
      const code = editor.getValue();
      const model = editor.getModel();

      if (!model) {
        return;
      }

      monaco.editor.setModelMarkers(model, 'pyodide', []);

      try {
        // First try to compile the code to catch syntax errors
        py.runPython(`
        import ast
        try:
            ast.parse(${JSON.stringify(code)})
        except Exception as e:
            raise e
      `);

        // If compilation succeeds, try running the code
        await py.runPythonAsync(`
        try:
            exec(${JSON.stringify(code)})
        except Exception as e:
            raise e
      `);
      } catch (error: any) {
        const markers = createMarkerFromError(error, monaco);
        monaco.editor.setModelMarkers(model, 'pyodide', markers);
      }
    } catch (error) {
      console.error('Error in Python validation:', error);
    }
  },
  1000,
);

export const cleanupPyodide = () => {
  pyodide = null;
  pyodideLoading = null;
};
