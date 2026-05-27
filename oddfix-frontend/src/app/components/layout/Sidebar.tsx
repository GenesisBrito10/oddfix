import { useCallback } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { User, LogOut, SlidersHorizontal, Check } from "lucide-react";
import { BOOKMAKERS } from "../../constants/bookmakers";

export interface FilterState {
  investment: string;
  sortBy: "profit" | "recent" | "start";
  options: 2 | 3;
  profitRange: [number, number];
  selectedBookies: string[];
  disabledMarkets: string[];
  profitDecayTolerance: number;
}

export const MARKET_FILTERS: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "FUTEBOL",
    items: [
      { id: "handicap-gols", label: "Desabilitar Handicap de Gols" },
      { id: "escanteios", label: "Desabilitar Escanteios" },
      { id: "reembolso-gols-hc", label: "Desabilitar sinais com reembolso (Gols/HC)" },
    ],
  },
  {
    group: "BASQUETE",
    items: [
      { id: "quartos", label: "Desabilitar Mercado de Quartos" },
    ],
  },
];

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  mode: "pre-live" | "live";
}

export const BOOKIES = BOOKMAKERS;

export const DEFAULT_FILTERS: FilterState = {
  investment: "1.000,00",
  sortBy: "profit",
  options: 2,
  profitRange: [0, 30],
  selectedBookies: BOOKIES.filter((b) => b.active).map((b) => b.name),
  disabledMarkets: [],
  profitDecayTolerance: 50,
};

export function Sidebar({ filters, onFiltersChange, onApplyFilters, mode }: SidebarProps) {
  const update = useCallback(
    (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch }),
    [filters, onFiltersChange]
  );

  const toggleBookie = (name: string) => {
    const current = filters.selectedBookies;
    update({
      selectedBookies: current.includes(name)
        ? current.filter((b) => b !== name)
        : [...current, name],
    });
  };

  const toggleMarket = (id: string) => {
    const current = filters.disabledMarkets;
    update({
      disabledMarkets: current.includes(id)
        ? current.filter((m) => m !== id)
        : [...current, id],
    });
  };

  const decayExample = parseFloat(
    (5 * (1 - filters.profitDecayTolerance / 100)).toFixed(2)
  ).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 relative"
      style={{
        width: "280px",
        backgroundColor: "#15181e",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        height: "calc(100vh - 56px)",
      }}
    >
      {/* Scrollable filter area */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-5">
          {/* Stake Atual */}
          <FilterSection label="Stake Atual">
            <div
              className="flex items-center gap-2 rounded-lg px-3"
              style={{
                backgroundColor: "rgba(8,11,15,0.5)",
                border: "1px solid rgba(255,255,255,0.2)",
                height: "44px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#71717a",
                }}
              >
                R$
              </span>
              <input
                value={filters.investment}
                onChange={(e) => update({ investment: e.target.value })}
                placeholder="0,00"
                className="flex-1 min-w-0 bg-transparent outline-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  border: "none",
                  padding: 0,
                }}
              />
            </div>
          </FilterSection>

          {/* Options count */}
          <FilterSection label="Quantidade de Opções">
            <div className="flex gap-2">
              {([2, 3] as const).map((n) => {
                const isActive = filters.options === n;
                return (
                  <button
                    key={n}
                    onClick={() => update({ options: n })}
                    className="flex-1 flex items-center justify-center"
                    style={{
                      height: "40px",
                      backgroundColor: isActive ? "rgba(139,242,193,0.1)" : "#0e1116",
                      border: `1px solid ${isActive ? "#8bf2c1" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: isActive ? "#8bf2c1" : "#71717a",
                      transition: "all 0.15s",
                    }}
                  >
                    {n} Opções
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Profit range */}
          <FilterSection label="Faixa de Lucro">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
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
                    0%
                  </span>
                  <span style={{ color: "#3a3a3a", fontSize: "11px" }}>—</span>
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
                    30%
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#8bf2c1",
                  }}
                >
                  {filters.profitRange[0]}% – {filters.profitRange[1]}%
                </span>
              </div>
              <RangeSlider
                min={0}
                max={30}
                values={filters.profitRange}
                onChange={(vals) => update({ profitRange: vals })}
              />
            </div>
          </FilterSection>

          {/* Tolerância de Queda — live only */}
          {mode === "live" && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
              <FilterSection label="Tolerância de Queda">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#71717a",
                    lineHeight: "16px",
                    marginTop: "-4px",
                  }}
                >
                  Sinal é removido quando o lucro cair mais que X% do valor inicial
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
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
                      Tolerância
                    </span>
                    <span
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#8bf2c1",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {filters.profitDecayTolerance}%
                    </span>
                  </div>
                  <SingleSlider
                    min={10}
                    max={90}
                    step={5}
                    value={filters.profitDecayTolerance}
                    onChange={(v) => update({ profitDecayTolerance: v })}
                  />
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      color: "#71717a",
                      lineHeight: "16px",
                    }}
                  >
                    Ex: sinal a 5% lucro → removido ao cair para {decayExample}%
                  </p>
                </div>
              </FilterSection>
            </div>
          )}

          {/* Bookmakers */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
            <FilterSection label="Casas de Apostas">
              <div className="grid grid-cols-3 gap-2">
                {BOOKIES.map((bookie) => {
                  const isSelected = filters.selectedBookies.includes(bookie.name);
                  return (
                    <motion.button
                      key={bookie.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleBookie(bookie.name)}
                      className="relative flex items-center justify-center rounded p-2"
                      style={{
                        backgroundColor: "#0e0e0e",
                        border: `1px solid ${isSelected ? "rgba(139,242,193,0.3)" : "rgba(255,255,255,0.05)"}`,
                        height: "60px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={bookie.img}
                        alt={bookie.name}
                        className="object-contain block"
                        style={{ height: "auto", width: "60px", maxWidth: "calc(100% - 4px)" }}
                      />
                      <span
                        className="absolute rounded-full"
                        style={{
                          top: "5px",
                          right: "5px",
                          width: "6px",
                          height: "6px",
                          backgroundColor: isSelected ? "#8bf2c1" : "#3a3a3a",
                          boxShadow: isSelected ? "0 0 8px rgba(67,229,177,0.6)" : "none",
                        }}
                      />
                    </motion.button>
                  );
                })}
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#71717a",
                  marginTop: "6px",
                }}
              >
                {filters.selectedBookies.length} de {BOOKIES.length} casas selecionadas
              </p>
            </FilterSection>
          </div>

          {/* Market filters */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
            <FilterSection label="Filtros de Mercado">
              <div className="flex flex-col gap-4">
                {MARKET_FILTERS.map((group) => (
                  <div key={group.group} className="flex flex-col gap-2">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#4a5568",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {group.group}
                    </span>
                    {group.items.map((item) => {
                      const checked = filters.disabledMarkets.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleMarket(item.id)}
                          className="flex items-center gap-3 w-full"
                          style={{
                            backgroundColor: checked ? "rgba(139,242,193,0.06)" : "#0e1116",
                            border: `1px solid ${checked ? "#8bf2c1" : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "6px",
                            padding: "10px 12px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "4px",
                              border: `1px solid ${checked ? "#8bf2c1" : "rgba(255,255,255,0.2)"}`,
                              backgroundColor: checked ? "rgba(139,242,193,0.15)" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {checked && <Check size={10} color="#8bf2c1" strokeWidth={3} />}
                          </div>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: checked ? 600 : 400,
                              color: checked ? "#ffffff" : "#c0c0c0",
                              lineHeight: "16px",
                            }}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Apply button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onApplyFilters}
            className="flex items-center justify-center gap-2 w-full"
            style={{
              backgroundColor: "#8bf2c1",
              height: "44px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 800,
              color: "#080b0f",
              letterSpacing: "-0.5px",
              textTransform: "uppercase",
            }}
          >
            Filtrar Resultados
            <SlidersHorizontal size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Bottom links */}
      <div
        className="flex flex-col gap-1 px-3 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <SidebarLink icon={<User size={15} />} label="Account" to="/account" />
        <SidebarLink icon={<LogOut size={15} />} label="Logout" to="/logout" />
      </div>
    </aside>
  );
}

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "#71717a",
          letterSpacing: "0.55px",
          textTransform: "uppercase",
          lineHeight: "16.5px",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}


function SidebarLink({
  icon,
  label,
  to,
}: {
  icon: ReactNode;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 rounded-lg transition-colors duration-150"
      style={{
        height: "40px",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        color: "#a1a1aa",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#0e1116";
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#a1a1aa";
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── Dual-handle range slider ────────────────────────────────────────────────
function RangeSlider({
  min,
  max,
  values,
  onChange,
}: {
  min: number;
  max: number;
  values: [number, number];
  onChange: (vals: [number, number]) => void;
}) {
  const toPercent = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <div className="relative" style={{ height: "20px" }}>
      <div
        className="absolute top-1/2 left-0 right-0 rounded-full"
        style={{ height: "6px", backgroundColor: "#2c2f34", transform: "translateY(-50%)" }}
      >
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            left: `${toPercent(values[0])}%`,
            right: `${100 - toPercent(values[1])}%`,
            backgroundColor: "#8bf2c1",
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={values[0]}
        onChange={(e) => {
          const v = Math.min(parseFloat(e.target.value), values[1] - 0.5);
          onChange([v, values[1]]);
        }}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        style={{ zIndex: 2, height: "100%" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={values[1]}
        onChange={(e) => {
          const v = Math.max(parseFloat(e.target.value), values[0] + 0.5);
          onChange([values[0], v]);
        }}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        style={{ zIndex: 3, height: "100%" }}
      />
      {[values[0], values[1]].map((val, i) => (
        <div
          key={i}
          className="absolute top-1/2 rounded-full pointer-events-none"
          style={{
            left: `${toPercent(val)}%`,
            transform: "translate(-50%, -50%)",
            width: "14px",
            height: "14px",
            backgroundColor: "#8bf2c1",
            boxShadow: "0 0 8px rgba(139,242,193,0.4)",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Single-handle range slider ───────────────────────────────────────────────
function SingleSlider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative" style={{ height: "20px" }}>
      <div
        className="absolute top-1/2 left-0 right-0 rounded-full"
        style={{ height: "6px", backgroundColor: "#2c2f34", transform: "translateY(-50%)" }}
      >
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{ left: 0, right: `${100 - pct}%`, backgroundColor: "#8bf2c1" }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        style={{ zIndex: 2, height: "100%" }}
      />
      <div
        className="absolute top-1/2 rounded-full pointer-events-none"
        style={{
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: "14px",
          height: "14px",
          backgroundColor: "#8bf2c1",
          boxShadow: "0 0 8px rgba(139,242,193,0.4)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
