import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Link } from "react-router";

type TxStatus = "Liberada" | "Aguardando" | "Sacado";

interface Transaction {
  id: string;
  type: "entrada" | "saque";
  description: string;
  datetime: string;
  /** ISO date string for period filtering */
  isoDate: string;
  amount: number;
  status: TxStatus;
}

const TODAY = new Date("2026-04-21");

function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const TRANSACTIONS: Transaction[] = [
  { id: "1",  type: "entrada", description: "Comissão — Ca*** Mendes",    datetime: fmt(daysAgo(0)),   isoDate: daysAgo(0),   amount: 85.00,  status: "Liberada"   },
  { id: "2",  type: "entrada", description: "Comissão — An*** Lima",       datetime: fmt(daysAgo(1)),   isoDate: daysAgo(1),   amount: 249.00, status: "Aguardando" },
  { id: "3",  type: "saque",   description: "Saque realizado",              datetime: fmt(daysAgo(2)),   isoDate: daysAgo(2),   amount: -500.00, status: "Sacado"    },
  { id: "4",  type: "entrada", description: "Comissão — Br*** Sousa",      datetime: fmt(daysAgo(3)),   isoDate: daysAgo(3),   amount: 85.00,  status: "Liberada"   },
  { id: "5",  type: "entrada", description: "Comissão — Fe*** Costa",      datetime: fmt(daysAgo(5)),   isoDate: daysAgo(5),   amount: 139.00, status: "Liberada"   },
  { id: "6",  type: "entrada", description: "Comissão — Ro*** Alves",      datetime: fmt(daysAgo(6)),   isoDate: daysAgo(6),   amount: 249.00, status: "Aguardando" },
  { id: "7",  type: "saque",   description: "Saque realizado",              datetime: fmt(daysAgo(8)),   isoDate: daysAgo(8),   amount: -800.00, status: "Sacado"    },
  { id: "8",  type: "entrada", description: "Comissão — Ju*** Pereira",    datetime: fmt(daysAgo(10)),  isoDate: daysAgo(10),  amount: 85.00,  status: "Liberada"   },
  { id: "9",  type: "entrada", description: "Comissão — Ma*** Ribeiro",    datetime: fmt(daysAgo(12)),  isoDate: daysAgo(12),  amount: 139.00, status: "Liberada"   },
  { id: "10", type: "entrada", description: "Comissão — Le*** Rocha",      datetime: fmt(daysAgo(14)),  isoDate: daysAgo(14),  amount: 85.00,  status: "Aguardando" },
  { id: "11", type: "saque",   description: "Saque realizado",              datetime: fmt(daysAgo(18)),  isoDate: daysAgo(18),  amount: -1200.00, status: "Sacado"   },
  { id: "12", type: "entrada", description: "Comissão — Di*** Carvalho",   datetime: fmt(daysAgo(20)),  isoDate: daysAgo(20),  amount: 249.00, status: "Liberada"   },
  { id: "13", type: "entrada", description: "Comissão — Pa*** Nunes",      datetime: fmt(daysAgo(23)),  isoDate: daysAgo(23),  amount: 85.00,  status: "Liberada"   },
  { id: "14", type: "entrada", description: "Comissão — Ra*** Teixeira",   datetime: fmt(daysAgo(27)),  isoDate: daysAgo(27),  amount: 139.00, status: "Liberada"   },
  { id: "15", type: "saque",   description: "Saque realizado",              datetime: fmt(daysAgo(32)),  isoDate: daysAgo(32),  amount: -600.00, status: "Sacado"    },
  { id: "16", type: "entrada", description: "Comissão — Ca*** Ferreira",   datetime: fmt(daysAgo(40)),  isoDate: daysAgo(40),  amount: 249.00, status: "Aguardando" },
  { id: "17", type: "entrada", description: "Comissão — Th*** Martins",    datetime: fmt(daysAgo(48)),  isoDate: daysAgo(48),  amount: 85.00,  status: "Liberada"   },
  { id: "18", type: "entrada", description: "Comissão — Be*** Oliveira",   datetime: fmt(daysAgo(55)),  isoDate: daysAgo(55),  amount: 139.00, status: "Liberada"   },
  { id: "19", type: "saque",   description: "Saque realizado",              datetime: fmt(daysAgo(70)),  isoDate: daysAgo(70),  amount: -950.00, status: "Sacado"    },
  { id: "20", type: "entrada", description: "Comissão — Lu*** Santana",    datetime: fmt(daysAgo(90)),  isoDate: daysAgo(90),  amount: 249.00, status: "Aguardando" },
];

const entradas = TRANSACTIONS.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0);
const sacado   = TRANSACTIONS.filter((t) => t.type === "saque").reduce((s, t) => s + Math.abs(t.amount), 0);
const pendente = TRANSACTIONS.filter((t) => t.status === "Aguardando").reduce((s, t) => s + t.amount, 0);
const disponivel = entradas - sacado - pendente;

const BALANCE_CARDS = [
  { label: "Saldo disponível",   value: disponivel, accent: true,  prefix: "R$ " },
  { label: "Total recebido",     value: entradas,   accent: false, prefix: "R$ " },
  { label: "Total sacado",       value: sacado,     accent: false, prefix: "R$ " },
  { label: "Saldo pendente",     value: pendente,   accent: false, prefix: "R$ " },
];

const PERIOD_BTNS = [
  { label: "7d",   days: 7   },
  { label: "30d",  days: 30  },
  { label: "3m",   days: 90  },
  { label: "12m",  days: 365 },
  { label: "Tudo", days: 9999 },
];

export function ExtratoPage() {
  const [periodDays, setPeriodDays] = useState(30);

  const filtered = useMemo(() => {
    const cutoff = new Date(TODAY);
    cutoff.setDate(cutoff.getDate() - periodDays);
    return TRANSACTIONS.filter((t) => new Date(t.isoDate) >= cutoff);
  }, [periodDays]);

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
          Extrato
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
          Movimentações financeiras
        </p>
      </motion.div>

      {/* Balance cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4"
      >
        {BALANCE_CARDS.map(({ label, value, accent, prefix }) => (
          <div
            key={label}
            className="rounded-xl p-5 flex flex-col gap-2"
            style={{
              backgroundColor: "#15181e",
              border: `1px solid ${accent ? "rgba(139,242,193,0.2)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
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
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: accent ? "32px" : "24px",
                fontWeight: 800,
                color: accent ? "#8bf2c1" : "#ffffff",
                letterSpacing: "-1.5px",
                lineHeight: "1.05",
              }}
            >
              {prefix}
              {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Movements card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl flex flex-col"
        style={{
          backgroundColor: "#15181e",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Period filter */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Movimentações
          </span>

          <div
            className="flex items-center rounded-lg p-0.5"
            style={{
              backgroundColor: "#0e1116",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {PERIOD_BTNS.map(({ label, days }) => (
              <button
                key={label}
                onClick={() => setPeriodDays(days)}
                style={{
                  height: "30px",
                  padding: "0 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: periodDays === days ? "#8bf2c1" : "transparent",
                  color: periodDays === days ? "#080b0f" : "#71717a",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0)" }}>
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#71717a",
                }}
              >
                Nenhuma movimentação neste período.
              </span>
            </div>
          ) : (
            filtered.map((tx, i) => {
              const isEntrada = tx.type === "entrada";
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: isEntrada ? "rgba(67,229,177,0.08)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    {isEntrada ? (
                      <ArrowUpRight size={16} color="#43e5b1" />
                    ) : (
                      <ArrowDownLeft size={16} color="#71717a" />
                    )}
                  </div>

                  {/* Description + date */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#ffffff",
                      }}
                    >
                      {tx.description}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#71717a",
                      }}
                    >
                      {tx.datetime}
                    </span>
                  </div>

                  {/* Status badge */}
                  <TxStatusBadge status={tx.status} />

                  {/* Amount */}
                  <span
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "15px",
                      fontWeight: 800,
                      color: isEntrada ? "#43e5b1" : "#71717a",
                      letterSpacing: "-0.5px",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {isEntrada ? "+" : ""}
                    R$ {Math.abs(tx.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTA */}
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            to="/afiliados/solicitar-saque"
            className="flex items-center justify-center gap-2 w-full rounded"
            style={{
              height: "44px",
              backgroundColor: "#8bf2c1",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 800,
              color: "#080b0f",
              letterSpacing: "-0.3px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "4px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <Wallet size={15} strokeWidth={2.5} />
            Solicitar saque
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function TxStatusBadge({ status }: { status: TxStatus }) {
  const styles: Record<TxStatus, { bg: string; color: string }> = {
    Liberada:  { bg: "rgba(1,200,150,0.1)",   color: "#01c896" },
    Aguardando:{ bg: "rgba(255,209,102,0.1)", color: "#e0ea87" },
    Sacado:    { bg: "rgba(255,255,255,0.05)", color: "#71717a" },
  };
  const { bg, color } = styles[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: bg,
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
