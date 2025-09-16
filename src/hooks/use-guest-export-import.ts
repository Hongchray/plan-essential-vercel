// Excel Import/Export Hook
import { useState } from 'react';
import { toast } from 'sonner'; 

export const useExcelOperations = (eventId: string) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportGuestList = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/admin/event/${eventId}/guest/export`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guest-list-${eventId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Guest list exported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export guest list');
    } finally {
      setIsExporting(false);
    }
  };

  const importGuestList = async (file: File) => {
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('eventId', eventId);

      const response = await fetch(`/api/admin/event/${eventId}/guest/import`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      // Show detailed results
      const messages = [
        `Successfully imported ${result.imported} guests`,
        result.skipped > 0 ? `Skipped ${result.skipped} duplicates` : null,
      ].filter(Boolean);

      toast.success(messages.join(', '));

      if (result.errors && result.errors.length > 0) {
        console.warn('Import errors:', result.errors);
        // You might want to show these errors in a modal or detailed view
      }

      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import guest list');
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/event/${eventId}/guest/template`);
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      // Download template file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guest-import-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return {
    exportGuestList,
    importGuestList,
    downloadTemplate,
    isExporting,
    isImporting,
  };
};