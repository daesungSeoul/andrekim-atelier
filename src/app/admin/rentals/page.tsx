"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatPrice,
  formatDate,
  getRentalStatusLabel,
  getRentalStatusColor,
} from "@/lib/utils";

interface Rental {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  user: { name: string; email: string };
  costume: { name: string; category: string };
}

const STATUSES = ["PENDING", "CONFIRMED", "RENTED", "RETURNED", "CANCELLED"];

export default function AdminRentalsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login");
    if (authStatus === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [authStatus, session, router]);

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetch("/api/rentals")
        .then((r) => r.json())
        .then(setRentals);
    }
  }, [session]);

  async function handleStatusChange(rentalId: string, newStatus: string) {
    const res = await fetch(`/api/rentals/${rentalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: newStatus } : r))
      );
    }
  }

  if (authStatus === "loading") {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-2">MANAGEMENT</p>
          <h1 className="font-display text-3xl font-light tracking-wider">RENTAL STATUS</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <div className="bg-white border border-gold/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/10">
              <tr>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Client</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Item</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Period</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Amount</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Status</th>
                <th className="text-left px-5 py-4 text-[10px] tracking-widest text-warm-gray uppercase font-normal">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gold-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-charcoal">{rental.user.name}</p>
                    <p className="text-[10px] text-warm-gray-light">{rental.user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-charcoal">{rental.costume.name}</p>
                    <p className="text-[10px] text-gold tracking-wider">{rental.costume.category}</p>
                  </td>
                  <td className="px-5 py-4 text-warm-gray whitespace-nowrap text-xs">
                    {formatDate(rental.startDate)}<br />~ {formatDate(rental.endDate)}
                  </td>
                  <td className="px-5 py-4 text-gold tracking-wider">
                    {formatPrice(rental.totalPrice)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] tracking-widest px-3 py-1 ${getRentalStatusColor(
                        rental.status
                      )}`}
                    >
                      {getRentalStatusLabel(rental.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={rental.status}
                      onChange={(e) => handleStatusChange(rental.id, e.target.value)}
                      className="border border-gray-200 px-2 py-1.5 text-xs bg-transparent focus:outline-none focus:border-gold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {getRentalStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rentals.length === 0 && (
            <div className="text-center py-12 text-warm-gray font-display tracking-wider">
              대여 내역이 없습니다
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
