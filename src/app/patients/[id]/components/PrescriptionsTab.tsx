"use client";

import { FileText, PlusCircle, Trash2, Plus, Edit3 } from "lucide-react";
import { Patient } from "@/data/mockData";

interface PrescriptionsTabProps {
  patient: Patient;
  prescriptionList: any[];
  rxLoading: boolean;
  rxWeight: string;
  setRxWeight: (v: string) => void;
  rxTemp: string;
  setRxTemp: (v: string) => void;
  rxBP: string;
  setRxBP: (v: string) => void;
  rxDiagNotes: string;
  setRxDiagNotes: (v: string) => void;
  rxNutrition: string;
  setRxNutrition: (v: string) => void;
  rxNextVisit: string;
  setRxNextVisit: (v: string) => void;
  rxMedicines: Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>;
  setRxMedicines: React.Dispatch<React.SetStateAction<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>>>;
  savingRx: boolean;
  editingRxId?: string | null;
  handleCreatePrescription: (e: React.FormEvent) => void;
  handleAddMedicineRow: () => void;
  handleRemoveMedicineRow: (index: number) => void;
  handleMedicineChange: (index: number, field: string, value: string) => void;
  handleStartEditPrescription?: (rx: any) => void;
  handleCancelEditPrescription?: () => void;
  handleDeletePrescription?: (id: string) => void;
}

export default function PrescriptionsTab({
  patient,
  prescriptionList,
  rxLoading,
  rxWeight,
  setRxWeight,
  rxTemp,
  setRxTemp,
  rxBP,
  setRxBP,
  rxDiagNotes,
  setRxDiagNotes,
  rxNutrition,
  setRxNutrition,
  rxNextVisit,
  setRxNextVisit,
  rxMedicines,
  savingRx,
  editingRxId,
  handleCreatePrescription,
  handleAddMedicineRow,
  handleRemoveMedicineRow,
  handleMedicineChange,
  handleStartEditPrescription,
  handleCancelEditPrescription,
  handleDeletePrescription,
}: PrescriptionsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Create / Edit Rx Form */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleCreatePrescription}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1E4E70]" />
              <span>{editingRxId ? "Edit Clinical Prescription" : "Compose Clinical Prescription"}</span>
            </h3>
            {editingRxId && (
              <button
                type="button"
                onClick={handleCancelEditPrescription}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Vitals subform */}
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Weight</label>
              <input
                type="text"
                value={rxWeight}
                onChange={(e) => setRxWeight(e.target.value)}
                placeholder={`${patient.weight || 6.8} kg`}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Temp</label>
              <input
                type="text"
                value={rxTemp}
                onChange={(e) => setRxTemp(e.target.value)}
                placeholder="98.6 F"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">BP</label>
              <input
                type="text"
                value={rxBP}
                onChange={(e) => setRxBP(e.target.value)}
                placeholder="N/A"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Diagnosis Notes */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">Diagnosis / Observations *</label>
            <textarea
              required
              rows={2}
              value={rxDiagNotes}
              onChange={(e) => setRxDiagNotes(e.target.value)}
              placeholder="e.g. Mild colic, routing checkup, growth status healthy..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
            />
          </div>

          {/* Dynamic Medicines Row Builder */}
          <div className="space-y-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medicines (Rx)</span>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="text-[#1E4E70] text-xs font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {rxMedicines.map((med, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl relative text-xs">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="font-semibold text-slate-500">Name</label>
                    <input
                      type="text"
                      required
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                      placeholder="e.g. Crocin Drops"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-500">Dose</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-500">Freq</label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-500">Duration</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end justify-between gap-1">
                    <button
                      type="button"
                      disabled={rxMedicines.length === 1}
                      onClick={() => handleRemoveMedicineRow(index)}
                      className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl border border-rose-200 disabled:opacity-40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Advice & Next Visit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Nutrition Recommendations</label>
              <input
                type="text"
                value={rxNutrition}
                onChange={(e) => setRxNutrition(e.target.value)}
                placeholder="e.g. Iron rich purée, breastfeed every 3 hrs..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Next Visit Date</label>
              <input
                type="date"
                value={rxNextVisit}
                onChange={(e) => setRxNextVisit(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingRx || !rxDiagNotes}
            className="w-full bg-[#1E4E70] text-white hover:bg-[#153852] text-xs font-semibold py-3 rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {editingRxId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{savingRx ? (editingRxId ? "Updating Rx..." : "Submitting Rx...") : (editingRxId ? "Update Prescription" : "Save & Issue Prescription")}</span>
          </button>
        </form>
      </div>

      {/* Right Side: Prescription History List */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Prescription Logs History
          </h3>

          {rxLoading ? (
            <p className="text-center text-xs text-slate-400 py-6">Loading Rx records...</p>
          ) : prescriptionList.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No previous prescriptions recorded.</p>
          ) : (
            <div className="space-y-3">
              {prescriptionList.map((rx) => (
                <div key={rx.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-1.5">
                    <span className="font-bold text-slate-800">{rx.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditPrescription && handleStartEditPrescription(rx)}
                        className="text-[#1E4E70] hover:text-[#153852] hover:bg-slate-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-[#1E4E70]/30"
                        title="Edit Prescription"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePrescription && handleDeletePrescription(rx.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer"
                        title="Delete Prescription"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    <strong>Diagnosis:</strong> {rx.diagnosis}
                  </p>
                  {Array.isArray(rx.medicines) && rx.medicines.length > 0 && (
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <strong className="block text-slate-700">Medicines ({rx.medicines.length}):</strong>
                      {rx.medicines.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between font-semibold">
                          <span>• {m.medicineName || m.name}</span>
                          <span>{m.dosage} ({m.frequency})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {rx.nutritionRecommendations && (
                    <p className="text-[11px] text-[#1E4E70] bg-[#F0F7FF] p-2 rounded-lg border border-[#BEE0FF]">
                      <strong>Nutrition:</strong> {rx.nutritionRecommendations}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
