'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');
        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return [];
        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];
        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function getWatchlist(): Promise<StockWithData[]> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return [];

        await connectToDatabase();
        const items = await Watchlist.find({ userId: session.user.id }).lean();

        return items.map((item) => ({
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
        }));
    } catch (err) {
        console.error('getWatchlist error:', err);
        return [];
    }
}

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();
        await Watchlist.create({ userId: session.user.id, symbol, company });
        revalidatePath('/watchlist');
        return { success: true };
    } catch (err: any) {
        if (err?.code === 11000) return { success: false, error: 'Already in watchlist' };
        console.error('addToWatchlist error:', err);
        return { success: false, error: 'Failed to add to watchlist' };
    }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();
        await Watchlist.deleteOne({ userId: session.user.id, symbol });
        revalidatePath('/watchlist');
        return { success: true };
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        return { success: false, error: 'Failed to remove from watchlist' };
    }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return false;
        await connectToDatabase();
        const item = await Watchlist.findOne({ userId: session.user.id, symbol });
        return !!item;
    } catch {
        return false;
    }
}