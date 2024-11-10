'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Code } from 'lucide-react';
import { convertSolvedStatus } from '@/utils/constant'
import CodeViewDialog from '@/app/profile/components/CodeViewDialog'

const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | undefined>(undefined)
    const statusColors = {
        accepted: 'bg-green-400',
        failed: 'bg-red-500'
    };

    return (
        <>
            <div className="flex flex-col flex-grow space-y-4">
                {submissions.length === 0 && (
                    <div className="flex flex-grow justify-center items-center">
                        No submissions made.
                    </div>
                )}
                {submissions.map((submission) => (
                    <Card key={submission.createdAt} className='h-fit w-full hover:cursor-pointer' onClick={() => setSelectedSubmission(submission)}>
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <Badge className={`${statusColors[convertSolvedStatus(submission.solved)]} text-xs text-white`}>
                                        {convertSolvedStatus(submission.solved).toUpperCase()}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-500">{submission.testCasesPassed} / {submission.testCasesPassed}</span>
                                        <span className="text-sm text-gray-500">test cases passed</span>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        <span className='text-sm'>{submission.language}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm text-gray-600">
                                            {new Date(submission.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <CodeViewDialog
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(undefined)}
                code={selectedSubmission?.code || ''}
                language={selectedSubmission?.language || 'javascript'}
                timestamp={selectedSubmission?.createdAt || ''}
            />
        </>

    );
};

interface PageProps {
    params: {
        id: string;
    };
}

const questionServiceBaseUrl = process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL;
const historyServiceBaseUrl = process.env.NEXT_PUBLIC_HISTORY_SERVICE_URL;

export default function MatchDetailsPage({ params }: PageProps) {
    const { isAuthenticated, user, isAdmin, refreshAuth } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [match, setMatch] = useState<PastMatch>()
    const [question, setQuestion] = useState<Question>()
    const [peerName, setPeerName] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const fetchQuestionData = async (questionId: string) => {
        try {
            const response = await fetch(`${questionServiceBaseUrl}/get-questions?questionId=${questionId}`, {
                method: 'GET',
            });
            const data = await response.json()
            console.log("Question:", data)
            setQuestion(data[0]);
        } catch (err) {
            console.log("Error", err)
            return {};
        }
    }

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const responseMatch = await fetch(`${historyServiceBaseUrl}/match-history/${params.id}`,
                {
                    method: 'GET',
                    next: { revalidate: 60 },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            if (!responseMatch.ok) {
                throw new Error('Failed to fetch match')
            }
            const match = await responseMatch.json()
            console.log("Match fetched", match)

            const responseSubmission = await fetch(`${historyServiceBaseUrl}/submissions/${params.id}`,
                {
                    method: 'GET',
                    next: { revalidate: 60 },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            if (!responseSubmission.ok) {
                throw new Error('Failed to fetch submissions')
            }
            const submissions = await responseSubmission.json()
            console.log("Submissions fetched", submissions)

            await fetchQuestionData(match.data.questionId)
            setMatch(match.data)
            setSubmissions(submissions)

            const peerId = match.data.collaborators[0] != user?.id? match.data.collaborators[0] : match.data.collaborators[1]
            const responsePeer = await fetch(`${historyServiceBaseUrl}/collaborators/${peerId}`,
                {
                    method: 'GET',
                    next: { revalidate: 60 },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            if (!responsePeer.ok) {
                throw new Error('Failed to fetch peer')
            }
            const peer = await responsePeer.json()
            console.log(`Peer fetched: ${peer.user}`)

            setPeerName(peer.user.name)
        } catch (err) {
            console.log("Error", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-grow items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!match) {
        return (
            <div className="flex flex-grow items-center justify-center">
                Match not found
            </div>
        );
    }

    return (
        <div className="flex flex-grow items-center justify-center w-screen">
            <div className="flex-col h-full py-12 w-5/6 2xl:w-3/5 space-y-8">
                <div className="flex flex-col h-full max-w-3xl mx-auto">
                    <Link href="/profile" className="flex items-center gap-2 text-gray-600 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    <h2 className="text-xl font-semibold mb-4">Match Details</h2>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold mb-2">{match?.questionId}. {question?.title || 'No title available'}</CardTitle>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm text-gray-600">Collaborator: {peerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(match?.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <h2 className="text-xl font-semibold mb-4">Match Submissions</h2>
                    <SubmissionList submissions={submissions} />
                </div>
            </div>
        </div>
    );
}