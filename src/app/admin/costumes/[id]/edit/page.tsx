"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, SIZES } from "@/lib/utils";

interface Costume {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  price: number;
  imageUrl: string;
  stock: number;
  available: boolean;
}

export default function EditCostumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [costume, setCostume] = useState<Costume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === "ADMIN" && params.id) {
      fetch(`/api/costumes/${params.id}`)
        .then((r) => r.json())
        .then(setCostume);
    }
  }, [session, params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/costumes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          category: formData.get("category"),
          size: formData.get("size"),
          price: parseInt(formData.get("price") as string),
          imageUrl: formData.get("imageUrl") || costume?.imageUrl,
          stock: parseInt(formData.get("stock") as string) || 0,
          available: formData.get("available") === "true",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/admin/costumes");
    } catch {
      setError("수정 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (status === "loading" || !costume) {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-2">EDIT ITEM</p>
          <h1 className="font-display text-3xl font-light tracking-wider">의상 수정</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gold/10 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">{error}</div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Name *</label>
            <input
              name="name"
              required
              defaultValue={costume.name}
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={costume.description}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Category *</label>
              <select
                name="category"
                required
                defaultValue={costume.category}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm bg-transparent focus:outline-none focus:border-gold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Size *</label>
              <select
                name="size"
                required
                defaultValue={costume.size}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm bg-transparent focus:outline-none focus:border-gold"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">
                Daily Price (KRW) *
              </label>
              <input
                name="price"
                type="number"
                required
                min="1000"
                step="1000"
                defaultValue={costume.price}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={costume.stock}
                min={0}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Image URL</label>
            <input
              name="imageUrl"
              type="url"
              defaultValue={costume.imageUrl}
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Available</label>
            <select
              name="available"
              defaultValue={costume.available ? "true" : "false"}
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm bg-transparent focus:outline-none focus:border-gold"
            >
              <option value="true">대여 가능</option>
              <option value="false">대여 불가</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-charcoal text-white py-3.5 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 border border-charcoal text-charcoal tracking-[0.2em] text-sm hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
