"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
          setName(data.name);
          setPhone(data.phone || "");
        });
    }
  }, [session]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const body: Record<string, string> = { name, phone };
    if (newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setMessage("회원정보가 수정되었습니다.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleWithdraw() {
    if (!confirm("정말 탈퇴하시겠습니까?\n모든 대여 내역이 삭제되며 복구할 수 없습니다.")) return;
    if (!confirm("최종 확인: 회원 탈퇴를 진행합니다.")) return;

    const res = await fetch("/api/users/me", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    }
  }

  if (status === "loading" || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-warm-gray font-display tracking-wider">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">PROFILE</p>
          <h1 className="font-display text-3xl font-light tracking-wider mb-2">회원정보 수정</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        <form onSubmit={handleUpdate} className="bg-white border border-gold/10 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">{error}</div>
          )}
          {message && (
            <div className="bg-green-50 text-green-600 p-3 text-sm border border-green-100">{message}</div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm bg-transparent text-warm-gray"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div className="pt-4 border-t border-gold/10">
            <p className="text-[10px] tracking-widest text-warm-gray mb-4 uppercase">Change Password</p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
                />
              </div>
            </div>
            <p className="text-[10px] text-warm-gray mt-2">비밀번호 변경 시에만 입력하세요</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-charcoal text-white py-3.5 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "SAVING..." : "SAVE"}
            </button>
            <Link
              href="/mypage"
              className="px-8 border border-charcoal text-charcoal tracking-[0.2em] text-sm hover:bg-charcoal hover:text-white transition-all duration-300 flex items-center"
            >
              CANCEL
            </Link>
          </div>
        </form>

        <div className="mt-10 bg-white border border-red-100 p-8">
          <p className="text-[10px] tracking-widest text-red-400 mb-2 uppercase">Danger Zone</p>
          <p className="text-sm text-warm-gray mb-4">
            회원 탈퇴 시 모든 대여 내역이 삭제되며 복구할 수 없습니다.
          </p>
          <button
            onClick={handleWithdraw}
            className="text-xs text-red-400 hover:text-red-500 tracking-widest border border-red-200 px-6 py-2 hover:bg-red-50 transition-colors"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
