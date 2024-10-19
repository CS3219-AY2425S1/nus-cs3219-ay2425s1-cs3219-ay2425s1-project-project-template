"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateSessionDialog() {
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [timer, setTimer] = useState<number | null>(null);

  const isFormValid = difficulty !== '' && topic !== ''; 

  useEffect(() => {
    if (status === 'loading') {
      const timeout = window.setTimeout(() => {
        setStatus('error');  
      }, 30000);  
      setTimer(timeout);
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [status]);

  const handleCreateSession = () => {
    if (status !== 'loading') { 
      setStatus('loading');
    }
  };

  const handleCancel = () => {
    setStatus('idle');
    if (timer !== null) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
            Create Session
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Coding Interview Prep</DialogTitle>
          <DialogDescription>Find a partner to practice coding interviews with.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Question Difficulty</Label>
              <Select onValueChange={(value) => setDifficulty(value)} value={difficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Question Topic</Label>
              <Select onValueChange={(value) => setTopic(value)} value={topic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strings">Strings</SelectItem>
                  <SelectItem value="algorithms">Algorithms</SelectItem>
                  <SelectItem value="data-structures">Data Structures</SelectItem>
                  <SelectItem value="bit-Manipulation">Bit Manipulation</SelectItem>
                  <SelectItem value="recursion">Recursion</SelectItem>
                  <SelectItem value="databases">Databases</SelectItem>
                  <SelectItem value="arrays">Arrays</SelectItem>
                  <SelectItem value="brainteaser">Brainteaser</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter className="flex justify-center gap-2 p-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel} className="flex-1">Cancel</Button>
          </DialogClose>
          <Button className="flex-1 px-4 py-2" onClick={handleCreateSession} disabled={status === 'loading' || !isFormValid}>
            {status === 'loading' ? (
              <>
                Creating Session
                <div className="ml-2 animate-spin" />
              </>
            ) : status === 'error' ? (
              <>
                Try Again
                <div className="ml-2 animate-spin" />
              </>
            ) : (
              "Create Session"
            )}
          </Button>
        </DialogFooter>
        {status === 'error' && <div className="p-2 text-center">
          No match found. Please try again later or try another topic or difficulty.
        </div>}
      </DialogContent>
    </Dialog>
  );
}
