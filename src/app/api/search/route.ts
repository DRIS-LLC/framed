import db from "@/lib/db";
import { Response } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
// import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();

    const openai = new OpenAI({
      apiKey: (env as unknown as Env).OPENAI_API_KEY,
      baseURL: `${(env as unknown as Env).CLOUDFLARE_AI_URL}/openai`,
    });

    const { userId } = await auth();
    if (!userId) {
      return Response.error("Unauthorized", 401);
    }

    // const clerk = await clerkClient();
    // const user = await clerk.users.getUser(userId || "");

    const { query, schoolId } = (await request.json()) as { query: string; schoolId: string };
    if (!query) {
      return Response.error("Query is required");
    }

    // generate keywords from query using chatgpt
    // search for alumni profiles using keywords

    const alumniProfiles = await db().alumniProfile.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        name: true,
        title: true,
        company: true,
        location: true,
        linkedinProfileUrl: true,
        bio: true,
        skills: true,
        education: true,
        experience: true,
        embeddingVector: true,
      },
    });

    if (alumniProfiles.length === 0) {
      return Response.success([]);
    }

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
          content: `Query: "${query}"\n\nAlumni Profiles: ${JSON.stringify(alumniProfiles)}`,
        },
      ],
    });

    const results = JSON.parse(completion.choices[0].message.content || "{}");

    await db().searchQuery.create({
      data: {
        query,
        userId,
        results: JSON.stringify(results),
      },
    });

    return Response.success(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.error(error);
  }
}
