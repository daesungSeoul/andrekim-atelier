"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, SIZES } from "@/lib/utils";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/costumes?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter("search", search);
  }

  function clearFilters() {
    setSearch("");
    router.push("/costumes");
  }

  return (
    <div className="bg-white p-6 border border-gold/10 space-y-5">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="의상명 검색..."
          className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
        />
        <button
          type="submit"
          className="bg-charcoal text-white px-6 py-2.5 text-xs tracking-widest hover:bg-gold transition-colors duration-300"
        >
          SEARCH
        </button>
      </form>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-[10px] tracking-widest text-warm-gray mb-1.5 uppercase">
            Category
          </label>
          <select
            value={searchParams.get("category") || ""}
            onChange={(e) => applyFilter("category", e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-gold"
          >
            <option value="">전체</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-widest text-warm-gray mb-1.5 uppercase">
            Size
          </label>
          <select
            value={searchParams.get("size") || ""}
            onChange={(e) => applyFilter("size", e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-gold"
          >
            <option value="">전체</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="text-xs text-warm-gray hover:text-gold tracking-wider transition-colors pb-2"
        >
          CLEAR ALL
        </button>
      </div>
    </div>
  );
}
