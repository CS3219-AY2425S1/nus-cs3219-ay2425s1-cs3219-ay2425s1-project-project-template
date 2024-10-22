import * as Y from 'yjs';

export interface Room {
    id: string;
    clients: Set<string>;
    doc: Y.Doc;
  }
