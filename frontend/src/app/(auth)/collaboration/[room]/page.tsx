"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation'
import { useEffect } from 'react';


// Disable SSR for this component
const Collaboration = dynamic(() => import('../components/editor'), { ssr: false });

export default function CollaborationPage() {
    const { room } = useParams();
    useEffect(() => {
        if (room) {
            console.log("Joined room: ", room);
        }
    }, [room]);
    
    return (
        <div>
            <Collaboration room={room}/>
        </div>
    )
}