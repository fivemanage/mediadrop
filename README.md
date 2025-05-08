# MediaDrop

MediaDrop is a self-hosted solution for letting your players upload images or videos directly to your own object storage.

### Environment variables:

- `STORAGE_PROVIDER`:
  - Values can be "r2" or "s3"
- `STORAGE_BUCKET`
- `STORAGE_ACCESS_KEY_ID`
- `STORAGE_SECRET_ACCESS_KEY`
- `STORAGE_PUBLIC_URL`
  - This is your domain connected to the bucket. Example: `https://i.yourdomain.com`
- `STORAGE_ENDPOINT`
- `STORAGE_REGION`

### Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffivemanage%2Fmediadrop&env=STORAGE_PROVIDER,STORAGE_BUCKET,STORAGE_ACCESS_KEY_ID,STORAGE_SECRET_ACCESS_KEY,STORAGE_PUBLIC_URL,STORAGE_ENDPOINT,STORAGE_REGION&project-name=mediadrop)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fivemanage/mediadrop)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/fivemanage/mediadrop)
