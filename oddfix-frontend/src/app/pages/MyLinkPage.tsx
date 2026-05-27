import { useState } from "react";
import { motion } from "motion/react";
import {
  Copy,
  Check,
  Share2,
  MessageCircle,
  Send,
  Mail,
  Download,
  MousePointerClick,
  CalendarDays,
  UserCheck,
  Users,
} from "lucide-react";

const AFFILIATE_LINK = "https://oddfix.com.br/ref/joao-silva-2847";
const AFFILIATE_SLUG = "joao-silva-2847";

const STATS = [
  { icon: <MousePointerClick size={16} color="#8bf2c1" />, label: "Cliques hoje", value: "47" },
  { icon: <CalendarDays size={16} color="#8bf2c1" />, label: "Cliques este mês", value: "1.847" },
  { icon: <UserCheck size={16} color="#8bf2c1" />, label: "Conversões hoje", value: "2" },
  { icon: <Users size={16} color="#8bf2c1" />, label: "Total conversões", value: "64" },
];

const SHARE_OPTIONS = [
  {
    icon: <MessageCircle size={15} />,
    label: "WhatsApp",
    color: "#25D366",
    href: `https://wa.me/?text=Acesse%20a%20Oddfix%20pelo%20meu%20link%3A%20${encodeURIComponent(AFFILIATE_LINK)}`,
  },
  {
    icon: <Send size={15} />,
    label: "Telegram",
    color: "#2AABEE",
    href: `https://t.me/share/url?url=${encodeURIComponent(AFFILIATE_LINK)}&text=Acesse%20a%20Oddfix%20pelo%20meu%20link`,
  },
  {
    icon: <Mail size={15} />,
    label: "E-mail",
    color: "#a1a1aa",
    href: `mailto:?subject=Oddfix%20-%20Apostas%20com%20lucro%20garantido&body=Acesse%20pelo%20meu%20link%3A%20${encodeURIComponent(AFFILIATE_LINK)}`,
  },
];

export function MyLinkPage() {
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState(AFFILIATE_SLUG);

  const handleCopy = () => {
    navigator.clipboard.writeText(AFFILIATE_LINK).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 w-full">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Meu Link de Afiliado
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#71717a",
            marginTop: "4px",
          }}
        >
          Compartilhe e ganhe comissão
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Card — Link de indicação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SectionLabel>Seu link de indicação</SectionLabel>

          {/* Link field */}
          <div
            className="flex items-center gap-3 rounded-lg px-4"
            style={{
              backgroundColor: "#0e1116",
              border: "1px solid rgba(255,255,255,0.1)",
              height: "48px",
            }}
          >
            <span
              className="flex-1 truncate"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#8bf2c1",
                userSelect: "all",
              }}
            >
              {AFFILIATE_LINK}
            </span>

            {/* Copy button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 rounded shrink-0"
              style={{
                backgroundColor: copied ? "rgba(139,242,193,0.15)" : "#8bf2c1",
                border: copied ? "1px solid #8bf2c1" : "none",
                height: "34px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: copied ? "#8bf2c1" : "#080b0f",
                transition: "all 0.2s",
                borderRadius: "4px",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiado!" : "Copiar link"}
            </motion.button>
          </div>

          {/* Share options */}
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Compartilhar via</SectionLabel>
            <div className="flex items-center gap-3">
              {SHARE_OPTIONS.map(({ icon, label, color, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 rounded"
                  style={{
                    height: "36px",
                    backgroundColor: "#0e1116",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color,
                    textDecoration: "none",
                    borderRadius: "4px",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Card — Estatísticas do link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SectionLabel>Estatísticas do link</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                className="rounded-lg p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: "#0e1116",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#71717a",
                      textTransform: "uppercase",
                      letterSpacing: "0.55px",
                    }}
                  >
                    {label}
                  </span>
                  {icon}
                </div>
                <span
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-1px",
                    lineHeight: "1.1",
                  }}
                >
                  {value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cards row — QR Code + Personalização */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card — QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{
              backgroundColor: "#15181e",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SectionLabel>QR Code</SectionLabel>

            {/* QR placeholder */}
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "160px",
                  height: "160px",
                  border: "2px solid rgba(139,242,193,0.35)",
                  backgroundColor: "#0e1116",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner accents */}
                {[
                  { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
                  { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
                  { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
                  { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: "20px",
                      height: "20px",
                      border: "2px solid #8bf2c1",
                      borderRadius: "2px",
                      ...pos,
                    }}
                  />
                ))}
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
                  QR Code
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 w-full rounded"
              style={{
                height: "38px",
                backgroundColor: "transparent",
                border: "1px solid rgba(139,242,193,0.4)",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#8bf2c1",
                borderRadius: "4px",
                transition: "border-color 0.15s, background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(139,242,193,0.08)";
                e.currentTarget.style.borderColor = "#8bf2c1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "rgba(139,242,193,0.4)";
              }}
            >
              <Download size={14} />
              Baixar QR Code
            </motion.button>
          </motion.div>

          {/* Card — Personalização do link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{
              backgroundColor: "#15181e",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col gap-1">
              <SectionLabel>Personalização do link</SectionLabel>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#71717a",
                }}
              >
                Escolha um slug personalizado para o seu link.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <SectionLabel>Slug personalizado</SectionLabel>
              <div
                className="flex items-center rounded-lg overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "#0e1116",
                  height: "44px",
                }}
              >
                <span
                  className="flex items-center px-3 shrink-0 h-full"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#71717a",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "#15181e",
                  }}
                >
                  /ref/
                </span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 bg-transparent outline-none px-3"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#ffffff",
                    border: "none",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#3a3a3a",
                }}
              >
                Funcionalidade disponível em breve.
              </p>
              <button
                disabled
                className="flex items-center justify-center w-full rounded"
                style={{
                  height: "38px",
                  backgroundColor: "#2c2f34",
                  border: "none",
                  cursor: "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#3a3a3a",
                  borderRadius: "4px",
                  opacity: 0.5,
                }}
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color: "#71717a",
        textTransform: "uppercase",
        letterSpacing: "0.55px",
      }}
    >
      {children}
    </span>
  );
}
