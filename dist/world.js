// Original Reachly pavilion. Touch-force displacement adapted from the inspected
// Awwwards Pack / Webgl & ThreeJS Effects / 9 TouchTexture + particle.vert.
export function worldGeometry() {
  const data = [];
  const triangle = (a,b,c,color) => [a,b,c].forEach(p => data.push(...p,...color));
  const quad = (a,b,c,d,color) => { triangle(a,b,c,color); triangle(a,c,d,color); };
  const cube = (x,y,z,w,h,d,color) => {
    const a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],c=[x+w/2,y+h,z-d/2],e=[x-w/2,y+h,z-d/2];
    const f=[x-w/2,y,z+d/2],g=[x+w/2,y,z+d/2],i=[x+w/2,y+h,z+d/2],j=[x-w/2,y+h,z+d/2];
    quad(a,b,c,e,color.map(v=>v*.7)); quad(f,g,i,j,color); quad(a,f,j,e,color.map(v=>v*.55)); quad(b,g,i,c,color.map(v=>v*.85)); quad(e,c,i,j,color.map(v=>Math.min(v*1.2,1)));
  };
  cube(0,-.35,0,6,.28,4.7,[.16,.34,.27]);
  for(let x=-2.8;x<=2.8;x+=.4) cube(x,-.06,0,.012,.012,4.7,[.42,.58,.37]);
  for(let z=-2.3;z<=2.3;z+=.4) cube(0,-.06,z,6,.012,.012,[.42,.58,.37]);
  // A ribbed cylindrical digital pavilion, not the reference's stadium geometry.
  for(let n=0;n<72;n++) {
    const a=n/72*Math.PI*2,b=(n+1)/72*Math.PI*2;
    const p=t=>[Math.cos(t)*1.65,0,Math.sin(t)*1.25];
    const v=p(a),w=p(b),top=p(a).map((v,i)=>i===1?1.15:v),next=p(b).map((v,i)=>i===1?1.15:v);
    quad(v,w,next,top,n%3===0?[.83,.91,.32]:[.14,.37,.27]);
    triangle([0,1.15,0],top,next,[.83,.91,.32]);
    const x=Math.cos(a)*1.72,z=Math.sin(a)*1.32;
    cube(x,.05,z,.025,1.04,.025,[.9,.96,.63]);
  }
  cube(0,1.17,0,1.15,.12,.65,[.07,.2,.15]);
  for(let n=0;n<12;n++) {
    const a=n/12*Math.PI*2;
    cube(Math.cos(a)*2.5,0,Math.sin(a)*1.95,.28,.35+(n%3)*.24,.3,[.33,.59,.4]);
    cube(Math.cos(a)*2.5,.36+(n%3)*.24,Math.sin(a)*1.95,.32,.03,.34,[.83,.91,.32]);
  }
  for(let n=0;n<7;n++)cube(0,-.02+n*.024,1.63+n*.09,1.1,.025,.1,[.7,.78,.4]);
  return new Float32Array(data);
}
export function startWorld(stage, motion) {
  const canvas = stage.querySelector('#world-canvas');
  const gl = canvas?.getContext('webgl', { alpha:true, antialias:true });
  if (!gl) return;
  const vertex = `attribute vec3 position; attribute vec3 color; varying vec3 tint;
  uniform float yaw; uniform float pitch; uniform float aspect; uniform float pulse; uniform vec2 touch;
  void main(){vec3 p=position; float force=exp(-length(p.xz-touch)*2.0)*pulse; p.y+=force*.18;
  float x=p.x*cos(yaw)+p.z*sin(yaw); float z=-p.x*sin(yaw)+p.z*cos(yaw);
  float y=p.y*cos(pitch)-z*sin(pitch); z=p.y*sin(pitch)+z*cos(pitch);
  float depth=9.0-z; gl_Position=vec4(x*1.9/aspect,y*1.9-.5,depth*.8-1.0,depth);
  tint=color*(.85+.15*sin(position.x+position.z));}`;
  const fragment = 'precision mediump float; varying vec3 tint; void main(){gl_FragColor=vec4(tint,1.0);}';
  const shader = (type, source) => { const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s; };
  let program;
  try { program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return; } catch { return; }
  gl.useProgram(program);
  const geometry=worldGeometry(), buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);
  ['position','color'].forEach((name,i)=>{const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,24,i*12);});
  const uniform=Object.fromEntries(['yaw','pitch','aspect','pulse','touch'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.enable(gl.DEPTH_TEST);stage.classList.add('webgl-ready');
  let frame=0, visible=true, force=0, point={x:0,y:0}, last;
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);gl.viewport(0,0,canvas.width,canvas.height);};
  function draw(time=0) {
    frame=0;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const css=getComputedStyle(stage);const y=parseFloat(css.getPropertyValue('--rotate-y'))||-10,x=parseFloat(css.getPropertyValue('--rotate-x'))||5,scroll=parseFloat(css.getPropertyValue('--world-turn'))||0;
    gl.uniform1f(uniform.yaw,y*Math.PI/180+.5+scroll+(motion.matches?0:Math.sin(time*.00018)*.08));
    gl.uniform1f(uniform.pitch,.55+x*Math.PI/180);gl.uniform1f(uniform.aspect,canvas.width/Math.max(1,canvas.height));
    gl.uniform1f(uniform.pulse,motion.matches?0:force);gl.uniform2f(uniform.touch,point.x,point.y);gl.drawArrays(gl.TRIANGLES,0,geometry.length/6);
    force*=.94;if(visible&&!motion.matches&&!document.hidden)frame=requestAnimationFrame(draw);
  }
  const restart=()=>{cancelAnimationFrame(frame);resize();draw();};
  stage.addEventListener('pointermove',e=>{if(motion.matches)return;const r=stage.getBoundingClientRect();const p={x:((e.clientX-r.left)/r.width-.5)*6,y:((e.clientY-r.top)/r.height-.5)*4};if(last)force=Math.min(((p.x-last.x)**2+(p.y-last.y)**2)*100,1);point=p;last=p;});
  stage.addEventListener('keydown',()=>{if(motion.matches)draw();});
  motion.addEventListener('change',restart);addEventListener('resize',restart);document.addEventListener('visibilitychange',restart);
  if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();}).observe(stage);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);stage.classList.remove('webgl-ready');});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());restart();
}
