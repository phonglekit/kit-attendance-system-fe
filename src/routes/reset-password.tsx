import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Mật khẩu tối thiểu 8 ký tự");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Đã đặt lại mật khẩu");
      navigate({ to: "/home" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Đặt mật khẩu mới</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Đang lưu…" : "Cập nhật"}</Button>
        </form>
      </div>
    </div>
  );
}
