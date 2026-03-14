export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl tracking-[0.2em] text-gold mb-4">ANDRÉ KIM</h3>
            <p className="text-sm leading-relaxed text-white/40">
              1962년부터 이어온 판타지와 엘레강스.<br />
              한국 패션의 자존심, 앙드레김 아뜨리에.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-widest text-gold mb-4">GUIDE</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/40">대여 문의: 02-XXX-XXXX</li>
              <li className="text-white/40">운영시간: 10:00 - 19:00 (월-토)</li>
              <li className="text-white/40">일요일 및 공휴일 휴무</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-widest text-gold mb-4">LOCATION</h4>
            <p className="text-sm text-white/40 leading-relaxed">
              서울특별시 강남구<br />
              앙드레김 아뜨리에
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/30">
            &copy; 2026 ANDRÉ KIM ATELIER. All Rights Reserved.
          </p>
          <p className="text-xs text-white/30 tracking-widest">
            FANTASY &amp; ELEGANCE
          </p>
        </div>
      </div>
    </footer>
  );
}
