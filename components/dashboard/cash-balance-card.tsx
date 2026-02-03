"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, Pencil } from "lucide-react";

interface CashBalanceCardProps {
  amount: number;
  userId: string;
  onUpdate: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

export function CashBalanceCard({ amount, userId, onUpdate }: CashBalanceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(amount.toString());
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("cash_balance")
        .update({ 
          amount: parseFloat(newAmount),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .eq("currency", "ARS");

      if (error) {
        console.error("Error actualizando efectivo:", error);
        alert("Error al guardar");
        return;
      }

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Efectivo Disponible
              </p>
              <p className="text-foreground text-2xl font-bold tracking-tight">
                {formatCurrency(amount)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewAmount(amount.toString());
                  setIsEditing(true);
                }}
              >
                <Pencil className="size-4" />
              </Button>
              <div className="bg-secondary rounded-lg p-3">
                <Banknote className="text-muted-foreground size-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar efectivo disponible</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto (ARS)</label>
              <Input
                type="number"
                step="any"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Ej: 500000"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving || !newAmount}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
