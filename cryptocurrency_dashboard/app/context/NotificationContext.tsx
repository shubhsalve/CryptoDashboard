"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: "success" | "warning" | "error" | "info";
};

type NotificationContextType = {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: Notification["type"]) => void;
    markAllAsRead: () => void;
    requestPermission: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // 🔔 Request Browser Permission on Mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            // Don't auto-request on load to avoid being annoying, 
            // but we can check status.
        }
    }, []);

    const requestPermission = async () => {
        if ("Notification" in window) {
            await Notification.requestPermission();
        }
    };

    const addNotification = (title: string, message: string, type: Notification["type"] = "info") => {
        const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            type
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // 🚀 Trigger Browser Notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
                body: message,
                icon: "/images/profile_logo.jpg", // Optional: Change to your app logo
            });
        }
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, requestPermission }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
