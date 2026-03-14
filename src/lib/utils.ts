import { differenceInDays, format } from "date-fns";
import { ko } from "date-fns/locale";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "yyyy년 MM월 dd일", { locale: ko });
}

// 수량별 단가 체계
export const PRICING_TIERS = [
  { min: 1, max: 9, unitPrice: 500000, label: "1~9벌" },
  { min: 10, max: 49, unitPrice: 450000, label: "10~49벌" },
  { min: 50, max: 99, unitPrice: 380000, label: "50~99벌" },
  { min: 100, max: Infinity, unitPrice: 300000, label: "100벌 이상" },
] as const;

export function getUnitPrice(quantity: number): number {
  const tier = PRICING_TIERS.find((t) => quantity >= t.min && quantity <= t.max);
  return tier ? tier.unitPrice : PRICING_TIERS[0].unitPrice;
}

export function calculateTotalPrice(quantity: number, days: number): number {
  const unitPrice = getUnitPrice(quantity);
  return unitPrice * quantity * Math.max(days, 1);
}

export function getDaysFromDates(startDate: Date | string, endDate: Date | string): number {
  const days = differenceInDays(new Date(endDate), new Date(startDate));
  return Math.max(days, 1);
}

export function getRentalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "예약 대기",
    CONFIRMED: "확정",
    RENTED: "대여 중",
    RETURNED: "반납 완료",
    CANCELLED: "취소",
  };
  return labels[status] || status;
}

export function getRentalStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    RENTED: "bg-green-100 text-green-800",
    RETURNED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export const CATEGORIES = ["웨딩드레스", "이브닝가운", "겹옷드레스", "무대의상", "한복퓨전", "남성정장"] as const;
export const SIZES = ["XS", "S", "M", "L", "XL", "Free"] as const;
