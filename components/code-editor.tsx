"use client"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

export default function CodeEditor({ value, onChange, placeholder, readOnly = false }: CodeEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full h-full p-4 font-mono text-sm border-0 bg-white text-gray-900 resize-none focus:outline-none focus:ring-0 placeholder-gray-400"
      spellCheck="false"
    />
  )
}
