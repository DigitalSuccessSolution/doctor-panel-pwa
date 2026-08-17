"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Users,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function PoliciesDirectoryPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/profile");
    }
  };

  const policyItems = [
    {
      title: "Privacy & Data Security",
      desc: "AES-256 encrypted patient data protection, HIPAA & PWA sandbox security.",
      href: "/policies/privacy",
      icon: ShieldCheck,
      badge: "Encrypted",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      title: "Terms of Service",
      desc: "Practitioner agreement, telemedicine guidelines & clinical responsibility.",
      href: "/policies/terms",
      icon: FileText,
      badge: "Agreement",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
    },
    {
      title: "Doctor Partner Program",
      desc: "Trusted by 2,500+ pediatricians across India. Free OPD tools & WHO charts.",
      href: "/policies/partner",
      icon: Users,
      badge: "Verified",
      color: "bg-purple-50 text-purple-600 border-purple-200/80",
    },
    {
      title: "Clinical FAQs",
      desc: "Frequently asked questions about offline PWA mode, e-rx, and parent delivery.",
      href: "/policies/faq",
      icon: HelpCircle,
      badge: "Guidance",
      color: "bg-amber-50 text-amber-600 border-amber-200/80",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-24 font-sans">
      <div className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-card space-y-6">
        {/* Unified Top Header Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-lg bg-[#F8F9FA] hover:bg-[#A5D8FF]/30 text-slate-700 hover:text-[#1E4E70] flex items-center justify-center transition-all shrink-0 cursor-pointer border border-slate-200/60"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight leading-snug truncate">
                Policies & Governance
              </h1>
              <p className="text-xs text-slate-500 font-medium truncate mt-1">
                Clinical data protection, HIPAA compliance & practitioner terms
              </p>
            </div>
          </div>

          <span className="bg-[#A5D8FF]/30 text-[#1E4E70] border border-[#A5D8FF]/60 px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            2026 Edition
          </span>
        </div>

        {/* Desktop 2-Column Grid / Mobile Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policyItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-5 border border-slate-200/80 hover:border-[#1E4E70] bg-white hover:bg-slate-50/80 rounded-lg flex items-center justify-between gap-4 group cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-semibold mt-0.5 ${item.color.split(" ")[0]} ${item.color.split(" ")[1]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-semibold text-slate-900 group-hover:text-[#1E4E70] transition-colors">
                        {item.title}
                      </h2>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#1E4E70] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
