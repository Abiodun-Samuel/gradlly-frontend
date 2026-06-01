"use client";
import { Bell, Download, Plus } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";

import { ActiveTransfers } from "./ActiveTransfers";
import { LEVY } from "./data";
import { ESFAModal } from "./ESFAModal";
import { ExpiryBanner } from "./ExpiryBanner";
import { HistoryDrawer } from "./HistoryDrawer";
import { MatchModal } from "./MatchModal";
import { NewTransferForm } from "./NewTransferForm";
import { PolicyAlert } from "./PolicyAlert";
import { SMEFinder } from "./SMEFinder";
import { TransferStatCards } from "./TransferStatCards";

export function LevyTransferDashboard() {
  const searchRef = useRef(null);
  const formRef = useRef(null);
  const [banner, setBanner] = useState(true);
  const [policy, setPolicy] = useState(true);
  const [esfa, setEsfa] = useState(false);
  const [history, setHistory] = useState(false);
  const [matchSME, setMatchSME] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [extras, setExtras] = useState([]);

  const scrollToFinder = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => searchRef.current?.focus(), 500);
  };

  const handleMatchSuccess = (sme) => {
    setMatchSME(null);
    toast.success(`Match request sent — ${sme.name} will be notified`);
    setExtras((e) => [
      ...e,
      {
        id: `DAS-TR-2025-00${Math.floor(Math.random() * 900 + 100)}`,
        recipient: sme.name,
        payeRef: sme.payeRef ?? "",
        apprentice: "TBC",
        standard: sme.standard,
        provider: "TBC",
        startDate: "TBC",
        expectedEndDate: "TBC",
        amount: sme.fundingNeeded,
        drawn: 0,
        monthlyDrawdown: 0,
        contactName: sme.contact.name,
        contactEmail: sme.contact.email,
        history: [],
      },
    ]);
  };

  const handleFormSuccess = () => {
    const ref = `DAS-TR-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
    toast.success(`Transfer initiated — reference ${ref}`);
    setPrefill(null);
  };

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Midlands Engineering → Levy Transfer
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Levy transfer
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistory(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Transfer history
          </button>
          <button
            type="button"
            onClick={() =>
              formRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.green, color: "#fff" }}
          >
            <Plus className="h-3.5 w-3.5" /> New transfer
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {banner && (
        <ExpiryBanner
          onDismiss={() => setBanner(false)}
          onFindSME={scrollToFinder}
          onLearnMore={() => setEsfa(true)}
          onPrefill={() => {
            setPrefill(LEVY.expiring);
            formRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      <TransferStatCards onScrollToFinder={scrollToFinder} />

      {policy && (
        <PolicyAlert
          onViewESFA={() => setEsfa(true)}
          onDismiss={() => setPolicy(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
        <SMEFinder searchRef={searchRef} onRequestMatch={setMatchSME} />
        <div className="space-y-5">
          <ActiveTransfers extras={extras} />
          <div ref={formRef}>
            <NewTransferForm
              prefillAmount={prefill}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      </div>

      <ESFAModal open={esfa} onClose={() => setEsfa(false)} />
      {history && <HistoryDrawer onClose={() => setHistory(false)} />}
      <MatchModal
        open={!!matchSME}
        sme={
          matchSME ?? {
            name: "",
            sector: "",
            location: "",
            standard: "",
            fundingNeeded: 0,
            dasRef: "",
            learnfloVerified: false,
            payeRef: "",
          }
        }
        onClose={() => setMatchSME(null)}
        onSuccess={handleMatchSuccess}
      />
    </div>
  );
}
