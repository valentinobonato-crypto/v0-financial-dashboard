"use client";

import { OperationModal } from "./operation-modal";
import { AddAssetModal } from "./add-asset-modal";
import { LineChart } from "lucide-react";

interface DashboardHeaderProps {
  userId?: string;
  onDataChange?: () => void;
}

export function DashboardHeader({ userId, onDataChange }: DashboardHeaderProps) {
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
          </p>
        </div>
      </div>
      <div className="flex gap-2">
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
