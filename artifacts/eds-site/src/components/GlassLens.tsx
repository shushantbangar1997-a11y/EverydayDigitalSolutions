import { useEffect, useRef } from "react";
import { canUseWebGL, prefersReducedMotion } from "@/lib/canUseWebGL";

const VERT = `#version 300 es
precision highp float;
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;
uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.0 - uv.y;

  // ── Primary specular blob (Gaussian, mouse-driven + slow liquid drift) ──
  vec2 specPos = vec2(
    0.20 + u_mouse.x * 0.42 + 0.06 * sin(u_time * 0.41),
    0.15 + u_mouse.y * 0.26 + 0.04 * cos(u_time * 0.29)
  );
  float d1   = dot(uv - specPos, uv - specPos);
  float spec = exp(-d1 * 8.5) * 0.72;

  // ── Secondary catch-light (tight, offset — two-point glass lighting) ──
  vec2 spec2Pos = specPos + vec2(
    0.09 * cos(u_time * 0.19),
   -0.07 * sin(u_time * 0.23)
  );
  float d2    = dot(uv - spec2Pos, uv - spec2Pos);
  float spec2 = exp(-d2 * 32.0) * 0.38;

  // ── Top-edge bevel (dominant — pane lit from above) ───────────────────
  float topBevel  = pow(max(0.0, 1.0 - uv.y * 4.0), 2.0) * 0.40;
  float leftBevel = pow(max(0.0, 1.0 - uv.x * 5.5), 2.0) * 0.15;

  // ── Fresnel rim glow on bottom + right edges ──────────────────────────
  float bottomRim = pow(max(0.0, 1.0 - (1.0 - uv.y) * 7.0), 3.0) * 0.09;
  float rightRim  = pow(max(0.0, 1.0 - (1.0 - uv.x) * 7.0), 3.0) * 0.07;

  // ── Slow shimmer sweep ────────────────────────────────────────────────
  float sweepX = fract(u_time * 0.05);
  float sweep  = smoothstep(sweepX - 0.16, sweepX, uv.x)
               * (1.0 - smoothstep(sweepX, sweepX + 0.16, uv.x));
  sweep *= 0.13 * pow(1.0 - uv.y, 1.4);

  float alpha = clamp(
    spec + spec2 + topBevel + leftBevel + bottomRim + rightRim + sweep,
    0.0, 0.84
  );
  fragColor = vec4(1.0, 1.0, 1.0, alpha);
}`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) {
      console.debug("[GlassLens] shader compile error:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function GlassLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canUseWebGL() || prefersReducedMotion()) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (import.meta.env.DEV) {
        console.debug("[GlassLens] program link error:", gl.getProgramInfoLog(prog));
      }
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uRes    = gl.getUniformLocation(prog, "u_res");
    const uMouse  = gl.getUniformLocation(prog, "u_mouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouse = { x: 0.3, y: 0.3 };

    const onMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };
    const parent = canvas.parentElement;
    parent?.addEventListener("mousemove", onMouseMove);

    let start: number | null = null;
    let pauseOffset = 0;        // shader-time accumulated while paused
    let rafId = 0;
    let inView = true;          // observer hasn't fired yet → assume visible
    let tabVisible = !document.hidden;

    const render = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000 - pauseOffset;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(render);
    };

    // Track when render is paused so resuming doesn't jump the shader clock.
    let pausedAt: number | null = null;
    const stop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
      pausedAt = performance.now();
    };
    const go = () => {
      if (rafId || !inView || !tabVisible) return;
      if (pausedAt !== null && start !== null) {
        pauseOffset += (performance.now() - pausedAt) / 1000;
        pausedAt = null;
      }
      rafId = requestAnimationFrame(render);
    };

    // Pause when the canvas scrolls out of the viewport. Hero is small and
    // disappears quickly, so this saves the shader on every page below it.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) go();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Pause when the tab is hidden.
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) go();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      parent?.removeEventListener("mousemove", onMouseMove);
      gl.deleteBuffer(buf);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        borderRadius: "inherit",
      }}
    />
  );
}
