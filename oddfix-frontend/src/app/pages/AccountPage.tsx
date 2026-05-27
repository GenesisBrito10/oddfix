import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Upload,
  ChevronRight,
  Monitor,
  Smartphone,
  Check,
} from "lucide-react";

type Tab = "perfil" | "seguranca" | "notificacoes" | "plano";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "perfil", label: "Perfil", icon: <User size={15} /> },
  { id: "seguranca", label: "Segurança", icon: <Shield size={15} /> },
  { id: "notificacoes", label: "Notificações", icon: <Bell size={15} /> },
  { id: "plano", label: "Plano e assinatura", icon: <CreditCard size={15} /> },
];

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");

  return (
    <div className="p-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
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
          Configurações da conta
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
          Gerencie seu perfil, segurança e preferências
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Vertical tabs */}
        <aside
          className="flex flex-col gap-1 shrink-0"
          style={{ width: "200px" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 px-3 rounded text-left"
                style={{
                  height: "40px",
                  backgroundColor: isActive ? "#8bf2c1" : "transparent",
                  color: isActive ? "#080b0f" : "#a1a1aa",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.15s, color 0.15s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#a1a1aa";
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "perfil" && <PerfilTab key="perfil" />}
            {activeTab === "seguranca" && <SegurancaTab key="seguranca" />}
            {activeTab === "notificacoes" && <NotificacoesTab key="notificacoes" />}
            {activeTab === "plano" && <PlanoTab key="plano" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Perfil ─────────────────────────────────────────────────────────── */

function PerfilTab() {
  const [name, setName] = useState("João Silva");
  const [phone, setPhone] = useState("+55 11 99999-0000");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <TabPanel>
      <SectionCard title="Informações pessoais">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div
              className="rounded-full flex items-center justify-center shrink-0"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#0e1116",
                border: "2px solid #8bf2c1",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#8bf2c1",
                }}
              >
                JS
              </span>
            </div>
            <button
              className="absolute bottom-0 right-0 rounded-full flex items-center justify-center"
              style={{
                width: "26px",
                height: "26px",
                backgroundColor: "#8bf2c1",
                border: "2px solid #080b0f",
                cursor: "pointer",
              }}
            >
              <Upload size={11} color="#080b0f" strokeWidth={2.5} />
            </button>
          </div>
          <div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              João Silva
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#71717a",
                marginTop: "2px",
              }}
            >
              Enviar nova foto
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FieldInput
            label="Nome completo"
            value={name}
            onChange={setName}
          />
          <FieldInput
            label="E-mail"
            value="joao.silva@email.com"
            readOnly
          />
          <FieldInput
            label="Telefone"
            value={phone}
            onChange={setPhone}
            placeholder="+55 00 00000-0000"
          />
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={handleSave}>
            {saved ? (
              <span className="flex items-center gap-2">
                <Check size={14} strokeWidth={2.5} /> Salvo!
              </span>
            ) : (
              "Salvar alterações"
            )}
          </PrimaryButton>
        </div>
      </SectionCard>
    </TabPanel>
  );
}

/* ─── Tab: Segurança ──────────────────────────────────────────────────────── */

const SESSIONS = [
  { device: "Chrome · macOS", location: "São Paulo, SP", date: "Agora", icon: <Monitor size={14} /> },
  { device: "Safari · iPhone 15", location: "São Paulo, SP", date: "Ontem, 22:14", icon: <Smartphone size={14} /> },
  { device: "Chrome · Windows 11", location: "Campinas, SP", date: "18 abr 2026", icon: <Monitor size={14} /> },
];

function SegurancaTab() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <TabPanel>
      <SectionCard title="Alterar senha">
        <div className="flex flex-col gap-4">
          <FieldInput
            label="Senha atual"
            value={currentPw}
            onChange={setCurrentPw}
            type={showCurrent ? "text" : "password"}
            trailing={
              <EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
            }
          />
          <FieldInput
            label="Nova senha"
            value={newPw}
            onChange={setNewPw}
            type={showNew ? "text" : "password"}
            trailing={
              <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
            }
          />
          <FieldInput
            label="Confirmar nova senha"
            value={confirmPw}
            onChange={setConfirmPw}
            type={showConfirm ? "text" : "password"}
            trailing={
              <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
            }
          />
        </div>
        <div className="mt-5">
          <PrimaryButton onClick={handleSave}>
            {saved ? (
              <span className="flex items-center gap-2">
                <Check size={14} strokeWidth={2.5} /> Salvo!
              </span>
            ) : (
              "Atualizar senha"
            )}
          </PrimaryButton>
        </div>
      </SectionCard>

      <SectionCard title="Autenticação em dois fatores">
        <div className="flex items-center justify-between">
          <div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              {twoFactor ? "Ativada" : "Desativada"}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#71717a",
                marginTop: "2px",
              }}
            >
              {twoFactor
                ? "Sua conta está protegida com 2FA via app autenticador."
                : "Adicione uma camada extra de segurança à sua conta."}
            </p>
          </div>
          <Toggle value={twoFactor} onChange={setTwoFactor} />
        </div>
        {twoFactor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 px-4 py-3 rounded-lg flex items-center gap-2"
            style={{
              backgroundColor: "rgba(139,242,193,0.06)",
              border: "1px solid rgba(139,242,193,0.2)",
            }}
          >
            <span
              className="rounded-full shrink-0"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#8bf2c1",
                display: "block",
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#8bf2c1",
              }}
            >
              2FA ativo via Google Authenticator
            </span>
          </motion.div>
        )}
      </SectionCard>

      <SectionCard title="Sessões ativas">
        <div className="flex flex-col gap-2 mb-5">
          {SESSIONS.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ backgroundColor: "#0e1116" }}
            >
              <span style={{ color: i === 0 ? "#8bf2c1" : "#71717a" }}>{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {s.device}
                  {i === 0 && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: "rgba(139,242,193,0.12)",
                        color: "#8bf2c1",
                        letterSpacing: "0.4px",
                      }}
                    >
                      ATUAL
                    </span>
                  )}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#71717a",
                    marginTop: "1px",
                  }}
                >
                  {s.location} · {s.date}
                </p>
              </div>
              <ChevronRight size={14} color="#3a3a3a" />
            </div>
          ))}
        </div>
        <DestructiveButton>Encerrar todas as sessões</DestructiveButton>
      </SectionCard>
    </TabPanel>
  );
}

/* ─── Tab: Notificações ───────────────────────────────────────────────────── */

function NotificacoesTab() {
  const [surebets, setSurebets] = useState(true);
  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [threshold, setThreshold] = useState("3");
  const [dailySummary, setDailySummary] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [affiliateActivity, setAffiliateActivity] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <TabPanel>
      <SectionCard title="Preferências de notificação">
        <div className="flex flex-col gap-0">
          <NotifRow
            label="Novas oportunidades de surebet"
            description="Receba alertas em tempo real de novas surebets disponíveis"
            value={surebets}
            onChange={setSurebets}
          />

          <div
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          />

          <NotifRow
            label="Oportunidades acima de % lucro"
            description="Notifique apenas surebets com lucro acima do percentual definido"
            value={aboveThreshold}
            onChange={setAboveThreshold}
          >
            {aboveThreshold && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 mt-3"
              >
                <Label>Lucro mínimo (%)</Label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  style={{
                    width: "72px",
                    height: "32px",
                    backgroundColor: "rgba(8,11,15,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    color: "#ffffff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    paddingLeft: "10px",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#8bf2c1"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#71717a",
                  }}
                >
                  %
                </span>
              </motion.div>
            )}
          </NotifRow>

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} />

          <NotifRow
            label="Resumo diário por e-mail"
            description="Receba um resumo das melhores oportunidades do dia no seu e-mail"
            value={dailySummary}
            onChange={setDailySummary}
          />

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} />

          <NotifRow
            label="Novidades e atualizações da plataforma"
            description="Fique por dentro de novas funcionalidades e melhorias"
            value={updates}
            onChange={setUpdates}
          />

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} />

          <NotifRow
            label="Atividade de afiliados"
            description="Notifique quando novos indicados se converterem em membros ativos"
            value={affiliateActivity}
            onChange={setAffiliateActivity}
          />
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={handleSave}>
            {saved ? (
              <span className="flex items-center gap-2">
                <Check size={14} strokeWidth={2.5} /> Salvo!
              </span>
            ) : (
              "Salvar preferências"
            )}
          </PrimaryButton>
        </div>
      </SectionCard>
    </TabPanel>
  );
}

/* ─── Tab: Plano e assinatura ─────────────────────────────────────────────── */

const PAYMENTS = [
  { date: "21 mar 2026", plan: "PRO Mensal", amount: "R$ 97,00", status: "Pago" },
  { date: "21 fev 2026", plan: "PRO Mensal", amount: "R$ 97,00", status: "Pago" },
  { date: "21 jan 2026", plan: "PRO Mensal", amount: "R$ 97,00", status: "Pago" },
  { date: "21 dez 2025", plan: "PRO Mensal", amount: "R$ 97,00", status: "Pago" },
];

function PlanoTab() {
  return (
    <TabPanel>
      {/* Current plan card */}
      <SectionCard title="Plano atual">
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(139,242,193,0.08) 0%, rgba(67,229,177,0.04) 100%)",
            border: "1px solid rgba(139,242,193,0.2)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
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
                PLANO ATUAL
              </span>
            </div>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              PRO Mensal
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#71717a",
                marginTop: "4px",
              }}
            >
              Renova em{" "}
              <span style={{ color: "#ffffff", fontWeight: 600 }}>30/05/2026</span>
            </p>
          </div>

          <div className="text-right">
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#8bf2c1",
                letterSpacing: "-1px",
              }}
            >
              R$ 97
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#71717a",
              }}
            >
              /mês
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-5 rounded"
            style={{
              height: "40px",
              backgroundColor: "#8bf2c1",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              color: "#080b0f",
              borderRadius: "4px",
              letterSpacing: "-0.3px",
            }}
          >
            Fazer upgrade para Anual
          </motion.button>
          <DestructiveButton>Cancelar plano</DestructiveButton>
        </div>
      </SectionCard>

      {/* Payment history */}
      <SectionCard title="Histórico de pagamentos">
        <div className="w-full overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0e1116" }}>
                {["Data", "Plano", "Valor", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#71717a",
                      letterSpacing: "0.55px",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: i < PAYMENTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <td className="px-4 py-3">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#71717a",
                      }}
                    >
                      {p.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#ffffff",
                      }}
                    >
                      {p.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      {p.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "rgba(1,200,150,0.1)",
                        color: "#01c896",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </TabPanel>
  );
}

/* ─── Shared primitives ───────────────────────────────────────────────────── */

function TabPanel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "#15181e",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h2
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: "20px",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </span>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  readOnly,
  type = "text",
  placeholder,
  trailing,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: "40px",
            backgroundColor: readOnly ? "rgba(8,11,15,0.3)" : "rgba(8,11,15,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: readOnly ? "#71717a" : "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            paddingLeft: "12px",
            paddingRight: trailing ? "40px" : "12px",
            outline: "none",
            cursor: readOnly ? "default" : "text",
          }}
          onFocus={(e) => {
            if (!readOnly) e.currentTarget.style.borderColor = "#8bf2c1";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        />
        {trailing && (
          <div className="absolute right-0 flex items-center justify-center" style={{ width: "40px" }}>
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#71717a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "40px",
        height: "22px",
        backgroundColor: value ? "#8bf2c1" : "#2c2f34",
        borderRadius: "11px",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.span
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          display: "block",
          width: "16px",
          height: "16px",
          backgroundColor: value ? "#080b0f" : "#71717a",
          borderRadius: "50%",
          position: "absolute",
          top: "3px",
        }}
      />
    </button>
  );
}

function NotifRow({
  label,
  description,
  value,
  onChange,
  children,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#71717a",
              marginTop: "2px",
            }}
          >
            {description}
          </p>
          {children}
        </div>
        <Toggle value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        height: "40px",
        paddingLeft: "20px",
        paddingRight: "20px",
        backgroundColor: "#8bf2c1",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 800,
        color: "#080b0f",
        letterSpacing: "-0.3px",
      }}
    >
      {children}
    </motion.button>
  );
}

function DestructiveButton({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <motion.button
      whileHover={{ backgroundColor: "rgba(255,100,100,0.06)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        height: "40px",
        paddingLeft: "16px",
        paddingRight: "16px",
        backgroundColor: "transparent",
        border: "1px solid rgba(255,100,100,0.4)",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color: "#ff6464",
        letterSpacing: "-0.2px",
      }}
    >
      {children}
    </motion.button>
  );
}
