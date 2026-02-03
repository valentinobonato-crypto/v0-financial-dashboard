"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddAssetModalProps {
  userId: string;
  onAssetAdded: () => void;
}

export function AddAssetModal({ userId, onAssetAdded }: AddAssetModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "stock",
    quantity: "",
    avgPrice: "",
    currentPrice: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear el activo
      const { data: asset, error: assetError } = await supabase
        .from("assets")
        .insert({
          symbol: formData.symbol.toUpperCase(),
          name: formData.name,
          type: formData.type,
          current_price: parseFloat(formData.currentPrice),
          currency: "USD",
        })
        .select()
        .single();

      if (assetError) {
        console.error("Error creando activo:", assetError);
        alert("Error: " + assetError.message);
        return;
      }

      // 2. Crear el holding
      const quantity = parseFloat(formData.quantity);
      const avgPrice = parseFloat(formData.avgPrice);

      const { error: holdingError } = await supabase
        .from("portfolio_holdings")
        .insert({
          user_id: userId,
          asset_id: asset.id,
          total_quantity: quantity,
          average_cost: avgPrice,
          total_invested: quantity * avgPrice,
        });

      if (holdingError) {
        console.error("Error creando holding:", holdingError);
        alert("Error: " + holdingError.message);
        return;
      }

      // 3. Registrar la transacción
      await supabase.from("transactions").insert({
        user_id: userId,
        asset_id: asset.id,
        type: "buy",
        quantity: quantity,
        price_per_unit: avgPrice,
        total_amount: quantity * avgPrice,
      });

      // 4. Limpiar y cerrar
      setFormData({
        symbol: "",
        name: "",
        type: "stock",
        quantity: "",
        avgPrice: "",
        currentPrice: "",
      });
      setOpen(false);
      onAssetAdded(); // Recargar datos

    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Agregar Activo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo activo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Símbolo</Label>
              <Input
                id="symbol"
                placeholder="BTC, AAPL, ETH..."
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="stock">Acción</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="bond">Bono</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Bitcoin, Apple Inc., Ethereum..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="0.5"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Precio promedio compra ($)</Label>
              <Input
                id="avgPrice"
                type="number"
                step="any"
                placeholder="45000.00"
                value={formData.avgPrice}
                onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPrice">Precio actual ($)</Label>
            <Input
              id="currentPrice"
              type="number"
              step="any"
              placeholder="67500.00"
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
