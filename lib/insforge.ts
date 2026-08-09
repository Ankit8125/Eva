import { createClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;

if (!baseUrl) {
  throw new Error(
    "NEXT_PUBLIC_INSFORGE_URL is missing. Copy .env.example to .env.local and add your InsForge endpoint."
  );
}

export const insforge = createClient({ baseUrl });
