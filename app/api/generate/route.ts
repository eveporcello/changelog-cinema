import { experimental_generateVideo as generateVideo } from "ai";
import { gateway } from "@/lib/gateway";

export const maxDuration = 600;

export async function POST(req: Request) {
  const { changelog } = await req.json();

  const { video } = await generateVideo({
    model: gateway.video("google/veo-3.1-generate-001"),
    prompt: `Cinematic, dramatic scene that literally and visually depicts: "${changelog}".
Interpret any developer jargon as literally as possible.
For example, "race condition" should show an actual race, "migration" should show an actual migration of animals or people.
Movie trailer style. Epic lighting. Slow motion. No text or words on screen.`,
    aspectRatio: "16:9",
  });

  return Response.json({ video: video.base64 });
}
