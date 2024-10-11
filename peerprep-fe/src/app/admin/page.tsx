'use client';
import React from 'react';
import { useFilteredProblems } from '@/hooks/useFilteredProblems';
import FilterBar from '../(main)/components/filter/FilterBar';
import ProblemTable from '../../components/problems/ProblemTable';
import { axiosQuestionClient } from '@/network/axiosClient';

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
      // Add error handling for a failed delete
      throw new Error('Failed to delete problem');
    }
    refetchFilter();
    return res;
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
        />
      </div>
    </div>
  );
}

export default AdminPage;
