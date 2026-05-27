/* ────────────────────────────────────────────────────────────
   Oddfix · Mobile redesign (390 × 844)
   Exposes: window.OddfixMobile
   ──────────────────────────────────────────────────────────── */

const { Icon: MIcon, Logo: MLogo, Wordmark: MWordmark, BookmakerLogo: MBookmakerLogo,
        Chip: MChip, Badge: MBadge, Sparkline: MSparkline,
        Segmented: MSegmented, RangeSlider: MRangeSlider,
        OPPORTUNITIES: MOPPORTUNITIES, BOOKMAKERS: MBOOKMAKERS,
        fmtBRL: mFmtBRL, fmtPct: mFmtPct } = window.OFX;

function MobileTopbar({ tab, setTab }) {
  return (
    <div style={{
      padding: '12px 16px 0',
      background: 'linear-gradient(180deg, rgba(16,21,28,0.95), rgba(11,16,24,0.85))',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <MWordmark height={20} color="var(--mint)"/>
        <span style={{ flex: 1 }}/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 9px',
          background: 'rgba(32,230,154,0.06)',
          border: '1px solid rgba(32,230,154,0.18)',
          borderRadius: 8,
        }}>
          <span className="ofx-pulse-dot" style={{ width: 6, height: 6 }}/>
          <span className="tnum" style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>274</span>
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--card-2)', border: '1px solid var(--border)',
          display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative',
        }}>
          <MIcon.bell size={14} color="var(--t2)"/>
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 5, height: 5, borderRadius: 50,
            background: 'var(--green)',
          }}/>
        </button>
        <button style={{
          width: 32, height: 32, borderRadius: 50,
          background: 'linear-gradient(135deg, #20E69A, #6A4DFF)',
          display: 'grid', placeItems: 'center',
          color: '#070A0F', fontSize: 12, fontWeight: 800, border: 0,
        }}>G</button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginLeft: -4 }}>
        {[
          { v: 'pre', label: 'Pré-live' },
          { v: 'live', label: 'Live' },
          { v: 'hist', label: 'Histórico' },
        ].map((t) => (
          <button key={t.v}
            onClick={() => setTab(t.v)}
            style={{
              padding: '10px 14px',
              fontSize: 13, fontWeight: 600,
              background: 'transparent', border: 0,
              color: tab === t.v ? 'var(--mint)' : 'var(--t2)',
              borderBottom: '2px solid ' + (tab === t.v ? 'var(--mint)' : 'transparent'),
              cursor: 'pointer',
              fontFamily: 'var(--f-sans)',
              boxShadow: tab === t.v ? '0 8px 16px -10px rgba(141,255,199,0.6)' : 'none',
            }}>
            {t.label}
            {t.v === 'live' && <span style={{
              display: 'inline-block', marginLeft: 6, width: 5, height: 5, borderRadius: 50,
              background: 'var(--red)', verticalAlign: 'middle',
            }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileSummary() {
  return (
    <div style={{ padding: '16px 16px 12px' }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Sinais Pré-Live</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--t2)' }}>10 oportunidades</span>
        <span style={{ width: 3, height: 3, borderRadius: 50, background: 'var(--t4)' }}/>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--green)' }}>
          <span className="ofx-pulse-dot" style={{ width: 6, height: 6 }}/>Atualizado agora
        </span>
      </div>

      {/* Top stat row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14,
      }}>
        <div style={statTile}>
          <span style={statLabel}>Maior lucro</span>
          <span className="tnum" style={{ ...statValue, color: 'var(--green)' }}>+0.96%</span>
        </div>
        <div style={statTile}>
          <span style={statLabel}>Stake atual</span>
          <span className="tnum" style={statValue}>R$ 3.000</span>
        </div>
      </div>
    </div>
  );
}

const statTile = {
  display: 'flex', flexDirection: 'column', gap: 2,
  padding: '10px 12px',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 10,
};
const statLabel = {
  fontSize: 10, fontWeight: 700, color: 'var(--t3)',
  letterSpacing: 0.6, textTransform: 'uppercase',
};
const statValue = {
  fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
};

function MobileFilterStrip({ filter, setFilter, openDrawer }) {
  const opts = [
    { id: 'all', label: 'Todos' },
    { id: 'top', label: 'Maior lucro', leading: <MIcon.flame size={11}/> },
    { id: 'new', label: 'Recentes', leading: <MIcon.clock size={11}/> },
    { id: 'soccer', label: 'Futebol' },
    { id: 'hi', label: '+0.80%' },
    { id: '2opt', label: '2 opções' },
  ];
  return (
    <div style={{ paddingBottom: 12 }}>
      <div style={{
        display: 'flex', gap: 6, padding: '0 16px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }} className="ofx-scroll">
        <button
          onClick={openDrawer}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', fontSize: 12, fontWeight: 600,
            background: 'var(--card-2)', color: 'var(--t1)',
            border: '1px solid var(--border-strong)', borderRadius: 999,
            flexShrink: 0, cursor: 'pointer', fontFamily: 'var(--f-sans)',
          }}>
          <MIcon.sliders size={12}/> Filtros
          <span style={{
            padding: '1px 5px', fontSize: 10, fontWeight: 700,
            background: 'var(--mint)', color: '#070A0F', borderRadius: 4, marginLeft: 2,
          }}>3</span>
        </button>
        {opts.map((f) => (
          <div key={f.id} style={{ flexShrink: 0 }}>
            <MChip size="md" active={filter === f.id} leading={f.leading} onClick={() => setFilter(f.id)}>
              {f.label}
            </MChip>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileCard({ op, hot }) {
  return (
    <article style={{
      background: 'linear-gradient(180deg, var(--card-2) 0%, var(--card) 100%)',
      border: '1px solid ' + (hot ? 'var(--border-mint-soft)' : 'var(--border)'),
      borderRadius: 14,
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {hot && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, var(--mint), transparent)',
      }}/>}

      {/* Top: return + profit */}
      <div style={{
        padding: '14px 14px 12px',
        background: 'var(--inner-2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-end', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Retorno previsto
          </span>
          <div className="tnum" style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', letterSpacing: -0.5, lineHeight: 1.1 }}>
            {mFmtBRL(op.retorno)}
          </div>
          <span className="tnum" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--green)' }}>
            +{mFmtBRL(op.profitBRL)} líquido
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <MBadge tone="mint" size="md" leading={<MIcon.trend size={10}/>}>{mFmtPct(op.profit)}</MBadge>
        </div>
      </div>

      {/* Match info */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, letterSpacing: -0.2 }}>
          {op.home}
          <span style={{ color: 'var(--t3)', fontWeight: 500, padding: '0 6px' }}>vs</span>
          {op.away}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t3)' }}>
          <span>{op.league}</span>
          <span style={{ width: 2, height: 2, borderRadius: 50, background: 'var(--t4)' }}/>
          <span className="tnum">{op.date} · {op.time}</span>
          <span style={{ width: 2, height: 2, borderRadius: 50, background: 'var(--t4)' }}/>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="ofx-pulse-dot" style={{ width: 5, height: 5 }}/>{op.freshness}s
          </span>
        </div>
      </div>

      {/* Legs */}
      <div style={{ padding: '0 8px 12px' }}>
        {op.legs.map((leg, i) => (
          <div key={i} style={{
            padding: '12px 8px',
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <MBookmakerLogo name={leg.book} size={28}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{leg.book}</span>
                <span className="tnum" style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--odds)',
                  textShadow: '0 0 12px rgba(217,248,117,0.3)',
                }}>{leg.odd.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leg.market}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 700 }}>{mFmtBRL(leg.stake)}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={mobileRowBtn}><MIcon.copy size={12} color="var(--t2)"/></button>
                <button style={{ ...mobileRowBtn, background: 'rgba(141,255,199,0.08)', borderColor: 'rgba(141,255,199,0.20)' }}>
                  <MIcon.external size={12} color="var(--mint)"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.005)',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
      }}>
        <FooterMicro label="Stake" value={mFmtBRL(op.stake, { digits: 0 })}/>
        <FooterMicro label="Lucro" value={'+' + mFmtBRL(op.profitBRL, { digits: 2 })} color="var(--green)"/>
        <FooterMicro label="Margem" value={op.margem.toFixed(2) + '%'}/>
      </div>

      {/* Primary action */}
      <button style={{
        width: '100%',
        padding: '12px 14px',
        background: 'linear-gradient(135deg, var(--green), var(--mint))',
        color: '#070A0F', fontSize: 13, fontWeight: 700,
        border: 0, borderTop: '1px solid rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer', letterSpacing: 0.3,
        fontFamily: 'var(--f-sans)',
      }}>
        Abrir oportunidade <MIcon.chevRight size={14} stroke={2.4}/>
      </button>
    </article>
  );
}

const mobileRowBtn = {
  width: 28, height: 28, borderRadius: 6,
  background: 'var(--card-2)', border: '1px solid var(--border)',
  display: 'grid', placeItems: 'center', cursor: 'pointer',
};

function FooterMicro({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <span className="tnum" style={{ fontSize: 12, fontWeight: 600, color: color || 'var(--t1)' }}>{value}</span>
    </div>
  );
}

function MobileBottomNav() {
  const items = [
    { I: MIcon.signal, label: 'Sinais', active: true },
    { I: MIcon.wallet, label: 'Carteira' },
    { I: MIcon.history, label: 'Histórico' },
    { I: MIcon.user, label: 'Conta' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '8px 12px 14px',
      background: 'rgba(11,16,24,0.92)',
      backdropFilter: 'blur(18px)',
      borderTop: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
    }}>
      {items.map((it, i) => (
        <button key={i} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '8px 0',
          background: 'transparent', border: 0,
          color: it.active ? 'var(--mint)' : 'var(--t3)',
          cursor: 'pointer', fontFamily: 'var(--f-sans)',
        }}>
          <it.I size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function MobileFiltersDrawer({ open, close }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
    }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--chrome-2)',
          borderTopLeftRadius: 18, borderTopRightRadius: 18,
          padding: 20, paddingBottom: 32,
          borderTop: '1px solid var(--border-strong)',
          boxShadow: '0 -24px 60px rgba(0,0,0,0.5)',
          maxHeight: '85%', overflowY: 'auto',
        }}
        className="ofx-scroll">
        <div style={{ width: 36, height: 4, background: 'var(--t4)', borderRadius: 50, margin: '0 auto 16px' }}/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Filtros</h3>
          <button onClick={close} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--card)', border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <MIcon.close size={14} color="var(--t2)"/>
          </button>
        </div>

        {/* Stake */}
        <div style={{ marginBottom: 18 }}>
          <div style={drawerLabel}>Stake atual</div>
          <div style={{
            display: 'flex', alignItems: 'center', padding: '4px 4px 4px 12px',
            background: 'var(--inner)', border: '1px solid var(--border-strong)', borderRadius: 10,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>R$</span>
            <div className="tnum" style={{ flex: 1, padding: '10px 8px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
              3.000,00
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: 18 }}>
          <div style={drawerLabel}>Quantidade de opções</div>
          <MSegmented value={2} onChange={() => {}}
            options={[{value:2,label:'2 opções'},{value:3,label:'3 opções'}]}
            style={{ display: 'flex', width: '100%' }}/>
        </div>

        {/* Range */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ ...drawerLabel, display: 'flex', justifyContent: 'space-between' }}>
            <span>Faixa de lucro</span>
            <span style={{ color: 'var(--mint)' }}>0% — 30%</span>
          </div>
          <MRangeSlider value={[0, 30]} min={0} max={30}/>
        </div>

        {/* Books */}
        <div style={{ marginBottom: 18 }}>
          <div style={drawerLabel}>Casas de apostas · 18 selecionadas</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {MBOOKMAKERS.slice(0, 10).map((b, i) => (
              <div key={b + i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 10px',
                background: 'rgba(141,255,199,0.06)',
                border: '1px solid rgba(141,255,199,0.20)',
                borderRadius: 999,
                fontFamily: 'var(--f-sans)', fontSize: 11, fontWeight: 600, color: 'var(--t1)',
              }}>
                <MBookmakerLogo name={b} size={14}/>{b}
              </div>
            ))}
          </div>
        </div>

        <button style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, var(--green), var(--mint))',
          color: '#070A0F', fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
          border: 0, borderRadius: 10, cursor: 'pointer',
          fontFamily: 'var(--f-sans)',
        }}>Aplicar filtros</button>
      </div>
    </div>
  );
}

const drawerLabel = {
  fontSize: 10, fontWeight: 700, color: 'var(--t3)',
  letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
};

function OddfixMobile() {
  const [tab, setTab] = React.useState('pre');
  const [filter, setFilter] = React.useState('all');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div style={{
      width: 390, height: 844,
      background: 'var(--bg)',
      color: 'var(--t1)',
      fontFamily: 'var(--f-sans)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <MobileTopbar tab={tab} setTab={setTab}/>

      <div className="ofx-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <MobileSummary/>
        <MobileFilterStrip filter={filter} setFilter={setFilter} openDrawer={() => setDrawerOpen(true)}/>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOPPORTUNITIES.slice(0, 4).map((op, i) => (
            <MobileCard key={op.id} op={op} hot={i === 0}/>
          ))}
        </div>
        <div style={{ padding: '16px 16px 24px', display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: 'var(--t3)',
          }}>
            <MIcon.refresh size={11} color="var(--mint)"/>
            Aguardando atualização das odds...
          </span>
        </div>
      </div>

      <MobileBottomNav/>
      <MobileFiltersDrawer open={drawerOpen} close={() => setDrawerOpen(false)}/>
    </div>
  );
}

window.OddfixMobile = OddfixMobile;
