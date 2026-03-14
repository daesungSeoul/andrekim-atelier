import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CostumeCard from "@/components/costume/CostumeCard";

export default async function HomePage() {
  const costumes = await prisma.costume.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, rgba(201,169,110,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(201,169,110,0.2) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:py-40 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs sm:text-sm tracking-[0.5em] mb-6">
            SINCE 1962
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-wider mb-4">
            ANDRÉ KIM
          </h1>
          <p className="font-display text-lg sm:text-xl tracking-[0.3em] text-gold-light mb-8">
            A T E L I E R
          </p>
          <div className="flex items-center justify-center gap-4 mb-8 line-ornament">
            <span className="text-gold text-xs tracking-widest px-4">
              FANTASY &amp; ELEGANCE
            </span>
          </div>
          <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed text-sm sm:text-base">
            한국 패션의 자존심, 앙드레김.<br />
            순백의 아름다움과 코리안 판타지를 담은<br />
            특별한 의상을 대여해 드립니다.
          </p>
          <Link
            href="/costumes"
            className="inline-block border border-gold text-gold px-10 py-3.5 tracking-[0.2em] text-sm hover:bg-gold hover:text-charcoal transition-all duration-300"
          >
            VIEW COLLECTION
          </Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.5em] mb-3">BRAND STORY</p>
            <h2 className="font-display text-2xl sm:text-3xl font-light tracking-wider mb-6">
              판타지와 엘레강스의 유산
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mb-6" />
            <p className="text-warm-gray max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
              1962년 한국 최초의 남성 패션 디자이너로 시작하여,
              파리, 뉴욕, 도쿄를 넘나들며 &ldquo;코리안 판타지&rdquo;를 세계에 알린 앙드레김.
              순백의 겹옷 드레스부터 우아한 이브닝 가운까지,
              그의 영원한 아름다움을 지금 만나보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest mb-3 text-charcoal">HAUTE COUTURE</h3>
              <p className="text-warm-gray text-sm leading-relaxed">
                한 벌 한 벌 장인의 손끝에서 탄생하는 오뜨 꾸뛰르 의상을 합리적인 대여로 만나보세요.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest mb-3 text-charcoal">EASY BOOKING</h3>
              <p className="text-warm-gray text-sm leading-relaxed">
                원하는 날짜를 선택하고 간편하게 예약. 특별한 날을 위한 완벽한 의상을 준비하세요.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest mb-3 text-charcoal">PERSONAL STYLING</h3>
              <p className="text-warm-gray text-sm leading-relaxed">
                웨딩, 무대, 갈라 디너 등 상황에 맞는 전문 스타일링 상담을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      {costumes.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold text-xs tracking-[0.5em] mb-3">COLLECTION</p>
              <h2 className="font-display text-2xl sm:text-3xl font-light tracking-wider mb-4">
                최신 컬렉션
              </h2>
              <div className="w-12 h-px bg-gold mx-auto" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {costumes.map((costume) => (
                <CostumeCard key={costume.id} {...costume} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/costumes"
                className="inline-block border border-charcoal text-charcoal px-10 py-3 tracking-[0.2em] text-sm hover:bg-charcoal hover:text-white transition-all duration-300"
              >
                VIEW ALL
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.5em] mb-4">RESERVATION</p>
          <h2 className="font-display text-2xl sm:text-3xl font-light tracking-wider mb-6">
            특별한 순간을 위한 의상을 예약하세요
          </h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">
            웨딩, 무대 의상, 이브닝 가운, 겹옷 드레스 등<br />
            앙드레김 아뜨리에의 모든 컬렉션을 대여하실 수 있습니다.
          </p>
          <Link
            href="/costumes"
            className="inline-block border border-gold text-gold px-10 py-3.5 tracking-[0.2em] text-sm hover:bg-gold hover:text-charcoal transition-all duration-300"
          >
            RESERVE NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
