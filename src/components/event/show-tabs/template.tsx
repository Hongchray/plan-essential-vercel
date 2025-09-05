"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function TabTemplate() {

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
      <div className="h-[500px] border border-dashed rounded ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>One</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Two</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
