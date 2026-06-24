import { createClient } from "@/lib/supabase/server";

export type TenantAccess =
  | {
      status: "unauthenticated";
      tenantName: string;
    }
  | {
      status: "forbidden";
      tenantName: string;
      userEmail: string;
    }
  | {
      status: "authorized";
      tenantName: string;
      tenantId: string;
      userId: string;
      userEmail: string;
      role: string;
    };

export async function getPutraCommandCenterAccess(): Promise<TenantAccess> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, name")
    .eq("slug", "putra-auto-rental")
    .eq("status", "active")
    .maybeSingle();

  const tenantName = tenant?.name ?? "Putra Auto Rental";

  if (!authData.user) {
    return {
      status: "unauthenticated",
      tenantName,
    };
  }

  if (!tenant) {
    return {
      status: "forbidden",
      tenantName,
      userEmail: authData.user.email ?? "unknown user",
    };
  }

  const { data: membership } = await supabase
    .from("tenant_memberships")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", authData.user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    return {
      status: "forbidden",
      tenantName,
      userEmail: authData.user.email ?? "unknown user",
    };
  }

  return {
    status: "authorized",
    tenantName,
    tenantId: tenant.id,
    userId: authData.user.id,
    userEmail: authData.user.email ?? "unknown user",
    role: membership.role,
  };
}
