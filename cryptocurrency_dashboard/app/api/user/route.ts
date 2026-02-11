import { NextResponse } from 'next/server';
import { saveUser, deleteUser, findUser, UserProfile } from '@lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await findUser(email);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, fullName, phone, country, userId, memberSince, password } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Construct profile
        const profile: UserProfile = {
            email,
            fullName: fullName || 'Unknown',
            phone: phone || 'Not Set',
            country: country || 'Unknown',
            userId: userId || `USR-${Math.floor(Math.random() * 100000)}`,
            memberSince: memberSince || new Date().toLocaleDateString(),
            password: password // Store password (In production, hash this!)
        };

        await saveUser(profile);

        return NextResponse.json({ success: true, user: profile });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const success = await deleteUser(email);
    if (success) {
        return NextResponse.json({ success: true, message: 'User deleted' });
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
}
