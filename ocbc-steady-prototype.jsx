import { useState, useEffect } from "react";

// ─── Brand tokens ────────────────────────────────────────────────
const RED = "#E1251B";
const RED_DARK = "#B71C13";
const INK = "#17171A";
const GREEN = "#0C7A5A";
const AMBER = "#D98E1F";
const PAPER = "#FFFFFF";
const FOG = "#F4F4F6";

// ─── Scripted demo data ──────────────────────────────────────────
// Farhan, 34 — private-hire driver, week 10 on Steady.
// Steady Salary S$850/wk. Buffer target = 4 weeks = S$3,400.
// Constitution: agent may move ≤ S$500 per action without asking.

const BASE_HISTORY = [1380, 1520, 1290, 1610, 1445, 980, 1700, 1355, 1490, 1435];

const SCRIPT = [
  {
    week: 11,
    tag: "Strong week",
    earnings: 1860,
    cpf: 279,
    bills: 310,
    salary: 850,
    topUp: 0,
    toBuffer: 280,
    sweep: 141,
    needsApproval: false,
    toast: "Strong week. Salary paid, buffer full, S$141 swept to BTO fund.",
    cue: "Moment A — agent acts alone: allocates a strong week, caps the buffer, sweeps a small surplus without asking (under the S$500 limit).",
    logs: [
      { t: "Fri 9:00am", txt: "Weekly salary of S$850 paid to spending account", kind: "salary" },
      { t: "Fri 9:00am", txt: "S$279 set aside for MediSave & income tax", kind: "auto" },
      { t: "Fri 9:00am", txt: "Bills envelope funded — S$310", kind: "auto" },
      { t: "Fri 9:01am", txt: "Buffer topped to full 4 weeks (+S$280)", kind: "auto" },
      { t: "Fri 9:01am", txt: "S$141 surplus swept to BTO fund — within your S$500 limit", kind: "sweep" },
    ],
  },
  {
    week: 12,
    tag: "Lean week",
    earnings: 705,
    cpf: 106,
    bills: 310,
    salary: 850,
    topUp: 561,
    toBuffer: -561,
    sweep: 0,
    needsApproval: false,
    toast: "Lean week. Buffer covered S$561 — your salary stayed S$850.",
    cue: "Moment B — the core promise: earnings drop 60%, the buffer tops up the shortfall, and the Friday salary doesn't move.",
    logs: [
      { t: "Fri 9:00am", txt: "Weekly salary of S$850 paid — as usual", kind: "salary" },
      { t: "Fri 9:00am", txt: "Earnings covered S$289 of salary; buffer covered the S$561 shortfall", kind: "buffer" },
      { t: "Fri 9:00am", txt: "S$106 set aside for MediSave & income tax", kind: "auto" },
      { t: "Fri 9:00am", txt: "Bills envelope funded — S$310", kind: "auto" },
    ],
  },
  {
    week: 13,
    tag: "Surge week",
    earnings: 3150,
    cpf: 473,
    bills: 310,
    salary: 850,
    topUp: 0,
    toBuffer: 561,
    sweep: 956,
    needsApproval: true,
    toast: "Surge week. Buffer refilled. One move needs your OK.",
    cue: "Moment C — human in control: the proposed S$956 sweep breaches the S$500 Constitution limit, so the agent stops and asks. Tap Approve on stage.",
    logs: [
      { t: "Fri 9:00am", txt: "Weekly salary of S$850 paid to spending account", kind: "salary" },
      { t: "Fri 9:00am", txt: "S$473 set aside for MediSave & income tax", kind: "auto" },
      { t: "Fri 9:00am", txt: "Bills envelope funded — S$310", kind: "auto" },
      { t: "Fri 9:01am", txt: "Buffer refilled to full 4 weeks (+S$561)", kind: "auto" },
      { t: "Fri 9:01am", txt: "Proposed: sweep S$956 to BTO fund — above your S$500 limit, waiting for your OK", kind: "ask" },
    ],
  },
  {
    week: 14,
    tag: "Back to normal",
    earnings: 1490,
    cpf: 224,
    bills: 310,
    salary: 850,
    topUp: 0,
    toBuffer: 0,
    sweep: 106,
    needsApproval: false,
    toast: "Typical week. Fourth straight Friday at S$850.",
    cue: "Wrap — recap on screen: four volatile weeks in, one flat salary line. That's the product.",
    logs: [
      { t: "Fri 9:00am", txt: "Weekly salary of S$850 paid to spending account", kind: "salary" },
      { t: "Fri 9:00am", txt: "S$224 set aside for MediSave & income tax", kind: "auto" },
      { t: "Fri 9:00am", txt: "Bills envelope funded — S$310", kind: "auto" },
      { t: "Fri 9:01am", txt: "S$106 surplus swept to BTO fund — within your S$500 limit", kind: "sweep" },
    ],
  },
];

const fmt = (n) => "S$" + n.toLocaleString("en-SG");

// ─── Small components ────────────────────────────────────────────

function EarningsChart({ history, weeksDone }) {
  const data = history.slice(-12);
  const max = Math.max(...data, 900) * 1.08;
  const W = 320, H = 120, pad = 6;
  const bw = (W - pad * 2) / data.length;
  const y = (v) => H - (v / max) * (H - 18);
  const salaryY = y(850);
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full">
      {data.map((v, i) => {
        const isNew = i >= data.length - weeksDone && weeksDone > 0;
        return (
          <rect key={i}
            x={pad + i * bw + 2.5} y={y(v)}
            width={bw - 5} height={H - y(v)}
            rx="3"
            fill={isNew ? "#D9D9DE" : "#E9E9EC"}
            style={{ transition: "all .6s ease" }}
          />
        );
      })}
      <line x1={pad} x2={W - pad} y1={salaryY} y2={salaryY}
        stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      <text x={W - pad} y={salaryY - 6} textAnchor="end"
        fontSize="10" fontWeight="700" fill={GREEN}
        style={{ fontVariantNumeric: "tabular-nums" }}>
        Steady Salary S$850
      </text>
      <text x={pad} y={H + 11} fontSize="9" fill="#9A9AA1">weekly gig earnings</text>
    </svg>
  );
}

function BufferMeter({ value, target }) {
  const pct = Math.min(100, (value / target) * 100);
  const weeks = (value / 850).toFixed(1);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11px] font-bold tracking-wide" style={{ color: INK }}>BUFFER RESERVE</span>
        <span className="text-[11px]" style={{ color: "#6E6E76", fontVariantNumeric: "tabular-nums" }}>
          {fmt(value)} / {fmt(target)}
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E9E9EC" }}>
        <div className="h-full rounded-full" style={{
          width: pct + "%",
          background: pct >= 99 ? GREEN : AMBER,
          transition: "width .8s cubic-bezier(.2,.8,.2,1)",
        }} />
      </div>
      <div className="text-[10.5px] mt-1.5" style={{ color: "#8A8A92" }}>
        {pct >= 99
          ? "Full — 4 weeks of salary held back. New surplus flows to your goals."
          : `${weeks} weeks of salary held back. Surplus refills this before goals.`}
      </div>
    </div>
  );
}

function Rung({ n, name, sub, amount, tone, delay, animKey }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [animKey, delay]);
  const colors = { red: RED, green: GREEN, amber: AMBER, ink: INK, gray: "#8A8A92" };
  return (
    <div className="flex items-center gap-3 py-3" style={{
      opacity: show ? 1 : 0.25,
      transform: show ? "translateX(0)" : "translateX(-6px)",
      transition: "all .45s ease",
    }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold shrink-0"
        style={{ background: FOG, color: colors[tone] }}>{n}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold leading-tight" style={{ color: INK }}>{name}</div>
        <div className="text-[10.5px] leading-snug" style={{ color: "#8A8A92" }}>{sub}</div>
      </div>
      <div className="text-[14px] font-extrabold shrink-0"
        style={{ color: colors[tone], fontVariantNumeric: "tabular-nums" }}>{amount}</div>
    </div>
  );
}

function LogIcon({ kind }) {
  const map = {
    salary: { bg: "#E5F3EE", fg: GREEN, ch: "S" },
    auto: { bg: FOG, fg: "#6E6E76", ch: "A" },
    sweep: { bg: "#FBEEE9", fg: RED, ch: "→" },
    buffer: { bg: "#FBF3E3", fg: AMBER, ch: "B" },
    ask: { bg: "#FBEEE9", fg: RED, ch: "?" },
  };
  const c = map[kind] || map.auto;
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0"
      style={{ background: c.bg, color: c.fg }}>{c.ch}</div>
  );
}

// ─── Main app ────────────────────────────────────────────────────

export default function SteadyDemo() {
  const [tab, setTab] = useState("home");
  const [step, setStep] = useState(0); // how many scripted weeks advanced
  const [buffer, setBuffer] = useState(3120);
  const [goal, setGoal] = useState(4250);
  const [history, setHistory] = useState(BASE_HISTORY);
  const [logs, setLogs] = useState([
    { t: "Last Fri", txt: "Weekly salary of S$850 paid to spending account", kind: "salary" },
    { t: "Last Fri", txt: "S$215 set aside for MediSave & income tax", kind: "auto" },
    { t: "Last Fri", txt: "Bills envelope funded — S$310", kind: "auto" },
    { t: "Last Fri", txt: "Buffer topped up +S$60", kind: "auto" },
  ]);
  const [toast, setToast] = useState(null);
  const [approval, setApproval] = useState(null); // pending sweep amount
  const [floatHeld, setFloatHeld] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const done = step >= SCRIPT.length;
  const next = done ? null : SCRIPT[step];
  const current = step > 0 ? SCRIPT[step - 1] : null;

  const advance = () => {
    if (done || approval) return;
    const wk = SCRIPT[step];
    setHistory((h) => [...h, wk.earnings]);
    setBuffer((b) => Math.min(3400, Math.max(0, b + wk.toBuffer)));
    setLogs((l) => [...wk.logs.slice().reverse(), ...l]);
    if (wk.needsApproval) {
      setApproval(wk.sweep);
    } else if (wk.sweep > 0) {
      setGoal((g) => g + wk.sweep);
    }
    setToast(wk.toast);
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
    setTab("home");
  };

  const resolveApproval = (ok) => {
    if (ok) {
      setGoal((g) => g + approval);
      setLogs((l) => [{ t: "Just now", txt: `You approved — ${fmt(approval)} moved to BTO fund`, kind: "sweep" }, ...l]);
      setToast(`Approved. ${fmt(approval)} moved to your BTO fund.`);
    } else {
      setFloatHeld((f) => f + approval);
      setLogs((l) => [{ t: "Just now", txt: `You declined — ${fmt(approval)} held in your current account`, kind: "buffer" }, ...l]);
      setToast(`No move made. ${fmt(approval)} stays in your current account.`);
    }
    setApproval(null);
  };

  const reset = () => {
    setStep(0); setBuffer(3120); setGoal(4250);
    setHistory(BASE_HISTORY); setApproval(null); setFloatHeld(0);
    setToast(null); setTab("home"); setAnimKey((k) => k + 1);
    setLogs([
      { t: "Last Fri", txt: "Weekly salary of S$850 paid to spending account", kind: "salary" },
      { t: "Last Fri", txt: "S$215 set aside for MediSave & income tax", kind: "auto" },
      { t: "Last Fri", txt: "Bills envelope funded — S$310", kind: "auto" },
      { t: "Last Fri", txt: "Buffer topped up +S$60", kind: "auto" },
    ]);
  };

  const weekNo = 10 + step;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8"
      style={{ background: "linear-gradient(160deg,#1B1B20 0%,#26262E 100%)", fontFamily: "'Manrope',system-ui,sans-serif" }}>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10 w-full max-w-5xl">

        {/* ── Phone ── */}
        <div className="relative w-full max-w-[380px] rounded-[44px] p-2.5 shrink-0"
          style={{ background: "#0C0C0F", boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}>
          <div className="rounded-[36px] overflow-hidden relative flex flex-col" style={{ background: FOG, height: 760 }}>

            {/* status bar + header */}
            <div style={{ background: PAPER }}>
              <div className="flex justify-between items-center px-6 pt-3 pb-1 text-[11px] font-bold" style={{ color: INK }}>
                <span>9:41</span>
                <div className="w-20 h-5 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" style={{ background: "#0C0C0F" }} />
                <span style={{ fontVariantNumeric: "tabular-nums" }}>100%</span>
              </div>
              <div className="px-5 pt-2 pb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[.14em]" style={{ color: RED }}>OCBC STEADY</div>
                  <div className="text-[17px] font-extrabold" style={{ color: INK }}>Hi Farhan</div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "#E5F3EE" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  <span className="text-[10px] font-bold" style={{ color: GREEN }}>Agent active</span>
                </div>
              </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

              {tab === "home" && (
                <>
                  {/* salary card */}
                  <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg,${RED} 0%,${RED_DARK} 100%)` }}>
                    <div className="text-[10.5px] font-bold tracking-wide opacity-85">YOUR STEADY SALARY</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-[34px] font-extrabold leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>S$850</span>
                      <span className="text-[12px] font-medium opacity-85">every Friday</span>
                    </div>
                    <div className="text-[11px] mt-2 opacity-90">
                      {step + 10} straight weeks paid in full — through lean weeks and strong ones.
                    </div>
                  </div>

                  {/* chart card */}
                  <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                    <div className="text-[11px] font-bold tracking-wide mb-2" style={{ color: INK }}>
                      VOLATILE EARNINGS, STABLE PAY
                    </div>
                    <EarningsChart history={history} weeksDone={step} />
                  </div>

                  {/* buffer */}
                  <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                    <BufferMeter value={buffer} target={3400} />
                  </div>

                  {/* goal */}
                  <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: PAPER }}>
                    <div>
                      <div className="text-[11px] font-bold tracking-wide" style={{ color: INK }}>BTO DOWN-PAYMENT FUND</div>
                      <div className="text-[10.5px] mt-0.5" style={{ color: "#8A8A92" }}>Surplus sweeps land here</div>
                    </div>
                    <div className="text-[19px] font-extrabold" style={{ color: GREEN, fontVariantNumeric: "tabular-nums" }}>
                      {fmt(goal)}
                    </div>
                  </div>

                  {floatHeld > 0 && (
                    <div className="rounded-2xl p-3.5 text-[11.5px]" style={{ background: "#FBF3E3", color: "#8A6210" }}>
                      {fmt(floatHeld)} held in your current account after you declined a sweep. Steady won't move it.
                    </div>
                  )}
                </>
              )}

              {tab === "ladder" && (
                <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                  <div className="text-[11px] font-bold tracking-wide" style={{ color: INK }}>
                    WEEK {weekNo} ALLOCATION
                  </div>
                  <div className="text-[10.5px] mb-1" style={{ color: "#8A8A92" }}>
                    Gig earnings in: <b style={{ color: INK }}>{fmt(current ? current.earnings : 1435)}</b> · applied top-down, every Friday
                  </div>
                  <div className="divide-y" style={{ borderColor: FOG }}>
                    <Rung n="1" animKey={animKey} delay={100} tone="ink"
                      name="MediSave & tax set-aside" sub="15% locked first — never spendable"
                      amount={fmt(current ? current.cpf : 215)} />
                    <Rung n="2" animKey={animKey} delay={280} tone="ink"
                      name="Bills envelope" sub="Rent share, phone, insurance — pre-funded"
                      amount={fmt(310)} />
                    <Rung n="3" animKey={animKey} delay={460} tone="green"
                      name="Steady Salary" sub="Fixed weekly pay, every Friday"
                      amount="S$850" />
                    <Rung n="4" animKey={animKey} delay={640} tone={current && current.toBuffer < 0 ? "amber" : "ink"}
                      name="Buffer reserve"
                      sub={current && current.toBuffer < 0
                        ? "Lean week — buffer covered your salary shortfall"
                        : "Strong weeks held back, up to 4 weeks of salary"}
                      amount={current
                        ? current.toBuffer === 0
                          ? "full"
                          : (current.toBuffer > 0 ? "+" : "−") + "S$" + Math.abs(current.toBuffer).toLocaleString()
                        : "+S$60"} />
                    <Rung n="5" animKey={animKey} delay={820} tone={current && current.needsApproval && approval ? "red" : "green"}
                      name="Sweep to goals"
                      sub={current && current.needsApproval && approval
                        ? "Above your S$500 limit — waiting for your OK"
                        : "Only flows once the buffer is full"}
                      amount={current ? (current.sweep > 0 ? fmt(current.sweep) : "—") : "—"} />
                  </div>
                </div>
              )}

              {tab === "log" && (
                <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                  <div className="text-[11px] font-bold tracking-wide mb-3" style={{ color: INK }}>EVERY MOVE, ON THE RECORD</div>
                  <div className="space-y-3">
                    {logs.map((l, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <LogIcon kind={l.kind} />
                        <div className="min-w-0">
                          <div className="text-[12px] leading-snug" style={{ color: INK }}>{l.txt}</div>
                          <div className="text-[10px]" style={{ color: "#A0A0A8" }}>{l.t} · reversible for 24h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "rules" && (
                <>
                  <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[11px] font-bold tracking-wide" style={{ color: INK }}>YOUR CONSTITUTION</div>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: FOG, color: "#6E6E76" }}>v2 · edited 12 Jul</span>
                    </div>
                    <div className="text-[10.5px] mb-3" style={{ color: "#8A8A92" }}>
                      The rules Steady must follow. You can change any of them, any time.
                    </div>
                    <div className="text-[10px] font-extrabold tracking-[.12em] mb-2" style={{ color: GREEN }}>STEADY ACTS ON ITS OWN</div>
                    {[
                      "Set aside 15% for MediSave & income tax",
                      "Fund the bills envelope (S$310/week)",
                      "Pay the S$850 salary every Friday",
                      "Top up lean weeks from the buffer",
                      "Sweep surpluses of S$500 or less to goals",
                    ].map((s, i) => (
                      <div key={i} className="flex gap-2 items-start py-1">
                        <span className="text-[11px] mt-px" style={{ color: GREEN }}>✓</span>
                        <span className="text-[12px]" style={{ color: INK }}>{s}</span>
                      </div>
                    ))}
                    <div className="text-[10px] font-extrabold tracking-[.12em] mt-4 mb-2" style={{ color: RED }}>STEADY ASKS YOU FIRST</div>
                    {[
                      "Any single move above S$500",
                      "Changing your salary amount",
                      "Adding or removing a goal",
                      "Drawing the buffer below 1 week",
                    ].map((s, i) => (
                      <div key={i} className="flex gap-2 items-start py-1">
                        <span className="text-[11px] mt-px" style={{ color: RED }}>✋</span>
                        <span className="text-[12px]" style={{ color: INK }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: PAPER }}>
                    <div className="text-[10px] font-extrabold tracking-[.12em] mb-2" style={{ color: "#6E6E76" }}>ALWAYS ON</div>
                    {[
                      "Reverse any agent move within 24 hours",
                      "Auto-pause if your balance falls under S$200",
                      "Full action log, exportable any time",
                    ].map((s, i) => (
                      <div key={i} className="flex gap-2 items-start py-1">
                        <span className="text-[11px] mt-px" style={{ color: "#6E6E76" }}>●</span>
                        <span className="text-[12px]" style={{ color: INK }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* toast */}
            {toast && (
              <div className="absolute left-4 right-4 bottom-20 rounded-xl px-4 py-3 text-[12px] font-bold text-white"
                style={{ background: "rgba(23,23,26,.94)", backdropFilter: "blur(6px)" }}>
                {toast}
              </div>
            )}

            {/* approval modal */}
            {approval && (
              <div className="absolute inset-0 flex items-end z-20" style={{ background: "rgba(12,12,15,.45)" }}>
                <div className="w-full rounded-t-3xl p-5 pb-6" style={{ background: PAPER }}>
                  <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "#DDD" }} />
                  <div className="text-[10px] font-extrabold tracking-[.14em] mb-1" style={{ color: RED }}>STEADY NEEDS YOUR OK</div>
                  <div className="text-[17px] font-extrabold leading-snug" style={{ color: INK }}>
                    Move {fmt(approval)} to your BTO fund?
                  </div>
                  <div className="text-[12px] mt-2 leading-relaxed" style={{ color: "#6E6E76" }}>
                    Your buffer is full, so this surplus can go to goals. But it's above your
                    <b style={{ color: INK }}> S$500 per-move limit</b>, so under your Constitution, Steady won't move it without you.
                  </div>
                  <div className="text-[10.5px] mt-2" style={{ color: "#A0A0A8" }}>
                    No reply in 48h? Nothing moves — it stays in your current account.
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button onClick={() => resolveApproval(false)}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold"
                      style={{ background: FOG, color: INK }}>
                      Keep in account
                    </button>
                    <button onClick={() => resolveApproval(true)}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white"
                      style={{ background: RED }}>
                      Approve move
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* tab bar */}
            <div className="flex justify-around items-center px-2 pt-2 pb-4 border-t" style={{ background: PAPER, borderColor: "#ECECEF" }}>
              {[
                ["home", "Home"],
                ["ladder", "Ladder"],
                ["log", "Activity"],
                ["rules", "Constitution"],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                  style={{
                    color: tab === id ? RED : "#9A9AA1",
                    background: tab === id ? "#FBEEE9" : "transparent",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Presenter rail ── */}
        <div className="w-full max-w-[380px] lg:max-w-[340px] lg:pt-6">
          <div className="text-[10px] font-extrabold tracking-[.18em] text-white/40 mb-3">PRESENTER CONTROLS</div>

          <div className="space-y-2 mb-5">
            {SCRIPT.map((w, i) => {
              const state = i < step ? "done" : i === step ? "next" : "later";
              return (
                <div key={w.week} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                  style={{
                    background: state === "next" ? "rgba(225,37,27,.14)" : "rgba(255,255,255,.05)",
                    border: state === "next" ? `1px solid rgba(225,37,27,.5)` : "1px solid rgba(255,255,255,.07)",
                    opacity: state === "later" ? 0.45 : 1,
                  }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0"
                    style={{
                      background: state === "done" ? GREEN : state === "next" ? RED : "rgba(255,255,255,.12)",
                      color: "white",
                    }}>
                    {state === "done" ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-white">Week {w.week} · {w.tag}</div>
                    <div className="text-[10.5px] text-white/50" style={{ fontVariantNumeric: "tabular-nums" }}>
                      Earnings {fmt(w.earnings)}{w.needsApproval ? " · approval moment" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!done && !approval && next && (
            <button onClick={advance}
              className="w-full py-3.5 rounded-xl text-[14px] font-extrabold text-white mb-3"
              style={{ background: RED, boxShadow: "0 6px 24px rgba(225,37,27,.4)" }}>
              Advance to Week {next.week} — {next.tag.toLowerCase()}
            </button>
          )}
          {approval && (
            <div className="w-full py-3 rounded-xl text-[12px] font-bold text-center mb-3"
              style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.75)" }}>
              Resolve the approval on the phone to continue
            </div>
          )}
          {done && !approval && (
            <div className="w-full py-3 rounded-xl text-[12px] font-bold text-center mb-3"
              style={{ background: "rgba(12,122,90,.2)", color: "#5FCBA8", border: "1px solid rgba(12,122,90,.45)" }}>
              End of demo — four volatile weeks, one flat salary line.
            </div>
          )}

          <button onClick={reset}
            className="w-full py-2.5 rounded-xl text-[12px] font-bold"
            style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)" }}>
            Reset demo
          </button>

          <div className="mt-5 rounded-xl p-3.5 text-[11px] leading-relaxed"
            style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)", border: "1px solid rgba(255,255,255,.07)" }}>
            <span className="font-extrabold text-white/80">Cue: </span>
            {approval
              ? SCRIPT[step - 1].cue
              : done
                ? "Recap and hand to Q&A. Constitution tab is your answer to any 'runaway agent' question."
                : step === 0
                  ? "Open on Home: Farhan's earnings jump around, his Friday salary doesn't. Then advance."
                  : SCRIPT[step - 1].cue}
          </div>
        </div>
      </div>
    </div>
  );
}
