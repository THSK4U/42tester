import { type NextRequest, NextResponse } from "next/server"

// Expected output: A complete, compilable C code string containing:
// - All necessary #include statements
// - A complete int main(void) function with comprehensive test cases
// - Test cases covering normal cases, edge cases, and error cases
// - Clear comments and organized printf statements for test output
// - No explanations, notes, or markdown formatting - only valid C code

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://v0.app",
        "X-Title": "C Code Tester",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert C programmer and testing engineer. Create a complete int main(void) function that thoroughly tests the provided C code. Include test cases for normal cases, edge cases, and error cases. Add clear comments and organized printf statements. The output must be valid, compilable C code.",
          },
          {
            role: "user",
            content: `Generate comprehensive test cases for this C code:\n\n${code}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] OpenRouter error response:", errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    let result = data.choices?.[0]?.message?.content || "No response"

    // Look for code blocks first (\`\`\`c ... \`\`\`)
    const codeBlockMatch = result.match(/```c\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      result = codeBlockMatch[1]
    } else {
      // If no code block, try to extract from the first #include or int main onwards
      const codeStart = result.search(/#include|int\s+main/)
      if (codeStart !== -1) {
        result = result.substring(codeStart)
      }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate tests" },
      { status: 500 },
    )
  }
}
