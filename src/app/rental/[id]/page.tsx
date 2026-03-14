"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  formatPrice,
  getUnitPrice,
  calculateTotalPrice,
  getDaysFromDates,
  PRICING_TIERS,
} from "@/lib/utils";
import Link from "next/link";

interface Costume {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function RentalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [costume, setCostume] = useState<Costume | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/costumes/${params.id}`)
      .then((res) => res.json())
      .then(setCostume);
  }, [params.id]);

  const today = new Date().toISOString().split("T")[0];
  const days = startDate && endDate ? getDaysFromDates(startDate, endDate) : 0;
  const unitPrice = getUnitPrice(quantity);
  const totalPrice = days > 0 ? calculateTotalPrice(quantity, days) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !costume) return;

    if (quantity > costume.stock) {
      setError(`재고가 부족합니다. (현재 재고: ${costume.stock}벌)`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costumeId: costume.id,
          quantity,
          startDate,
          endDate,
          unitPrice,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/rental/complete");
    } catch {
      setError("예약 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (!costume) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-warm-gray font-display tracking-wider">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">RESERVATION</p>
          <h1 className="font-display text-3xl font-light tracking-wider">대여 예약</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* 의상 정보 */}
        <div className="bg-white border border-gold/10 p-6 mb-6">
          <div className="flex gap-5">
            <img src={costume.imageUrl} alt={costume.name} className="w-24 h-32 object-cover" />
            <div className="flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-1">{costume.category}</p>
              <h2 className="font-display text-xl tracking-wider">{costume.name}</h2>
              <p className="text-warm-gray text-xs mt-1">SIZE {costume.size} · 재고 {costume.stock}벌</p>
            </div>
          </div>
        </div>

        {/* 수량별 단가표 */}
        <div className="bg-white border border-gold/10 p-6 mb-6">
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-4">VOLUME PRICING</p>
          <div className="grid grid-cols-4 gap-2">
            {PRICING_TIERS.map((tier, i) => {
              const isActive = quantity >= tier.min && quantity <= tier.max;
              return (
                <div
                  key={i}
                  className={`text-center p-3 border transition-colors ${
                    isActive
                      ? "border-gold bg-gold/5"
                      : "border-gold/10"
                  }`}
                >
                  <p className="text-[10px] tracking-wider text-warm-gray mb-1">{tier.label}</p>
                  <p className={`font-display text-sm tracking-wider ${isActive ? "text-gold" : "text-charcoal"}`}>
                    {(tier.unitPrice / 10000).toFixed(0)}만원
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 예약 폼 */}
        <form onSubmit={handleSubmit} className="bg-white border border-gold/10 p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">{error}</div>
          )}

          {/* 수량 */}
          <div>
            <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">
              Quantity (벌)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gold/20 text-charcoal hover:border-gold transition-colors flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={costume.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(costume.stock, parseInt(e.target.value) || 1)))}
                className="w-20 text-center border-b border-gray-200 py-2 text-lg font-display focus:outline-none focus:border-gold bg-transparent"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(costume.stock, quantity + 1))}
                className="w-10 h-10 border border-gold/20 text-charcoal hover:border-gold transition-colors flex items-center justify-center"
              >
                +
              </button>
              <div className="ml-2 text-sm">
                <span className="text-warm-gray">단가: </span>
                <span className="text-gold font-display tracking-wider">{formatPrice(unitPrice)}</span>
              </div>
            </div>
            {/* 빠른 수량 선택 */}
            <div className="flex gap-2 mt-3">
              {[1, 10, 50, 100].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(Math.min(costume.stock, q))}
                  className={`px-3 py-1 text-xs tracking-wider border transition-colors ${
                    quantity === q
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/10 text-warm-gray hover:border-gold/30"
                  }`}
                >
                  {q}벌
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">
                Start Date
              </label>
              <input
                type="date"
                required
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) setEndDate("");
                }}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-warm-gray mb-2 uppercase">
                End Date
              </label>
              <input
                type="date"
                required
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border-b border-gray-200 px-0 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>
          </div>

          {/* 가격 계산 */}
          {days > 0 && (
            <div className="border border-gold/10 p-5 bg-gold-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">수량</span>
                  <span className="tracking-wider">{quantity}벌</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">대여 기간</span>
                  <span className="tracking-wider">{days}일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">적용 단가</span>
                  <span className="tracking-wider text-gold">{formatPrice(unitPrice)}/벌/일</span>
                </div>
                {quantity >= 10 && (
                  <div className="flex justify-between text-red-400">
                    <span>할인율</span>
                    <span>-{Math.round((1 - unitPrice / 500000) * 100)}%</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gold/20 mt-3 pt-3 flex justify-between items-end">
                <span className="text-xs tracking-widest text-warm-gray uppercase">Total</span>
                <div className="text-right">
                  <span className="font-display text-2xl text-gold tracking-wider">
                    {formatPrice(totalPrice)}
                  </span>
                  {quantity >= 10 && (
                    <p className="text-[10px] text-warm-gray line-through">
                      {formatPrice(500000 * quantity * days)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-charcoal/5 p-3 text-xs text-warm-gray text-center tracking-wider">
            TEST MODE - 실제 결제가 진행되지 않습니다
          </div>

          <button
            type="submit"
            disabled={loading || !startDate || !endDate}
            className="w-full bg-charcoal text-white py-4 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : totalPrice > 0 ? `${formatPrice(totalPrice)} CONFIRM` : "CONFIRM"}
          </button>

          <Link
            href={`/costumes/${costume.id}`}
            className="block text-center text-xs text-warm-gray hover:text-gold tracking-widest transition-colors"
          >
            &larr; BACK
          </Link>
        </form>
      </div>
    </div>
  );
}
