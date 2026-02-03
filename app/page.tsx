"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PositionsTable, type Position } from "@/components/dashboard/positions-table";

export default function Dashboard() {
  // Estados para guardar los datos
  const [positions, setPositions] = useState<Position[]>([]);
  const [kpiData, setKpiData] = useState({
    totalValue: 0,
    pnl: 0,
    pnlPercentage: 0,
    annualizedReturn: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos cuando se abre la página
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Cargar posiciones desde Supabase
        const { data: holdings, error } = await supabase
          .from("portfolio_holdings")
          .select(`
            *,
            asset:assets(*)
          `);

        if (error) {
          console.error("Error cargando holdings:", error);
          return;
        }

        // 2. Transformar datos para la tabla
        const positionsData: Position[] = (holdings || []).map((holding: any) => ({
          id: holding.id,
          ticker: holding.asset?.symbol || "N/A",
          name: holding.asset?.name || "Sin nombre",
          quantity: Number(holding.total_quantity),
          avgPurchasePrice: Number(holding.average_cost),
          currentPrice: Number(holding.asset?.current_price) || 0,
        }));

        setPositions(positionsData);

        // 3. Calcular KPIs
        let totalValue = 0;
        let totalInvested = 0;

        positionsData.forEach((pos) => {
          totalValue += pos.quantity * pos.currentPrice;
          totalInvested += pos.quantity * pos.avgPurchasePrice;
        });

        const pnl = totalValue - totalInvested;
        const pnlPercentage = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

        setKpiData({
          totalValue,
          pnl,
          pnlPercentage,
          annualizedReturn: pnlPercentage, // Simplificado por ahora
        });

        // 4. Cargar historial para el gráfico
        const { data: history } = await supabase
          .from("portfolio_history")
          .select("*")
          .order("recorded_at", { ascending: true })
          .limit(12);

        if (history && history.length > 0) {
          const chartDataFormatted = history.map((h: any) => ({
            date: new Date(h.recorded_at).toLocaleDateString("es", { month: "short" }),
            value: Number(h.total_value),
          }));
          setChartData(chartDataFormatted);
        }

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando datos...</p>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader />
          <KPICards data={kpiData} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PortfolioChart data={chartData} />
            <PositionsTable positions={positions} />
          </div>
        </div>
      </div>
    </main>
  );
}
