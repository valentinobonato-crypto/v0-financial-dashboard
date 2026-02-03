import { DashboardHeader } from "@/components/dashboard/header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PositionsTable, type Position } from "@/components/dashboard/positions-table";

// Sample data for the dashboard
const kpiData = {
  totalValue: 125847.32,
  pnl: 18432.56,
  pnlPercentage: 17.16,
  annualizedReturn: 24.35,
};

const chartData = [
  { date: "Ene", value: 95000 },
  { date: "Feb", value: 98500 },
  { date: "Mar", value: 94200 },
  { date: "Abr", value: 102300 },
  { date: "May", value: 108700 },
  { date: "Jun", value: 105400 },
  { date: "Jul", value: 112800 },
  { date: "Ago", value: 118500 },
  { date: "Sep", value: 115200 },
  { date: "Oct", value: 120100 },
  { date: "Nov", value: 123400 },
  { date: "Dic", value: 125847 },
];

const positions: Position[] = [
  {
    id: "1",
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 150,
    avgPurchasePrice: 142.50,
    currentPrice: 178.25,
  },
  {
    id: "2",
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 45,
    avgPurchasePrice: 98.75,
    currentPrice: 141.80,
  },
  {
    id: "3",
    ticker: "MSFT",
    name: "Microsoft Corp.",
    quantity: 80,
    avgPurchasePrice: 285.00,
    currentPrice: 378.50,
  },
  {
    id: "4",
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    quantity: 25,
    avgPurchasePrice: 450.00,
    currentPrice: 875.30,
  },
  {
    id: "5",
    ticker: "TSLA",
    name: "Tesla Inc.",
    quantity: 60,
    avgPurchasePrice: 265.00,
    currentPrice: 248.50,
  },
  {
    id: "6",
    ticker: "BTC",
    name: "Bitcoin",
    quantity: 0.5,
    avgPurchasePrice: 42000.00,
    currentPrice: 67500.00,
  },
];

export default function Dashboard() {
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
