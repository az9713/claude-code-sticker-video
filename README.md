# A School Day — a 45-second video made with code

A boy's school day, from the 7:00 AM alarm to 8:30 PM bedtime, in 45 seconds.
The boy is 9 stickers. Everything else — the rooms, the props, every motion, the camera, the clock,
the scene wipes and the sound effects — is code that Claude Code wrote.

- ▶ **Watch the video:** https://az9713.github.io/claude-code-sticker-video/
- 📖 **Read how it was made (development journey):** https://az9713.github.io/claude-code-sticker-video/development-journey.html

![Nine frames from the video, one from each scene](school-day-45s/snapshots/render-check.jpg)

## The idea in one paragraph

No AI model drew a frame. The video is a web page: SVG shapes for the rooms, `<img>` tags for the stickers,
and one paused [GSAP](https://gsap.com/) timeline that says what moves when. [HyperFrames](https://hyperframes.heygen.com/)
opens the page in headless Chrome, jumps the timeline to 0 s, 1/30 s, 2/30 s … and takes a picture each time —
1350 pictures for 45 seconds. FFmpeg joins them into an MP4 and mixes in the sound files at their start times.
The [development journey](https://az9713.github.io/claude-code-sticker-video/development-journey.html) explains every step and every tool.

## Reference

The method comes from Eric's video **"How to animate videos using Claude Code"**:
https://www.youtube.com/watch?v=s8WKkUuEJWs. Its main rule: build the characters, sets, props and sounds
**once** as a named library, then direct each scene by calling those names ("use only the library").
[`claude-code-animation-workflow.md`](claude-code-animation-workflow.md) is a step-by-step write-up of that
method, with what the video states, what it leaves out, and the run log of this build.

## What is in this repo

| Path | What it is |
|---|---|
| `index.html` | The video page (GitHub Pages home) |
| `development-journey.html` | The development journey as a web page |
| `claude-code-animation-workflow.md` | The workflow, tools, gaps, and run log |
| `school-day-45s/index.html` | The scene: 9 timed clips, 32 audio tags, one GSAP timeline |
| `school-day-45s/lib/library.js` | The reusable library: 7 sets, props, the sticker boy, effects, clock badge |
| `school-day-45s/style-bible.md` | The rules every scene follows |
| `school-day-45s/DEVELOPMENT-JOURNEY.md` | The development journey (source of the HTML page) |
| `school-day-45s/assets/` | The 9 sticker cut-outs, narrator lines, music, sound effects |
| `school-day-45s/make_sfx.py` | Makes all 9 sound effects with the Python standard library |
| `school-day-45s/renders/school-day-45s-14lufs.mp4` | The final video: 1920×1080, 30 fps, 45.0 s, −13.8 LUFS |

## Tools

Claude Code · HyperFrames 0.8.143 · GSAP 3.14.2 · SVG · Python (Pillow, NumPy, SciPy, faster-whisper) ·
ElevenLabs (narrator voice "Hope - The Storyteller", music) · FFmpeg 7.1.1

## Re-render

Requirements: Node 22, FFmpeg on PATH. Then:

```bash
cd school-day-45s
npx hyperframes@0.8.143 check
npx hyperframes@0.8.143 render -o renders/school-day-45s.mp4
ffmpeg -i renders/school-day-45s.mp4 -af "aresample=192000,volume=6.6dB,alimiter=limit=0.7:level=disabled:attack=1:release=50,aresample=48000" \
  -c:v copy -c:a aac -b:a 192k -t 45 renders/school-day-45s-14lufs.mp4
```

The render takes about 1 minute (1350 frames) on a laptop with an integrated GPU.

## Credits

- Method: Eric's video, linked above.
- Sticker character: supplied by the project owner. Voice and music: generated with ElevenLabs.
- Code: written by Claude Code (Anthropic).

Contact: az9713@yahoo.com
