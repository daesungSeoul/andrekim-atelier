"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate, getRentalStatusLabel, getRentalStatusColor } from "@/lib/utils";

interface Rental {
  id: string;
  quantity: number;
  unitPrice: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  costume: {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
  };
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/rentals")
        .then((res) => res.json())
        .then((data) => {
          setRentals(data);
          setLoading(false);
        });
    }
  }, [session]);

  async function handleCancel(rentalId: string) {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    const res = await fetch(`/api/rentals/${rentalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (res.ok) {
      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: "CANCELLED" } : r))
      );
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-warm-gray font-display tracking-wider">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">WELCOME</p>
          <h1 className="font-display text-3xl font-light tracking-wider mb-2">MY ATELIER</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4 mb-3" />
          <p className="text-warm-gray text-sm">{session?.user.name}님의 대여 내역</p>
          <Link
            href="/mypage/edit"
            className="inline-block mt-4 text-xs text-gold hover:text-gold-dark tracking-widest border border-gold/30 px-5 py-2 hover:bg-gold/5 transition-colors"
          >
            회원정보 수정
          </Link>
        </div>

        {rentals.length === 0 ? (
          <div className="text-center py-24 text-warm-gray">
            <p className="font-display text-xl tracking-wider mb-2">대여 내역이 없습니다</p>
            <p className="text-sm">컬렉션에서 마음에 드는 의상을 찾아보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white border border-gold/10 p-5 flex gap-5"
              >
                <img
                  src={rental.costume.imageUrl}
                  alt={rental.costume.name}
                  className="w-20 h-28 object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-1">
                        {rental.costume.category}
                      </p>
                      <h3 className="font-display text-lg tracking-wider">{rental.costume.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] tracking-widest px-3 py-1 ${getRentalStatusColor(
                        rental.status
                      )}`}
                    >
                      {getRentalStatusLabel(rental.status)}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-warm-gray">
                    <p>{rental.quantity}벌 · {formatDate(rental.startDate)} ~ {formatDate(rental.endDate)}</p>
                    <p className="text-[10px] mt-0.5">단가 {formatPrice(rental.unitPrice)}/벌/일</p>
                    <p className="text-gold mt-1 tracking-wider">
                      {formatPrice(rental.totalPrice)}
                    </p>
                  </div>
                  {(rental.status === "PENDING" || rental.status === "CONFIRMED") && (
                    <button
                      onClick={() => handleCancel(rental.id)}
                      className="mt-3 text-xs text-red-400 hover:text-red-500 tracking-widest transition-colors"
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
