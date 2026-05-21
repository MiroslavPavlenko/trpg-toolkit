import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

async function removeStorageFolder(
  adminClient: ReturnType<typeof createClient>,
  bucket: string,
  prefix: string,
) {
  const paths: string[] = [];

  async function collect(folder: string) {
    let offset = 0;
    const limit = 100;

    while (true) {
      const { data, error } = await adminClient.storage.from(bucket).list(folder, {
        limit,
        offset,
      });

      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const item of data) {
        const path = `${folder}/${item.name}`;
        if (item.id === null) {
          await collect(path);
        } else {
          paths.push(path);
        }
      }

      if (data.length < limit) break;
      offset += limit;
    }
  }

  await collect(prefix);

  for (let index = 0; index < paths.length; index += 100) {
    const chunk = paths.slice(index, index + 100);
    const { error } = await adminClient.storage.from(bucket).remove(chunk);
    if (error) throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Delete account function is not configured" }, 500);
  }

  if (!authorization) {
    return jsonResponse({ error: "Missing authorization header" }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: "Unable to verify current user" }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    await Promise.all([
      removeStorageFolder(adminClient, "maps", user.id),
      removeStorageFolder(adminClient, "tokens", user.id),
    ]);

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id, false);
    if (deleteError) throw deleteError;

    return jsonResponse({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete account";
    return jsonResponse({ error: message }, 500);
  }
});
