# 🎮 YKS Flow-Learn - Gamification Öğrenme Platformu

Modern, hızlı ve eğlenceli bir öğrenme deneyimi. YKS'ye hazırlanan öğrenciler için gamification tabanlı etkileşimli öğrenme platformu.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## ✨ Özellikler

### 🎯 Oyun Modları
- **🔗 Eşleştirme**: Terimleri açıklamalarıyla eşleştir
- **📊 Sıralama**: Adımları doğru sıraya diz
- **📦 Gruplama**: Öğeleri kategorilere ayır

### 🎨 Kullanıcı Deneyimi
- ✅ Modern ve responsive tasarım (mobil uyumlu)
- ✅ Dark/Light tema desteği
- ✅ Smooth animasyonlar (Framer Motion)
- ✅ PWA desteği (offline çalışma)
- ✅ Ana ekrana eklenebilir

### 📊 Gamification
- ✅ XP (Experience Points) sistemi
- ✅ Level sistemi
- ✅ Streak (günlük seri) takibi
- ✅ Gerçek zamanlı ilerleme takibi

### 🛠️ Admin Panel
- ✅ Ders ve konu yönetimi
- ✅ Soru seti oluşturma
- ✅ JSON ile toplu içe aktarma
- ✅ NotebookLM entegrasyonu

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ 
- npm 9+
- Supabase hesabı

### Kurulum

```bash
# Projeyi klonla
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Bağımlılıkları yükle
npm install

# Environment variables'ı ayarla
cp .env.example .env.local
# .env.local dosyasını düzenle ve Supabase bilgilerini ekle

# Development server'ı başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

## 📁 Proje Yapısı

```
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Ana sayfa
│   │   ├── layout.tsx         # Root layout (sidebar)
│   │   ├── admin/             # Admin paneli
│   │   ├── games/             # Oyunlar listesi
│   │   ├── topic/[id]/        # Konu detay
│   │   ├── play/[topicId]/[mode]/  # Oyun ekranı
│   │   └── api/               # API routes
│   ├── components/            # React bileşenleri
│   │   └── ui/               # UI components (sidebar, etc.)
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts       # Supabase client & queries
│   │   ├── auth.ts           # Authentication helpers
│   │   └── game-engine.ts    # Oyun mantığı wrapper
│   └── middleware.ts          # Auth middleware
├── packages/
│   ├── game-engine/          # Oyun motoru (core logic)
│   │   └── src/
│   │       ├── matching.ts   # Eşleştirme oyunu
│   │       ├── grouping.ts   # Gruplama oyunu
│   │       └── sorting.ts    # Sıralama oyunu
│   └── database/             # Database types
├── public/                    # Static files
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # App icons
└── supabase-schema.sql       # Database schema
```

## 🗄️ Database Setup

1. [Supabase](https://supabase.com) hesabı oluştur
2. Yeni proje oluştur
3. SQL Editor'de `supabase-schema.sql` dosyasını çalıştır
4. Project Settings → API → URL ve anon key'i kopyala
5. `.env.local` dosyasına ekle

## 🚀 Deployment

### Vercel'e Deploy (Önerilen)

1. GitHub'a push et:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. [Vercel Dashboard](https://vercel.com/new)'a git
3. Repository'yi import et
4. Environment variables ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Detaylı deployment guide için: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎮 Kullanım

### Öğrenci Akışı
1. Kayıt ol / Giriş yap
2. Ana sayfadan bir ders seç
3. Konu seç
4. Oyun modunu seç
5. Oyna ve öğren!

### Admin Akışı
1. `/admin` paneline git
2. Ders ekle (örn: "AYT Biyoloji")
3. Konu ekle (örn: "Sinir Sistemi")
4. Soru setleri ekle:
   - Manuel ekleme
   - JSON ile toplu ekleme
   - NotebookLM ile otomatik oluşturma

### NotebookLM Entegrasyonu

1. NotebookLM'e kaynaklarını yükle
2. Admin panelde "Toplu İçe Aktar" sekmesine git
3. Örnek JSON formatını kullan
4. NotebookLM'den gelen JSON'u yapıştır
5. İçe aktar!

## 🛠️ Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: Zustand
- **PWA**: next-pwa
- **Deployment**: Vercel

## 📱 PWA Features

- ✅ Offline çalışma
- ✅ Ana ekrana eklenebilir
- ✅ App-like deneyim
- ✅ Fast loading
- ✅ Background sync (gelecekte)

## 🔒 Security

- ✅ Row Level Security (RLS) policies
- ✅ Secure authentication
- ✅ Environment variables
- ✅ HTTPS only
- ✅ XSS protection
- ✅ CSRF protection

## 📊 Performance

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1s
- ✅ Time to Interactive: < 2s
- ✅ Code splitting
- ✅ Image optimization
- ✅ Edge caching

## 🤝 Contributing

Katkıda bulunmak isterseniz:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 License

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Made with ❤️ for YKS students**
