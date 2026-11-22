(() => {
  const { profile, projects, empty } = window.workbench;
  const art = window.illustrations;
  const page = document.body.dataset.page;
  const prefix = page === "home" ? "./" : "../";
  const path = key => key === "home" ? prefix + "index.html" : prefix + key + "/index.html";
  const categories = {
    tools: { label: "工具", english: "Tools", description: "把遇到的问题，做成顺手的工具。", image: art.mechanism },
    games: { label: "小游戏", english: "Arcade", description: "给想试试的新玩法留个位置。", image: art.gamepad }
  };
  const escape = value => String(value).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 18 6M7 6h11v11"/></svg>';
  const pin = '<svg viewBox="0 0 18 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M15 8c0 4-6 10-6 10S3 12 3 8a6 6 0 1 1 12 0Z"/><circle cx="9" cy="8" r="2"/></svg>';
  const folder = '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2 6h9l3 3h11v12H2z"/><path d="M3 6V3h9l3 3h9v3"/></svg>';
  const cross = '<i class="register" aria-hidden="true"></i>';
  const name = escape(profile.name);
  const siteTitle = profile.headline.join("");
  document.title = page === "home" ? siteTitle : categories[page].label + " · " + siteTitle;
  function header() {
    const nav = [["home", "首页"], ["tools", "工具"], ["games", "小游戏"]].map(([key, label]) =>
      `<a href="${path(key)}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`).join("");
    return `<header><div class="wrap head-row">
      <a class="brand" href="${path("home")}" aria-label="${escape(siteTitle)}首页"><img src="${prefix}assets/pigeon.svg" width="37" height="37" alt="">
      <span>${name}</span></a><nav aria-label="主导航">${nav}</nav>
    </div></header>`;
  }
  function footer() {
    return `<footer class="wrap"><span class="signature"><img src="${prefix}assets/pigeon.svg" width="18" height="18" alt="">${name} <span>/</span> ${escape(siteTitle)}</span><span class="location">${pin} ${escape(profile.location)}</span></footer>`;
  }
  function entrance(key) {
    const item = categories[key];
    return `<a class="entrance ${key}" href="${path(key)}">
      <div class="entrance-copy"><p class="code-label" lang="en">${item.english}<span aria-hidden="true"></span></p>
      <h3>${item.label}</h3><p class="entrance-desc">${item.description}</p></div>
      ${item.image()}<span class="entry-arrow" aria-hidden="true">${arrow}</span>
    </a>`;
  }
  function home() {
    const headline = profile.headline.map(line => `<span>${escape(line)}</span>`).join("");
    const down = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>';
    return `<main id="content" tabindex="-1">
      <div class="story" id="cover">
        <div class="title-layer" aria-hidden="true"><div class="moving-title headline">${headline}</div></div>
        <section class="screen cover" aria-labelledby="cover-title">
          <div class="cover-map" aria-hidden="true"><i></i><i></i></div>
          <div class="map-edition wrap" aria-hidden="true"><span>PIGEON <b>/</b> CLIMBING BASE</span><span>01 <b>/</b> 03</span></div>
          <h1 id="cover-title" class="headline cover-target">${headline}</h1>
          <a class="next-screen" href="#about">认识我 ${down}</a>
        </section>
        <section class="screen about wrap" id="about" aria-label="关于我" tabindex="-1">
          <div class="identity">
            <div class="headline about-target" aria-hidden="true">${headline}</div>
            <div class="bio-lines">${profile.intro.map(line => `<p>${escape(line)}</p>`).join("")}</div>
          </div>
          <figure class="bird-figure">
            <div class="bird-stage">
              <canvas id="pigeon-model" tabindex="0" role="img" aria-label="灰鸽会转头看向光标。聚焦后可用左右方向键旋转，也可拖动查看。" aria-keyshortcuts="ArrowLeft ArrowRight"></canvas>
              <img class="bird-fallback" src="${prefix}assets/pigeon.svg" alt="鸽子">
            </div>
          </figure>
          <a class="next-screen" href="#works">作品目录 ${down}</a>
        </section>
      </div>
      <section class="screen catalog" id="works" tabindex="-1" aria-labelledby="directory-title">
        <div class="wrap catalog-inner">
          <div class="section-head">${folder}<h2 id="directory-title">作品目录</h2><span class="line-through"></span>${cross}</div>
          <div class="entrances">${entrance("tools")}${entrance("games")}</div>
        </div>
      </section>
    </main>`;
  }
  function liveUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function projectCard(project) {
    const url = liveUrl(project.url);
    const illustration = project.art === "route"
      ? `<span class="plate-tag" aria-hidden="true">CRUX / JUG</span><img src="${prefix}assets/crux-jug.webp" width="820" height="546" alt="" decoding="async">`
      : project.art === "notebook" ? `<span class="plate-tag" aria-hidden="true">BETA / NOTEBOOK</span>${art.notebook()}`
      : project.art === "video" ? `<span class="plate-tag" aria-hidden="true">BETA / MOTION</span>${art.video()}` : categories[page].image();
    const action = url ? `<a class="launch" href="${escape(url)}" aria-label="体验 ${escape(project.name)}">打开体验 ${external}</a>` :
      `<span class="project-status"><i></i>${escape(project.status || "尚未开放")}</span>`;
    return `<article class="project"><div class="project-figure ${project.art === "route" ? "specimen-plate" : project.art === "video" ? "muted-figure" : ""}">${illustration}</div>
      <div class="project-info"><h2>${escape(project.name)}</h2><p>${escape(project.description)}</p>${action}</div></article>`;
  }
  function listing() {
    const section = categories[page];
    const entries = projects[page];
    return `<main id="content" tabindex="-1" class="wrap listing ${page}-list">
      <a class="back" href="${path("home")}#works">${arrow} 返回作品目录</a>
      <div class="list-heading"><div><span class="list-code" lang="en">${section.english}</span><h1>${section.label}<i class="name-period" aria-hidden="true"></i></h1></div>${cross}</div>
      ${entries.length ? `<div class="projects">${entries.map(projectCard).join("")}</div>` :
        `<div class="empty ${page}">${section.image()}<p>${escape(empty[page])}</p></div>`}
    </main>`;
  }
  document.querySelector("#site").innerHTML = header() + (page === "home" ? home() : listing()) + footer();
})();
