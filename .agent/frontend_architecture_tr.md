# WatchHub Frontend Mimarisi

> Son güncelleme: 27 Ocak 2026

## 📖 Genel Bakış

WatchHub, arkadaşlarla senkronize video izleme ve sohbet etme imkanı sunan bir web uygulamasıdır. Frontend, **React + Vite** ile geliştirilmiştir ve gerçek zamanlı iletişim için **Socket.IO** kullanır.

---

## 🗂️ Klasör Yapısı

```
frontend/src/
├── App.jsx                 # Ana uygulama ve routing
├── main.jsx                # React entry point
├── index.css               # Global stiller ve CSS değişkenleri
│
├── assets/                 # Statik dosyalar (görseller vb.)
│
├── components/             # Paylaşılan UI bileşenleri
│   ├── Button/
│   │   └── index.jsx       # Çoklu varyantlı buton bileşeni
│   ├── Input/
│   │   └── index.jsx       # Form input bileşeni
│   └── Modal/
│       └── index.jsx       # Genel modal bileşeni
│
└── pages/                  # Sayfa bileşenleri
    ├── Login/
    │   └── index.jsx       # Giriş ve oda oluşturma sayfası
    │
    └── Room/               # Oda sayfası (ana özellik)
        ├── index.jsx       # Ana Room bileşeni (orchestrator)
        │
        ├── components/     # Oda'ya özel alt bileşenler
        │   ├── index.js            # Barrel export
        │   ├── VideoPlayer.jsx     # YouTube player wrapper
        │   ├── ActionBar.jsx       # Video kontrol çubuğu
        │   ├── ChatPanel.jsx       # Sohbet mesajları ve input
        │   ├── ParticipantsList.jsx# Katılımcı listesi
        │   ├── SidePanel.jsx       # Sağ panel (chat/participants tabs)
        │   ├── RoomHeader.jsx      # Oda başlığı ve kullanıcı bilgisi
        │   ├── JoinScreen.jsx      # Kullanıcı adı giriş ekranı
        │   ├── LoadingScreen.jsx   # Yükleme durumu
        │   └── VideoModal.jsx      # Video URL giriş modalı
        │
        ├── hooks/          # Oda'ya özel custom hooks
        │   ├── index.js            # Barrel export
        │   ├── useVideoPlayer.js   # YouTube player yönetimi
        │   └── useRoomSocket.js    # Socket.IO bağlantı yönetimi
        │
        └── utils/          # Yardımcı fonksiyonlar
            └── index.js            # extractVideoId vb.
```

---

## 🧩 Bileşen Hiyerarşisi

```
App
├── Login                          # "/" rotası
│   └── Form (nickname, roomName)
│
└── Room                           # "/room/:id" rotası
    ├── JoinScreen                 # (koşullu) Kullanıcı adı yoksa
    ├── LoadingScreen              # (koşullu) Bağlantı beklenirken
    │
    └── Main Layout                # (aktif durum)
        ├── RoomHeader
        ├── VideoPlayer
        ├── ActionBar
        ├── SidePanel
        │   ├── ChatPanel
        │   └── ParticipantsList
        └── VideoModal
```

---

## 🎨 Paylaşılan Bileşenler

### `Button`
Çoklu varyantlı buton bileşeni.

| Variant | Açıklama |
|---------|----------|
| `primary` | Ana aksiyon butonu (gradient, gölgeli) |
| `secondary` | İkincil aksiyon (border'lı) |
| `danger` | Tehlike aksiyonu (kırmızı gradient) |
| `ghost` | Minimal, şeffaf arka plan |

### `Input`
Etiketli ve hata mesajlı form input bileşeni.

### `Modal`
Genel amaçlı modal bileşeni. Başlık, içerik ve kapatma butonu içerir.

---

## 📄 Sayfalar

### 1. Login (`/`)
- Kullanıcı adı ve oda ismi alır
- Rastgele bir room ID oluşturur
- `navigate` ile Room sayfasına yönlendirir (state ile)

### 2. Room (`/room/:id`)
- **JoinScreen**: Direkt link ile gelenler için kullanıcı adı sorar
- **LoadingScreen**: Socket bağlantısı beklenirken gösterilir
- **Main View**: Video player, kontroller, sohbet ve katılımcılar

---

## 🔌 State Yönetimi

Uygulama **local state** kullanır (Redux/Context yok):

| State | Açıklama | Yönetim |
|-------|----------|---------|
| `username` | Mevcut kullanıcı adı | `useState` |
| `roomName` | Oda adı | `useState` |
| `videoState` | Video ID, isPlaying, playbackTime | Socket'ten güncellenir |
| `participants` | Odadaki kullanıcı listesi | Socket'ten güncellenir |
| `messages` | Sohbet mesajları | Socket'ten güncellenir |

---

## 🔗 Socket.IO Entegrasyonu

Backend: `http://localhost:3001`

### Gönderilen Events
| Event | Payload | Açıklama |
|-------|---------|----------|
| `join-room` | `{roomId, username, roomName}` | Odaya katılma |
| `send-message` | `{roomId, message}` | Mesaj gönderme |
| `set-video` | `{roomId, videoId}` | Video ayarlama |
| `play` | `{roomId}` | Video oynatma |
| `pause` | `{roomId}` | Video duraklatma |
| `seek` | `{roomId, time}` | Video konumu değiştirme |
| `sync-response` | `{roomId, time, isPlaying, requesterId}` | Sync yanıtı |

### Dinlenen Events
| Event | Payload | Açıklama |
|-------|---------|----------|
| `room-state` | `{name, videoId, isPlaying, playbackTime, ...}` | Oda durumu |
| `update-users` | `[{id, username, isHost, avatar}]` | Kullanıcı listesi |
| `receive-message` | `{id, user, text, time, isSystem}` | Yeni mesaj |
| `sync-request` | `{requesterId}` | Sync isteği (host'a) |

---

## 🎬 YouTube Player Entegrasyonu

YouTube IFrame API kullanılarak video oynatılır.

### Özellikler:
- Kontroller gizli (`controls: 0`)
- Klavye devre dışı (`disablekb: 1`)
- Overlay ile tıklama engellenir
- Sync mekanizması ile yeni kullanıcılar mevcut zamana atlanır

### Sync Akışı:
1. Yeni kullanıcı katılır
2. Backend, host'a `sync-request` gönderir
3. Host, mevcut videoUrl ve zamanı `sync-response` ile yanıtlar
4. Yeni kullanıcının player'ı doğru zamana seek yapar

---

## 🎨 Stil Sistemi

### CSS Değişkenleri (`index.css`)
```css
:root {
  --background: #0a0a0f;
  --card-bg: #12121a;
  --card-hover: #1a1a25;
  --border-color: #ffffff10;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --accent-light: #a5b4fc;
  --coral: #f97316;
  --coral-hover: #fb923c;
}
```

### Kullanılan Teknolojiler
- **Tailwind CSS** - Utility-first styling
- **CSS Variables** - Tema değişkenleri
- **Backdrop Blur** - Glassmorphism efektleri
- **Gradients** - Modern görünüm

---

## 📦 Bağımlılıklar

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "socket.io-client": "^4.x",
  "react-icons": "^5.x"
}
```

---

## 🚀 Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build
```

---

## 📝 Notlar

1. **Barrel Exports**: Her klasörde `index.js` dosyası ile temiz import yapısı
2. **Separation of Concerns**: Hooks, components ve utils ayrı klasörlerde
3. **Colocation**: Oda'ya özel dosyalar Room klasörü altında
4. **Reusable Components**: Paylaşılan bileşenler `src/components` altında

---

## 🔮 İleriye Dönük

- [ ] Context API ile global state yönetimi
- [ ] Ses kontrolü (mute/unmute)
- [ ] Video kuyruğu (playlist)
- [ ] Oda şifresi desteği
- [ ] Tema değiştirme (dark/light)
