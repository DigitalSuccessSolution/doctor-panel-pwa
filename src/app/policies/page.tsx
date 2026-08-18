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
    router.push("/profile");
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
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 sm:-mt-6 sm:-mb-6 lg:-mx-8 animate-fadeIn pb-24 font-sans bg-white min-h-screen">

      {/* Simple List Layout */}
      <div className="bg-white">
        <div className="divide-y divide-slate-200/60">
          {policyItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color.split(" ")[0]} ${item.color.split(" ")[1]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-slate-800 group-hover:text-[#1E4E70] transition-colors truncate">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
