import nodemailer from 'nodemailer'

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    })
    await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to,
        subject,
        text,
        html,
    })
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
