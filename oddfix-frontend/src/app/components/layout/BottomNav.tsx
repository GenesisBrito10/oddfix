import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import {
  Clock,
  Radio,
  Zap,
  SlidersHorizontal,
  LayoutDashboard,
  Link2,
  Receipt,
  MoreHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";

interface BottomNavProps {
  signalCount?: number;
  onFilterOpen: () => void;
  onMaisOpen: () => void;
}

export function BottomNav({ signalCount = 274, onFilterOpen, onMaisOpen }: BottomNavProps) {
  const { pathname } = useLocation();
  const isAffiliate = pathname.startsWith("/afiliados") || pathname === "/account";

  return (
    <div
      className="flex md:hidden shrink-0"
      style={{
        backgroundColor: "#15181e",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-stretch w-full" style={{ height: "64px" }}>
        {isAffiliate ? (
          <>
            <NavLink
              icon={<LayoutDashboard size={20} />}
              label="DASHBOARD"
              to="/afiliados"
              isActive={pathname === "/afiliados"}
            />
            <NavLink
              icon={<Link2 size={20} />}
              label="LINK"
              to="/afiliados/meu-link"
              isActive={pathname.startsWith("/afiliados/meu-link")}
            />
            <NavLink
              icon={<Receipt size={20} />}
              label="EXTRATO"
              to="/afiliados/extrato"
              isActive={pathname.startsWith("/afiliados/extrato")}
            />
            <NavAction
              icon={<MoreHorizontal size={20} />}
              label="MAIS"
              onClick={onMaisOpen}
              isActive={false}
            />
          </>
        ) : (
          <>
            <NavLink
              icon={<Clock size={20} />}
              label="PRÉ-LIVE"
              to="/"
              isActive={pathname === "/"}
            />
            <NavLive isActive={pathname === "/live"} />
            <NavAction
              icon={
                <span className="relative inline-flex">
                  <Zap size={20} />
                  {signalCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-9px",
                        minWidth: "16px",
                        height: "16px",
                        borderRadius: "8px",
                        backgroundColor: "#8bf2c1",
                        color: "#080b0f",
                        fontSize: "9px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 3px",
                        lineHeight: 1,
                      }}
                    >
                      {signalCount > 99 ? "99+" : signalCount}
                    </span>
                  )}
                </span>
              }
              label="SINAIS"
              onClick={() => {}}
              isActive={false}
            />
            <NavAction
              icon={<SlidersHorizontal size={20} />}
              label="FILTRAR"
              onClick={onFilterOpen}
              isActive={false}
            />
          </>
        )}
      </div>
    </div>
  );
}

function NavLink({
  icon,
  label,
  to,
  isActive,
}: {
  icon: ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}) {
  const color = isActive ? "#8bf2c1" : "#71717a";
  return (
    <Link
      to={to}
      className="flex-1 flex flex-col items-center justify-center gap-0.5"
      style={{ textDecoration: "none", color }}
    >
      {icon}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
    </Link>
  );
}

function NavAction({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  const color = isActive ? "#8bf2c1" : "#71717a";
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-0.5"
      style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color,
        padding: 0,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function NavLive({ isActive }: { isActive: boolean }) {
  const color = isActive ? "#8bf2c1" : "#71717a";
  return (
    <Link
      to="/live"
      className="flex-1 flex flex-col items-center justify-center gap-0.5"
      style={{ textDecoration: "none", color }}
    >
      <Radio size={20} />
      <span className="flex items-center gap-0.5">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color,
          }}
        >
          AO VIVO
        </span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#43e5b1",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      </span>
    </Link>
  );
}
