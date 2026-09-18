# منصة المعارض الافتراضية ثلاثية الأبعاد (Artsteps Clone) — MVP

منصة ويب لإنشاء متاحف ومعارض افتراضية ثلاثية الأبعاد، مشابهة لـ Artsteps.

## هيكل المشروع

```
artsteps-clone/
├── backend/          # Node.js + Express + TypeScript + Prisma
│   ├── prisma/schema.prisma
│   └── src/
│       ├── routes/          # مسارات API
│       ├── controllers/     # منطق الأعمال
│       ├── middleware/      # التحقق من JWT
│       └── index.ts         # نقطة الدخول
└── frontend/         # React + TypeScript + React Three Fiber
    └── src/
        ├── pages/            # الرئيسية، الدخول، لوحة التحكم، المحرر، العرض، المشاركة
        ├── components/
        │   ├── editor/       # الجدران، إطارات الوسائط، اللوحة الرئيسية
        │   ├── viewer/       # التجول Fist-Person + الخريطة المصغرة
        │   └── layout/       # شريط التنقل وحماية المسارات
        ├── store/            # Zustand (المصادقة + المحرر)
        └── i18n/             # الترجمات AR/EN مع دعم RTL
```

## المتطلبات

- Node.js 18+ و npm

## التشغيل (المرحلة الأولى — التطوير المحلي)

### 1) الباكند

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate     # ينشئ قاعدة بيانات SQLite محليًا (dev.db)
npm run dev                # يشغّل السيرفر على http://localhost:4000
```

### 2) الفرونتند (نافذة طرفية جديدة)

```bash
cd frontend
npm install
npm run dev                # يشغّل الواجهة على http://localhost:5173
```

افتح المتصفح على `http://localhost:5173`.

## سيناريو تجربة الـ MVP

1. أنشئ حسابًا من صفحة "إنشاء حساب".
2. من لوحة التحكم اضغط "متحف جديد" — يُنشأ تلقائيًا بغرفة مستطيلة بجدران أربعة.
3. في المحرر: عدّل أبعاد الغرفة وألوانها من اللوحة اليسرى، ثم ارفع صورة واختر الجدار الذي ستوضع عليه.
4. اضغط "معاينة المتحف" للتجول داخله بصيغة الشخص الأول (WASD + الماوس، اضغط داخل الشاشة لتفعيل قفل المؤشر).
5. من لوحة التحكم اضغط "مشاركة" للحصول على رابط عام + QR Code + كود تضمين iframe.

## التبديل إلى PostgreSQL (بدلاً من SQLite)

في `backend/prisma/schema.prisma` غيّر:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

وفي `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/artsteps"
```

ثم: `npm run prisma:migrate`

## المراحل القادمة (بعد الـ MVP)

| المرحلة | الوصف |
|---|---|
| 2 | تسجيل دخول بـ Google (OAuth)، دعم فيديو/PDF/صوت كعناصر معروضة |
| 3 | دعم نماذج GLB/GLTF ثلاثية الأبعاد، غرف متعددة وأبواب/نوافذ حقيقية |
| 4 | أدوات AI: توليد تصميم المتحف من نص، اقتراح توزيع الصور والإضاءة |
| 5 | تحسينات الأداء: ضغط الصور تلقائيًا، Lazy Loading للنماذج الثقيلة |
| 6 | الانتقال إلى PostgreSQL + Cloudinary/Supabase Storage للإنتاج |

## ملاحظات تقنية مهمة

- الصور تُخزَّن حاليًا محليًا في `backend/uploads` — للإنتاج استبدلها بـ Cloudinary أو Supabase Storage (مذكور في المتطلبات).
- تحريك موضع الصورة على المحور X داخل المحرر (شريط التمرير) تعديل محلي للمعاينة الفورية؛ لحفظه بشكل دائم أضِف نداء `PUT` مشابه لتحديثات الغرفة عند تحرير الفأرة (`onMouseUp`).
- `JWT_SECRET` في `.env.example` يجب تغييره في بيئة الإنتاج.
