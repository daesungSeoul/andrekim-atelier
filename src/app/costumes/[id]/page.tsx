import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, PRICING_TIERS } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function CostumeDetailPage({ params }: Props) {
  const costume = await prisma.costume.findUnique({
    where: { id: params.id },
  });

  if (!costume) notFound();

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            <img
              src={costume.imageUrl}
              alt={costume.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] tracking-[0.3em] text-gold uppercase">
                {costume.category}
              </span>
              <span className="text-warm-gray-light">|</span>
              <span className="text-[10px] tracking-wider text-warm-gray">
                SIZE {costume.size}
              </span>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wider mb-6">
              {costume.name}
            </h1>

            <div className="w-12 h-px bg-gold mb-6" />

            <p className="text-warm-gray leading-relaxed mb-8 text-sm sm:text-base">
              {costume.description}
            </p>

            {/* 수량별 가격표 */}
            <div className="border border-gold/20 mb-8">
              <div className="bg-charcoal px-5 py-3">
                <p className="text-[10px] tracking-[0.3em] text-gold uppercase">Volume Pricing (1벌/1일 기준)</p>
              </div>
              <div className="divide-y divide-gold/10">
                {PRICING_TIERS.map((tier, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-3">
                    <span className="text-sm text-charcoal">{tier.label}</span>
                    <div className="text-right">
                      <span className="font-display text-lg text-gold tracking-wider">
                        {formatPrice(tier.unitPrice)}
                      </span>
                      {i > 0 && (
                        <span className="block text-[10px] text-red-400">
                          {Math.round((1 - tier.unitPrice / PRICING_TIERS[0].unitPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-b border-gold/20 py-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-widest text-warm-gray uppercase">Available Stock</span>
                <span className={`text-sm ${costume.stock > 0 ? "text-gold" : "text-red-400"}`}>
                  {costume.stock > 0 ? `${costume.stock}벌 대여 가능` : "재고 없음"}
                </span>
              </div>
            </div>

            {costume.available && costume.stock > 0 ? (
              <Link
                href={`/rental/${costume.id}`}
                className="block w-full bg-charcoal text-white text-center py-4 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300"
              >
                RESERVATION
              </Link>
            ) : (
              <button
                disabled
                className="block w-full bg-gray-200 text-warm-gray text-center py-4 tracking-[0.2em] text-sm cursor-not-allowed"
              >
                CURRENTLY UNAVAILABLE
              </button>
            )}

            <Link
              href="/costumes"
              className="block text-center mt-6 text-warm-gray hover:text-gold text-xs tracking-widest transition-colors"
            >
              &larr; BACK TO COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
