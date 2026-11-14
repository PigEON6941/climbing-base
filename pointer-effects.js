// Decorative only: the native cursor, link hit areas and touch gestures stay in charge.
(() => {
  const motion = matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)");
  const canvas = document.createElement("canvas");
  canvas.className = "cursor-trail";
  canvas.setAttribute("aria-hidden","true");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const halo = document.createElement("div");
  halo.className = "cursor-halo";
  halo.setAttribute("aria-hidden","true");
  document.body.append(halo,canvas);

  const particles = [], trail = [];
  let frame=0, lastFrame=0, ratio=1, last=null, card=null;
  const lifetime = 580;

  function resize() {
    ratio=Math.min(2,window.devicePixelRatio || 1);
    canvas.width=Math.round(innerWidth*ratio);
    canvas.height=Math.round(innerHeight*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  function clear() {
    cancelAnimationFrame(frame);
    frame=lastFrame=0;
    last=null;
    trail.length=particles.length=0;
    halo.classList.remove("visible","on-link");
    if (card) card.classList.remove("pointer-lit");
    card=null;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  function spark(x,y,burst,light) {
    const angle=Math.random()*Math.PI*2;
    const speed=(burst ? 38+Math.random()*94 : 10+Math.random()*24);
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-12,
      life:0, duration:lifetime+Math.random()*240, size:1.2+Math.random()*2.1,
      rotation:angle,star:Math.random()<.24,light});
    if (particles.length>64) particles.shift();
  }
  function draw(now) {
    frame=0;
    const dt=Math.min(now-(lastFrame || now-16),48);
    lastFrame=now;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    while (trail.length && now-trail[0].time>210) trail.shift();
    ctx.lineCap="round";
    for (let i=1;i<trail.length;i++) {
      const a=trail[i-1], b=trail[i], fade=1-(now-a.time)/210;
      ctx.strokeStyle=b.light ? "rgb(207,242,155)" : "rgb(92,148,77)";
      ctx.globalAlpha=.40*fade;
      ctx.lineWidth=.6+1.8*fade;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i];
      p.life+=dt;
      if (p.life>=p.duration) {particles.splice(i,1);continue;}
      p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;
      p.vy+=17*dt/1000;
      const fade=1-p.life/p.duration, r=p.size*(.5+.5*fade);
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rotation+p.life*.001);
      ctx.globalAlpha=fade*.85;
      ctx.fillStyle=p.light ? "#d7f5a8" : (p.star ? "#658e44" : "#8aaf65");
      ctx.beginPath();
      if (p.star) {
        ctx.moveTo(0,-r*1.65);ctx.quadraticCurveTo(r*.2,-r*.2,r*1.65,0);
        ctx.quadraticCurveTo(r*.2,r*.2,0,r*1.65);ctx.quadraticCurveTo(-r*.2,r*.2,-r*1.65,0);
        ctx.quadraticCurveTo(-r*.2,-r*.2,0,-r*1.65);
      } else ctx.ellipse(0,0,r*.58,r,0,0,Math.PI*2);
      ctx.fill();ctx.restore();
    }
    ctx.globalAlpha=1;
    if (trail.length || particles.length) frame=requestAnimationFrame(draw);
    else lastFrame=0;
  }
  function schedule() { if (!frame) frame=requestAnimationFrame(draw); }
  function move(event) {
    if (!motion.matches || event.pointerType==="touch" || !event.isPrimary || document.hidden) {
      if (last) clear();
      return;
    }
    const x=event.clientX, y=event.clientY, now=performance.now();
    const hit=event.target instanceof Element ? event.target : null;
    const nextCard=hit?.closest(".entrance,.project");
    if (card!==nextCard) {
      if (card) card.classList.remove("pointer-lit");
      card=nextCard;
    }
    if (card) {
      const rect=card.getBoundingClientRect();
      card.style.setProperty("--pointer-x",(x-rect.left)+"px");
      card.style.setProperty("--pointer-y",(y-rect.top)+"px");
      card.classList.add("pointer-lit");
    }
    const light=Boolean(hit?.closest(".entrance.tools,.launch"));
    halo.style.transform=`translate3d(${x}px,${y}px,0)`;
    halo.classList.add("visible");
    halo.classList.toggle("on-link",Boolean(hit?.closest("a,button")));
    halo.classList.toggle("on-dark",light);
    if (last && now-last.time<180) {
      const dx=x-last.x, dy=y-last.y, distance=Math.hypot(dx,dy);
      const count=Math.min(6,Math.floor(distance/12)+(distance>2 && Math.random()<.3?1:0));
      for(let i=0;i<count;i++) {
        const fraction=(i+Math.random())/count;
        spark(last.x+dx*fraction,last.y+dy*fraction,false,light);
      }
    } else trail.length=0;
    last={x,y,time:now,light};
    trail.push(last);
    if(trail.length>24) trail.shift();
    schedule();
  }
  window.addEventListener("pointermove",move,{passive:true});
  window.addEventListener("pointerdown",event=>{
    if (!motion.matches || event.pointerType==="touch" || !event.isPrimary || event.button!==0) {clear();return;}
    const light=Boolean(event.target.closest?.(".entrance.tools,.launch"));
    for(let i=0;i<12;i++) spark(event.clientX,event.clientY,true,light);
    schedule();
  },{passive:true});
  function resetSize() {clear();if(motion.matches)resize();}
  window.addEventListener("resize",resetSize);
  window.addEventListener("scroll",clear,{passive:true});
  window.addEventListener("blur",clear);
  window.addEventListener("pagehide",clear);
  document.documentElement.addEventListener("pointerleave",clear);
  document.addEventListener("keydown",clear);
  document.addEventListener("visibilitychange",clear);
  motion.addEventListener("change",resetSize);
  resetSize();
})();
