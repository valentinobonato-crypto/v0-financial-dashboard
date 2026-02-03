"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";

interface KPIData {
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
  annualizedReturn: number;
}

interface KPICardsProps {
  data: KPIData;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function KPICards({ data }: KPICardsProps) {
  const isPositive = data.pnl >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Valor Total
              </p>
              <p className="text-foreground text-2xl font-bold tracking-tight">
                {formatCurrency(data.totalValue)}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Wallet className="text-muted-foreground size-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Ganancia/Perdida
              </p>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {formatCurrency(data.pnl)}
              </p>
            </div>
            <div
              className={`rounded-lg p-3 ${
                isPositive ? "bg-success/10" : "bg-danger/10"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="text-success size-5" />
              ) : (
                <TrendingDown className="text-danger size-5" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">P&L %</p>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {formatPercentage(data.pnlPercentage)}
              </p>
            </div>
            <div
              className={`rounded-lg p-3 ${
                isPositive ? "bg-success/10" : "bg-danger/10"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="text-success size-5" />
              ) : (
                <TrendingDown className="text-danger size-5" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Rendimiento Anual
              </p>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  data.annualizedReturn >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatPercentage(data.annualizedReturn)}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <BarChart3 className="text-muted-foreground size-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
