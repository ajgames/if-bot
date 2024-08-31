import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const client = new OpenAI();

export function checkEmailImportance({ subject }: { subject: string }) {
  return respond(`Subject: ${subject}`);
}

z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

export async function respond(content: string) {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an executive assistant responsible for prioritizing emails. Evaluate the email.",
      },
      { role: "user", content },
    ],
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(
      z.object({
        importance: z.number(),
        urgency: z.number(),
        reason: z.string(),
        notifyImmediately: z.boolean()
      }),
      "EmailPriority"
    ),
  });
  
  return JSON.parse(chatCompletion?.choices[0]?.message?.content || '{}');
}
