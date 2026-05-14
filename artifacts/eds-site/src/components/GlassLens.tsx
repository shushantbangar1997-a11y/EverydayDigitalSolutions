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

  // ── Specular highlight (Gaussian blob, mouse-driven) ──────────────
  vec2 specPos = vec2(
    0.22 + u_mouse.x * 0.38 + 0.05 * sin(u_time * 0.38),
    0.18 + u_mouse.y * 0.22 + 0.04 * cos(u_time * 0.27)
  );
  float spec = exp(-dot(uv - specPos, uv - specPos) * 10.0) * 0.52;

  // ── Top-edge bevel (light coming from above) ──────────────────────
  float topBevel  = pow(max(0.0, 1.0 - uv.y * 4.5), 2.0) * 0.28;
  float leftBevel = pow(max(0.0, 1.0 - uv.x * 6.0), 2.0) * 0.10;

  // ── Slow shimmer sweep across the surface ─────────────────────────
  float sweepX  = fract(u_time * 0.055);
  float sweep   = smoothstep(sweepX - 0.14, sweepX, uv.x)
                * (1.0 - smoothstep(sweepX, sweepX + 0.14, uv.x));
  sweep *= 0.09 * pow(1.0 - uv.y, 1.5);

  float alpha = clamp(spec + topBevel + leftBevel + sweep, 0.0, 0.70);
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
    let rafId = 0;

    const render = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;

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

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
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
