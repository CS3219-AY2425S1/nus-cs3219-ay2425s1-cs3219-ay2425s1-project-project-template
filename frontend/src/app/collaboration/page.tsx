"use client";

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import VideoDisplay from '@/components/collaborations/VideoDisplay';


export default function CollaborationPage() {

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Session</CardTitle>
        </CardHeader>
      </Card>

      <VideoDisplay />
    </div>
  );
}
