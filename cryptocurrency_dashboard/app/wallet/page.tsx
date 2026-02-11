"use client";

import { useWallet } from "@/context/WalletContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Wallet, Copy, ExternalLink, QrCode, ArrowDownLeft, ArrowUpRight, Coins, Globe, History } from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
    const { account, balance, isConnected, connectWallet, disconnectWallet } = useWallet();
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (account) {
            navigator.clipboard.writeText(account);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 min-w-0 overflow-x-hidden md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Topbar />

                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                My Wallet
                            </h1>
                            <p className="text-muted-foreground mt-2">Manage your connected wallet and view your assets.</p>
                        </div>

                        {!isConnected ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-border shadow-xl text-center">
                                <div className="p-4 bg-purple-500/20 rounded-full mb-6 relative">
                                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                                    <Wallet size={48} className="text-purple-400 relative z-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
                                <p className="text-muted-foreground max-w-md mb-8">
                                    Connect your crypto wallet to access your personalized dashboard, view your balance, and manage your portfolio.
                                </p>
                                <button
                                    onClick={connectWallet}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
                                >
                                    Connect Wallet
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 text-left">
                                    <div className="p-6 bg-muted/20 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                                        <Coins className="text-yellow-500 mb-4 h-8 w-8" />
                                        <h3 className="font-semibold mb-2">Store Assets</h3>
                                        <p className="text-sm text-muted-foreground">Securely manage your ETH and ERC-20 tokens in one place.</p>
                                    </div>
                                    <div className="p-6 bg-muted/20 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                                        <History className="text-blue-500 mb-4 h-8 w-8" />
                                        <h3 className="font-semibold mb-2">Track History</h3>
                                        <p className="text-sm text-muted-foreground">View your complete transaction history and portfolio growth.</p>
                                    </div>
                                    <div className="p-6 bg-muted/20 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                                        <Globe className="text-purple-500 mb-4 h-8 w-8" />
                                        <h3 className="font-semibold mb-2">Web3 Ready</h3>
                                        <p className="text-sm text-muted-foreground">Connect to top DApps and explore the decentralized web.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Wallet Card */}
                                <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Wallet size={120} />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                            <span className="text-sm font-medium uppercase tracking-wider">Total Balance</span>
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-8">
                                            <span className="text-4xl font-bold text-foreground">
                                                {balance ? parseFloat(balance).toFixed(4) : "0.00"}
                                            </span>
                                            <span className="text-xl text-purple-400 font-medium">ETH</span>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <button className="flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] text-sm md:text-base">
                                                    <ArrowDownLeft size={18} />
                                                    Receive
                                                </button>
                                                <button className="flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] text-sm md:text-base">
                                                    <ArrowUpRight size={18} />
                                                    Send
                                                </button>
                                            </div>

                                            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                                                <label className="text-xs text-muted-foreground mb-1 block">Wallet Address</label>
                                                <div className="flex items-center justify-between gap-3">
                                                    <code className="text-xs md:text-sm font-mono text-foreground truncate max-w-[200px] md:max-w-none">
                                                        {account}
                                                    </code>
                                                    <button
                                                        onClick={copyAddress}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground shrink-0"
                                                        title="Copy Address"
                                                    >
                                                        {copied ? <span className="text-green-400 text-xs">Copied!</span> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={disconnectWallet}
                                                    className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    Disconnect
                                                </button>
                                                <a
                                                    href={`https://etherscan.io/address/${account}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 px-4 py-2.5 bg-card hover:bg-accent border border-border rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span>Explorer</span>
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Assets & Web3 */}
                                <div className="space-y-6">
                                    {/* Assets Section */}
                                    <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Coins size={18} className="text-yellow-500" />
                                                Store Assets
                                            </h3>
                                            <button className="text-xs text-purple-400 hover:text-purple-300">Add Token</button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">ETH</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Ethereum</p>
                                                        <p className="text-xs text-muted-foreground">Mainnet</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-sm">{balance ? parseFloat(balance).toFixed(4) : "0.00"}</p>
                                                    <p className="text-xs text-muted-foreground text-green-400">Secure</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">USDT</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Tether USD</p>
                                                        <p className="text-xs text-muted-foreground">ERC-20</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-sm">0.00</p>
                                                    <p className="text-xs text-muted-foreground text-green-400">Secure</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Web3 / DApps */}
                                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/30 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                                <Globe size={24} className="text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">Web3 & DApps</h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Connect your wallet to decentralized applications to swap tokens, stake assets, and explore the metaverse.
                                                </p>
                                                <button className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium">
                                                    Explore DApps
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isConnected && (
                            /* Transaction History Section */
                            <div className="bg-card rounded-2xl border border-border p-6 shadow-xl mt-6">
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <History size={20} className="text-muted-foreground" />
                                    Transaction History
                                </h3>
                                <div className="space-y-1">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-colors border-b border-border/50 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {i % 2 === 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{i % 2 === 0 ? "Received ETH" : "Sent ETH"}</p>
                                                    <p className="text-xs text-muted-foreground">From: 0x12...34</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium text-sm ${i % 2 === 0 ? 'text-emerald-400' : 'text-foreground'}`}>
                                                    {i % 2 === 0 ? "+" : "-"}{0.5 * i} ETH
                                                </p>
                                                <p className="text-xs text-muted-foreground">Today, 12:30 PM</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
