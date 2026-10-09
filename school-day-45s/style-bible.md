# Style bible — "A School Day" (sticker boy)

Every scene follows this file. `lib/library.js` holds the values as `STYLE`.

## The boy
- The boy is **only** one of the 9 sticker PNGs in `assets/stickers/` (cut from `../stickers.png`,
  upscaled 2× with Lanczos). Never redraw him, recolor him, crop him, or remove the white die-cut border.
- Names: `grumpy`, `peace`, `surprised`, `laugh`, `pizza`, `thumbs`, `guitar`, `hearts`, `sleepy`.
- Bust stickers (`grumpy`, `peace`, `surprised`, `pizza`, `hearts`, `sleepy`) are cut flat at the bottom.
  Their bottom edge must sit behind a foreground prop (blanket, desk, table) or below the frame edge.
- Full-body stickers (`laugh`, `thumbs`, `guitar`) stand or sit on the floor line of the set.
- One sticker on screen at a time. Height on screen: 600–720 px.
- Motion pivots at the bottom centre of the sticker (squash, hop, sway). No skew, no flip.

## Colors (sampled from the stickers, then a bright kid palette for sets)
| Token | Hex | Use |
|---|---|---|
| ink | `#2b2420` | All set outlines, all text |
| paper | `#fff8ec` | Badge fill, highlights, sticker-white accents |
| sweater | `#8c8783` | Matches his sweater; set details only |
| skin | `#fdbf81` | Matches his skin; not used on sets |
| skyDawn / skyDay / skyDusk / skyNight | `#ffd6a8` / `#a8dcf2` / `#f7a983` / `#22305c` | Window and outdoor skies |
| wallBlue / wallCream / wallMint / wallRose | `#cfe6f7` / `#fde9bd` / `#d6f0d2` / `#f9d8cf` | Bedroom / classroom / cafeteria / dining |
| wood / woodDark | `#d6995f` / `#b0733f` | Furniture |
| grass / grassDark | `#93d36c` / `#6db44d` | Playground, street |
| red / yellow / teal / orange / pink / purple | `#ef5b4c` / `#ffc93c` / `#3fbfb0` / `#ff9a3c` / `#ff8fb1` / `#9b7be0` | Props, accents |
| board | `#2f5d4e` | Chalkboard |

## Line weight
- Set outlines: 6 px at 1920×1080, round joins and caps. Small details: 4 px.
- Flat fills only. No gradients. One darker shade per surface for shadow (no blur).

## Light
- Time of day lives in the sky color in the window or outdoors: dawn → day → dusk → night.
- Night: a flat `#0d1330` overlay at up to 60% opacity. Lamp light is a flat pale-yellow circle.

## Type
- `system-ui, sans-serif`, weight 800 for badge and titles, weight 700 for small text.

## Camera and cuts
- Each scene pushes in slowly (scale 1.00 → 1.06).
- Scene cuts hide behind a full-frame color wipe (0.25 s in, 0.3 s out) with a whoosh.
- The clock badge (top left) stays on screen all video. Its hands turn forward at each cut.

## Not allowed
- Gradients, blur, drop shadows, glows, 3D, shader transitions.
- New characters. Other people are shown only by props (a lunch tray, a family table), never drawn.
- Sets or props outside `lib/library.js`.
- Thin outlines (< 4 px) or outline colors other than ink.
