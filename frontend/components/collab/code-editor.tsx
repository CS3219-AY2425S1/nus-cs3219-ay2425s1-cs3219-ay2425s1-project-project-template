"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages: string[] = ["C++", "Java", "Javascript", "Python"];

export default function CodeEditor() {
  const [language, setLanguage] = useState<string>("Python");
  const [code, setCode] = useState<string>("");

  return (
    <div className="w-3/5 p-4">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-1/5">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className="flex-1 resize-none font-mono p-4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
