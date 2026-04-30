"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronDown, 
  FileText, 
  User, 
  Settings, 
  Download,
  Printer,
  Save,
  X,
  Calendar,
  QrCode,
  Eye,
  Check,
  CreditCard,
  Settings2,
  FileEdit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentType } from "../utils/document-templates";

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
  const [selectedResidentId, setSelectedResidentId] = useState("RES-2026-0002");
  const [documentType, setDocumentType] = useState<DocumentType>("Barangay Clearance");
  const [purpose, setPurpose] = useState("Local Employment");
  const [documentNumber] = useState(`CERT-${new Date().getFullYear()}-0024`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  
  const [orNumber, setOrNumber] = useState("OR-2026-00124");
  const [amountPaid, setAmountPaid] = useState("50.00");
  
  const [ctcNumber, setCtcNumber] = useState("CTC-2026-000789");
  const [ctcDate, setCtcDate] = useState(new Date().toISOString().split("T")[0]);
  const [ctcPlace, setCtcPlace] = useState("Palauig, Zambales");

  // UI State
  const [activeTab, setActiveTab] = useState<"general" | "payment" | "settings">("general");
  const [searchQuery, setSearchQuery] = useState("Juan Dela Cruz");
  const [isResidentDropdownOpen, setIsResidentDropdownOpen] = useState(false);

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
  const handleResidentSelect = (resident: typeof MOCK_RESIDENTS[0]) => {
    setSelectedResidentId(resident.id);
    setSearchQuery(`${resident.firstName} ${resident.lastName}`);
    setIsResidentDropdownOpen(false);
  };

  const toggleDisplayOption = (option: keyof typeof displayOptions) => {
    setDisplayOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const fullName = selectedResident ? `${selectedResident.firstName} ${selectedResident.middleName ? selectedResident.middleName + " " : ""}${selectedResident.lastName}` : "";
  const issuedOnLabel = issueDate
    ? new Date(issueDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "N/A";
  const ctcDateLabel = ctcDate ? new Date(ctcDate).toLocaleDateString("en-US") : "N/A";
  const expiryLabel = expiryDate ? new Date(expiryDate).toLocaleDateString("en-US") : "N/A";
  const verificationCode = `${documentNumber.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase()}-${(selectedResidentId || "0000").slice(-4)}`;
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen space-y-6 bg-[var(--background)] p-6 pb-24">
      {/* Page Header */}
      <header className="px-1 no-print">
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
            <button onClick={handlePrintPdf} className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]">
              <Eye className="h-4 w-4 text-[var(--muted)]" />
              Preview
            </button>
            <button onClick={handlePrintPdf} className="flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition hover:brightness-110 shadow-lg shadow-[var(--primary)]/20">
              <Printer className="h-4 w-4" />
              Generate & Print
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Input Panel (The Card) */}
        <div className="lg:col-span-5 xl:col-span-4 no-print">
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
                                <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{resident.id} | {resident.address}</span>
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
                  <button onClick={handlePrintPdf} className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--text)] hover:bg-[var(--card-soft)] transition">
                    <Download className="h-3.5 w-3.5 text-[var(--muted)]" />
                    Export PDF
                  </button>
                  <button className="h-10 rounded-xl border border-rose-100 bg-rose-50/30 text-xs font-bold text-rose-600 hover:bg-rose-50 transition">Cancel</button>
                  <button onClick={handlePrintPdf} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-xs font-bold text-white hover:brightness-110 transition shadow-lg shadow-[var(--primary)]/20">
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
          <div className="print-area overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <header className="print-preview-header flex items-center justify-between border-b border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Document Preview</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview
                </span>
              </div>
              <button onClick={handlePrintPdf} className="flex items-center gap-2 rounded-lg bg-[var(--card-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition">
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </header>

            <div className="print-preview-wrap flex items-start justify-center overflow-y-auto overflow-x-hidden bg-slate-100/70 p-6">
              <div
                className="print-paper relative aspect-[1/1.414] w-full max-w-[980px] overflow-hidden border border-slate-300 bg-white px-16 pb-12 pt-16 text-[12px] leading-relaxed text-slate-900 shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
                style={{ fontFamily: "\"Cambria\", \"Times New Roman\", Georgia, serif" }}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
                  <div className="relative h-[820px] w-[820px]">
                    <Image src="/brgy-seal.png" alt="Barangay Seal Watermark" fill className="object-contain" />
                  </div>
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-7 flex items-start justify-between">
                    <div className="h-20 w-20 shrink-0 rounded-full border border-slate-400 p-1.5">
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <Image src="/brgy-seal.png" alt="Barangay Seal" fill className="object-cover" />
                      </div>
                    </div>

                    <div className="text-center leading-tight">
                      <p className="text-[13px]">Republic of the Philippines</p>
                      <p className="text-[13px]">Province of Zambales</p>
                      <p className="text-[13px]">Municipality of Palauig</p>
                      <p className="mt-1 text-[19px] font-bold uppercase tracking-[0.16em]">BARANGAY SALAZA</p>
                      <p className="text-[12px] uppercase tracking-[0.1em]">Office of the Punong Barangay</p>
                    </div>

                    <div className="h-20 w-20 shrink-0 rounded-full border border-slate-400 p-1.5">
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <Image src="/brgyAssist.png" alt="Barangay System Logo" fill className="object-cover" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-3 py-1 text-center">
                    <p className="text-[30px] font-bold uppercase tracking-[0.12em]">Barangay Clearance</p>
                  </div>

                  <div className="mb-12" aria-hidden="true">
                    <svg viewBox="0 0 1200 90" className="h-10 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="45" x2="530" y2="45" stroke="#111111" strokeWidth="2" />
                      <line x1="670" y1="45" x2="1200" y2="45" stroke="#111111" strokeWidth="2" />

                      <polygon points="532,45 546,31 560,45 546,59" fill="#111111" />
                      <polygon points="640,45 654,31 668,45 654,59" fill="#111111" />

                      <path d="M560 45 C574 22, 595 22, 600 45 C595 68, 574 68, 560 45 Z" stroke="#111111" strokeWidth="2" />
                      <path d="M640 45 C626 22, 605 22, 600 45 C605 68, 626 68, 640 45 Z" stroke="#111111" strokeWidth="2" />

                      <polygon points="600,18 627,45 600,72 573,45" stroke="#111111" strokeWidth="3" fill="white" />
                      <polygon points="600,29 616,45 600,61 584,45" stroke="#111111" strokeWidth="2" fill="white" />
                    </svg>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 text-[12px]">
                    <p>
                      <span className="font-semibold">Clearance No.:</span>{" "}
                      <span className="border-b border-black px-1.5">{displayOptions.showDocumentNumber ? documentNumber : "N/A"}</span>
                    </p>
                    <p className="text-right">
                      <span className="font-semibold">Date Issued:</span>{" "}
                      <span className="border-b border-black px-1.5">{displayOptions.showIssueDate ? issuedOnLabel : "N/A"}</span>
                    </p>
                  </div>

                  <p className="mb-4 text-[14px] font-semibold uppercase">TO WHOM IT MAY CONCERN:</p>

                  <div className="space-y-3 text-[13px] leading-relaxed">
                    <p className="indent-10 text-justify">
                      This is to certify that <span className="font-bold underline underline-offset-2">{fullName || "Resident Full Name"}</span>,{" "}
                      <span className="underline underline-offset-2">{age || "___"}</span> years old,{" "}
                      <span className="underline underline-offset-2">{selectedResident?.civilStatus || "___"}</span>, Filipino, and a resident of{" "}
                      <span className="font-semibold underline underline-offset-2">{selectedResident?.address || "Purok, Barangay, Municipality, Province"}</span>, is known to be a person of good moral character and a law-abiding citizen in this barangay.
                    </p>
                    <p className="indent-10 text-justify">
                      This is to further certify that as per records of this office, he/she has no pending case and no derogatory record filed in this barangay to date.
                    </p>
                    <p className="indent-10 text-justify">
                      This certification is issued upon the request of the above-named person for{" "}
                      <span className="font-bold uppercase underline underline-offset-2">
                        {displayOptions.showPurpose && purpose ? purpose : "WHATEVER LEGAL PURPOSE IT MAY SERVE"}
                      </span>.
                    </p>
                    <p className="indent-10 text-justify">
                      Issued this{" "}
                      <span className="font-semibold underline underline-offset-2">
                        {issuedOnLabel}
                      </span>{" "}
                      at Barangay Salaza, Palauig, Zambales.
                    </p>
                  </div>

                  {!!remarks.trim() && (
                    <p className="mt-4 text-[11px]">
                      <span className="font-semibold uppercase">Remarks:</span> {remarks}
                    </p>
                  )}

                  <div className="mt-7 rounded-sm px-3 py-2 text-[11.5px] leading-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">O.R. No.:</span>
                          <span>{displayOptions.showOrInformation ? (orNumber || "N/A") : "N/A"}</span>
                        </p>
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">CTC No.:</span>
                          <span>{displayOptions.showCtcInformation ? (ctcNumber || "N/A") : "N/A"}</span>
                        </p>
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">Issued on:</span>
                          <span>{displayOptions.showCtcInformation ? ctcDateLabel : "N/A"}</span>
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">Amount Paid:</span>
                          <span>{displayOptions.showOrInformation ? (amountPaid ? `PHP ${amountPaid}` : "N/A") : "N/A"}</span>
                        </p>
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">Issued at:</span>
                          <span>{displayOptions.showCtcInformation ? (ctcPlace || "N/A") : "N/A"}</span>
                        </p>
                        <p className="flex gap-2">
                          <span className="min-w-[84px] font-semibold">Valid until:</span>
                          <span>{displayOptions.showExpiryDate ? expiryLabel : "N/A"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-10">
                    <div>
                      <div className="mb-2 text-center text-[11px]">Certified by:</div>
                      <div className="grid grid-cols-3 gap-8">
                        <div className="text-center">
                          <div className="mx-auto mb-2 w-52 border-b border-black" />
                          <p className="text-[12px] font-bold uppercase">{signatories.secretary || "Barangay Secretary"}</p>
                          <p className="text-[10px] uppercase">Barangay Secretary</p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto mb-2 w-52 border-b border-black" />
                          <p className="text-[12px] font-bold uppercase">{signatories.punongBarangay || "Punong Barangay"}</p>
                          <p className="text-[10px] uppercase">Punong Barangay</p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto mb-2 w-52 border-b border-black" />
                          <p className="text-[12px] font-bold uppercase">{fullName || "Applicant Name"}</p>
                          <p className="text-[10px] uppercase">Signature of Applicant</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-end justify-between border-t border-dashed border-slate-500 pt-4">
                      <div>
                        <p className="text-[10px] italic text-slate-700">Not valid without official dry seal.</p>
                        <p className="mt-1 text-[10px]"><span className="font-semibold">Verification Code:</span> {verificationCode}</p>
                        <p className="mt-1 text-[10px]">Barangay Hall, Salaza, Palauig, Zambales</p>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex h-20 w-16 items-center justify-center border border-dashed border-slate-500 text-[10px] uppercase text-slate-500">
                          2x2
                        </div>
                        {displayOptions.showQrCode && (
                          <div className="flex h-24 w-24 flex-col items-center justify-center border border-slate-500 text-slate-700">
                            <QrCode className="h-10 w-10" />
                            <span className="mt-1 text-[9px] uppercase">Verify</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          body * {
            visibility: hidden !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            border: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          .print-preview-header {
            display: none !important;
          }

          .print-preview-wrap {
            overflow: visible !important;
            padding: 0 !important;
            background: white !important;
          }

          .print-paper {
            aspect-ratio: auto !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            overflow: visible !important;
          }
        }
      `}</style>
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
