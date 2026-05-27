import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { SurebetCard } from "../components/dashboard/SurebetCard";
import { LIVE_SUREBETS, Surebet } from "../components/dashboard/mockData";
import { FilterState } from "../components/layout/Sidebar";
import { SurebetDetailModal } from "./PlatformPage";

interface OutletContextType {
  appliedFilters: FilterState;
  activeTab: "prelive" | "live";
}

export function LivePage() {
  const { appliedFilters } = useOutletContext<OutletContextType>();
  const [selectedCard, setSelectedCard] = useState<Surebet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...LIVE_SUREBETS];

    data = data.filter((s) => s.legs.length === appliedFilters.options);

    data = data.filter(
      (s) =>
        s.profitPct >= appliedFilters.profitRange[0] &&
        s.profitPct <= appliedFilters.profitRange[1]
    );

    if (appliedFilters.selectedBookies.length === 0) {
      data = [];
    } else {
      data = data.filter((s) =>
        s.legs.some((leg) => appliedFilters.selectedBookies.includes(leg.bookmaker))
      );
    }

    if (appliedFilters.sortBy === "profit") {
      data.sort((a, b) => b.profitPct - a.profitPct);
    } else if (appliedFilters.sortBy === "recent") {
      data.reverse();
    }

    return data;
  }, [appliedFilters]);

  const handleCardClick = (surebet: Surebet) => {
    setSelectedCard(surebet);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Sinais Ao Vivo
          </h1>

          {/* Live badge */}
          <div
            className="flex items-center gap-2 px-3 rounded-full"
            style={{
              backgroundColor: "#2c2f34",
              height: "24px",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full shrink-0"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#43e5b1",
                boxShadow: "0 0 8px rgba(67,229,177,0.7)",
                display: "block",
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                color: "#8bf2c1",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              AO VIVO
            </span>
          </div>

          <span
            className="px-3 rounded-full flex items-center"
            style={{
              backgroundColor: "rgba(139,242,193,0.08)",
              border: "1px solid rgba(139,242,193,0.25)",
              height: "24px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#8bf2c1",
            }}
          >
            {filteredData.length} oportunidades
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#71717a",
            }}
          >
            Atualizado agora
          </span>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#43e5b1",
              display: "inline-block",
            }}
          />
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="sync">
          {filteredData.length > 0 ? (
            filteredData.map((surebet, index) => (
              <SurebetCard
                key={surebet.id}
                surebet={surebet}
                index={index}
                isLive
                onClick={handleCardClick}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center rounded-xl py-16"
              style={{
                backgroundColor: "#15181e",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "32px", marginBottom: "12px" }}>📡</span>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                Nenhum sinal ao vivo encontrado
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#71717a",
                }}
              >
                Ajuste os filtros para ver mais sinais
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedCard && (
          <SurebetDetailModal
            surebet={selectedCard}
            onClose={() => setIsDetailOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
