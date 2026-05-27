import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  TrendingUp,
  Building2,
  Info,
  ExternalLink,
  Calculator,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { SurebetCard } from "../components/dashboard/SurebetCard";
import {
  MOCK_SUREBETS,
  LIVE_SUREBETS,
  Surebet,
  BetLeg,
  formatCurrency,
} from "../components/dashboard/mockData";
import { FilterState } from "../components/layout/Sidebar";
import { BookmakerLogo } from "../components/ui/BookmakerLogo";

interface OutletContextType {
  appliedFilters: FilterState;
  activeTab: "prelive" | "live";
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

export function PlatformPage() {
  const { appliedFilters, activeTab } = useOutletContext<OutletContextType>();
  const [selectedCard, setSelectedCard] = useState<Surebet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const baseData = activeTab === "live" ? LIVE_SUREBETS : MOCK_SUREBETS;

  const filteredData = useMemo(() => {
    let data = [...baseData];

    data = data.filter((s) => s.legs.length === appliedFilters.options);
    data = data.filter(
      (s) =>
        s.profitPct >= appliedFilters.profitRange[0] &&
        s.profitPct <= appliedFilters.profitRange[1]
    );

    if (appliedFilters.selectedBookies.length === 0) {
      data = [];
    } else {
      data = data.filter((s) =>
        s.legs.some((leg) => appliedFilters.selectedBookies.includes(leg.bookmaker))
      );
    }

    if (activeTab === "live") {
      data = data.filter((s) => {
        if (!s.openingProfitPct) return true;
        const threshold = s.openingProfitPct * (1 - appliedFilters.profitDecayTolerance / 100);
        return s.profitPct >= threshold;
      });
    }

    if (appliedFilters.sortBy === "profit") {
      data.sort((a, b) => b.profitPct - a.profitPct);
    } else if (appliedFilters.sortBy === "recent") {
      data.reverse();
    } else if (appliedFilters.sortBy === "start") {
      data.sort((a, b) => a.startsInMinutes - b.startsInMinutes);
    }

    return data;
  }, [baseData, appliedFilters]);

  const handleCardClick = (surebet: Surebet) => {
    setSelectedCard(surebet);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            {activeTab === "live" ? "Sinais ao Vivo" : "Sinais Pré-Live"}
          </h1>
          <span
            className="px-3 rounded-full flex items-center"
            style={{
              backgroundColor: "rgba(139,242,193,0.08)",
              border: "1px solid rgba(139,242,193,0.25)",
              height: "24px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#8bf2c1",
            }}
          >
            {filteredData.length} oportunidades
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Atualizado agora
          </span>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#8bf2c1",
              display: "inline-block",
            }}
          />
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <AnimatePresence mode="sync">
          {filteredData.length > 0 ? (
            filteredData.map((surebet, index) => (
              <SurebetCard
                key={surebet.id}
                surebet={surebet}
                index={index}
                onClick={handleCardClick}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center rounded-xl py-16"
              style={{
                backgroundColor: "#15181e",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</span>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Nenhuma oportunidade encontrada
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#71717a",
                }}
              >
                Ajuste os filtros para ver mais sinais
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedCard && (
          <SurebetDetailModal
            surebet={selectedCard}
            onClose={() => setIsDetailOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Detail panel / bottom sheet ─────────────────────────────────────────────
type CalcTab = "total" | number;

interface CalculatedLeg extends BetLeg {
  calculatedStake: number;
  legReturn: number;
}

export function SurebetDetailModal({
  surebet,
  onClose,
}: {
  surebet: Surebet;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const [calcTab, setCalcTab] = useState<CalcTab>("total");
  const [investmentStr, setInvestmentStr] = useState(
    surebet.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  );
  const [roundStakes, setRoundStakes] = useState(true);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const inv = useMemo(
    () => surebet.legs.reduce((sum, leg) => sum + 1 / leg.odds, 0),
    [surebet.legs]
  );

  const userValue = useMemo(() => {
    const cleaned = investmentStr.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  }, [investmentStr]);

  useEffect(() => {
    if (calcTab === "total") {
      setInvestmentStr(
        surebet.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      );
    } else {
      const legIndex = calcTab as number;
      const defaultStake = surebet.investment / (surebet.legs[legIndex].odds * inv);
      setInvestmentStr(
        defaultStake.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcTab]);

  const calculatedLegs: CalculatedLeg[] = useMemo(() => {
    const legs = surebet.legs;
    let stakes: number[];

    if (calcTab === "total") {
      stakes = legs.map((leg) => userValue / (leg.odds * inv));
    } else {
      const fixedIdx = calcTab as number;
      const fixedOdds = legs[fixedIdx].odds;
      const derivedTotal = userValue * fixedOdds * inv;
      stakes = legs.map((leg, i) =>
        i === fixedIdx ? userValue : derivedTotal / (leg.odds * inv)
      );
    }

    if (roundStakes) {
      stakes = stakes.map((s) => Math.round(s / 5) * 5);
    }

    return legs.map((leg, i) => ({
      ...leg,
      calculatedStake: stakes[i],
      legReturn: stakes[i] * leg.odds,
    }));
  }, [surebet.legs, calcTab, userValue, inv, roundStakes]);

  const totalStake = calculatedLegs.reduce((s, l) => s + l.calculatedStake, 0);
  const minReturn = Math.min(...calculatedLegs.map((l) => l.legReturn));
  const profitReal = minReturn - totalStake;
  const rentabilidade = totalStake > 0 ? (profitReal / totalStake) * 100 : 0;

  const isLive = surebet.time.startsWith("AO VIVO");

  const visibleLegs =
    calcTab === "total"
      ? calculatedLegs
      : [calculatedLegs[calcTab as number]].filter(Boolean);

  const tabs: { key: CalcTab; label: string; sub: string }[] = [
    { key: "total", label: "Total", sub: "Investimento" },
    ...surebet.legs.map((_, i) => ({
      key: i as CalcTab,
      label: `Casa ${i + 1}`,
      sub: "Valor disponível",
    })),
  ];

  const inputLabel =
    calcTab === "total"
      ? "Valor total a investir"
      : `Saldo disponível — Casa ${(calcTab as number) + 1} (${surebet.legs[calcTab as number].bookmaker})`;

  const inputHint = (() => {
    if (calcTab === "total") return null;
    const idx = calcTab as number;
    const others =
      surebet.legs.length === 2 ? `Casa ${idx === 0 ? 2 : 1}` : "das outras casas";
    const verb = surebet.legs.length === 2 ? "será calculada" : "serão calculadas";
    return `A stake ${surebet.legs.length === 2 ? "da" : ""} ${others} ${verb} automaticamente para garantir o lucro com base no valor que você tem disponível na Casa ${idx + 1}.`;
  })();

  const DOT_COLORS = ["#8bf2c1", "#43e5b1", "#01c896"];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      />

      {/* Panel — desktop side panel */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block fixed right-0 top-0 bottom-0 z-50 overflow-y-auto"
        style={{
          width: "480px",
          backgroundColor: "#15181e",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <div className="flex flex-col gap-10 px-6 py-12">
          {/* ── HEADER ── */}
          <div className="relative flex flex-col gap-6">
            <button
              onClick={onClose}
              className="absolute right-0 top-0"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", padding: 0 }}
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-1 pr-8">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#71717a", textTransform: "uppercase" }}>
                {surebet.league}
              </p>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px", lineHeight: "28px" }}>
                {surebet.game}
              </h2>
              <div className="flex items-center gap-3 pt-2">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#71717a" }}>
                  {isLive ? "Ao Vivo" : surebet.time}
                </span>
                {isLive && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl" style={{ backgroundColor: "#2c2f34" }}>
                    <div className="relative" style={{ width: "8px", height: "8px" }}>
                      <div className="absolute inset-0 rounded-full opacity-75" style={{ backgroundColor: "#8bf2c1" }} />
                      <div className="rounded-full" style={{ width: "8px", height: "8px", backgroundColor: "#8bf2c1" }} />
                    </div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#8bf2c1", letterSpacing: "1px", textTransform: "uppercase" }}>
                      {surebet.time}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-4 py-2 rounded-lg shrink-0" style={{ backgroundColor: "#8bf2c1" }}>
                <TrendingUp size={15} color="#080b0f" />
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "20px", fontWeight: 800, color: "#080b0f", letterSpacing: "-1px", lineHeight: "28px" }}>
                  +{surebet.profitPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex flex-col">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#71717a", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Retorno Estimado
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#e5e2e1" }}>
                  Lucro sobre R$ {formatCurrency(surebet.investment)}
                </span>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex flex-col gap-8">
            {/* Casas Envolvidas */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Building2 size={12} color="#71717a" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#71717a", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                  Casas Envolvidas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {surebet.legs.map((leg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex flex-col justify-between rounded-lg p-[17px]"
                    style={{ backgroundColor: "#080b0f", minHeight: "200px" }}
                  >
                    <div className="flex items-center justify-between pb-3">
                      <BookmakerLogo bookmakerName={leg.bookmaker} size="sm" />
                      <Info size={12} color="#71717a" />
                    </div>
                    <div className="pb-3 flex-1">
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "#71717a", lineHeight: "12.5px" }}>
                        {leg.market}
                      </p>
                    </div>
                    <div className="pb-2">
                      <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "30px", fontWeight: 800, color: "#e0ea87", letterSpacing: "-1.5px", lineHeight: "36px" }}>
                        {leg.odds.toFixed(2)}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 600, color: "#ffffff", lineHeight: "28px", marginTop: "4px" }}>
                        R$ {formatCurrency(leg.stake)}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "#71717a", lineHeight: "15px" }}>
                        Retorno: R$ {formatCurrency(leg.stake * leg.odds)}
                      </p>
                    </div>
                    {/* Como apostar */}
                    <div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#71717a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                        Como Apostar
                      </p>
                      <div
                        className="flex items-start gap-2"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "10px" }}
                      >
                        <Navigation size={12} color="#71717a" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "18px" }}>
                          <InstructionPath instrucoes={leg.instrucoes} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-1.5 py-[9px] rounded-[4px] transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#080b0f", border: "1px solid #8bf2c1", cursor: "pointer" }}
              >
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#8bf2c1" }}>
                  Abrir casas
                </span>
                <ExternalLink size={9} color="#8bf2c1" />
              </button>
            </div>

            {/* Calculator divider */}
            <div className="flex items-center gap-4">
              <Calculator size={18} color="#71717a" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#71717a", letterSpacing: "2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Calculadora de Stakes
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
            </div>

            {/* Calculator */}
            <CalculatorSection
              tabs={tabs}
              calcTab={calcTab}
              setCalcTab={setCalcTab}
              inputLabel={inputLabel}
              inputHint={inputHint}
              investmentStr={investmentStr}
              setInvestmentStr={setInvestmentStr}
              roundStakes={roundStakes}
              setRoundStakes={setRoundStakes}
              calculatedLegs={calculatedLegs}
              visibleLegs={visibleLegs}
              totalStake={totalStake}
              profitReal={profitReal}
              rentabilidade={rentabilidade}
              DOT_COLORS={DOT_COLORS}
              showProfitRow
              scrollableTabs={false}
            />
          </div>
        </div>
      </motion.div>

      {/* Panel — mobile bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 flex-col"
        style={{
          backgroundColor: "#15181e",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          height: "95vh",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between px-4 pt-2 pb-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-4">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#71717a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {surebet.league}
            </p>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                lineHeight: "26px",
              }}
            >
              {surebet.game}
            </h2>
            <div className="flex items-center gap-2 pt-1">
              {isLive ? (
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-xl"
                  style={{ backgroundColor: "#2c2f34" }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="rounded-full"
                    style={{ width: "6px", height: "6px", backgroundColor: "#8bf2c1", display: "inline-block" }}
                  />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#8bf2c1",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {surebet.time}
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#71717a",
                  }}
                >
                  {surebet.time}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#71717a",
              padding: 0,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Profit + return */}
        <div
          className="flex items-center gap-4 px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg shrink-0"
            style={{ backgroundColor: "#8bf2c1" }}
          >
            <TrendingUp size={14} color="#080b0f" />
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                color: "#080b0f",
                letterSpacing: "-0.8px",
              }}
            >
              +{surebet.profitPct.toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: "#71717a",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Retorno Estimado
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#e5e2e1",
              }}
            >
              Lucro sobre R$ {formatCurrency(surebet.investment)}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-6 px-4 py-4">
            {/* Casas Envolvidas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Building2 size={12} color="#71717a" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#71717a",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  Casas Envolvidas
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {surebet.legs.map((leg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex flex-col rounded-lg p-4"
                    style={{ backgroundColor: "#080b0f" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <BookmakerLogo bookmakerName={leg.bookmaker} size="sm" />
                      <Info size={12} color="#71717a" />
                    </div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#71717a",
                        lineHeight: "15px",
                        marginBottom: "10px",
                      }}
                    >
                      {leg.market}
                    </p>
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "26px",
                            fontWeight: 800,
                            color: "#e0ea87",
                            letterSpacing: "-1px",
                            lineHeight: "32px",
                          }}
                        >
                          {leg.odds.toFixed(2)}
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#ffffff",
                          }}
                        >
                          R$ {formatCurrency(leg.stake)}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#71717a",
                        }}
                      >
                        Retorno: R$ {formatCurrency(leg.stake * leg.odds)}
                      </p>
                    </div>
                    {/* Como apostar */}
                    <div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#71717a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                        Como Apostar
                      </p>
                      <div
                        className="flex items-start gap-2"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "10px" }}
                      >
                        <Navigation size={12} color="#71717a" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "18px" }}>
                          <InstructionPath instrucoes={leg.instrucoes} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Abrir casas — full width */}
              <button
                className="w-full flex items-center justify-center gap-2 rounded"
                style={{
                  backgroundColor: "#8bf2c1",
                  border: "none",
                  cursor: "pointer",
                  padding: "16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#080b0f",
                  letterSpacing: "-0.3px",
                }}
              >
                Abrir casas
                <ExternalLink size={14} color="#080b0f" />
              </button>
            </div>

            {/* Calculator accordion */}
            <div
              className="flex flex-col rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Accordion header */}
              <button
                onClick={() => setIsCalcOpen((v) => !v)}
                className="flex items-center justify-between w-full px-4 py-3"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#0e1116",
                }}
              >
                <div className="flex items-center gap-2">
                  <Calculator size={15} color="#71717a" />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#71717a",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Calculadora de Stakes
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  color="#71717a"
                  style={{
                    transform: isCalcOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {/* Accordion content */}
              {isCalcOpen && (
                <div className="flex flex-col gap-4 p-4" style={{ backgroundColor: "#15181e" }}>
                  <CalculatorSection
                    tabs={tabs}
                    calcTab={calcTab}
                    setCalcTab={setCalcTab}
                    inputLabel={inputLabel}
                    inputHint={inputHint}
                    investmentStr={investmentStr}
                    setInvestmentStr={setInvestmentStr}
                    roundStakes={roundStakes}
                    setRoundStakes={setRoundStakes}
                    calculatedLegs={calculatedLegs}
                    visibleLegs={visibleLegs}
                    totalStake={totalStake}
                    profitReal={profitReal}
                    rentabilidade={rentabilidade}
                    DOT_COLORS={DOT_COLORS}
                    showProfitRow={false}
                    scrollableTabs
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky footer — Lucro real */}
        <div
          className="shrink-0 flex items-center justify-between px-4 py-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "#15181e",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#43e5b1",
            }}
          >
            Lucro real
          </span>
          <div className="flex items-center gap-4">
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                color: "#43e5b1",
                letterSpacing: "-0.5px",
              }}
            >
              R$ {formatCurrency(profitReal)}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#43e5b1",
              }}
            >
              {rentabilidade.toFixed(2).replace(".", ",")}%
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Instruction path with colored separators ─────────────────────────────────
function InstructionPath({ instrucoes }: { instrucoes: string }) {
  const steps = instrucoes.split(" › ");
  return (
    <>
      {steps.map((step, i) => (
        <span key={i}>
          <span style={{ color: "#ffffff" }}>{step}</span>
          {i < steps.length - 1 && (
            <span style={{ color: "#8bf2c1" }}> › </span>
          )}
        </span>
      ))}
    </>
  );
}

// ─── Shared calculator section ────────────────────────────────────────────────
function CalculatorSection({
  tabs,
  calcTab,
  setCalcTab,
  inputLabel,
  inputHint,
  investmentStr,
  setInvestmentStr,
  roundStakes,
  setRoundStakes,
  calculatedLegs,
  visibleLegs,
  totalStake,
  profitReal,
  rentabilidade,
  DOT_COLORS,
  showProfitRow,
  scrollableTabs,
}: {
  tabs: { key: CalcTab; label: string; sub: string }[];
  calcTab: CalcTab;
  setCalcTab: (t: CalcTab) => void;
  inputLabel: string;
  inputHint: string | null;
  investmentStr: string;
  setInvestmentStr: (s: string) => void;
  roundStakes: boolean;
  setRoundStakes: (fn: (v: boolean) => boolean) => void;
  calculatedLegs: CalculatedLeg[];
  visibleLegs: CalculatedLeg[];
  totalStake: number;
  profitReal: number;
  rentabilidade: number;
  DOT_COLORS: string[];
  showProfitRow: boolean;
  scrollableTabs: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Tab switcher */}
      <div
        className={scrollableTabs ? "flex gap-1 p-1 rounded-lg overflow-x-auto" : "grid gap-1 p-1 rounded-lg"}
        style={{
          backgroundColor: "#0e1116",
          scrollbarWidth: "none",
          ...(!scrollableTabs
            ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }
            : {}),
        }}
      >
        {tabs.map(({ key, label, sub }) => {
          const isActive = calcTab === key;
          return (
            <button
              key={String(key)}
              onClick={() => setCalcTab(key)}
              className="flex flex-col items-center py-2 rounded-md transition-colors shrink-0"
              style={{
                backgroundColor: isActive ? "#2c2f34" : "transparent",
                border: "none",
                cursor: "pointer",
                gap: "2px",
                padding: "8px 12px",
                minWidth: scrollableTabs ? "72px" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: isActive ? "#8bf2c1" : "#71717a",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 500,
                  color: isActive ? "#71717a" : "#525252",
                }}
              >
                {sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Investment input */}
      <div className="flex flex-col gap-2">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "#71717a",
            letterSpacing: "0.55px",
            textTransform: "uppercase",
          }}
        >
          {inputLabel}
        </span>
        <div
          className="flex items-stretch rounded-lg overflow-hidden"
          style={{ backgroundColor: "rgba(8,11,15,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <span
            className="flex items-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#71717a",
              padding: "0 14px",
              borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            R$
          </span>
          <input
            type="text"
            value={investmentStr}
            onChange={(e) => setInvestmentStr(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "22px",
              fontWeight: 800,
              color: "#ffffff",
              padding: "10px 14px",
              minWidth: 0,
            }}
          />
        </div>
        {inputHint && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#525252", lineHeight: 1.5 }}>
            {inputHint}
          </p>
        )}
      </div>

      {/* Round stakes toggle */}
      <div
        className="flex items-center justify-between py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#a1a1aa" }}>
            Arredondar stakes
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#525252", marginTop: "2px" }}>
            Múltiplos de R$ 5
          </p>
        </div>
        <button
          onClick={() => setRoundStakes((v) => !v)}
          className="relative rounded-full transition-colors"
          style={{
            width: "40px",
            height: "22px",
            backgroundColor: roundStakes ? "#8bf2c1" : "#2c2f34",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#080b0f",
              top: "3px",
              ...(roundStakes ? { right: "3px" } : { left: "3px" }),
            }}
          />
        </button>
      </div>

      {/* Results box */}
      <div className="flex flex-col rounded-lg px-5 py-4" style={{ backgroundColor: "#0e1116" }}>
        {calculatedLegs.map((leg, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div
                className="rounded-full shrink-0"
                style={{ width: "7px", height: "7px", backgroundColor: DOT_COLORS[i % DOT_COLORS.length] }}
              />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#71717a" }}>
                {leg.bookmaker} (Casa {i + 1})
              </span>
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: "#e5e2e1" }}>
              R$ {formatCurrency(leg.calculatedStake)}
            </span>
          </div>
        ))}

        <div className="h-px my-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />

        <div className="flex items-center justify-between pt-2">
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#a1a1aa" }}>
            Investimento total
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#a1a1aa" }}>
            R$ {formatCurrency(totalStake)}
          </span>
        </div>

        {showProfitRow && (
          <div
            className="flex items-center justify-between mt-2.5 pt-2.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#43e5b1" }}>
              Lucro real
            </span>
            <div className="flex items-center gap-5">
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "16px", fontWeight: 800, color: "#43e5b1" }}>
                R$ {formatCurrency(profitReal)}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#43e5b1" }}>
                {rentabilidade.toFixed(2).replace(".", ",")}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
