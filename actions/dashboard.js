"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights ONLY in this JSON format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT:
    - Return ONLY the JSON (no backticks, no markdown).
    - Include at least 5 salary roles.
    - Growth rate must be a percentage number.
    - Include at least 5 skills + 5 trends.
  `;

  try {
    const model = client.model("text-bison-001");
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    // clean formatting
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Error:", err);
    throw new Error("AI generation failed: " + err.message);
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);
    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return industryInsight;
  }

  return user.industryInsight;
}
