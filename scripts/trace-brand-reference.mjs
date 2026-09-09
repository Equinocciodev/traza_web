/** Vector-only reconstruction from Juan's raster reference 16.
 * Usage: node scripts/trace-brand-reference.mjs /absolute/path/to/reference.jpeg
 * Does not modify the source raster. The result is derived artwork, not an official supplied SVG.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const input=process.argv[2];
if(!input) throw new Error('Provide reference 16');
const original=await readFile(input);
const sha=createHash('sha256').update(original).digest('hex');
if(sha!=='1725a024f3e180e98a60ea62f9fc41a15e51ba6889932179e377a3b78ea456a8') throw new Error('Unexpected reference');
const {data,info}=await sharp(original).removeAlpha().raw().toBuffer({resolveWithObject:true});
const scale=289/880;
function simplify(points,tol=1.15){
 if(points.length<3)return points;
 const a=points[0],b=points.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
 let max=0,index=0;
 for(let i=1;i<points.length-1;i++){
  const p=points[i],t=len?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len)):0;
  const d=Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
  if(d>max){max=d;index=i;}
 }
 return max>tol?[...simplify(points.slice(0,index+1),tol).slice(0,-1),...simplify(points.slice(index),tol)]:[a,b];
}
function trace([x0,y0,x1,y1]){
 const solid=(x,y)=>{if(x<x0||x>=x1||y<y0||y>=y1)return false;const p=(y*info.width+x)*info.channels;return Math.min(data[p],data[p+1],data[p+2])>175&&Math.max(data[p],data[p+1],data[p+2])-Math.min(data[p],data[p+1],data[p+2])<55;};
 const edges=new Map();
 const add=(x,y,a,b)=>edges.set(`${x},${y}`,[a,b]);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(solid(x,y)){
  if(!solid(x,y-1))add(x,y,x+1,y);
  if(!solid(x+1,y))add(x+1,y,x+1,y+1);
  if(!solid(x,y+1))add(x+1,y+1,x,y+1);
  if(!solid(x-1,y))add(x,y+1,x,y);
 }
 const loops=[];
 while(edges.size){
  const key=edges.keys().next().value,start=key.split(',').map(Number),points=[start];let k=key;
  while(edges.has(k)){const p=edges.get(k);edges.delete(k);points.push(p);k=p.join(',');if(k===key)break;}
  if(points.length<12)continue;
  const half=Math.floor(points.length/2),p=[...simplify(points.slice(0,half+1)).slice(0,-1),...simplify(points.slice(half))];
  loops.push(p.map(([x,y],i)=>`${i?'L':'M'}${((x-190)*scale).toFixed(2)} ${((y-480)*scale).toFixed(2)}`).join('')+'Z');
 }
 return loops.join('');
}
const wordmark={label:'traza®',viewBox:'0 0 289 84',width:289,height:84,
 paths:[[190,480,320,690],[330,510,445,690],[447,510,643,695],[651,515,820,690],[823,510,1017,695]].map(trace),
 registered:trace([1017,508,1068,566]),underline:{x:Number(((660-190)*scale).toFixed(2)),y:Number(((706-480)*scale).toFixed(2)),width:Number((352*scale).toFixed(2)),height:Number((23*scale).toFixed(2))},
 source:{reference:'Juan reference 16',sha256:sha,method:'White contours traced from supplied raster; simplified to 1.15 source pixels. No official vector was supplied.'}};
await writeFile(new URL('../src/brand/wordmark.mjs',import.meta.url),'/** Traza wordmark reconstructed directly from Juan reference 16; see source metadata. */\nexport const WORDMARK = '+JSON.stringify(wordmark,null,2)+';\n');
console.log('Traced five letters and registered mark from verified original',sha);
