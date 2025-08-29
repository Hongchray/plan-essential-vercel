"use client"

import { Label } from "@/components/ui/label"
import Editor from "@monaco-editor/react"

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  label,
}: {
  value?: string
  onChange?: (val: string | undefined) => void
  language?: string
  label?: string
}) {
  return (
    <div className="space-y-2">
        <Label  className="text-sm font-medium">
            {label}
        </Label>
        <div className="h-[400px] w-auto border rounded-md p-1">
            <Editor
                defaultLanguage={language}
                value={value}
                onChange={onChange}
                theme="vs"
                options={{
                fontSize: 10,
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",  
                scrollBeyondLastLine: false,
                automaticLayout: true,
                folding: true,
                }}
            />
        </div>
    </div>
  
  )
}
