import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { DataTableSortableHeader } from '@/components/ui/data-table';
import { IQuestionAttempt } from '@/types/question-types';

export const columns: Array<ColumnDef<IQuestionAttempt>> = [
  {
    accessorKey: 'attemptId',
    header: 'ID',
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => <DataTableSortableHeader column={column} title='Attempted' />,
    cell({ row }) {
      const attemptedTime = row.getValue('timestamp') as string;
      return <div>{new Date(attemptedTime).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'language',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} title='Language' className='ml-auto' />
    ),
    cell({ row }) {
      return (
        <div>
          <Badge className='rounded-full' variant='secondary'>
            {row.getValue('language')}
          </Badge>
        </div>
      );
    },
  },
];
