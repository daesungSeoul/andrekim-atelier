import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const where = session.user.role === "ADMIN" ? {} : { userId: session.user.id };

  const rentals = await prisma.rental.findMany({
    where,
    include: { costume: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rentals);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { costumeId, quantity, startDate, endDate, unitPrice, totalPrice } = await request.json();

    const costume = await prisma.costume.findUnique({ where: { id: costumeId } });
    if (!costume || !costume.available) {
      return NextResponse.json(
        { error: "대여할 수 없는 의상입니다." },
        { status: 400 }
      );
    }

    const qty = quantity || 1;

    if (qty > costume.stock) {
      return NextResponse.json(
        { error: `재고가 부족합니다. (현재 재고: ${costume.stock}벌)` },
        { status: 400 }
      );
    }

    // Check for overlapping rentals
    const overlapping = await prisma.rental.findFirst({
      where: {
        costumeId,
        status: { in: ["PENDING", "CONFIRMED", "RENTED"] },
        startDate: { lte: new Date(endDate) },
        endDate: { gte: new Date(startDate) },
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "해당 기간에 이미 예약이 있습니다." },
        { status: 400 }
      );
    }

    const rental = await prisma.rental.create({
      data: {
        userId: session.user.id,
        costumeId,
        quantity: qty,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        unitPrice: unitPrice || 500000,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(rental, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "예약 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
