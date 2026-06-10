import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyLeaveBalance } from "@/lib/requests/requests.functions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/leave-balance")({
  component: LeaveBalancePage,
});

const STATUS_VI: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", cancelled: "Đã hủy" };

function LeaveBalancePage() {
  const fn = useServerFn(getMyLeaveBalance);
  const { data } = useQuery({ queryKey: ["my-leave-balance"], queryFn: () => fn() });
  const b = data?.balance ?? { entitled: 15, used: 0, carried_over: 0, year: new Date().getFullYear() };
  const total = Number(b.entitled) + Number(b.carried_over);
  const remaining = total - Number(b.used);
  const pct = total > 0 ? (Number(b.used) / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Phép cơ bản" value={b.entitled} />
        <Card label="Phép chuyển từ năm trước" value={b.carried_over} />
        <Card label="Đã dùng" value={b.used} />
        <Card label="Còn lại" value={remaining} highlight />
      </div>

      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium">Tiến độ sử dụng phép năm {b.year}</span>
          <span className="text-muted-foreground">{b.used} / {total} ngày</span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 font-semibold">Lịch sử nghỉ phép</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Mã</th><th className="p-3">Loại</th><th className="p-3">Từ - Đến</th><th className="p-3">Số ngày</th><th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {(data?.history ?? []).length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Chưa có dữ liệu</td></tr>}
            {data?.history.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono text-xs">{r.code}</td>
                <td className="p-3">{r.leave_type}</td>
                <td className="p-3">{r.start_date} → {r.end_date}</td>
                <td className="p-3">{r.days}</td>
                <td className="p-3"><Badge>{STATUS_VI[r.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value, highlight }: any) {
  return (
    <div className={`border rounded-xl p-5 ${highlight ? "bg-primary text-primary-foreground" : "bg-card"}`}>
      <div className={`text-sm ${highlight ? "opacity-90" : "text-muted-foreground"}`}>{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
