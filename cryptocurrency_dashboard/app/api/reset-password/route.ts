import { NextResponse } from 'next/server';
import { updateUserPassword, findUser } from '@lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and new password required' }, { status: 400 });
        }

        const user = await findUser(email);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const success = await updateUserPassword(email, password);

        if (success) {
            return NextResponse.json({ success: true, message: 'Password updated successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}