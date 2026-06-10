import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyDashboard } from "@/lib/requests/requests.functions";
import { Calendar, Clock, FileText, PlusCircle, CheckCircle2 } from "lucide-react";


export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: any) {
  const toneClass: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-sky-100 text-sky-700",
  };
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`h-9 w-9 grid place-items-center rounded-lg ${toneClass[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function HomePage() {
  const fn = useServerFn(getMyDashboard);
  const { data } = useQuery({ queryKey: ["my-dashboard"], queryFn: () => fn() });
  const d = data ?? { pending: 0, approvedThisMonth: 0, leaveRemaining: 0, otHoursThisMonth: 0 };

  const tiles = [
    { to: "/requests/new", icon: PlusCircle, label: "Tạo đơn mới" },
    { to: "/requests", icon: FileText, label: "Đơn của tôi" },
    { to: "/overtime", icon: Clock, label: "Tăng ca" },
    { to: "/leave-balance", icon: Calendar, label: "Số dư phép" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard icon={FileText} label="Đơn chờ duyệt" value={d.pending} hint="Đang xử lý" tone="warning" />
        <StatCard icon={CheckCircle2} label="Đã duyệt tháng này" value={d.approvedThisMonth} tone="success" />
        <StatCard icon={Calendar} label="Phép còn lại" value={d.leaveRemaining} hint="ngày" tone="primary" />
        <StatCard icon={Clock} label="Tăng ca tháng này" value={d.otHoursThisMonth} hint="giờ" tone="info" />
      </div>
      <div>
        <h2 className="text-base font-semibold mb-3">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to} className="bg-card border rounded-xl p-5 hover:border-primary transition-colors flex flex-col items-start gap-3">
              <span className="h-10 w-10 grid place-items-center rounded-lg bg-primary/10 text-primary"><t.icon className="h-5 w-5" /></span>
              <span className="font-medium">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
