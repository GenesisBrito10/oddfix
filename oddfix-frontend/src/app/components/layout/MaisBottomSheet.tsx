import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import { X, Users, Wallet, FileImage, User, LogOut } from "lucide-react";
import type { ReactNode } from "react";

interface MaisBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAIS_ITEMS: { icon: ReactNode; label: string; to: string }[] = [
  { icon: <Users size={18} />, label: "Indicados", to: "/afiliados/indicados" },
  { icon: <Wallet size={18} />, label: "Solicitar Saque", to: "/afiliados/solicitar-saque" },
  { icon: <FileImage size={18} />, label: "Material de Divulgação", to: "/afiliados/material" },
  { icon: <User size={18} />, label: "Account", to: "/account" },
];

export function MaisBottomSheet({ isOpen, onClose }: MaisBottomSheetProps) {
  const { pathname } = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mais-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          />

          <motion.div
            key="mais-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
              backgroundColor: "#15181e",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                style={{
                  width: "36px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Mais
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#71717a",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-1 px-3 py-3">
              {MAIS_ITEMS.map(({ icon, label, to }) => {
                const isActive =
                  to === "/account"
                    ? pathname === "/account"
                    : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3"
                    style={{
                      height: "44px",
                      backgroundColor: isActive ? "#8bf2c1" : "transparent",
                      color: isActive ? "#080b0f" : "#a1a1aa",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Logout separator */}
            <div
              className="flex flex-col gap-1 px-3 pb-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Link
                to="/logout"
                onClick={onClose}
                className="flex items-center gap-3 px-3"
                style={{
                  height: "44px",
                  backgroundColor: "transparent",
                  color: "#a1a1aa",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                <LogOut size={18} />
                Logout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
