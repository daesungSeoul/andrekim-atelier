"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, SIZES } from "@/lib/utils";

export default function NewCostumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/costumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          category: formData.get("category"),
          size: formData.get("size"),
          price: parseInt(formData.get("price") as string),
          imageUrl: formData.get("imageUrl") || "https://placehold.co/400x533/1A1A1A/C9A96E?text=ANDR%C3%89+KIM",
          stock: parseInt(formData.get("stock") as string) || 1,
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
      setError("등록 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-2">NEW ITEM</p>
          <h1 className="font-display text-3xl font-light tracking-wider">의상 등록</h1>
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
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Category *</label>
              <select
                name="category"
                required
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
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={1}
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
              placeholder="https://example.com/image.jpg"
              className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
            />
            <p className="text-[10px] text-warm-gray-light mt-2">비워두면 기본 이미지가 사용됩니다</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-charcoal text-white py-3.5 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "REGISTERING..." : "REGISTER"}
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
