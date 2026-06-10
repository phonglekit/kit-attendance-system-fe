import { createFileRoute, redirect, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMe } from "@/lib/auth/auth.functions";
import { Users, FileText, LayoutGrid, Settings, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ href: `/login?redirect=${encodeURIComponent(location.href)}` });
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Tổng quan", icon: LayoutGrid },
  { to: "/admin/employees", label: "Quản lý nhân viên", icon: Users },
  { to: "/admin/requests", label: "Quản lý đơn", icon: FileText },
  { to: "/admin/policies", label: "Cấu hình chính sách", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meFn = useServerFn(getMe);
  const [me, setMe] = useState<{ full_name?: string; email?: string }>({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    meFn()
      .then((r) => {
        if (!r.isAdmin) {
          navigate({ to: "/home" });
          return;
        }
        setMe({ full_name: r.profile?.full_name, email: r.profile?.email });
        setChecking(false);
      })
      .catch(() => navigate({ to: "/login" }));
  }, [navigate, meFn]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Đang kiểm tra quyền quản trị…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-sm">KAS</div>
          <div>
            <div className="font-semibold">KIT Attendance</div>
            <div className="text-xs text-muted-foreground">Quản trị</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
          <Link to="/home" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50">
            <Settings className="h-4 w-4" /> Cổng nhân viên
          </Link>
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-md">
            <div className="h-9 w-9 rounded-full bg-primary-soft text-primary grid place-items-center font-semibold">{(me.full_name ?? "?").charAt(0).toUpperCase()}</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{me.full_name ?? "—"}</div>
              <div className="text-xs text-muted-foreground truncate">{me.email ?? ""}</div>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Đăng xuất</Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold">{NAV.find((n) => n.to === pathname || (n.to !== "/admin" && pathname.startsWith(n.to)))?.label ?? ""}</h1>
          <button className="h-9 w-9 rounded-full grid place-items-center hover:bg-muted"><Bell className="h-5 w-5" /></button>
        </header>
        <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
