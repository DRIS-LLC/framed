import { Response } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { OpenAI } from "openai";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.error("Unauthorized", 401);
    }

    const { env } = getRequestContext();

    const openai = new OpenAI({
      apiKey: (env as unknown as Env).OPENAI_API_KEY,
      baseURL: `${(env as unknown as Env).CLOUDFLARE_AI_URL}/openai`,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping to match LinkedIn alumni profiles with user queries.
          The user will provide a search query, and you will analyze the alumni profiles to find the best matches.
          Return the top 5 matching profiles in JSON format with their IDs and a brief explanation of why they match.
          The profiles should be sorted by relevance to the query.`,
        },
        {
          role: "user",
          content: `Query: "I'm looking for a software engineer with experience in React and Node.js."`,
        },
      ],
    });

    const results = JSON.parse(completion.choices[0].message.content || "{}");

    return Response.success(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.error(error);
  }
}
