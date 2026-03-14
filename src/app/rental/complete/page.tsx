import Link from "next/link";

export default function RentalCompletePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-ivory">
      <div className="text-center">
        <div className="w-20 h-20 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gold text-xs tracking-[0.5em] mb-3">CONFIRMED</p>
        <h1 className="font-display text-3xl font-light tracking-wider mb-4">예약이 완료되었습니다</h1>
        <div className="w-12 h-px bg-gold mx-auto mb-6" />
        <p className="text-warm-gray mb-10 text-sm">
          My Atelier에서 예약 내역을 확인하실 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/mypage"
            className="bg-charcoal text-white px-8 py-3 tracking-[0.2em] text-sm hover:bg-gold transition-colors duration-300"
          >
            MY ATELIER
          </Link>
          <Link
            href="/costumes"
            className="border border-charcoal text-charcoal px-8 py-3 tracking-[0.2em] text-sm hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            COLLECTION
          </Link>
        </div>
      </div>
    </div>
  );
}
