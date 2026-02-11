"use client";

import { useWallet } from "../context/WalletContext";
import { Wallet } from "lucide-react";

export default function ConnectWalletButton() {
    const { account, connectWallet, isConnected, disconnectWallet } = useWallet();

    const handleConnect = async () => {
        if (isConnected) {
            // Optional: Maybe confirm disconnect or just nothing?
            // For now, let's just allow connecting if not connected.
            // Or if connected, clicking might disconnect or show details.
            // Let's implement toggle logic for now or just show address.
            disconnectWallet();
        } else {
            await connectWallet();
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <button
            onClick={handleConnect}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
        border backdrop-blur-md shadow-lg
        ${isConnected
                    ? "bg-purple-500/10 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                    : "bg-card/80 border-border text-foreground hover:bg-accent hover:border-purple-500/50 hover:text-purple-400 hover:shadow-purple-500/20"}
      `}
        >
            <Wallet size={18} className={isConnected ? "text-purple-400" : "text-muted-foreground group-hover:text-purple-400"} />
            <span className="hidden md:inline">{isConnected && account ? formatAddress(account) : "Connect Wallet"}</span>
        </button>
    );
}
