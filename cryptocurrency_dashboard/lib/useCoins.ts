import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTopCoins(currency: string, limit: number) {
    const { data, error, isLoading } = useSWR(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
        fetcher
    );

    return {
        data,
        isLoading,
        error,
    };
}
