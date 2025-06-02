# MediaDrop

MediaDrop is a self-hosted solution for letting your players upload images or videos directly to your own object storage.

---

## Discord Authentication (Optional)

If you want to restrict uploads to users with a specific role in your Discord server, you can enable Discord authentication. No database is required—sessions are managed with secure cookies.

### How it works
- If the Discord environment variables are set, users will be required to sign in with Discord and have the specified role to access the app.
- The middleware automatically redirects unauthenticated users to the login page.
- If Discord auth is not configured, the app is open to everyone.

### Required Environment Variables
Add these to your `.env` file:

```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/auth/discord-callback
DISCORD_GUILD_ID=your_discord_guild_id
DISCORD_ROLE_ID=the_required_role_id
SESSION_PASSWORD=complex_password_at_least_32_characters
SESSION_COOKIE_NAME=mediadrop_discord_session
```

- `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`: From your Discord Developer Portal.
- `DISCORD_REDIRECT_URI`: Should match your deployed domain and Discord app settings.
- `DISCORD_GUILD_ID`: Your Discord server's ID.
- `DISCORD_ROLE_ID`: The role ID required for access.
- `SESSION_PASSWORD`: A strong, random string (32+ chars) for session encryption.
- `SESSION_COOKIE_NAME`: (Optional) Name for the session cookie.

### What happens when enabled?
- Users are redirected to `/login` and must sign in with Discord.
- Only users with the required role in your server can access uploads.
- All session data is stored in a secure, encrypted cookie (no database needed).

---

## Environment variables:

- `STORAGE_PROVIDER`:
  - Values can be "r2" or "s3"
- `STORAGE_BUCKET`
- `STORAGE_ACCESS_KEY_ID`
- `STORAGE_SECRET_ACCESS_KEY`
- `STORAGE_PUBLIC_URL`
  - This is your domain connected to the bucket. Example: `https://i.yourdomain.com`
- `STORAGE_ENDPOINT`
- `STORAGE_REGION`
- `MAX_FILE_SIZE`
  - Optional. Set the maximum allowed file upload size (e.g., `100mb`, `20mb`, `1gb`). Defaults to 100mb if not set.

### Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffivemanage%2Fmediadrop&env=STORAGE_PROVIDER,STORAGE_BUCKET,STORAGE_ACCESS_KEY_ID,STORAGE_SECRET_ACCESS_KEY,STORAGE_PUBLIC_URL,STORAGE_ENDPOINT,STORAGE_REGION,DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET,DISCORD_REDIRECT_URI,DISCORD_GUILD_ID,DISCORD_ROLE_ID,SESSION_PASSWORD,SESSION_COOKIE_NAME&project-name=mediadrop)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fivemanage/mediadrop)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/fivemanage/mediadrop)
