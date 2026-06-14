/* ── Preloader ── */
const loader = document.getElementById('loader');
// Цепочка: МО рисуется (0-1.4s) → прелоадер уходит вверх (1.6s)
// → каждая строка раскрывается clip-path шторкой слева→направо (85ms)
setTimeout(() => {
  loader.classList.add('out');
  loader.addEventListener('transitionend', () => {
    loader.style.display = 'none';
    document.querySelectorAll('.hero-afl').forEach((el, i) =>
      setTimeout(() => el.classList.add('vis'), 30 + i * 85));
    document.querySelectorAll('.afl').forEach((el, i) =>
      setTimeout(() => el.classList.add('vis'), 200 + i * 160));
  }, {once:true});
}, 1600);

/* ── Text Scramble ── */
function scramble(el, text) {
  const pool = 'АБВГДЕЖЗКЛМНОПРСТФХЭЮЯ#$%?<>[]+-=';
  const len = text.length;
  const q = Array.from({length:len}, (_,i) => ({
    to: text[i],
    start: Math.random()*18|0,
    end: (Math.random()*22+18+i*1.5)|0,
    char: ''
  }));
  let f = 0, raf;
  const tick = () => {
    let out = '', done = 0;
    for (let i = 0; i < len; i++) {
      if (f >= q[i].end) { out += q[i].to; done++; }
      else if (f >= q[i].start) {
        if (!q[i].char || Math.random() < .3)
          q[i].char = pool[Math.random()*pool.length|0];
        out += `<span style="color:var(--accent);opacity:.5">${q[i].char}</span>`;
      } else {
        out += text[i] === ' ' ? ' ' : '<span style="opacity:.08">_</span>';
      }
    }
    el.innerHTML = out;
    if (done < len) { f++; raf = requestAnimationFrame(tick); }
    else el.textContent = text;
  };
  cancelAnimationFrame(raf); tick();
}

/* ── Cursor ── */
(function(){
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot = document.getElementById('cdot');
  const ring = document.getElementById('cring');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.cssText = `left:${mx}px;top:${my}px`;
  });
  (function lr(){ rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
    ring.style.cssText=`left:${rx}px;top:${ry}px`;
    requestAnimationFrame(lr); })();
  document.querySelectorAll('a,button,.chip,.svc-card,.case-card,.pstep').forEach(el => {
    el.addEventListener('mouseenter',()=>{dot.classList.add('hv');ring.classList.add('hv');});
    el.addEventListener('mouseleave',()=>{dot.classList.remove('hv');ring.classList.remove('hv');});
  });
})();

/* ── Nav ── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
},{passive:true});

/* ── Code Rain Canvas ── */
(function(){
  const c = document.getElementById('hero-canvas');
  const ctx = c.getContext('2d');
  const hero = document.getElementById('hero');
  const resize = () => { c.width = hero.offsetWidth; c.height = hero.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);
  const CHARS = '01アイウTELEGRAMADSHTML<>/{}=;';
  const W2 = 18;
  let drops;
  const init = () => { drops = Array(Math.floor(c.width/W2)|0).fill(0).map(()=>Math.random()*-60|0); };
  init();
  window.addEventListener('resize', init);
  (function draw(){
    ctx.fillStyle = 'rgba(20,20,22,.1)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '13px Courier New';
    drops.forEach((d,i) => {
      const ch = CHARS[Math.random()*CHARS.length|0];
      const xp = i*W2/c.width;
      ctx.fillStyle = xp > .45
        ? `rgba(232,101,43,${Math.random()*.6+.08})`
        : `rgba(80,160,80,${Math.random()*.3+.04})`;
      ctx.fillText(ch, i*W2, d*W2);
      if (d*W2 > c.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
    requestAnimationFrame(draw);
  })();
})();

/* ── Scroll Reveal ── */
(function(){
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);} });
  },{threshold:.08});
  document.querySelectorAll('.rv,.rv-s').forEach(el => obs.observe(el));
})();

/* ── 3D tilt ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mouseenter', () => card.style.transition = 'transform .12s ease');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = ((e.clientX-r.left)-r.width/2)/(r.width/2);
    const dy = ((e.clientY-r.top)-r.height/2)/(r.height/2);
    card.style.transform = `perspective(900px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .8s cubic-bezier(.25,.46,.45,.94)';
    card.style.transform = '';
  });
});

/* ── Magnetic ── */
document.querySelectorAll('.mag').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.style.transition = 'transform .15s ease');
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX-r.left)-r.width/2)*.36;
    const y = ((e.clientY-r.top)-r.height/2)*.36;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
    btn.style.transform = '';
  });
});
