# Nginx (reverse proxy)

Backend listens on `127.0.0.1:3001`. Nginx terminates TLS and proxies to it.

## Backend API

```nginx
server {
    server_name api.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> The backend uses `trust proxy`, so `X-Forwarded-For` gives the real client IP
> to the auth rate limiter.

### SSE stream (`GET /surebets/stream`)

The real-time surebets stream is Server-Sent Events — Nginx must NOT buffer it,
or events arrive in batches / never. Add a dedicated location:

```nginx
    location /surebets/stream {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s;
        chunked_transfer_encoding off;
    }
```

The backend also sends `X-Accel-Buffering: no` on this route as a second guard.

## HTTPS (certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.seudominio.com
```

Certbot rewrites the server block to listen on 443 and adds auto-renewal.

## Notes

- **HTTPS is mandatory in production.** The frontend cookie uses `secure=true`.
- `CORS_ORIGINS` must include the frontend domain (e.g.
  `https://app.seudominio.com`).
- Do **not** expose Postgres (5432) or Redis (6379) to the internet — keep them
  on the internal Docker network or firewalled.
- If the frontend is served by Nginx too, add a separate `server` block for the
  Nuxt app / static output and set `NUXT_PUBLIC_API_BASE=https://api.seudominio.com`.
