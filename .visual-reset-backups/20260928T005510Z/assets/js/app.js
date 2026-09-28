const projects = [
  {
    number: '01', icon: '✦', title: 'Prompt systems', tag: 'Systems', color: '#c8ff4a',
    text: 'Reusable patterns that make creative workflows clearer, faster, and more consistent.',
    principle: 'A good prompt does not just start a task. It gives the next person a reliable place to begin.'
  },
  {
    number: '02', icon: '↗', title: 'Product stories', tag: 'Editorial', color: '#97ceff',
    text: 'Landing pages and launch narratives built around what a product truly does.',
    principle: 'The strongest product story makes the useful thing impossible to miss—then gets out of the way.'
  },
  {
    number: '03', icon: '◌', title: 'Useful automation', tag: 'Tools', color: '#ff9a6d',
    text: 'Small tools that remove repetitive work without hiding how they operate.',
    principle: 'Automation earns trust when it keeps people informed, in control, and moving forward.'
  }
];

const projectRoot = document.getElementById('projects');
if (projectRoot) {
  projectRoot.innerHTML = projects.map((project) => `
    <article class="project" tabindex="0" role="button" aria-expanded="false" style="--card-color:${project.color}">
      <div class="project-top"><span>${project.number} / ${project.tag}</span><span class="project-icon">${project.icon}</span></div>
      <div class="project-content"><h3>${project.title}</h3><p>${project.text}</p></div>
      <div class="project-extra"><span>${project.principle}</span></div>
      <div class="project-bottom"><span>Working principle</span><b>+</b></div>
    </article>
  `).join('');

  projectRoot.querySelectorAll('.project').forEach((card) => {
    const toggle = () => {
      const isOpen = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', String(isOpen));
      card.querySelector('.project-bottom b').textContent = isOpen ? '−' : '+';
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const meter = document.querySelector('.scroll-meter span');
const header = document.querySelector('[data-site-header]');
const onScroll = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (meter) meter.style.setProperty('--scroll', `${maxScroll ? (window.scrollY / maxScroll) * 100 : 0}%`);
  header?.classList.toggle('is-scrolled', window.scrollY > 36);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const motionOkay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOkay) {
  const cursor = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    if (cursor) {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.opacity = '1';
    }
  });

  document.querySelectorAll('[data-tilt]').forEach((element) => {
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
}

const signal = document.querySelector('[data-signal-toggle]');
signal?.addEventListener('click', () => {
  const isPressed = signal.getAttribute('aria-pressed') === 'true';
  signal.setAttribute('aria-pressed', String(!isPressed));
  document.querySelector('.hero-visual')?.classList.toggle('is-energized', !isPressed);
});

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && motionOkay) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(22px)';
    item.style.transition = 'opacity .75s ease, transform .75s cubic-bezier(.2,.7,.2,1)';
    observer.observe(item);
  });
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => document.querySelector('.hero-copy')?.classList.add('is-visible')));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const style = document.createElement('style');
style.textContent = '[data-reveal].is-visible{opacity:1!important;transform:translateY(0)!important}.hero-visual.is-energized .orbit{animation-duration:5s}.hero-visual.is-energized .visual-glow{animation-duration:1.4s}.hero-visual.is-energized .signal-grid{opacity:.9}';
document.head.append(style);

const portfolioCanvases = document.querySelectorAll('[data-particle-field]');
const reducedPortfolioMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
portfolioCanvases.forEach((canvas) => {
  const host = canvas.parentElement;
  const context = canvas.getContext('2d');
  if (!host || !context) return;
  const points = [];
  const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
  let width = 0;
  let height = 0;

  const resizeParticles = () => {
    const box = host.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points.length = 0;
    const count = width < 700 ? 28 : 52;
    for (let index = 0; index < count; index += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .16,
        vy: (Math.random() - .5) * .16,
        radius: Math.random() * 1.5 + .4,
        tint: Math.random() > .7 ? '151,206,255' : '200,255,74',
      });
    }
  };

  const renderParticles = (animate) => {
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.targetX - pointer.x) * .08;
    pointer.y += (pointer.targetY - pointer.y) * .08;
    points.forEach((point) => {
      if (animate) {
        const dx = pointer.x - point.x;
        const dy = pointer.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 140) {
          const force = (1 - distance / 140) * .012;
          point.vx -= dx * force;
          point.vy -= dy * force;
        }
        point.vx *= .994;
        point.vy *= .994;
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < -15) point.x = width + 15;
        if (point.x > width + 15) point.x = -15;
        if (point.y < -15) point.y = height + 15;
        if (point.y > height + 15) point.y = -15;
      }
      context.fillStyle = `rgba(${point.tint},.82)`;
      context.shadowBlur = 8;
      context.shadowColor = `rgba(${point.tint},.45)`;
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.shadowBlur = 0;
    context.lineWidth = .55;
    points.forEach((point, index) => {
      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 105) {
          context.strokeStyle = `rgba(151,206,255,${(1 - distance / 105) * .12})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });
    if (animate) window.requestAnimationFrame(() => renderParticles(true));
  };

  resizeParticles();
  window.addEventListener('resize', resizeParticles, { passive: true });
  host.addEventListener('pointermove', (event) => {
    const box = host.getBoundingClientRect();
    pointer.targetX = event.clientX - box.left;
    pointer.targetY = event.clientY - box.top;
  });
  host.addEventListener('pointerleave', () => {
    pointer.targetX = -9999;
    pointer.targetY = -9999;
  });
  renderParticles(!reducedPortfolioMotion);
});
