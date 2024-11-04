import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import useProfile from '../../hooks/useProfile';
import styles from './ProfilePage.module.css';
import { snippets } from '@codemirror/lang-javascript';

const ProfilePage = () => {
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [codeSnippets, setCodeSnippets] = useState([]);
    const [cookies] = useCookies(["username", "accessToken", "userId"]);
    const {
        username,
        email,
        history,
        createdAt,
        error,
        isLoading
    } = useProfile(cookies.userId);
    const sessionMap = new Map();

    const getUniqueSessions = () => {
        history.forEach(entry => {
            if (!sessionMap.has(entry.sessionId)) {
                sessionMap.set(entry.sessionId, entry.questionId);
            }
        });
    }

    const handleQuestionSelect = (sessionId) => {
        const snippets = history.filter(entry => entry.sessionId === sessionId);
        setSelectedQuestionId(questionId);
        setCodeSnippets(snippets);
    };

    useEffect(() => {
        getUniqueSessions();
        console.log('ProfilePage.jsx: Updated state:', { username, email, createdAt, history });
    }, [username, email, createdAt, history]);

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p> Error loading page. Please refresh </p>;

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.userDetails}>
                        <h2>Welcome back!</h2>
                        <p>@{username}</p>
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.infoBlock}>
                        <p>Email</p>
                        <strong>{email}</strong>
                    </div>
                    <div className={styles.infoBlock}>
                        <p>Questions Answered</p>
                        <strong>{sessionMap.size}</strong>
                    </div>
                    <div className={styles.infoBlock}>
                        <p>Member Since</p>
                        <strong>{new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong>
                    </div>
                </div>
            </div>
            <div className={styles.questionHistory}>
                <div>
                    <h2>Question History</h2>
                </div>
                {/* <ul className={styles.questionList}>
                    {history.map((entry) => (
                        <li key={entry.questionId} className={styles.questionItem}>
                            <div className={styles.questionHeader} onClick={() => handleQuestionSelect(entry.questionId)}>
                                <span>{entry.questionTitle}</span>
                                <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                                <span className={styles.toggleIcon}>{expandedQuestionId === entry.questionId ? '▲' : '▼'}</span>
                            </div>
                            {expandedQuestionId === entry.questionId && (
                                <div className={styles.snippetContainer}>
                                    <div className={styles.tabContainer}>
                                        {[...new Set(history.filter(h => h.questionId === entry.questionId).map(h => h.language))].map((language, index) => (
                                            <button
                                                key={index}
                                                className={styles.tabButton}
                                                onClick={() => setExpandedQuestionId(entry.questionId)}
                                            >
                                                {language}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.codeContainer}>
                                        {history.filter(h => h.questionId === entry.questionId).map((snippet, index) => (
                                            <div key={index}>
                                                <pre className={styles.codeBlock}>
                                                    <code>{snippet.codeSnippet}</code>
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul> */}
            </div>
        </div>
    );
};

export default ProfilePage;
