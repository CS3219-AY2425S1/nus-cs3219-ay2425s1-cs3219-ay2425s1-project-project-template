import { FC, useEffect, useRef, useState } from 'react'

import { mockChatData, mockUserData } from '@/mock-data'
import { Category } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as socketIO from 'socket.io-client'

interface ICollaborator {
    name: string
    email: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const userData: ICollaborator = mockUserData
const initialChatData = mockChatData

const formatQuestionCategories = (cat: Category[]) => {
    return cat.join(', ')
}

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
}

export interface IMessage {
    text: string
    name: string
    id: string
    socketId: string
    roomId: string
    image?: string
}

// eslint-disable-next-line arrow-body-style
const Chat: FC<Props> = () => {
    const [chatData, setChatData] = useState<{ [key: string]: IMessage[] }>()
    const [socket, setSocket] = useState<socketIO.Socket>()
    const chatEndRef = useRef<HTMLDivElement | null>(null)
    const { data: session } = useSession()
    const router = useRouter()
    const [value, setValue] = useState('')
    const { id: roomId } = router.query

    useEffect(() => {
        if (!session) {
            router.replace('/')
            return
        }
        const socket = socketIO.connect('ws://localhost:3009')
        socket.on('receive_message', (data: IMessage) => {
            setChatData((prev) => {
                const newMessages = { ...prev }
                newMessages[data.roomId] = [...(newMessages[data.roomId] ?? []), data]
                return newMessages
            })
        })
        setSocket(socket)
    }, [router, session])

    const getChatBubbleFormat = (currUser: ICollaborator, type: 'label' | 'text') => {
        let format = ''
        if (currUser.email === userData.email) {
            format = 'items-end ml-5'
            // Add more format based on the type
            if (type === 'text') {
                format += ' bg-theme-600 rounded-xl text-white'
            }
        } else {
            format = 'items-start text-left mr-5'
            // Add more format based on the type
            if (type === 'text') {
                format += ' bg-slate-100 rounded-xl p-2 text-slate-900'
            }
        }

        return format
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            handleSendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
        }
    }

    const handleSendMessage = (message: string) => {
        if (!session || !socket) return

        if (message.trim()) {
            socket.emit('send_message', {
                text: message,
                name: session.user.username,
                time: new Date(),
                socketId: socket.id,
                roomId,
            })
        }
        setValue('')
    }

    return (
        <>
            <div className="overflow-y-auto p-3 pb-0">
                {!!chatData?.length &&
                    Object.values(chatData).map((chat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-1 mb-5 ${getChatBubbleFormat(chat.user, 'label')}`}
                        >
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium">{chat.user.name}</h4>
                                <span className="text-xs text-slate-400">{formatTimestamp(chat.timestamp)}</span>
                            </div>
                            <div
                                className={`text-sm py-2 px-3 text-balance break-words w-full ${getChatBubbleFormat(chat.user, 'text')}`}
                            >
                                {chat.text}
                            </div>
                        </div>
                    ))}
                <div ref={chatEndRef}></div>
            </div>
            <div className="m-3 px-3 py-1 border-[1px] rounded-xl text-sm">
                <input
                    type="text"
                    className="w-full bg-transparent border-none focus:outline-none"
                    placeholder="Send a message..."
                    onKeyDown={handleKeyDown}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </>
    )
}

export default Chat
