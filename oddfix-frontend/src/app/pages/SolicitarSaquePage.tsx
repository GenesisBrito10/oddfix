import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, ChevronDown, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const SALDO = 9029.0;
const MINIMO = 50;

type Metodo = "pix" | "ted" | "conta";
type TipoConta = "corrente" | "poupanca";
type TipoPix = "cpf" | "cnpj" | "email" | "telefone" | "aleatoria";

const METODOS: { id: Metodo; label: string }[] = [
  { id: "pix", label: "PIX" },
  { id: "ted", label: "TED" },
  { id: "conta", label: "Conta bancária" },
];

const TIPOS_PIX: { id: TipoPix; label: string; placeholder: string }[] = [
  { id: "cpf", label: "CPF", placeholder: "000.000.000-00" },
  { id: "cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00" },
  { id: "email", label: "E-mail", placeholder: "seu@email.com" },
  { id: "telefone", label: "Telefone", placeholder: "+55 11 99999-0000" },
  { id: "aleatoria", label: "Chave aleatória", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
];

function parseBRL(v: string): number {
  return parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function SolicitarSaquePage() {
  const [valor, setValor] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("pix");
  const [tipoPix, setTipoPix] = useState<TipoPix>("cpf");
  const [chavePix, setChavePix] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [tipoConta, setTipoConta] = useState<TipoConta>("corrente");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ valor: false, confirmar: false, chave: false });

  const valorNum = parseBRL(valor);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.valor) {
      if (!valor) e.valor = "Informe o valor a sacar";
      else if (valorNum < MINIMO) e.valor = `Valor mínimo: R$ ${formatBRL(MINIMO)}`;
      else if (valorNum > SALDO) e.valor = `Valor máximo: R$ ${formatBRL(SALDO)}`;
    }
    if (touched.confirmar) {
      if (!confirmar) e.confirmar = "Confirme o valor";
      else if (confirmar !== valor) e.confirmar = "Os valores não coincidem";
    }
    if (touched.chave && metodo === "pix" && !chavePix) {
      e.chave = "Informe a chave PIX";
    }
    return e;
  }, [touched, valor, confirmar, valorNum, chavePix, metodo]);

  const isFormValid =
    valorNum >= MINIMO &&
    valorNum <= SALDO &&
    confirmar === valor &&
    (metodo !== "pix" || chavePix.length > 0) &&
    (metodo !== "ted" || (banco && agencia && conta)) &&
    (metodo !== "conta" || (banco && agencia && conta));

  const handleSubmit = () => {
    if (!isFormValid) {
      setTouched({ valor: true, confirmar: true, chave: true });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return <SuccessScreen valor={valorNum} onReset={() => setSubmitted(false)} />;
  }

  return (
    <div className="p-8 w-full">
      {/* Header */}
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
          Solicitar Saque
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
          Transferência para sua conta bancária
        </p>
      </motion.div>

      <div className="flex flex-col gap-4" style={{ maxWidth: "560px" }}>
        {/* ── Card: Saldo disponível ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={14} color="#71717a" />
            <Label>Saldo disponível</Label>
          </div>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "40px",
              fontWeight: 800,
              color: "#8bf2c1",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            R$ {formatBRL(SALDO)}
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#71717a",
              marginTop: "8px",
            }}
          >
            Saldo liberado para saque
          </p>
        </motion.div>

        {/* ── Card: Formulário ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{
            backgroundColor: "#15181e",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Valor a sacar */}
          <div className="flex flex-col gap-1.5">
            <Label>Valor a sacar</Label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#71717a",
                  userSelect: "none",
                }}
              >
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, valor: true }))}
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "rgba(8,11,15,0.5)",
                  border: `1px solid ${errors.valor ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  if (!errors.valor) e.currentTarget.style.borderColor = "#8bf2c1";
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.valor
                    ? "rgba(255,100,100,0.5)"
                    : "rgba(255,255,255,0.2)";
                }}
              />
            </div>
            <AnimatePresence>
              {errors.valor && (
                <ErrorMsg key="valor-err">{errors.valor}</ErrorMsg>
              )}
            </AnimatePresence>
            <div className="flex gap-2 mt-1">
              {[50, 200, 500, 1000].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    const formatted = formatBRL(v);
                    setValor(formatted);
                    setTouched((t) => ({ ...t, valor: true }));
                  }}
                  className="px-3 rounded-full"
                  style={{
                    height: "24px",
                    backgroundColor: "#0e1116",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#a1a1aa",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#8bf2c1";
                    e.currentTarget.style.borderColor = "rgba(139,242,193,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#a1a1aa";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  R$ {v.toLocaleString("pt-BR")}
                </button>
              ))}
              <button
                onClick={() => {
                  setValor(formatBRL(SALDO));
                  setTouched((t) => ({ ...t, valor: true }));
                }}
                className="px-3 rounded-full"
                style={{
                  height: "24px",
                  backgroundColor: "rgba(139,242,193,0.08)",
                  border: "1px solid rgba(139,242,193,0.25)",
                  color: "#8bf2c1",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Máximo
              </button>
            </div>
          </div>

          {/* Método */}
          <div className="flex flex-col gap-1.5">
            <Label>Método de recebimento</Label>
            <div
              className="flex rounded-lg p-1 gap-1"
              style={{ backgroundColor: "#0e1116" }}
            >
              {METODOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  className="flex-1 rounded-md flex items-center justify-center"
                  style={{
                    height: "34px",
                    backgroundColor: metodo === m.id ? "#8bf2c1" : "transparent",
                    color: metodo === m.id ? "#080b0f" : "#71717a",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "6px",
                    transition: "background-color 0.15s, color 0.15s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional fields */}
          <AnimatePresence mode="wait">
            {metodo === "pix" && (
              <motion.div
                key="pix"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3 overflow-hidden"
              >
                <div className="flex flex-col gap-1.5">
                  <Label>Tipo de chave PIX</Label>
                  <div className="relative">
                    <select
                      value={tipoPix}
                      onChange={(e) => {
                        setTipoPix(e.target.value as TipoPix);
                        setChavePix("");
                      }}
                      style={{
                        width: "100%",
                        height: "40px",
                        backgroundColor: "rgba(8,11,15,0.5)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        paddingLeft: "12px",
                        paddingRight: "32px",
                        outline: "none",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      {TIPOS_PIX.map((t) => (
                        <option key={t.id} value={t.id} style={{ backgroundColor: "#15181e" }}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      color="#71717a"
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Chave PIX</Label>
                  <input
                    type="text"
                    value={chavePix}
                    onChange={(e) => setChavePix(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, chave: true }))}
                    placeholder={TIPOS_PIX.find((t) => t.id === tipoPix)?.placeholder}
                    style={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: "rgba(8,11,15,0.5)",
                      border: `1px solid ${errors.chave ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.2)"}`,
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      paddingLeft: "12px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.chave) e.currentTarget.style.borderColor = "#8bf2c1";
                    }}
                    onBlurCapture={(e) => {
                      e.currentTarget.style.borderColor = errors.chave
                        ? "rgba(255,100,100,0.5)"
                        : "rgba(255,255,255,0.2)";
                    }}
                  />
                  <AnimatePresence>
                    {errors.chave && <ErrorMsg key="chave-err">{errors.chave}</ErrorMsg>}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {(metodo === "ted" || metodo === "conta") && (
              <motion.div
                key="ted-conta"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3 overflow-hidden"
              >
                <TextInput label="Banco" value={banco} onChange={setBanco} placeholder="Ex: Banco do Brasil" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <TextInput label="Agência" value={agencia} onChange={setAgencia} placeholder="0000" />
                  </div>
                  <div className="flex-1">
                    <TextInput label="Conta" value={conta} onChange={setConta} placeholder="00000-0" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Tipo de conta</Label>
                  <div className="flex gap-2">
                    {(["corrente", "poupanca"] as TipoConta[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipoConta(t)}
                        className="flex-1 rounded-lg flex items-center justify-center gap-2"
                        style={{
                          height: "36px",
                          backgroundColor: tipoConta === t ? "rgba(139,242,193,0.1)" : "#0e1116",
                          border: `1px solid ${tipoConta === t ? "rgba(139,242,193,0.4)" : "rgba(255,255,255,0.08)"}`,
                          color: tipoConta === t ? "#8bf2c1" : "#71717a",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {tipoConta === t && (
                          <span
                            className="rounded-full"
                            style={{ width: "6px", height: "6px", backgroundColor: "#8bf2c1", display: "block" }}
                          />
                        )}
                        {t === "corrente" ? "Conta corrente" : "Conta poupança"}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmar valor */}
          <div className="flex flex-col gap-1.5">
            <Label>Confirmar valor</Label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#71717a",
                  userSelect: "none",
                }}
              >
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmar: true }))}
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "rgba(8,11,15,0.5)",
                  border: `1px solid ${errors.confirmar ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  if (!errors.confirmar) e.currentTarget.style.borderColor = "#8bf2c1";
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = errors.confirmar
                    ? "rgba(255,100,100,0.5)"
                    : "rgba(255,255,255,0.2)";
                }}
              />
            </div>
            <AnimatePresence>
              {errors.confirmar && (
                <ErrorMsg key="confirmar-err">{errors.confirmar}</ErrorMsg>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Card: Resumo ── */}
        <AnimatePresence>
          {valorNum >= MINIMO && valorNum <= SALDO && (
            <motion.div
              key="resumo"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "#15181e",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="px-6 py-4">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#71717a",
                    letterSpacing: "0.55px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Resumo do saque
                </p>
                <div className="flex flex-col gap-3">
                  <ResumoRow label="Valor solicitado" value={`R$ ${formatBRL(valorNum)}`} />
                  <ResumoRow
                    label="Taxa"
                    value="Sem taxa"
                    valueColor="#8bf2c1"
                    badge="0%"
                  />
                  <ResumoRow
                    label="Prazo estimado"
                    value="1–2 dias úteis"
                    icon={<Clock size={13} color="#71717a" />}
                  />
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <ResumoRow
                      label="Valor a receber"
                      value={`R$ ${formatBRL(valorNum)}`}
                      bold
                      valueColor="#8bf2c1"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Botão confirmar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileTap={{ scale: isFormValid ? 0.98 : 1 }}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center rounded"
            style={{
              height: "52px",
              backgroundColor: isFormValid ? "#8bf2c1" : "rgba(139,242,193,0.15)",
              border: "none",
              borderRadius: "4px",
              cursor: isFormValid ? "pointer" : "not-allowed",
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              color: isFormValid ? "#080b0f" : "rgba(139,242,193,0.4)",
              letterSpacing: "-0.3px",
              transition: "background-color 0.2s, color 0.2s",
            }}
          >
            Confirmar Saque
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={13} color="#71717a" />
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
              textAlign: "center",
            }}
          >
            Saques processados em dias úteis até as 18h
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Success screen ──────────────────────────────────────────────────────── */

function SuccessScreen({ valor, onReset }: { valor: number; onReset: () => void }) {
  return (
    <div className="p-8 w-full flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: "400px" }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: "72px",
            height: "72px",
            backgroundColor: "rgba(139,242,193,0.12)",
            border: "2px solid rgba(139,242,193,0.3)",
          }}
        >
          <CheckCircle2 size={32} color="#8bf2c1" />
        </div>
        <div>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "22px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Saque solicitado!
          </h2>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "#8bf2c1",
              letterSpacing: "-1.5px",
              marginBottom: "8px",
            }}
          >
            R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Seu saque foi enviado para análise e será processado em até 2 dias úteis.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          style={{
            height: "40px",
            paddingLeft: "24px",
            paddingRight: "24px",
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#a1a1aa",
          }}
        >
          Fazer outro saque
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── Shared primitives ───────────────────────────────────────────────────── */

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

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "rgba(8,11,15,0.5)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          paddingLeft: "12px",
          outline: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#8bf2c1"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
      />
    </div>
  );
}

function ErrorMsg({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-1.5 overflow-hidden"
    >
      <AlertCircle size={12} color="#ff6464" />
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "#ff6464",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

function ResumoRow({
  label,
  value,
  valueColor,
  bold,
  badge,
  icon,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  badge?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          color: "#71717a",
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        {icon}
        {badge && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              backgroundColor: "rgba(139,242,193,0.1)",
              color: "#8bf2c1",
              letterSpacing: "0.3px",
            }}
          >
            {badge}
          </span>
        )}
        <span
          style={{
            fontFamily: bold ? "Manrope, sans-serif" : "Inter, sans-serif",
            fontSize: bold ? "16px" : "13px",
            fontWeight: bold ? 800 : 600,
            color: valueColor ?? "#ffffff",
            letterSpacing: bold ? "-0.5px" : "0",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
