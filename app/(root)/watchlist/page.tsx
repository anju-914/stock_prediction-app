import { getWatchlist } from '@/lib/actions/watchlist.actions';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import WatchlistButton from '@/components/WatchlistButton';
import Link from 'next/link';
import { BookmarkX } from 'lucide-react';

const WatchlistPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect('/sign-in');

    const watchlist = await getWatchlist();

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
                    <p className="text-gray-400 mt-1">{watchlist.length} stock{watchlist.length !== 1 ? 's' : ''} tracked</p>
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BookmarkX className="h-16 w-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Your watchlist is empty</h2>
                    <p className="text-gray-500 mb-6">Search for stocks and add them to track here</p>
                    <Link href="/search" className="yellow-btn px-6 py-2 rounded-lg font-medium">
                        Browse Stocks
                    </Link>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-900 border-b border-gray-800">
                        <tr>
                            <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Symbol</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Company</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Added</th>
                            <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {watchlist.map((stock) => (
                            <tr key={stock.symbol} className="bg-gray-950 hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4">
                                    <Link href={`/stocks/${stock.symbol}`} className="font-bold text-yellow-400 hover:text-yellow-300">
                                        {stock.symbol}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/stocks/${stock.symbol}`} className="text-white hover:text-gray-300">
                                        {stock.company}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(stock.addedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <WatchlistButton
                                        symbol={stock.symbol}
                                        company={stock.company}
                                        isInWatchlist={true}
                                        showTrashIcon={true}
                                        type="icon"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;