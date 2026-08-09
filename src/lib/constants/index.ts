import type { AppConfig, NavLink } from "@/types";

export const APP_CONFIG: AppConfig = {
  name: "Demo of Car Selling Website",
  nameAr: "ديمو موقع بيع السيارات",
  defaultLocale: "ar",
  locales: ["ar", "en"],
  description: "Premium Luxury Car Marketplace in Kuwait",
  descriptionAr: "سوق السيارات الفاخرة في الكويت",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "Home",
    labelAr: "الرئيسية",
    href: "/",
  },
  {
    label: "Vehicles",
    labelAr: "السيارات",
    href: "/vehicles",
  },
  {
    label: "About",
    labelAr: "من نحن",
    href: "/about",
  },
  {
    label: "Contact",
    labelAr: "اتصل بنا",
    href: "/contact",
  },
];

export const VEHICLE_MAKES = [
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Porsche",
  "Lamborghini",
  "Ferrari",
  "Bentley",
  "Rolls-Royce",
  "Aston Martin",
  "McLaren",
  "Range Rover",
  "Cadillac",
  "Lincoln",
  "Lexus",
  "Maserati",
  "Geely",
  "Toyota",
  "Nissan",
  "Chevrolet",
  "Ford",
] as const;

export const VEHICLE_BODY_TYPES = [
  { value: "sedan", labelAr: "سيدان", label: "Sedan" },
  { value: "suv", labelAr: "SUV", label: "SUV" },
  { value: "coupe", labelAr: "كوبيه", label: "Coupe" },
  { value: "convertible", labelAr: "كابريو", label: "Convertible" },
  { value: "hatchback", labelAr: "هاتشباك", label: "Hatchback" },
  { value: "truck", labelAr: "شاحنة", label: "Truck" },
  { value: "van", labelAr: "فان", label: "Van" },
  { value: "wagon", labelAr: "واagon", label: "Wagon" },
] as const;

export const FUEL_TYPES = [
  { value: "gasoline", labelAr: "بنزين", label: "Gasoline" },
  { value: "diesel", labelAr: "ديزل", label: "Diesel" },
  { value: "electric", labelAr: "كهرباء", label: "Electric" },
  { value: "hybrid", labelAr: "هايبرد", label: "Hybrid" },
] as const;

export const TRANSMISSION_TYPES = [
  { value: "automatic", labelAr: "أوتوماتيك", label: "Automatic" },
  { value: "manual", labelAr: "يدوي", label: "Manual" },
] as const;

export const VEHICLE_STATUSES = [
  { value: "available", labelAr: "متاحة", label: "Available" },
  { value: "sold", labelAr: "مباعة", label: "Sold" },
  { value: "reserved", labelAr: "محجوزة", label: "Reserved" },
  { value: "pending", labelAr: "قيد المراجعة", label: "Pending" },
] as const;

export const VEHICLE_CONDITIONS = [
  { value: "new", labelAr: "جديدة", label: "New" },
  { value: "used", labelAr: "مستعملة", label: "Used" },
] as const;

export const VEHICLE_COLORS = [
  { value: "black", labelAr: "أسود", label: "Black" },
  { value: "white", labelAr: "أبيض", label: "White" },
  { value: "silver", labelAr: "فضي", label: "Silver" },
  { value: "gray", labelAr: "رمادي", label: "Gray" },
  { value: "blue", labelAr: "أزرق", label: "Blue" },
  { value: "red", labelAr: "أحمر", label: "Red" },
  { value: "green", labelAr: "أخضر", label: "Green" },
  { value: "brown", labelAr: "بني", label: "Brown" },
  { value: "beige", labelAr: "بيج", label: "Beige" },
  { value: "orange", labelAr: "برتقالي", label: "Orange" },
  { value: "gold", labelAr: "ذهبي", label: "Gold" },
  { value: "other", labelAr: "أخرى", label: "Other" },
] as const;

export const CURRENCY = {
  code: "KWD",
  symbol: "د.ك",
  name: "Kuwaiti Dinar",
  nameAr: "دينار كويتي",
};

export const CONTACT_INFO = {
  phone: "+923067578890",
  phoneFormatted: "+92 306 757 8890",
  email: "meharwebagency@gmail.com",
  workingHours: "Sun - Thu: 9:00 AM - 6:00 PM",
  workingHoursAr: "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً",
  whatsapp: "+923067578890",
};

export const SOCIAL_LINKS = {
  twitter: "",
  facebook: "",
  tiktok: "",
};

export const LOGO_URL = "";

export const META_DEFAULTS = {
  title: {
    ar: "ديمو موقع بيع السيارات | سوق السيارات الفاخرة في الكويت",
    en: "Demo of Car Selling Website | Premium Luxury Car Marketplace in Kuwait",
  },
  description: {
    ar: "اكتشف أفضل السيارات الفاخرة في الكويت. سوق السيارات المميز من ديمو موقع بيع السيارات.",
    en: "Discover the finest luxury and premium cars in Kuwait. A distinguished car market from Demo of Car Selling Website.",
  },
  keywords: {
    ar: [
      "سيارات فاخرة",
      "سيارات مستعملة",
      "الكويت",
      "ديمو موقع بيع السيارات",
      "سيارات مرسيديس",
      "سيارات بي ام دبليو",
    ],
    en: [
      "luxury cars",
      "used cars",
      "Kuwait",
      "Demo of Car Selling Website",
      "Mercedes",
      "BMW",
    ],
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 48,
} as const;

export const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 200 },
  card: { width: 600, height: 400 },
  hero: { width: 1200, height: 600 },
  gallery: { width: 1920, height: 1080 },
} as const;
