import { prisma } from "@/lib/prisma";
import CostumeCard from "@/components/costume/CostumeCard";
import SearchFilter from "@/components/costume/SearchFilter";

interface Props {
  searchParams: { category?: string; size?: string; search?: string };
}

export default async function CostumesPage({ searchParams }: Props) {
  const where: Record<string, unknown> = { available: true };

  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.size) where.size = searchParams.size;
  if (searchParams.search) where.name = { contains: searchParams.search };

  const costumes = await prisma.costume.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.5em] mb-3">COLLECTION</p>
          <h1 className="font-display text-3xl font-light tracking-wider mb-2">
            앙드레김 컬렉션
          </h1>
          <div className="w-12 h-px bg-gold mx-auto" />
        </div>

        <SearchFilter />

        <div className="mt-8">
          {costumes.length === 0 ? (
            <div className="text-center py-24 text-warm-gray">
              <p className="text-lg font-display tracking-wider">검색 결과가 없습니다</p>
              <p className="text-sm mt-2">다른 조건으로 검색해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {costumes.map((costume) => (
                <CostumeCard key={costume.id} {...costume} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
