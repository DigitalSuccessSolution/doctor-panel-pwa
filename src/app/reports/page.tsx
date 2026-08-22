"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  IndianRupee,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Receipt,
  FileText,
  TrendingUp,
} from "lucide-react";
import { earningService, EarningApiResponse, EarningItem } from "@/services/earningService";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"financial" | "clinical">("financial");
  const [earningsData, setEarningsData] = useState<EarningApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res = await earningService.getEarnings();
      setEarningsData(res);
    } catch (err) {
      console.error("Error fetching earnings report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const totalEarned = earningsData?.totalEarned ?? 0;
  const paidAmount = earningsData?.paidAmount ?? 0;
  const pendingAmount = earningsData?.pendingAmount ?? 0;
  const earningsCount = earningsData?.count ?? 0;
  const earningsList: EarningItem[] = earningsData?.data || [];

  const handleExportCSV = () => {
    if (!earningsList || earningsList.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Date", "Amount (INR)", "Status", "Notes"];
    const rows = earningsList.map((item) => [
      item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      item.amount.toString(),
      item.status.toUpperCase(),
      (item.notes || "").replace(/,/g, " "),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `earnings_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans overflow-hidden reports-printable-area">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .reports-printable-area, .reports-printable-area * {
            visibility: visible;
          }
          .reports-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          @page { size: auto; margin: 0mm; }
        }
      `}</style>
      {/* Page Header */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Reports & Doctor Earnings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time consultation revenue & payout settlement records
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#1E4E70] border border-[#1E4E70] text-white hover:bg-[#153852] font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-white shrink-0" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full no-print">
        <button
          onClick={() => setActiveTab("financial")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "financial" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Earnings & Payouts</span>
        </button>
        <button
          onClick={() => setActiveTab("clinical")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "clinical" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Clinical Reports</span>
        </button>
      </div>

      {activeTab === "financial" ? (
        <div className="space-y-6">
          {/* Top 4 Financial Metrics Grid (No Dummy Fallbacks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Earned</span>
                <IndianRupee className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">₹{totalEarned.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-500">Total gross revenue</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Paid Out</span>
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1E4E70]">₹{paidAmount.toLocaleString()}</p>
              <p className="text-xs font-medium text-emerald-600">Settled payouts</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Pending Amount</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-700">₹{pendingAmount.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-500">Awaiting settlement</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Payout Records</span>
                <Users className="w-4 h-4 text-[#1E4E70]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{earningsCount}</p>
              <p className="text-xs font-medium text-slate-500">Total entries</p>
            </div>
          </div>

          {/* Backend Earnings Payout Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Consultation Payout History</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Recent consultation earnings and settled payouts</p>
              </div>
              <button
                onClick={fetchEarnings}
                className="p-2 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Refresh Payout Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">Fetching earnings records...</div>
            ) : earningsList.length === 0 ? (
              <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 rounded-lg">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">No Earnings Recorded Yet</h4>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Payout settlements will automatically appear here as consultations are completed and processed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Notes / Detail</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {earningsList.map((item, idx) => (
                      <tr key={item._id || item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 text-slate-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="py-3.5 font-bold text-slate-900 capitalize">{item.staffRole || "Doctor"}</td>
                        <td className="py-3.5 text-slate-600">{item.notes || "Consultation Payout"}</td>
                        <td className="py-3.5 font-bold text-emerald-700">₹{item.amount}</td>
                        <td className="py-3.5 text-right">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                              item.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {item.status === "paid" ? "Paid to Bank" : "Pending Settlement"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Clinical Growth Reports Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Consultations</span>
                <Users className="w-4 h-4 text-[#1E4E70]" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{earningsCount}</p>
              <span className="text-xs font-medium text-slate-500">Recorded Entries</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Paid Amount</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">₹{paidAmount}</p>
              <span className="text-xs font-medium text-slate-500">Settled Revenue</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Payouts</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">₹{pendingAmount}</p>
              <span className="text-xs font-medium text-slate-500">Processing</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">Clinical Reports Summary</h3>
            <p className="text-xs text-slate-500 font-medium">
              Export clinical dataset and pediatric growth summaries
            </p>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#1E4E70]" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Pediatric Clinical Summary Report</h4>
                  <p className="text-[11px] text-slate-500">WHO Growth Z-Scores & OPD Consultations Dataset</p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-[#1E4E70] text-white hover:bg-[#153852] font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
