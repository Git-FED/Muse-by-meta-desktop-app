(() => {
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-home-visual]').forEach(visual => {
    visual.addEventListener('pointermove', event => { const box=visual.getBoundingClientRect(); const x=((event.clientX-box.left)/box.width-.5)*14; const y=((event.clientY-box.top)/box.height-.5)*14; visual.style.transform=`perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`; });
    visual.addEventListener('pointerleave', () => { visual.style.transform=''; });
  });
  document.querySelectorAll('[data-board-core]').forEach(core => core.addEventListener('click', () => { const active=core.classList.toggle('is-active'); core.textContent=active?'READY\nTO HELP':'NEED\nA ROUTE'; }));
  document.querySelectorAll('[data-lost-pulse]').forEach(button => button.addEventListener('click', () => { document.querySelector('.lost-code')?.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:600,easing:'ease-out'}); }));
})();
