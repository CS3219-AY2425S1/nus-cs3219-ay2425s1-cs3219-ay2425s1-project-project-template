"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  search,
  onSearchChange,
  onReset,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search questions"
              className="mt-1"
              autoFocus
            />
          </div>
        </div>
        <Button onClick={onReset} variant="outline" className="mt-4">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionFilter;
