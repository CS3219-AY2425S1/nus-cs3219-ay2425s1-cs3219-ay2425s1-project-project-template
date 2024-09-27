import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/question-types';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: 'attempted',
    header: 'Attempted',
    cell: ({ getValue }) => {
      const attempted = getValue() as boolean;
      return <div className='ml-3'>{attempted && <CheckCircledIcon />}</div>;
    },
    filterFn: 'equals',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ getValue }) => {
      const difficulty = getValue() as string;
      return (
        <Badge variant={difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>{difficulty}</Badge>
      );
    },
    filterFn: 'equals',
  },
  {
    accessorKey: 'topic',
    header: 'Topics',
    cell: ({ row }) => {
      const topics: string[] = row.getValue('topic');
      return (
        <div>
          {topics.map((topic) => (
            <Badge className='mr-1 text-xs' key={topic} variant='secondary'>
              {topic}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
