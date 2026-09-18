export interface AssetDefinition {
  id: string;
  name: string;
  nameEn: string;
  category: "furniture" | "character";
  icon: string;
  description: string;
  descriptionEn: string;
  defaultScale: number;
}

export const ASSET_LIBRARY: AssetDefinition[] = [
  // --- عناصر الأثاث والتجهيزات ---
  {
    id: "desk",
    name: "مكتب استقبال خشبي",
    nameEn: "Museum Reception Desk",
    category: "furniture",
    icon: "🛋️",
    description: "مكتب راقٍ مع شاشة حاسوب وكتيبات إرشادية",
    descriptionEn: "Modern wooden desk with computer and brochures",
    defaultScale: 1,
  },
  {
    id: "chair",
    name: "كرسي معرض حديث",
    nameEn: "Gallery Armchair",
    category: "furniture",
    icon: "🪑",
    description: "كرسي أنيق مريح لراحة زوار المعرض",
    descriptionEn: "Comfortable modern gallery armchair with wooden legs",
    defaultScale: 1,
  },
  {
    id: "bench",
    name: "مقعد زوار جلدي",
    nameEn: "Museum Viewing Bench",
    category: "furniture",
    icon: "🛋️",
    description: "مقعد طويل في منتصف القاعة لتأمل المعروضات",
    descriptionEn: "Long upholstered bench for viewing artwork comfortably",
    defaultScale: 1,
  },
  {
    id: "pedestal",
    name: "قاعدة عرض مع تمثال ذهبي",
    nameEn: "Sculpture Pedestal",
    category: "furniture",
    icon: "🏛️",
    description: "قاعدة رخامية تحمل تمثالاً فنياً ذهبياً مجرداً",
    descriptionEn: "Marble plinth topped with an abstract golden sculpture",
    defaultScale: 1,
  },
  {
    id: "showcase",
    name: "طاولة عرض زجاجية مضيئة",
    nameEn: "Glass Display Showcase",
    category: "furniture",
    icon: "💎",
    description: "صندوق زجاجي فاخر لعرض التحف الثمينة والمجوهرات",
    descriptionEn: "Glass display cabinet containing rare illuminated artifacts",
    defaultScale: 1,
  },
  {
    id: "plant",
    name: "نبات زينة داخلي",
    nameEn: "Gallery Indoor Plant",
    category: "furniture",
    icon: "🪴",
    description: "حوض نبات أخضر لإضفاء الحيوية على أجواء المتحف",
    descriptionEn: "Lush potted plant in ceramic vase adding vibrant greenery",
    defaultScale: 1,
  },
  {
    id: "stanchion",
    name: "حاجز أمان مخملي",
    nameEn: "Velvet Rope Stanchions",
    category: "furniture",
    icon: "🚧",
    description: "أعمدة معدنية لامعة مع حبل مخملي لحماية اللوحات",
    descriptionEn: "Polished brass stanchion posts with royal red velvet rope",
    defaultScale: 1,
  },

  // --- الشخصيات المتحركة ---
  {
    id: "visitor_standing",
    name: "زائر يتأمل (متحرك)",
    nameEn: "Art Admirer (Animated)",
    category: "character",
    icon: "🚶",
    description: "شخصية زائر مع حركة تنفس طبيعية وتمايل الرأس نحو اللوحات",
    descriptionEn: "Animated visitor with breathing and curious head movements",
    defaultScale: 1,
  },
  {
    id: "visitor_walking",
    name: "زائر يتجول (متحرك)",
    nameEn: "Strolling Visitor (Animated)",
    category: "character",
    icon: "🚶‍♂️",
    description: "شخصية زائر تتجول بحركة أذرع وسيقان حية في أرجاء القاعة",
    descriptionEn: "Animated walking avatar pacing naturally with arm swings",
    defaultScale: 1,
  },
  {
    id: "museum_guide",
    name: "مرشد المتحف (متحرك)",
    nameEn: "Museum Guide (Animated)",
    category: "character",
    icon: "🧑‍💼",
    description: "مرشد رسمي يقدم شروحات بحركات يدين وإيماءات حية",
    descriptionEn: "Animated gallery curator gesturing and explaining artworks",
    defaultScale: 1,
  },
  {
    id: "security_guard",
    name: "حارس أمن المعرض",
    nameEn: "Gallery Security Guard",
    category: "character",
    icon: "👮",
    description: "حارس بزي رسمي بحركة مراقبة والتفات وتفقد أمان المعرض",
    descriptionEn: "Uniformed security guard observing and scanning the gallery",
    defaultScale: 1,
  },
];

