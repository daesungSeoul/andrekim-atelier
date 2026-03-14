import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { status } = await request.json();

    const rental = await prisma.rental.findUnique({ where: { id: params.id } });
    if (!rental) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 });
    }

    // Only admin can change status, or user can cancel their own
    if (session.user.role !== "ADMIN" &&
        !(rental.userId === session.user.id && status === "CANCELLED")) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const updated = await prisma.rental.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
