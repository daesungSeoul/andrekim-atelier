import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const size = searchParams.get("size");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: Record<string, unknown> = { available: true };

  if (category) where.category = category;
  if (size) where.size = size;
  if (search) where.name = { contains: search };
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: parseInt(minPrice) } : {}),
      ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
    };
  }

  const costumes = await prisma.costume.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(costumes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    const data = await request.json();
    const costume = await prisma.costume.create({ data });
    return NextResponse.json(costume, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "의상 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
