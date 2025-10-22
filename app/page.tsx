"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, Download, RotateCcw, Share2, Maximize2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import CodeEditor from "@/components/code-editor"
import OutputDisplay from "@/components/output-display"

export default function Home() {
  const [inputCode, setInputCode] = useState("")
  const [outputCode, setOutputCode] = useState("")
  const [loading, setLoading] = useState(false)

  const generateTests = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter C code first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: inputCode }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setOutputCode(data.result)
      toast({
        title: "Success",
        description: "Test cases generated successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputCode)
      toast({
        title: "Copied",
        description: "Code copied to clipboard!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = () => {
    const element = document.createElement("a")
    const file = new Blob([outputCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "generated_tests.c"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const clearAll = () => {
    setInputCode("")
    setOutputCode("")
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">main.c</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={generateTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Run"
              )}
            </Button>
            <span className="text-sm font-medium text-gray-700 ml-2">Output</span>
            <Button onClick={clearAll} variant="ghost" className="text-gray-600 hover:text-gray-900" size="sm">
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-[calc(100vh-60px)] flex">
        {/* Input Editor */}
        <div className="flex-1 border-r border-gray-200 flex flex-col">
          <CodeEditor value={inputCode} onChange={setInputCode} placeholder="Enter your C function here..." />
        </div>

        {/* Output Display */}
        <div className="flex-1 flex flex-col">
          <OutputDisplay code={outputCode} />
          {outputCode && (
            <div className="border-t border-gray-200 p-3 flex gap-2 bg-gray-50">
              <Button onClick={copyToClipboard} variant="outline" className="text-sm bg-transparent" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={downloadAsFile} variant="outline" className="text-sm bg-transparent" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
