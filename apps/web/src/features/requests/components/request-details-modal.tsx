"use client";

import { 
  XCircle, 
  FileText, 
  User, 
  FileCheck, 
  BadgeAlert, 
  UserPlus, 
  Inbox, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft, 
  ShieldCheck, 
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import type { 
  Request, 
  RequestStatus 
} from "../types";

interface RequestDetailsModalProps {
  request: Request;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
}

export function RequestDetailsModal({
  request,
  onClose,
  onUpdateStatus,
}: RequestDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-[var(--card-soft)]/50">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{request.id}</h2>
              <p className="text-xs text-[var(--muted)]">
                Submitted on {formatDate(request.submittedAt)} at {new Date(request.submittedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] transition">
            <XCircle className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Entity Section */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Requester Information</h3>
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/30 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[var(--border)] text-slate-400 shadow-sm">
                  <User className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[var(--text)]">{request.entityName}</p>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 uppercase border border-blue-100">{request.entityType}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">ID: {request.entityId}</p>
                </div>
              </div>
            </section>

            {/* Request Content */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Request Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Document Type" value={request.type} icon={FileCheck} />
                <DetailItem label="Priority" value={request.priority} icon={BadgeAlert} />
                <DetailItem label="Assigned Staff" value={request.assignedStaff || "Unassigned"} icon={UserPlus} />
                <DetailItem label="Purpose" value={request.purpose} icon={Inbox} fullWidth />
                {request.remarks && <DetailItem label="Remarks" value={request.remarks} icon={AlertCircle} fullWidth />}
              </div>
            </section>

            {/* Action History */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Activity Timeline</h3>
              <div className="space-y-4">
                {request.timeline.map((evt, idx) => (
                  <div key={evt.id} className="relative flex gap-4">
                    {idx !== request.timeline.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-px bg-[var(--border)]" />
                    )}
                    <div className={cn(
                      "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs",
                      evt.status === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                      evt.status === "Rejected" ? "bg-rose-50 border-rose-200 text-rose-600" :
                      "bg-slate-50 border-slate-200 text-slate-600"
                    )}>
                      {evt.status === "Approved" ? <CheckCircle2 className="h-4 w-4" /> : 
                       evt.status === "Rejected" ? <XCircle className="h-4 w-4" /> : 
                       <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[var(--text)]">{evt.label}</p>
                        <span className="text-[10px] text-[var(--muted)]">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)]">By: {evt.actor}</p>
                      {evt.remarks && (
                        <div className="mt-2 rounded-lg bg-[var(--card-soft)] p-2 text-xs text-[var(--text)] border border-[var(--border)]">
                          {evt.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/50 p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Control Center</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => onUpdateStatus(request.id, "Processing")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm font-bold text-[var(--text)] hover:bg-[var(--card-soft)] transition shadow-sm"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Mark as Processing
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, "Approved")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:brightness-110 transition shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Request
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, "Rejected")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 text-sm font-bold text-white hover:brightness-110 transition shadow-md shadow-rose-600/20"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Request
                </button>
              </div>
              <div className="pt-2 border-t border-[var(--border)]">
                <button 
                  disabled={request.status !== "Approved"}
                  onClick={() => onUpdateStatus(request.id, "Converted")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[var(--primary)]/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Convert to Document
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Admin Notes</h3>
              <textarea 
                placeholder="Add internal notes about this request..."
                className="w-full h-32 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 text-xs outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
              />
              <button className="w-full h-9 rounded-lg bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white transition hover:brightness-125">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon, fullWidth }: { label: string, value: string, icon: LucideIcon, fullWidth?: boolean }) {
  return (
    <div className={cn("space-y-1.5", fullWidth && "sm:col-span-2")}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p>
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 shadow-sm">
        <Icon className="h-4 w-4 text-[var(--muted)]" />
        <span className="text-sm font-medium text-[var(--text)]">{value}</span>
      </div>
    </div>
  );
}
