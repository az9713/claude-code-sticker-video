# Sound effects made with code (the host's "Claude-generated sound" option). Stdlib only.
# Run: python make_sfx.py  -> writes assets/sfx-*.wav (44.1 kHz mono 16-bit).
import math, random, struct, wave

SR = 44100
rnd = random.Random(7)  # seeded: same files every run


def save(name, xs):
    peak = max(1e-9, max(abs(x) for x in xs))
    with wave.open(f"assets/sfx-{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(32000 * 0.9 * x / peak)) for x in xs))


def n(sec):
    return int(SR * sec)


def env(i, total, a=0.005, r=0.05):
    t, T = i / SR, total / SR
    return min(1.0, t / a) * min(1.0, max(0.0, (T - t) / r))


# alarm clock: three double-beeps at 2.2 kHz
alarm = []
for k in range(3):
    for b in range(2):
        L = n(0.09)
        alarm += [env(i, L, 0.003, 0.01) * (1 if math.sin(2 * math.pi * 2200 * i / SR) > 0 else -1) * 0.5 for i in range(L)]
        alarm += [0.0] * n(0.05)
    alarm += [0.0] * n(0.16)
save("alarm", alarm)

# whoosh: noise through a one-pole low-pass whose cutoff sweeps up then down
L = n(0.45); y = 0.0; whoosh = []
for i in range(L):
    p = i / L
    a = 0.02 + 0.25 * math.sin(math.pi * p)
    y += a * (rnd.uniform(-1, 1) - y)
    whoosh.append(y * math.sin(math.pi * p))
save("whoosh", whoosh)

# school bell: 1.3 s of a struck bell (partials) re-struck 12 times a second
L = n(1.3); bell = []
for i in range(L):
    t = i / SR
    strike = (t * 12) % 1 / 12
    tone = sum(a * math.sin(2 * math.pi * f * t) for f, a in ((1250, 1), (2710, 0.5), (4100, 0.3)))
    bell.append(tone * math.exp(-strike * 30) * env(i, L, 0.002, 0.3))
save("bell", bell)

# volcano fizz: low thump + hissing noise that fades
L = n(1.2); fizz = []; y = 0.0
for i in range(L):
    t = i / SR
    y += 0.35 * (rnd.uniform(-1, 1) - y)
    fizz.append(0.9 * math.sin(2 * math.pi * (90 - 40 * t) * t) * math.exp(-t * 9) + 0.5 * y * math.exp(-t * 2.2))
save("fizz", fizz)

# sparkle: rising glockenspiel arpeggio C6-E6-G6-C7
sparkle = [0.0] * n(1.2)
for k, f in enumerate((1047, 1319, 1568, 2093)):
    s = n(0.09 * k)
    for i in range(n(0.9)):
        t = i / SR
        if s + i < len(sparkle):
            sparkle[s + i] += (math.sin(2 * math.pi * f * t) + 0.3 * math.sin(2 * math.pi * 2 * f * t)) * math.exp(-t * 5)
save("sparkle", sparkle)

# guitar strum: Karplus-Strong E major chord, strings 25 ms apart
def pluck(freq, sec):
    N = int(SR / freq); buf = [rnd.uniform(-1, 1) for _ in range(N)]; out = []
    for i in range(n(sec)):
        x = buf[i % N]; nxt = buf[(i + 1) % N]
        buf[i % N] = 0.996 * 0.5 * (x + nxt)
        out.append(x)
    return out
strum = [0.0] * n(1.8)
for k, f in enumerate((82.4, 123.5, 164.8, 207.7, 246.9, 329.6)):
    s = n(0.025 * k)
    for i, v in enumerate(pluck(f, 1.6)):
        strum[s + i] += v
save("strum", strum)

# pop: short pitch drop
L = n(0.12)
save("pop", [math.sin(2 * math.pi * (900 - 5000 * i / SR) * i / SR) * env(i, L, 0.002, 0.06) for i in range(L)])

# twinkle: music-box lullaby phrase (E5 D5 C5 D5 E5 E5 E5)
notes = (659, 587, 523, 587, 659, 659, 659)
tw = [0.0] * n(0.42 * len(notes) + 1.5)
for k, f in enumerate(notes):
    s = n(0.42 * k)
    for i in range(n(1.5)):
        t = i / SR
        tw[s + i] += (math.sin(2 * math.pi * f * t) + 0.25 * math.sin(2 * math.pi * 3 * f * t)) * math.exp(-t * 3.5)
save("twinkle", tw)

# laugh-pop for recess and dinner: two quick boings
L = n(0.5)
save("boing", [math.sin(2 * math.pi * (300 + 200 * math.sin(2 * math.pi * 7 * i / SR)) * i / SR) * math.exp(-i / SR * 6) for i in range(L)])
print("ok")
