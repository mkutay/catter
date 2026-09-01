import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "@/env";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
      issuer: "https://github.com/login/oauth",
    }),
    DiscordProvider({
      clientId: env.DISCORD_OAUTH_CLIENT_ID,
      clientSecret: env.DISCORD_OAUTH_CLIENT_SECRET,
    }),
    SpotifyProvider({
      clientId: env.SPOTIFY_OAUTH_CLIENT_ID,
      clientSecret: env.SPOTIFY_OAUTH_CLIENT_SECRET,
    }),
  ],
  trustHost: true,
});
