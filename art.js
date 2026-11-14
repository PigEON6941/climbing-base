// Illustrations for the category entrances and individual projects.
(() => {
  const frame = (viewBox, content, className = "") =>
    `<svg class="${className}" viewBox="${viewBox}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;

  function gearPath(teeth, inner, outer) {
    const points = [];
    for (let tooth = 0; tooth < teeth; tooth++) {
      for (const [offset, radius] of [[0, inner], [.13, inner], [.23, outer], [.55, outer], [.67, inner]]) {
        const angle = 2 * Math.PI * (tooth + offset) / teeth;
        points.push(`${(Math.cos(angle) * radius).toFixed(2)},${(Math.sin(angle) * radius).toFixed(2)}`);
      }
    }
    return "M" + points.join("L") + "Z";
  }

  function gear(teeth, radius, hub, holes) {
    const plate = gearPath(teeth, radius * .86, radius);
    const drills = Array.from({length: holes}, (_, i) => {
      const a = i * 2 * Math.PI / holes;
      return `<circle cx="${Math.cos(a)*radius*.57}" cy="${Math.sin(a)*radius*.57}" r="${radius*.115}"/>`;
    }).join("");
    return `<path d="${plate}" transform="translate(0 6)" fill="#183c2b"/>
      <path d="${plate}" fill="#315d45"/><circle r="${radius*.75}" fill="none"/>
      <g fill="#193d2b">${drills}</g><circle r="${hub}" fill="#62846a"/><circle r="${hub*.52}" fill="#19382a"/>
      <path d="M${-radius*.70} -1h7m${radius*1.05} 0h7" opacity=".55"/>`;
  }

  function mechanism() {
    return frame("0 0 290 202", `
      <g fill="none" stroke="#b6d6aa" opacity=".42" stroke-width=".8">
        <path d="M14 166 277 67M41 183l177-67M72 20v162m83-164v155m86-140v127" stroke-dasharray="6 5"/>
        <path d="M32 140v15h14m147-124V17h15m42 135h18v-14"/>
        <circle cx="105" cy="115" r="66" stroke-dasharray="2 9"/><path d="M198 52h42l12-15h23"/>
      </g>
      <g stroke="#d1e5c0" stroke-width="1.65" stroke-linejoin="round">
        <g transform="translate(212 72) rotate(-19)"><g class="gear-small">${gear(13,43,12,5)}</g></g>
        <g transform="translate(107 124) rotate(-19)"><g class="gear-large">${gear(17,58,15,6)}</g></g>
      </g>
      <g fill="none" stroke="#c2e08f" stroke-width="2"><path d="M105 124h8m-4-4v8M244 29h12l8 5"/>
      <path d="M42 123a68 68 0 0 1 26-51m-5 1 6-2-1 6"/></g>`, "card-art gear-art");
  }

  function gamepad() {
    return frame("0 0 290 202", `
      <g fill="none" stroke="#46663d" stroke-width="1" opacity=".38" stroke-dasharray="4 6">
      <path d="M5 163h49v-29h119v36h56l28-28h31M151 29h103v75h29"/></g>
      <g class="sprite-sparks" fill="#f6ffe4"><path d="M248 38h4v5h5v4h-5v5h-4v-5h-5v-4h5zM64 140h4v4h4v3h-4v5h-3v-5h-4v-3h3z"/><path d="M214 168h4v4h-4zM45 83h4v4h-4z"/></g>
      <g transform="rotate(-11 158 107)" stroke-linejoin="miter">
        <path d="M145 65V41h10V27h29V15h-8" fill="none" stroke="#344e31" stroke-width="4"/>
        <path d="M74 77h10V65h18v-6h101v6h16v12h10v18h7v42h-7v11h-18v-7h-10v-11h-17v-6h-61v6h-15v12h-10v6H80v-8H69v-13h-4V97h4V82h5z" fill="#6f905a" stroke="#2e4c32" stroke-width="4" transform="translate(3 7)"/>
        <path d="M74 77h10V65h18v-6h101v6h16v12h10v18h7v42h-7v11h-18v-7h-10v-11h-17v-6h-61v6h-15v12h-10v6H80v-8H69v-13h-4V97h4V82h5z" fill="#cde5a9" stroke="#2e4c32" stroke-width="4"/>
        <path d="M77 98V82h11V72h17v-6h93m21 72h9v-14" stroke="#f0ffd7" stroke-width="4" fill="none"/>
        <path d="M95 80h11v10h11v11h-11v10H95v-10H84V90h11z" fill="#304c30"/>
        <path d="M91 93h10v-9m-9 9v3" fill="none" stroke="#71925b" stroke-width="2"/>
        <g fill="#648d50" stroke="#345335" stroke-width="3"><path d="M185 90h12v12h-12zM204 78h12v12h-12z"/></g>
        <path d="M131 104h13v4h-13zm19 0h13v4h-13z" fill="#61794e"/>
      </g><g class="pixel-ball" fill="#f7ffdb"><path d="M35 41h9v9h-9z" stroke="#3e683c" stroke-width="2"/></g>`, "card-art pad-art");
  }

  function route() {
    return frame("0 0 350 160", `<g fill="none" stroke="#a8b8a0" stroke-width="1"><path d="m8 152 52-67 69-75 52 41 83-38 73 116M60 85l75 32 46-66 24 93m-76-134 6 107m46-66 74 29 9-67m-9 67 82 49" stroke-dasharray="4 5"/></g><path d="M74 132Q94 94 131 102t54-41q17-24 51-26" fill="none" stroke="#648950" stroke-dasharray="5 4" stroke-width="2"/><g stroke="#324b36" stroke-width="2" stroke-linejoin="round"><path d="m54 133 15-12 23 1 1 9-19 10-19-2zM111 103l9-13 21 1 4 9-11 10-18 1zM160 76l11-19 16-4 13 9-9 15-18 4zM220 32l12-9 24 2-1 10-25 10-11-4z" fill="#9cbe7e"/><path d="m62 135 11-6 15-2m30-23 8-6 10 2m32-25 7-11 10-2m43-26 8-5 12 1" fill="none"/><g fill="#3e5740"><circle cx="76" cy="133" r="1.6"/><circle cx="129" cy="103" r="1.6"/><circle cx="181" cy="70" r="1.6"/><circle cx="238" cy="35" r="1.6"/></g></g>`, "project-art");
  }

  function video() {
    return frame("0 0 350 160", `<g fill="none" stroke="#5d7562" stroke-width="1.5"><path d="M46 32h256v95H46zM46 42h256M46 116h256" stroke-dasharray="3 2"/><path d="M132 42v74m84-74v74"/><g stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m70 58 12 18 13 4 13-23m-12 26-8 13-13-2-9 12m21-11 15 5 6 12m50-59 5 16 16 7 15-28m-15 31-9 14-17 2-6 10m26-10 13 8 5 11m46-67 9 19 17 5 15-30m-15 34-7 16-16 1-6 13m23-12 14 9 5 10"/></g><g fill="#94b278"><circle cx="96" cy="67" r="5"/><circle cx="178" cy="62" r="5"/><circle cx="263" cy="58" r="5"/></g></g>`, "project-art");
  }

  window.illustrations = {mechanism, gamepad, route, video};
})();
