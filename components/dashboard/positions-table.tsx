"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgPurchasePrice: number;
  currentPrice: number;
}

interface PositionsTableProps {
  positions: Position[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">
          Posiciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Ticker
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Cantidad
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Precio Promedio
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Precio Actual
              </TableHead>
              <TableHead className="text-muted-foreground text-right font-medium">
                P&L
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => {
              const pnl =
                (position.currentPrice - position.avgPurchasePrice) *
                position.quantity;
              const pnlPercentage =
                ((position.currentPrice - position.avgPurchasePrice) /
                  position.avgPurchasePrice) *
                100;
              const isPositive = pnl >= 0;

              return (
                <TableRow
                  key={position.id}
                  className="border-border/50 hover:bg-secondary/50"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {position.ticker}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {position.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatNumber(position.quantity)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(position.avgPurchasePrice)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(position.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-medium ${
                            isPositive ? "text-success" : "text-danger"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {formatCurrency(pnl)}
                        </span>
                        <span
                          className={`text-xs ${
                            isPositive ? "text-success/80" : "text-danger/80"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {pnlPercentage.toFixed(2)}%
                        </span>
                      </div>
                      {isPositive ? (
                        <TrendingUp className="text-success size-4" />
                      ) : (
                        <TrendingDown className="text-danger size-4" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
