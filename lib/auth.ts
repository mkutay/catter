import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import SpotifyProvider from 'next-auth/providers/spotify';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET as string,
    }),
  ],
});