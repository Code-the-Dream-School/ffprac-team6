import { NextResponse } from 'next/server';
import db from '@lib/mongo/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';

/**
 * @param {NextResponse} res
 * @param {NextRequest} req
 */

export const POST = async req => {
    await db.connect();
    const requestBody = await req.json();
    const token = requestBody.token;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: "The link is no longer valid" }), { status: 400 });
        }

        return new NextResponse(JSON.stringify({ message: "Token is verified", email: user.email }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
