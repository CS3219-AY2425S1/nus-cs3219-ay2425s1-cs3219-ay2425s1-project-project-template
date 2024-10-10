import 'dotenv/config';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import { setPersistence, setupWSConnection } from '@/y-postgresql/utils';
import { IWSSharedDoc } from '@/y-postgresql/interfaces';
import { PostgresqlPersistence } from 'y-postgresql';
import app from './server';

const server = createServer(app);

// y-websocket
const wss = new WebSocketServer({ server });
wss.on('connection', setupWSConnection);

PostgresqlPersistence.build({
  host: process.env.EXPRESS_DB_HOST,
  port: parseInt(process.env.EXPRESS_DB_PORT!, 10),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
})
  .then((pgdb) => {
    setPersistence({
      bindState: async (docName: string, ydoc: IWSSharedDoc) => {
        const persistedYdoc = await pgdb.getYDoc(docName);
        const newUpdates = Y.encodeStateAsUpdate(ydoc);
        pgdb.storeUpdate(docName, newUpdates);
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
        ydoc.on('update', async (update: Uint8Array) => {
          pgdb.storeUpdate(docName, update);
        });
      },
      writeState: (__docName: string, __ydoc: IWSSharedDoc) => {
        return new Promise((resolve) => {
          resolve(true);
        });
      },
    });
  })
  .catch((err) => console.log(err));

export default server;
