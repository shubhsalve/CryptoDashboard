interface StatProps {
  coin: string;
  price: string;
  change: string;
}

export default function StatCard({ coin, price, change }: StatProps) {
  const isNegative = change.startsWith("-");

  return (
    <div className="bg-card p-5 rounded-xl shadow-md border border-border">
      <h3 className="text-md font-semibold">{coin}</h3>

      <p className="text-2xl font-bold mt-2">${price}</p>

      <p className={`${isNegative ? "text-red-400" : "text-green-400"} text-sm mt-1`}>
        {change}
      </p>
    </div>
  );
}
