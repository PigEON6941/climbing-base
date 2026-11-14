// A perched rock pigeon. The same geometry also works on a plain 2D canvas.
(() => {
  const canvas = document.querySelector("#pigeon-model");
  const gl = canvas.getContext("webgl", {alpha:true,antialias:true,depth:true});
  const ctx = gl ? null : canvas.getContext("2d");
  if (!gl && !ctx) {
    canvas.parentElement.classList.add("failed");
    canvas.tabIndex = -1;
    return;
  }

  const tau = Math.PI * 2;
  const faces = [];
  const vertices = [];
  const neckWeights = [];
  const smoothVertices = [];
  const triangles = [];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rgb = hex => [16, 8, 0].map(shift => (hex >> shift) & 255);
  const mix = (a, b, t) => a.map((v,i) => v + (b[i] - v) * t);
  const length = v => Math.hypot(...v);
  const unit = v => v.map(k => k / (length(v) || 1));
  const sub = (a,b) => a.map((v,i) => v-b[i]);
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

  // Below the shoulders nothing moves; by the jaw the skull, eyes and bill move as one.
  function neckBlend(y) {
    const span=.93-.35, t=clamp((y-.35)/span,0,1);
    return [t*t*(3-2*t),6*t*(1-t)/span];
  }

  // All round surfaces share a regular mesh. Tone follows the surface normal
  // in view space, so the light stays above the bird when the visitor turns it.
  function surface(rows, columns, point, paint) {
    const grid = [];
    for (let i=0; i<=rows; i++) {
      const row = [];
      for (let j=0; j<columns; j++) {
        const u=i/rows, a=tau*j/columns;
        const tangent=sub(point(Math.min(1,u+.0001),a),point(Math.max(0,u-.0001),a));
        const around=sub(point(clamp(u,.0001,.9999),a+.0001),point(clamp(u,.0001,.9999),a-.0001));
        const position=point(u,a);
        row.push(vertices.length);
        vertices.push(position);
        const blend=neckBlend(position[1]);
        if (gl) smoothVertices.push(...position,...unit(cross(tangent,around)),...paint(u,a).map(v=>v/255),...blend);
        else neckWeights.push(blend[0]);
      }
      grid.push(row);
    }
    for (let i=0; i<rows; i++) {
      for (let j=0; j<columns; j++) {
        const next=(j+1)%columns;
        const ids=[grid[i][j],grid[i+1][j],grid[i+1][next],grid[i][next]];
        if (gl) {
          triangles.push(ids[0],ids[1],ids[2],ids[0],ids[2],ids[3]);
        } else {
          faces.push({ids,color:paint((i+.5)/rows,tau*(j+.5)/columns)});
        }
      }
    }
  }

  function ellipsoid(center, radii, color, rows=14, columns=30) {
    surface(rows,columns,(u,a) => {
      const t=(u-.5)*Math.PI, band=Math.cos(t);
      return [center[0]+radii[0]*band*Math.cos(a),center[1]+radii[1]*Math.sin(t),center[2]+radii[2]*band*Math.sin(a)];
    },() => color);
  }

  // Horizontal sections blend the crop, nape and forehead into one silhouette.
  const outline = [
    [-.72, -.06, .015, .015],[-.65,-.10,.46,.34],[-.49,-.14,.76,.54],
    [-.24,-.10,.96,.63],[.02,-.05,1.01,.65],[.24,.02,.92,.59],
    [.45,.19,.76,.50],[.62,.355,.592,.40],[.78,.468,.475,.345],
    [.94,.548,.413,.335],[1.09,.60,.405,.35],[1.23,.59,.36,.31],
    [1.34,.57,.255,.23],[1.41,.55,.12,.105],[1.425,.54,.008,.008]
  ];
  function section(t) {
    const segment=t*(outline.length-1);
    const i=Math.min(Math.floor(segment),outline.length-2), f=segment-i;
    const a=outline[Math.max(i-1,0)], b=outline[i], c=outline[i+1], d=outline[Math.min(i+2,outline.length-1)];
    return b.map((v,k) => .5*((2*v)+(-a[k]+c[k])*f+(2*a[k]-5*v+4*c[k]-d[k])*f*f+(-a[k]+3*v-3*c[k]+d[k])*f*f*f));
  }
  const body = rgb(0xbac3bc), head=rgb(0x879a92), emerald=rgb(0x487767);
  surface(52,66,(u,a) => {
    const [y,x,rx,rz]=section(u);
    return [x+rx*Math.cos(a),y,rz*Math.sin(a)];
  },(u,a) => {
    const [y]=section(u);
    const upper=mix(body,head,clamp((y-.12)/.84,0,1));
    const neck=Math.exp(-Math.pow((y-.68)/.245,2))*(.55+.42*Math.abs(Math.sin(a)));
    return mix(upper,emerald,neck);
  });

  // Closed flight feathers have a pointed rear edge and two dark wing bars.
  const wingBase=rgb(0xa2afa7), primaries=rgb(0x53665e), wingBar=rgb(0x3f514a);
  for (const side of [-1,1]) {
    surface(62,40,(u,a) => {
      const fullness=Math.pow(Math.sin(Math.PI*u),.65)*(.60+.58*u);
      const x=-1.55+2.06*u;
      const axisY=-.43+.57*u;
      const axisZ=.18+.35*Math.sin(Math.PI*u*.77);
      return [x,axisY+.42*fullness*Math.cos(a),side*(axisZ+.215*fullness*Math.sin(a))];
    },(u,a) => {
      const diagonal=u-.085*Math.cos(a);
      const nearBar=Math.min(Math.abs(diagonal-.40), Math.abs(diagonal-.56));
      const band=clamp((.033-nearBar)/.014,0,1);
      const coverts=mix(primaries,wingBase,clamp((u-.19)/.27,0,1));
      return mix(coverts,wingBar,.9*band);
    });
  }

  // The tail is a closed fan; narrow overlapping tips give the back a feathered edge.
  for (let i=-2;i<=2;i++) {
    surface(18,14,(u,a) => {
      const width=.12*Math.pow(Math.sin(Math.PI*u),.27);
      return [-1.98+.045*Math.abs(i)+1.32*u,-.49+.24*u+.032*Math.cos(a)-.014*Math.abs(i),
        i*(.125-.056*u)+width*Math.sin(a)];
    },u => u<.14 ? rgb(0x47594f):rgb(0x718075));
  }

  // A pigeon's bill is short, with a pale cere above the darker tip.
  surface(14,20,(u,a) => {
    const r=Math.pow(1-u,.74);
    return [.90+.41*u,1.033-.078*u+.085*r*Math.cos(a),.137*r*Math.sin(a)];
  },() => rgb(0x505953));
  ellipsoid([.986,1.071,0],[.115,.054,.102],rgb(0xd5d8cd));
  for (const side of [-1,1]) {
    ellipsoid([.746,1.125,side*.300],[.066,.063,.032],rgb(0xc3a26a));
    ellipsoid([.753,1.128,side*.324],[.041,.043,.017],rgb(0x252b27));
    ellipsoid([.765,1.143,side*.338],[.010,.010,.006],rgb(0xf8f5e8),8,14);
  }

  function limb(a,b,r1,r2,color) {
    const axis=unit(sub(b,a));
    const across=unit(cross(axis,Math.abs(axis[1])<.85 ? [0,1,0]:[1,0,0]));
    const other=cross(axis,across);
    surface(3,10,(u,angle) => {
      const radius=r1+(r2-r1)*u;
      return a.map((v,i) => v+(b[i]-v)*u+radius*(across[i]*Math.cos(angle)+other[i]*Math.sin(angle)));
    },() => color);
  }
  const feet=rgb(0x947d71);
  for (const side of [-1,1]) {
    const ankle=[.10,-.93,side*.23];
    limb([.23,-.56,side*.24],ankle,.048,.035,feet);
    for (const spread of [-1,0,1]) {
      limb(ankle,[.38-.035*Math.abs(spread),-.965,side*.23+spread*.12],.034,.007,feet);
    }
    limb(ankle,[-.045,-.965,side*.24],.03,.007,feet);
  }

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let yaw=.78, pitch=.13, width=0, height=0, dpr=1;
  let headYaw=0, headTilt=0, goalYaw=0, goalTilt=0;
  let visible=false, drag=null, lastPointer=null;
  const projected=ctx ? vertices.map(() => [0,0,0]) : [];
  // Nod at the base of the skull, then turn around the upper neck. A small
  // downward tuck brings the head toward the crop instead of lifting the back.
  const nodLimit=.30;
  const headMatrix=new Float32Array(9), headOffset=new Float32Array(3);
  function updateHeadPose() {
    const c=Math.cos(headTilt), s=Math.sin(headTilt), u=Math.cos(headYaw), v=Math.sin(headYaw);
    const tuck=Math.max(0,-headTilt/nodLimit);
    const jawX=.61,jawY=.94,turnX=.53;
    const shift=jawX*(1-c)+jawY*s-.035*tuck-turnX;
    headMatrix.set([u*c,s,v*c, -u*s,c,-v*s, -v,0,u]);
    headOffset.set([turnX+u*shift,jawY*(1-c)-jawX*s-.055*tuck,v*shift]);
  }
  function drawCanvas() {
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width/4.05,height/2.95);
    const cx=width*.535, cy=height*.55;
    const sy=Math.sin(yaw), cyaw=Math.cos(yaw), sp=Math.sin(pitch), cp=Math.cos(pitch);
    for (let i=0;i<vertices.length;i++) {
      let [x,y,z]=vertices[i];
      const w=neckWeights[i];
      if (w) {
        const m=headMatrix,t=headOffset;
        const tx=m[0]*x+m[3]*y+m[6]*z+t[0], ty=m[1]*x+m[4]*y+m[7]*z+t[1];
        const tz=m[2]*x+m[5]*y+m[8]*z+t[2];
        x+=(tx-x)*w; y+=(ty-y)*w; z+=(tz-z)*w;
      }
      const s=x*sy+z*cyaw;
      const p=projected[i];
      p[0]=cx+(x*cyaw-z*sy)*scale;
      p[1]=cy-(y*cp-s*sp)*scale;
      p[2]=y*sp+s*cp;
    }
    for (const face of faces) {
      const [a,b,c,d]=face.ids;
      face.depth=projected[a][2]+projected[b][2]+projected[c][2]+projected[d][2];
    }
    faces.sort((a,b)=>a.depth-b.depth);
    ctx.lineWidth=.55; ctx.lineJoin="round";
    for (const face of faces) {
      // Get the normal of the posed quad in view space, including the curved nape.
      const [a,b,c,d]=face.ids.map(i=>projected[i]);
      const ax=c[0]-a[0], ay=a[1]-c[1], az=(c[2]-a[2])*scale;
      const bx=d[0]-b[0], by=b[1]-d[1], bz=(d[2]-b[2])*scale;
      const nx=ay*bz-az*by, ny=az*bx-ax*bz, nz=ax*by-ay*bx;
      const diffuse=(nz<0?-1:1)*(-.34*nx+.70*ny+.48*nz)/(Math.hypot(nx,ny,nz)||1);
      const light=.80+.25*Math.max(-.22,diffuse);
      const [r,g,blue]=face.color;
      ctx.fillStyle=ctx.strokeStyle=`rgb(${Math.round(r*light)},${Math.round(g*light)},${Math.round(blue*light)})`;
      const ids=face.ids;
      ctx.beginPath();
      ctx.moveTo(projected[ids[0]][0],projected[ids[0]][1]);
      for(let j=1;j<4;j++) ctx.lineTo(projected[ids[j]][0],projected[ids[j]][1]);
      ctx.closePath();ctx.fill();ctx.stroke();
    }
  }
  function prepareWebGL() {
    const program=gl.createProgram();
    const shaders=[
      [gl.VERTEX_SHADER,`
        attribute vec3 position, normal, color;
        attribute vec2 blend;
        uniform vec4 rotation;
        uniform mat3 headMatrix;
        uniform vec3 headOffset;
        uniform vec2 scale;
        varying vec3 ink, direction;
        vec3 rotate(vec3 p) {
          float depth=p.x*rotation.x+p.z*rotation.y;
          return vec3(p.x*rotation.y-p.z*rotation.x,
                      p.y*rotation.w-depth*rotation.z,
                      p.y*rotation.z+depth*rotation.w);
        }
        void main() {
          vec3 delta=headMatrix*position+headOffset-position;
          vec3 p=rotate(position+blend.x*delta);
          gl_Position=vec4(p.xy*scale+vec2(.07,-.1),-p.z*.29,1.);
          mat3 jac=mat3(1.)+blend.x*(headMatrix-mat3(1.));
          jac[1]+=blend.y*delta;
          direction=rotate(normalize(mat3(cross(jac[1],jac[2]),cross(jac[2],jac[0]),cross(jac[0],jac[1]))*normal));
          ink=color;
        }`],
      [gl.FRAGMENT_SHADER,`
        precision mediump float;
        varying vec3 ink, direction;
        void main() {
          vec3 n=normalize(direction);
          if(n.z<0.) n=-n;
          vec3 light=normalize(vec3(-.38,.76,.50));
          float diffuse=max(-.22,dot(n,light));
          float sheen=pow(max(0.,dot(n,normalize(light+vec3(0.,0.,1.)))),18.);
          gl_FragColor=vec4(ink*(.78+.29*diffuse)+.025*sheen,1.);
        }`]
    ];
    for(const [type,source] of shaders) {
      const shader=gl.createShader(type);
      gl.shaderSource(shader,source);
      gl.compileShader(shader);
      gl.attachShader(program,shader);
    }
    gl.linkProgram(program);
    gl.useProgram(program);
    const data=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,data);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(smoothVertices),gl.STATIC_DRAW);
    for(const [i,name] of ["position","normal","color","blend"].entries()) {
      const at=gl.getAttribLocation(program,name);
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at,i===3?2:3,gl.FLOAT,false,44,i*12);
    }
    const indices=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(triangles),gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);
    const rotation=gl.getUniformLocation(program,"rotation"), scale=gl.getUniformLocation(program,"scale");
    const matrixLoc=gl.getUniformLocation(program,"headMatrix"), offsetLoc=gl.getUniformLocation(program,"headOffset");
    return () => {
      const zoom=Math.min(width/4.05,height/2.95);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform4f(rotation,Math.sin(yaw),Math.cos(yaw),Math.sin(pitch),Math.cos(pitch));
      gl.uniformMatrix3fv(matrixLoc,false,headMatrix);
      gl.uniform3fv(offsetLoc,headOffset);
      gl.uniform2f(scale,2*zoom/width,2*zoom/height);
      gl.drawElements(gl.TRIANGLES,triangles.length,gl.UNSIGNED_SHORT,0);
    };
  }
  let draw=gl ? prepareWebGL() : drawCanvas;
  if (gl) {
    canvas.addEventListener("webglcontextlost",event=>event.preventDefault());
    canvas.addEventListener("webglcontextrestored",()=>{draw=prepareWebGL();scheduleDraw()});
  }
  let frame=0, previousTime=0;
  function scheduleDraw() {
    if (frame || !visible || document.hidden) return;
    frame=requestAnimationFrame(time=>{
      frame=0;
      const elapsed=Math.min(64,time-(previousTime || time-16));
      previousTime=time;
      const blend=reduced.matches ? 1 : 1-Math.exp(-elapsed/92);
      headYaw+=(goalYaw-headYaw)*blend;
      headTilt+=(goalTilt-headTilt)*blend;
      updateHeadPose();
      draw();
      if (Math.abs(goalYaw-headYaw)+Math.abs(goalTilt-headTilt)>.001) scheduleDraw();
      else previousTime=0;
    });
  }
  function resize() {
    width=canvas.clientWidth;height=canvas.clientHeight;
    const zoom=Math.min(width/4.05,height/2.95);
    const stage=canvas.parentElement.style;
    stage.setProperty("--perch", (height*.55+.96*zoom)+"px");
    stage.setProperty("--shadow-width", (zoom*1.85)+"px");
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    scheduleDraw();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function rest() {
    goalYaw=goalTilt=0;
    scheduleDraw();
  }
  function lookAtPointer() {
    if (!visible || document.hidden || !lastPointer || reduced.matches || drag) return;
    const rect=canvas.getBoundingClientRect();
    const dx=lastPointer.x-(rect.left+width*.60);
    const dy=lastPointer.y-(rect.top+height*.32);
    const direction=Math.atan2(width*.38,dx);
    const angle=direction-yaw;
    const elevation=Math.atan2(-dy,Math.hypot(dx,width*.5));
    const limit=elevation<0?nodLimit:.38;
    goalTilt=limit*Math.tanh(elevation/limit);
    const turnLimit=1.10-.22*Math.max(0,-goalTilt/nodLimit);
    goalYaw=clamp(Math.atan2(Math.sin(angle),Math.cos(angle)),-turnLimit,turnLimit);
    scheduleDraw();
  }
  function forgetPointer() { lastPointer=null; rest(); }
  new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    if (visible) {lookAtPointer();scheduleDraw();}
    else {cancelAnimationFrame(frame);frame=previousTime=0;headYaw=headTilt=goalYaw=goalTilt=0;}
  }).observe(canvas);
  window.addEventListener("pointermove",event=>{
    if (event.pointerType==="touch" || event.buttons || !event.isPrimary) return;
    lastPointer={x:event.clientX,y:event.clientY};
    lookAtPointer();
  },{passive:true});
  window.addEventListener("scroll",lookAtPointer,{passive:true});
  document.documentElement.addEventListener("pointerleave",forgetPointer);
  window.addEventListener("blur",forgetPointer);
  reduced.addEventListener("change",forgetPointer);
  document.addEventListener("visibilitychange",()=>{
    if (document.hidden) {cancelAnimationFrame(frame);frame=previousTime=0;forgetPointer();}
    else scheduleDraw();
  });

  // Positive screen movement turns the nearest surface to the right in this projection.
  function turn(horizontal,vertical=0) {
    yaw=(yaw-horizontal)%tau;
    pitch=clamp(pitch+vertical,-.30,.56);
    scheduleDraw();
  }
  canvas.addEventListener("keydown",event=>{
    if(event.key!=="ArrowLeft" && event.key!=="ArrowRight") return;
    event.preventDefault();
    forgetPointer();
    turn((event.key==="ArrowRight"?1:-1)*Math.PI/12);
  });
  canvas.addEventListener("pointerdown",event=>{
    if(!event.isPrimary || event.button!==0) return;
    forgetPointer();
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove",event=>{
    if(drag?.id!==event.pointerId) return;
    const scale=Math.PI/Math.max(170,width*.74);
    turn((event.clientX-drag.x)*scale,(event.clientY-drag.y)*scale*.55);
    drag.x=event.clientX;drag.y=event.clientY;
  });
  function release(event) { if(drag?.id===event.pointerId) drag=null; }
  canvas.addEventListener("lostpointercapture",release);
  canvas.addEventListener("pointerup",release);
  canvas.addEventListener("pointercancel",release);
})();
