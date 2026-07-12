import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = (locals as any).runtime;
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    // 1. FIXED BINDING NAME HERE (Underscores and matching your wrangler file)
    if (!key || !runtime?.env?.portal_kampus_backup_bucket) {
      return new Response("Missing key parameter or bucket binding", { status: 400 });
    }

    // 2. FIXED BINDING NAME HERE TOO
    const object = await runtime.env.portal_kampus_backup_bucket.get(key);
    
    if (object === null) {
      return new Response("Image not found in R2 storage", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); 

    return new Response(object.body, { status: 200, headers });
  } catch (error: any) {
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
};
