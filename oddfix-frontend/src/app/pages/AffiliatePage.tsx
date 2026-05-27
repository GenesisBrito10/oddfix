import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Jan", comissao: 420, cliques: 85 },
  { month: "Fev", comissao: 380, cliques: 72 },
  { month: "Mar", comissao: 610, cliques: 128 },
  { month: "Abr", comissao: 520, cliques: 103 },
  { month: "Mai", comissao: 790, cliques: 164 },
  { month: "Jun", comissao: 650, cliques: 138 },
  { month: "Jul", comissao: 870, cliques: 185 },
  { month: "Ago", comissao: 940, cliques: 196 },
  { month: "Set", comissao: 1100, cliques: 225 },
  { month: "Out", comissao: 980, cliques: 208 },
  { month: "Nov", comissao: 1240, cliques: 264 },
  { month: "Dez", comissao: 1380, cliques: 287 },
];

const REFERRALS = [
  { id: "1", name: "Carlos Mendes", date: "15/04/2026", status: "Liberada", commission: 85.0 },
  { id: "2", name: "Ana Lima", date: "13/04/2026", status: "Aguardando", commission: 85.0 },
  { id: "3", name: "Bruno Sousa", date: "10/04/2026", status: "Liberada", commission: 85.0 },
  { id: "4", name: "Fernanda Costa", date: "08/04/2026", status: "Liberada", commission: 85.0 },
  { id: "5", name: "Rodrigo Alves", date: "05/04/2026", status: "Aguardando", commission: 85.0 },
  { id: "6", name: "Juliana Pereira", date: "02/04/2026", status: "Liberada", commission: 85.0 },
  { id: "7", name: "Marcos Ribeiro", date: "28/03/2026", status: "Liberada", commission: 85.0 },
  { id: "8", name: "Leticia Rocha", date: "25/03/2026", status: "Aguardando", commission: 85.0 },
];

const AFFILIATE_LINK = "https://oddfix.com.br/ref/joao-silva-2847";

export function AffiliatePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AFFILIATE_LINK).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 w-full">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Dashboard de Afiliados
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
            Bem-vindo, João Silva — Nível Ouro
          </p>
        </div>

        {/* Level badge */}
        <div
          className="flex items-center gap-2 px-4 rounded-xl"
          style={{
            backgroundColor: "rgba(139,242,193,0.08)",
            border: "1px solid rgba(139,242,193,0.25)",
            height: "40px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🥇</span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#8bf2c1",
            }}
          >
            Nível Ouro
          </span>
        </div>
      </motion.div>

      {/* Affiliate link */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 rounded-xl p-4 mb-6"
        style={{
          backgroundColor: "#15181e",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
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
            Seu Link de Indicação
          </span>
          <span
            className="truncate"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#8bf2c1",
            }}
          >
            {AFFILIATE_LINK}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 rounded-lg shrink-0"
          style={{
            backgroundColor: copied ? "rgba(139,242,193,0.15)" : "#2c2f34",
            border: `1px solid ${copied ? "#8bf2c1" : "rgba(255,255,255,0.1)"}`,
            height: "36px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: copied ? "#8bf2c1" : "#a1a1aa",
            transition: "all 0.2s",
          }}
        >
          <Copy size={14} />
          {copied ? "Copiado!" : "Copiar"}
        </motion.button>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: <Users size={18} color="#8bf2c1" />,
            label: "Cliques no Link",
            value: "1.847",
            sub: "+12% este mês",
            positive: true,
          },
          {
            icon: <TrendingUp size={18} color="#8bf2c1" />,
            label: "Conversões",
            value: "64",
            sub: "Taxa: 3.46%",
            positive: true,
          },
          {
            icon: <DollarSign size={18} color="#8bf2c1" />,
            label: "Comissão Total",
            value: "R$ 9.284",
            sub: "R$ 1.380 este mês",
            positive: true,
          },
          {
            icon: <Clock size={18} color="#e0ea87" />,
            label: "Comissão Pendente",
            value: "R$ 255",
            sub: "3 aguardando",
            positive: false,
          },
        ].map((stat, i) => (
          <StatCard key={i} index={i} {...stat} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-2 rounded-xl p-5"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Desempenho Mensal
            </h3>
            <span
              className="px-2 py-1 rounded-md"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                color: "#8bf2c1",
                backgroundColor: "rgba(139,242,193,0.1)",
              }}
            >
              2026
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop-top" offset="5%" stopColor="#8bf2c1" stopOpacity={0.2} />
                  <stop key="stop-bottom" offset="95%" stopColor="#8bf2c1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                key="xaxis"
                dataKey="month"
                tick={{ fill: "#71717a", fontSize: 11, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                key="yaxis"
                tick={{ fill: "#71717a", fontSize: 11, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: "#0e1116",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                }}
                labelStyle={{ color: "#a1a1aa", fontSize: "12px" }}
                itemStyle={{ color: "#8bf2c1", fontSize: "13px", fontWeight: 700 }}
                formatter={(value) => [`R$ ${value}`, "Comissão"]}
              />
              <Area
                key="area-comissao"
                type="monotone"
                dataKey="comissao"
                stroke="#8bf2c1"
                strokeWidth={2}
                fill="url(#commissionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5 flex flex-col"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            Progresso de Nível
          </h3>

          <div className="flex flex-col gap-5 flex-1">
            <LevelProgress
              level="Prata"
              icon="🥈"
              current={64}
              target={50}
              completed
              description="50 conversões"
            />
            <LevelProgress
              level="Ouro"
              icon="🥇"
              current={64}
              target={100}
              completed={false}
              description="100 conversões"
              isCurrent
            />
            <LevelProgress
              level="Diamante"
              icon="💎"
              current={64}
              target={200}
              completed={false}
              description="200 conversões"
            />
          </div>

          <div
            className="mt-4 pt-4 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#71717a",
              }}
            >
              Faltam{" "}
              <span style={{ color: "#8bf2c1", fontWeight: 700 }}>36 conversões</span>
              {" "}para Diamante
            </p>
          </div>
        </motion.div>
      </div>

      {/* Referrals table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl overflow-hidden mb-6"
        style={{
          backgroundColor: "#15181e",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Histórico de Indicados
          </h3>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Últimos 30 dias
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["Nome", "Data", "Comissão", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#71717a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REFERRALS.map((ref, i) => (
              <motion.tr
                key={ref.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              >
                <td className="px-5 py-3.5">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#ffffff",
                    }}
                  >
                    {ref.name}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#71717a",
                    }}
                  >
                    {ref.date}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    R$ {ref.commission.toFixed(2).replace(".", ",")}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={ref.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Withdrawal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl p-5 flex items-center justify-between"
        style={{
          backgroundColor: "#15181e",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "4px",
            }}
          >
            Solicitar Saque
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Saldo disponível:{" "}
            <span style={{ color: "#8bf2c1", fontWeight: 700 }}>R$ 9.029,00</span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 rounded-lg"
          style={{
            backgroundColor: "#8bf2c1",
            height: "44px",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 800,
            color: "#080b0f",
            letterSpacing: "-0.3px",
            textTransform: "uppercase",
          }}
        >
          <DollarSign size={15} strokeWidth={2.5} />
          Solicitar Saque
        </motion.button>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  positive,
  index,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  positive: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "#15181e",
        border: "1px solid rgba(255,255,255,0.08)",
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
      <div>
        <p
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
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: positive ? "#8bf2c1" : "#e0ea87",
            marginTop: "4px",
          }}
        >
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isSuccess = status === "Liberada";
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded"
      style={{
        backgroundColor: isSuccess
          ? "rgba(1,200,150,0.1)"
          : "rgba(255,209,102,0.1)",
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color: isSuccess ? "#01c896" : "#e0ea87",
        letterSpacing: "0.3px",
      }}
    >
      {status}
    </span>
  );
}

function LevelProgress({
  level,
  icon,
  current,
  target,
  completed,
  isCurrent,
  description,
}: {
  level: string;
  icon: string;
  current: number;
  target: number;
  completed: boolean;
  isCurrent?: boolean;
  description: string;
}) {
  const pct = Math.min((current / target) * 100, 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: isCurrent ? 700 : 500,
              color: isCurrent ? "#ffffff" : completed ? "#71717a" : "#a1a1aa",
            }}
          >
            {level}
          </span>
          {isCurrent && (
            <span
              className="px-1.5 rounded"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#8bf2c1",
                backgroundColor: "rgba(139,242,193,0.1)",
              }}
            >
              ATUAL
            </span>
          )}
        </div>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: "#71717a",
          }}
        >
          {description}
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: "4px", backgroundColor: "#2c2f34" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            backgroundColor: completed ? "#71717a" : "#8bf2c1",
            boxShadow: !completed ? "0 0 8px rgba(139,242,193,0.4)" : "none",
          }}
        />
      </div>
    </div>
  );
}