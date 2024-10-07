'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useSearchStore } from '@/state/useSearchStore';
import { FilterSelect } from './FilterSelect';
import { FilterBadge } from './FilterBadge';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

const DIFFICULTY_OPTIONS = [
  { value: '1', label: 'Easy' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'Hard' },
];

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'solved', label: 'Solved' },
];

// TODO: replace with backend fetched list
const TOPIC_OPTIONS = [
  { value: 'array', label: 'Array' },
  { value: 'string', label: 'String' },
  { value: 'dp', label: 'Dynamic Programming' },
];

interface FilterBarProps {
  fetchProblems: (params: URLSearchParams) => Promise<void>;
}

export default function FilterBar({ fetchProblems }: FilterBarProps) {
  const [difficulty, setDifficulty] = useQueryState('difficulty');
  const [status, setStatus] = useQueryState('status');
  const [topics, setTopics] = useQueryState(
    'topics',
    parseAsArrayOf(parseAsString),
  );
  const { searchTerm, setSearchTerm } = useSearchStore();

  const handleFilterChange = useCallback(
    (key: string, value: string | string[]) => {
      if (key === 'difficulty') {
        setDifficulty(value === 'all' ? null : (value as string));
      } else if (key === 'status') {
        setStatus(value === 'all' ? null : (value as string));
      } else if (key === 'topics') {
        setTopics(value.length ? (value as string[]) : null);
      }
    },
    [setDifficulty, setStatus, setTopics],
  );

  const removeFilter = useCallback(
    (key: string, value?: string) => {
      if (key === 'difficulty') {
        setDifficulty(null);
      } else if (key === 'status') {
        setStatus(null);
      } else if (key === 'topics') {
        setTopics((prev) => prev?.filter((t) => t !== value) ?? null);
      }
    },
    [setDifficulty, setStatus, setTopics],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (difficulty) params.append('difficulty', difficulty);
    if (status) params.append('status', status);
    if (topics) topics.forEach((topic) => params.append('topics', topic));
    if (searchTerm) params.append('search', searchTerm);
    fetchProblems(params);
  }, [difficulty, status, topics, searchTerm, fetchProblems]);

  return (
    <div className="mb-6">
      <div className="mb-4 flex flex-wrap gap-4">
        <FilterSelect
          placeholder="Difficulty"
          options={DIFFICULTY_OPTIONS}
          onChange={(value) => handleFilterChange('difficulty', value)}
          value={difficulty || ''}
        />
        <FilterSelect
          placeholder="Status"
          options={STATUS_OPTIONS}
          onChange={(value) => handleFilterChange('status', value)}
          value={status || ''}
        />
        <FilterSelect
          placeholder="Topics"
          options={TOPIC_OPTIONS}
          onChange={(value) => handleFilterChange('topics', value)}
          value={topics || []}
          isMulti
        />
        <div className="flex-grow">
          <Input
            className="w-full border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400"
            placeholder="Search questions"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-700 bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Match
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {difficulty && (
          <FilterBadge
            filterType="difficulty"
            value={
              DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty)
                ?.label || ''
            }
            onRemove={() => removeFilter('difficulty')}
          />
        )}
        {status && (
          <FilterBadge
            filterType="status"
            value={
              STATUS_OPTIONS.find((opt) => opt.value === status)?.label || ''
            }
            onRemove={() => removeFilter('status')}
          />
        )}
        {topics &&
          topics.map((topic) => (
            <FilterBadge
              key={`topics-${topic}`}
              filterType="topics"
              value={
                TOPIC_OPTIONS.find((opt) => opt.value === topic)?.label || topic
              }
              onRemove={() => removeFilter('topics', topic)}
            />
          ))}
      </div>
    </div>
  );
}
