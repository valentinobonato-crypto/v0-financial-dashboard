"use client";

import { OperationModal } from "./operation-modal";
import { LineChart } from "lucide-react";

export function DashboardHeader() {
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
      <OperationModal
        onSubmit={(data) => {
          console.log("Nueva operacion:", data);
        }}
      />
    </header>
  );
}
