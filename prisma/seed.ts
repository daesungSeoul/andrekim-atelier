const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@andrekim.com" },
    update: {},
    create: {
      email: "admin@andrekim.com",
      password: adminPassword,
      name: "아뜨리에 관리자",
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "guest@test.com" },
    update: {},
    create: {
      email: "guest@test.com",
      password: userPassword,
      name: "김하늘",
      phone: "010-1234-5678",
      role: "USER",
    },
  });

  // 기본 단가: 500,000원/벌/일 (수량별 할인 적용)
  const BASE_PRICE = 500000;

  const costumes = [
    // 웨딩드레스
    { name: "화이트 판타지 웨딩드레스", description: "앙드레김의 시그니처 순백 웨딩드레스입니다. 아플리케 기법으로 섬세하게 장식된 보디스와 풍성한 A라인 스커트가 코리안 판타지를 표현합니다.", category: "웨딩드레스", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FDFBF7/C9A96E?text=White+Fantasy", stock: 150 },
    { name: "엘레강스 머메이드 웨딩드레스", description: "우아한 머메이드 실루엣의 웨딩드레스. 노출 없이 인체의 아름다운 라인을 살리는 앙드레김 특유의 엘레강스가 돋보입니다.", category: "웨딩드레스", size: "S", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FFF8F0/C9A96E?text=Elegance+Mermaid", stock: 100 },
    { name: "로얄 프린세스 웨딩드레스", description: "긴 트레인과 레이스 장식이 특징인 로얄 라인 드레스. 왕실의 품격을 현대적으로 재해석한 격조 높은 디자인입니다.", category: "웨딩드레스", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FFFEF5/A8893F?text=Royal+Princess", stock: 80 },

    // 이브닝가운
    { name: "골드 이브닝 가운", description: "갈라 디너와 시상식을 위한 골드 컬러 이브닝 가운. 앙드레김 특유의 화려하면서도 품격 있는 디자인. 아플리케 비즈 장식.", category: "이브닝가운", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/F5E6CC/A8893F?text=Gold+Gown", stock: 120 },
    { name: "미드나이트 블루 가운", description: "깊은 밤의 우아함을 담은 네이비 이브닝 가운. 어깨를 감싸는 숄 칼라와 허리를 강조하는 실루엣이 돋보입니다.", category: "이브닝가운", size: "S", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/1B3A5C/C9A96E?text=Midnight+Blue", stock: 100 },
    { name: "루비 레드 이브닝 가운", description: "무대와 레드카펫을 위한 강렬한 레드 가운. 절제된 노출과 극적인 실루엣으로 앙드레김의 판타지를 표현합니다.", category: "이브닝가운", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/8B0000/C9A96E?text=Ruby+Red", stock: 80 },
    { name: "아이보리 시폰 가운", description: "부드러운 시폰 소재의 아이보리 가운. 자연스럽게 흐르는 드레이프가 여성스러운 우아함을 연출합니다.", category: "이브닝가운", size: "L", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FDFBF7/8A8478?text=Ivory+Chiffon", stock: 130 },

    // 겹옷드레스
    { name: "겹옷 드레스 - 순백", description: "앙드레김의 상징적인 겹옷 드레스. 8겹의 순백 오간자가 한국 여성의 한(恨)과 순수함을 동시에 표현합니다. 패션쇼 피날레를 장식해온 전설적인 디자인.", category: "겹옷드레스", size: "Free", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FFFFFF/C9A96E?text=Gyeopot+White", stock: 50 },
    { name: "겹옷 드레스 - 핑크 그라데이션", description: "연분홍에서 순백으로 이어지는 그라데이션 겹옷 드레스. 9겹의 실크 오간자가 몽환적인 판타지를 완성합니다.", category: "겹옷드레스", size: "Free", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FFE4EC/C9A96E?text=Gyeopot+Pink", stock: 50 },
    { name: "겹옷 드레스 - 골드", description: "황금빛 겹옷 드레스. 앙드레김의 동양적 판타지와 서양의 오뜨 꾸뛰르가 만나는 걸작. 특별한 무대를 위한 의상.", category: "겹옷드레스", size: "Free", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/E8D5A8/1A1A1A?text=Gyeopot+Gold", stock: 50 },

    // 무대의상
    { name: "콘서트 화이트 수트", description: "공연과 콘서트를 위한 화이트 수트. 앙드레김의 시그니처 올 화이트에 골드 장식이 더해져 무대 위에서 빛나는 의상.", category: "무대의상", size: "L", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FDFBF7/1A1A1A?text=Stage+White", stock: 200 },
    { name: "시상식 블랙 턱시도", description: "격식 있는 시상식과 행사를 위한 블랙 턱시도. 골드 커프스와 실크 라펠이 돋보이는 앙드레김 스타일.", category: "무대의상", size: "L", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/1A1A1A/C9A96E?text=Black+Tuxedo", stock: 200 },
    { name: "오페라 케이프 드레스", description: "오페라와 클래식 공연을 위한 드라마틱한 케이프 드레스. 긴 케이프가 무대 위 움직임에 극적인 효과를 더합니다.", category: "무대의상", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/2D2D2D/C9A96E?text=Opera+Cape", stock: 100 },

    // 한복퓨전
    { name: "모던 한복 - 화이트&골드", description: "전통 한복의 선을 현대적으로 재해석한 퓨전 한복. 순백의 저고리에 골드 자수 장식, 부드러운 실크 치마가 조화를 이룹니다.", category: "한복퓨전", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FDFBF7/A8893F?text=Modern+Hanbok+W", stock: 150 },
    { name: "모던 한복 - 블랙&골드", description: "블랙과 골드의 대비가 강렬한 모던 한복. 명절, 결혼식 등 격식 있는 자리에 어울리는 세련된 디자인.", category: "한복퓨전", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/1A1A1A/C9A96E?text=Modern+Hanbok+B", stock: 120 },
    { name: "퓨전 한복 드레스", description: "한복의 저고리 라인과 서양 드레스의 스커트를 결합한 퓨전 디자인. 해외 행사나 한국 문화 이벤트에 적합합니다.", category: "한복퓨전", size: "S", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/F5E6CC/1A1A1A?text=Fusion+Hanbok+D", stock: 150 },

    // 남성정장
    { name: "앙드레김 시그니처 화이트 수트", description: "앙드레김 본인이 즐겨 입던 올 화이트 수트의 현대적 재해석. 이탈리안 울 소재에 골드 단추가 포인트.", category: "남성정장", size: "L", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/FDFBF7/8A8478?text=Signature+White", stock: 150 },
    { name: "클래식 블랙 포멀 수트", description: "웨딩, 시상식 등 격식 있는 행사를 위한 클래식 블랙 수트. 슬림한 실루엣과 세밀한 재단이 돋보입니다.", category: "남성정장", size: "M", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/1A1A1A/FDFBF7?text=Classic+Black", stock: 200 },
    { name: "네이비 더블 브레스트 수트", description: "격조 있는 네이비 더블 브레스트 수트. 골드 단추와 실크 포켓스퀘어가 포함된 프리미엄 세트.", category: "남성정장", size: "L", price: BASE_PRICE, imageUrl: "https://placehold.co/400x533/1B3A5C/C9A96E?text=Navy+Double", stock: 150 },
  ];

  for (const costume of costumes) {
    await prisma.costume.create({ data: costume });
  }

  console.log("Seed data created successfully!");
  console.log("=".repeat(50));
  console.log("기본 단가: 500,000원/벌/일");
  console.log("10벌+: 450,000원 | 50벌+: 380,000원 | 100벌+: 300,000원");
  console.log("=".repeat(50));
  console.log("Admin: admin@andrekim.com / admin123");
  console.log("User:  guest@test.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
