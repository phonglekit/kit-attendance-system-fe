import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("employee_profiles").select("*").eq("id", userId).maybeSingle(),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roleList = (roles ?? []).map((r) => r.role as string);
    return { userId, profile, roles: roleList, isAdmin: roleList.includes("admin") };
  });
