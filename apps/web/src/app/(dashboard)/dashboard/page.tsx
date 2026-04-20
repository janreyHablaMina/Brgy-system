import { ArrowDownRight, ArrowUpRight, FileText, Users, Wallet } from "lucide-react";

const statCards = [
  { label: "Total Residents", value: "12,842", delta: "+4.2%", icon: Users, positive: true, tone: "blue" },
  {
    label: "Pending Documents",
    value: "126",
    delta: "-1.8%",
    icon: FileText,
    positive: false,
    tone: "blue",
  },
  {
    label: "Monthly Collections",
    value: "PHP 284,500",
    delta: "+7.4%",
    icon: Wallet,
    positive: true,
    tone: "green",
  },
];

const recentActivity = [
  { resident: "Juan Dela Cruz", action: "Barangay Clearance Requested", time: "5 minutes ago" },
  { resident: "Ana Santos", action: "Certificate of Indigency Released", time: "19 minutes ago" },
  { resident: "Mark Rivera", action: "Business Permit Verification", time: "48 minutes ago" },
  { resident: "Liza Gomez", action: "Household Record Updated", time: "1 hour ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-1">
        <p className="text-sm font-medium text-[var(--muted)]">Overview</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] md:text-3xl">
          Barangay Operations Dashboard
        </h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const trendTextClass = card.positive ? "text-[var(--accent)]" : "text-[var(--muted)]";
          const IconArrow = card.positive ? ArrowUpRight : ArrowDownRight;
          const iconToneClass =
            card.tone === "green"
              ? "bg-[rgb(16_185_129/0.12)] text-[var(--accent)] dark:bg-[rgb(16_185_129/0.2)]"
              : "bg-[rgb(var(--primary-rgb)/0.12)] text-[var(--primary)] dark:bg-[rgb(var(--primary-rgb)/0.2)]";

          return (
            <article
              key={card.label}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">{card.label}</p>
                <div className={`rounded-xl p-2.5 shadow-sm ${iconToneClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[var(--text)]">{card.value}</p>
              <p className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${trendTextClass}`}>
                {card.delta}
                <IconArrow className="h-4 w-4" />
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-200 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">Recent Activity</h2>
            <button
              type="button"
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={`${item.resident}-${item.time}`}
                className="rounded-xl border border-gray-100 bg-[var(--card-soft)] p-4 transition-all duration-200 hover:border-[#dbe1e8] hover:bg-white hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-[var(--text)]">{item.resident}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.action}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{item.time}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-200 hover:shadow-xl">
          <h2 className="mb-6 text-lg font-semibold text-[var(--text)]">Service Health</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-[var(--card-soft)] p-4 transition-all duration-200 hover:shadow-sm">
              <p className="text-sm text-[var(--muted)]">Document Processing</p>
              <p className="mt-1 text-lg font-semibold text-[var(--accent)]">Operational</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[var(--card-soft)] p-4 transition-all duration-200 hover:shadow-sm">
              <p className="text-sm text-[var(--muted)]">Resident Registry</p>
              <p className="mt-1 text-lg font-semibold text-[var(--accent)]">Synchronized</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[var(--card-soft)] p-4 transition-all duration-200 hover:shadow-sm">
              <p className="text-sm text-[var(--muted)]">Financial Reports</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">Updated 3m ago</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
