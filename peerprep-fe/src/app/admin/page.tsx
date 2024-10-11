'use client';
import React from 'react';
import { useFilteredProblems } from '@/hooks/useFilteredProblems';
import FilterBar from '../(main)/components/filter/FilterBar';
import ProblemTable from '../../components/problems/ProblemTable';
import { axiosQuestionClient } from '@/network/axiosClient';
import { Problem } from '@/types/types';
import { isAxiosError } from 'axios';

function AdminPage() {
  const {
    problems,
    filters,
    updateFilter,
    removeFilter,
    isLoading,
    refetchFilter,
  } = useFilteredProblems();

  const handleDelete = async (id: number) => {
    const res = await axiosQuestionClient.delete(`/questions/${id}`);
    if (res.status !== 200) {
      throw new Error('Failed to delete problem');
    }
    refetchFilter();
    return res;
  };

  const handleEdit = async (problem: Problem) => {
    try {
      const res = await axiosQuestionClient.put(`/questions/${problem._id}`, {
        difficulty: problem.difficulty,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        tags: problem.tags,
        title_slug: problem.title_slug,
        title: problem.title,
      });

      refetchFilter();
      return res;
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        switch (e.status) {
          case 400:
            throw new Error('Invalid question data. Please check your input.');
          case 409:
            throw new Error('Question already exists');
          case 404:
            throw new Error('Question not found');
          default:
            throw new Error('Failed to update question');
        }
      }
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24 text-gray-100">
      <div className="mx-auto max-w-7xl">
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          removeFilter={removeFilter}
        />
        <ProblemTable
          problems={problems}
          isLoading={isLoading}
          showActions={true}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
}

export default AdminPage;
