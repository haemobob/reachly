// Adapted from thinking-orbs by Jakub Antalik. MIT; see THIRD_PARTY_LICENSES.txt.
function hashD(a,b){const h=Math.sin(a*12.9898+b*78.233)*43758.5453;return h-Math.floor(h);}
function makeProj(yaw,tilt,cx,cy,scale){const st=Math.sin(tilt),ct=Math.cos(tilt),sy=Math.sin(yaw),cw=Math.cos(yaw);return(x,y,z)=>{const xx=x*cw+z*sy,zz=-x*sy+z*cw;return[cx+xx*scale,cy-(y*ct-zz*st)*scale,y*st+zz*ct];};}
function radiusScale(size,pow){return(size/300)**pow;}
function finalizeFrame(dots,lines,rMin=.3){const visible=dots.filter(d=>(d.a??1)>=.02);visible.forEach(d=>d.r=Math.max(rMin,d.r));visible.sort((a,b)=>a.z-b.z);return{dots:visible,lines};}
// Orbits: particles on tilted orbits — the "working" state. No nucleus
// (the tuned preset runs coreless): just ghost paths and the particles
// doing the work.


export const frameOrbits = (size, t, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;
  const pt = makeProj(t * 0.12, 0.3, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  const dots = [];
  const orbitN = o.orbitN ?? 12;
  const ghostN = o.ghostN ?? 40;
  const particles = o.particles ?? 3;

  // orbits: each a tilted circle — a ghost path + running particles
  for (let orb = 0; orb < orbitN; orb++) {
    const h1 = hashD(orb, 1.7);
    const h2 = hashD(orb, 5.2);
    const h3 = hashD(orb, 8.9);
    const ro = R * (0.45 + 0.52 * h1);
    const th = h1 * 2 * Math.PI;
    const phi = Math.acos(2 * h2 - 1);
    // orbit plane basis (u, v ⟂ normal n)
    const nx = Math.sin(phi) * Math.cos(th);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(th);
    let ux = -ny;
    let uy = nx;
    const uz = 0;
    const ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
    ux /= ul;
    uy /= ul;
    const vx = ny * uz - nz * uy;
    const vy = nz * ux - nx * uz;
    const vz = nx * uy - ny * ux;
    const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);

    // ghost path
    for (let k = 0; k < ghostN; k++) {
      const a = (k / ghostN) * 2 * Math.PI;
      const [px, py, z] = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro
      );
      const depth = (z / ro + 1) / 2;
      dots.push({
        x: px,
        y: py,
        z,
        r: (o.ghostR ?? 0.9) * rs,
        white: 0.72,
        a: (o.ghostA ?? 0.5) * (0.4 + 0.6 * depth)
      });
    }
    // the particles doing the work
    for (let m = 0; m < particles; m++) {
      const a = t * speed + (m / particles) * 2 * Math.PI + h2 * 6;
      const [px, py, z] = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro
      );
      const depth = (z / ro + 1) / 2;
      dots.push({
        x: px,
        y: py,
        z,
        r: ((o.partR ?? 1.2) + (o.partRDepth ?? 1.6) * depth) * rs,
        white: 0.3 - 0.22 * depth
      });
    }
  }
  return finalizeFrame(dots, [], o.rMin);
};

export function startOrb(canvas,motion){
 const ctx=canvas.getContext('2d'); if(!ctx)return;
 const size=64, dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=size*dpr;canvas.height=size*dpr;ctx.scale(dpr,dpr);
 let visible=false,raf=0;
 function paint(t){ctx.clearRect(0,0,size,size);const frame=frameOrbits(size,t,{orbitN:9,ghostN:30,particles:2,ghostR:.9,ghostA:.4,partR:1.1,partRDepth:1.5});frame.dots.forEach(d=>{const g=Math.round((1-d.white)*255);ctx.fillStyle=`rgba(${g},${g},${g},${d.a??1})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();});}
 function tick(t){raf=0;if(!visible||document.hidden||motion.matches)return;paint(t*.001);raf=requestAnimationFrame(tick);}
 function sync(){if(raf){cancelAnimationFrame(raf);raf=0;}if(motion.matches)paint(1.2);else if(visible&&!document.hidden)raf=requestAnimationFrame(tick);}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(canvas);
 document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);paint(1.2);
}

