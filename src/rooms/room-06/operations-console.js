/* Cached console artwork on projected world surfaces: no external image load. */
window.IgnitiaOperationsConsole={
 screen(){
  if(this.texture)return this.texture;
  const a=this.texture=document.createElement('canvas');a.width=640;a.height=360;
  const c=a.getContext('2d');
  c.fillStyle='#102c39';c.fillRect(0,0,640,360);
  c.strokeStyle='#478878';c.lineWidth=1;
  for(let x=0;x<640;x+=32){c.beginPath();c.moveTo(x,0);c.lineTo(x,360);c.stroke();}
  for(let y=0;y<360;y+=30){c.beginPath();c.moveTo(0,y);c.lineTo(640,y);c.stroke();}
  c.fillStyle='#e3ecd3';c.beginPath();c.arc(536,80,37,0,7);c.fill();
  c.fillStyle='#9eb8ab';for(const [x,y,r] of [[520,65,9],[548,91,12],[540,54,6]]){c.beginPath();c.arc(x,y,r,0,7);c.fill();}
  c.strokeStyle='#83ffd2';c.lineWidth=5;c.beginPath();c.moveTo(45,310);c.quadraticCurveTo(240,40,490,90);c.stroke();
  c.setLineDash([9,9]);c.strokeStyle='#ffb76c';c.beginPath();c.moveTo(300,215);c.lineTo(530,84);c.stroke();c.setLineDash([]);
  c.fillStyle='#ffb76c';c.beginPath();c.moveTo(310,185);c.lineTo(335,215);c.lineTo(297,224);c.closePath();c.fill();
  c.fillStyle='#d6ffed';c.font='bold 29px sans-serif';c.fillText('IGNITIA',22,40);
  return a;
 },
 draw(r,player,actors,time){
  const c=r.ctx,project=(x,y,z)=>actors.project(r,player,x,y,z);
  const poly=(points,fill,stroke='#77939e')=>{
   const p=points.map(v=>project(...v));if(p.some(v=>!v))return;
   c.beginPath();p.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.lineWidth=2;c.stroke();
  };
  // Front faces the entrance; a broad sloped desk with three monitors.
  c.save();
  poly([[7,4,0],[7,7,0],[7,7,.85],[7,4,.85]],'#263e53');
  poly([[7,7,0],[8.1,7,0],[8.1,7,1],[7,7,.85]],'#192e40');
  poly([[7,4,.85],[7,7,.85],[8.1,7,1],[8.1,4,1]],'#536a7c');
  for(const [y,z,width,height] of [[4.45,1.6,.76,.56],[5.5,1.85,1.05,.78],[6.65,1.6,.76,.56]]){
   const p=project(7.9,y,z);if(!p)continue;
   const w=p.scale*width,h=p.scale*height,base=project(7.9,y,1);
   if(base){c.strokeStyle='#8099a8';c.lineWidth=Math.max(3,p.scale*.08);c.beginPath();c.moveTo(p.x,p.y+h/2);c.lineTo(base.x,base.y);c.stroke();}

   c.fillStyle='#142631';c.fillRect(p.x-w*.56,p.y-h*.55,w*1.12,h*1.15);
   c.drawImage(this.screen(),p.x-w/2,p.y-h/2,w,h);
   c.strokeStyle='#9bddd4';c.lineWidth=2;c.strokeRect(p.x-w/2,p.y-h/2,w,h);
  }
  for(let i=0;i<12;i++){
   const p=project(7.35,4.2+i*.22,.95);if(!p)continue;
   c.fillStyle=i%4===0?'#f2bf69':i%3===0?'#58e9b9':'#243c55';c.fillRect(p.x-3,p.y-3,6,6);
  }
  const label=project(6.99,6,.55);
  if(label){
   const font=Math.max(13,Math.min(18,label.scale*.14));c.font='bold '+font+'px sans-serif';c.textAlign='center';
   const text=I18n.lang==='en'?'OPERATIONS CONSOLE':'CONSOLA DE OPERACIONES',w=c.measureText(text).width+28;
   c.fillStyle='#0b1f31ed';c.fillRect(label.x-w/2,label.y-font,w,font*2.65);
   c.fillStyle='#a9ffdf';c.fillText(text,label.x,label.y);
   c.font=(font*.78)+'px sans-serif';c.fillStyle='#ffffff';c.fillText(I18n.lang==='en'?'Approach · Click / E':'Acércate · Clic / E',label.x,label.y+font*1.15);
  }
  c.restore();
 }
};
