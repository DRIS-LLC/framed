// import { Hyperbrowser } from "@hyperbrowser/sdk";
// import { z } from "zod";

// const client = new Hyperbrowser({
//   apiKey: (env as unknown as CloudflareEnv).HYPERBROWSER_API_KEY,
// });

// const main = async () => {
//   const schema = z.object({
//     productName: z.string(),
//     productOverview: z.string(),
//     keyFeatures: z.array(z.string()),
//     pricing: z.array(
//       z.object({
//         plan: z.string(),
//         price: z.string(),
//         features: z.array(z.string()),
//       })
//     ),
//   });

//   const result = await client.extract.startAndWait({
//     urls: ["https://hyperbrowser.ai"],
//     prompt:
//       "Extract the product name, an overview of the product, its key features, and a list of its pricing plans from the page.",
//     schema: schema,
//   });

//   console.log("result", JSON.stringify(result, null, 2));
// };

// main();
