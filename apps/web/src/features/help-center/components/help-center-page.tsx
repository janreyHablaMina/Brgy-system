"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type HelpSectionKey =
  | "getting-started"
  | "dashboard"
  | "residents"
  | "documents"
  | "requests"
  | "reports"
  | "settings"
  | "my-account"
  | "tips";

type HelpArticle = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  important?: string;
};

type HelpSection = {
  key: HelpSectionKey;
  label: string;
  articles: HelpArticle[];
};

const HELP_SECTIONS: HelpSection[] = [
  {
    key: "getting-started",
    label: "Getting Started",
    articles: [
      {
        id: "gs-what",
        title: "What is the system",
        description: "Overview of the Barangay Management System and its purpose.",
        steps: [
          "Use this platform for centralized barangay operations and records.",
          "Modules are grouped by operations: management, requests, reports, and system controls.",
          "Only authorized users can access admin functions.",
        ],
      },
      {
        id: "gs-login",
        title: "How to log in",
        description: "Accessing the system securely using your assigned account.",
        steps: [
          "Open the system URL provided by your barangay IT/admin.",
          "Enter your username/email and password.",
          "If access fails, contact your system admin for account verification.",
        ],
      },
      {
        id: "gs-nav",
        title: "How to navigate dashboard",
        description: "Find modules, quick stats, and key action pages.",
        steps: [
          "Use the left sidebar to open each module.",
          "Use summary cards for quick insights.",
          "Open each module table to perform records management actions.",
        ],
      },
    ],
  },
  {
    key: "residents",
    label: "Residents",
    articles: [
      {
        id: "res-add",
        title: "How to add residents",
        description: "Create resident profiles correctly and avoid duplicates.",
        steps: [
          "Go to Residents and click add/new resident.",
          "Fill required personal and address details.",
          "Review data, then save and verify the generated resident ID.",
        ],
        important: "Tip: Search by full name and birthdate first to avoid duplicate records.",
      },
    ],
  },
  {
    key: "documents",
    label: "Documents",
    articles: [
      {
        id: "doc-generate",
        title: "How to generate reports/documents",
        description: "Generate document outputs with accurate source data.",
        steps: [
          "Open Documents or Reports module and choose target template/report.",
          "Apply filters and verify source records.",
          "Generate and export as needed (PDF/Excel if available).",
        ],
      },
      {
        id: "doc-print",
        title: "Cannot print documents",
        description: "Basic checks when print output is missing or blank.",
        steps: [
          "Re-generate the document and preview before printing.",
          "Check if browser print settings are set to correct page size.",
          "If issue persists, create a Help Desk ticket with screenshot and document ID.",
        ],
      },
    ],
  },
  {
    key: "requests",
    label: "Requests",
    articles: [
      {
        id: "req-manage",
        title: "How to manage requests",
        description: "Review and process service requests efficiently.",
        steps: [
          "Open Requests module and filter by status or type.",
          "Open request details to validate requirements.",
          "Approve, reject, or forward the request based on process rules.",
        ],
      },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    articles: [
      {
        id: "rep-export",
        title: "How to export reports",
        description: "Generate compliance and operational reports.",
        steps: [
          "Open Reports and select report type.",
          "Set date and category filters.",
          "Use export actions for CSV/PDF as needed.",
        ],
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    articles: [
      {
        id: "set-config",
        title: "How to update system settings",
        description: "Safely update barangay config, branding, and fees.",
        steps: [
          "Open Settings and select the correct tab.",
          "Update values and review for accuracy.",
          "Save changes and validate effect in relevant modules.",
        ],
      },
    ],
  },
  {
    key: "my-account",
    label: "My Account",
    articles: [
      {
        id: "acc-password",
        title: "Forgot password",
        description: "What to do when you cannot sign in.",
        steps: [
          "Use the available password reset flow (if enabled).",
          "If unavailable, contact your admin to reset your account.",
          "After reset, update to a strong private password.",
        ],
      },
      {
        id: "acc-errors",
        title: "System errors",
        description: "How to report technical issues correctly.",
        steps: [
          "Take screenshot of the error message.",
          "Note the module, timestamp, and action you performed.",
          "Submit details through Help Desk for faster troubleshooting.",
        ],
      },
    ],
  },
  {
    key: "tips",
    label: "Tips & Tricks",
    articles: [
      {
        id: "tips-shortcuts",
        title: "Productivity tips",
        description: "Simple habits to speed up daily operations.",
        steps: [
          "Use module filters before searching manually in long tables.",
          "Review summary cards first to prioritize urgent work.",
          "Export filtered views for quick team reporting.",
        ],
        important: "Important: Always verify records before approving or exporting official reports.",
      },
    ],
  },
  { key: "dashboard", label: "Dashboard", articles: [] },
];

export function HelpCenterPage() {
  const [activeSection, setActiveSection] = useState<HelpSectionKey>("getting-started");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const section = useMemo(
    () => HELP_SECTIONS.find((item) => item.key === activeSection) ?? HELP_SECTIONS[0],
    [activeSection]
  );

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return section.articles.filter((article) =>
      q
        ? `${article.title} ${article.description} ${article.steps.join(" ")}`
            .toLowerCase()
            .includes(q)
        : true
    );
  }, [section, search]);

  function toggleArticle(articleId: string) {
    setExpanded((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
  }

  function toggleBookmark(articleId: string) {
    setBookmarks((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Help Center / User Manual</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Internal guide for admins and staff on system usage, troubleshooting, and best practices.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <div className="space-y-1">
            {HELP_SECTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold",
                  item.key === activeSection
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text)] hover:bg-[var(--card-soft)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--text)]">{section.label}</h2>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help topics..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No matching help topics found.</p>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => {
                const isOpen = expanded[article.id] ?? true;
                const isBookmarked = bookmarks.includes(article.id);
                return (
                  <article
                    key={article.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleArticle(article.id)}
                        className="inline-flex items-center gap-2 text-left"
                      >
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
                        )}
                        <span className="text-sm font-semibold text-[var(--text)]">{article.title}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(article.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold",
                          isBookmarked
                            ? "border-amber-300/30 bg-amber-500/10 text-amber-700"
                            : "border-[var(--border)] text-[var(--muted)]"
                        )}
                      >
                        <Star className="h-3.5 w-3.5" />
                        {isBookmarked ? "Bookmarked" : "Bookmark"}
                      </button>
                    </div>
                    {isOpen ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-[var(--muted)]">{article.description}</p>
                        <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--text)]">
                          {article.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        {article.important ? (
                          <div className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800">
                            {article.important}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          <section className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">FAQ</h3>
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              <li>How do I reset my password? Contact admin or use reset flow if enabled.</li>
              <li>Why can I not print? Re-generate, preview, then check printer settings.</li>
              <li>How do I report issues? Use Help Desk module and include screenshots.</li>
            </ul>
          </section>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">
              Video Tutorials (Optional)
            </button>
            <button className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">
              Go to Support Tickets
            </button>
          </div>
        </article>
      </section>
    </section>
  );
}
