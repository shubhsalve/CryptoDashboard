"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers, BrowserProvider } from "ethers";

interface WalletContextType {
    account: string | null;
    balance: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnected: boolean;
}

declare global {
    interface Window {
        ethereum?: any;
    }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        checkConnection();
        if (typeof window !== "undefined" && window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('disconnect', handleDisconnect);
        }
        return () => {
            if (typeof window !== "undefined" && window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('disconnect', handleDisconnect);
            }
        };
    }, []);

    const updateBalance = async (address: string) => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const bal = await provider.getBalance(address);
                setBalance(ethers.formatEther(bal));
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }
    };

    const checkConnection = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    const address = await accounts[0].getAddress();
                    setAccount(address);
                    setIsConnected(true);
                    updateBalance(address);
                }
            } catch (error) {
                console.error("Error checking connection:", error);
            }
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            updateBalance(accounts[0]);
        } else {
            handleDisconnect();
        }
    };

    const handleDisconnect = () => {
        setAccount(null);
        setBalance(null);
        setIsConnected(false);
    };

    const connectWallet = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                    updateBalance(accounts[0]);
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install a wallet extension like MetaMask!");
        }
    };

    const disconnectWallet = () => {
        // Note: Most dApp browsers don't support programmatic disconnect. 
        // We can only clear our local state.
        setAccount(null);
        setBalance(null);
        setIsConnected(false);
    };

    return (
        <WalletContext.Provider value={{ account, balance, connectWallet, disconnectWallet, isConnected }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
