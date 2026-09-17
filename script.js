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


// Animation preference: independent from the main theme switch.
document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body;
  const motion=document.querySelector('#motionSwitch');
  const KEY='aliPortfolio.motion';
  const apply=(value)=>{
    const off=value==='off';
    body.classList.toggle('motion-off',off);
    motion?.setAttribute('aria-pressed',String(off));
    motion?.setAttribute('aria-label',off?'Enable animations':'Disable animations');
    const icon=motion?.querySelector('i'); if(icon) icon.className=off?'fa-solid fa-pause':'fa-solid fa-wave-square';
  };
  let saved='on'; try{saved=localStorage.getItem(KEY)||'on'}catch(_){}
  apply(saved);
  motion?.addEventListener('click',()=>{const next=body.classList.contains('motion-off')?'on':'off';try{localStorage.setItem(KEY,next)}catch(_){}apply(next)});
});

// Functional mini-apps inside LAB / EXPERIMENTS.
document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.querySelector('#labModal'),stage=document.querySelector('#labStage'),title=document.querySelector('#labWindowTitle');
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');stage.innerHTML='';document.body.style.overflow=''};
  document.querySelector('#labClose')?.addEventListener('click',close);
  modal?.addEventListener('click',e=>{if(e.target===modal)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))close()});
  const open=(name)=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';({sudoku:renderSudoku,forensics:renderForensics,security:renderSecurity,ui:renderUI}[name])?.();};
  document.querySelectorAll('.open-lab').forEach(b=>b.addEventListener('click',()=>open(b.dataset.lab)));

  function renderSudoku(){
    title.textContent='EXP_001 / SUDOKU GENERATOR';
    const solution=[5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
    const holes=new Set([2,3,5,7,10,12,16,17,18,21,22,25,28,30,33,34,37,38,40,42,43,46,47,50,52,55,57,58,61,62,64,66,69,70,73,74,76,78]);
    stage.innerHTML=`<div class="lab-app-head"><h3>Playable Sudoku.</h3><p>Fill the empty cells. This runs entirely in your browser.</p></div><div class="sudoku-wrap"><div class="sudoku-grid">${solution.map((n,i)=>holes.has(i)?`<input class="sudoku-cell" inputmode="numeric" maxlength="1" data-i="${i}" aria-label="Sudoku cell">`:`<input class="sudoku-cell given" value="${n}" readonly aria-label="Given ${n}">`).join('')}</div><div class="sudoku-tools"><button class="lab-action" id="checkSudoku">CHECK ANSWERS</button><button class="lab-action" id="resetSudoku">RESET</button><button class="lab-action" id="solveSudoku">SHOW SOLUTION</button><div class="lab-message" id="sudokuMsg">// 38 cells to solve</div></div></div>`;
    const inputs=[...stage.querySelectorAll('.sudoku-cell:not(.given)')];
    inputs.forEach(i=>i.addEventListener('input',()=>{i.value=i.value.replace(/[^1-9]/g,'').slice(-1);i.classList.remove('bad')}));
    stage.querySelector('#checkSudoku').onclick=()=>{let wrong=0,empty=0;inputs.forEach(i=>{const ok=+i.value===solution[+i.dataset.i];i.classList.toggle('bad',i.value&&!ok);if(!i.value)empty++;else if(!ok)wrong++});stage.querySelector('#sudokuMsg').textContent=wrong?`// ${wrong} incorrect — keep going`:(empty?`// looking good — ${empty} cells left`:'// solved. nice.')};
    stage.querySelector('#resetSudoku').onclick=()=>{inputs.forEach(i=>{i.value='';i.classList.remove('bad')});stage.querySelector('#sudokuMsg').textContent='// reset'};
    stage.querySelector('#solveSudoku').onclick=()=>{inputs.forEach(i=>{i.value=solution[+i.dataset.i];i.classList.remove('bad')});stage.querySelector('#sudokuMsg').textContent='// solution revealed'};
  }

  function renderForensics(){
    title.textContent='EXP_003 / FORENSICS NOTES';
    const items=[['08:42','USB device connected','usb'],['08:46','report.docx opened','doc'],['08:49','Archive created: files.zip','zip'],['08:51','USB device removed','remove']];
    stage.innerHTML=`<div class="lab-app-head"><h3>Mini case file.</h3><p>Put the evidence in the most likely chronological order, then check your timeline.</p></div><div class="evidence-list" id="evidenceList">${[items[2],items[0],items[3],items[1]].map(x=>`<div class="evidence" draggable="true" data-key="${x[2]}"><i class="fa-solid fa-grip-lines"></i><b>${x[1]}</b><time>${x[0]}</time></div>`).join('')}</div><div class="forensics-answer"><button class="lab-action" id="checkEvidence">CHECK TIMELINE</button><button class="lab-action" id="shuffleEvidence">SHUFFLE</button><span class="lab-message" id="evidenceMsg">// drag the rows into order</span></div>`;
    const list=stage.querySelector('#evidenceList'); let drag;
    const bind=()=>[...list.children].forEach(el=>{el.ondragstart=()=>{drag=el;el.classList.add('selected')};el.ondragend=()=>el.classList.remove('selected');el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();if(drag!==el){const r=el.getBoundingClientRect();list.insertBefore(drag,e.clientY<r.top+r.height/2?el:el.nextSibling)}}}); bind();
    stage.querySelector('#checkEvidence').onclick=()=>{const order=[...list.children].map(x=>x.dataset.key).join(',');stage.querySelector('#evidenceMsg').textContent=order==='usb,doc,zip,remove'?'// timeline consistent ✓':'// sequence is off — inspect the timestamps'};
    stage.querySelector('#shuffleEvidence').onclick=()=>{[...list.children].sort(()=>Math.random()-.5).forEach(x=>list.append(x));stage.querySelector('#evidenceMsg').textContent='// shuffled'};
  }

  function renderSecurity(){
    title.textContent='EXP_004 / SECURITY PLAYGROUND';
    stage.innerHTML=`<div class="lab-app-head"><h3>Escape the input.</h3><p>A harmless front-end demo showing the difference between displaying raw user input and escaping special HTML characters. Nothing is executed.</p></div><div class="security-demo"><div class="demo-panel"><b>INPUT</b><textarea id="secInput" spellcheck="false">&lt;script&gt;alert('hello')&lt;/script&gt;</textarea><button class="lab-action" id="secRun">COMPARE</button></div><div class="demo-panel"><b>SAFE OUTPUT</b><div class="demo-output" id="safeOut"></div><p class="lab-message">// rendered with textContent</p></div></div>`;
    const input=stage.querySelector('#secInput'),out=stage.querySelector('#safeOut'); const run=()=>{out.textContent=input.value}; run(); stage.querySelector('#secRun').onclick=run;
  }

  function renderUI(){
    title.textContent='EXP_005 / UI GRAVEYARD';
    stage.innerHTML=`<div class="lab-app-head"><h3>Button graveyard.</h3><p>Old UI ideas don't have to die. Change the specimen and poke at it.</p></div><div class="ui-controls"><button class="lab-action" data-look="square">SQUARE</button><button class="lab-action" data-look="round">ROUND</button><button class="lab-action" data-look="brutal">WEIRD</button><button class="lab-action" id="randomText">CHANGE TEXT</button></div><div class="ui-playground"><button class="grave-button" id="graveButton">DO SOMETHING</button></div><p class="lab-message" id="uiMsg">// specimen 01 — hover it</p>`;
    const b=stage.querySelector('#graveButton'),msg=stage.querySelector('#uiMsg');
    stage.querySelectorAll('[data-look]').forEach(x=>x.onclick=()=>{b.className='grave-button '+(x.dataset.look==='square'?'':x.dataset.look);msg.textContent='// style switched: '+x.dataset.look});
    const words=['DO SOMETHING','WHY NOT?','SHIP IT','UNDO THAT','CLICK ME'];let n=0;stage.querySelector('#randomText').onclick=()=>b.textContent=words[++n%words.length];b.onclick=()=>msg.textContent='// clicked at '+new Date().toLocaleTimeString();
  }
});
