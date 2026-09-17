
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const nav = document.querySelector(".nav");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  const progress = document.getElementById("scrollProgress");
  const clock = document.getElementById("clock");

  /* Theme */
  try {
    if (localStorage.getItem("vistaTheme") === "dark") body.classList.add("dark");
  } catch (_) {}

  function updateThemeButton(){
    if(!toggle) return;
    const dark = body.classList.contains("dark");
    toggle.innerHTML = dark
      ? '<i class="fa-solid fa-sun"></i><span>Light Vista</span>'
      : '<i class="fa-solid fa-moon"></i><span>Dark Vista</span>';
  }
  updateThemeButton();

  toggle?.addEventListener("click", () => {
    body.classList.toggle("dark");
    try { localStorage.setItem("vistaTheme", body.classList.contains("dark") ? "dark" : "light"); } catch (_) {}
    updateThemeButton();
  });

  /* Mobile navigation */
  mobileMenu?.addEventListener("click", () => {
    nav.classList.toggle("open");
    mobileMenu.innerHTML = nav.classList.contains("open")
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    if(mobileMenu) mobileMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* Reveal sections */
  const revealItems = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("show"));
  }

  /* Active navigation */
  const sections = document.querySelectorAll("main section[id]");
  if("IntersectionObserver" in window){
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        navLinks.forEach(link =>
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
        );
      });
    }, {rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(section => sectionObserver.observe(section));
  }

  /* Scroll progress */
  function updateProgress(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if(progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }
  window.addEventListener("scroll", updateProgress, {passive:true});
  updateProgress();

  /* Live clock */
  function updateClock(){
    if(clock){
      clock.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* Mouse spotlight */
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  window.addEventListener("pointermove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
  }, {passive:true});

  /* 3D card tilt */
  if(window.matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".tilt-card").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(800px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform = "");
    });
  }

  /* Profile photo parallax */
  const frame = document.querySelector(".photo-frame");
  if(frame && window.matchMedia("(pointer:fine)").matches){
    frame.addEventListener("pointermove", e => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      frame.style.transform = `perspective(900px) rotateX(${-y*3}deg) rotateY(${x*5}deg) translateY(-5px)`;
    });
    frame.addEventListener("pointerleave", () => frame.style.transform = "");
  }

  /* Floating cyber particles / network dots */
  const canvas = document.getElementById("particleCanvas");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(canvas && !reduce){
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2);

    function resize(){
      w = innerWidth; h = innerHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+"px"; canvas.style.height = h+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(70, Math.max(30, Math.floor(w/18)));
      particles = Array.from({length:count}, () => ({
        x:Math.random()*w, y:Math.random()*h,
        vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28,
        r:Math.random()*1.5+.5
      }));
    }
    resize();
    addEventListener("resize", resize);

    function animate(){
      ctx.clearRect(0,0,w,h);
      const dark = body.classList.contains("dark");
      const dot = dark ? "rgba(120,210,245,.42)" : "rgba(255,255,255,.48)";
      const line = dark ? "rgba(100,190,225,.10)" : "rgba(255,255,255,.16)";

      for(const p of particles){
        p.x += p.vx; p.y += p.vy;
        if(p.x < -10 || p.x > w+10) p.vx *= -1;
        if(p.y < -10 || p.y > h+10) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = dot; ctx.fill();
      }

      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
          if(dist<115){
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
            ctx.strokeStyle=line;ctx.lineWidth=.7;ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
});
