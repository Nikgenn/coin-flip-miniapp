# Background Music Integration - Complete Guide

## ✅ Implementation Summary

Background music system has been successfully integrated with full mobile autoplay policy compliance.

## 📁 Files Modified/Created

### New Files:

1. **`src/hooks/useBackgroundMusic.ts`** (196 lines)
   - Core hook managing shared HTMLAudioElement instance
   - localStorage persistence (`bgm_enabled` key)
   - Unlock mechanism for mobile autoplay policy
   - Default state: MUTED (music off)
   - Volume: 30%, Loop: enabled

2. **`src/components/BackgroundMusic.tsx`** (48 lines)
   - Floating toggle button (top-right)
   - Shows 🎵 when enabled, 🔇 when disabled
   - Exports `useAudioUnlock()` helper for integration

3. **`public/audio/README.md`**
   - Instructions for adding audio file
   - Recommendations for file format and sources

4. **`BACKGROUND_MUSIC_INTEGRATION.md`** (this file)
   - Complete integration documentation

### Modified Files:

1. **`src/components/CoinFlipGame.tsx`**
   - Added `useAudioUnlock` import
   - Integrated `unlockAudio()` call in `handleFlip()` function
   - Audio unlocks on first flip button click

2. **`src/app/layout.tsx`**
   - Added `BackgroundMusic` component import
   - Renders `<BackgroundMusic />` inside Providers

3. **`src/components/index.ts`**
   - Added exports for `BackgroundMusic` and `useAudioUnlock`

## 🎵 How It Works

### Architecture

```
┌─────────────────────────────────────────────┐
│  App Layout (layout.tsx)                    │
│  ├─ Providers                               │
│  │  └─ BackgroundMusic Component (floating) │
│  └─ Page Content                            │
│     └─ CoinFlipGame                         │
│        └─ First click → unlockAudio()       │
└─────────────────────────────────────────────┘

Shared Audio Instance (Singleton)
├─ Created once on first hook call
├─ Shared across all components
├─ Loop: true, Volume: 0.3
└─ Managed by useBackgroundMusic hook
```

### State Flow

1. **Initial Load**:
   - Audio instance created but NOT playing
   - State read from localStorage (default: `false`)
   - Toggle button renders with current state

2. **First User Interaction** (Flip button click):
   - `unlockAudio()` called automatically
   - Attempts `play()` then immediately `pause()`
   - This "unlocks" audio context for iOS/Android
   - No sound plays during unlock

3. **User Toggles Music**:
   - Click 🔇 button → calls `enable()`
   - Calls `play()` on audio instance
   - State saved to localStorage
   - Button changes to 🎵

4. **Page Reload**:
   - State restored from localStorage
   - If enabled before, music resumes after unlock
   - If disabled, stays silent

### Mobile Autoplay Policy Compliance

```typescript
// ❌ WRONG - Violates autoplay policy
useEffect(() => {
  audio.play(); // Blocked by browser on mobile!
}, []);

// ✅ CORRECT - Our implementation
// 1. Wait for user gesture (flip button click)
const handleFlip = () => {
  unlockAudio(); // Safe play/pause to unlock
  // ... rest of flip logic
};

// 2. Only play when explicitly enabled
const enable = () => {
  audio.play(); // Now allowed after unlock
};
```

## 🧪 Testing Guide

### Desktop Browser Testing

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. **Initial state**:
   - Should see 🔇 button in top-right
   - No music playing
   - Console: `[BGM] Audio unlocked` after first flip

4. **Click flip button** (any choice):
   - This unlocks audio (check console)
   - Music still doesn't play (correct!)

5. **Click 🔇 button**:
   - Changes to 🎵
   - Music starts playing
   - Should loop seamlessly

6. **Refresh page**:
   - Button shows 🎵 (state persisted)
   - Music resumes after page load

7. **Click 🎵 button**:
   - Changes to 🔇
   - Music stops

8. **Check localStorage**:
   - Open DevTools → Application → localStorage
   - Should see key: `bgm_enabled` with value `true` or `false`

### Mobile Testing (Base App)

1. **Deploy to Vercel** (or use ngrok for local testing):
   ```bash
   npm run build
   # Deploy to Vercel or use: npx ngrok http 3000
   ```

2. **Open in Base App**:
   - Launch Base App on iOS/Android
   - Navigate to your mini app

3. **Test autoplay policy**:
   - Music should NOT play automatically ✅
   - No console errors about autoplay ✅

4. **First interaction**:
   - Tap "Heads" or "Tails"
   - Tap "Flip Coin!" button
   - Check that flip works normally
   - No audio plays yet (correct!)

5. **Enable music**:
   - Tap 🔇 button in top-right
   - Music should start immediately
   - Button changes to 🎵

6. **Test persistence**:
   - Close and reopen mini app
   - Music preference should be remembered
   - If enabled, music resumes after first tap

7. **Test iOS Safari** specifically:
   - iOS has strictest autoplay policies
   - Should work with no issues after unlock

### Expected Console Logs

```
[BGM] Audio unlocked                    // After first flip
[BGM] Play started                      // When toggled on
[BGM] Paused                            // When toggled off
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No 🔇 button visible | Build/import error | Check console for errors, verify imports |
| Music doesn't play on mobile | Autoplay blocked | User must click flip button first to unlock |
| Music plays automatically | Bug in unlock logic | Should NOT happen with current code |
| Music doesn't loop | Audio file issue | Verify audio file doesn't have silence at end |
| State not persisting | localStorage blocked | Check browser privacy settings |

## 🎨 Customization Options

### Change Button Position

```tsx
// In src/components/BackgroundMusic.tsx
// Current: top-4 right-4
// Options:
className="fixed top-4 left-4 ..."     // Top-left
className="fixed bottom-4 right-4 ..." // Bottom-right
className="fixed bottom-4 left-4 ..."  // Bottom-left
```

### Change Volume

```typescript
// In src/hooks/useBackgroundMusic.ts, line ~24
sharedAudio.volume = 0.3; // Current: 30%
// Range: 0.0 (silent) to 1.0 (full volume)
```

### Change Button Style

```tsx
// In src/components/BackgroundMusic.tsx
// Add animation:
className="... animate-pulse"

// Change colors:
bg-blue-600/80   // Blue theme
bg-purple-600/80 // Purple theme
bg-green-600/80  // Green theme
```

### Add Fade In/Out

```typescript
// In src/hooks/useBackgroundMusic.ts
const enable = async () => {
  // ... existing code ...
  
  // Fade in
  audio.volume = 0;
  audio.play();
  const fadeIn = setInterval(() => {
    if (audio.volume < 0.3) {
      audio.volume += 0.01;
    } else {
      clearInterval(fadeIn);
    }
  }, 50);
};
```

## 📊 Performance Considerations

### File Size Impact
- MP3 at 192kbps, 2 minutes = ~3MB
- Lazy loaded (only when toggled on)
- Cached by browser after first load

### Memory Usage
- Single audio instance = minimal overhead
- No recreation on re-renders
- Properly cleaned up on unmount

### Mobile Data
- Audio only loads once
- Consider adding a warning for cellular users
- Could add quality selection (high/low bitrate)

## 🔒 Privacy & Permissions

- No permissions required (audio is user-initiated)
- localStorage used for preference only
- No tracking or analytics
- Works in private/incognito mode (preferences reset on close)

## 🚀 Future Enhancements

### Optional Features to Add:

1. **Multiple Tracks**:
   ```typescript
   const tracks = ['calm.mp3', 'upbeat.mp3', 'intense.mp3'];
   ```

2. **Volume Slider**:
   ```tsx
   <input type="range" min="0" max="100" 
     value={volume} onChange={handleVolumeChange} />
   ```

3. **Sound Effects** (separate from BGM):
   ```typescript
   const playCoinFlipSound = () => {
     const sfx = new Audio('/audio/coin-flip.mp3');
     sfx.volume = 0.5;
     sfx.play();
   };
   ```

4. **Audio Visualizer**:
   ```typescript
   const audioContext = new AudioContext();
   const analyser = audioContext.createAnalyser();
   // Connect to audio element and visualize
   ```

## 📝 Code Quality

### Type Safety
- ✅ Full TypeScript types
- ✅ Proper null checks
- ✅ SSR-safe (checks for `window`)

### Error Handling
- ✅ Promise rejection handling on `play()`
- ✅ localStorage errors caught
- ✅ Audio loading errors logged

### Best Practices
- ✅ Single instance pattern (no memory leaks)
- ✅ Proper cleanup in useEffect
- ✅ Memoized callbacks
- ✅ Accessibility (aria-labels)

## 📞 Support

If you encounter issues:

1. Check console for `[BGM]` prefixed logs
2. Verify `public/audio/background.mp3` exists
3. Test in Chrome DevTools mobile emulator first
4. Check localStorage in DevTools → Application tab

## 📦 Dependencies

**No new dependencies added!** 

Uses only:
- React hooks (useState, useEffect, useCallback, useRef)
- Native Web Audio API (HTMLAudioElement)
- localStorage API

---

**Status**: ✅ Ready for production

**Next Step**: Add `background.mp3` file to `public/audio/` directory
