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
