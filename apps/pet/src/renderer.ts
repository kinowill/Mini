interface Manifest {
  animations: Record<string, string[]>;
  scale: number;
  windowSize: number;
  workArea: { x: number; y: number; width: number; height: number };
}

declare global {
  interface Window {
    petApi: {
      getManifest(): Promise<Manifest>;
      setPosition(x: number, y: number): Promise<void>;
    };
  }
}

const GRAVITY = 1500;
const WALK_SPEED = 70;
const FRAME_RATE = 8;
const IDLE_ANIM = "stand_idle";
const WALK_ANIM = "walk";
const FALL_ANIM = "falling";
const GRAB_ANIM = "grabbed";

type PetState = "idle" | "walk" | "fall" | "grabbed";

class Pet {
  private ctx: CanvasRenderingContext2D;
  private manifest: Manifest | null = null;
  private frames: Record<string, HTMLImageElement[]> = {};
  private silhouettes: Record<string, HTMLCanvasElement[]> = {};
  private state: PetState = "idle";
  private facing = 1;
  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;
  private floor = 0;
  private animTime = 0;
  private nextDecision = 3;
  private dragging = false;
  private grabOffsetX = 0;
  private grabOffsetY = 0;
  private lastTime = performance.now();

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
    canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointercancel", (e) => this.onPointerUp(e));
  }

  async init(): Promise<void> {
    this.manifest = await window.petApi.getManifest();
    this.canvas.width = this.manifest.windowSize;
    this.canvas.height = this.manifest.windowSize;
    for (const [name, paths] of Object.entries(this.manifest.animations)) {
      this.frames[name] = await Promise.all(paths.map((p) => this.loadImage(p)));
      this.silhouettes[name] = this.frames[name].map((img) =>
        this.makeSilhouette(img, this.manifest!.windowSize)
      );
    }
    const wa = this.manifest.workArea;
    this.floor = wa.y + wa.height - this.manifest.windowSize;
    this.x = wa.x + wa.width / 2;
    this.y = this.floor;
    await window.petApi.setPosition(this.x, this.y);
    this.nextDecision = this.rand(2, 5);
    requestAnimationFrame((t) => this.tick(t));
  }

  private loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "file://" + path.replace(/\\/g, "/");
    });
  }

  private makeSilhouette(img: HTMLImageElement, size: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  }

  private rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private onPointerDown(e: PointerEvent): void {
    this.dragging = true;
    this.state = "grabbed";
    this.vx = 0;
    this.vy = 0;
    this.canvas.setPointerCapture(e.pointerId);
    this.grabOffsetX = e.offsetX;
    this.grabOffsetY = e.offsetY;
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.dragging || !this.manifest) return;
    const wa = this.manifest.workArea;
    const maxX = wa.x + wa.width - this.manifest.windowSize;
    const maxY = wa.y + wa.height - this.manifest.windowSize;
    const nx = Math.min(Math.max(e.screenX - this.grabOffsetX, wa.x), maxX);
    const ny = Math.min(Math.max(e.screenY - this.grabOffsetY, wa.y), maxY);
    this.x = nx;
    this.y = ny;
    void window.petApi.setPosition(nx, ny);
  }

  private onPointerUp(_e: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.state = this.y >= this.floor ? "idle" : "fall";
    this.nextDecision = this.rand(1, 3);
  }

  private decide(): void {
    if (this.state === "grabbed" || this.dragging) return;
    if (this.y < this.floor && this.state !== "fall") {
      this.state = "fall";
      return;
    }
    if (Math.random() < 0.45) {
      this.state = "walk";
      this.facing = Math.random() < 0.5 ? 1 : -1;
      this.vx = WALK_SPEED * this.facing;
    } else {
      this.state = "idle";
      this.vx = 0;
    }
  }

  private tick(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.update(dt);
    this.draw(dt);
    requestAnimationFrame((t) => this.tick(t));
  }

  private update(dt: number): void {
    if (this.dragging || !this.manifest) return;
    const wa = this.manifest.workArea;
    if (this.state === "walk") {
      this.x += this.vx * dt;
      if (this.x <= wa.x + 2) {
        this.x = wa.x + 2;
        this.facing = 1;
        this.vx = WALK_SPEED;
      } else if (this.x >= wa.x + wa.width - this.manifest.windowSize - 2) {
        this.x = wa.x + wa.width - this.manifest.windowSize - 2;
        this.facing = -1;
        this.vx = -WALK_SPEED;
      }
      void window.petApi.setPosition(this.x, this.y);
    }
    if (this.state === "fall") {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y >= this.floor) {
        this.y = this.floor;
        this.vy = 0;
        this.state = "idle";
        this.nextDecision = this.rand(1, 3);
      }
      void window.petApi.setPosition(this.x, this.y);
    }
    this.nextDecision -= dt;
    if (this.nextDecision <= 0) {
      this.decide();
      this.nextDecision = this.rand(3, 8);
    }
  }

  private currentFrames(): HTMLImageElement[] {
    const map: Record<PetState, string> = {
      idle: IDLE_ANIM,
      walk: WALK_ANIM,
      fall: FALL_ANIM,
      grabbed: GRAB_ANIM,
    };
    return this.frames[map[this.state]] ?? [];
  }

  private draw(dt: number): void {
    const frames = this.currentFrames();
    if (!this.manifest || frames.length === 0) return;
    this.animTime += dt;
    const index = Math.floor(this.animTime * FRAME_RATE) % frames.length;
    const img = frames[index];
    const silhouette = this.silhouettes[this.currentAnimName()]?.[index];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.save();
    this.ctx.scale(this.facing, 1);
    const dw = this.manifest.windowSize;
    const dx = this.facing === 1 ? 0 : -dw;
    if (silhouette) {
      this.ctx.save();
      this.ctx.shadowColor = "rgba(255,255,255,0.85)";
      this.ctx.shadowBlur = 6;
      this.ctx.drawImage(silhouette, dx, 0, dw, dw);
      this.ctx.restore();
    }
    this.ctx.drawImage(img, dx, 0, dw, dw);
    this.ctx.restore();
  }

  private currentAnimName(): string {
    const map: Record<PetState, string> = {
      idle: IDLE_ANIM,
      walk: WALK_ANIM,
      fall: FALL_ANIM,
      grabbed: GRAB_ANIM,
    };
    return map[this.state];
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const pet = new Pet(canvas);
pet.init().catch((err) => {
  console.error("pet init failed", err);
});

export {};
