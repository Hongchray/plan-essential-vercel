"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QrReader } from "react-qr-reader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function FloatingQRButton() {
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <>
      <Button
        className="fixed bottom-20 right-6 rounded-full shadow-xl bg-primary hover:bg-primary/90 h-[80px] w-[80px] p-0 flex items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <QrCode className="h-10 w-10 text-white" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>

          {/* QR Scanner */}
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                setScanResult(result?.text);
              }
            }}
            videoContainerStyle={{ borderRadius: "12px" }}
          />

          {/* Or upload image */}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const result = await QrReader.scanFile(file);
                  if (result) setScanResult(result);
                }
              }}
            />
          </div>

          {scanResult && (
            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
              <strong>Scanned Result:</strong> {scanResult}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
