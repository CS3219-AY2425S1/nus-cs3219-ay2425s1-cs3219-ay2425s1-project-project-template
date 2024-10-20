"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StartSessionDialog from "./StartSessionDialog";
import { io } from "socket.io-client";

const socket = io('http://localhost:3232');

interface CreateSessionDialogProps {
  difficulty: string
  topic: string
  onClose: () => void
}

export default function CreateSessionDialog() {
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      difficulty: '',
      topic: ''
    }
  });

  const difficulty = watch('difficulty');
  const topic = watch('topic');
  const isFormValid = difficulty && topic;
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [timer, setTimer] = useState<NodeJS.Timeout  | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
  const [matchResult, setMatchResult] = useState(null);

  const handleCreateSession = () => {
    console.log('Creating Session:', { topic, difficulty });
    const matchRequest = {
      topic,
      difficulty,
      clientId: socket.id,
    };

    setStatus('loading');

    console.log("statussss", status);

    socket.emit('initMatch', matchRequest);
    console.log('Match Request Sent:', matchRequest);

  };

  useEffect(() => {
    socket.on('matchResult', (result) => {
      console.log('Match Result:', result);
      setStatus('success');
      setMatchResult(result);
      clearTimeout(timeoutId);
    });

    console.log('status', status);

    const timeoutId = setTimeout(() => {
      console.log('Match result not received within 30 seconds');
      setStatus('error');
    }, 30000);

    console.log('timeoutId', timeoutId);

    if (status === 'error' || status === 'success') {
      clearTimeout(timeoutId);
    }

    return () => {
      socket.off('matchResult');
      console.log('thissss', status);
      clearTimeout(timeoutId);
    };
  }, [socket, status]);

  const handleCancel = () => {
    setStatus('idle');
    if (timer !== null) {
      clearTimeout(timer);
      setTimer(null);
    }
    reset({
      difficulty: '',
      topic: ''
    });
  };

  console.log('outsidee', status);

  return (
    <>
    <Dialog onOpenChange={handleCancel}>
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
        <form onSubmit={handleSubmit(handleCreateSession)}>
          <div className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Question Difficulty</Label>
              <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Question Topic</Label>
              <Controller
                  name="topic"
                  control={control}
                  render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              )}
              />
            </div>
          </div>
        </form>
        <DialogFooter className="flex justify-center gap-2 p-4">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" onClick={handleCancel} >Cancel</Button>
          </DialogClose>
          <Button type="submit" className="flex-1 px-4 py-2" onClick={handleCreateSession} disabled={status === 'loading' || !isFormValid}>
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
    {/* {showMatchDialog && (
      <StartSessionDialog
        isOpen={showMatchDialog}
        onClose={() => setShowMatchDialog(false)}
        matchedUsers={matchedUsers}
      />
    )} */}
    {matchResult && (
      <StartSessionDialog
        isOpen={matchResult}
        onClose={() => setMatchResult(null)}
        matchedUsers={matchResult}
      />
    )}
    </>
  );
}
