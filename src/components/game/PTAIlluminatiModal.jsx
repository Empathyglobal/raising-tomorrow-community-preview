import React, { useMemo } from "react";
import { useConfirm } from "./ConfirmProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameState } from "./GameStateContext";

const OPS_PER_AGE_LIMIT = 1;

// Keep these values in sync with GameStateContext.jsx yearly overhead.
const PTA_RANKS = [
  {
    index: 0,
    id: "civilian",
    title: "Civilian",
    emoji: "😇",
    desc: "Blissfully email-free. No one is asking you to bring napkins at dawn.",
    yearlyFocusTax: 0,
    yearlyStressTax: 0,
  },
  {
    index: 1,
    id: "snack_chair",
    title: "Snack Chair",
    emoji: "🧃",
    desc: "Initiate level. Keeper of juice boxes. Observer of the first laminate.",
    yearlyFocusTax: 1,
    yearlyStressTax: 1,
  },
  {
    index: 2,
    id: "treasurer",
    title: "Treasurer",
    emoji: "🧾",
    desc: "Guardian of spreadsheets and mysterious line items labeled 'misc.'",
    yearlyFocusTax: 1,
    yearlyStressTax: 2,
  },
  {
    index: 3,
    id: "supreme_binder_keeper",
    title: "Supreme Binder Keeper",
    emoji: "📎",
    desc: "Wielder of the laminated schedule. Feared. Organized. Unstoppable.",
    yearlyFocusTax: 2,
    yearlyStressTax: 2,
  },
];

const PROMOTION_REQUIREMENTS = {
  1: { nextRankIndex: 2, nextTitle: "Treasurer", support: 8, network: 4 },
  2: { nextRankIndex: 3, nextTitle: "Supreme Binder Keeper", support: 18, network: 10 },
};

const PTA_OPS = [
  {
    id: "coded_email",
    minRank: 1,
    emoji: "📧",
    label: "Decode a Coded Email",
    focusCost: 1,
    supportDelta: 1,
    networkDelta: 2,
    stressDelta: 1,
    loveDelta: 0,
    deltas: { empathy: 0.1, confidence: 0.2, discipline: 0.1, intelligence: 0 },
    flavor: [
      "Subject line: 're: re: re: IMPORTANT (not important)' — you scroll until your thumb gains wisdom.",
      "The email contains three fonts, two passive-aggressive emojis, and one terrifying phrase: 'circle back.'",
      "You learn the ancient PTA cipher: 'can someone' means 'you.'",
    ],
  },
  {
    id: "clandestine_bake_sale",
    minRank: 1,
    emoji: "🧁",
    label: "Run a Clandestine Bake Sale",
    focusCost: 1,
    supportDelta: 2,
    networkDelta: 1,
    stressDelta: 1,
    loveDelta: 0,
    deltas: { empathy: 0.1, confidence: 0.1, discipline: 0.2, intelligence: 0 },
    flavor: [
      "You sell cupcakes 'for the children,' but the whispers are strictly for the adults.",
      "A tray of brownies disappears instantly. You choose not to ask questions. You are learning.",
      "Someone compliments your frosting. You suspect recruitment.",
    ],
  },
  {
    id: "glitter_budget_audit",
    minRank: 2,
    emoji: "🧾",
    label: "Audit the Glitter Budget",
    focusCost: 1,
    supportDelta: 2,
    networkDelta: 1,
    stressDelta: 2,
    loveDelta: 0,
    deltas: { empathy: 0, confidence: 0.1, discipline: 0.2, intelligence: 0.2 },
    flavor: [
      "The ledger contains a line item called 'Sparkles (necessary).' You nod solemnly.",
      "You reconcile receipts. The receipts… do not reconcile you back.",
      "A whisper: 'We don't talk about the balloon arch.' A chill runs down your spine.",
    ],
  },
  {
    id: "lamination_ritual",
    minRank: 3,
    emoji: "🗓️",
    label: "Perform the Lamination Ritual",
    focusCost: 1,
    supportDelta: 3,
    networkDelta: 1,
    stressDelta: 2,
    loveDelta: 0,
    deltas: { empathy: 0, confidence: 0.2, discipline: 0.3, intelligence: 0.1 },
    flavor: [
      "They chant: 'Cut. Punch. Bind.' The schedule is sealed against time itself.",
      "The laminator hums like a tiny portal. You emerge… slightly shinier.",
      "You hold the sacred binder aloft. Someone whispers: 'Supreme.'",
    ],
  },
];

function clampPct(value, max) {
  const v = Number.isFinite(value) ? value : 0;
  const m = Number.isFinite(max) && max > 0 ? max : 1;
  return Math.max(0, Math.min(100, (v / m) * 100));
}

function pickRandom(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function Meter({ label, value, max }) {
  const pct = clampPct(value, max);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-slate-500">
          {Math.floor(value)}/{max}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

export default function PTAIlluminatiModal({ open, onClose }) {
  const confirm = useConfirm();
  const {
    gameState,
    updateState,
    spendFocus,
    applyStress,
    applyLove,
    applyDeltas,
    emitActionResult,
  } = useGameState();

  const currentYear = gameState.currentYear;
  const finished = gameState.finished;

  const expansionEnabled = !!gameState.expansions?.ptaIlluminati;

  const pta = gameState.ptaIlluminati || {
    joined: false,
    rankIndex: 0,
    support: 0,
    network: 0,
    opsByAge: {},
  };

  const rankIndex = Math.max(0, Math.min(3, Math.floor(Number(pta.rankIndex || 0))));
  const rank = PTA_RANKS[rankIndex] || PTA_RANKS[0];

  const opsThisAge = Number(pta.opsByAge?.[currentYear] || 0);
  const opsRemaining = Math.max(0, OPS_PER_AGE_LIMIT - opsThisAge);

  const availableOps = useMemo(() => {
    if (!pta.joined) return [];
    return PTA_OPS.filter((op) => op.minRank <= rankIndex);
  }, [pta.joined, rankIndex]);

  const promotionInfo = PROMOTION_REQUIREMENTS[rankIndex];
  const canPromote =
    !!promotionInfo &&
    pta.joined &&
    Number(pta.support) >= promotionInfo.support &&
    Number(pta.network) >= promotionInfo.network;

  const setPta = (next) => {
    updateState({
      ptaIlluminati: next,
    });
  };

  const bumpOpsThisAge = (nextPta) => {
    const nextOpsByAge = { ...(nextPta.opsByAge || {}) };
    nextOpsByAge[currentYear] = Number(nextOpsByAge[currentYear] || 0) + 1;
    return { ...nextPta, opsByAge: nextOpsByAge };
  };

  const handleJoin = () => {
    if (!expansionEnabled || finished) return;

    if (currentYear < 6) {
      emitActionResult({
        actionId: "ptaIlluminati",
        title: "Not Yet",
        body: "The PTA only reveals itself once school begins.",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ["pta"],
        meta: { emoji: "🕶️" },
      });
      return;
    }

    // Joining counts as this age's PTA "operation" (it's a whole thing).
    if (opsThisAge >= OPS_PER_AGE_LIMIT) {
      emitActionResult({
        actionId: "ptaIlluminati",
        title: "Already Busy This Age",
        body: "You've already spent your yearly quota of PTA energy. The binder demands rest.",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ["pta"],
        meta: { emoji: "🕶️" },
      });
      return;
    }

    const ok = spendFocus(1, "PTA initiation");
    if (!ok) return;

    applyStress(1, "PTA initiation");
    applyDeltas({ empathy: 0.1, confidence: 0.1, discipline: 0.1, intelligence: 0 }, "PTA");

    let nextPta = {
      ...pta,
      joined: true,
      rankIndex: 1,
      support: Math.floor(Number(pta.support || 0) + 2),
      network: Math.floor(Number(pta.network || 0) + 1),
    };
    nextPta = bumpOpsThisAge(nextPta);
    setPta(nextPta);

    emitActionResult({
      actionId: "ptaIlluminati",
      title: "🕶️ Initiated into the PTA",
      body:
        "You join the PTA. A folder appears. It's laminated. Someone smiles and says, 'Welcome, Snack Chair.'",
      deltas: { empathy: 0.1, confidence: 0.1, discipline: 0.1, intelligence: 0 },
      loveDelta: 0,
      stressDelta: 1,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["pta", "expansion"],
      meta: { emoji: "🧃", rank: "Snack Chair" },
    });
  };

  const handleOp = (op) => {
    if (!expansionEnabled || finished) return;
    if (!pta.joined) return;

    if (opsThisAge >= OPS_PER_AGE_LIMIT) return;

    const ok = spendFocus(op.focusCost, op.label);
    if (!ok) return;

    if (op.stressDelta) applyStress(op.stressDelta, op.label);
    if (op.loveDelta) applyLove(op.loveDelta, op.label);
    if (op.deltas) applyDeltas(op.deltas, op.label);

    const nextPtaBase = {
      ...pta,
      support: Math.floor(Number(pta.support || 0) + (op.supportDelta || 0)),
      network: Math.floor(Number(pta.network || 0) + (op.networkDelta || 0)),
    };
    const nextPta = bumpOpsThisAge(nextPtaBase);
    setPta(nextPta);

    const flavor = pickRandom(op.flavor);

    emitActionResult({
      actionId: "ptaIlluminati",
      title: `${op.emoji} PTA Operation: ${op.label}`,
      body:
        `${flavor}\n\nGains: +${op.supportDelta} School Support, +${op.networkDelta} Networking.`,
      deltas: op.deltas || {},
      loveDelta: op.loveDelta || 0,
      stressDelta: op.stressDelta || 0,
      moneyDelta: 0,
      focusDelta: -op.focusCost,
      tags: ["pta", "expansion"],
      meta: { emoji: op.emoji, op: op.id },
    });
  };

  const handlePromote = () => {
    if (!expansionEnabled || finished) return;
    if (!canPromote || !promotionInfo) return;

    const nextRank = PTA_RANKS[promotionInfo.nextRankIndex];
    if (!nextRank) return;

    // Promotions are free in focus terms… but not emotionally.
    applyStress(1, "PTA promotion");

    const nextPta = {
      ...pta,
      rankIndex: promotionInfo.nextRankIndex,
    };
    setPta(nextPta);

    emitActionResult({
      actionId: "ptaIlluminati",
      title: `${nextRank.emoji} Promoted: ${promotionInfo.nextTitle}`,
      body:
        `A ceremonial binder is opened. A laminated schedule is revealed. You are now ${promotionInfo.nextTitle}.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 1,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ["pta", "expansion"],
      meta: { emoji: nextRank.emoji, rank: promotionInfo.nextTitle },
    });
  };

  const handleFavor = () => {
    if (!expansionEnabled || finished) return;
    if (!pta.joined) return;

    if (Number(pta.network || 0) < 5) return;

    // Spend networking to reduce stress (a real perk)
    const nextPta = {
      ...pta,
      network: Math.floor(Number(pta.network || 0) - 5),
    };
    setPta(nextPta);

    applyStress(-2, "PTA favor");

    emitActionResult({
      actionId: "ptaIlluminati",
      title: "🤝 PTA Favor Called In",
      body:
        "You text a mysterious contact. Within minutes, someone 'handles it.' You feel your shoulders drop.",
      deltas: {},
      loveDelta: 0,
      stressDelta: -2,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ["pta", "expansion"],
      meta: { emoji: "🤝" },
    });
  };

  const handleResign = async () => {
    if (!pta.joined) return;
    if (finished) return;

    const ok = await confirm({
      title: 'Resign from the PTA?',
      description: "You'll stop the yearly overhead next age, but you'll lose your official access to the Binder.",
      confirmText: 'Resign'
    });
    if (!ok) return;

    const nextPta = {
      ...pta,
      joined: false,
      rankIndex: 0,
    };
    setPta(nextPta);

    applyStress(-1, "PTA resignation");

    emitActionResult({
      actionId: "ptaIlluminati",
      title: "🚪 Resigned from the PTA",
      body:
        "You step back into the daylight. The group chat fades. The laminate's power no longer calls to you.",
      deltas: {},
      loveDelta: 0,
      stressDelta: -1,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ["pta", "expansion"],
      meta: { emoji: "🚪" },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">🕶️</span>
            <span>The PTA Illuminati Pack</span>
          </DialogTitle>
        </DialogHeader>

        {!expansionEnabled && (
          <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm">
            This expansion is currently disabled in <b>Settings → Expansions</b>.
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">Status</div>
                <div className="text-lg font-bold text-slate-800">
                  {rank.emoji} {rank.title}
                </div>
                <div className="text-xs text-slate-600 mt-1">{rank.desc}</div>
              </div>

              {pta.joined && (
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Support: {Math.floor(Number(pta.support || 0))}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Network: {Math.floor(Number(pta.network || 0))}
                  </Badge>
                </div>
              )}
            </div>

            {pta.joined && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Meter label="School Support" value={Number(pta.support || 0)} max={25} />
                <Meter label="Networking" value={Number(pta.network || 0)} max={15} />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Core loop: Snack Chair → Treasurer → Supreme Binder Keeper
              </Badge>
              {pta.joined && (
                <Badge variant="outline" className="text-xs">
                  Yearly overhead: -{rank.yearlyFocusTax} Focus • +{rank.yearlyStressTax} Stress
                </Badge>
              )}
            </div>
          </div>

          {!pta.joined ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-700">
                You join the PTA… and it's run like a secret society.
              </div>
              <div className="text-xs text-slate-600">
                Expect coded emails, clandestine bake sales, and rituals involving laminated schedules.
                You'll gain School Support + Networking… at the cost of Stress and Focus.
              </div>

              <Button
                className="w-full"
                onClick={handleJoin}
                disabled={!expansionEnabled || finished}
              >
                🧃 Join PTA (Snack Chair) — 1 Focus
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800">PTA Operations</div>
                  <Badge variant="secondary" className="text-xs">
                    {opsRemaining} left this age
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {availableOps.map((op) => {
                    const disabled =
                      !expansionEnabled ||
                      finished ||
                      opsThisAge >= OPS_PER_AGE_LIMIT ||
                      gameState.actionPoints < op.focusCost;

                    return (
                      <Button
                        key={op.id}
                        variant="outline"
                        className="justify-between"
                        disabled={disabled}
                        onClick={() => handleOp(op)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{op.emoji}</span>
                          <span className="text-sm font-medium">{op.label}</span>
                          {op.minRank > 1 && (
                            <Badge variant="secondary" className="text-[10px]">
                              Rank {op.minRank}+
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">-{op.focusCost} Focus</span>
                      </Button>
                    );
                  })}
                </div>

                {opsThisAge >= OPS_PER_AGE_LIMIT && (
                  <div className="text-xs text-slate-600">
                    You've already done your PTA duty this age. (The binder demands rest.)
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-800">Rank Progress</div>

                {promotionInfo ? (
                  <>
                    <div className="text-xs text-slate-600">
                      Next rank: <b>{promotionInfo.nextTitle}</b> requires{" "}
                      <b>{promotionInfo.support}</b> Support and <b>{promotionInfo.network}</b>{" "}
                      Network.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Meter label="Support" value={Number(pta.support || 0)} max={promotionInfo.support} />
                      <Meter label="Network" value={Number(pta.network || 0)} max={promotionInfo.network} />
                    </div>

                    <Button
                      className="w-full mt-2"
                      onClick={handlePromote}
                      disabled={!expansionEnabled || finished || !canPromote}
                    >
                      {canPromote ? "⬆️ Ascend" : "🔒 Not eligible yet"} — {promotionInfo.nextTitle}
                    </Button>
                  </>
                ) : (
                  <div className="text-xs text-slate-600">
                    You've reached the top. The binder is yours. The emails are endless.
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-800">Favors</div>
                <div className="text-xs text-slate-600">
                  Spend Networking to reduce Stress (aka: weaponize your group chat).
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={handleFavor}
                  disabled={!expansionEnabled || finished || Number(pta.network || 0) < 5}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🤝</span>
                    <span className="text-sm font-medium">Call in a PTA Favor</span>
                  </span>
                  <span className="text-xs text-slate-500">-5 Network • -2 Stress</span>
                </Button>
              </div>

              <Separator />

              <Button
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleResign}
              >
                🚪 Resign from the PTA
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}