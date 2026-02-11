import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // STRICT REAL EMAIL MODE
        // 1. Validate Configuration strictly
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes("REPLACE_WITH")) {
            return NextResponse.json({
                success: false,
                error: "System Sender Email not configured. Please configure EMAIL_USER in .env.local (This single account sends OTPs to ALL users)."
            });
        }

        try {
            // 2. Create Transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // 3. Send Email
            await transporter.sendMail({
                from: '"CryptoDashboard" <' + process.env.EMAIL_USER + '>',
                to: email,
                subject: 'Your Login OTP - CryptoDashboard',
                text: `Your verification code is: ${otp}`,
                html: `<b>Your verification code is: ${otp}</b>`,
            });

            return NextResponse.json({
                success: true,
                otp: otp, // We must return OTP to client state for verification logic to work, but it's not shown to user
                message: `OTP sent sent to ${email}`
            });

        } catch (err: any) {
            console.error("Failed to send email:", err);
            // 4. Strict Error Response
            let errorMsg = "Failed to send email.";
            if (err.message?.includes("535") || err.message?.includes("Invalid login")) {
                errorMsg = "Login Failed: Google rejected the password. Google requires an App Password (not your Gmail password). Generate it here: https://myaccount.google.com/apppasswords";
            }
            return NextResponse.json({
                success: false,
                error: errorMsg
            });
        }

    } catch (error) {
        console.error('Error handling OTP request:', error);
        return NextResponse.json({ error: 'Critical error: ' + (error as Error).message }, { status: 500 });
    }
} 