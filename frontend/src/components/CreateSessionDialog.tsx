'use client'

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusIcon, XCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import StartSessionDialog from "./StartSessionDialog";
import { Socket, io } from "socket.io-client";

interface FormData {
  difficulty: string;
  topic: string;
}

interface MatchRequest {
  userId: string;
  topic: string;
  difficulty: string;
  timestamp: number;
}

interface MatchResult {
  success: boolean;
  message: string;
  peerUserId?: string;
}

type Status = 'idle' | 'loading' | 'error' | 'success';

export default function CreateSessionDialog(): JSX.Element {
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      difficulty: '',
      topic: ''
    }
  });

  const difficulty = watch('difficulty');
  const topic = watch('topic');
  const isFormValid = !!difficulty && !!topic;
  const [status, setStatus] = useState<Status>('idle');
  const [timer, setTimer] = useState<number | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState<boolean>(false);
  const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    setUserId(`user_${Math.random().toString(36).substr(2, 9)}`);

    const newSocket = io('ws://localhost:3002');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('requestAcknowledged', (data: { message: string; timestamp: string }) => {
      console.log('Request acknowledged:', data);
    });

    newSocket.on('cancelAcknowledged', (data: { message: string; timestamp: string }) => {
      console.log('Cancel acknowledged:', data);
      resetState();
    });

    newSocket.on('matchError', (data: { message: string; timestamp: string }) => {
      console.log('Error:', data);
      setStatus('error');
      setTimer(null);
    });

    newSocket.on('matchResult', (data: MatchResult) => {
      console.log('Match result:', data);
      if (data.success && data.peerUserId) {
        setMatchedUsers([data.peerUserId]);
        setShowMatchDialog(true);
        resetState();
      } else {
        setStatus('error');
        setTimer(null);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      setStatus('error');
    }
    return () => clearInterval(interval);
  }, [timer]);

  const resetState = () => {
    setStatus('idle');
    setTimer(null);
    reset({
      difficulty: '',
      topic: ''
    });
  };

  const handleCreateSession = (data: FormData) => {
    setStatus('loading');
    setTimer(30);
    const matchRequest: MatchRequest = {
      userId: userId,
      topic: data.topic,
      difficulty: data.difficulty,
      timestamp: Date.now()
    };
    socket?.emit('requestMatch', matchRequest);
  };

  const handleCancel = () => {
    if (status === 'loading') {
      socket?.emit('cancelMatch', { userId: userId });
    }
    resetState();
  };

  return (
    <>
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
          <form onSubmit={handleSubmit(handleCreateSession)}>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Question Difficulty</Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strings">Strings</SelectItem>
                        <SelectItem value="algorithms">Algorithms</SelectItem>
                        <SelectItem value="data-structures">Data Structures</SelectItem>
                        <SelectItem value="bit-manipulation">Bit Manipulation</SelectItem>
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
            {status === 'loading' ? (
              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
            )}
            <Button 
              type="submit" 
              className="flex-1 px-4 py-2" 
              onClick={handleSubmit(handleCreateSession)} 
              disabled={status === 'loading' || !isFormValid}
            >
              {status === 'loading' ? (
                <>
                  Finding Match ({timer}s)
                  <div className="ml-2 animate-spin" />
                </>
              ) : status === 'error' ? (
                'Try Again'
              ) : (
                'Create Session'
              )}
            </Button>
          </DialogFooter>
          {status === 'error' && (
            <div className="p-2 text-center text-red-500">
              Failed to find a match. Please try again.
            </div>
          )}
        </DialogContent>
      </Dialog>
      {showMatchDialog && (
        <StartSessionDialog
          isOpen={showMatchDialog}
          onClose={() => {
            setShowMatchDialog(false);
            resetState();
          }}
          matchedUsers={matchedUsers}
        />
      )}
    </>
  );
}
