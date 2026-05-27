import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Copy, Check, Image, FileText, Video, Layers } from "lucide-react";

type Category = "Todos" | "Banners" | "Textos prontos" | "Vídeos" | "Logos";

interface Material {
  id: string;
  category: Exclude<Category, "Todos">;
  name: string;
  dimensions: string;
  type: string;
  textContent?: string;
}

const MATERIALS: Material[] = [
  { id: "1", category: "Banners",       name: "Banner Facebook",         dimensions: "1200 × 628",  type: "PNG"  },
  { id: "2", category: "Banners",       name: "Banner Instagram Post",   dimensions: "1080 × 1080", type: "PNG"  },
  { id: "3", category: "Banners",       name: "Banner Leaderboard",      dimensions: "728 × 90",    type: "PNG"  },
  { id: "4", category: "Textos prontos", name: "Texto — WhatsApp curto", dimensions: "189 palavras", type: "TXT",
    textContent: "🔥 Você sabia que é possível garantir lucro em apostas esportivas? A Oddfix identifica surebets em tempo real — apostas onde você ganha independentemente do resultado. Use meu link e comece gratuitamente: oddfix.com.br/ref/joao-silva-2847" },
  { id: "5", category: "Textos prontos", name: "Texto — E-mail marketing", dimensions: "312 palavras", type: "TXT",
    textContent: "Olá! Quero te apresentar a Oddfix, a plataforma que identifica oportunidades de arbitragem esportiva — as chamadas surebets. Com ela, você distribui apostas entre casas diferentes e garante lucro seja qual for o resultado. Acesse pelo meu link e teste grátis: oddfix.com.br/ref/joao-silva-2847" },
  { id: "6", category: "Vídeos",        name: "Vídeo — Reels 15s",       dimensions: "1080 × 1920", type: "MP4" },
  { id: "7", category: "Vídeos",        name: "Vídeo — YouTube Short",   dimensions: "1080 × 1920", type: "MP4" },
  { id: "8", category: "Logos",         name: "Logo Oddfix — Fundo transparente", dimensions: "800 × 200", type: "PNG" },
  { id: "9", category: "Logos",         name: "Logo Oddfix — Vetorial",  dimensions: "Escalável",   type: "SVG" },
];

const CATEGORIES: Category[] = ["Todos", "Banners", "Textos prontos", "Vídeos", "Logos"];

const CATEGORY_ICON: Record<Exclude<Category, "Todos">, React.ReactNode> = {
  "Banners":       <Image size={28} color="#71717a" />,
  "Textos prontos":<FileText size={28} color="#71717a" />,
  "Vídeos":        <Video size={28} color="#71717a" />,
  "Logos":         <Layers size={28} color="#71717a" />,
};

const CATEGORY_COLOR: Record<Exclude<Category, "Todos">, string> = {
  "Banners":        "#8bf2c1",
  "Textos prontos": "#e0ea87",
  "Vídeos":         "#7dd3fc",
  "Logos":          "#c4b5fd",
};

export function MaterialPage() {
  const [active, setActive] = useState<Category>("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = active === "Todos" ? MATERIALS : MATERIALS.filter((m) => m.category === active);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="p-8 w-full flex flex-col gap-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Material de Divulgação
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
          Banners, textos e recursos para compartilhar
        </p>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              height: "34px",
              padding: "0 16px",
              borderRadius: "4px",
              border: active === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              backgroundColor: active === cat ? "#8bf2c1" : "transparent",
              color: active === cat ? "#080b0f" : "#71717a",
              transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (active !== cat) e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              if (active !== cat) e.currentTarget.style.color = "#71717a";
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        layout
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((material, i) => (
            <motion.div
              key={material.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, delay: i * 0.03 }}
              className="rounded-xl flex flex-col overflow-hidden"
              style={{
                backgroundColor: "#15181e",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {material.textContent ? (
                <TextPreview text={material.textContent} />
              ) : (
                <MediaPreview category={material.category as Exclude<Category, "Todos">} dimensions={material.dimensions} type={material.type} />
              )}

              {/* Card footer */}
              <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: "1.3",
                    }}
                  >
                    {material.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#71717a",
                    }}
                  >
                    {material.dimensions} · {material.type}
                  </span>
                </div>

                {material.textContent ? (
                  <CopyButton
                    copied={copiedId === material.id}
                    onClick={() => handleCopy(material.id, material.textContent!)}
                  />
                ) : (
                  <DownloadButton category={material.category as Exclude<Category, "Todos">} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Nenhum material nesta categoria.
          </span>
        </div>
      )}
    </div>
  );
}

function MediaPreview({
  category,
  dimensions,
  type,
}: {
  category: Exclude<Category, "Todos">;
  dimensions: string;
  type: string;
}) {
  const color = CATEGORY_COLOR[category];
  const icon = CATEGORY_ICON[category];

  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{
        height: "160px",
        backgroundColor: "#0e1116",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}
    >
      {/* Corner accents */}
      {[
        { top: 10, left: 10, borderRight: "none", borderBottom: "none" } as React.CSSProperties,
        { top: 10, right: 10, borderLeft: "none", borderBottom: "none" } as React.CSSProperties,
        { bottom: 10, left: 10, borderRight: "none", borderTop: "none" } as React.CSSProperties,
        { bottom: 10, right: 10, borderLeft: "none", borderTop: "none" } as React.CSSProperties,
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            border: `1.5px solid ${color}`,
            borderRadius: "2px",
            opacity: 0.5,
            ...pos,
          }}
        />
      ))}

      {icon}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "#3a3a3a",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
        }}
      >
        {dimensions} · {type}
      </span>
    </div>
  );
}

function TextPreview({ text }: { text: string }) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#0e1116",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        minHeight: "120px",
      }}
    >
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 400,
          color: "#a1a1aa",
          lineHeight: "1.6",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function DownloadButton({ category }: { category: Exclude<Category, "Todos"> }) {
  const color = CATEGORY_COLOR[category];
  return (
    <button
      className="flex items-center justify-center gap-2 w-full rounded"
      style={{
        height: "36px",
        backgroundColor: "transparent",
        border: `1px solid ${color}40`,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color,
        borderRadius: "4px",
        transition: "background-color 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${color}10`;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = `${color}40`;
      }}
    >
      <Download size={13} />
      Baixar
    </button>
  );
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full rounded"
      style={{
        height: "36px",
        backgroundColor: copied ? "rgba(139,242,193,0.1)" : "transparent",
        border: `1px solid ${copied ? "#8bf2c1" : "rgba(139,242,193,0.3)"}`,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color: "#8bf2c1",
        borderRadius: "4px",
        transition: "all 0.2s",
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copiado!" : "Copiar texto"}
    </button>
  );
}
