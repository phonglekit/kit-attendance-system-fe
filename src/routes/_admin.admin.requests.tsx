import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAllRequests, decideRequest, deleteRequest } from "@/lib/admin/admin.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/requests")({
  component: AdminRequestsPage,
});

const STATUS_VI: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", cancelled: "Đã hủy" };
const STATUS_VARIANT: Record<string, any> = { pending: "secondary", approved: "default", rejected: "destructive", cancelled: "outline" };

function AdminRequestsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAllRequests);
  const decideFn = useServerFn(decideRequest);
  const deleteFn = useServerFn(deleteRequest);
  const { data: items = [] } = useQuery({ queryKey: ["admin-requests"], queryFn: () => listFn() });

  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [note, setNote] = useState("");
  const [toDelete, setToDelete] = useState<any | null>(null);

  const filtered = items.filter((i: any) => status === "all" || i.status === status);

  const decide = useMutation({
    mutationFn: (vars: { kind: string; id: string; status: "approved" | "rejected"; decision_note?: string }) =>
      decideFn({ data: vars as any }),
    onSuccess: () => {
      toast.success("Đã cập nhật");
      qc.invalidateQueries({ queryKey: ["admin-requests"] });
      setSelected(null);
      setNote("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (vars: { kind: string; id: string }) => deleteFn({ data: vars as any }),
    onSuccess: () => {
      toast.success("Đã xoá đơn");
      qc.invalidateQueries({ queryKey: ["admin-requests"] });
      setToDelete(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
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
              <th className="p-3">Mã</th><th className="p-3">Nhân viên</th><th className="p-3">Loại</th><th className="p-3">Ngày</th><th className="p-3">Trạng thái</th><th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Không có đơn</td></tr>}
            {filtered.map((i: any) => (
              <tr key={`${i.kind}-${i.id}`} className="border-t">
                <td className="p-3 font-mono text-xs">{i.code}</td>
                <td className="p-3">{i.employee?.full_name ?? "—"}</td>
                <td className="p-3">{i.title}</td>
                <td className="p-3">{i.start_date ?? i.date}</td>
                <td className="p-3"><Badge variant={STATUS_VARIANT[i.status]}>{STATUS_VI[i.status]}</Badge></td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => setSelected(i)}>Xem</Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setToDelete(i)} title="Xoá">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) { setSelected(null); setNote(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Duyệt đơn {selected?.code}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Nhân viên:</span> {selected.employee?.full_name}</div>
              <div><span className="text-muted-foreground">Loại:</span> {selected.title}</div>
              <div><span className="text-muted-foreground">Ngày:</span> {selected.start_date ? `${selected.start_date} → ${selected.end_date}` : selected.date}</div>
              <div><span className="text-muted-foreground">Lý do:</span> {selected.reason}</div>
              <div>
                <div className="text-sm font-medium mb-2">Ghi chú duyệt (bắt buộc khi từ chối)</div>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-2" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={selected?.status !== "pending" || decide.isPending}
              onClick={() => decide.mutate({ kind: selected.kind, id: selected.id, status: "rejected", decision_note: note })}
            >Từ chối</Button>
            <Button
              disabled={selected?.status !== "pending" || decide.isPending}
              onClick={() => decide.mutate({ kind: selected.kind, id: selected.id, status: "approved", decision_note: note || undefined })}
            >Duyệt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(v) => { if (!v) setToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá đơn {toDelete?.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xoá vĩnh viễn đơn của <b>{toDelete?.employee?.full_name ?? "—"}</b>. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); if (toDelete) remove.mutate({ kind: toDelete.kind, id: toDelete.id }); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {remove.isPending ? "Đang xoá…" : "Xoá"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
