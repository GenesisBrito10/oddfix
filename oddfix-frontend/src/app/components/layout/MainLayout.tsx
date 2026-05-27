import { useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import { Header } from "./Header";
import { Sidebar, FilterState, DEFAULT_FILTERS } from "./Sidebar";
import { AffiliateSidebar } from "./AffiliateSidebar";
import { MobileDrawer } from "./MobileDrawer";
import { BottomNav } from "./BottomNav";
import { FilterBottomSheet } from "./FilterBottomSheet";
import { MaisBottomSheet } from "./MaisBottomSheet";

export function MainLayout() {
  const [preLiveFilters, setPreLiveFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedPreLiveFilters, setAppliedPreLiveFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [liveFilters, setLiveFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedLiveFilters, setAppliedLiveFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [maisSheetOpen, setMaisSheetOpen] = useState(false);
  const { pathname } = useLocation();

  const isAffiliate = pathname.startsWith("/afiliados") || pathname === "/account";
  const activeTab: "prelive" | "live" = pathname === "/live" ? "live" : "prelive";
  const isLiveMode = activeTab === "live";
  const mode: "pre-live" | "live" = isLiveMode ? "live" : "pre-live";

  const filters = isLiveMode ? liveFilters : preLiveFilters;
  const setFilters = isLiveMode ? setLiveFilters : setPreLiveFilters;
  const appliedFilters = isLiveMode ? appliedLiveFilters : appliedPreLiveFilters;

  const handleApplyFilters = () => {
    if (isLiveMode) {
      setAppliedLiveFilters(liveFilters);
    } else {
      setAppliedPreLiveFilters(preLiveFilters);
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
    if (appliedFilters.options !== DEFAULT_FILTERS.options) count++;
    if (
      appliedFilters.profitRange[0] !== DEFAULT_FILTERS.profitRange[0] ||
      appliedFilters.profitRange[1] !== DEFAULT_FILTERS.profitRange[1]
    ) count++;
    if (appliedFilters.selectedBookies.length !== DEFAULT_FILTERS.selectedBookies.length) count++;
    count += appliedFilters.disabledMarkets.length;
    if (isLiveMode && appliedFilters.profitDecayTolerance !== DEFAULT_FILTERS.profitDecayTolerance) count++;
    return count;
  }, [appliedFilters, isLiveMode]);

  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", backgroundColor: "#080b0f", overflow: "hidden" }}
    >
      <Header
        signalCount={274}
        onMenuOpen={() => setMobileMenuOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {isAffiliate ? (
          <AffiliateSidebar />
        ) : (
          <Sidebar
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            mode={mode}
          />
        )}
        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-0"
          style={{ backgroundColor: "#080b0f" }}
        >
          <Outlet context={{ appliedFilters, activeTab }} />
        </main>
      </div>

      <BottomNav
        signalCount={274}
        onFilterOpen={() => setFilterSheetOpen(true)}
        onMaisOpen={() => setMaisSheetOpen(true)}
      />

      {/* Floating filter button — mobile only, platform mode */}
      {!isAffiliate && (
        <button
          className="fixed md:hidden flex items-center gap-2"
          onClick={() => setFilterSheetOpen(true)}
          style={{
            bottom: "calc(64px + env(safe-area-inset-bottom) + 12px)",
            right: "16px",
            zIndex: 35,
            backgroundColor: "#15181e",
            border: "1px solid #8bf2c1",
            borderRadius: "4px",
            color: "#8bf2c1",
            padding: "10px 16px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <SlidersHorizontal size={15} />
          Filtrar
          {activeFilterCount > 0 && (
            <span
              style={{
                backgroundColor: "#8bf2c1",
                color: "#080b0f",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAffiliate={isAffiliate}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        mode={mode}
      />

      <FilterBottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        mode={mode}
      />

      <MaisBottomSheet
        isOpen={maisSheetOpen}
        onClose={() => setMaisSheetOpen(false)}
      />
    </div>
  );
}
