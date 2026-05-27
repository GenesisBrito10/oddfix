import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  LayoutDashboard,
  Link2,
  Receipt,
  Users,
  Wallet,
  FileImage,
  User,
  LogOut,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import type { FilterState } from "./Sidebar";
import { BOOKIES, MARKET_FILTERS } from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAffiliate: boolean;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onApplyFilters: () => void;
  mode: "pre-live" | "live";
}

const AFFILIATE_NAV = [
  { icon: <LayoutDashboard size={16} />, label: "Dashboard", to: "/afiliados" },
  { icon: <Link2 size={16} />, label: "Meu link", to: "/afiliados/meu-link" },
  { icon: <Receipt size={16} />, label: "Extrato", to: "/afiliados/extrato" },
  { icon: <Users size={16} />, label: "Indicados", to: "/afiliados/indicados" },
  { icon: <Wallet size={16} />, label: "Solicitar saque", to: "/afiliados/solicitar-saque" },
  { icon: <FileImage size={16} />, label: "Material de divulgação", to: "/afiliados/material" },
];

export function MobileDrawer({
  isOpen,
  onClose,
  isAffiliate,
  filters,
  onFiltersChange,
  onApplyFilters,
  mode,
}: MobileDrawerProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col md:hidden"
            style={{ width: "85vw", maxWidth: "360px", backgroundColor: "#15181e" }}
          >
            {/* Drawer header: toggle + X */}
            <div
              className="flex items-center justify-between px-4 shrink-0"
              style={{
                height: "56px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex items-center p-1 rounded-lg gap-1"
                style={{ backgroundColor: "#0e1116" }}
              >
                <ToggleBtn
                  label="PLATAFORMA"
                  isActive={!isAffiliate}
                  onClick={() => {
                    navigate("/");
                    onClose();
                  }}
                />
                <ToggleBtn
                  label="AFILIADOS"
                  isActive={isAffiliate}
                  onClick={() => {
                    navigate("/afiliados");
                    onClose();
                  }}
                />
              </div>

              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "34px",
                  height: "34px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#71717a",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {isAffiliate ? (
                <AffiliateContent pathname={pathname} onClose={onClose} />
              ) : (
                <PlatformContent
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onApply={handleApply}
                  pathname={pathname}
                  navigate={navigate}
                  onClose={onClose}
                  mode={mode}
                />
              )}
            </div>

            {/* Footer: Account + Logout */}
            <div
              className="flex flex-col gap-1 px-3 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <DrawerNavItem
                icon={<User size={15} />}
                label="Account"
                to="/account"
                isActive={pathname === "/account"}
                onClose={onClose}
              />
              <DrawerNavItem
                icon={<LogOut size={15} />}
                label="Logout"
                to="/logout"
                isActive={false}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Platform content ────────────────────────────────────────────────────── */

function PlatformContent({
  filters,
  onFiltersChange,
  onApply,
  pathname,
  navigate,
  onClose,
  mode,
}: {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onApply: () => void;
  pathname: string;
  navigate: ReturnType<typeof useNavigate>;
  onClose: () => void;
  mode: "pre-live" | "live";
}) {
  const activeTab: "prelive" | "live" = pathname === "/live" ? "live" : "prelive";

  const toggleBookie = (name: string) => {
    const current = filters.selectedBookies;
    onFiltersChange({
      ...filters,
      selectedBookies: current.includes(name)
        ? current.filter((b) => b !== name)
        : [...current, name],
    });
  };

  const toggleMarket = (id: string) => {
    const current = filters.disabledMarkets;
    onFiltersChange({
      ...filters,
      disabledMarkets: current.includes(id)
        ? current.filter((m) => m !== id)
        : [...current, id],
    });
  };

  const decayExample = parseFloat(
    (5 * (1 - filters.profitDecayTolerance / 100)).toFixed(2)
  ).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-0 px-4 py-4">
      {/* PRE-LIVE / LIVE tabs */}
      <DrawerSection label="Modo">
        <div className="flex gap-2">
          <TabPill
            label="PRE-LIVE"
            isActive={activeTab === "prelive"}
            onClick={() => { navigate("/"); onClose(); }}
          />
          <TabPill
            label="LIVE"
            isActive={activeTab === "live"}
            onClick={() => { navigate("/live"); onClose(); }}
          />
        </div>
      </DrawerSection>

      {/* Options */}
      <DrawerSection label="Opções">
        <div className="flex gap-2">
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => onFiltersChange({ ...filters, options: n })}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg"
              style={{
                height: "36px",
                backgroundColor: filters.options === n ? "rgba(139,242,193,0.1)" : "#0e1116",
                border: `1px solid ${filters.options === n ? "rgba(139,242,193,0.4)" : "rgba(255,255,255,0.06)"}`,
                color: filters.options === n ? "#8bf2c1" : "#71717a",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {filters.options === n && (
                <span
                  style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#8bf2c1", display: "block" }}
                />
              )}
              {n} opções
            </button>
          ))}
        </div>
      </DrawerSection>

      {/* Bookmakers */}
      <DrawerSection label={`Casas (${filters.selectedBookies.length}/${BOOKIES.length})`}>
        <div className="grid grid-cols-3 gap-1.5">
          {BOOKIES.map((b) => {
            const selected = filters.selectedBookies.includes(b.name);
            return (
              <button
                key={b.name}
                onClick={() => toggleBookie(b.name)}
                className="flex flex-col items-center justify-center rounded-lg py-2 px-1"
                style={{
                  backgroundColor: selected ? "rgba(139,242,193,0.08)" : "#0e1116",
                  border: `1px solid ${selected ? "rgba(139,242,193,0.3)" : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer",
                  gap: "4px",
                  minHeight: "48px",
                  transition: "all 0.15s",
                }}
              >
                <img
                  src={b.logo}
                  alt={b.name}
                  style={{ height: "16px", width: "auto", maxWidth: "52px", objectFit: "contain", opacity: selected ? 1 : 0.4 }}
                />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: selected ? "#8bf2c1" : "#71717a",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </DrawerSection>

      {/* Market filters */}
      <DrawerSection label="Filtros de Mercado">
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
      </DrawerSection>

      {/* Tolerância de Queda — live only */}
      {mode === "live" && (
        <DrawerSection label="Tolerância de Queda">
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#71717a", lineHeight: "15px", marginTop: "-8px" }}>
            Sinal removido ao cair mais que X% do lucro inicial
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.55px", textTransform: "uppercase" }}>
                Tolerância
              </span>
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "18px", fontWeight: 800, color: "#8bf2c1", letterSpacing: "-0.5px" }}>
                {filters.profitDecayTolerance}%
              </span>
            </div>
            <div className="relative" style={{ height: "20px" }}>
              <div className="absolute top-1/2 left-0 right-0 rounded-full" style={{ height: "6px", backgroundColor: "#2c2f34", transform: "translateY(-50%)" }}>
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    left: 0,
                    right: `${100 - ((filters.profitDecayTolerance - 10) / 80) * 100}%`,
                    backgroundColor: "#8bf2c1",
                  }}
                />
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={filters.profitDecayTolerance}
                onChange={(e) => onFiltersChange({ ...filters, profitDecayTolerance: parseInt(e.target.value) })}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ zIndex: 2, height: "100%" }}
              />
              <div
                className="absolute top-1/2 rounded-full pointer-events-none"
                style={{
                  left: `${((filters.profitDecayTolerance - 10) / 80) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#8bf2c1",
                  boxShadow: "0 0 8px rgba(139,242,193,0.4)",
                  zIndex: 1,
                }}
              />
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#71717a", lineHeight: "15px" }}>
              Ex: sinal a 5% lucro → removido ao cair para {decayExample}%
            </p>
          </div>
        </DrawerSection>
      )}

      {/* Apply */}
      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onApply}
          className="w-full flex items-center justify-center gap-2 rounded-lg"
          style={{
            height: "44px",
            backgroundColor: "#8bf2c1",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            fontWeight: 800,
            color: "#080b0f",
            letterSpacing: "-0.3px",
            textTransform: "uppercase",
          }}
        >
          Filtrar Resultados
          <SlidersHorizontal size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Affiliate content ───────────────────────────────────────────────────── */

function AffiliateContent({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3">
      {AFFILIATE_NAV.map(({ icon, label, to }) => {
        const isActive = to === "/afiliados" ? pathname === "/afiliados" : pathname.startsWith(to);
        return (
          <DrawerNavItem key={to} icon={icon} label={label} to={to} isActive={isActive} onClose={onClose} />
        );
      })}
    </div>
  );
}

/* ─── Shared primitives ───────────────────────────────────────────────────── */

function DrawerSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-5">
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
        {label}
      </span>
      {children}
    </div>
  );
}

function DrawerNavItem({
  icon,
  label,
  to,
  isActive,
  onClose,
}: {
  icon: ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 px-3 rounded"
      style={{
        height: "40px",
        backgroundColor: isActive ? "#8bf2c1" : "transparent",
        color: isActive ? "#080b0f" : "#a1a1aa",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: isActive ? 700 : 500,
        textDecoration: "none",
        borderRadius: "4px",
        transition: "background-color 0.15s, color 0.15s",
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

function ToggleBtn({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 rounded-md flex items-center justify-center"
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color: isActive ? "#080b0f" : "#71717a",
        backgroundColor: isActive ? "#8bf2c1" : "transparent",
        border: "none",
        cursor: "pointer",
        height: "28px",
        letterSpacing: "0.3px",
        transition: "background-color 0.2s, color 0.2s",
      }}
    >
      {label}
    </button>
  );
}

function TabPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center rounded-lg"
      style={{
        height: "36px",
        backgroundColor: isActive ? "rgba(139,242,193,0.1)" : "#0e1116",
        border: `1px solid ${isActive ? "rgba(139,242,193,0.4)" : "rgba(255,255,255,0.06)"}`,
        color: isActive ? "#8bf2c1" : "#71717a",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
