import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const costume = await prisma.costume.findUnique({
    where: { id: params.id },
  });

  if (!costume) {
    return NextResponse.json({ error: "의상을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(costume);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    const data = await request.json();
    const costume = await prisma.costume.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(costume);
  } catch {
    return NextResponse.json(
      { error: "수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    await prisma.costume.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "삭제되었습니다." });
  } catch {
    return NextResponse.json(
      { error: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
