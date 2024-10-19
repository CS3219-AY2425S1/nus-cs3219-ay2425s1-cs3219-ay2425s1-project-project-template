import fs from 'fs';
import path from 'path';

const logsDir = '/usr/src/app/logs';

export function writeLogToFile(log: string) {
    console.log(log);
    const date = new Date().toISOString().slice(0, 10);
    const logFile = path.join(logsDir, `matching-service-${date}.log`);
    const time = new Date().toISOString().slice(11, 19);
    log = `[${time}] ${log}`;

    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFile(logFile, `${log}\n`, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function formatSearchPoolStatus(poolStatus: any): string {
    if (!poolStatus || !poolStatus.users || poolStatus.users.length === 0) {
        return 'The search pool is currently empty.';
    }

    let output = 'Current Search Pool Status:\n';
    poolStatus.users.forEach((user: any, index: any) => {
        output += `\nUser ${index + 1}:\n`;
        output += `- User ID: ${user.userId}\n`;
        output += `- Socket ID: ${user.socketId}\n`;
        output += `- Matching Criteria:\n`;
        output += `  - Topic: ${user.criteria.topic || 'N/A'}\n`;
        output += `  - Difficulty: ${user.criteria.difficulty || 'N/A'}\n`;
        output += `- Start Time: ${new Date(parseInt(user.startTime)).toLocaleString()}\n`;
    });

    return output;
}

export function formatMatchedUsers(data: { matchedUsers: Array<{ userId: string; socketId: string; criteria: { difficulty: string; topic: string; } }> }): string {
    const lines: string[] = [];

    lines.push("Matched Found! Matched Users:\n");

    data.matchedUsers.forEach((user, index) => {
        lines.push(`User ${index + 1}:`);
        lines.push(`  User ID: ${user.userId}`);
        lines.push(`  Socket ID: ${user.socketId}`);
        lines.push(`  Criteria:`);
        lines.push(`    Topic: ${user.criteria.topic}`);
        lines.push(`    Difficulty: ${user.criteria.difficulty}`);
        lines.push(""); // Adding an empty line for better separation
    });

    return lines.join("\n");
}
