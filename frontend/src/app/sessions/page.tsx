import React, { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode } from 'react'
import { CalendarIcon, ClockIcon, CheckIcon, PlusIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Session {
  id: number
  date: string
  title: string
  participants: string[]
  duration: string
  questions: number
  solved: number
}

const sessions: Session[] = [
  {
    id: 1,
    date: '1 May',
    title: 'Coding Session 5',
    participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee', 'Natalie Patel'],
    duration: '2h 15m',
    questions: 18,
    solved: 9
  },
  {
    id: 2,
    date: '5 Apr',
    title: 'Coding Session 4',
    participants: ['John Doe', 'Sarah Miller'],
    duration: '1h 15m',
    questions: 10,
    solved: 6
  },
  {
    id: 3,
    date: '1 Apr',
    title: 'Coding Session 3',
    participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee'],
    duration: '1h 30m',
    questions: 12,
    solved: 9
  }
]

export default function SessionsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Welcome back, John!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">125</h3>
                <p className="text-sm">Coding Sessions Created</p>
              </div>
              <CalendarIcon className="w-10 h-10" />
            </div>
          </Card>
          <Card className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">342</h3>
                <p className="text-sm">Hours Practiced</p>
              </div>
              <ClockIcon className="w-10 h-10" />
            </div>
          </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Past Coding Sessions</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
        <div className="space-y-6">
          {renderYearSessions(2023)}
          {renderYearSessions(2022)}
        </div>
      </main>
  )
}

function renderYearSessions(year: number) {
  return (
    <div key={year}>
      <h3 className="text-xl font-bold mb-4">{year}</h3>
      <div className="space-y-4">
        {renderSession("1 May", "Coding Session 5", ["John Doe", "Sarah Miller", "Kimberly Lee", "Natalie Patel"], "2h 15m", 18, 9)}
        {renderSession("5 Apr", "Coding Session 4", ["John Doe", "Sarah Miller"], "1h 15m", 10, 6)}
        {renderSession("1 Apr", "Coding Session 3", ["John Doe", "Sarah Miller", "Kimberly Lee"], "1h 30m", 12, 9)}
      </div>
    </div>
  )
}

function renderSession(date: string, title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined, participants: any[], duration: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined, totalQuestions: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined, solvedQuestions: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) {
  return (
    <Card className="p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4">
        <div className="flex items-center space-x-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{date.split(' ')[0]}</div>
            <div className="text-sm text-muted-foreground">{date.split(' ')[1]}</div>
          </div>
          <div>
            <h4 className="text-lg font-semibold">{title}</h4>
            <div className="text-sm text-muted-foreground">{participants.join(', ')}</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span>{duration}</span>
          <span>{totalQuestions} Questions</span>
          <span>{solvedQuestions} Solved</span>
        </div>
      </div>
    </Card>
  )
}