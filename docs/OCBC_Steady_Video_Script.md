# OCBC Steady — 7-Minute Video Presentation Script (5 Speakers)

**Total runtime target: 6:50–7:00 at a natural pace (~150 words/min).**
Record on Teams/Zoom with the deck shared. Slide cues are marked ▶. Handovers are written in — say them, they keep the video feeling like a team, not five monologues.

---

## SPEAKER 1 — Hook & Problem Statement (0:00 – 1:20) · Slides 1–2

▶ **Slide 1 (title)**

Hi judges, we're Team Sigma Boys, and we want to start with a person, not a product.

Previously we had an idea about a wealth management agentic ai but we learned about WoW being launched on 1 july. an AI native app delivering personalised wealth management in real time, targetting those with at least 1.5 million assests under management so we decided to work in a different direction. instead of appealing to the wealthy, we will be focusing our attention on those who have been overlooked

Imagine you drive for Grab. Yesterday you earned four hundred dollars. Today, ninety. Your rent doesn't care. Your CPF contribution doesn't care. Nobody smooths your income, nobody sets aside your obligations, nobody plans your bad weeks — because you don't have the one thing every salaried person takes for granted: a payroll department.

We're addressing OCBC's Intelligent Banking problem statement:

▶ **Slide 2 (problem statement)**

"How can OCBC leverage autonomous, decision-making AI across customer journeys to differentiate itself and emerge as the market leader?"

We took three words in that sentence seriously. *Autonomous* means the AI acts — it doesn't send you a notification and wait. *Journeys* means value delivered continuously over months and years, not one clever moment at onboarding. And *differentiation* means doing something a customer would point at and say: no other bank does this for me.

Our answer is OCBC Steady — the autonomous paycheck. [Name], who is it for?

---

## SPEAKER 2 — Target Segment & Why Now (1:20 – 2:45) · Slides 3–4

▶ **Slide 3 (segment)**

Steady is for the segment payroll forgot. Singapore has around seventy thousand five hundred platform workers — private-hire drivers, taxi drivers, delivery riders — about three percent of our entire labour force, earning a median of around two and a half thousand dollars a month.

Their problem isn't low income. It's *lumpy* income colliding with a fixed-cost life. Four pains, one root cause. One: a bad fortnight becomes a missed rent payment. Two: under the new Platform Workers Act, they now have real CPF and tax obligations to compute and set aside — manually, every month. Three: saving requires daily discipline that no salaried employee is ever asked to have. And four: with no payslip, they're invisible to credit, loans and BTO financing.

▶ **Slide 4 (why now)**

And the timing matters. The Platform Workers Act came into force in January 2025. This year, operator CPF contributions doubled. By 2029, workers will contribute up to twenty percent of income. Financial admin just became mandatory for seventy thousand people who have no tools for it.

Meanwhile — five days ago — OCBC launched WoW, an AI-native app with agentic avatars… for clients with one and a half million dollars in assets. The architecture for agentic banking now exists inside OCBC. Steady points it at the other ninety-nine percent — starting, quite literally, with the drivers who take WoW's customers home. [Name], show them the solution.

---

## SPEAKER 3 — Solution & How It Works (2:45 – 4:15) · Slides 5–6

▶ **Slide 5 (solution)**

OCBC Steady is an agent, not an app. In one sentence: it converts volatile daily earnings into a stable weekly salary, autonomously handling CPF, tax, bills and buffers — exactly like a payroll department would.

It runs a continuous loop. It *observes* — streaming earnings from Grab, foodpanda, TADA as they land in the account. It *decides* — allocating every dollar against rules the user wrote. It *acts* — actually moving money between the user's OCBC pockets, on its own, below set limits. And it *explains* — every single action gets a plain-language receipt, reversible for twenty-four hours. Notice the difference from every budgeting app you've seen: those tell you what you should do. Steady has already done it.

▶ **Slide 6 (ladder)**

Here's the intelligence, and deliberately, it's boring. Every dollar earned climbs the same five-rung ladder. Rung one: obligations first — CPF, MediSave and tax set-asides, computed per payout and locked away. Rung two: the bills envelope — rent, vehicle rental, insurance, pre-funded before they're due. Rung three: the Steady Salary — a fixed weekly amount paid into the spending account, so a good week and a bad week feel the same. Rung four: a four-week buffer, the shock absorber. Rung five: anything above the buffer gets swept to goals or higher-yield products — and that's the one rung where Steady always asks first.

Deterministic, ordered, auditable. Which raises the question every judge should ask: what stops this from going rogue? [Name]?

---

## SPEAKER 4 — Trust Model, Journey & UI (4:15 – 5:40) · Slides 7–9

▶ **Slide 7 (constitution)**

Nothing goes rogue, because the user writes the constitution. Three zones. Green — Steady acts alone: moves below the user's own cap, say four hundred dollars, and only ever between the user's own OCBC accounts. Amber — Steady asks first: anything above the cap, changing the salary amount, drawing the buffer low, or any new product. Red — Steady never touches: money never leaves the user's accounts, no investing, and it never judges your spending. It manages flow, not lifestyle. Every action: receipt, twenty-four-hour undo, monthly "what I did and why" report. Autonomy is a dial the customer holds — that's our answer to "humans in control."

▶ **Slide 8 (a week with Steady)**

Let me make it real. Aisyah, twenty-seven, drives private-hire. Monday to Wednesday she has a strong week — Steady quietly sets aside her CPF and tax per trip payout, funds her bills, tops her buffer. She does nothing. Thursday and Friday, earnings drop forty percent — her salary of six hundred and twenty dollars still arrives on Friday, part-funded from buffer. Rent is never at risk. Then Saturday, she's injured and can't drive. Steady detects zero income, proposes a three-week plan, pre-fills her work-injury claim — and *asks* before acting. Silent in good weeks, reassuring in lean ones, deferential in a crisis.

▶ **Slide 9 (UI)**

And the interface reflects that: one number that matters — your next salary; an activity feed made of receipts and undo buttons; and a rules screen the user owns. Calm by design. [Name], can we actually build this?

---

## SPEAKER 5 — Implementation, Viability & Close (5:40 – 7:00) · Slides 10–11

▶ **Slide 10 (implementation)**

Yes — because Phase 1 is built entirely on rails OCBC already owns. Cash-only sweeps across OCBC 360 and savings pockets using OCBC's open APIs. The allocation ladder is deterministic rules; the LLM only writes the explanations — so there's no investment licensing exposure and no black-box moving money. Earnings are read from platform payout deposits, and we'd pilot with five hundred drivers through NTUC's associations. That's demonstrable within six months.

Phase 2 adds direct payout APIs with the platforms, CPF integration for set-asides, and SGFinDex for the full income picture. Phase 3 plugs Steady into WoW's four-layer AI-native stack — and turns the Steady income record into a payslip-equivalent for OCBC home loans.

▶ **Slide 11 (close)**

Why does OCBC win? Deposits — every dollar this segment earns routes through OCBC pockets, sticky balances from customers banks are currently losing to digital challengers. Trust as a moat — the constitution and receipts make "humans in control" a visible product feature. And strategy fit — it extends the exact architecture OCBC just announced, to a seventy-thousand-strong segment that regulation is pushing toward banks right now, and that no Singapore bank serves agentically.

OCBC WoW changed the face of banking for those who have wealth. OCBC Steady changes it for those still building it. For now, and beyond — for everyone. Thank you.

---

## Recording tips
- **Rehearse handovers.** The bracketed [Name] lines are where videos usually stumble; do one full run just for transitions.
- **Timing checkpoints:** Speaker 2 should start by 1:25, Speaker 4 by 4:20, Speaker 5 by 5:45. If you're behind, Speaker 4 trims the UI slide narration — the visuals carry it.
- **Judging-criteria mapping if asked in Q&A:** Originality → only agentic product for gig workers in SG, whitespace vs WoW. Presentation → the Aisyah story. Implementation → Phase 1 is rules + existing OCBC products. Target segment impact → 70,500 workers, PWA-driven urgency.
