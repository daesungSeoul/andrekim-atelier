import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface CostumeCardProps {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  imageUrl: string;
  available: boolean;
}

export default function CostumeCard({
  id,
  name,
  category,
  size,
  imageUrl,
  available,
}: CostumeCardProps) {
  return (
    <Link href={`/costumes/${id}`} className="group">
      <div className="bg-white overflow-hidden">
        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {!available && (
            <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
              <span className="text-white text-xs tracking-[0.3em] border border-white/50 px-4 py-1.5">
                RESERVED
              </span>
            </div>
          )}
        </div>
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] tracking-widest text-gold uppercase">
              {category}
            </span>
            <span className="text-[10px] text-warm-gray">|</span>
            <span className="text-[10px] tracking-wider text-warm-gray">
              {size}
            </span>
          </div>
          <h3 className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gold text-sm mt-1.5 tracking-wider">
            {formatPrice(500000)}
            <span className="text-[10px] text-warm-gray ml-1">~</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
