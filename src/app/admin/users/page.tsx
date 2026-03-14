"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { rentals: number };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetch("/api/users")
        .then((r) => r.json())
        .then(setUsers);
    }
  }, [session]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 회원을 삭제하시겠습니까?\n관련 대여 내역도 모두 삭제됩니다.`)) return;

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  if (status === "loading") {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-gold text-xs tracking-[0.5em] mb-2">MANAGEMENT</p>
          <h1 className="font-display text-3xl font-light tracking-wider">MEMBERS</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <div className="bg-white border border-gold/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/10">
              <tr>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Name</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Email</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Phone</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Role</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Rentals</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Joined</th>
                <th className="text-right px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gold-50/50 transition-colors">
                  <td className="px-5 py-4 text-charcoal">{user.name}</td>
                  <td className="px-5 py-4 text-warm-gray">{user.email}</td>
                  <td className="px-5 py-4 text-warm-gray">{user.phone || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-widest px-2 py-1 ${
                      user.role === "ADMIN" ? "bg-gold/10 text-gold" : "bg-gray-100 text-warm-gray"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gold">{user._count.rentals}</td>
                  <td className="px-5 py-4 text-warm-gray text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-400 hover:text-red-500 text-xs tracking-widest transition-colors"
                      >
                        DELETE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-warm-gray font-display tracking-wider">
              등록된 회원이 없습니다
            </div>
          )}
        </div>

        <Link href="/admin" className="inline-block mt-6 text-xs text-warm-gray hover:text-gold tracking-widest transition-colors">
          &larr; DASHBOARD
        </Link>
      </div>
    </div>
  );
}
