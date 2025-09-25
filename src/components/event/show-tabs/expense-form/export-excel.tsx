// Excel Import Modal Component
import React, { useRef, useState } from "react";
import { Upload, Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useExcelOperations } from "@/hooks/use-expense-export-import";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ExcelImportModalProps {
  eventId: string;
  onImportComplete?: () => void;
  trigger?: React.ReactNode;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  eventId,
  onImportComplete,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useTranslation("common");

  const { importExpensetList, downloadTemplate, isImporting } =
    useExcelOperations(eventId);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      await importExpensetList(selectedFile);
      setIsOpen(false);
      setSelectedFile(null);
      onImportComplete?.();
      router.refresh();
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {t("component.export-excel.upload")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("component.export-excel.title")}</DialogTitle>
          <DialogDescription>
            {t("component.export-excel.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">
                {t("component.export-excel.need_template")}
              </span>{" "}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <Download className="h-4 w-4 mr-1" />
              {t("component.export-excel.download")}
            </Button>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-700">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {t("component.export-excel.drop_file")}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {t("component.export-excel.browse")}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer"
          >
            <X />
            {t("component.export-excel.cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="cursor-pointer"
          >
            {isImporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {t("component.export-excel.importing")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("component.export-excel.import")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
