"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  FileText, 
  User, 
  Settings, 
  Info,
  Download,
  Printer,
  Save,
  X,
  CheckCircle2,
  Calendar,
  QrCode,
  Eye,
  Check,
  CreditCard,
  Settings2,
  FileEdit,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DOCUMENT_TEMPLATES, DocumentType } from "../utils/document-templates";

// Mock Data
const MOCK_RESIDENTS = [
  {
    id: "RES-2026-0001",
    firstName: "Maria",
    middleName: "Lopez",
    lastName: "Santos",
    birthdate: "1962-04-12",
    gender: "Female",
    civilStatus: "Married",
    address: "Purok 1, Brgy. Salaza, Palauig, Zambales",
    tags: { senior: true, pwd: false, voter: true },
  },
  {
    id: "RES-2026-0002",
    firstName: "Juan",
    middleName: "Reyes",
    lastName: "Dela Cruz",
    birthdate: "1998-11-03",
    gender: "Male",
    civilStatus: "Single",
    address: "Purok 2, Brgy. Salaza, Palauig, Zambales",
    tags: { senior: false, pwd: false, voter: true },
  },
  {
    id: "RES-2026-0003",
    firstName: "Ana",
    middleName: "Garcia",
    lastName: "Reyes",
    birthdate: "1985-07-18",
    gender: "Female",
    civilStatus: "Married",
    address: "Purok 3, Brgy. Salaza, Palauig, Zambales",
    tags: { senior: false, pwd: true, voter: true },
  },
];

const DOCUMENT_TYPES: DocumentType[] = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
];

export function DocumentGenerationPage() {
  // Form State
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("Barangay Clearance");
  const [purpose, setPurpose] = useState("");
  const [documentNumber, setDocumentNumber] = useState(`CERT-${new Date().getFullYear()}-0024`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  
  const [orNumber, setOrNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  
  const [ctcNumber, setCtcNumber] = useState("");
  const [ctcDate, setCtcDate] = useState("");
  const [ctcPlace, setCtcPlace] = useState("Palauig, Zambales");

  // UI State
  const [activeTab, setActiveTab] = useState<"general" | "payment" | "settings">("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isResidentDropdownOpen, setIsResidentDropdownOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    payment: false,
    additional: false,
    additional_opts: false,
  });

  // Display Options State
  const [displayOptions, setDisplayOptions] = useState({
    showDocumentNumber: true,
    showIssueDate: true,
    showExpiryDate: false,
    showPurpose: true,
    showOrInformation: true,
    showCtcInformation: true,
    showQrCode: true,
  });

  // Signature Settings State
  const [signatories, setSignatories] = useState({
    punongBarangay: "Juan Dela Cruz",
    secretary: "Maria Santos",
    other: "",
  });

  // Remarks State
  const [remarks, setRemarks] = useState("This certification is valid only for the purpose stated herein.");

  // Derived State
  const selectedResident = useMemo(() => 
    MOCK_RESIDENTS.find(r => r.id === selectedResidentId),
    [selectedResidentId]
  );

  const filteredResidents = useMemo(() => {
    if (!searchQuery) return MOCK_RESIDENTS;
    const q = searchQuery.toLowerCase();
    return MOCK_RESIDENTS.filter(r => 
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || 
      r.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const age = useMemo(() => {
    if (!selectedResident) return 0;
    const birth = new Date(selectedResident.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }, [selectedResident]);

  // Handlers
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResidentSelect = (resident: typeof MOCK_RESIDENTS[0]) => {
    setSelectedResidentId(resident.id);
    setSearchQuery(`${resident.firstName} ${resident.lastName}`);
    setIsResidentDropdownOpen(false);
  };

  const toggleDisplayOption = (option: keyof typeof displayOptions) => {
    setDisplayOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const fullName = selectedResident ? `${selectedResident.firstName} ${selectedResident.middleName ? selectedResident.middleName + " " : ""}${selectedResident.lastName}` : "";

  return (
    <div className="min-h-screen space-y-6 bg-[var(--background)] p-6 pb-24">
      {/* Page Header */}
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Generate Document</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Documents &gt; Generate Document</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]">
              <Save className="h-4 w-4 text-[var(--muted)]" />
              Save Draft
            </button>
            <button className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]">
              <Eye className="h-4 w-4 text-[var(--muted)]" />
              Preview
            </button>
            <button className="flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition hover:brightness-110 shadow-lg shadow-[var(--primary)]/20">
              <Printer className="h-4 w-4" />
              Generate & Print
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Input Panel (The Card) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all">
            <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Document Information</h2>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-[var(--border)] bg-[var(--card-soft)]/20 p-1">
              <TabButton 
                active={activeTab === 'general'} 
                onClick={() => setActiveTab('general')} 
                icon={<FileEdit className="h-4 w-4" />} 
                label="Basic Info" 
              />
              <TabButton 
                active={activeTab === 'payment'} 
                onClick={() => setActiveTab('payment')} 
                icon={<CreditCard className="h-4 w-4" />} 
                label="Payment" 
              />
              <TabButton 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
                icon={<Settings2 className="h-4 w-4" />} 
                label="Options" 
              />
            </div>

            <div className="space-y-8 p-6 min-h-[600px] flex flex-col">
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                  {/* Document Type Section */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] px-1">Document Type</label>
                    <div className="relative group">
                      <select
                        className="h-11 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)]"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                      >
                        {DOCUMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]/40 transition-colors group-focus-within:text-[var(--primary)]" />
                    </div>
                  </div>

                  {/* A. Resident Information */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">A. Resident Information</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--muted)] px-1">Resident</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                        <input
                          type="text"
                          placeholder="Search resident name or ID..."
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-10 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsResidentDropdownOpen(true);
                          }}
                          onFocus={() => setIsResidentDropdownOpen(true)}
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => { setSearchQuery(""); setSelectedResidentId(""); }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <X className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                        )}
                        
                        {isResidentDropdownOpen && filteredResidents.length > 0 && (
                          <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
                            {filteredResidents.map((resident) => (
                              <button
                                key={resident.id}
                                className="flex w-full flex-col p-3 text-left transition-colors hover:bg-[var(--card-soft)]"
                                onClick={() => handleResidentSelect(resident)}
                              >
                                <span className="text-sm font-semibold text-[var(--text)]">
                                  {resident.firstName} {resident.lastName}
                                </span>
                                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{resident.id} • {resident.address}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Age</label>
                        <input
                          type="text"
                          readOnly
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/50 px-4 text-sm text-[var(--text)]/60 outline-none"
                          value={selectedResident ? age : ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Sex</label>
                        <input
                          type="text"
                          readOnly
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/50 px-4 text-sm text-[var(--text)]/60 outline-none"
                          value={selectedResident?.gender ?? ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--muted)] px-1">Address</label>
                      <input
                        readOnly
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/50 px-4 text-sm text-[var(--text)]/60 outline-none"
                        value={selectedResident?.address ?? ""}
                      />
                    </div>
                  </section>

                  {/* B. Document Details */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">B. Document Details</h3>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--muted)] px-1">Purpose</label>
                      <input
                        placeholder="For whatever legal purpose it may serve."
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                  </section>

                  {/* C. Document Settings */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">C. Document Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Barangay ID</label>
                        <input
                          readOnly
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/50 px-4 text-xs font-mono text-[var(--text)]/60 outline-none"
                          value="BRGY-097332013"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Document No.</label>
                        <div className="relative">
                          <input
                            readOnly
                            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/50 px-4 text-xs font-mono text-[var(--text)]/60 outline-none"
                            value={documentNumber}
                          />
                          <Settings className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]/40" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Date Issued</label>
                        <div className="relative group/date">
                          <input
                            type="date"
                            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 pr-10 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                          />
                          <Calendar className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]/40" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">Expiry Date</label>
                        <div className="relative group/date">
                          <input
                            type="date"
                            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 pr-10 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                          <Calendar className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]/40" />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                  {/* D. Payment Information */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">D. Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">OR No.</label>
                        <input
                          placeholder="OR-2026-000456"
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                          value={orNumber}
                          onChange={(e) => setOrNumber(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">OR Amount</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="P 0.00"
                            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* E. Additional Information */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">E. ADDITIONAL INFORMATION <span className="text-[8px] opacity-60">(Optional)</span></h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--muted)] px-1">CTC No.</label>
                        <input
                          placeholder="CTC-2026-000789"
                          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                          value={ctcNumber}
                          onChange={(e) => setCtcNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--muted)] px-1">CTC Date</label>
                          <div className="relative group/date">
                            <input
                              type="date"
                              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 pr-10 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                              value={ctcDate}
                              onChange={(e) => setCtcDate(e.target.value)}
                            />
                            <Calendar className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]/40" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--muted)] px-1">CTC Place</label>
                          <input
                            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                            value={ctcPlace}
                            onChange={(e) => setCtcPlace(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  {/* F. Additional Options */}
                  <div className="space-y-8">
                    {/* Display Options */}
                    <div className="space-y-4">
                      <div className="px-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)]">Display Options</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">Choose which items will appear on the document.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <OptionCheckbox 
                          label="Show Document Number" 
                          description="Display the document number on the certificate"
                          checked={displayOptions.showDocumentNumber}
                          onChange={() => toggleDisplayOption('showDocumentNumber')}
                        />
                        <OptionCheckbox 
                          label="Show Issue Date" 
                          description="Display the issue date on the certificate"
                          checked={displayOptions.showIssueDate}
                          onChange={() => toggleDisplayOption('showIssueDate')}
                        />
                        <OptionCheckbox 
                          label="Show Expiry Date" 
                          description="Display the expiry date on the certificate"
                          checked={displayOptions.showExpiryDate}
                          onChange={() => toggleDisplayOption('showExpiryDate')}
                        />
                        <OptionCheckbox 
                          label="Show Purpose" 
                          description="Display the purpose/intent of the document"
                          checked={displayOptions.showPurpose}
                          onChange={() => toggleDisplayOption('showPurpose')}
                        />
                        <OptionCheckbox 
                          label="Show OR Information" 
                          description="Display OR number and amount paid"
                          checked={displayOptions.showOrInformation}
                          onChange={() => toggleDisplayOption('showOrInformation')}
                        />
                        <OptionCheckbox 
                          label="Show CTC Information" 
                          description="Display CTC details"
                          checked={displayOptions.showCtcInformation}
                          onChange={() => toggleDisplayOption('showCtcInformation')}
                        />
                        <OptionCheckbox 
                          label="Show QR Code" 
                          description="Display QR code for verification"
                          checked={displayOptions.showQrCode}
                          onChange={() => toggleDisplayOption('showQrCode')}
                        />
                      </div>
                    </div>

                    {/* Signature Settings */}
                    <div className="space-y-4">
                      <div className="px-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)]">Signature Settings</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">Select which signatories will appear on the document.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--muted)] px-1">Punong Barangay</label>
                          <div className="relative group">
                            <select
                              className="h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                              value={signatories.punongBarangay}
                              onChange={(e) => setSignatories(prev => ({ ...prev, punongBarangay: e.target.value }))}
                            >
                              <option value="Juan Dela Cruz">Juan Dela Cruz</option>
                              <option value="Ferdinand E. Marcos">Ferdinand E. Marcos</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]/40" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--muted)] px-1">Barangay Secretary <span className="text-[8px] opacity-60">(Optional)</span></label>
                          <div className="relative group">
                            <select
                              className="h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                              value={signatories.secretary}
                              onChange={(e) => setSignatories(prev => ({ ...prev, secretary: e.target.value }))}
                            >
                              <option value="Maria Santos">Maria Santos</option>
                              <option value="Elena Garcia">Elena Garcia</option>
                              <option value="">None</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]/40" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remarks Section */}
                    <div className="space-y-4">
                      <div className="px-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)]">Remarks / Notes <span className="text-[8px] opacity-60">(Optional)</span></p>
                      </div>
                      <textarea
                        className="w-full h-24 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-4 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]/40 resize-none"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Type any additional remarks here..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions - Sticky at bottom of card */}
              <div className="mt-auto pt-6 border-t border-[var(--border)]/50">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--text)] hover:bg-[var(--card-soft)] transition">
                    <Save className="h-3.5 w-3.5 text-[var(--muted)]" />
                    Save Draft
                  </button>
                  <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--text)] hover:bg-[var(--card-soft)] transition">
                    <Download className="h-3.5 w-3.5 text-[var(--muted)]" />
                    Export PDF
                  </button>
                  <button className="h-10 rounded-xl border border-rose-100 bg-rose-50/30 text-xs font-bold text-rose-600 hover:bg-rose-50 transition">Cancel</button>
                  <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-xs font-bold text-white hover:brightness-110 transition shadow-lg shadow-[var(--primary)]/20">
                    <Printer className="h-3.5 w-3.5" />
                    Generate & Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Preview */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Preview Header Card */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Document Preview</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview
                </span>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-[var(--card-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition">
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </header>

            <div className="flex items-center justify-center bg-slate-100/50 p-12 dark:bg-slate-900/40">
              {/* The Document Paper */}
              <div className="aspect-[1/1.414] w-full max-w-[700px] origin-top bg-white p-[1.5cm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all dark:bg-white text-slate-900">
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 italic text-slate-400 text-[8px]">LOGO</div>
                    <div className="flex-1 px-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Republic of the Philippines</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">City of Zamboanga</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Barangay Bunguiao</p>
                      <p className="mt-1 text-base font-black uppercase tracking-tight text-slate-900">Office of the Punong Barangay</p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 italic text-slate-400 text-[8px]">LOGO</div>
                  </div>

                  {/* Document Title */}
                  <div className="mt-10 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 font-serif">
                      {documentType.toUpperCase()}
                    </h2>
                    <p className="mt-2 text-xs font-bold tracking-widest uppercase text-slate-500">To Whom It May Concern:</p>
                  </div>

                  {/* Body Content */}
                  <div className="mt-12 flex-1 text-center leading-relaxed text-slate-800">
                    {selectedResident ? (
                      <div className="space-y-6 text-base font-serif px-8">
                        <p>
                          This is to certify that <span className="font-bold">MR. {fullName.toUpperCase()}</span>, {age} years old, <span className="font-bold">{selectedResident.gender.toLowerCase()}</span>, and a resident of 
                        </p>
                        <p className="font-bold uppercase tracking-tight">
                          {selectedResident.address.toUpperCase()}
                        </p>
                        <p>
                          is a bonafide resident of this barangay.
                        </p>
                        {displayOptions.showPurpose && (
                          <p>
                            This certification is issued upon his request for {purpose || "whatever legal purpose it may serve"}.
                          </p>
                        )}
                        {displayOptions.showIssueDate && (
                          <p className="mt-10 italic">
                            Issued this {new Date(issueDate).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })} at Barangay Bunguiao, Zamboanga City, Philippines.
                          </p>
                        )}
                        {remarks && (
                           <p className="mt-10 text-xs text-slate-500 font-sans italic border-t border-slate-100 pt-4">
                             Note: {remarks}
                           </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        <User className="mb-2 h-8 w-8 opacity-20" />
                        <p className="text-sm font-medium italic">Please select a resident to preview document</p>
                      </div>
                    )}
                  </div>

                  {/* Signature Section */}
                  <div className="mt-16 flex items-center justify-center gap-12">
                    <div className="w-56 text-center">
                      <div className="h-10 flex items-end justify-center">
                         <div className="w-40 border-b border-slate-900 font-serif italic text-slate-400 opacity-20 text-[8px]">SIGNATURE</div>
                      </div>
                      <p className="mt-2 text-sm font-black uppercase tracking-tight">{signatories.punongBarangay.toUpperCase()}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">Punong Barangay</p>
                    </div>

                    {signatories.secretary && (
                      <div className="w-56 text-center">
                        <div className="h-10 flex items-end justify-center">
                           <div className="w-40 border-b border-slate-900 font-serif italic text-slate-400 opacity-20 text-[8px]">SIGNATURE</div>
                        </div>
                        <p className="mt-2 text-sm font-black uppercase tracking-tight">{signatories.secretary.toUpperCase()}</p>
                        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">Barangay Secretary</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Section */}
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div className="flex flex-col items-center gap-1 opacity-60">
                      {displayOptions.showQrCode && (
                        <>
                          <div className="h-16 w-16 border border-slate-200 bg-slate-50 flex items-center justify-center rounded">
                            <QrCode className="h-10 w-10 text-slate-300" />
                          </div>
                          <span className="text-[7px] uppercase tracking-tighter text-slate-400 font-bold font-mono">{documentNumber}</span>
                          <span className="text-[6px] uppercase tracking-tighter text-slate-400">Scan to verify</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 px-8 text-[10px] font-medium text-slate-400 text-center italic">
                       "Bungiao: The Vanguard of Peace and Progress"
                    </div>
                    <div className="h-20 w-32 border-2 border-slate-200 rounded-lg flex items-center justify-center opacity-30 italic text-slate-400 text-[8px]">BARANGAY SEAL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Summary Section */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-3">
              <Settings className="h-4 w-4 text-[var(--muted)]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Document Summary</h2>
            </header>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[var(--border)]/50 bg-[var(--card-soft)]/30">
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Type</th>
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Resident</th>
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Document No.</th>
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Status</th>
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Created By</th>
                    <th className="px-6 py-3 font-bold uppercase text-[var(--muted)]">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-[var(--text)]">
                    <td className="px-6 py-4 font-semibold">{documentType}</td>
                    <td className="px-6 py-4">{fullName || "Not Selected"}</td>
                    <td className="px-6 py-4 font-mono">{documentNumber}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">Ready to Print</span>
                    </td>
                    <td className="px-6 py-4">Juan Dela Cruz</td>
                    <td className="px-6 py-4">{new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 bg-blue-50/50 p-4 border-t border-[var(--border)]">
              <Info className="h-4 w-4 text-blue-500" />
              <p className="text-[10px] font-medium text-blue-600">Document will be saved to Generated Documents after printing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
        active 
          ? "bg-[var(--card)] text-[var(--primary)] shadow-sm border border-[var(--border)]" 
          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card-soft)]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function OptionCheckbox({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: () => void 
}) {
  return (
    <button 
      onClick={onChange}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
        checked 
          ? "border-[var(--primary)] bg-[var(--primary)]/[0.03] shadow-sm" 
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 hover:bg-[var(--card-soft)]/50"
      )}
    >
      <div className={cn(
        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
        checked 
          ? "bg-[var(--primary)] border-[var(--primary)] text-white" 
          : "bg-[var(--card-soft)] border-[var(--border)]"
      )}>
        {checked && <Check className="h-2.5 w-2.5 stroke-[4]" />}
      </div>
      <div>
        <p className={cn("text-xs font-bold transition-colors", checked ? "text-[var(--primary)]" : "text-[var(--text)]")}>{label}</p>
        <p className="text-[10px] text-[var(--muted)] leading-relaxed">{description}</p>
      </div>
    </button>
  );
}
