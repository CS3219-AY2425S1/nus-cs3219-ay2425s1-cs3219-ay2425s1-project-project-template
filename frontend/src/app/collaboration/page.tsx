"use client";

import dynamic from 'next/dynamic';

// Disable SSR for this component
const Collaboration = dynamic(() => import('./editor'), { ssr: false });

export default function CollaborationPage() {
  return <Collaboration />;
}