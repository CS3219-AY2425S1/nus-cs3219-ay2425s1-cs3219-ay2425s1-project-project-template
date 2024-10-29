import { AppShell, useMantineTheme } from '@mantine/core';
import { lazy, useEffect, useState } from 'react';

import Card from '../components/Card';
import QuestionCounter from '../components/dashboard/QuestionCounter';
import './Dashboard.css';

import { useAuth } from '../hooks/AuthProvider';

const Header = lazy(() => import('../components/Header'));

interface PracticeHistoryItem {
  _id: string;
  userIdOne: string;
  userIdTwo: string;
  textWritten: string;
  questionId: number;
  questionName: string;
  questionDifficulty: string;
  programmingLanguage: string;
  sessionDuration: number;
  sessionStatus: string;
  datetime: string;
  __v: number;
}

interface Progress {
  difficultyCount: {
    Easy: { completed: number; total: number };
    Medium: { completed: number; total: number };
    Hard: { completed: number; total: number };
  };
  topTopics: { topic: string; count: number }[];
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Other imports remain the same

function Dashboard() {
  const theme = useMantineTheme();
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryItem[]>([]);
  const [progress, setProgress] = useState<Progress>({
    difficultyCount: {
      Easy: { completed: 0, total: 0 },
      Medium: { completed: 0, total: 0 },
      Hard: { completed: 0, total: 0 },
    },
    topTopics: [],
  });

  const auth = useAuth();

  useEffect(() => {
    // Fetch practice history
    fetch(`http://localhost:80/api/history/${auth.userId}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then((data: PracticeHistoryItem[]) => {
        setPracticeHistory(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://localhost:80/api/history/progress/${auth.userId}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then((data: Progress) => {
        setProgress(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [auth.userId]); // Added auth.userId as a dependency

  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <Header />
      <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <Card className="dashboard-stats">
              <div className="dashboard-stats-difficulty">
                <QuestionCounter 
                  colour={theme.colors.green[4]} 
                  label="Easy" 
                  completed={progress.difficultyCount.Easy.completed} 
                  total={progress.difficultyCount.Easy.total} 
                />
                <QuestionCounter 
                  colour={theme.colors.orange[4]} 
                  label="Medium" 
                  completed={progress.difficultyCount.Medium.completed} 
                  total={progress.difficultyCount.Medium.total} 
                />
                <QuestionCounter 
                  colour={theme.colors.red[4]} 
                  label="Hard" 
                  completed={progress.difficultyCount.Hard.completed} 
                  total={progress.difficultyCount.Hard.total} 
                />
              </div>
              <div className="dashboard-stats-topic">
                <h2 className="dashboard-stats-topic-label">Favourite Topics</h2>
                <table className="dashboard-stats-topic-table">
                  <tbody>
                    {progress.topTopics.length > 0 ? (
                      progress.topTopics.map((topicItem, index) => (
                        <tr key={index}>
                          <td className="topic-label-container">
                            <span className="topic-label" style={{ backgroundColor: theme.colors.slate[7] }}>
                              {topicItem.topic}
                            </span>
                          </td>
                          <td>
                            <span className="topic-number-solved">{topicItem.count}</span> Problems Solved
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No favourite topics available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="dashboard-practice">
              <h2 className="dashboard-practice-label">Practice</h2>
              <button className="dashboard-practice-button" style={{ backgroundColor: theme.colors.slate[7] }}>
                Start Interview
              </button>
              <p className="dashboard-practice-help">Not sure how this works?</p>
            </Card>
          </div>
          <Card className="practice-history-container">
            <h2 className="practice-history-label">Practice History</h2>
            <table className="dashboard-table">
              <thead style={{ backgroundColor: theme.colors.slate[7] }}>
                <tr>
                  <th className="expand">Question</th>
                  <th>Date</th>
                  <th>Difficulty</th>
                  <th>Language</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {practiceHistory.length > 0 ? (
                  practiceHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.questionName}</td>
                      <td>{formatDate(item.datetime)}</td>
                      <td>{item.questionDifficulty}</td>
                      <td>{item.programmingLanguage}</td>
                      <td>
                        <button className="view-button" style={{ backgroundColor: theme.colors.slate[7] }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No practice history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;
