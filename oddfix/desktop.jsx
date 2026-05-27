/* ────────────────────────────────────────────────────────────
   Oddfix · Desktop redesign (1920 × 1080)
   Exposes: window.OddfixDesktop
   ──────────────────────────────────────────────────────────── */

const { Icon, Logo, Wordmark, BookmakerLogo, BOOKMAKER_TINTS, Chip, Badge, Sparkline,
        Segmented, RangeSlider, OPPORTUNITIES, BOOKMAKERS,
        fmtBRL, fmtPct } = window.OFX;

// ── Topbar ──────────────────────────────────────────────────
function Topbar() {
  return (
    <div style={{
      height: 64,
      background: 'linear-gradient(180deg, rgba(16,21,28,0.92) 0%, rgba(11,16,24,0.88) 100%)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 24,
      position: 'relative',
    }}>
      {/* Activity scanline (subtle) */}
      <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(141,255,199,0.6), transparent)',
        backgroundSize: '40% 100%', backgroundRepeat: 'no-repeat',
        animation: 'ofx-scan 6s ease-in-out infinite',
        opacity: 0.5,
      }}/>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220 }}>
        <Wordmark height={22} color="var(--mint)"/>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <TopTab active label="Pré-live" />
        <TopTab label="Live" trailing={<span style={{
          width: 6, height: 6, borderRadius: 50, background: 'var(--red)',
          boxShadow: '0 0 8px var(--red)',
        }}/>}/>
        <TopTab label="Histórico" />
        <TopTab label="Carteira" />
      </div>

      {/* Signal counter pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px',
        background: 'var(--inner)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginLeft: 4,
      }}>
        <div className="ofx-pulse-dot"/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: 'var(--mint)' }}>274 sinais</span>
          <span style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase' }}>monitorados ao vivo</span>
        </div>
      </div>

      {/* Scanner status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        background: 'rgba(32,230,154,0.04)',
        border: '1px solid rgba(32,230,154,0.18)',
        borderRadius: 8,
      }}>
        <Icon.radar size={14} color="var(--green)" />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Scanner ativo</span>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>· 2s</span>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Plataforma / Afiliados toggle */}
      <div style={{
        display: 'inline-flex', padding: 3,
        background: 'var(--inner)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}>
        {['Plataforma', 'Afiliados'].map((l, i) => (
          <div key={l} style={{
            padding: '6px 14px', fontSize: 11.5, fontWeight: 700,
            letterSpacing: 0.6, textTransform: 'uppercase',
            color: i === 0 ? 'var(--mint)' : 'var(--t2)',
            background: i === 0 ? 'var(--card-2)' : 'transparent',
            borderRadius: 6,
            boxShadow: i === 0 ? '0 1px 0 rgba(141,255,199,0.10) inset, 0 0 0 1px rgba(141,255,199,0.18)' : 'none',
          }}>{l}</div>
        ))}
      </div>

      {/* Icon buttons */}
      {[Icon.bell, Icon.history, Icon.settings].map((I, i) => (
        <button key={i} style={iconBtnStyle}>
          <I size={16} color="var(--t2)"/>
          {i === 0 && <span style={{
            position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 50,
            background: 'var(--green)', boxShadow: '0 0 6px var(--green)',
          }}/>}
        </button>
      ))}

      {/* User */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '4px 12px 4px 4px',
        background: 'var(--card-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 10, cursor: 'pointer',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 50,
          background: 'linear-gradient(135deg, #20E69A, #6A4DFF)',
          display: 'grid', placeItems: 'center',
          color: '#070A0F', fontSize: 12, fontWeight: 800,
        }}>G</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Genesis</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>Plano Pro</span>
        </div>
        <Icon.chevDown size={14} color="var(--t3)" />
      </div>
    </div>
  );
}

const iconBtnStyle = {
  width: 36, height: 36, borderRadius: 8,
  background: 'transparent',
  border: '1px solid var(--border)',
  display: 'grid', placeItems: 'center',
  cursor: 'pointer', position: 'relative',
};

function TopTab({ active, label, trailing }) {
  return (
    <div style={{
      position: 'relative',
      padding: '8px 14px',
      fontSize: 13, fontWeight: 600,
      color: active ? 'var(--mint)' : 'var(--t2)',
      letterSpacing: 0.2,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {label}
      {trailing}
      {active && <div style={{
        position: 'absolute', left: 14, right: 14, bottom: -22,
        height: 2, borderRadius: 2,
        background: 'linear-gradient(90deg, var(--mint), var(--green))',
        boxShadow: '0 0 10px rgba(141,255,199,0.6)',
      }}/>}
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────
function Sidebar({ stake, setStake, options, setOptions, range, setRange, selectedBooks, toggleBook }) {
  const [search, setSearch] = React.useState('');
  const filteredBooks = BOOKMAKERS.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside style={{
      width: 304,
      background: 'var(--chrome)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.sliders size={14} color="var(--t2)"/>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--t2)', textTransform: 'uppercase' }}>Filtros</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--t3)' }}>v2.4</span>
      </div>

      <div className="ofx-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stake card */}
        <SidebarSection label="Stake atual" hint="por aposta">
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(32,230,154,0.04) 0%, transparent 100%)',
            border: '1px solid var(--border-strong)',
            borderRadius: 10,
            padding: '4px 4px 4px 12px',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.5 }}>R$</span>
            <input
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="tnum ofx-focus"
              style={{
                flex: 1, background: 'transparent', border: 0,
                padding: '8px 8px', fontSize: 22, fontWeight: 700,
                color: 'var(--t1)', letterSpacing: -0.5,
                fontFamily: 'var(--f-sans)', outline: 0,
              }}/>
            <button style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--card-2)', border: '1px solid var(--border)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <Icon.sliders size={12} color="var(--t2)"/>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[500, 1000, 3000, 5000].map((v) => (
              <button key={v}
                onClick={() => setStake(v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))}
                style={{
                  flex: 1, padding: '6px 0', fontSize: 11, fontWeight: 600,
                  background: 'transparent', color: 'var(--t2)',
                  border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
                  fontFamily: 'var(--f-sans)',
                }}>
                {(v / 1000).toFixed(v < 1000 ? 1 : 0)}k
              </button>
            ))}
          </div>
        </SidebarSection>

        {/* Options */}
        <SidebarSection label="Quantidade de opções">
          <Segmented
            value={options}
            onChange={setOptions}
            options={[{value: 2, label: '2 opções'}, {value: 3, label: '3 opções'}]}
            size="md"
            style={{ width: '100%', display: 'flex' }}
          />
        </SidebarSection>

        {/* Profit range */}
        <SidebarSection label="Faixa de lucro" trailing={
          <span className="tnum" style={{ fontSize: 11, fontWeight: 600, color: 'var(--mint)', letterSpacing: 0.3 }}>
            {range[0]}% — {range[1]}%
          </span>
        }>
          <RangeSlider value={range} onChange={setRange} min={0} max={30}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--t3)' }}>
            <span>0%</span><span>10%</span><span>20%</span><span>30%</span>
          </div>
        </SidebarSection>

        {/* Bookmakers */}
        <SidebarSection
          label={`Casas de apostas`}
          trailing={
            <button style={{
              fontSize: 10, fontWeight: 600, color: 'var(--mint)',
              background: 'transparent', border: 0, cursor: 'pointer',
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}>Limpar</button>
          }
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px',
            background: 'var(--inner)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            marginBottom: 10,
          }}>
            <Icon.search size={12} color="var(--t3)"/>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar casa..."
              style={{
                flex: 1, background: 'transparent', border: 0,
                fontSize: 12, color: 'var(--t1)', outline: 0,
                fontFamily: 'var(--f-sans)',
              }}/>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--mint)', fontWeight: 700 }}>{selectedBooks.length}</span> selecionadas
            </span>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>{BOOKMAKERS.length} disponíveis</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {filteredBooks.map((b, i) => {
              const active = selectedBooks.includes(b);
              return (
                <button key={b + i}
                  onClick={() => toggleBook(b)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 8px',
                    background: active ? 'rgba(141,255,199,0.06)' : 'rgba(255,255,255,0.015)',
                    border: '1px solid ' + (active ? 'rgba(141,255,199,0.20)' : 'var(--border)'),
                    borderRadius: 6, cursor: 'pointer',
                    fontFamily: 'var(--f-sans)',
                  }}>
                  <BookmakerLogo name={b} size={16}/>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 11, fontWeight: 600, color: active ? 'var(--t1)' : 'var(--t2)' }}>{b}</span>
                  {active && <Icon.check size={10} color="var(--mint)"/>}
                </button>
              );
            })}
          </div>
        </SidebarSection>

        {/* Scanner status */}
        <div style={{
          padding: '12px 14px',
          background: 'var(--inner)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.radar size={14} color="var(--green)"/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--t1)' }}>
              Scanner ativo
            </span>
            <span style={{ flex: 1 }}/>
            <span className="ofx-pulse-dot"/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--t3)' }}>Última leitura</span>
            <span className="tnum" style={{ color: 'var(--t1)', fontWeight: 600 }}>há 2s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--t3)' }}>Sinais monitorados</span>
            <span className="tnum" style={{ color: 'var(--mint)', fontWeight: 600 }}>274</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--t3)' }}>Latência média</span>
            <span className="tnum" style={{ color: 'var(--t1)', fontWeight: 600 }}>184 ms</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon.user size={14} color="var(--t2)"/>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--t2)' }}>Conta</span>
        <button style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'transparent', border: '1px solid var(--border)',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <Icon.logout size={12} color="var(--t3)"/>
        </button>
      </div>
    </aside>
  );
}

function SidebarSection({ label, hint, trailing, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.1, color: 'var(--t3)', textTransform: 'uppercase' }}>{label}</span>
          {hint && <span style={{ fontSize: 10, color: 'var(--t4)' }}>{hint}</span>}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  );
}

// ── Page header (summary + filters) ─────────────────────────
function PageHeader({ filter, setFilter, sort, setSort, view, setView, density, setDensity }) {
  return (
    <div style={{ padding: '20px 28px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title + summary chips */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Sinais Pré-Live</h1>
            <Badge tone="mint" size="md">10 oportunidades</Badge>
          </div>
          <div style={{ fontSize: 13, color: 'var(--t2)', maxWidth: 720 }}>
            Oportunidades encontradas com base nos filtros ativos e stake configurada. Atualizadas continuamente conforme as odds mudam nas casas.
          </div>
        </div>

        {/* Summary tiles */}
        <div style={{ display: 'flex', gap: 8 }}>
          <SummaryTile icon={Icon.trend}  label="Maior lucro"     value="+0.96%" valueColor="var(--green)"/>
          <SummaryTile icon={Icon.wallet} label="Stake"          value="R$ 3.000"/>
          <SummaryTile icon={Icon.zap}    label="Atualização"     value="Agora"  pulse/>
        </div>
      </div>

      {/* Filter strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {[
            { id: 'all', label: 'Todos', leading: null },
            { id: 'top', label: 'Maior lucro', leading: <Icon.flame size={12}/> },
            { id: 'new', label: 'Mais recentes', leading: <Icon.clock size={12}/> },
            { id: 'soccer', label: 'Futebol', leading: <Icon.ball size={12}/> },
            { id: 'hi', label: 'Acima de 0.80%' },
            { id: '2opt', label: '2 opções' },
            { id: '3opt', label: '3 opções' },
            { id: 'fav', label: 'Favoritos', leading: <Icon.star size={12}/> },
          ].map((f) => (
            <Chip key={f.id}
              size="md"
              active={filter === f.id}
              leading={f.leading}
              onClick={() => setFilter(f.id)}>{f.label}</Chip>
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: 'var(--border)' }}/>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Ordenar</span>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px',
            background: 'var(--inner)', border: '1px solid var(--border)',
            borderRadius: 6, cursor: 'pointer',
            fontFamily: 'var(--f-sans)', fontSize: 12, fontWeight: 600, color: 'var(--t1)',
          }}>
            Maior lucro <Icon.chevDown size={12} color="var(--t3)"/>
          </button>
        </div>

        {/* Density */}
        <Segmented value={density} onChange={setDensity} size="sm"
          options={[{value:'cozy',label:'Confortável'},{value:'compact',label:'Compacta'}]}
        />

        {/* View */}
        <div style={{ display: 'inline-flex', padding: 3, background: 'var(--inner)', border: '1px solid var(--border)', borderRadius: 8 }}>
          {[
            { v: 'grid', I: Icon.grid },
            { v: 'list', I: Icon.list },
          ].map(({ v, I }) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                width: 28, height: 26, borderRadius: 5,
                background: view === v ? 'var(--card-2)' : 'transparent',
                border: 0, cursor: 'pointer',
                display: 'grid', placeItems: 'center',
                boxShadow: view === v ? '0 0 0 1px rgba(141,255,199,0.18)' : 'none',
              }}>
              <I size={13} color={view === v ? 'var(--mint)' : 'var(--t2)'}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ icon: I, label, value, valueColor, pulse }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      minWidth: 132, position: 'relative',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: 'rgba(141,255,199,0.06)',
        border: '1px solid var(--border)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <I size={13} color="var(--mint)"/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</span>
        <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: valueColor || 'var(--t1)', letterSpacing: -0.2 }}>{value}</span>
      </div>
      {pulse && <span className="ofx-pulse-dot" style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6 }}/>}
    </div>
  );
}

// ── Opportunity card ────────────────────────────────────────
function OpportunityCard({ op, hot, density = 'cozy' }) {
  const [hover, setHover] = React.useState(false);
  const compact = density === 'compact';

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'linear-gradient(180deg, var(--card-2) 0%, var(--card) 100%)',
        border: '1px solid ' + (hot ? 'var(--border-mint-soft)' : 'var(--border)'),
        borderRadius: 14,
        boxShadow: hover ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transition: 'all 220ms ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* Glow rim for hot */}
      {hot && <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 80% at 100% 0%, rgba(32,230,154,0.08), transparent 50%)',
      }}/>}

      <CardHeader op={op} compact={compact}/>
      <BookmakerTable op={op} compact={compact}/>
      <CardFooter op={op}/>
    </article>
  );
}

function CardHeader({ op, compact }) {
  return (
    <div style={{
      padding: compact ? '14px 18px 12px' : '16px 20px 14px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'flex-start', gap: 16,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h3 style={{
            margin: 0, fontSize: compact ? 14 : 15.5, fontWeight: 700,
            letterSpacing: -0.2, color: 'var(--t1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 460,
          }}>
            <span>{op.home}</span>
            <span style={{ color: 'var(--t3)', fontWeight: 500, padding: '0 8px' }}>vs</span>
            <span>{op.away}</span>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t3)', fontSize: 11.5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon.ball size={12} color="var(--mint)"/><span>{op.league}</span>
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 50, background: 'var(--t4)' }}/>
          <span className="tnum">{op.date}</span>
          <span style={{ width: 3, height: 3, borderRadius: 50, background: 'var(--t4)' }}/>
          <span className="tnum">{op.time}</span>
          <span style={{ width: 3, height: 3, borderRadius: 50, background: 'var(--t4)' }}/>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="ofx-pulse-dot" style={{ width: 5, height: 5 }}/>
            Atualizado há {op.freshness}s
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <Badge tone="mint" size="md" leading={<Icon.trend size={10}/>}>{fmtPct(op.profit)} lucro</Badge>
          <Badge tone="neutral" size="md" leading={<Icon.shield size={10}/>}>{op.confidence === 'high' ? 'Alta confiança' : 'Risco baixo'}</Badge>
          {op.tag && <Badge tone="amber" size="md" leading={<Icon.flame size={10}/>}>{op.tag}</Badge>}
        </div>
      </div>

      {/* Retorno previsto block */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        padding: '10px 14px',
        background: 'var(--inner-2)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        minWidth: 184,
        position: 'relative',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
          Retorno previsto
        </span>
        <span className="tnum" style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', letterSpacing: -0.6, marginTop: 2 }}>
          {fmtBRL(op.retorno)}
        </span>
        <span className="tnum" style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginTop: 2 }}>
          +{fmtBRL(op.profitBRL)} líquido
        </span>
      </div>

      <button style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'linear-gradient(135deg, var(--green) 0%, var(--mint) 100%)',
        border: 0, cursor: 'pointer',
        display: 'grid', placeItems: 'center', flexShrink: 0,
        boxShadow: '0 4px 12px rgba(32,230,154,0.30), 0 0 0 1px rgba(141,255,199,0.40)',
        color: '#070A0F',
      }}>
        <Icon.chevRight size={16} color="#070A0F" stroke={2.2}/>
      </button>
    </div>
  );
}

function BookmakerTable({ op, compact }) {
  return (
    <div style={{ background: 'var(--inner-2)' }}>
      {/* header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr 96px 140px 88px',
        padding: '8px 20px',
        fontSize: 10, fontWeight: 700, color: 'var(--t3)',
        letterSpacing: 0.8, textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)',
      }}>
        <span>Casa</span>
        <span>Mercado</span>
        <span style={{ textAlign: 'right' }}>Odd</span>
        <span style={{ textAlign: 'right' }}>Apostar</span>
        <span style={{ textAlign: 'right' }}>Ações</span>
      </div>

      {op.legs.map((leg, i) => (
        <BookmakerRow key={i} leg={leg} last={i === op.legs.length - 1} compact={compact}/>
      ))}
    </div>
  );
}

function BookmakerRow({ leg, last, compact }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr 96px 140px 88px',
        alignItems: 'center',
        padding: compact ? '10px 20px' : '12px 20px',
        background: hover ? 'rgba(255,255,255,0.02)' : 'transparent',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        transition: 'background 120ms ease',
        position: 'relative',
      }}>
      {leg.isNew && <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
        background: 'var(--mint)',
        boxShadow: '0 0 10px var(--mint)',
      }}/>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BookmakerLogo name={leg.book} size={22}/>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{leg.book}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {leg.market}
        </span>
        <span style={{ fontSize: 10.5, color: 'var(--t3)', letterSpacing: 0.2 }}>{leg.breadcrumb}</span>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span className="tnum" style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 4,
          fontSize: 17, fontWeight: 700, color: 'var(--odds)',
          letterSpacing: -0.3,
          textShadow: '0 0 16px rgba(217,248,117,0.25)',
        }}>
          {leg.odd.toFixed(2)}
          {leg.isNew && <span style={{
            fontSize: 9, color: 'var(--mint)', fontWeight: 700,
            background: 'var(--mint-soft)', padding: '1px 4px', borderRadius: 3,
            letterSpacing: 0.4, textTransform: 'uppercase',
          }}>nova</span>}
        </span>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
          {fmtBRL(leg.stake)}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <button title="Copiar valor" style={rowBtn}><Icon.copy size={12} color="var(--t2)"/></button>
        <button title="Abrir casa" style={{ ...rowBtn,
          background: hover ? 'rgba(141,255,199,0.08)' : 'var(--card-2)',
          borderColor: hover ? 'rgba(141,255,199,0.30)' : 'var(--border)',
        }}>
          <Icon.external size={12} color={hover ? 'var(--mint)' : 'var(--t2)'}/>
        </button>
      </div>
    </div>
  );
}

const rowBtn = {
  width: 26, height: 26, borderRadius: 6,
  background: 'var(--card-2)',
  border: '1px solid var(--border)',
  display: 'grid', placeItems: 'center', cursor: 'pointer',
  transition: 'all 120ms ease',
};

function CardFooter({ op }) {
  return (
    <div style={{
      padding: '12px 20px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      borderTop: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.005)',
    }}>
      <FooterStat label="Stake total"     value={fmtBRL(op.stake)}                       />
      <FooterStat label="Lucro estimado"  value={'+' + fmtBRL(op.profitBRL)} valueColor="var(--green)"/>
      <FooterStat label="Margem"          value={op.margem.toFixed(2) + '%'}            />
      <FooterStat label="Status"          value="Mercados sincronizados" leading={<Icon.checkCirc size={11} color="var(--green)"/>} mono={false}/>
    </div>
  );
}

function FooterStat({ label, value, valueColor, leading, mono = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>{label}</span>
      <span className={mono ? 'tnum' : ''} style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 12.5, fontWeight: 600, color: valueColor || 'var(--t1)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {leading}{value}
      </span>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
function OddfixDesktop() {
  const [stake, setStake] = React.useState('3.000,00');
  const [options, setOptions] = React.useState(2);
  const [range, setRange] = React.useState([0, 30]);
  const [selectedBooks, setSelectedBooks] = React.useState(
    ['Bet365','Bet7k','Betano','Betfair','BetNacional','Blaze','EsportesDaSorte','EstrelaBet','Novibet','ParliMatch','Pinnacle','SportingBet','Stake','Superbet','VaideBet','KTO','1xBet']
  );
  const toggleBook = (b) => setSelectedBooks((sel) => sel.includes(b) ? sel.filter(x => x !== b) : [...sel, b]);

  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState('profit');
  const [view, setView] = React.useState('grid');
  const [density, setDensity] = React.useState('cozy');

  return (
    <div style={{
      width: 1920, height: 1080,
      background: 'radial-gradient(ellipse at 20% 0%, rgba(32,230,154,0.05) 0%, transparent 40%), var(--bg)',
      color: 'var(--t1)',
      fontFamily: 'var(--f-sans)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Topbar/>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          stake={stake} setStake={setStake}
          options={options} setOptions={setOptions}
          range={range} setRange={setRange}
          selectedBooks={selectedBooks} toggleBook={toggleBook}
        />

        <main className="ofx-scroll" style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          <PageHeader
            filter={filter} setFilter={setFilter}
            sort={sort} setSort={setSort}
            view={view} setView={setView}
            density={density} setDensity={setDensity}
          />

          <div style={{
            padding: '0 28px 28px',
            display: 'grid',
            gridTemplateColumns: view === 'grid' ? '1fr 1fr' : '1fr',
            gap: 16,
          }}>
            {OPPORTUNITIES.map((op, i) => (
              <OpportunityCard key={op.id} op={op} hot={i === 0} density={density}/>
            ))}
          </div>

          <div style={{ padding: '0 28px 28px', display: 'flex', justifyContent: 'center' }}>
            <button style={{
              padding: '10px 18px', fontSize: 12, fontWeight: 600,
              background: 'var(--card)', color: 'var(--t1)',
              border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--f-sans)',
            }}>
              <Icon.refresh size={12} color="var(--mint)"/>
              Aguardando novas oportunidades · 274 sinais monitorados
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

window.OddfixDesktop = OddfixDesktop;
