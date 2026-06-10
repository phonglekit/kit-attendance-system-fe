import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listMyRequests, cancelRequest } from "@/lib/requests/requests.functions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/requests")({
  component: RequestsSection,
});

function RequestsSection() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/requests") return <Outlet />;
  return <RequestsPage />;
}

const STATUS_VI: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};
const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  cancelled: "outline",
};

function RequestsPage() {
  const qc = useQueryClient();
  const fn = useServerFn(listMyRequests);
  const cancelFn = useServerFn(cancelRequest);
  const { data: items = [] } = useQuery({ queryKey: ["my-requests"], queryFn: () => fn() });
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = items.filter((i: any) => {
    if (type !== "all" && i.kind !== type) return false;
    if (status !== "all" && i.status !== status) return false;
    if (q && !`${i.code} ${i.title} ${i.reason}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const cancel = useMutation({
    mutationFn: (i: any) => cancelFn({ data: { kind: i.kind, id: i.id } }),
    onSuccess: () => {
      toast.success("Đã hủy đơn");
      qc.invalidateQueries({ queryKey: ["my-requests"] });
      setSelected(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Input placeholder="Tìm kiếm mã, lý do…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="leave">Nghỉ phép</SelectItem>
            <SelectItem value="late_early">Đi muộn/Về sớm</SelectItem>
            <SelectItem value="overtime">Tăng ca</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi trạng thái</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Mã</th>
              <th className="p-3 font-medium">Loại</th>
              <th className="p-3 font-medium">Ngày</th>
              <th className="p-3 font-medium">Lý do</th>
              <th className="p-3 font-medium">Trạng thái</th>
              <th className="p-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Chưa có đơn nào</td></tr>
            )}
            {filtered.map((i: any) => (
              <tr key={`${i.kind}-${i.id}`} className="border-t">
                <td className="p-3 font-mono text-xs">{i.code}</td>
                <td className="p-3">{i.title}</td>
                <td className="p-3">{i.start_date ?? i.date}</td>
                <td className="p-3 max-w-sm truncate">{i.reason}</td>
                <td className="p-3"><Badge variant={STATUS_VARIANT[i.status]}>{STATUS_VI[i.status]}</Badge></td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setSelected(i)}>Xem</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết đơn {selected?.code}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Loại:</span> {selected.title}</div>
              <div><span className="text-muted-foreground">Trạng thái:</span> <Badge variant={STATUS_VARIANT[selected.status]}>{STATUS_VI[selected.status]}</Badge></div>
              <div><span className="text-muted-foreground">Ngày:</span> {selected.start_date ? `${selected.start_date} → ${selected.end_date}` : selected.date}</div>
              <div><span className="text-muted-foreground">Lý do:</span> {selected.reason}</div>
              {selected.decision_note && <div><span className="text-muted-foreground">Ghi chú duyệt:</span> {selected.decision_note}</div>}
            </div>
          )}
          <DialogFooter>
            {selected?.status === "pending" && (
              <Button variant="destructive" onClick={() => cancel.mutate(selected)} disabled={cancel.isPending}>
                Hủy đơn
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelected(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
