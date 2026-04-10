export type Material = {
  id: string;
  name: string;
  price: number;
  description?: string;
  properties?: { thickness?: string; warmth?: string; softness?: string };
};

export type Color = {
  id: string;
  name: string;
  hex: string;
};

export type Size = {
  id: string;
  name: string;
};

export type EmbroideryColor = {
  id: string;
  name: string;
  hex: string;
};

export type EmbroideryPosition = {
  id: string;
  name: string;
};

export type EmbroideryType = {
  id: string;
  name: string;
  description: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  materials: Material[];
  colors: Color[];
  sizes?: Size[];
  variants?: ProductVariant[];
  allowEngraving: boolean;
  engravingPrice: number;
  engravingPositions?: EmbroideryPosition[];
  trimColors?: Color[];
};

export type PackagingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  freeThreshold?: number;
};

export type PresetKit = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  items: string[];
  materialPreset: Record<string, string>;
  packagingId: string;
};

// ─── Colors ───────────────────────────────────────────

export const COLORS: Color[] = [
  { id: "snow", name: "Снежный", hex: "#FFFAFA" },
  { id: "cream", name: "Кремовый", hex: "#F5F0E8" },
  { id: "ivory", name: "Слоновая кость", hex: "#FFFFF0" },
  { id: "sand", name: "Песочный", hex: "#D4C5A9" },
  { id: "latte", name: "Латте", hex: "#C4A882" },
  { id: "taupe", name: "Тауп", hex: "#8B7D6B" },
  { id: "ash", name: "Пепельный", hex: "#B2BEB5" },
  { id: "graphite", name: "Графит", hex: "#4A4A4A" },
  { id: "anthracite", name: "Антрацит", hex: "#2D2D2D" },
  { id: "sage", name: "Шалфей", hex: "#87A96B" },
  { id: "forest", name: "Хвойный", hex: "#2D5F3E" },
  { id: "olive", name: "Олива", hex: "#6B7B3A" },
  { id: "dusty-rose", name: "Пыльная роза", hex: "#C4A4A7" },
  { id: "terracotta", name: "Терракота", hex: "#C4714E" },
  { id: "burgundy", name: "Бургунди", hex: "#6B2D3E" },
  { id: "navy", name: "Тёмно-синий", hex: "#1B3A5C" },
  { id: "indigo", name: "Индиго", hex: "#3F5277" },
  { id: "cognac", name: "Коньяк", hex: "#834A2E" },
  { id: "chocolate", name: "Шоколад", hex: "#5C3317" },
  { id: "black", name: "Чёрный", hex: "#1A1A1A" },
];

export const FELT_COLORS: Color[] = [
  { id: "snow", name: "Снежный", hex: "#FFFAFA" },
  { id: "cream", name: "Кремовый", hex: "#F5F0E8" },
  { id: "ash", name: "Пепельный", hex: "#B2BEB5" },
  { id: "graphite", name: "Графит", hex: "#4A4A4A" },
  { id: "anthracite", name: "Антрацит", hex: "#2D2D2D" },
  { id: "sage", name: "Шалфей", hex: "#87A96B" },
  { id: "burgundy", name: "Бургунди", hex: "#6B2D3E" },
  { id: "cognac", name: "Коньяк", hex: "#834A2E" },
];

export const UNIVERSAL_COLORS: Color[] = [
  { id: "snow", name: "Снежный", hex: "#FFFAFA" },
  { id: "cream", name: "Кремовый", hex: "#F5F0E8" },
  { id: "anthracite", name: "Антрацит", hex: "#2D2D2D" },
];

// ─── Embroidery ───────────────────────────────────────

export const EMBROIDERY_COLORS: EmbroideryColor[] = [
  { id: "gold", name: "Золото", hex: "#C9A96E" },
  { id: "silver", name: "Серебро", hex: "#C0C0C0" },
  { id: "white", name: "Белый", hex: "#FFFFFF" },
  { id: "black", name: "Чёрный", hex: "#1A1A1A" },
  { id: "navy", name: "Тёмно-синий", hex: "#1B3A5C" },
  { id: "burgundy", name: "Бургунди", hex: "#6B2D3E" },
  { id: "forest", name: "Хвойный", hex: "#2D5F3E" },
];

export const EMBROIDERY_TYPES: EmbroideryType[] = [
  { id: "none", name: "Без вышивки", description: "Чистый вид без нанесений" },
  { id: "logo", name: "Логотип ПАРЪ", description: "Фирменная вышивка бренда ПАРЪ" },
  { id: "monogram", name: "Монограмма", description: "Инициалы в классическом стиле (1–3 буквы)" },
  { id: "name", name: "Имя", description: "Полное имя или фамилия (до 15 символов)" },
  { id: "phrase", name: "Фраза", description: "Любой текст или пожелание (до 30 символов)" },
];

export const ENGRAVING_FONTS = [
  { id: "serif", name: "Классический", sample: "АБВ", css: "font-serif" },
  { id: "script", name: "Рукописный", sample: "АБВ", css: "italic" },
  { id: "sans", name: "Современный", sample: "АБВ", css: "font-sans" },
  { id: "oldrus", name: "Старорусский", sample: "АБВ", css: "font-serif tracking-widest" },
];

// ─── Trim / edging colors ─────────────────────────────

export const TRIM_COLORS: Color[] = [
  { id: "gold-trim", name: "Золотой", hex: "#C9A96E" },
  { id: "silver-trim", name: "Серебряный", hex: "#C0C0C0" },
  { id: "natural-trim", name: "В тон ткани", hex: "#D4C5A9" },
  { id: "contrast-trim", name: "Контрастный", hex: "#4A4A4A" },
];

// ─── Products ─────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: "hat",
    name: "Банная шапка",
    description: "Защита от перегрева. Натуральная шерсть, ручная валка.",
    image: "/images/product-sauna-hat.png",
    materials: [
      { id: "felt-standard", name: "Войлок", price: 1900, description: "Плотный натуральный войлок 5 мм", properties: { thickness: "5-6 мм", warmth: "Высокая", softness: "Средняя" } },
      { id: "felt-premium", name: "Войлок премиум", price: 2900, description: "Утолщённый 8 мм, ручная валка", properties: { thickness: "8 мм", warmth: "Очень высокая", softness: "Средняя" } },
      { id: "felt-merino", name: "Меринос", price: 3400, description: "Тончайшая шерсть мериноса, мягкий", properties: { thickness: "6-8 мм", warmth: "Очень высокая", softness: "Высокая" } },
      { id: "felt-fetl", name: "Фетр", price: 2400, description: "Гладкий плотный фетр", properties: { thickness: "4-5 мм", warmth: "Средняя", softness: "Средняя" } },
    ],
    colors: UNIVERSAL_COLORS,
    variants: [
      { id: "kolpak", name: "Колпак", description: "Классическая остроконечная форма", image: "/images/hat-kolpak.png" },
      { id: "budenovka", name: "Будёновка", description: "С отворотами и козырьком", image: "/images/hat-budenovka.png" },
      { id: "ushanka", name: "Ушанка", description: "С опускающимися ушками", image: "/images/hat-ushanka.png" },
      { id: "panama", name: "Панама", description: "С полями, расслабленный стиль", image: "/images/hat-panama.png" },
    ],
    allowEngraving: true,
    engravingPrice: 500,
    engravingPositions: [
      { id: "front-center", name: "Спереди по центру" },
      { id: "front-side", name: "Спереди сбоку" },
    ],
  },
  {
    id: "towel",
    name: "Банное полотенце",
    description: "70x140 см. Натуральные ткани, превосходное впитывание.",
    image: "/images/product-towel.png",
    materials: [
      { id: "cotton-400", name: "Хлопок 400 г/м²", price: 2200, description: "Классический плотный хлопок", properties: { thickness: "400 г/м²", warmth: "Средняя", softness: "Высокая" } },
      { id: "cotton-500", name: "Хлопок 500 г/м²", price: 2600, description: "Повышенная плотность, люкс", properties: { thickness: "500 г/м²", warmth: "Высокая", softness: "Высокая" } },
      { id: "bamboo", name: "Бамбук", price: 2800, description: "Антибактериальный, шелковистый", properties: { thickness: "450 г/м²", warmth: "Средняя", softness: "Премиальная" } },
      { id: "linen", name: "Лён 100%", price: 3200, description: "Натуральный, прочный, дышащий", properties: { thickness: "350 г/м²", warmth: "Средняя", softness: "Средняя" } },
      { id: "linen-waffle", name: "Лён вафельный", price: 3500, description: "Рельефное плетение, массажный эффект", properties: { thickness: "380 г/м²", warmth: "Средняя", softness: "Средняя" } },
    ],
    colors: UNIVERSAL_COLORS,
    allowEngraving: true,
    engravingPrice: 500,
    engravingPositions: [
      { id: "corner", name: "В углу" },
      { id: "center-edge", name: "По центру края" },
      { id: "wide-border", name: "Бордюр по краю" },
    ],
    trimColors: TRIM_COLORS,
  },
  {
    id: "robe",
    name: "Банный халат",
    description: "Свободный крой, комфорт и элегантность после парной.",
    image: "/images/product-linen-robe.png",
    materials: [
      { id: "cotton-terry", name: "Хлопок махровый", price: 5900, description: "Мягкий, тёплый, классика", properties: { thickness: "450 г/м²", warmth: "Высокая", softness: "Высокая" } },
      { id: "cotton-waffle", name: "Хлопок вафельный", price: 5200, description: "Лёгкий, быстро сохнет", properties: { thickness: "280 г/м²", warmth: "Средняя", softness: "Средняя" } },
      { id: "bamboo-terry", name: "Бамбук махровый", price: 7900, description: "Шелковистый, гипоаллергенный", properties: { thickness: "500 г/м²", warmth: "Высокая", softness: "Премиальная" } },
      { id: "linen", name: "Лён", price: 8900, description: "Натуральный лён, дышащий", properties: { thickness: "300 г/м²", warmth: "Средняя", softness: "Средняя" } },
      { id: "linen-cotton", name: "Лён/хлопок", price: 7200, description: "Смесь 50/50, мягче чистого льна", properties: { thickness: "350 г/м²", warmth: "Средняя", softness: "Высокая" } },
    ],
    colors: UNIVERSAL_COLORS,
    sizes: [
      { id: "s", name: "S (44-46)" },
      { id: "m", name: "M (48-50)" },
      { id: "l", name: "L (52-54)" },
      { id: "xl", name: "XL (56-58)" },
      { id: "xxl", name: "XXL (60-62)" },
    ],
    allowEngraving: true,
    engravingPrice: 500,
    engravingPositions: [
      { id: "chest-left", name: "Нагрудный карман (левый)" },
      { id: "chest-right", name: "Нагрудный карман (правый)" },
      { id: "back-top", name: "Спина сверху" },
      { id: "back-large", name: "Спина крупно" },
    ],
    trimColors: TRIM_COLORS,
  },
  {
    id: "kilt",
    name: "Банный килт",
    description: "На регулируемой застёжке. Удобная альтернатива полотенцу.",
    image: "/images/product-kilt.png",
    materials: [
      { id: "cotton", name: "Хлопок", price: 2400, description: "Классический мягкий хлопок", properties: { thickness: "400 г/м²", warmth: "Средняя", softness: "Высокая" } },
      { id: "cotton-waffle", name: "Хлопок вафельный", price: 2800, description: "Рельефное плетение, лёгкий", properties: { thickness: "280 г/м²", warmth: "Средняя", softness: "Средняя" } },
      { id: "linen-cotton", name: "Лён/хлопок", price: 3200, description: "Смесь 50/50, прочный", properties: { thickness: "350 г/м²", warmth: "Средняя", softness: "Высокая" } },
      { id: "linen", name: "Лён 100%", price: 3900, description: "Натуральный, дышащий лён", properties: { thickness: "300 г/м²", warmth: "Средняя", softness: "Средняя" } },
    ],
    colors: UNIVERSAL_COLORS,
    sizes: [
      { id: "m", name: "M (48-50)" },
      { id: "l", name: "L (52-54)" },
      { id: "xl", name: "XL (56-58)" },
      { id: "xxl", name: "XXL (60-62)" },
    ],
    allowEngraving: true,
    engravingPrice: 500,
    engravingPositions: [
      { id: "bottom-corner", name: "Нижний угол" },
      { id: "center-front", name: "Спереди по центру" },
    ],
    trimColors: TRIM_COLORS,
  },
  {
    id: "mat",
    name: "Подстилка",
    description: "50x150 см. Гигиеничный барьер между вами и полком.",
    image: "/images/product-mat.png",
    materials: [
      { id: "felt", name: "Войлок", price: 1800, description: "Плотный натуральный войлок", properties: { thickness: "6 мм", warmth: "Высокая", softness: "Средняя" } },
      { id: "felt-premium", name: "Войлок премиум", price: 2400, description: "Утолщённый, двойной слой", properties: { thickness: "10 мм", warmth: "Очень высокая", softness: "Средняя" } },
      { id: "linen", name: "Лён", price: 2900, description: "Натуральный лён с подкладкой", properties: { thickness: "4 мм", warmth: "Средняя", softness: "Высокая" } },
    ],
    colors: UNIVERSAL_COLORS,
    allowEngraving: false,
    engravingPrice: 0,
    trimColors: TRIM_COLORS,
  },
  {
    id: "slippers",
    name: "Банные тапочки",
    description: "Войлок ручной работы. Не нагреваются, защищают от грибка.",
    image: "/images/product-slippers.png",
    materials: [
      { id: "felt-standard", name: "Войлок", price: 1400, description: "Натуральный плотный войлок", properties: { thickness: "6 мм", warmth: "Высокая", softness: "Средняя" } },
      { id: "felt-premium", name: "Войлок премиум", price: 2200, description: "Утолщённый, двойная подошва", properties: { thickness: "10 мм", warmth: "Очень высокая", softness: "Средняя" } },
      { id: "felt-merino", name: "Меринос", price: 2800, description: "Мягчайшая шерсть мериноса", properties: { thickness: "8 мм", warmth: "Очень высокая", softness: "Премиальная" } },
    ],
    colors: UNIVERSAL_COLORS,
    sizes: [
      { id: "36-37", name: "36-37" },
      { id: "38-39", name: "38-39" },
      { id: "40-41", name: "40-41" },
      { id: "42-43", name: "42-43" },
      { id: "44-45", name: "44-45" },
      { id: "46-47", name: "46-47" },
    ],
    allowEngraving: false,
    engravingPrice: 0,
  },
  {
    id: "bag",
    name: "Сумка-кейс",
    description: "Стильная упаковка для комплекта. Используется повторно.",
    image: "/images/product-bag.png",
    materials: [
      { id: "linen-bag", name: "Льняная сумка", price: 1900, description: "Элегантный натуральный лён", properties: { thickness: "Лёгкая", softness: "Высокая" } },
      { id: "canvas-bag", name: "Канвас", price: 2900, description: "Плотный хлопковый канвас", properties: { thickness: "Плотная", softness: "Средняя" } },
      { id: "leather-bag", name: "Кожаная сумка", price: 4900, description: "Натуральная кожа, золотая фурнитура", properties: { thickness: "Плотная", softness: "Высокая" } },
      { id: "vip-case", name: "VIP кожаный кейс", price: 7900, description: "Ручная работа, полированная кожа", properties: { thickness: "Премиальная", softness: "Премиальная" } },
    ],
    colors: [
      { id: "sand", name: "Песочный", hex: "#D4C5A9" },
      { id: "cognac", name: "Коньяк", hex: "#834A2E" },
      { id: "chocolate", name: "Шоколад", hex: "#5C3317" },
      { id: "graphite", name: "Графит", hex: "#4A4A4A" },
      { id: "black", name: "Чёрный", hex: "#1A1A1A" },
      { id: "olive", name: "Олива", hex: "#6B7B3A" },
      { id: "burgundy", name: "Бургунди", hex: "#6B2D3E" },
    ],
    allowEngraving: true,
    engravingPrice: 500,
    engravingPositions: [
      { id: "front-center", name: "Спереди по центру" },
      { id: "flap", name: "На клапане" },
    ],
  },
];

// ─── Material images ──────────────────────────────────

const MATERIAL_IMAGES: Record<string, Record<string, string>> = {
  hat: {
    "felt-standard": "/images/materials/hat/hat-felt-standard.png",
    "felt-premium": "/images/materials/hat/hat-felt-premium.png",
    "felt-merino": "/images/materials/hat/hat-felt-merino.png",
    "felt-fetl": "/images/materials/hat/hat-felt-fetl.png",
  },
  towel: {
    "cotton-400": "/images/materials/towel/towel-cotton-400.png",
    "cotton-500": "/images/materials/towel/towel-cotton-500.png",
    bamboo: "/images/materials/towel/towel-bamboo.png",
    linen: "/images/materials/towel/towel-linen.png",
    "linen-waffle": "/images/materials/towel/towel-linen-waffle.png",
  },
  robe: {
    "cotton-terry": "/images/materials/robe/robe-cotton-terry.png",
    "cotton-waffle": "/images/materials/robe/robe-cotton-waffle.png",
    "bamboo-terry": "/images/materials/robe/robe-bamboo-terry.png",
    linen: "/images/materials/robe/robe-linen.png",
    "linen-cotton": "/images/materials/robe/robe-linen-cotton.png",
  },
  kilt: {
    cotton: "/images/materials/kilt/kilt-cotton.png",
    "cotton-waffle": "/images/materials/kilt/kilt-cotton-waffle.png",
    "linen-cotton": "/images/materials/kilt/kilt-linen-cotton.png",
    linen: "/images/materials/kilt/kilt-linen.png",
  },
  mat: {
    felt: "/images/materials/mat/mat-felt.png",
    "felt-premium": "/images/materials/mat/mat-felt-premium.png",
    linen: "/images/materials/mat/mat-linen.png",
  },
  slippers: {
    "felt-standard": "/images/materials/slippers/slippers-felt.png",
    "felt-premium": "/images/materials/slippers/slippers-felt-premium.png",
    "felt-merino": "/images/materials/slippers/slippers-merino.png",
  },
  bag: {
    "linen-bag": "/images/materials/bag/bag-linen.png",
    "canvas-bag": "/images/materials/bag/bag-canvas.png",
    "leather-bag": "/images/materials/bag/bag-leather.png",
    "vip-case": "/images/materials/bag/bag-vip.png",
  },
};

export function getMaterialImage(productId: string, materialId: string): string | null {
  return MATERIAL_IMAGES[productId]?.[materialId] ?? null;
}

const LOGO_IMAGES: Record<string, string> = {
  robe: "/images/materials/robe/robe-logo-par.png",
  towel: "/images/materials/towel/towel-logo-par.png",
  kilt: "/images/materials/kilt/kilt-logo-par.png",
};

export function getLogoProductImage(productId: string): string | null {
  return LOGO_IMAGES[productId] ?? null;
}

// ─── Packaging ────────────────────────────────────────

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: "standard",
    name: "Стандартная упаковка",
    description: "Фирменная крафт-коробка ПАРЪ с тишью-бумагой",
    price: 0,
    image: "/images/packaging-standard.png",
  },
  {
    id: "linen-bag",
    name: "Льняная сумка",
    description: "Элегантная сумка из натурального льна с лого ПАРЪ",
    price: 1900,
    image: "/images/packaging-linen.png",
    freeThreshold: 3,
  },
  {
    id: "leather-bag",
    name: "Кожаная сумка",
    description: "Натуральная кожа с золотой фурнитурой и тиснением",
    price: 4900,
    image: "/images/packaging-leather.png",
  },
  {
    id: "vip-case",
    name: "VIP кожаный кейс",
    description: "Кейс ручной работы из полированной кожи с бархатной подкладкой",
    price: 7900,
    image: "/images/packaging-vip.png",
  },
];

// ─── Preset kits ──────────────────────────────────────

export const PRESET_KITS: PresetKit[] = [
  {
    id: "classic",
    name: "Классика",
    subtitle: "Для первого знакомства",
    description: "Банная шапка + полотенце + тапочки + льняная сумка",
    price: 7900,
    items: ["hat", "towel", "slippers"],
    materialPreset: {
      hat: "felt-standard",
      towel: "cotton-400",
      slippers: "felt-standard",
    },
    packagingId: "linen-bag",
  },
  {
    id: "master",
    name: "Мастер",
    subtitle: "Выбор знатоков",
    description: "Шапка + полотенце + килт + подстилка + тапочки + кожаная сумка",
    price: 16900,
    items: ["hat", "towel", "kilt", "mat", "slippers"],
    materialPreset: {
      hat: "felt-premium",
      towel: "bamboo",
      kilt: "linen-cotton",
      mat: "felt",
      slippers: "felt-premium",
    },
    packagingId: "leather-bag",
  },
  {
    id: "all-inclusive",
    name: "Абсолют",
    subtitle: "Без компромиссов",
    description: "Все 7 предметов в премиальных материалах + VIP кейс",
    price: 29900,
    items: ["hat", "towel", "robe", "kilt", "mat", "slippers", "bag"],
    materialPreset: {
      hat: "felt-merino",
      towel: "linen-waffle",
      robe: "linen",
      kilt: "linen",
      mat: "linen",
      slippers: "felt-merino",
      bag: "vip-case",
    },
    packagingId: "vip-case",
  },
];
