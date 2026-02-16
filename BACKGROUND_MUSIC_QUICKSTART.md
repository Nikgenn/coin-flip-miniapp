# Background Music - Quick Start ⚡

## ✅ Installation Complete!

Background music system is fully integrated and ready to use.

## 🎵 Quick Start (3 Steps)

### 1. Add Your Audio File

Place your MP3 file here:
```
public/audio/background.mp3
```

**Don't have music yet?** Get free royalty-free music:
- [Pixabay Music](https://pixabay.com/music/) (no attribution needed)
- [YouTube Audio Library](https://studio.youtube.com/channel/UC/music)
- [Incompetech](https://incompetech.com/music/) (attribution required)

**Recommended specs**: MP3, 128-192kbps, 1-3 minutes, <2MB

### 2. Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and:
1. ✅ See 🔇 button in top-right
2. ✅ Click "Flip Coin!" button (unlocks audio)
3. ✅ Click 🔇 to enable music
4. ✅ Music plays and loops
5. ✅ Refresh page - preference persists

### 3. Deploy & Test in Base App

```bash
npm run build
vercel deploy
```

Open in Base App:
1. ✅ Music doesn't autoplay (compliant with mobile policies)
2. ✅ First tap on flip button unlocks audio
3. ✅ Toggle button works smoothly
4. ✅ State persists across sessions

## 📋 What Was Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Audio hook | ✅ | `src/hooks/useBackgroundMusic.ts` |
| Toggle UI | ✅ | Floating button (top-right) |
| Unlock on gesture | ✅ | Integrated into flip button |
| localStorage persist | ✅ | Key: `bgm_enabled` |
| Mobile compliance | ✅ | No autoplay with sound |
| Loop & volume | ✅ | Loop: true, Volume: 30% |
| Error handling | ✅ | Promise rejections caught |
| TypeScript | ✅ | Fully typed |

## 🎯 Key Features

- **🔇 Default Muted**: Music off by default (user opt-in)
- **📱 Mobile Safe**: Complies with iOS/Android autoplay policies
- **💾 Persistent**: User preference saved in localStorage
- **♻️ Looping**: Seamless background music
- **🎚️ Volume**: Set to 30% (not overwhelming)
- **⚡ Lightweight**: No external dependencies

## 🐛 Troubleshooting

### Music doesn't play on mobile?
- User MUST tap flip button first (unlocks audio)
- Then toggle button will work

### Button not visible?
- Check console for errors
- Verify `npm run dev` is running
- Clear browser cache

### State not saving?
- Check browser allows localStorage
- Try incognito mode (won't persist on close)

## 📖 Full Documentation

See [BACKGROUND_MUSIC_INTEGRATION.md](./BACKGROUND_MUSIC_INTEGRATION.md) for:
- Detailed architecture
- Customization options
- Advanced features
- Performance tips

## 🎨 Quick Customizations

### Change button position:
```tsx
// src/components/BackgroundMusic.tsx, line 22
fixed top-4 right-4    // Current (top-right)
fixed bottom-4 right-4 // Bottom-right
fixed top-4 left-4     // Top-left
```

### Change volume:
```typescript
// src/hooks/useBackgroundMusic.ts, line 24
sharedAudio.volume = 0.5; // 50% volume
```

### Change button emoji:
```tsx
// src/components/BackgroundMusic.tsx, line 33
{enabled ? '🎵' : '🔇'}  // Current
{enabled ? '🔊' : '🔈'}  // Alternative
{enabled ? '♪' : '♫'}    // Musical notes
```

## 🚀 Ready to Go!

Your app now has professional background music with full mobile support.

**Next step**: Add `background.mp3` to `public/audio/` and test!

---

**Questions?** Check the full docs or console logs (prefix: `[BGM]`)
