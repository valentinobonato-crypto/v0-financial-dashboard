"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Pencil } from "lucide-react";

export interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgPurchasePrice: number;
  currentPrice: number;
  assetId?: string;
}

interface PositionsTableProps {
  positions: Position[];
  onPriceUpdate?: () => void;
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

export function PositionsTable({ positions, onPriceUpdate }: PositionsTableProps) {
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSavePrice() {
    if (!editingPosition?.assetId || !newPrice) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("assets")
        .update({ 
          current_price: parseFloat(newPrice),
          last_updated: new Date().toISOString()
        })
        .eq("id", editingPosition.assetId);

      if (error) {
        console.error("Error actualizando precio:", error);
        alert("Error al guardar el precio");
        return;
      }

      setEditingPosition(null);
      setNewPrice("");
      if (onPriceUpdate) onPriceUpdate();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
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
                <TableHead className="text-muted-foreground font-medium w-12">
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPosition(position);
                          setNewPrice(position.currentPrice.toString());
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para editar precio */}
      <Dialog open={!!editingPosition} onOpenChange={() => setEditingPosition(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Editar precio de {editingPosition?.ticker}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nuevo precio (ARS)</label>
              <Input
                type="number"
                step="any"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Ej: 15000.50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingPosition(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePrice} disabled={saving || !newPrice}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
