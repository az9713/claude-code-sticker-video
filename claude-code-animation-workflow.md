---
title: The host's Claude Code + HyperFrames animation workflow
source: https://www.youtube.com/watch?v=s8WKkUuEJWs
inputs: the video transcript and the video description (not in this repo)
date: 2026-10-08
---

# The host's animation workflow (Claude Code + JavaScript + HyperFrames)

## Tags

- **[STATED]** — The host says it in the video, or it is in the video description. A timestamp follows.
- **[INFERRED]** — I filled a gap. The claim is probable, but the video does not show it.
- **[GAP]** — The video does not give this information. I did not guess.
- **[VERIFIED]** — I confirmed it on the build machine (Windows 11) during these builds.

## 1. The main idea

Every animation in the video is a web page: HTML, CSS, and JavaScript that Claude writes. [STATED 0:00]
Each character, room, and prop has a name and values. You change the values to direct the scene. [STATED 0:07]

This is not AI video generation. It is the method of traditional animation. You design the parts. The AI changes them 30 times a second and joins the frames into one video. [STATED 0:47–1:03]

The host gives two problems with AI video generation that this method removes [STATED 1:12–1:27]:

1. Generation is expensive. Here, the only cost is Claude tokens, and the JavaScript is simple.
2. Generation is not consistent. A character changes between videos. Here, the character is code, so it stays the same.

**The important rule:** build each part one time, then use it again. Most demos are "one prompt in, one video out." The host builds a library of parts. [STATED 0:15–0:31, 5:21]

### What is code and what is not [STATED, README]

| Code (Claude writes it) | Not code (made outside) |
|---|---|
| Characters, rooms (sets), props | His voice |
| Poses, moods | The face cam |
| Camera moves | The music |
| Lower thirds, overlays | The final edit |

### Measured times [STATED]

| Item | Time | Source |
|---|---|---|
| The look (style tests, characters, sets) | "a full day" | 4:37, README |
| First build of the library (puppets, rig, props) | about 20 minutes | 5:52, README |
| Each render after that | about 75 seconds | 5:59, README |
| Live demo: from the ask to the finished 15 s video | 1.5 minutes (90 seconds) | 6:23 |
| Live demo: tokens | The transcript says "1.6,000" and "it's still counting". The number is garbled. I do not state a number. | 6:14 |
| His earlier video with this method | 27 scenes, 8 minutes long | 2:23 |
| Comparison he quotes | Another creator (Chase) took 8 hours for one finished video | 2:08 |

## 2. Tools and repos

| Tool | Role | Status |
|---|---|---|
| **Claude Code** with **Opus 5.5** | Writes all the code | [STATED 0:47] |
| **HyperFrames** | Renders video from HTML. Keeps all assets in one project, so Claude finds the kit and does not make a new project folder for each ask. | [STATED 3:54–4:13]. It is HeyGen's open-source HTML-to-video framework, CLI `npx hyperframes`. [VERIFIED 2026-10-08: `hyperframes init` writes a registry URL at `heygen-com/hyperframes` and cites `hyperframes.heygen.com`] |
| ChatGPT (or any image generator) | Makes a panel of look ideas | [STATED 4:13] |
| **ElevenLabs** | Voice (he uses it when he does not speak himself) | [STATED 6:51] |
| "voice studio" | Free voice cloning that he "heard is pretty good" | [STATED 6:51]. [GAP] I cannot identify this product from the transcript. |
| **Epidemic Sound** | Music and sound effects. Has an API, so he searches and downloads from inside Claude Code. About $15 a month. | [STATED 7:00–7:14] |
| **Pixabay** | Free, royalty-free sound effects and images | [STATED 7:14] |
| Claude-generated sound | Claude can make sound effects from code (he demos a coffee-cup clink: free vs paid vs code) | [STATED 6:36–6:44]. [INFERRED] The method is Web Audio API or a synthesized WAV. |
| **Rhubarb Lip Sync** | Free repo. Reads the voice audio and gives the mouth shapes in time, so the character seems to talk. He uses it for shorts with his pixel-art twin. | [STATED 7:22–7:29]. Repo: `DanielSWolf/rhubarb-lip-sync` on GitHub. [VERIFIED 2026-10-08: release v1.14.0 downloaded and run] |
| Video editor (NLE) | Final cut, face cam, keying green screen | [STATED 7:58–8:14]. [GAP] He does not name the editor. |

## 3. The workflow, step by step

### Step 1 — Find the look (stills only, no animation)

1. Ask an image generator (he uses ChatGPT) for a panel of style ideas. [STATED 4:13]
2. Pick a style you like. Give the reference images to Claude. [STATED 4:20]
3. Ask Claude for stills in four test styles. Do not animate yet. His prompt: "Here is the reference images. Can you generate this in four different test styles, just the stills?" [STATED 4:28–4:37]
4. Tweak the stills. "They're not always good." [STATED 4:45]
5. Render a short test video with all styles "in action". Pick one. [STATED 4:52]

- He had the audio before he started, as a demo. [STATED 4:28]
- [GAP] The test-video prompt, its length, and the reference images.
- [INFERRED] Claude makes the stills as HTML/SVG pages, then a screenshot. Claude does not make raster images itself.

### Step 2 — Lock the look in a "style bible"

Prompt [STATED 5:09–5:15]:

> Write a style guide for the look I picked. Colors, line weight, proportions, lighting, and what's not allowed. Every scene from now on follows this bible.

- The document name is "style bible". Every later prompt refers to it. [STATED 5:01]
- [INFERRED] In HyperFrames the same job is done by a design spec file, `frame.md`. It locks palette, type, and layout.
- [GAP] The file name, format, and content of his bible.

### Step 3 — Build the reusable library ("the sauce")

Literal prompt from the video description [STATED 5:29–5:44]:

> Following the style guide, build a reusable library in code. A character rig for [the host] with named poses and moods. A coffee-shop set. Props: mug, phone, laptop. Every piece called by name, like [host].set pose wave, mood happy

API shape from the video description [STATED]:

```js
host.set({pose: 'wave', mood: 'happy'})
```

- Analogy he uses: a TV show does not build a new set for each episode. You move the same assets. [STATED 5:21]
- First build: about 20 minutes. [STATED 5:52]
- [INFERRED] The rig is SVG body parts in nested groups (body, head, arms, mouth). A pose sets joint rotations. A mood swaps the eyes, brows, and mouth. GSAP or CSS moves the parts in time.
- [INFERRED] For lip sync, the rig needs one mouth shape per Rhubarb shape (A, B, C, D, E, F, G, H, X).
- [GAP] The real file layout, the drawing method (SVG, canvas, or DOM), and how poses blend.

### Step 4 — Direct and render a scene

Literal prompt from the video description [STATED 6:06–6:14]:

> 15-second scene: coffee shop, [the host] on the couch holding a mug, happy. At 3 seconds, he waves. Use only the library. Render it.

- "Use only the library" is the key phrase. It stops Claude from drawing new parts. [STATED]
- Result: the wave starts at 3 s, and the camera zooms in. [STATED 6:23–6:30]
- [GAP] The zoom is not in the README prompt. The full spoken prompt probably asked for it.
- [VERIFIED 2026-10-08] The render command is `npx hyperframes render`. It runs headless Chrome, seeks each frame, and encodes with FFmpeg. Measured on this PC: drawelement capture, hardware GPU, 3 workers, 900 frames, 44.1 s for 30 s of video.

### Step 5 — Add sound

1. Get dialog: your own voice, ElevenLabs, or a free voice clone. [STATED 6:51–7:00]
2. Get music and sound effects: Epidemic Sound API, Pixabay, or Claude-generated sound. [STATED 6:36–7:14]
3. [INFERRED] Put the audio files in the HyperFrames composition as audio tracks, or add them in the editor.

### Step 6 — Lip sync with Rhubarb

1. Give the dialog audio to Rhubarb. [STATED 7:22]
2. Rhubarb gives the mouth shapes with times. [STATED 7:29]
3. [INFERRED] Command: `rhubarb -f json -d dialog.txt -o mouth.json voice.wav`. The `-d` file holds the script text and makes the result better. Rhubarb reads WAV or OGG, not MP3.
4. [INFERRED] The scene code reads `mouthCues` (`start`, `end`, `value`) and sets the mouth on the rig at each time.

### Step 7 — Motion graphics and overlays (other use)

1. Build brand assets, lower thirds, and calls to action as animated code. [STATED 7:58–8:14]
2. Use a background colour that is easy to key out (green screen). [STATED 8:05]
3. Key it out in the editor and put it over live footage. [STATED 8:14]
- [INFERRED] HyperFrames can also render with a transparent background, so the key step is not always necessary.

### Step 8 — Final edit (not code)

- Voice, face cam, music, and the final cut happen outside code. [STATED README]
- [GAP] The editor and the edit method.

## 4. What the video does not give (summary of gaps)

1. The style-bible file and its content.
2. The library source code and file layout.
3. The prompt for the test video of the four styles.
4. The token count of the demo render (garbled in the transcript).
5. The identity of "voice studio".
6. How the Rhubarb output connects to the rig.
7. The video editor.
8. His "actual folders with pre-built characters" are in his paid/free school community, not in the video. [STATED 2:39, 3:19]

## 5. Requirements (checked 2026-10-08)

| Item | Version / note |
|---|---|
| HyperFrames skills for Claude Code | `hyperframes`, `hyperframes-core`, `hyperframes-animation` (installed as Claude Code skills) |
| HyperFrames CLI | `hyperframes@0.8.143` via `npx` (pinned in each project's `package.json`) |
| Node | v22 |
| FFmpeg / ffprobe | 7.1.1. On Windows with WinGet, it can be installed but not on PATH. Then prefix commands with `export PATH="$PATH:$HOME/AppData/Local/Microsoft/WinGet/Links"` (Git Bash). |
| Python | Pillow, NumPy, SciPy, `faster-whisper` (`base.en`, CPU, int8) for word times. `npx hyperframes transcribe` failed here with "whisper-cpp not found". |
| Rhubarb Lip Sync | v1.14.0 — only for lip sync with a drawn character. Not used by the sticker video. |
| ElevenLabs | The ElevenLabs MCP connector in Claude Code (no API key in the shell needed). The `music` and `text-to-speech` skills need `ELEVENLABS_API_KEY`. |
| Epidemic Sound | Not used. ElevenLabs music and code-made sound effects instead. |

## 6. Plan for a short video with this workflow

1. Write the dialog script (about 60–75 words for 30 s) and the shot list.
2. Make the voice (ElevenLabs connector, or record your own voice). Convert to WAV.
3. Run Rhubarb on the WAV with the script. Get `mouth.json`.
4. Do Step 1 and Step 2 in short form: 2–4 style stills, pick one, write `style-bible.md`.
5. Do Step 3: build the library — character rig with poses, moods, and mouth shapes; one set; the props.
6. Write the scene with "use only the library". Sync mouth to `mouth.json`, gestures to the dialog.
7. Get music (ElevenLabs music, 30 s) and 1–3 sound effects. Mix under the voice.
8. Render with HyperFrames to MP4. Check the lip sync and audio levels.

## 7. Run log — the 45-second sticker video "A School Day" (2026-10-08)

Input: `stickers.png` (the user's 3×3 sticker sheet of a boy; not in this repo). Choices from the user: cut-outs (no redraw), 45 s,
narrator + music, the 9-scene day plan (one sticker per scene).
Output: `school-day-45s/renders/school-day-45s-14lufs.mp4` — 1920×1080, 30 fps, 45.0 s, −13.8 LUFS, true peak −2.2 dBTP.

| Host's step | What I did | File |
|---|---|---|
| 1. Look | **Skipped.** The stickers fix the look of the boy. Sets were drawn to match them. | — |
| 2. Style bible | Rule "the boy is only a sticker PNG, never redrawn"; bust stickers hide their flat bottom behind a prop; set palette, 6 px ink outlines, sky color per time of day | `school-day-45s/style-bible.md` |
| 3. Library | `stage()`, 7 sets (`bedroom` dawn/night, `street`, `classroom` science/spelling, `playground`, `cafeteria`, `musicRoom`, `dining`), props (alarm clock, bus, volcano, test paper, cake, amp…), `boy(stage, name, {x, bottom, h})` with `pop/hop/squash/wiggle/sway`, `fx()` floaters (star, heart, note, lava, zzz), `word()` bubbles, `UI.clockBadge` (hands turn forward at each cut) | `school-day-45s/lib/library.js` |
| Stickers | Split by alpha connected components (scipy), 9 parts, then 2× Lanczos upscale | `school-day-45s/assets/stickers/*.png` |
| 4. Scene | 9 clips × 4.8 s (last one 6.6 s), colour wipe + whoosh at each cut, slow push-in, night dim + "Goodnight!" + fade out. Uses only the library. | `school-day-45s/index.html` |
| 5. Sound | Voice: ElevenLabs connector, "Hope - The Storyteller", `eleven_v4`, 28.96 s, 487.97 credits (US$0.081). Cut at silences into 9 lines: 0 / 3.75 / 7.0 / 10.88 / 14.29 / 17.02 / 20.46 / 23.26 / 25.94 / 28.96 s. Music: `eleven_music_v2`, 45 s, 1800 credits (US$0.30), no vocals found by Whisper; the track fades out by about 40 s. SFX (alarm, whoosh, bell, fizz, boing, pop, sparkle, guitar strum, twinkle) made in Python stdlib. | `school-day-45s/assets/`, `make_sfx.py`, `words.txt` |
| 6. Lip sync | **Skipped.** Cut-out stickers have a fixed mouth. | — |
| Render | `render` 1 min 7.3 s for 1350 frames, drawelement, hardware GPU, 3 workers | `school-day-45s/renders/` |

`check`: 0 errors. 3 lint warnings left (track density and two `nested_structure_needs_subcomposition` layout notes).
