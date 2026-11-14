(() => {
  const story = document.querySelector(".story");
  const cover = document.querySelector(".cover");
  const about = document.querySelector("#about");
  const start = document.querySelector(".cover-target");
  const end = document.querySelector(".about-target");
  const title = document.querySelector(".moving-title");
  const bio = document.querySelector(".bio-lines");
  const bird = document.querySelector(".bird-figure");
  const header = document.querySelector("header");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = n => Math.max(0,Math.min(1,n));
  let geometry, pending = false;

  function measure() {
    const a = start.getBoundingClientRect(), b = end.getBoundingClientRect();
    const coverRect = cover.getBoundingClientRect(), aboutRect = about.getBoundingClientRect();
    geometry = {
      origin: coverRect.top + scrollY - header.offsetHeight,
      distance: aboutRect.top - coverRect.top,
      left: a.left, top: a.top - coverRect.top,
      dx: b.left - a.left, dy: (b.top - aboutRect.top) - (a.top - coverRect.top),
      scale: b.width / a.width, header: header.offsetHeight
    };
    update();
  }
  function update() {
    pending = false;
    if (!geometry) return;
    const g = geometry;
    const progress = clamp((scrollY-g.origin)/g.distance);
    const ease = progress * progress * (3 - 2 * progress);
    // Once the title lands, it scrolls away with the rest of the second screen.
    const exit = Math.min(0,about.getBoundingClientRect().top - g.header);
    const x = g.left + g.dx * ease, y = g.top + g.dy * ease + exit;
    title.style.transform = `translate3d(${x}px,${y}px,0) scale(${1 + (g.scale-1)*ease})`;
    const reveal = reduced.matches ? 1 : clamp((progress - .25) / .62);
    bio.style.opacity = bird.style.opacity = reveal;
    title.style.opacity = String(clamp((about.getBoundingClientRect().bottom-g.header)/64));
    story.classList.add("is-ready");
  }
  function requestUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  new ResizeObserver(measure).observe(story);
  window.addEventListener("resize",measure);
  window.addEventListener("scroll",requestUpdate,{passive:true});
  reduced.addEventListener("change",update);
  document.fonts.ready.then(measure);
  window.addEventListener("pageshow",measure);
  measure();
})();
