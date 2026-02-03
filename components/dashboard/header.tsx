"use client";

import { OperationModal } from "./operation-modal";
import { AddAssetModal } from "./add-asset-modal";
import { LineChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userId?: string;
  onDataChange?: () => void;
  onUpdatePrices?: () => void;
  updatingPrices?: boolean;
  dolarBlue?: number | null;
}

export function DashboardHeader({ 
  userId, 
  onDataChange, 
  onUpdatePrices,
  updatingPrices,
  dolarBlue
}: DashboardHeaderProps) {
  return (
    <header className="border-border/50 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-success/10 rounded-lg p-2">
          <LineChart className="text-success size-6" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            FinTrack
          </h1>
          <p className="text-muted-foreground text-sm">
            Dashboard de Inversiones
            {dolarBlue && (
              <span className="ml-2 text-xs">
                | Dólar Blue: ${dolarBlue.toLocaleString("es-AR")}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {onUpdatePrices && (
          <Button 
            variant="outline" 
            onClick={onUpdatePrices}
            disabled={updatingPrices}
          >
            <RefreshCw className={`size-4 mr-2 ${updatingPrices ? 'animate-spin' : ''}`} />
            {updatingPrices ? "Actualizando..." : "Actualizar Precios"}
          </Button>
        )}
        {userId && onDataChange && (
          <AddAssetModal userId={userId} onAssetAdded={onDataChange} />
        )}
        <OperationModal
          onSubmit={(data) => {
            console.log("Nueva operacion:", data);
            if (onDataChange) onDataChange();
          }}
        />
      </div>
    </header>
  );
}
