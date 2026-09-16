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
const FALL_BASE = 120;
const FALL_EXP = 3.2;
const MAX_FALL_SPEED = 3200;
const WALK_SPEED = 70;
const RUN_SPEED = 155;
const JUMP_VY = -450;
const JUMP_VX = 120;
const FLEE_VX = 180;
const FRAME_RATE = 8;
const SCARED_SPEED = 1400;
const SCARED_COOLDOWN = 12;
const CURIOUS_HOVER = 1.2;
const CURIOUS_COOLDOWN = 20;

type PetState =
  | "idle"
  | "sit"
  | "sleep"
  | "groom"
  | "stretch"
  | "walk"
  | "run"
  | "loaf"
  | "catflip"
  | "confused"
  | "jump"
  | "fall"
  | "landing"
  | "curious"
  | "scared"
  | "grabbed";

interface StateSpec {
  anim: string;
  intro?: string;
  duration?: [number, number];
}

const STATES: Record<PetState, StateSpec> = {
  idle: { anim: "stand_idle" },
  sit: { anim: "sit_idle", duration: [8, 20] },
  sleep: { anim: "lay_idle", intro: "laying" },
  groom: { anim: "lick", duration: [4, 9] },
  stretch: { anim: "stand_idle", intro: "stand_up", duration: [2, 4] },
  walk: { anim: "walk" },
  run: { anim: "run" },
  loaf: { anim: "loaf_idle", duration: [10, 30] },
  catflip: { anim: "catflip", duration: [1.5, 2.5] },
  confused: { anim: "confused", duration: [2, 4] },
  jump: { anim: "jump" },
  fall: { anim: "falling" },
  landing: { anim: "stand_idle", intro: "landing", duration: [0.5, 0.7] },
  curious: { anim: "touch", duration: [2, 4] },
  scared: { anim: "scared", duration: [0.7, 1.1] },
  grabbed: { anim: "grabbed" },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

class Pet {
  private ctx: CanvasRenderingContext2D;
  private manifest: Manifest | null = null;
  private frames: Record<string, HTMLImageElement[]> = {};
  private composed: Record<string, HTMLCanvasElement[]> = {};
  private state: PetState = "idle";
  private facing = 1;
  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;
  private floor = 0;
  private animTime = 0;
  private worldTime = 0;
  private stateTime = 0;
  private stateUntil = Infinity;
  private introUntil = 0;
  private sleepMax = 20;
  private energy = 75;
  private boredom = 25;
  private nextDecision = 3;
  private dragging = false;
  private grabOffsetX = 0;
  private grabOffsetY = 0;
  private hoverTime = 0;
  private hovering = false;
  private lastPointerScreenX = 0;
  private lastPointerScreenY = 0;
  private lastPointerTime = 0;
  private lastCursorScreenX = 0;
  private lastScaredAt = -99;
  private lastCuriousAt = -99;
  private lastDrawKey = "";
  private lastTime = performance.now();

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
    canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointercancel", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointerenter", () => {
      this.hovering = true;
    });
    canvas.addEventListener("pointerleave", () => {
      this.hovering = false;
      this.hoverTime = 0;
    });
  }

  async init(): Promise<void> {
    this.manifest = await window.petApi.getManifest();
    this.canvas.width = this.manifest.windowSize;
    this.canvas.height = this.manifest.windowSize;
    for (const [name, paths] of Object.entries(this.manifest.animations)) {
      this.frames[name] = await Promise.all(paths.map((p) => this.loadImage(p)));
      this.composed[name] = this.frames[name].map((img) =>
        this.precompose(img, this.manifest!.windowSize)
      );
    }
    const wa = this.manifest.workArea;
    this.floor = wa.y + wa.height - this.manifest.windowSize;
    this.x = wa.x + wa.width / 2;
    this.y = this.floor;
    await window.petApi.setPosition(this.x, this.y);
    this.setState("idle");
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

  private precompose(img: HTMLImageElement, size: number): HTMLCanvasElement {
    const sil = document.createElement("canvas");
    sil.width = size;
    sil.height = size;
    const sctx = sil.getContext("2d") as CanvasRenderingContext2D;
    sctx.imageSmoothingEnabled = false;
    sctx.fillStyle = "#ffffff";
    sctx.fillRect(0, 0, size, size);
    sctx.globalCompositeOperation = "source-in";
    sctx.drawImage(img, 0, 0, size, size);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.85)";
    ctx.shadowBlur = 6;
    ctx.drawImage(sil, 0, 0);
    ctx.restore();
    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  }

  private rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private setState(next: PetState): void {
    this.state = next;
    this.stateTime = 0;
    this.animTime = 0;
    const spec = STATES[next];
    const introFrames = spec.intro ? (this.frames[spec.intro]?.length ?? 0) : 0;
    this.introUntil = introFrames > 0 ? introFrames / FRAME_RATE : 0;
    this.stateUntil = spec.duration ? this.rand(spec.duration[0], spec.duration[1]) : Infinity;
    switch (next) {
      case "walk":
      case "run": {
        const speed = next === "run" ? RUN_SPEED : WALK_SPEED;
        this.facing = Math.random() < 0.5 ? 1 : -1;
        this.vx = speed * this.facing;
        this.vy = 0;
        break;
      }
      case "sleep":
        this.vx = 0;
        this.vy = 0;
        this.sleepMax = this.rand(15, 40);
        break;
      case "jump":
      case "fall":
        break;
      default:
        this.vx = 0;
        this.vy = 0;
    }
  }

  private decide(): void {
    const weights: Array<[PetState, number]> = [];
    const w = (s: PetState, n: number): void => {
      weights.push([s, n]);
    };
    w("sleep", this.energy < 25 ? 10 : this.energy < 55 ? 3 : 1);
    w("idle", 5);
    w("sit", 2);
    w("loaf", 3);
    w("groom", 2);
    w("stretch", 1);
    w("walk", this.boredom > 60 ? 6 : 1.5);
    w("run", this.boredom > 80 ? 3 : 0.2);
    w("catflip", 0.4);
    w("confused", 0.5);
    let total = 0;
    for (const [, n] of weights) total += n;
    let r = Math.random() * total;
    let chosen: PetState = "idle";
    for (const [s, n] of weights) {
      r -= n;
      if (r <= 0) {
        chosen = s;
        break;
      }
    }
    this.setState(chosen);
  }

  private jump(dir: number, power: "play" | "flee"): void {
    this.setState("jump");
    this.facing = dir;
    this.vx = (power === "play" ? JUMP_VX : FLEE_VX) * dir;
    this.vy = JUMP_VY;
    this.boredom = clamp(this.boredom - 25, 0, 100);
  }

  private cursorSide(): number {
    return this.lastCursorScreenX < this.x + this.manifest!.windowSize / 2 ? -1 : 1;
  }

  private scare(): void {
    this.setState("scared");
    this.facing = this.cursorSide();
    this.lastScaredAt = this.worldTime;
    this.hoverTime = 0;
  }

  private curious(): void {
    this.setState("curious");
    this.facing = this.cursorSide();
    this.lastCuriousAt = this.worldTime;
    this.hoverTime = 0;
  }

  private flee(): void {
    const dir = this.cursorSide();
    this.lastScaredAt = this.worldTime;
    this.jump(dir, "flee");
  }

  private onPointerDown(e: PointerEvent): void {
    this.dragging = true;
    this.hovering = false;
    this.setState("grabbed");
    this.canvas.setPointerCapture(e.pointerId);
    this.grabOffsetX = e.offsetX;
    this.grabOffsetY = e.offsetY;
  }

  private onPointerMove(e: PointerEvent): void {
    this.lastCursorScreenX = e.screenX;
    if (this.dragging) {
      if (!this.manifest) return;
      const wa = this.manifest.workArea;
      const maxX = wa.x + wa.width - this.manifest.windowSize;
      const maxY = wa.y + wa.height - this.manifest.windowSize;
      const nx = clamp(e.screenX - this.grabOffsetX, wa.x, maxX);
      const ny = clamp(e.screenY - this.grabOffsetY, wa.y, maxY);
      this.x = nx;
      this.y = ny;
      void window.petApi.setPosition(nx, ny);
      return;
    }
    const now = performance.now();
    const dtMs = now - this.lastPointerTime;
    const dist = Math.hypot(
      e.screenX - this.lastPointerScreenX,
      e.screenY - this.lastPointerScreenY
    );
    const speed = dtMs > 0 ? dist / (dtMs / 1000) : 0;
    this.lastPointerTime = now;
    this.lastPointerScreenX = e.screenX;
    this.lastPointerScreenY = e.screenY;
    const calm: PetState[] = ["idle", "sit", "groom", "curious", "loaf"];
    if (!calm.includes(this.state)) return;
    if (speed > SCARED_SPEED && this.worldTime - this.lastScaredAt > SCARED_COOLDOWN) {
      this.scare();
    }
  }

  private onPointerUp(_e: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.hoverTime = 0;
    this.setState(this.y >= this.floor ? "idle" : "fall");
    this.nextDecision = this.rand(1, 3);
  }

  private energyRate(): number {
    switch (this.state) {
      case "walk":
        return -2.5;
      case "run":
      case "jump":
        return -3.5;
      case "catflip":
        return -0.5;
      case "sleep":
        return 5;
      case "loaf":
        return -0.05;
      case "scared":
      case "fall":
      case "grabbed":
        return 0;
      default:
        return -0.4;
    }
  }

  private boredomRate(): number {
    switch (this.state) {
      case "walk":
      case "catflip":
      case "curious":
        return -2;
      case "run":
        return -3;
      case "scared":
        return -1;
      case "confused":
        return -0.5;
      case "sleep":
        return 0.15;
      case "loaf":
        return 0.4;
      default:
        return 0.8;
    }
  }

  private tick(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.worldTime += dt;
    this.animTime += dt;
    this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.tick(t));
  }

  private update(dt: number): void {
    if (this.dragging || !this.manifest) return;
    const wa = this.manifest.workArea;
    this.stateTime += dt;

    this.energy = clamp(this.energy + this.energyRate() * dt, 0, 100);
    this.boredom = clamp(this.boredom + this.boredomRate() * dt, 0, 100);

    if (this.state === "walk" || this.state === "run") {
      const speed = this.state === "run" ? RUN_SPEED : WALK_SPEED;
      this.x += this.vx * dt;
      if (this.x <= wa.x + 2) {
        this.x = wa.x + 2;
        this.facing = 1;
        this.vx = speed;
      } else if (this.x >= wa.x + wa.width - this.manifest.windowSize - 2) {
        this.x = wa.x + wa.width - this.manifest.windowSize - 2;
        this.facing = -1;
        this.vx = -speed;
      }
      void window.petApi.setPosition(this.x, this.y);
    }

    if (this.state === "jump" || this.state === "fall") {
      const g =
        this.state === "fall"
          ? FALL_BASE * Math.exp(FALL_EXP * this.stateTime)
          : GRAVITY;
      this.vy += g * dt;
      this.vy = Math.min(this.vy, this.state === "fall" ? MAX_FALL_SPEED : 1600);
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      const maxX = wa.x + wa.width - this.manifest.windowSize - 2;
      if (this.x <= wa.x + 2) {
        this.x = wa.x + 2;
        this.vx = 0;
      } else if (this.x >= maxX) {
        this.x = maxX;
        this.vx = 0;
      }
      if (this.y >= this.floor) {
        this.y = this.floor;
        this.vx = 0;
        this.vy = 0;
        this.setState("landing");
        this.nextDecision = this.rand(1, 3);
      } else {
        void window.petApi.setPosition(this.x, this.y);
      }
    }

    if (this.state === "sleep") {
      if ((this.energy >= 100 && this.stateTime >= 8) || this.stateTime >= this.sleepMax) {
        this.setState("stretch");
      }
    }

    if (this.stateTime >= this.stateUntil && this.state !== "sleep") {
      if (this.state === "scared") {
        this.flee();
      } else {
        this.decide();
      }
    }

    this.nextDecision -= dt;
    if (this.nextDecision <= 0) {
      if (this.state === "idle" || this.state === "walk" || this.state === "sit") {
        this.decide();
      }
      this.nextDecision = this.rand(3, 10);
    }

    if (this.hovering) {
      this.hoverTime += dt;
      if (
        this.hoverTime > CURIOUS_HOVER &&
        (this.state === "idle" || this.state === "sit" || this.state === "loaf") &&
        this.worldTime - this.lastCuriousAt > CURIOUS_COOLDOWN
      ) {
        this.curious();
      }
    }
  }

  private animName(): string {
    const spec = STATES[this.state];
    if (spec.intro && this.animTime < this.introUntil) return spec.intro;
    return spec.anim;
  }

  private draw(): void {
    if (!this.manifest) return;
    const anim = this.animName();
    const frames = this.frames[anim] ?? [];
    if (frames.length === 0) return;
    const index = Math.floor(this.animTime * FRAME_RATE) % frames.length;
    const key = `${anim}:${index}:${this.facing}`;
    if (key === this.lastDrawKey) return;
    this.lastDrawKey = key;
    const composed = this.composed[anim]?.[index];
    if (!composed) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.save();
    this.ctx.scale(this.facing, 1);
    const dw = this.manifest.windowSize;
    const dx = this.facing === 1 ? 0 : -dw;
    this.ctx.drawImage(composed, dx, 0, dw, dw);
    this.ctx.restore();
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const pet = new Pet(canvas);
pet.init().catch((err) => {
  console.error("pet init failed", err);
});

export {};
