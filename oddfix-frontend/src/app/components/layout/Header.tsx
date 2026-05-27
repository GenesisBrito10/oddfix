import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { Bell, Settings, Menu } from "lucide-react";
import { OddFixLogo } from "../OddFixLogo";

interface HeaderProps {
  signalCount?: number;
  onMenuOpen?: () => void;
}

export function Header({ signalCount = 274, onMenuOpen }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAffiliate = location.pathname.startsWith("/afiliados") || location.pathname === "/account";
  const activeTab: "prelive" | "live" = location.pathname === "/live" ? "live" : "prelive";

  return (
    <header
      className="flex items-center w-full shrink-0 z-30"
      style={{
        height: "56px",
        backgroundColor: "#15181e",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo section */}
      <div className="flex items-center px-6 shrink-0 md:w-[30%] md:min-w-[240px] md:max-w-[420px]">
        <Link to="/">
          <OddFixLogo size="sm" />
        </Link>
      </div>

      {/* Center: PRE-LIVE / LIVE tabs + signal count — desktop only */}
      <div
        className="hidden md:flex items-center gap-1 px-4"
        style={{
          opacity: isAffiliate ? 0.3 : 1,
          pointerEvents: isAffiliate ? "none" : "auto",
          transition: "opacity 0.2s",
        }}
      >
        <TabButton
          label="PRE-LIVE"
          isActive={activeTab === "prelive"}
          onClick={() => navigate("/")}
        />
        <TabButton
          label="LIVE"
          isActive={activeTab === "live"}
          onClick={() => navigate("/live")}
        />
        {/* Signal count pill */}
        <motion.div
          key={signalCount}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex items-center gap-1.5 px-3 rounded-full ml-2"
          style={{ backgroundColor: "#2c2f34", height: "28px" }}
        >
          <motion.span
            className="rounded-full shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#8bf2c1",
              boxShadow: "0 0 8px rgba(67,229,177,0.6)",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {signalCount} SINAIS
          </span>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Platform / Affiliate toggle — desktop only */}
      <div
        className="hidden md:flex items-center p-1 rounded-lg mx-4"
        style={{ backgroundColor: "#0e1116" }}
      >
        <PlatformToggleBtn
          label="PLATAFORMA"
          isActive={!isAffiliate}
          onClick={() => navigate("/")}
        />
        <PlatformToggleBtn
          label="AFILIADOS"
          isActive={isAffiliate}
          onClick={() => navigate("/afiliados")}
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 pr-4">
        <IconBtn icon={<Bell size={16} />} />
        {/* Settings — desktop only */}
        <div className="hidden md:block">
          <IconBtn icon={<Settings size={16} />} />
        </div>

        {/* User — desktop only */}
        <div
          className="hidden md:flex items-center gap-2 ml-2 pl-3"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#ffffff",
            }}
          >
            João Silva
          </span>
          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#2c2f34",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#8bf2c1",
              }}
            >
              JS
            </span>
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuOpen}
          className="flex md:hidden items-center justify-center rounded-lg ml-1"
          style={{
            width: "34px",
            height: "34px",
            color: "#ffffff",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Menu size={20} />
        </motion.button>
      </div>
    </header>
  );
}

function TabButton({
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
      className="relative px-3 py-1 transition-colors duration-150"
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "#ffffff" : "#71717a",
        background: "none",
        border: "none",
        cursor: "pointer",
        height: "36px",
      }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ height: "2px", backgroundColor: "#8bf2c1" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}

function PlatformToggleBtn({
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
      className="relative px-3 rounded-md"
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
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

function IconBtn({ icon }: { icon: ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center rounded-lg"
      style={{
        width: "34px",
        height: "34px",
        color: "#71717a",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "#2c2f34";
        (e.currentTarget as HTMLElement).style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLElement).style.color = "#71717a";
      }}
    >
      {icon}
    </motion.button>
  );
}
