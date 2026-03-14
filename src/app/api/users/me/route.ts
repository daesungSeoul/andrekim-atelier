import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { name, phone, currentPassword, newPassword } = await request.json();
    const updateData: Record<string, string | null> = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "현재 비밀번호를 입력해주세요." },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "현재 비밀번호가 일치하지 않습니다." },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, email: true, name: true, phone: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    await prisma.rental.deleteMany({ where: { userId: session.user.id } });
    await prisma.user.delete({ where: { id: session.user.id } });
    return NextResponse.json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch {
    return NextResponse.json(
      { error: "탈퇴 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
