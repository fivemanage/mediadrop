import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, DiscordSessionUser } from "@/lib/session";
import { getIronSession } from "iron-session";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Failed to get token" }, { status: 401 });
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch user info
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) {
    return NextResponse.json(
      { error: "Failed to get user info" },
      { status: 401 },
    );
  }
  const user = await userRes.json();

  // Fetch guild member info
  const guildId = process.env.DISCORD_GUILD_ID!;
  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${guildId}/member`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!memberRes.ok) {
    return NextResponse.json(
      { error: "Not a member of the required guild" },
      { status: 403 },
    );
  }
  const member = await memberRes.json();
  const requiredRole = process.env.DISCORD_ROLE_ID!;
  const hasRole = member.roles && member.roles.includes(requiredRole);
  if (!hasRole) {
    return NextResponse.json(
      { error: "Missing required role" },
      { status: 403 },
    );
  }

  // Set session using cookies
  const res = NextResponse.redirect(new URL("/", req.url));
  // @ts-ignore
  const session = await getIronSession(req, res, sessionOptions);
  (session as { user?: DiscordSessionUser }).user = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    discriminator: user.discriminator,
    accessToken,
    roles: member.roles,
  };
  await session.save();
  return res;
}

