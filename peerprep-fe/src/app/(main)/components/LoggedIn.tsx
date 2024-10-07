'use client';
import { useEffect, useState, useCallback } from 'react';
import axiosQuestionClient from '@/network/axiosClient';
import FilterBar from './filter/FilterBar';
import ProblemTable from './problems/ProblemTable';
import { Problem } from '@/types/types';

export default function LoggedIn() {
  const [problems, setProblems] = useState<Problem[]>([]);

  const fetchProblems = useCallback(async (params?: URLSearchParams) => {
    try {
      const url = params ? `/questions?${params.toString()}` : '/questions';
      const response = await axiosQuestionClient.get(url);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24 text-gray-100">
      <div className="mx-auto max-w-7xl">
        <FilterBar fetchProblems={fetchProblems} />
        <ProblemTable problems={problems} />
      </div>
    </div>
  );
}
