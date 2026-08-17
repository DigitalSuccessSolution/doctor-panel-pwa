"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Calendar,
  FileText,
  CheckCircle2,
  Volume2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  X,
  RefreshCw,
} from "lucide-react";
import { playIOSNotificationSound } from "@/utils/audio";
import { notificationService } from "@/services/notificationService";

export interface DoctorNotification {
  id: string;
  patientName?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: string;
  priority?: "normal" | "high";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "growth" | "appointment" | "unread">("all");
  const [showLiveBanner, setShowLiveBanner] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && Array.isArray(res.data)) {
        const mapped: DoctorNotification[] = res.data.map((n: any, idx: number) => ({
          id: n._id || n.id || String(idx),
          patientName: n.title || "Clinical Notification",
          title: n.title || "Notification",
          message: n.message || "No message body",
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today",
          read: !!n.isRead,
          type: n.type || "system",
          priority: n.priority || "normal",
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch notifications from backend:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = () => {
    playIOSNotificationSound();
    notifications.forEach((n) => {
      if (n.id) notificationService.markAsRead(n.id).catch(() => {});
    });
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id).catch(() => {});
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSimulateNotification = () => {
    playIOSNotificationSound();
    setShowLiveBanner(true);
    setTimeout(() => setShowLiveBanner(false), 4500);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "growth") return n.type === "growth_alert";
    if (filter === "appointment") return n.type === "appointment";
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans w-full max-w-full overflow-hidden">
      {/* Live Notification Bar Toast Overlay */}
      {showLiveBanner && (
        <div className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3 animate-bounce font-sans">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  LIVE CRITICAL ALERT
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Just Now</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Backend Notification Test Ping
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLiveBanner(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Doctor Notifications
            </h1>
            <span className="bg-[#1E4E70] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time clinical alerts, growth updates, and consultation reminders
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={fetchNotifications}
            className="p-2.5 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
            title="Refresh Notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleSimulateNotification}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            title="Simulate notification bar"
          >
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
            <span>Notification Bar</span>
          </button>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        {[
          { id: "all", label: `All Alerts (${notifications.length})` },
          { id: "unread", label: `Unread (${notifications.filter((n) => !n.read).length})` },
          { id: "growth", label: "Critical Growth Alerts" },
          { id: "appointment", label: "Appointments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playIOSNotificationSound();
              setFilter(tab.id as any);
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? "bg-[#1E4E70] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications List or Clean Empty State */}
      <div className="space-y-3.5 w-full max-w-full min-w-0">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">Fetching live notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="py-14 text-center space-y-3 border border-dashed border-slate-200 rounded-3xl bg-white p-8">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No Notifications Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are all caught up! Real-time alerts and patient updates will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const isHigh = n.priority === "high";
            const Icon =
              n.type === "growth_alert"
                ? AlertTriangle
                : n.type === "appointment"
                ? Calendar
                : FileText;

            return (
              <div
                key={n.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex items-start gap-3.5 w-full max-w-full min-w-0 overflow-hidden ${
                  isHigh
                    ? "bg-rose-50/90 border-rose-200/80 shadow-xs"
                    : !n.read
                    ? "bg-white border-[#A5D8FF] shadow-xs ring-1 ring-[#A5D8FF]/40"
                    : "bg-white border-slate-200/80 opacity-85"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isHigh
                      ? "bg-rose-500 text-white"
                      : !n.read
                      ? "bg-[#1E4E70] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {n.title || n.patientName}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                      <button
                        onClick={() => n.id && handleDeleteNotification(n.id)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-xs font-medium leading-relaxed ${
                      isHigh ? "text-rose-700" : "text-slate-600"
                    }`}
                  >
                    {n.message}
                  </p>

                  {isHigh && (
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href="/patients/2"
                        onClick={() => playIOSNotificationSound()}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        <span>Review Patient Chart</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
