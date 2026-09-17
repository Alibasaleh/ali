document.addEventListener('DOMContentLoaded',()=>{
  const menu=document.querySelector('#menu'),nav=document.querySelector('#nav'),links=[...document.querySelectorAll('nav a')];
  menu?.addEventListener('click',()=>nav.classList.toggle('open'));
  links.forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  const sections=[...document.querySelectorAll('main section[id]')];
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-35% 0px -55%'});
  sections.forEach(s=>sio.observe(s));
  const year=document.querySelector('#year'); if(year) year.textContent=new Date().getFullYear();

  // Custom cursor stays active independently of the site's animation preference.
  if(matchMedia('(pointer:fine)').matches){
    const dot=document.querySelector('.cursor-dot');
    if(dot){
      let x=innerWidth/2,y=innerHeight/2,raf=0;
      const paint=()=>{dot.style.left=x+'px';dot.style.top=y+'px';raf=0};
      addEventListener('pointermove',e=>{
        x=e.clientX;y=e.clientY;dot.classList.add('cursor-ready');
        if(!raf) raf=requestAnimationFrame(paint);
      },{passive:true});
      const interactive='a,button,.skill,.project';
      document.querySelectorAll(interactive).forEach(el=>{
        el.addEventListener('mouseenter',()=>{dot.style.width='38px';dot.style.height='38px';dot.style.background='rgba(201,77,55,.18)'});
        el.addEventListener('mouseleave',()=>{dot.style.width='16px';dot.style.height='16px';dot.style.background='transparent'});
      });
    }
  }

  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduced){
    const art=document.querySelector('.hero-art');
    if(art) addEventListener('pointermove',e=>{
      if(document.body.classList.contains('motion-off')) return;
      const x=(e.clientX/innerWidth-.5)*8,y=(e.clientY/innerHeight-.5)*8;
      art.style.transform=`rotate(2deg) translate(${x}px,${y}px)`;
    },{passive:true});
  }
});


// Local preferences: no account or backend required.
document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body;
  const mode=document.querySelector('#modeSwitch');
  const motion=document.querySelector('#motionSwitch');
  const MODE_KEY='aliPortfolio.theme';
  const MOTION_KEY='aliPortfolio.motion';

  const applyMode=(value)=>{
    const terminal=value==='terminal';
    body.classList.toggle('terminal-mode',terminal);
    mode?.setAttribute('aria-pressed',String(terminal));
    mode?.setAttribute('aria-label',terminal?'Switch to original mode':'Switch to terminal mode');
    const label=mode?.querySelector('span'); if(label) label.textContent=terminal?'ORIGINAL':'TERMINAL';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',terminal?'#080b08':'#e9e4d6');
  };
  const applyMotion=(value)=>{
    const off=value==='off';
    body.classList.toggle('motion-off',off);
    motion?.setAttribute('aria-pressed',String(off));
    motion?.setAttribute('aria-label',off?'Enable animations':'Disable animations');
    const icon=motion?.querySelector('i'); if(icon) icon.className=off?'fa-solid fa-pause':'fa-solid fa-wave-square';
  };

  applyMode(localStorage.getItem(MODE_KEY)||'original');
  applyMotion(localStorage.getItem(MOTION_KEY)||'on');
  mode?.addEventListener('click',()=>{const next=body.classList.contains('terminal-mode')?'original':'terminal';localStorage.setItem(MODE_KEY,next);applyMode(next)});
  motion?.addEventListener('click',()=>{const next=body.classList.contains('motion-off')?'on':'off';localStorage.setItem(MOTION_KEY,next);applyMotion(next)});
});
