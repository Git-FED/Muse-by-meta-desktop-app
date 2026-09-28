const statusElement = document.getElementById('status');
const progress = document.querySelector('[data-load-value]');
const cursor = document.querySelector<HTMLElement>('.cursor-light');
const header = document.querySelector<HTMLElement>('.site-header');

window.addEventListener('pointermove', (event) => {
  if (cursor) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.opacity = '1';
  }
});
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll', `${max ? (window.scrollY / max) * 100 : 0}%`);
  header?.classList.toggle('is-scrolled', window.scrollY > 30);
}, { passive: true });

document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    element.style.setProperty('--tilt-x', `${x * 4}deg`);
    element.style.setProperty('--tilt-y', `${y * -4}deg`);
  });
  element.addEventListener('pointerleave', () => {
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  });
});

const focusToggle = document.querySelector<HTMLButtonElement>('[data-focus-toggle]');
focusToggle?.addEventListener('click', () => {
  const active = focusToggle.getAttribute('aria-pressed') === 'true';
  focusToggle.setAttribute('aria-pressed', String(!active));
  const label = focusToggle.querySelector('[data-focus-state]');
  if (label) label.textContent = active ? 'Tap to preview' : 'Focus preview active';
  document.querySelector('.window-scene')?.classList.toggle('is-focused', !active);
});

const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add('is-visible'));

const canvases = document.querySelectorAll<HTMLCanvasElement>('[data-particle-field]');
canvases.forEach((canvas) => {
  const host = canvas.parentElement;
  const context = canvas.getContext('2d');
  if (!host || !context) return;
  const particles: Array<{x:number;y:number;vx:number;vy:number;r:number;color:string}> = [];
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  let width = 0;
  let height = 0;
  const resize = () => {
    const box = host.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = box.width; height = box.height;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;
    for (let i = 0; i < (width < 700 ? 30 : 60); i += 1) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() * 1.4 + .4, color: Math.random() > .72 ? '173,140,255' : '135,196,255' });
  };
  const draw = (animate: boolean) => {
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.tx - pointer.x) * .08; pointer.y += (pointer.ty - pointer.y) * .08;
    particles.forEach((particle) => {
      if (animate) {
        const dx = pointer.x - particle.x; const dy = pointer.y - particle.y; const distance = Math.hypot(dx, dy);
        if (distance < 150) { particle.vx -= dx * (1 - distance / 150) * .01; particle.vy -= dy * (1 - distance / 150) * .01; }
        particle.vx *= .995; particle.vy *= .995; particle.x += particle.vx; particle.y += particle.vy;
        if (particle.x < -10) particle.x = width + 10; if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10; if (particle.y > height + 10) particle.y = -10;
      }
      context.fillStyle = `rgba(${particle.color},.72)`; context.shadowBlur = 9; context.shadowColor = `rgba(${particle.color},.35)`;
      context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2); context.fill();
    });
    context.shadowBlur = 0; context.lineWidth = .5;
    particles.forEach((particle, index) => particles.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 110) { context.strokeStyle = `rgba(135,196,255,${(1 - distance / 110) * .1})`; context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y); context.stroke(); }
    }));
    if (animate) window.requestAnimationFrame(() => draw(true));
  };
  resize(); window.addEventListener('resize', resize, { passive: true });
  host.addEventListener('pointermove', (event) => { const box = host.getBoundingClientRect(); pointer.tx = event.clientX - box.left; pointer.ty = event.clientY - box.top; });
  host.addEventListener('pointerleave', () => { pointer.tx = -9999; pointer.ty = -9999; });
  draw(!reducedMotion);
});

if (statusElement) statusElement.textContent = 'Muse Desktop is ready.';
if (progress) progress.textContent = 'READY';
