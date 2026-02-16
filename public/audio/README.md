# Background Music Audio Files

## Required File

Place your background music file here:

**File name**: `background.mp3`
**Path**: `public/audio/background.mp3`

## Recommendations

### Audio Specifications:
- **Format**: MP3 (best browser compatibility)
- **Bitrate**: 128-192 kbps (balance between quality and file size)
- **Duration**: 1-3 minutes (will loop seamlessly)
- **Volume**: Normalized to -12dB to -6dB (avoid clipping)
- **File size**: Aim for <2MB for fast loading on mobile

### Music Style Suggestions for Coin Flip Game:
- **Upbeat/Energetic**: Keeps players engaged
- **Loopable**: Should transition smoothly from end to beginning
- **Non-intrusive**: Background ambience, not overwhelming
- **Positive tone**: Match the fun, casual nature of the game

### Where to Get Royalty-Free Music:
1. **Pixabay**: https://pixabay.com/music/ (Free, no attribution required)
2. **Incompetech**: https://incompetech.com/music/ (Free with attribution)
3. **YouTube Audio Library**: https://studio.youtube.com/channel/UC/music
4. **Free Music Archive**: https://freemusicarchive.org/
5. **Bensound**: https://www.bensound.com/ (Free with attribution)

### Example Search Terms:
- "upbeat game background music"
- "casual game loop"
- "coin flip sound"
- "arcade background music"
- "cheerful game music"

## Testing

After adding the file:

1. Start the dev server: `npm run dev`
2. Open the app in browser
3. Click the "Flip" button (this unlocks audio)
4. Click the 🔇 button in top-right to enable music
5. Music should start playing and loop
6. Refresh the page - your preference should persist

## Technical Details

- Default state: MUTED (music off)
- Volume: 30% (configured in `useBackgroundMusic.ts`)
- Loop: Enabled
- Persistence: localStorage key `bgm_enabled`
- Mobile autoplay: Unlocked on first user gesture (flip button)

## Placeholder for Testing

If you don't have an audio file yet, you can create a silent placeholder for testing:

```bash
# macOS/Linux:
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 10 -q:a 9 -acodec libmp3lame public/audio/background.mp3

# Or just add any MP3 file temporarily
```

The app will work even if the file is missing (it just won't play sound).
