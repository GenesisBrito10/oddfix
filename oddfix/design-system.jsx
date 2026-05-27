/* ────────────────────────────────────────────────────────────
   Oddfix · Design System reference panel
   Exposes: window.OddfixDesignSystem
   ──────────────────────────────────────────────────────────── */

const { Icon: DSIcon, Logo: DSLogo, Wordmark: DSWordmark, BookmakerLogo: DSBookmakerLogo,
        Chip: DSChip, Badge: DSBadge, Sparkline: DSSparkline,
        Segmented: DSSegmented, RangeSlider: DSRangeSlider,
        fmtBRL: dsFmtBRL } = window.OFX;

function DSGroup({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{
          margin: 0, fontSize: 13, fontWeight: 700,
          letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--mint)',
        }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function DSCard({ title, children, style }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 20,
      ...style,
    }}>
      {title && <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--t3)',
        letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14,
      }}>{title}</div>}
      {children}
    </div>
  );
}

function Swatch({ color, name, value, dark }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 10,
      background: 'var(--inner-2)',
      border: '1px solid var(--border)', borderRadius: 10,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 8,
        background: color,
        border: '1px solid ' + (dark ? 'var(--border-strong)' : 'rgba(0,0,0,0.2)'),
        boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
        flexShrink: 0,
      }}/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', letterSpacing: 0.2 }}>{name}</span>
        <span className="tnum" style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--f-mono)' }}>{value}</span>
      </div>
    </div>
  );
}

function TypeRow({ size, weight, label, sample, kind }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
      gap: 24,
    }}>
      <div style={{ width: 140, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)' }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--t3)' }}>{size}px · {weight} · {kind}</div>
      </div>
      <div style={{
        fontSize: size, fontWeight: weight,
        color: 'var(--t1)', letterSpacing: size > 24 ? -0.6 : 0,
        fontFamily: kind === 'mono' ? 'var(--f-mono)' : 'var(--f-sans)',
        textTransform: kind === 'label' ? 'uppercase' : 'none',
      }}>{sample}</div>
    </div>
  );
}

function DSButtons() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <button style={{
        padding: '10px 18px', fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
        background: 'linear-gradient(135deg, var(--green), var(--mint))',
        color: '#070A0F',
        border: 0, borderRadius: 10, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--f-sans)',
        boxShadow: '0 4px 12px rgba(32,230,154,0.30), 0 0 0 1px rgba(141,255,199,0.40)',
      }}>
        <DSIcon.zap size={13}/> Primary
      </button>
      <button style={{
        padding: '10px 16px', fontSize: 13, fontWeight: 600,
        background: 'var(--card-2)', color: 'var(--t1)',
        border: '1px solid var(--border-strong)', borderRadius: 10, cursor: 'pointer',
        fontFamily: 'var(--f-sans)',
      }}>Secondary</button>
      <button style={{
        padding: '10px 16px', fontSize: 13, fontWeight: 600,
        background: 'transparent', color: 'var(--mint)',
        border: '1px solid rgba(141,255,199,0.30)', borderRadius: 10, cursor: 'pointer',
        fontFamily: 'var(--f-sans)',
      }}>Ghost</button>
      <button style={{
        padding: '10px 16px', fontSize: 13, fontWeight: 600,
        background: 'transparent', color: 'var(--t3)',
        border: '1px dashed var(--border-strong)', borderRadius: 10, cursor: 'not-allowed',
        fontFamily: 'var(--f-sans)',
      }}>Disabled</button>
      <button style={{
        width: 38, height: 38, borderRadius: 8,
        background: 'var(--card-2)', border: '1px solid var(--border)',
        display: 'grid', placeItems: 'center', cursor: 'pointer',
      }}><DSIcon.copy size={14} color="var(--t1)"/></button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{
      height: 60, borderRadius: 10,
      background: 'linear-gradient(90deg, var(--inner-2) 0%, rgba(148,163,184,0.06) 50%, var(--inner-2) 100%)',
      backgroundSize: '200% 100%',
      animation: 'ofx-shimmer 1.6s linear infinite',
    }}/>
  );
}

function DSStates() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Fresh */}
      <div style={{
        padding: 14, border: '1px solid rgba(141,255,199,0.30)', borderRadius: 12,
        background: 'linear-gradient(180deg, rgba(32,230,154,0.06) 0%, var(--card-2) 60%)',
        boxShadow: '0 0 24px rgba(32,230,154,0.10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span className="ofx-pulse-dot" style={{ width: 6, height: 6 }}/>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--mint)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Atualizado agora
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t2)' }}>Card recém atualizado · glow verde sutil</div>
      </div>

      {/* Loading */}
      <div style={{ padding: 14, background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SkeletonRow/>
        <SkeletonRow/>
      </div>

      {/* Empty */}
      <div style={{
        padding: '20px 14px', border: '1px dashed var(--border-strong)', borderRadius: 12,
        background: 'var(--card)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'rgba(148,163,184,0.08)',
          display: 'grid', placeItems: 'center',
        }}>
          <DSIcon.radar size={16} color="var(--t3)"/>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>Nenhuma oportunidade</div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>Aguardando atualização das odds...</div>
      </div>

      {/* Error / stale */}
      <div style={{
        padding: 14, border: '1px solid rgba(246,199,107,0.30)', borderRadius: 12,
        background: 'rgba(246,199,107,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 50, background: 'var(--amber)' }}/>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--amber)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Odd desatualizada
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t2)' }}>Última leitura há 28s · sincronizando...</div>
      </div>
    </div>
  );
}

function DSInputs() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Stake field */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '4px 4px 4px 12px',
        background: 'linear-gradient(180deg, rgba(32,230,154,0.04) 0%, transparent 100%)',
        border: '1px solid var(--border-strong)', borderRadius: 10,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>R$</span>
        <div className="tnum" style={{ flex: 1, padding: '8px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
          3.000,00
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        background: 'var(--inner)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <DSIcon.search size={13} color="var(--t3)"/>
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Buscar casa de apostas...</span>
      </div>

      {/* Range slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--t3)' }}>Faixa de lucro</span>
          <span style={{ color: 'var(--mint)' }}>0% — 30%</span>
        </div>
        <DSRangeSlider value={[0, 30]} min={0} max={30}/>
      </div>

      {/* Segmented */}
      <DSSegmented value={2} onChange={() => {}}
        options={[{value:2,label:'2 opções'},{value:3,label:'3 opções'}]}
        style={{ display: 'flex', width: '100%' }}/>
    </div>
  );
}

function MiniOpportunityPreview() {
  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--card-2) 0%, var(--card) 100%)',
      border: '1px solid var(--border-mint-soft)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 0 24px rgba(32,230,154,0.06)',
    }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Grêmio <span style={{ color: 'var(--t3)', fontWeight: 500 }}>vs</span> Corinthians</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <DSBadge tone="mint" size="sm">+0.96%</DSBadge>
          <DSBadge tone="neutral" size="sm">Alta confiança</DSBadge>
        </div>
      </div>
      <div style={{ background: 'var(--inner-2)' }}>
        {[['Blaze','Total Over',2.06], ['Bet365','Total Under',1.98]].map(([b,m,o], i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            borderTop: i ? '1px solid var(--border)' : 0,
          }}>
            <DSBookmakerLogo name={b} size={18}/>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{m}</span>
            <span className="tnum" style={{ fontSize: 15, fontWeight: 700, color: 'var(--odds)' }}>{o.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OddfixDesignSystem() {
  return (
    <div style={{
      width: 1280, padding: 40,
      background: 'var(--bg)',
      color: 'var(--t1)',
      fontFamily: 'var(--f-sans)',
      minHeight: 1600,
    }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <DSWordmark height={44} color="var(--mint)"/>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
            Oddfix Design System
          </h1>
          <div style={{ fontSize: 14, color: 'var(--t2)', marginTop: 4 }}>
            Tokens, componentes e estados para o terminal de arbitragem · v2.4
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <DSChip size="md" tone="success" leading={<span className="ofx-pulse-dot" style={{ width: 6, height: 6 }}/>}>Em produção</DSChip>
          <DSChip size="md">52 tokens · 38 componentes</DSChip>
        </div>
      </header>

      {/* ── Colors ── */}
      <DSGroup title="01 · Paleta" subtitle="Superfícies em camadas, mint como acento, lima para odds.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <Swatch dark color="#070A0F" name="Background"   value="#070A0F"/>
          <Swatch dark color="#10151C" name="Chrome"       value="#10151C"/>
          <Swatch dark color="#121821" name="Card"         value="#121821"/>
          <Swatch dark color="#151C25" name="Card raised"  value="#151C25"/>
          <Swatch dark color="#18212B" name="Card hover"   value="#18212B"/>
          <Swatch dark color="#090D12" name="Inner well"   value="#090D12"/>
          <Swatch dark color="#0C1117" name="Inner row"    value="#0C1117"/>
          <Swatch dark color="rgba(148,163,184,0.10)" name="Border"  value="slate / 10%"/>

          <Swatch color="#8DFFC7" name="Mint primary"  value="#8DFFC7"/>
          <Swatch color="#20E69A" name="Green profit"  value="#20E69A"/>
          <Swatch color="#DDF76E" name="Odds lime"     value="#DDF76E"/>
          <Swatch color="#F6C76B" name="Amber alert"   value="#F6C76B"/>

          <Swatch color="#F4F7FA" name="Text primary"   value="#F4F7FA"/>
          <Swatch dark color="#8B95A5" name="Text secondary" value="#8B95A5"/>
          <Swatch dark color="#596272" name="Text tertiary"  value="#596272"/>
          <Swatch dark color="#F87171" name="Red live"   value="#F87171"/>
        </div>
      </DSGroup>

      {/* ── Typography ── */}
      <DSGroup title="02 · Tipografia" subtitle="Inter — tabular-nums para números financeiros.">
        <DSCard>
          <TypeRow size={38} weight={800} label="Display"    sample="Sinais Pré-Live"     kind="sans"/>
          <TypeRow size={26} weight={700} label="Heading 1"  sample="Oportunidades"       kind="sans"/>
          <TypeRow size={20} weight={700} label="Heading 2"  sample="R$ 3.028,80"         kind="sans"/>
          <TypeRow size={17} weight={700} label="Odds"       sample="2.06"                kind="sans"/>
          <TypeRow size={14} weight={600} label="Body"       sample="Atualizado há 4s"    kind="sans"/>
          <TypeRow size={12} weight={500} label="Caption"    sample="Total Over (2.25)"   kind="sans"/>
          <TypeRow size={10} weight={700} label="Label"      sample="RETORNO PREVISTO"    kind="label"/>
          <TypeRow size={13} weight={500} label="Mono / tnum" sample="R$ 1.470,30"         kind="mono"/>
        </DSCard>
      </DSGroup>

      {/* ── Spacing & radii ── */}
      <DSGroup title="03 · Espaçamento e raio">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DSCard title="Spacing scale">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 60 }}>
              {[4, 6, 8, 12, 16, 20, 28, 40].map((s) => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: s, height: s, background: 'var(--mint)', borderRadius: 3 }}/>
                  <span className="tnum" style={{ fontSize: 10, color: 'var(--t3)' }}>{s}</span>
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard title="Radii">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {[
                { r: 4, name: 'xs' }, { r: 6, name: 'sm' }, { r: 10, name: 'md' },
                { r: 14, name: 'lg' }, { r: 18, name: 'xl' }, { r: 999, name: 'pill' },
              ].map((x) => (
                <div key={x.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: x.r,
                    background: 'var(--card-2)', border: '1px solid var(--border-strong)',
                  }}/>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>{x.name}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </DSGroup>

      {/* ── Badges & Chips ── */}
      <DSGroup title="04 · Badges & chips">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DSCard title="Badges">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <DSBadge tone="mint" leading={<DSIcon.trend size={10}/>}>+0.96% lucro</DSBadge>
              <DSBadge tone="amber" leading={<DSIcon.flame size={10}/>}>Maior lucro</DSBadge>
              <DSBadge tone="neutral" leading={<DSIcon.shield size={10}/>}>Alta confiança</DSBadge>
              <DSBadge tone="odds">Nova odd</DSBadge>
              <DSBadge tone="mint" size="sm">+0.85%</DSBadge>
              <DSBadge tone="neutral" size="sm">Pré-live</DSBadge>
            </div>
          </DSCard>

          <DSCard title="Chips · filters">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <DSChip size="md" active>Todos</DSChip>
              <DSChip size="md" leading={<DSIcon.flame size={11}/>}>Maior lucro</DSChip>
              <DSChip size="md" leading={<DSIcon.clock size={11}/>}>Mais recentes</DSChip>
              <DSChip size="md" leading={<DSIcon.ball size={11}/>}>Futebol</DSChip>
              <DSChip size="md">Acima de 0.80%</DSChip>
              <DSChip size="md">2 opções</DSChip>
            </div>
          </DSCard>
        </div>
      </DSGroup>

      {/* ── Buttons ── */}
      <DSGroup title="05 · Botões">
        <DSCard><DSButtons/></DSCard>
      </DSGroup>

      {/* ── Inputs ── */}
      <DSGroup title="06 · Inputs e controles">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DSCard title="Form fields"><DSInputs/></DSCard>
          <DSCard title="Bookmaker chips">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {['Bet365', 'Blaze', 'Betano', 'Bet7k', 'Stake', 'Pinnacle'].map((b) => (
                <div key={b} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px',
                  background: b === 'Blaze' ? 'rgba(141,255,199,0.06)' : 'rgba(255,255,255,0.015)',
                  border: '1px solid ' + (b === 'Blaze' ? 'rgba(141,255,199,0.20)' : 'var(--border)'),
                  borderRadius: 6,
                }}>
                  <DSBookmakerLogo name={b} size={18}/>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{b}</span>
                  {b === 'Blaze' && <DSIcon.check size={11} color="var(--mint)"/>}
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </DSGroup>

      {/* ── States ── */}
      <DSGroup title="07 · Estados em tempo real">
        <DSStates/>
      </DSGroup>

      {/* ── Mini card preview ── */}
      <DSGroup title="08 · Card preview" subtitle="Anatomia compactada da oportunidade.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-start' }}>
          <MiniOpportunityPreview/>
          <DSCard title="Anatomia">
            <ol style={{
              margin: 0, padding: '0 0 0 18px', color: 'var(--t2)',
              fontSize: 12.5, lineHeight: 1.9,
            }}>
              <li><strong style={{ color: 'var(--t1)' }}>Header:</strong> jogo, liga, data, freshness</li>
              <li><strong style={{ color: 'var(--t1)' }}>Badges:</strong> lucro, confiança, tag</li>
              <li><strong style={{ color: 'var(--t1)' }}>Retorno previsto:</strong> valor + lucro líquido + sparkline</li>
              <li><strong style={{ color: 'var(--t1)' }}>Mini tabela:</strong> bookmaker · mercado · odd · stake · ações</li>
              <li><strong style={{ color: 'var(--t1)' }}>Footer:</strong> stake total · lucro estimado · margem · status</li>
            </ol>
          </DSCard>
        </div>
      </DSGroup>

      {/* ── Microcopy ── */}
      <DSGroup title="09 · Microcopy PT-BR">
        <DSCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, fontSize: 12 }}>
            {[
              { k: 'Status', items: ['Scanner ativo', 'Atualizado agora', 'Atualizado há 4s', 'Mercados sincronizados', 'Aguardando atualização das odds'] },
              { k: 'Ações',  items: ['Copiar aposta', 'Abrir casa', 'Abrir oportunidade', 'Aplicar filtros', 'Limpar seleção'] },
              { k: 'Métricas', items: ['Retorno previsto', 'Lucro estimado', 'Stake total', 'Maior lucro', 'Mais recentes'] },
            ].map((g) => (
              <div key={g.k}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>{g.k}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {g.items.map((t) => (
                    <li key={t} style={{
                      padding: '6px 10px', background: 'var(--inner-2)',
                      border: '1px solid var(--border)', borderRadius: 6,
                      color: 'var(--t1)',
                    }}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DSCard>
      </DSGroup>
    </div>
  );
}

window.OddfixDesignSystem = OddfixDesignSystem;
