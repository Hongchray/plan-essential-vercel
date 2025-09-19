// Excel Import/Export Hook
import { useState } from "react";
import { toast } from "sonner";

export const useExcelOperations = (eventId: string) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportGiftList = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/admin/event/${eventId}/gift/export`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Export failed");
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `list-gift-${eventId}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Gift list exported successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export gift list"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportGiftList,
    isExporting,
    isImporting,
  };
};
