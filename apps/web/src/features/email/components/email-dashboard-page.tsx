"use client";

import { useMemo, useState } from "react";
import { Mail, Send, Inbox, Archive, Search, Paperclip, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type EmailFolder = "Inbox" | "Sent" | "Drafts" | "Archived";

type EmailItem = {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  folder: EmailFolder;
  preview: string;
  timestamp: string;
  unread: boolean;
  hasAttachment: boolean;
};

const MOCK_EMAILS: EmailItem[] = [
  {
    id: "EML-001",
    subject: "Monthly Barangay Health Report Submission",
    sender: "cityhealth@city.gov.ph",
    recipient: "barangay@salaza.gov.ph",
    folder: "Inbox",
    preview: "Please submit your April 2026 consolidated health report by May 3, 2026.",
    timestamp: "2026-04-29T09:15:00+08:00",
    unread: true,
    hasAttachment: true,
  },
  {
    id: "EML-002",
    subject: "Request for VAWC Case Coordination Meeting",
    sender: "mswdo@city.gov.ph",
    recipient: "barangay@salaza.gov.ph",
    folder: "Inbox",
    preview: "We are requesting a coordination meeting regarding pending referrals this week.",
    timestamp: "2026-04-28T16:30:00+08:00",
    unread: true,
    hasAttachment: false,
  },
  {
    id: "EML-003",
    subject: "Re: Permit Verification for New Establishment",
    sender: "barangay@salaza.gov.ph",
    recipient: "businessdesk@city.gov.ph",
    folder: "Sent",
    preview: "Attached is the verification form and supporting documents for your review.",
    timestamp: "2026-04-27T13:12:00+08:00",
    unread: false,
    hasAttachment: true,
  },
  {
    id: "EML-004",
    subject: "Draft: Barangay Assembly Reminder",
    sender: "barangay@salaza.gov.ph",
    recipient: "residents@salaza.local",
    folder: "Drafts",
    preview: "Good day residents, this is a reminder for the upcoming barangay assembly...",
    timestamp: "2026-04-27T08:20:00+08:00",
    unread: false,
    hasAttachment: false,
  },
  {
    id: "EML-005",
    subject: "Completed: Q1 Audit Document Request",
    sender: "audit@city.gov.ph",
    recipient: "barangay@salaza.gov.ph",
    folder: "Archived",
    preview: "Thank you for submitting the requested financial attachments.",
    timestamp: "2026-04-20T10:00:00+08:00",
    unread: false,
    hasAttachment: false,
  },
];

const FOLDERS: EmailFolder[] = ["Inbox", "Sent", "Drafts", "Archived"];

export function EmailDashboardPage() {
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("Inbox");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(MOCK_EMAILS[0]?.id ?? "");

  const filteredEmails = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_EMAILS.filter((item) => item.folder === activeFolder).filter((item) =>
      q ? `${item.subject} ${item.sender} ${item.preview}`.toLowerCase().includes(q) : true
    );
  }, [activeFolder, search]);

  const selectedEmail = useMemo(
    () => filteredEmails.find((item) => item.id === selectedId) ?? filteredEmails[0] ?? null,
    [filteredEmails, selectedId]
  );

  const metrics = useMemo(() => {
    const inboxCount = MOCK_EMAILS.filter((item) => item.folder === "Inbox").length;
    const unreadCount = MOCK_EMAILS.filter((item) => item.folder === "Inbox" && item.unread).length;
    const sentCount = MOCK_EMAILS.filter((item) => item.folder === "Sent").length;
    return { inboxCount, unreadCount, sentCount };
  }, []);

  return (
    <section className="space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Email</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Manage official barangay email communications, notices, and coordination messages.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Card label="Inbox Messages" value={metrics.inboxCount} icon={Inbox} />
          <Card label="Unread" value={metrics.unreadCount} icon={Mail} />
          <Card label="Sent Today" value={metrics.sentCount} icon={Send} />
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] p-3">
          {FOLDERS.map((folder) => (
            <button
              key={folder}
              type="button"
              onClick={() => setActiveFolder(folder)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                activeFolder === folder
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-[var(--card-soft)] text-[var(--muted)]"
              )}
            >
              {folder}
            </button>
          ))}
          <div className="relative ml-auto w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
            />
          </div>
        </div>

        <div className="grid min-h-[460px] gap-0 lg:grid-cols-[360px_1fr]">
          <div className="border-r border-[var(--border)]">
            {filteredEmails.length === 0 ? (
              <div className="p-6 text-sm text-[var(--muted)]">No email found in this folder.</div>
            ) : (
              <ul className="divide-y divide-[var(--border)]/50">
                {filteredEmails.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "w-full px-4 py-3 text-left transition-colors hover:bg-[var(--card-soft)]/40",
                        selectedEmail?.id === item.id ? "bg-[var(--card-soft)]/50" : ""
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate text-sm", item.unread ? "font-semibold text-[var(--text)]" : "text-[var(--text)]")}>
                          {item.subject}
                        </p>
                        {item.unread ? <span className="h-2 w-2 rounded-full bg-[var(--primary)]" /> : null}
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">{item.sender}</p>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">{item.preview}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-5">
            {selectedEmail ? (
              <article className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text)]">{selectedEmail.subject}</h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      From: {selectedEmail.sender} • To: {selectedEmail.recipient}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <Clock3 className="h-3.5 w-3.5" />
                    {new Date(selectedEmail.timestamp).toLocaleString("en-US")}
                  </div>
                </div>

                <p className="text-sm leading-6 text-[var(--text)]">{selectedEmail.preview}</p>

                <div className="flex flex-wrap gap-2">
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
                    <Mail className="h-3.5 w-3.5" />
                    Reply
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
                    <Send className="h-3.5 w-3.5" />
                    Forward
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </button>
                  {selectedEmail.hasAttachment ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
                      <Paperclip className="h-3.5 w-3.5" />
                      Attachment included
                    </span>
                  ) : null}
                </div>
              </article>
            ) : (
              <div className="text-sm text-[var(--muted)]">Select an email to preview.</div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

function Card({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <div className="rounded-lg border border-indigo-300/30 bg-indigo-500/5 p-2 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)] tracking-tight">{value}</p>
    </article>
  );
}
