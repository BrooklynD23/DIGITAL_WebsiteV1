"""
Normalize Image1..Image12 (varying sizes/aspect) onto ONE identical canvas so the
scroll crossfade is pixel-stable and the studio-grey backgrounds blend seamlessly.

- Target canvas: 1700 x 1120 (holds the wide exploded frames; portrait close-ups
  get side padding).
- Each frame is centered and the padding is filled with THAT frame's own sampled
  background grey, so no visible edge appears between render and padding.
- Output: site/assets/frames/frame-01.png .. frame-12.png
"""
from PIL import Image
import os, statistics

SRC = "/mnt/user-data/uploads"
OUT = "/home/claude/site/assets/frames"
os.makedirs(OUT, exist_ok=True)
CW, CH = 1700, 1120

def bg_color(im):
    w, h = im.size
    pts = []
    for x in range(0, w, max(1, w//40)):
        pts.append(im.getpixel((x, 1))); pts.append(im.getpixel((x, h-2)))
    for y in range(0, h, max(1, h//40)):
        pts.append(im.getpixel((1, y))); pts.append(im.getpixel((w-2, y)))
    r = int(statistics.median(p[0] for p in pts))
    g = int(statistics.median(p[1] for p in pts))
    b = int(statistics.median(p[2] for p in pts))
    return (r, g, b)

# Scroll-DOWN DISASSEMBLES the phone (start assembled, peel apart layer by layer)
# so visitors can inspect the hardware. File order already matches:
# Image1 = assembled, Image12 = fully exploded.
for out_idx in range(1, 13):
    src_n = out_idx               # 1->1 (assembled) ... 12->12 (exploded)
    im = Image.open(f"{SRC}/Image{src_n}.png").convert("RGB")
    bg = bg_color(im)
    # scale to fit within canvas, preserving aspect, never upscaling beyond ~1.0
    scale = min(CW / im.width, CH / im.height, 1.0)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im_r = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGB", (CW, CH), bg)
    canvas.paste(im_r, ((CW - nw) // 2, (CH - nh) // 2))
    canvas.save(f"{OUT}/frame-{out_idx:02d}.png")
    print(f"frame-{out_idx:02d}.png (<-Image{src_n})  bg={bg}  {nw}x{nh}")

print("done ->", OUT)
