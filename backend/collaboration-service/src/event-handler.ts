// event-handlers.ts
import { client } from './event-store';
import { jsonEvent, START } from '@eventstore/db-client';
import { CodeChangeEvent } from './interfaces';

// Append a code change event to a stream
export async function appendCodeChangeEvent(event: CodeChangeEvent) {
  const eventData = jsonEvent({
    type: 'codeChange',
    data: JSON.stringify(event),
  });

  await client.appendToStream(`room-${event.roomId}`, [eventData]);
}

// Read events from a stream
export async function readEventsForRoom(roomId: string): Promise<CodeChangeEvent[]> {
  const events = client.readStream(`room-${roomId}`, {
    fromRevision: START,
  });

  const codeChangeEvents: CodeChangeEvent[] = [];

  for await (const resolvedEvent of events) {
    if (!resolvedEvent.event) continue;
    const { type, data } = resolvedEvent.event;

    if (type === 'codeChange') {
      // Check if data is a JSON object
      if (typeof data === 'object' && data !== null) {
        try {
          // Attempt to cast data to CodeChangeEvent
          const codeChangeEvent = data as unknown as CodeChangeEvent;
          codeChangeEvents.push(codeChangeEvent);
        } catch (error) {
          console.error('Failed to cast event data to CodeChangeEvent:', error);
        }
      } else {
        console.warn('Event data is not in JSON format:', data);
      }
    }

    console.log(`Event type: ${type}, data:`, data);
  }

  return codeChangeEvents;
}