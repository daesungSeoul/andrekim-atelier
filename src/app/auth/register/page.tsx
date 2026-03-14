"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password,
          name: formData.get("name"),
          phone: formData.get("phone"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-ivory py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">JOIN US</p>
          <h1 className="font-display text-3xl font-light tracking-wider">MEMBERSHIP</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 border border-gold/10 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Name *</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Phone</label>
            <input
              name="phone"
              type="tel"
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="010-1234-5678"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Password *</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="6자 이상"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Confirm Password *</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="비밀번호 재입력"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-white py-3.5 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? "PROCESSING..." : "CREATE ACCOUNT"}
          </button>
          <p className="text-center text-sm text-warm-gray pt-2">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-gold hover:text-gold-dark transition-colors">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
