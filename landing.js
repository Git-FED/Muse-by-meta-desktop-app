const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const meter = document.querySelector('.scroll-meter span');
const nav = document.querySelector('[data-nav]');
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  meter?.style.setProperty('--scroll', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
  nav?.classList.toggle('is-sticky', window.scrollY > 40);
};
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

if (!reducedMotion) {
  const light = document.querySelector('.cursor-light');
  window.addEventListener('pointermove', (event) => {
    if (light) {
      light.style.left = `${event.clientX}px`;
      light.style.top = `${event.clientY}px`;
      light.style.opacity = '1';
    }
  });
  document.querySelectorAll('[data-tilt]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      element.style.setProperty('--tilt-x', `${x * 3}deg`);
      element.style.setProperty('--tilt-y', `${y * -3}deg`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
    });
  });
}

const focusToggle = document.querySelector('[data-focus-toggle]');
const focusState = document.querySelector('[data-focus-state]');
const demoLabel = document.querySelector('[data-demo-label]');
focusToggle?.addEventListener('click', () => {
  const enabled = focusToggle.getAttribute('aria-pressed') !== 'true';
  focusToggle.setAttribute('aria-pressed', String(enabled));
  focusState.textContent = enabled ? 'Quiet view enabled' : 'Tap to preview';
  if (demoLabel) demoLabel.textContent = enabled ? 'A quieter place to think' : 'Start a new conversation';
  document.querySelector('.window-scene')?.classList.toggle('is-focused', enabled);
});

const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  reveals.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(22px)';
    item.style.transition = 'opacity .75s ease, transform .75s cubic-bezier(.2,.7,.2,1)';
    observer.observe(item);
  });
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

const style = document.createElement('style');
style.textContent = '[data-reveal].is-visible{opacity:1!important;transform:translateY(0)!important}.window-scene.is-focused .app-window{transform:rotate(0) scale(1.045);box-shadow:0 40px 110px rgba(0,0,0,.66),0 0 85px rgba(135,196,255,.32)}.window-scene.is-focused .scene-aura{animation-duration:1.8s}.window-scene.is-focused .workspace{background:linear-gradient(135deg,rgba(135,196,255,.06),transparent)}';
document.head.append(style);

const particleCanvas = document.querySelector('[data-particle-field]');
const particleScene = particleCanvas?.closest('.window-scene');
if (particleCanvas && particleScene) {
  const context = particleCanvas.getContext('2d');
  const particles = [];
  const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = particleScene.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    particleCanvas.width = Math.round(width * ratio);
    particleCanvas.height = Math.round(height * ratio);
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;
    const count = width < 650 ? 42 : 78;
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .18,
        vy: (Math.random() - .5) * .18,
        radius: Math.random() * 1.8 + .45,
        alpha: Math.random() * .55 + .18,
        hue: Math.random() > .68 ? '157,131,255' : '113,183,255',
      });
    }
  };

  const draw = (animate = true) => {
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.targetX - pointer.x) * .08;
    pointer.y += (pointer.targetY - pointer.y) * .08;
    particles.forEach((particle) => {
      if (animate) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 150) {
          const force = (1 - distance / 150) * .014;
          particle.vx -= dx * force;
          particle.vy -= dy * force;
        }
        particle.vx += (Math.random() - .5) * .002;
        particle.vy += (Math.random() - .5) * .002;
        particle.vx *= .992;
        particle.vy *= .992;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }
      const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 5);
      glow.addColorStop(0, `rgba(${particle.hue},${particle.alpha})`);
      glow.addColorStop(1, `rgba(${particle.hue},0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
      context.fill();
    });
    context.lineWidth = .6;
    particles.forEach((particle, index) => {
      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 92) {
          context.strokeStyle = `rgba(113,183,255,${(1 - distance / 92) * .15})`;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });
    if (animate) window.requestAnimationFrame(() => draw(true));
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (!reducedMotion) {
    particleScene.addEventListener('pointermove', (event) => {
      const rect = particleScene.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
    });
    particleScene.addEventListener('pointerleave', () => {
      pointer.targetX = -9999;
      pointer.targetY = -9999;
    });
    window.requestAnimationFrame(() => draw(true));
  } else {
    draw(false);
  }
}
