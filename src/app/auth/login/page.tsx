"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-ivory">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">WELCOME BACK</p>
          <h1 className="font-display text-3xl font-light tracking-wider">LOGIN</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 border border-gold/10 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-white py-3.5 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
          <p className="text-center text-sm text-warm-gray pt-2">
            계정이 없으신가요?{" "}
            <Link href="/auth/register" className="text-gold hover:text-gold-dark transition-colors">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
