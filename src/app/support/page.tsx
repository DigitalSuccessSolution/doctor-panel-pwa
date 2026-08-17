"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PhoneCall,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Plus,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { supportService, SupportTicket } from "@/services/supportService";

export default function SupportPage() {
  const router = useRouter();
  const { addNotification } = useDoctorData();

  const [activeTab, setActiveTab] = useState<"tickets" | "new" | "faq">("tickets");

  // Backend Support Tickets list
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  // Form state
  const [category, setCategory] = useState("Assign New Parent / Child Patient Account");
  const [priority, setPriority] = useState<"Low" | "Medium" | "Urgent">("Medium");
  const [parentOrChildId, setParentOrChildId] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState("");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await supportService.getTickets();
      if (res.success && Array.isArray(res.data)) {
        setTicketsList(res.data);
      } else {
        setTicketsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch tickets from backend:", err);
      setTicketsList([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const generatedId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await supportService.createTicket({
        subject: category,
        message: `${description} ${parentOrChildId ? `(Target ID: ${parentOrChildId})` : ""}`,
        priority: priority === "Urgent" ? "high" : "medium",
      });

      if (res.success && res.data) {
        const backendId = String(res.data._id || res.data.id || "");
        setSubmittedTicketId(backendId);
      } else {
        setSubmittedTicketId("");
      }
      fetchTickets();
    } catch (err) {
      console.warn("Backend support ticket API warning:", err);
      setSubmittedTicketId("");
    } finally {
      addNotification({
        title: `Admin Ticket Submitted`,
        message: `Priority ${priority}: ${category} request dispatched to support.`,
        timestamp: "Just now",
        read: false,
        type: "system",
        priority: priority === "Urgent" ? "high" : "normal",
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleSendReply = async (ticketId: string) => {
    const text = replyTextMap[ticketId];
    if (!text || !text.trim()) return;

    setReplyingId(ticketId);
    try {
      const res = await supportService.replyToTicket(ticketId, text);
      if (res.success) {
        setReplyTextMap((prev) => ({ ...prev, [ticketId]: "" }));
        fetchTickets();
      } else {
        alert(res.message || "Failed to post reply");
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setReplyingId(null);
    }
  };

  const handleResetForm = () => {
    setCategory("Assign New Parent / Child Patient Account");
    setParentOrChildId("");
    setDescription("");
    setPriority("Medium");
    setIsSubmitted(false);
    setActiveTab("tickets");
  };

  const faqList = [
    {
      q: "How do I request a new Parent or Child patient account to be assigned to me?",
      a: "Submit a ticket choosing category 'Assign New Parent / Child Patient Account' with the parent's phone number or child's registration code. Super Admin will link the patient to your portal within 2 hours.",
    },
    {
      q: "Is the Moncradel Doctor Portal free to use for pediatricians?",
      a: "Yes! Core clinical intake, WHO z-score growth percentile calculation, e-prescriptions, and nutrition charts are 100% complimentary.",
    },
    {
      q: "How do payouts work for completed tele-consultations?",
      a: "Payout settlements are calculated weekly and transferred directly to the bank account saved in your Doctor Profile.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-24 font-sans overflow-hidden">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Doctor Support Desk
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Raise ticket inquiries, account assignment requests & view admin responses
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("new")}
            className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Ticket</span>
          </button>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1 max-w-md">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "tickets" ? "bg-white text-[#1E4E70] shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Support Tickets ({ticketsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "new" ? "bg-white text-[#1E4E70] shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Raise Ticket</span>
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "faq" ? "bg-white text-[#1E4E70] shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Help</span>
        </button>
      </div>

      {/* 1. TICKETS LIST TAB */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Your Support Tickets</h3>
            <button
              onClick={fetchTickets}
              className="p-2 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              title="Refresh Tickets"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTickets ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loadingTickets ? (
            <div className="py-12 text-center text-xs text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">
              Loading support tickets...
            </div>
          ) : ticketsList.length === 0 ? (
            <div className="py-14 text-center space-y-3 border border-dashed border-slate-200 rounded-3xl bg-white p-8">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Support Tickets Raised Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "+ Raise New Ticket" to send an inquiry or patient assignment request to Super Admin.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("new")}
                className="bg-[#1E4E70] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                + Create First Ticket
              </button>
            </div>
          ) : (
            ticketsList.map((ticket, idx) => {
              const ticketId = String(ticket._id || ticket.id || idx);

              return (
                <div
                  key={ticketId}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 font-sans"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#1E4E70] bg-[#1E4E70]/10 px-2.5 py-1 rounded-lg">
                        {ticketId}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{ticket.subject}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                          ticket.priority === "high"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {ticket.priority || "Medium"} Priority
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                          ticket.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ticket.status === "in_progress"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {ticket.status ? ticket.status.replace("_", " ") : "Open"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    {ticket.message}
                  </p>

                  {/* Replies Chain */}
                  {ticket.replies && ticket.replies.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Admin & Doctor Responses
                      </span>
                      <div className="space-y-2 pl-3 border-l-2 border-slate-200">
                        {ticket.replies.map((reply, rIdx) => (
                          <div key={rIdx} className="bg-slate-100/70 p-3 rounded-xl space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                              <span>{reply.senderRole || "Admin"}</span>
                              <span>{reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}</span>
                            </div>
                            <p className="text-slate-800 font-medium">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Input Form */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a follow-up response to support..."
                      value={replyTextMap[ticketId] || ""}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [ticketId]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleSendReply(ticketId)}
                      className="flex-1 text-xs font-medium px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70] text-slate-900"
                    />
                    <button
                      onClick={() => handleSendReply(ticketId)}
                      disabled={replyingId === ticketId}
                      className="bg-[#1E4E70] hover:bg-[#153852] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{replyingId === ticketId ? "Sending..." : "Reply"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. RAISE NEW TICKET TAB */}
      {activeTab === "new" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Support Ticket Created Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ticket ID <span className="font-mono font-bold text-[#1E4E70]">{submittedTicketId}</span> has been dispatched to Super Admin support.
                </p>
              </div>
              <button
                onClick={handleResetForm}
                className="bg-[#1E4E70] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                View Support Tickets List
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Raise Support Inquiry / Patient Request</h3>
                <p className="text-xs text-slate-500">Fill out details below to send directly to Admin support.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Category / Subject*</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70] text-slate-900"
                  >
                    <option value="Assign New Parent / Child Patient Account">Assign New Parent / Child Patient Account</option>
                    <option value="Prescription & e-Rx Sync Assistance">Prescription & e-Rx Sync Assistance</option>
                    <option value="Bank Payout & Earnings Settlement Inquiry">Bank Payout & Earnings Settlement Inquiry</option>
                    <option value="Technical Issue / Bug Report">Technical Issue / Bug Report</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70] text-slate-900"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Target Parent Mobile / Child Code (Optional)</label>
                <input
                  type="text"
                  value={parentOrChildId}
                  onChange={(e) => setParentOrChildId(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or CHILD-8842"
                  className="w-full text-xs font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70] text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Detailed Message / Description*</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your inquiry or detail the patient assignment request..."
                  className="w-full text-xs font-medium p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70] text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs py-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Dispatching Ticket..." : "Submit Ticket to Support"}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. FAQ HELP TAB */}
      {activeTab === "faq" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
          <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqList.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100/70 font-semibold text-xs text-slate-900 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openFaq === idx && (
                  <p className="p-4 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200 bg-white">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
