type Props = {
  index: number;
  name: string;
  logo: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  highlight: boolean;
};

export default function BlockchainRow({
  index,
  name,
  logo,
  price,
  change,
  volume,
  marketCap,
  highlight,
}: Props) {
  const up = change >= 0;

  return (
    <tr
      className={`
        border-b border-border
        transition-colors duration-200
        hover:bg-muted/50
        ${highlight ? "bg-emerald-500/[0.06]" : ""}
      `}
    >
      <td className="px-2 py-3 text-muted-foreground pl-6">{index}</td>

      <td className="px-2 py-3 flex items-center gap-2">
        <span className="text-foreground font-medium">
          {name}
        </span>
      </td>

      <td className="px-2 py-3 text-foreground font-medium text-sm">
        ${price ? price.toLocaleString() : "N/A"}
      </td>

      <td
        className={`px-2 py-3 font-medium text-sm ${up ? "text-emerald-400" : "text-rose-400"
          }`}
      >
        {up ? "▲" : "▼"} {change ? change.toFixed(2) : "0.00"}%
      </td>

      <td className="px-2 py-3 text-muted-foreground text-sm">
        ${volume ? volume.toLocaleString() : "N/A"}
      </td>

      <td className="px-2 py-3 text-muted-foreground text-sm pr-6">
        ${marketCap ? marketCap.toLocaleString() : "N/A"}
      </td>
    </tr>
  );
}
