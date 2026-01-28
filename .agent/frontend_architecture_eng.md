# WatchHub Frontend Architecture

> Last updated: January 27, 2026

## 📖 Overview

WatchHub is a web application that allows users to watch videos synchronously with friends and chat. The frontend is developed with **React + Vite** and uses **Socket.IO** for real-time communication.

---

## 🗂️ Folder Structure

```
frontend/src/
├── App.jsx                 # Main application and routing
├── main.jsx                # React entry point
├── index.css               # Global styles and CSS variables
│
├── assets/                 # Static files (images, etc.)
│
├── components/             # Shared UI components
│   ├── Button/
│   │   └── index.jsx       # Multi-variant button component
│   ├── Input/
│   │   └── index.jsx       # Form input component
│   └── Modal/
│       └── index.jsx       # General modal component
│
└── pages/                  # Page components
    ├── Login/
    │   └── index.jsx       # Login and room creation page
    │
    └── Room/               # Room page (main feature)
        ├── index.jsx       # Main Room component (orchestrator)
        │
        ├── components/     # Room-specific sub-components
        │   ├── index.js            # Barrel export
        │   ├── VideoPlayer.jsx     # YouTube player wrapper
        │   ├── ActionBar.jsx       # Video control bar
        │   ├── ChatPanel.jsx       # Chat messages and input
        │   ├── ParticipantsList.jsx# Participants list
        │   ├── SidePanel.jsx       # Right panel (chat/participants tabs)
        │   ├── RoomHeader.jsx      # Room header and user info
        │   ├── JoinScreen.jsx      # Username entry screen
        │   ├── LoadingScreen.jsx   # Loading state
        │   └── VideoModal.jsx      # Video URL entry modal
        │
        ├── hooks/          # Room-specific custom hooks
        │   ├── index.js            # Barrel export
        │   ├── useVideoPlayer.js   # YouTube player management
        │   └── useRoomSocket.js    # Socket.IO connection management
        │
        └── utils/          # Helper functions
            └── index.js            # extractVideoId, etc.
```

---

## 🧩 Component Hierarchy

```
App
├── Login                          # "/" route
│   └── Form (nickname, roomName)
│
└── Room                           # "/room/:id" route
    ├── JoinScreen                 # (conditional) If no username
    ├── LoadingScreen              # (conditional) While waiting for connection
    │
    └── Main Layout                # (active state)
        ├── RoomHeader
        ├── VideoPlayer
        ├── ActionBar
        ├── SidePanel
        │   ├── ChatPanel
        │   └── ParticipantsList
        └── VideoModal
```

---

## 🎨 Shared Components

### `Button`
Multi-variant button component.

| Variant | Description |
|---------|-------------|
| `primary` | Main action button (gradient, shadowed) |
| `secondary` | Secondary action (bordered) |
| `danger` | Danger action (red gradient) |
| `ghost` | Minimal, transparent background |

### `Input`
Form input component with label and error message support.

### `Modal`
General purpose modal component. Includes title, content, and close button.

---

## 📄 Pages

### 1. Login (`/`)
- Gets username and room name
- Generates a random room ID
- Redirects to Room page using `navigate` (with state)

### 2. Room (`/room/:id`)
- **JoinScreen**: Asks for username for those coming via direct link
- **LoadingScreen**: Displayed while waiting for socket connection
- **Main View**: Video player, controls, chat, and participants

---

## 🔌 State Management

The application uses **local state** (no Redux/Context):

| State | Description | Management |
|-------|-------------|------------|
| `username` | Current username | `useState` |
| `roomName` | Room name | `useState` |
| `videoState` | Video ID, isPlaying, playbackTime | Updated from Socket |
| `participants` | List of users in room | Updated from Socket |
| `messages` | Chat messages | Updated from Socket |

---

## 🔗 Socket.IO Integration

Backend: `http://localhost:3001`

### Emitted Events
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{roomId, username, roomName}` | Join room |
| `send-message` | `{roomId, message}` | Send message |
| `set-video` | `{roomId, videoId}` | Set video |
| `play` | `{roomId}` | Play video |
| `pause` | `{roomId}` | Pause video |
| `seek` | `{roomId, time}` | Change video position |
| `sync-response` | `{roomId, time, isPlaying, requesterId}` | Sync response |

### Listened Events
| Event | Payload | Description |
|-------|---------|-------------|
| `room-state` | `{name, videoId, isPlaying, playbackTime, ...}` | Room state |
| `update-users` | `[{id, username, isHost, avatar}]` | User list |
| `receive-message` | `{id, user, text, time, isSystem}` | New message |
| `sync-request` | `{requesterId}` | Sync request (to host) |

---

## 🎬 YouTube Player Integration

Videos are played using the YouTube IFrame API.

### Features:
- Controls hidden (`controls: 0`)
- Keyboard disabled (`disablekb: 1`)
- Click blocked with overlay
- New users jump to current time with sync mechanism

### Sync Flow:
1. New user joins
2. Backend sends `sync-request` to host
3. Host responds with current videoUrl and time via `sync-response`
4. New user's player seeks to the correct time

---

## 🎨 Styling System

### CSS Variables (`index.css`)
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

### Technologies Used
- **Tailwind CSS** - Utility-first styling
- **CSS Variables** - Theme variables
- **Backdrop Blur** - Glassmorphism effects
- **Gradients** - Modern appearance

---

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "socket.io-client": "^4.x",
  "react-icons": "^5.x"
}
```

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

---

## 📝 Notes

1. **Barrel Exports**: Clean import structure with `index.js` file in each folder
2. **Separation of Concerns**: Hooks, components, and utils in separate folders
3. **Colocation**: Room-specific files under Room folder
4. **Reusable Components**: Shared components under `src/components`

---

## 🔮 Future Plans

- [ ] Global state management with Context API
- [ ] Sound control (mute/unmute)
- [ ] Video queue (playlist)
- [ ] Room password support
- [ ] Theme switching (dark/light)
