import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Server as HocuspocusServer } from '@hocuspocus/server';
import { Logger as HocuspocusLogger } from '@hocuspocus/extension-logger';
import { Database as HocuspocusDatabase } from '@hocuspocus/extension-database';

import { CollaborationRepository } from './domain/ports/collaboration.repository';

@Injectable()
export class CollaborationGateway implements OnModuleInit {
  private readonly logger = new Logger(CollaborationGateway.name);

  constructor(
    private readonly collaborationRepository: CollaborationRepository,
  ) {}

  private readonly hocuspocusServer = HocuspocusServer.configure({
    port: 1234,
    timeout: 1000 * 60 * 60,
    debounce: 1000 * 1,
    maxDebounce: 1000 * 60,
    extensions: [
      new HocuspocusDatabase({
        fetch: async ({ documentName }) => {
          try {
            const res =
              await this.collaborationRepository.fetchDocumentById(
                documentName,
              );
            return res;
          } catch (error) {
            this.logger.error(
              `Error fetching document ${documentName}: ${error.message}`,
            );
            return null;
          }
        },
        store: async ({ documentName, state }) => {
          try {
            await this.collaborationRepository.storeDocumentById(
              documentName,
              state,
            );
          } catch (error) {
            this.logger.error(
              `Error storing document ${documentName}: ${error.message}`,
            );
          }
        },
      }),
      new HocuspocusLogger({
        log: (message) => {
          this.logger.debug(message);
        },
      }),
    ],
  });

  onModuleInit() {
    this.hocuspocusServer.listen();
    this.logger.log('Hocuspocus server started on port 1234');
  }
}
