import { motion } from "motion/react";
import { ChevronRight, Navigation } from "lucide-react";
import { Surebet, formatCurrency } from "./mockData";
import { BookmakerLogo } from "../ui/BookmakerLogo";

interface SurebetCardProps {
  surebet: Surebet;
  index: number;
  onClick?: (surebet: Surebet) => void;
  isLive?: boolean;
}

export function SurebetCard({ surebet, index, onClick, isLive }: SurebetCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.055, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => onClick?.(surebet)}
      className="relative rounded-xl cursor-pointer group flex flex-col"
      style={{
        backgroundColor: "#15181e",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        ...(isLive ? { borderLeft: "2px solid #43e5b1" } : {}),
      }}
    >
      {/* New signal pulse ring */}
      {surebet.isNew && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ boxShadow: "0 0 0 2px rgba(139,242,193,0.5)" }}
        />
      )}

      {/* Subtle border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      />
      {/* Hover border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ border: "1px solid rgba(139,242,193,0.22)" }}
      />

      {/* ── Mobile Header ──────────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-2 p-4">
        {/* Row 1: game + badge + chevron */}
        <div className="flex items-start gap-2">
          <h2
            className="flex-1 min-w-0 text-white"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "-0.4px",
              lineHeight: "22px",
            }}
          >
            {surebet.game}
          </h2>
          <ProfitBadge pct={surebet.profitPct} isNew={surebet.isNew} />
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ backgroundColor: "#2c2f34", width: "28px", height: "28px" }}
          >
            <ChevronRight size={13} color="#e5e2e1" />
          </div>
        </div>

        {/* Row 2: league · time */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#71717a",
            lineHeight: "18px",
          }}
        >
          {surebet.league} · {surebet.time}
        </p>

        {/* Row 3: retorno estimado */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              color: "#71717a",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Retorno Estimado
          </span>
          <span
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#8bf2c1",
              letterSpacing: "-1px",
            }}
          >
            R$ {formatCurrency(surebet.returns)}
          </span>
        </div>
      </div>

      {/* ── Desktop Header ──────────────────────────────────────────────── */}
      <div className="hidden md:flex items-start justify-between p-5 pb-4">
        {/* Left: game + badge + league/time */}
        <div className="flex flex-col gap-1 flex-1 min-w-0 mr-3">
          <div className="flex items-start gap-2 flex-wrap">
            <h2
              className="text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "-0.4px",
                lineHeight: "22px",
              }}
            >
              {surebet.game}
            </h2>
            <ProfitBadge pct={surebet.profitPct} isNew={surebet.isNew} />
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#71717a",
              lineHeight: "18px",
            }}
          >
            {surebet.league} · {surebet.time}
          </p>
        </div>

        {/* Right: return + arrow */}
        <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#71717a",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                lineHeight: "14px",
              }}
            >
              Retorno
            </span>
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "16px",
                fontWeight: 800,
                color: "#43e5b1",
                letterSpacing: "-0.6px",
                lineHeight: "24px",
              }}
            >
              R$ {formatCurrency(surebet.returns)}
            </span>
          </div>
          <motion.div
            className="flex items-center justify-center rounded-lg shrink-0"
            whileHover={{ scale: 1.1, x: 2 }}
            transition={{ duration: 0.15 }}
            style={{ backgroundColor: "#2c2f34", width: "32px", height: "32px" }}
          >
            <ChevronRight size={15} color="#e5e2e1" />
          </motion.div>
        </div>
      </div>

      {/* ── Mobile Bet Legs ─────────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-2 px-4 pb-4">
        {surebet.legs.map((leg, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg"
            style={{ backgroundColor: "rgba(8,11,15,0.55)", padding: "10px 12px" }}
          >
            <div className="shrink-0 mt-0.5">
              <BookmakerLogo bookmakerName={leg.bookmaker} size="20px" />
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="block"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#e5e2e1",
                  lineHeight: "17px",
                }}
              >
                {leg.market}
              </span>
              <div className="flex items-center gap-1 mt-1 overflow-hidden">
                <Navigation size={11} color="#4a5568" style={{ flexShrink: 0 }} />
                <span
                  className="truncate"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#4a5568",
                    lineHeight: "15px",
                  }}
                >
                  {leg.instrucoes}
                </span>
              </div>
            </div>
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "15px",
                fontWeight: 800,
                color: "#e0ea87",
                letterSpacing: "-0.3px",
                flexShrink: 0,
              }}
            >
              {leg.odds.toFixed(2)}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              R$ {formatCurrency(leg.stake)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Desktop Bet Legs ────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col gap-2 px-4 pb-4">
        {surebet.legs.map((leg, i) => (
          <div
            key={i}
            className="grid grid-cols-2 rounded-lg"
            style={{
              backgroundColor: "rgba(8,11,15,0.55)",
              padding: "12px 14px",
              gap: "8px 16px",
            }}
          >
            {/* Bookmaker */}
            <div className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#525252",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "14px",
                }}
              >
                Bookmaker
              </span>
              <div className="flex items-center h-[20px]">
                <BookmakerLogo bookmakerName={leg.bookmaker} size="20px" />
              </div>
            </div>

            {/* Market */}
            <div className="flex flex-col gap-0.5">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#525252",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "14px",
                }}
              >
                Mercado
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#e5e2e1",
                  lineHeight: "17px",
                }}
              >
                {leg.market}
              </span>
              <div className="flex items-center gap-1 mt-0.5 overflow-hidden">
                <Navigation size={11} color="#4a5568" style={{ flexShrink: 0 }} />
                <span
                  className="truncate"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#4a5568",
                    lineHeight: "15px",
                  }}
                >
                  {leg.instrucoes}
                </span>
              </div>
            </div>

            {/* Odds */}
            <div className="flex flex-col gap-0.5">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#525252",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "14px",
                }}
              >
                Odds
              </span>
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#e0ea87",
                  lineHeight: "22px",
                  letterSpacing: "-0.3px",
                }}
              >
                {leg.odds.toFixed(2)}
              </span>
            </div>

            {/* Stake */}
            <div className="flex flex-col gap-0.5">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#525252",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "14px",
                }}
              >
                Apostar
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: "18px",
                }}
              >
                R$ {formatCurrency(leg.stake)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function ProfitBadge({ pct, isNew }: { pct: number; isNew?: boolean }) {
  return (
    <motion.span
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={isNew ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex items-center px-2 rounded-xl shrink-0"
      style={{
        border: "1px solid #8bf2c1",
        height: "20px",
        fontFamily: "Inter, sans-serif",
        fontSize: "10px",
        fontWeight: 700,
        color: "#8bf2c1",
        letterSpacing: "-0.3px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      +{pct.toFixed(2)}% lucro
    </motion.span>
  );
}
