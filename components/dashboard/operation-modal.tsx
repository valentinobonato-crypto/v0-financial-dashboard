"use client";

import React from "react"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const AVAILABLE_ASSETS = [
  { value: "AAPL", label: "AAPL - Apple Inc." },
  { value: "GOOGL", label: "GOOGL - Alphabet Inc." },
  { value: "MSFT", label: "MSFT - Microsoft Corp." },
  { value: "AMZN", label: "AMZN - Amazon.com Inc." },
  { value: "TSLA", label: "TSLA - Tesla Inc." },
  { value: "NVDA", label: "NVDA - NVIDIA Corp." },
  { value: "META", label: "META - Meta Platforms" },
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
];

interface OperationFormData {
  asset: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
}

interface OperationModalProps {
  onSubmit?: (data: OperationFormData) => void;
}

export function OperationModal({ onSubmit }: OperationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<OperationFormData>({
    asset: "",
    type: "buy",
    quantity: 0,
    price: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setOpen(false);
    setFormData({
      asset: "",
      type: "buy",
      quantity: 0,
      price: 0,
    });
  };

  const isFormValid =
    formData.asset && formData.quantity > 0 && formData.price > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-success hover:bg-success/90 text-success-foreground gap-2">
          <Plus className="size-4" />
          Registrar Operacion
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            Nueva Operacion
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="asset" className="text-foreground">
              Activo
            </Label>
            <Select
              value={formData.asset}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, asset: value }))
              }
            >
              <SelectTrigger
                id="asset"
                className="border-border bg-secondary text-foreground w-full"
              >
                <SelectValue placeholder="Seleccionar activo" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {AVAILABLE_ASSETS.map((asset) => (
                  <SelectItem
                    key={asset.value}
                    value={asset.value}
                    className="text-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">
              Tipo de Operacion
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: "buy" | "sell") =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger
                id="type"
                className="border-border bg-secondary text-foreground w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem
                  value="buy"
                  className="text-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-success size-2 rounded-full" />
                    Compra
                  </span>
                </SelectItem>
                <SelectItem
                  value="sell"
                  className="text-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-danger size-2 rounded-full" />
                    Venta
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-foreground">
                Cantidad
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                className="border-border bg-secondary text-foreground"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Precio (USD)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                className="border-border bg-secondary text-foreground"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {formData.asset && formData.quantity > 0 && formData.price > 0 && (
            <div className="bg-secondary/50 border-border rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Total de la operacion</p>
              <p className="text-foreground text-lg font-semibold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "USD",
                }).format(formData.quantity * formData.price)}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`${
                formData.type === "buy"
                  ? "bg-success hover:bg-success/90 text-success-foreground"
                  : "bg-danger hover:bg-danger/90 text-danger-foreground"
              }`}
            >
              {formData.type === "buy" ? "Comprar" : "Vender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
