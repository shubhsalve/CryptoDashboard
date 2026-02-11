"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Trash2, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationSidebar({ isOpen, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead, requestPermission, addNotification } = useNotifications();

  // 👇 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen, onClose]);

  // Request permission when sidebar opens first time
  useEffect(() => {
    if (isOpen) {
      requestPermission();
      markAllAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-start">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Sidebar / Popover */}
      <div
        ref={ref}
        className="absolute top-20 right-4 w-96 max-h-[80vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 animate-in slide-in-from-right-10 duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Bell size={20} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-xs text-muted-foreground hover:text-purple-500 transition-colors"
          >
            Mark all read
          </button>
        </div>

        {/* Test Button (Optional for verify) */}
        <button
          onClick={() => addNotification('Bitcoin Surge!', 'BTC just hit $100k! 🚀', 'success')}
          className="w-full mb-4 py-2 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-semibold transition-colors"
        >
          ⚡ Simulate Price Alert
        </button>

        {/* List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bell size={40} className="mb-4 opacity-20" />
              <p>No new notifications</p>
              <p className="text-xs mt-1 opacity-60">We'll alert you when prices move!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.read ? 'bg-muted/10 border-transparent' : 'bg-card border-purple-500/30 shadow-sm'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1.5 rounded-full 
                    ${n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                        n.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {n.type === 'success' ? <CheckCircle size={14} /> :
                      n.type === 'warning' ? <AlertTriangle size={14} /> :
                        n.type === 'error' ? <AlertCircle size={14} /> :
                          <Info size={14} />
                    }
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${n.read ? 'text-muted-foreground' : 'text-foreground'}`}>{n.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground/60 mt-2 block">{n.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
