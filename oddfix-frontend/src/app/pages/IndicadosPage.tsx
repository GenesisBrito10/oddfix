import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Info, ChevronLeft, ChevronRight, Users, UserCheck, TrendingUp, Activity } from "lucide-react";

interface Referral {
  id: string;
  name: string;
  email: string;
  plan: string;
  date: string;
  commission: number;
  status: "Liberada" | "Aguardando";
}

const ALL_REFERRALS: Referral[] = [
  { id: "1",  name: "Carlos Mendes",    email: "ca***@gmail.com",    plan: "Mensal PRO",      date: "15/04/2026", commission: 85.00,  status: "Liberada"   },
  { id: "2",  name: "Ana Lima",         email: "an***@hotmail.com",  plan: "Anual Elite",     date: "13/04/2026", commission: 249.00, status: "Aguardando" },
  { id: "3",  name: "Bruno Sousa",      email: "br***@gmail.com",    plan: "Mensal PRO",      date: "10/04/2026", commission: 85.00,  status: "Liberada"   },
  { id: "4",  name: "Fernanda Costa",   email: "fe***@outlook.com",  plan: "Trimestral",      date: "08/04/2026", commission: 139.00, status: "Liberada"   },
  { id: "5",  name: "Rodrigo Alves",    email: "ro***@gmail.com",    plan: "Anual Elite",     date: "05/04/2026", commission: 249.00, status: "Aguardando" },
  { id: "6",  name: "Juliana Pereira",  email: "ju***@gmail.com",    plan: "Mensal PRO",      date: "02/04/2026", commission: 85.00,  status: "Liberada"   },
  { id: "7",  name: "Marcos Ribeiro",   email: "ma***@yahoo.com.br", plan: "Trimestral",      date: "28/03/2026", commission: 139.00, status: "Liberada"   },
  { id: "8",  name: "Leticia Rocha",    email: "le***@gmail.com",    plan: "Mensal PRO",      date: "25/03/2026", commission: 85.00,  status: "Aguardando" },
  { id: "9",  name: "Diego Carvalho",   email: "di***@icloud.com",   plan: "Anual Elite",     date: "20/03/2026", commission: 249.00, status: "Liberada"   },
  { id: "10", name: "Patrícia Nunes",   email: "pa***@gmail.com",    plan: "Mensal PRO",      date: "17/03/2026", commission: 85.00,  status: "Liberada"   },
  { id: "11", name: "Rafael Teixeira",  email: "ra***@outlook.com",  plan: "Trimestral",      date: "12/03/2026", commission: 139.00, status: "Liberada"   },
  { id: "12", name: "Camila Ferreira",  email: "ca***@gmail.com",    plan: "Anual Elite",     date: "08/03/2026", commission: 249.00, status: "Aguardando" },
  { id: "13", name: "Thiago Martins",   email: "th***@gmail.com",    plan: "Mensal PRO",      date: "03/03/2026", commission: 85.00,  status: "Liberada"   },
  { id: "14", name: "Beatriz Oliveira", email: "be***@hotmail.com",  plan: "Trimestral",      date: "27/02/2026", commission: 139.00, status: "Liberada"   },
  { id: "15", name: "Lucas Santana",    email: "lu***@gmail.com",    plan: "Anual Elite",     date: "21/02/2026", commission: 249.00, status: "Aguardando" },
];

const PERIOD_OPTIONS = [
  { value: "all",   label: "Todo período"    },
  { value: "7d",    label: "Últimos 7 dias"  },
  { value: "30d",   label: "Últimos 30 dias" },
  { value: "90d",   label: "Últimos 90 dias" },
];

const PAGE_SIZE = 8;

const TOTAL = ALL_REFERRALS.length;
const ATIVOS = ALL_REFERRALS.filter((r) => r.status === "Liberada").length;
const CONVERTED = ATIVOS;
const CONVERSION_RATE = ((CONVERTED / TOTAL) * 100).toFixed(1) + "%";

const SUMMARY = [
  { icon: <Users size={16} color="#8bf2c1" />,      label: "Total indicados",    value: String(TOTAL)    },
  { icon: <Activity size={16} color="#8bf2c1" />,   label: "Ativos",             value: String(ATIVOS)   },
  { icon: <UserCheck size={16} color="#8bf2c1" />,  label: "Convertidos",        value: String(CONVERTED) },
  { icon: <TrendingUp size={16} color="#8bf2c1" />, label: "Taxa de conversão",  value: CONVERSION_RATE  },
];

export function IndicadosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Liberada" | "Aguardando">("Todos");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_REFERRALS.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, period]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatus = (v: "Todos" | "Liberada" | "Aguardando") => { setStatusFilter(v); setPage(1); };
  const handlePeriod = (v: string) => { setPeriod(v); setPage(1); };

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
          Indicados
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
          Histórico completo de indicações
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4"
      >
        {SUMMARY.map(({ icon, label, value }, i) => (
          <div
            key={label}
            className="rounded-xl p-4 flex flex-col gap-3"
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
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-1px",
                lineHeight: "1.1",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Table card */}
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
        {/* Filters row */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 rounded-lg px-3"
            style={{
              backgroundColor: "#0e1116",
              border: "1px solid rgba(255,255,255,0.1)",
              height: "38px",
            }}
          >
            <Search size={14} color="#71717a" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="flex-1 bg-transparent outline-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#ffffff",
                border: "none",
              }}
            />
          </div>

          {/* Status filter */}
          <div
            className="flex items-center rounded-lg p-0.5"
            style={{
              backgroundColor: "#0e1116",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {(["Todos", "Liberada", "Aguardando"] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                style={{
                  height: "30px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: statusFilter === s ? "#8bf2c1" : "transparent",
                  color: statusFilter === s ? "#080b0f" : "#71717a",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Period select */}
          <select
            value={period}
            onChange={(e) => handlePeriod(e.target.value)}
            style={{
              height: "38px",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "#0e1116",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#a1a1aa",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ backgroundColor: "#0e1116" }}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Nome", "Plano", "Data de cadastro", "Comissão", "Status", ""].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#71717a",
                      textTransform: "uppercase",
                      letterSpacing: "0.55px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#71717a",
                      }}
                    >
                      Nenhum indicado encontrado.
                    </span>
                  </td>
                </tr>
              ) : (
                pageRows.map((ref, i) => (
                  <tr
                    key={ref.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {/* Nome + email */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#ffffff",
                          }}
                        >
                          {ref.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#71717a",
                          }}
                        >
                          {ref.email}
                        </span>
                      </div>
                    </td>

                    {/* Plano */}
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#e0ea87",
                          backgroundColor: "rgba(224,234,135,0.08)",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ref.plan}
                      </span>
                    </td>

                    {/* Data */}
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

                    {/* Comissão */}
                    <td className="px-5 py-3.5">
                      <span
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        R$ {ref.commission.toFixed(2).replace(".", ",")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={ref.status} />
                    </td>

                    {/* Ação */}
                    <td className="px-5 py-3.5">
                      <button
                        className="flex items-center justify-center rounded"
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(255,255,255,0.08)",
                          cursor: "pointer",
                          color: "#71717a",
                          borderRadius: "4px",
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(139,242,193,0.4)";
                          e.currentTarget.style.color = "#8bf2c1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.color = "#71717a";
                        }}
                      >
                        <Info size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            {filtered.length === 0
              ? "0 resultados"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} de ${filtered.length} indicados`}
          </span>

          <div className="flex items-center gap-2">
            <PageBtn
              icon={<ChevronLeft size={14} />}
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "4px",
                  border: p === safePage ? "none" : "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: p === safePage ? "#8bf2c1" : "transparent",
                  color: p === safePage ? "#080b0f" : "#71717a",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {p}
              </button>
            ))}
            <PageBtn
              icon={<ChevronRight size={14} />}
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Liberada" | "Aguardando" }) {
  const isSuccess = status === "Liberada";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isSuccess ? "rgba(1,200,150,0.1)" : "rgba(255,209,102,0.1)",
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color: isSuccess ? "#01c896" : "#e0ea87",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function PageBtn({
  icon,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "transparent",
        color: disabled ? "#3a3a3a" : "#71717a",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
        transition: "color 0.15s",
      }}
    >
      {icon}
    </button>
  );
}
