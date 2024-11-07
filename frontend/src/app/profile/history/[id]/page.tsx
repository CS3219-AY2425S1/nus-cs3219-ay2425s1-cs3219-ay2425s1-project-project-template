import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Code } from 'lucide-react';

// Types (can be moved to a separate types file)
interface Submission {
    id: string;
    status: 'accepted' | 'failed';
    language: string;
    timestamp: string;
    passes: number;
    total: number;
}

interface Match {
    id: string;
    questionTitle: string;
    collaborator: string;
    date: string;
    submissions: Submission[];
}

const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
    const statusColors = {
        accepted: 'bg-green-400',
        failed: 'bg-red-500'
    };

    return (
        <div className="space-y-4">
            {submissions.map((submission) => (
                <Card key={submission.id}>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Badge className={`${statusColors[submission.status]} text-xs text-white`}>
                                    {submission.status.toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-500">{submission.passes} / {submission.total}</span>
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
                                        {new Date(submission.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

interface PageProps {
    params: {
        id: string;
    };
}

async function getMatchDetails(id: string): Promise<Match | null> {
    return null;
}

export default async function MatchDetailsPage({ params }: PageProps) {
    // const match = await getMatchDetails(params.id);

    const match: Match = {
        id: params.id,
        questionTitle: "Sample Question Title",
        collaborator: "John Doe",
        date: new Date().toISOString(),
        submissions: [
            {
                id: "1",
                status: "accepted",
                language: "JavaScript",
                timestamp: new Date().toISOString(),
                passes: 10,
                total: 10,
            },
            {
                id: "2",
                status: "failed",
                language: "Python",
                timestamp: new Date().toISOString(),
                passes: 5,
                total: 10,
            },
        ],
    };

    if (!match) {
        return <div>Match not found</div>;
    }

    return (

        <div className="flex flex-grow items-center justify-center w-screen">
            <div className="flex-col h-full py-12 w-5/6 2xl:w-3/5 space-y-8">
                <div className="flex flex-col max-w-3xl mx-auto">
                    <Link href="/profile" className="flex items-center gap-2 text-gray-600 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    <h2 className="text-xl font-semibold mb-4">Match Details</h2>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold mb-2">{match.questionTitle}</CardTitle>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm text-gray-600">Collaborator: {match.collaborator}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(match.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <h2 className="text-xl font-semibold mb-4">Match Submissions</h2>
                    <SubmissionList submissions={match.submissions} />
                </div>
            </div>
        </div>
    );
}