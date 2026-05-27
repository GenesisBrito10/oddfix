import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Link2,
  Receipt,
  Users,
  Wallet,
  FileImage,
  User,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={16} />, label: "Dashboard", to: "/afiliados" },
  { icon: <Link2 size={16} />, label: "Meu link", to: "/afiliados/meu-link" },
  { icon: <Receipt size={16} />, label: "Extrato", to: "/afiliados/extrato" },
  { icon: <Users size={16} />, label: "Indicados", to: "/afiliados/indicados" },
  { icon: <Wallet size={16} />, label: "Solicitar saque", to: "/afiliados/solicitar-saque" },
  { icon: <FileImage size={16} />, label: "Material de divulgação", to: "/afiliados/material" },
];

export function AffiliateSidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: "280px",
        backgroundColor: "#15181e",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        height: "calc(100vh - 56px)",
      }}
    >
      {/* Level badge */}
      <div className="flex flex-col gap-3 px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#8bf2c1",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
            }}
          >
            Afiliado
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Nível Ouro
          </span>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
        {NAV_ITEMS.map(({ icon, label, to }) => {
          const isActive = to === "/afiliados" ? pathname === "/afiliados" : pathname.startsWith(to);
          return (
            <NavItem key={to} icon={icon} label={label} to={to} isActive={isActive} />
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="flex flex-col gap-1 px-3 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <NavItem icon={<User size={15} />} label="Account" to="/account" isActive={pathname === "/account"} />
        <NavItem icon={<LogOut size={15} />} label="Logout" to="/logout" isActive={false} />
      </div>
    </aside>
  );
}

function NavItem({
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
  return (
    <Link
      to={to}
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
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#ffffff";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#a1a1aa";
        }
      }}
    >
      {icon}
      {label}
    </Link>
  );
}
