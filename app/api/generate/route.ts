import { experimental_generateVideo as generateVideo } from "ai";
import { gateway } from "@/lib/gateway";

export const maxDuration = 600;

export async function POST(req: Request) {
  const { dream } = await req.json();

  const { video } = await generateVideo({
    model: gateway.videoModel("google/veo-3.1-generate-001"),
    prompt: `Surreal, dreamlike cinematic scene depicting: "${dream}".
The main character is a medium-height, athletic light-skinned mixed-race man with a broad build, short curly afro hair, striking blue eyes, and a big warm smile.
This is a dream sequence — embrace impossible physics, shifting environments, and strange juxtapositions.
Soft, hazy lighting. Slow, fluid camera movements. Ethereal atmosphere.
Things can morph, scale can shift, locations can blend into each other.
No text or words on screen. Dreamlike color grading.`,
    aspectRatio: "16:9",
  });

  return Response.json({ video: video.base64 });
}
