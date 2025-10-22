"use client"

import CodeEditor from "./code-editor"

interface OutputDisplayProps {
  code: string
}

export default function OutputDisplay({ code }: OutputDisplayProps) {
  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 border-0">
        <p className="text-gray-400 text-sm">Generated test cases will appear here</p>
      </div>
    )
  }

  return <CodeEditor value={code} onChange={() => {}} readOnly={true} />
}
