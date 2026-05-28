import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please wait and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------- Email Generator ----------
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      purpose: z.string().min(1),
      audience: z.string().min(1),
      tone: z.string().min(1),
      details: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are an expert professional email writer. Write clear, concise, well-structured emails.
- Always include a Subject line on the first line as "Subject: ..."
- Match the requested tone exactly
- Tailor language to the specified audience
- Use proper greetings and sign-offs
- Keep paragraphs short
- Output ONLY the email (subject + body). No preamble, no commentary.`;
    const user = `Write an email with the following parameters:
Purpose: ${data.purpose}
Audience: ${data.audience}
Tone: ${data.tone}
${data.details ? `Additional details:\n${data.details}` : ""}`;
    return { content: await callAI(system, user) };
  });

// ---------- Meeting Notes Summarizer ----------
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(10) }))
  .handler(async ({ data }) => {
    const system = `You are an executive assistant who turns raw meeting notes into structured summaries.
Output Markdown with these exact sections in this order:
## Summary
A 2-3 sentence overview.
## Key Points
- Bullet list of the most important discussion points.
## Action Items
- [Owner] Task description — Deadline (or "TBD")
## Decisions
- Clear list of decisions made.
## Open Questions
- Anything unresolved.
Be precise, neutral, and concise. Do not invent details not present in the notes.`;
    const user = `Meeting notes:\n\n${data.notes}`;
    return { content: await callAI(system, user) };
  });

// ---------- Task Planner ----------
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1),
      timeframe: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a productivity coach who applies the Eisenhower Matrix and time-blocking.
Given a list of tasks, produce a Markdown plan:
## Prioritized Plan
A numbered list ordered by priority. For each task include:
- **Task** — priority label (P1 Urgent+Important, P2 Important, P3 Urgent, P4 Later)
- Estimated time
- Suggested time block (e.g. "Today 9:00–10:30")
- One-line rationale

## Focus Recommendation
2-3 sentences on what to tackle first and why.

Be realistic and concrete.`;
    const user = `Tasks:\n${data.tasks}\n\nTimeframe: ${data.timeframe || "Today"}`;
    return { content: await callAI(system, user) };
  });

// ---------- Research Assistant ----------
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ topic: z.string().min(2) }))
  .handler(async ({ data }) => {
    const system = `You are a senior research analyst. Produce a structured briefing in Markdown:
## Overview
3-4 sentence executive summary.
## Key Insights
- 5 bullets with specific, substantive insights.
## Trends & Drivers
- 3-4 bullets on what is changing and why.
## Opportunities
- 3 actionable opportunities for a professional.
## Risks & Considerations
- 3 risks or caveats.
## Suggested Next Steps
- 3 concrete next actions to deepen understanding.
Be accurate, neutral, and avoid speculation. Note when something is uncertain.`;
    const user = `Topic: ${data.topic}`;
    return { content: await callAI(system, user) };
  });

// ---------- Chatbot ----------
const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const chatComplete = createServerFn({ method: "POST" })
  .inputValidator(z.object({ messages: z.array(MessageSchema).min(1) }))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an AI workplace productivity assistant. Help professionals with writing, planning, summarizing, research, and decision-making. Be concise, friendly, and actionable. Use Markdown formatting when helpful.",
          },
          ...data.messages,
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please wait and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    return { content: json.choices?.[0]?.message?.content ?? "" };
  });
