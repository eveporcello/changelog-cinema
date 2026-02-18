import { createGateway } from "@ai-sdk/gateway";
import { Agent } from "undici";

export const gateway = createGateway({
  fetch: (url, init) =>
    fetch(url, {
      ...init,
      dispatcher: new Agent({
        headersTimeout: 15 * 60 * 1000,
        bodyTimeout: 15 * 60 * 1000,
      }),
    } as RequestInit),
});
