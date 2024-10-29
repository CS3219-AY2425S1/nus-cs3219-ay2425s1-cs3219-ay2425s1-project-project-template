"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation'
import { useEffect } from 'react';
import Question from '../components/question';

// Disable SSR for this component
const Collaboration = dynamic(() => import('../components/editor'), { ssr: false });

export default function CollaborationPage() {
    const { room } = useParams() as { room: string };
    const url = window.location.href;
    const language = decodeURIComponent(url.split('?')[1].split('=')[1]);

    useEffect(() => {
        if (room) {
            console.log("Joined room: ", room);
        }
    }, [room]);
    
    return (
        <div className="grid grid-cols-2">
            <Question questionId='234'/>
            <Collaboration room={room} language={language}/>
        </div>
    )
}