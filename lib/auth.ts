import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
    }),
  ],
});