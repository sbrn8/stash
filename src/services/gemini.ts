import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const PROMPT = `
You are helping a user save something interesting.
Extract and return ONLY a JSON object with these exact fields:
{
  "title": "name of the place, product, or activity",
  "description": "one sentence about it",
  "category": "one of: Restaurants, Travel, Fitness, Products",
  "location": {
    "name": "city and country if applicable, otherwise null",
    "lat": null,
    "lng": null
  },
  "ai_summary": "why this might be worth doing or visiting",
  "tags": ["tag1", "tag2", "tag3"]
}
Return only the JSON. No markdown, no backticks, no explanation.
`

function parseResponse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  }
}

export async function extractFromLink(url: string) {
  const result = await model.generateContent(
    `${PROMPT}\n\nURL to extract from: ${url}`
  )
  return parseResponse(result.response.text())
}

export async function extractFromScreenshot(base64Image: string, mimeType: string) {
  const result = await model.generateContent([
    PROMPT,
    {
      inlineData: {
        mimeType,
        data: base64Image
      }
    }
  ])
  return parseResponse(result.response.text())
}