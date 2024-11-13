import React, { useState, useEffect } from 'react';
import styles from './CountDownTimer.module.css';

const CountdownTimer = ({ initialSeconds, start, onTimeout }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [step, setStep] = useState(0);
    const icons = ['', '🖥️', '🖥️⏱️', '🖥️⏱️🕒'];

    useEffect(() => {
        if (!start || seconds <= 0) return;

        const intervalId = setInterval(() => {
            setSeconds((prevSeconds) => {
                const newSeconds = prevSeconds - 1;
                if (newSeconds <= 0) {
                    clearInterval(intervalId);
                    if (onTimeout) onTimeout();
                }
                return newSeconds;
            });
        }, 1000);

        const iconIntervalId = setInterval(() => {
            setStep((prevStep) => (prevStep + 1) % icons.length);
        }, 1000);

        return () => {
            clearInterval(intervalId);
            clearInterval(iconIntervalId);
        };
    }, [start, onTimeout]);

    const animation = icons[step];

    return (
        <div className={styles.countDownContainer}>
            {seconds > 0 ? (
                <>
                    <h1>Finding a match {animation}</h1>
                    <h1>{seconds} seconds</h1>
                </>
            ) : (
                <h1>Time's up!</h1>
            )}
        </div>
    );
};

export default CountdownTimer;
