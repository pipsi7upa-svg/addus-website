/**
 * aurora.js — WebGL Aurora Shader Background
 * Gold/Amber color scheme for addus. hero section
 */
(function () {
  'use strict';

  const canvas = document.getElementById('auroraCanvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const mousePos = { x: 0.5, y: 0.5 };

  const vertSrc = `
    attribute vec2 aPosition;
    void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
  `;

  // Gold/Amber aurora with subtle warm tones
  const fragSrc = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 iMouse;

    #define STEPS 24

    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float fbm(vec3 p) {
      float f = 0.0, amp = 0.5;
      for (int i = 0; i < 4; i++) {
        f += amp * hash(p.xy);
        p *= 2.0;
        amp *= 0.5;
      }
      return f;
    }

    float map(vec3 p) {
      vec3 q = p;
      q.z += iTime * 0.35;
      vec2 mouse = (iMouse / iResolution - 0.5) * 2.0;
      q.xy += mouse * 0.25;
      float f = fbm(q * 2.0);
      f *= sin(p.y * 2.0 + iTime) * 0.5 + 0.5;
      return clamp(f, 0.0, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
      vec3 ro = vec3(0.0, -1.0, 0.0);
      vec3 rd = normalize(vec3(uv, 1.0));
      vec3 col = vec3(0.0);
      float t = 0.0;

      for (int i = 0; i < STEPS; i++) {
        vec3 p = ro + rd * t;
        float density = map(p);
        if (density > 0.0) {
          // Gold/amber palette: warm yellows, oranges, subtle copper
          vec3 auroraColor = vec3(
            0.78 + 0.22 * cos(iTime * 0.3 + p.y * 1.5),
            0.55 + 0.2 * cos(iTime * 0.3 + p.y * 1.5 + 1.0),
            0.15 + 0.15 * cos(iTime * 0.3 + p.y * 1.5 + 3.0)
          );
          col += auroraColor * density * 0.08;
        }
        t += 0.12;
      }

      // Darken edges for text readability
      float vignette = 1.0 - length(uv) * 0.6;
      col *= vignette;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compileShader(src, type) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  var vs = compileShader(vertSrc, gl.VERTEX_SHADER);
  var fs = compileShader(fragSrc, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Link error:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  var verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  var aPos = gl.getAttribLocation(prog, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'iResolution');
  var uTime = gl.getUniformLocation(prog, 'iTime');
  var uMouse = gl.getUniformLocation(prog, 'iMouse');

  var t0 = performance.now();
  var rafId;

  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mousePos.x = (e.clientX - r.left) / r.width;
    mousePos.y = (e.clientY - r.top) / r.height;
  });

  // Reduced motion: show static frame
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isVisible = true;

  // Pause rendering when hero is scrolled out of view to save GPU
  var heroSection = canvas.closest('section') || canvas.parentElement;
  if (heroSection && typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !prefersReduced) rafId = requestAnimationFrame(render);
    }, { threshold: 0 }).observe(heroSection);
  }

  function render() {
    if (gl.isContextLost() || !isVisible) return;
    gl.uniform1f(uTime, (performance.now() - t0) / 1000.0);
    gl.uniform2f(uMouse, mousePos.x * canvas.width, (1.0 - mousePos.y) * canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!prefersReduced) rafId = requestAnimationFrame(render);
  }

  render();
})();
