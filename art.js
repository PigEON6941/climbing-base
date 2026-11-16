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
    return `<path d="${plate}" transform="translate(0 6)" fill="#252c26"/>
      <path d="${plate}" fill="#465546"/><circle r="${radius*.75}" fill="none"/>
      <g fill="#283029">${drills}</g><circle r="${hub}" fill="#778875"/><circle r="${hub*.52}" fill="#303830"/>
      <path d="M${-radius*.70} -1h7m${radius*1.05} 0h7" opacity=".55"/>`;
  }

  function mechanism() {
    return frame("0 0 290 202", `
      <g fill="none" stroke="#a3b29d" opacity=".42" stroke-width=".8">
        <path d="M14 166 277 67M41 183l177-67M72 20v162m83-164v155m86-140v127" stroke-dasharray="6 5"/>
        <path d="M32 140v15h14m147-124V17h15m42 135h18v-14"/>
        <circle cx="105" cy="115" r="66" stroke-dasharray="2 9"/><path d="M198 52h42l12-15h23"/>
      </g>
      <g stroke="#c5d3be" stroke-width="1.65" stroke-linejoin="round">
        <g transform="translate(212 72) rotate(-19)"><g class="gear-small">${gear(13,43,12,5)}</g></g>
        <g transform="translate(107 124) rotate(-19)"><g class="gear-large">${gear(17,58,15,6)}</g></g>
      </g>
      <g fill="none" stroke="#c4c6aa" stroke-width="2"><path d="M105 124h8m-4-4v8M244 29h12l8 5"/>
      <path d="M42 123a68 68 0 0 1 26-51m-5 1 6-2-1 6"/></g>`, "card-art gear-art");
  }

  function gamepad() {
    return frame("0 0 290 202", `
      <g fill="none" stroke="#53624e" stroke-width="1" opacity=".38" stroke-dasharray="4 6">
      <path d="M5 163h49v-29h119v36h56l28-28h31M151 29h103v75h29"/></g>
      <g class="sprite-sparks" fill="#e7ecde"><path d="M248 38h4v5h5v4h-5v5h-4v-5h-5v-4h5zM64 140h4v4h4v3h-4v5h-3v-5h-4v-3h3z"/><path d="M214 168h4v4h-4zM45 83h4v4h-4z"/></g>
      <g transform="rotate(-11 158 107)" stroke-linejoin="miter">
        <path d="M145 65V41h10V27h29V15h-8" fill="none" stroke="#3e4a3a" stroke-width="4"/>
        <path d="M74 77h10V65h18v-6h101v6h16v12h10v18h7v42h-7v11h-18v-7h-10v-11h-17v-6h-61v6h-15v12h-10v6H80v-8H69v-13h-4V97h4V82h5z" fill="#84937b" stroke="#384535" stroke-width="4" transform="translate(3 7)"/>
        <path d="M74 77h10V65h18v-6h101v6h16v12h10v18h7v42h-7v11h-18v-7h-10v-11h-17v-6h-61v6h-15v12h-10v6H80v-8H69v-13h-4V97h4V82h5z" fill="#c3d2b7" stroke="#384535" stroke-width="4"/>
        <path d="M77 98V82h11V72h17v-6h93m21 72h9v-14" stroke="#e3eadb" stroke-width="4" fill="none"/>
        <path d="M95 80h11v10h11v11h-11v10H95v-10H84V90h11z" fill="#404d3c"/>
        <path d="M91 93h10v-9m-9 9v3" fill="none" stroke="#839179" stroke-width="2"/>
        <g fill="#91a586" stroke="#455541" stroke-width="3"><path d="M185 90h12v12h-12zM204 78h12v12h-12z"/></g>
        <path d="M131 104h13v4h-13zm19 0h13v4h-13z" fill="#7a886f"/>
      </g><g class="pixel-ball" fill="#e8eddd"><path d="M35 41h9v9h-9z" stroke="#53674e" stroke-width="2"/></g>`, "card-art pad-art");
  }

  function video() {
    return frame("0 0 350 160", `<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M46 32h256v95H46zM46 42h256M46 116h256" stroke-dasharray="3 2"/><path d="M132 42v74m84-74v74"/><g stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m70 58 12 18 13 4 13-23m-12 26-8 13-13-2-9 12m21-11 15 5 6 12m50-59 5 16 16 7 15-28m-15 31-9 14-17 2-6 10m26-10 13 8 5 11m46-67 9 19 17 5 15-30m-15 34-7 16-16 1-6 13m23-12 14 9 5 10"/></g><g fill="#b8caaa"><circle cx="96" cy="67" r="5"/><circle cx="178" cy="62" r="5"/><circle cx="263" cy="58" r="5"/></g></g>`, "project-art");
  }

  window.illustrations = {mechanism, gamepad, video};
})();
