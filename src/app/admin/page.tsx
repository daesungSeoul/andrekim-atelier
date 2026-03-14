"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalCostumes: number;
  activeRentals: number;
  totalRevenue: number;
  pendingRentals: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalCostumes: 0,
    activeRentals: 0,
    totalRevenue: 0,
    pendingRentals: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      Promise.all([
        fetch("/api/costumes").then((r) => r.json()),
        fetch("/api/rentals").then((r) => r.json()),
      ]).then(([costumes, rentals]) => {
        const active = rentals.filter(
          (r: { status: string }) => r.status === "RENTED" || r.status === "CONFIRMED"
        );
        const pending = rentals.filter(
          (r: { status: string }) => r.status === "PENDING"
        );
        const revenue = rentals
          .filter((r: { status: string }) => r.status !== "CANCELLED")
          .reduce((sum: number, r: { totalPrice: number }) => sum + r.totalPrice, 0);

        setStats({
          totalCostumes: costumes.length,
          activeRentals: active.length,
          totalRevenue: revenue,
          pendingRentals: pending.length,
        });
      });
    }
  }, [session]);

  if (status === "loading") {
    return <div className="p-12 text-center text-warm-gray font-display tracking-wider">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-2">MANAGEMENT</p>
          <h1 className="font-display text-3xl font-light tracking-wider">ADMIN DASHBOARD</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-gold/10 p-6">
            <p className="text-[10px] tracking-widest text-warm-gray uppercase mb-2">Total Items</p>
            <p className="font-display text-3xl text-charcoal">{stats.totalCostumes}</p>
          </div>
          <div className="bg-white border border-gold/10 p-6">
            <p className="text-[10px] tracking-widest text-warm-gray uppercase mb-2">Active Rentals</p>
            <p className="font-display text-3xl text-gold">{stats.activeRentals}</p>
          </div>
          <div className="bg-white border border-gold/10 p-6">
            <p className="text-[10px] tracking-widest text-warm-gray uppercase mb-2">Pending</p>
            <p className="font-display text-3xl text-charcoal">{stats.pendingRentals}</p>
          </div>
          <div className="bg-white border border-gold/10 p-6">
            <p className="text-[10px] tracking-widest text-warm-gray uppercase mb-2">Revenue</p>
            <p className="font-display text-2xl text-gold">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/costumes"
            className="bg-white border border-gold/10 p-8 hover:border-gold/30 transition-colors group"
          >
            <h2 className="font-display text-xl tracking-wider mb-2 group-hover:text-gold transition-colors">
              COLLECTION MANAGEMENT
            </h2>
            <p className="text-sm text-warm-gray">의상 등록, 수정, 삭제 및 재고 관리</p>
          </Link>
          <Link
            href="/admin/rentals"
            className="bg-white border border-gold/10 p-8 hover:border-gold/30 transition-colors group"
          >
            <h2 className="font-display text-xl tracking-wider mb-2 group-hover:text-gold transition-colors">
              RENTAL STATUS
            </h2>
            <p className="text-sm text-warm-gray">대여 상태 확인 및 변경</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
