import { useEffect, useRef, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1514525253361-b83f859b73c0?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000",
];

class HexLine {
  constructor(deps) {
    this.deps = deps;
    this.reset();
  }

  reset() {
    const { opts, getTick } = this.deps;
    this.x = 0;
    this.y = 0;
    this.addedX = 0;
    this.addedY = 0;
    this.rad = 0;
    this.color = `hsl(${getTick() * opts.hueChange}, 80%, 50%)`;
    this.beginPhase();
  }

  beginPhase() {
    const { opts, getBounds } = this.deps;

    this.x += this.addedX;
    this.y += this.addedY;
    this.time = 0;
    this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;
    this.rad += (Math.PI / 3) * (Math.random() < 0.5 ? 1 : -1);
    this.addedX = Math.cos(this.rad);
    this.addedY = Math.sin(this.rad);

    const { width, height } = getBounds();

    if (
      Math.random() < opts.dieChance ||
      this.x > width / 40 ||
      this.x < -width / 40 ||
      this.y > height / 40 ||
      this.y < -height / 40
    ) {
      this.reset();
    }
  }

  step() {
    const { ctx, opts } = this.deps;

    this.time += 1;
    if (this.time >= this.targetTime) this.beginPhase();

    const prop = this.time / this.targetTime;
    const wave = Math.sin((prop * Math.PI) / 2);
    const x = this.addedX * wave;
    const y = this.addedY * wave;

    ctx.shadowBlur = prop * 6;
    ctx.fillStyle = ctx.shadowColor = this.color;
    ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2);
  }
}

function NeonBackground() {
  const bgCanvasRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const animationRefs = useRef({ bg: null, slideshow: null });

  useEffect(() => {
    const refs = animationRefs.current;
    refs.slideshow = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (refs.slideshow) {
        clearInterval(refs.slideshow);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const refs = animationRefs.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let tick = 0;

    const hexLines = [];
    const opts = {
      len: 25,
      count: 40,
      baseTime: 15,
      addedTime: 15,
      dieChance: 0.05,
      hueChange: 0.15,
      cx: 0,
      cy: 0,
    };

    const getBounds = () => ({ width, height });
    const getTick = () => tick;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      opts.cx = width / 2;
      opts.cy = height / 2;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      tick += 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      hexLines.forEach((line) => line.step());
      refs.bg = requestAnimationFrame(animate);
    };

    resize();

    for (let i = 0; i < opts.count; i += 1) {
      hexLines.push(new HexLine({ ctx, opts, getTick, getBounds }));
    }

    animate();

    window.addEventListener("resize", resize);
    return () => {
      if (refs.bg) cancelAnimationFrame(refs.bg);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas id="bg-canvas" ref={bgCanvasRef} />
      <div className="slideshow-container" id="slideshow">
        {slides.map((url, index) => (
          <div
            key={url}
            className={`slide ${index === activeSlide ? "active" : ""}`}
            style={{ backgroundImage: `url('${url}')` }}
          />
        ))}
        <div className="overlay-gradient" />
      </div>
    </>
  );
}

export default NeonBackground;
