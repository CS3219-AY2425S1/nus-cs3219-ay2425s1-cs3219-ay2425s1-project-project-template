'use client';
import React from 'react';
import SessionHistoryList from '@/components/session-history/SessionHistoryList';

const Page = ({ sessionId }) => {
  return (
    <div className="h-screen p-6">
      <SessionHistoryList sessionId={sessionId} />
    </div>
  );
};
export default Page;
