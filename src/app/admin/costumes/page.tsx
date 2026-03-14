"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Costume {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  available: boolean;
  imageUrl: string;
}

export default function AdminCostumesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [costumes, setCostumes] = useState<Costume[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetch("/api/costumes")
        .then((r) => r.json())
        .then(setCostumes);
    }
  }, [session]);

  async function handleDelete(id: string) {
    if (!confirm("이 의상을 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/costumes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCostumes((prev) => prev.filter((c) => c.id !== id));
    }
  }

  if (status === "loading") {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-gold text-xs tracking-[0.5em] mb-2">MANAGEMENT</p>
            <h1 className="font-display text-3xl font-light tracking-wider">COLLECTION</h1>
          </div>
          <Link
            href="/admin/costumes/new"
            className="bg-charcoal text-white px-6 py-2.5 text-xs tracking-widest hover:bg-gold transition-colors duration-300"
          >
            + NEW ITEM
          </Link>
        </div>

        <div className="bg-white border border-gold/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/10">
              <tr>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Item</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Category</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Size</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Price</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Stock</th>
                <th className="text-right px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {costumes.map((costume) => (
                <tr key={costume.id} className="hover:bg-gold-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={costume.imageUrl}
                        alt={costume.name}
                        className="w-10 h-14 object-cover"
                      />
                      <span className="text-charcoal">{costume.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-warm-gray">{costume.category}</td>
                  <td className="px-5 py-4 text-warm-gray">{costume.size}</td>
                  <td className="px-5 py-4 text-gold">{formatPrice(costume.price)}</td>
                  <td className="px-5 py-4">
                    <span className={costume.stock > 0 ? "text-gold" : "text-red-400"}>
                      {costume.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(costume.id)}
                      className="text-red-400 hover:text-red-500 text-xs tracking-widest transition-colors"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {costumes.length === 0 && (
            <div className="text-center py-12 text-warm-gray font-display tracking-wider">
              등록된 의상이 없습니다
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
