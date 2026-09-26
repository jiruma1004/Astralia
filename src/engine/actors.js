window.RoomActors=class {
 constructor(){this.ivan=new Image();this.ivan.src='assets/sprites/epi-ivan.png';this.paola=new Image();/* Añadir paola.src cuando llegue su retrato. */this.doorArt=new Map();}
 doorTexture(door){
  const key=door.stage+'-'+door.choice;if(this.doorArt.has(key))return this.doorArt.get(key);
  const art=document.createElement('canvas');art.width=art.height=512;const c=art.getContext('2d');
  c.fillStyle='#273346';c.fillRect(0,0,512,512);for(let i=0;i<8;i++){c.fillStyle=i%2?'#324257':'#2b394d';c.fillRect(14+i*61,12,56,488);}c.strokeStyle='#ba9764';c.lineWidth=13;c.strokeRect(14,14,484,484);
  c.fillStyle='#101c2bf2';c.fillRect(36,113,440,239);c.strokeStyle='#d0bb8e';c.lineWidth=3;c.strokeRect(36,113,440,239);c.textAlign='center';c.fillStyle='#ecd3a2';c.font='bold 68px Georgia';c.fillText(door.letter,256,192);
  c.fillStyle='#ddba76';c.beginPath();c.arc(432,404,13,0,Math.PI*2);c.fill();this.doorArt.set(key,art);return art;
 }
 project(renderer,player,x,y,z){const w=renderer.canvas.width,h=renderer.canvas.height,dx=x-player.x,dy=y-player.y,depth=dx*Math.cos(player.angle)+dy*Math.sin(player.angle),side=-dx*Math.sin(player.angle)+dy*Math.cos(player.angle);if(depth<.12)return null;return {x:w/2+side/depth*w/1.32,y:h*(.5+(player.pitch||0))-(z-.5-(player.jumpHeight||0))*h/depth,scale:h/depth,depth};}
 draw(renderer,room,player,opened,time,maze){
  const objects=[];if(room.guide)objects.push({...room.guide,kind:'guide'});if(room.answerDesk)objects.push({...room.answerDesk,kind:'desk'});if(maze?.chasing)objects.push({...maze.enemy,kind:'ivan'});
  objects.sort((a,b)=>Math.hypot(b.x-player.x,b.y-player.y)-Math.hypot(a.x-player.x,a.y-player.y));
  this.deskBounds=this.guideBounds=null;
  if(maze)this.drawDoorLabels(renderer,room,player,maze);
  for(const obj of objects){const p=this.project(renderer,player,obj.x,obj.y,0);if(!p)continue;const c=renderer.ctx;
   if(obj.kind==='ivan'){this.drawIvan(renderer,p,time,maze.bite>0);continue;}
   const hit=renderer.cast(room,player.x,player.y,Math.atan2(obj.y-player.y,obj.x-player.x),opened);if(hit.distance+.1<Math.hypot(obj.x-player.x,obj.y-player.y))continue;
   c.save();c.translate(p.x,p.y);const s=p.scale/350;c.scale(s,s);
   if(obj.kind==='desk'){
    c.fillStyle='#1c2535';c.strokeStyle='#c7a877';c.lineWidth=4;c.fillRect(-103,-136,17,135);c.fillRect(85,-136,17,135);c.fillStyle='#40516b';c.beginPath();c.ellipse(0,-140,132,35,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#869d9c';c.fillRect(-5,-185,10,40);
    c.fillStyle='#082b2a';c.strokeStyle='#9ae9c5';c.lineWidth=3;c.fillRect(-81,-291,162,110);c.strokeRect(-81,-291,162,110);c.fillStyle='#c8ffe5';c.font='16px Trebuchet MS';c.textAlign='center';c.fillText('RESPUESTAS',0,-260);c.font='13px Trebuchet MS';c.fillText('Mira aquí · E',0,-235);c.fillStyle='#82c9aa';c.fillRect(-55,-218,110,12);this.deskBounds={x:p.x-85*s,y:p.y-295*s,w:170*s,h:125*s};
   }else{
    c.fillStyle='#0005';c.beginPath();c.ellipse(0,-3,45,14,0,0,Math.PI*2);c.fill();
    if(this.paola.complete&&this.paola.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(this.paola,-70,-295,140,280);}else{
     // Figura de guía provisional, sin atribuir a Paola un retrato inventado.
     c.fillStyle='#302945';c.fillRect(-35,-33,24,28);c.fillRect(11,-33,24,28);c.fillStyle='#a297bd';c.beginPath();c.moveTo(-26,-189);c.lineTo(26,-189);c.lineTo(58,-33);c.lineTo(-58,-33);c.closePath();c.fill();c.fillStyle='#5c4b83';c.fillRect(-27,-182,54,148);c.fillStyle='#e8d1b0';c.fillRect(-24,-244,48,51);c.fillStyle='#4b4166';c.fillRect(-32,-262,64,24);c.fillRect(-35,-244,13,66);c.fillRect(22,-244,13,66);c.fillStyle='#e6cf95';c.fillRect(-6,-158,12,12);c.fillRect(48,-171,5,149);c.fillStyle='#c2efff';c.beginPath();c.arc(50,-178,13,0,Math.PI*2);c.fill();
    }
    c.font='bold 16px Trebuchet MS';c.textAlign='center';c.fillStyle='#e8d5ff';c.fillText('EPI PAOLA',0,-282);c.font='12px Trebuchet MS';c.fillText('Tu guía · pide una pista',0,21);this.guideBounds={x:p.x-65*s,y:p.y-285*s,w:130*s,h:310*s};
   }c.restore();
  }
  if(room.conceptual||room.roulette){const c=renderer.ctx,w=renderer.canvas.width,h=renderer.canvas.height;c.fillStyle='#eee7c1';c.fillRect(w/2-2,h/2-2,4,4);}
  if(maze?.bite>0){const c=renderer.ctx;c.fillStyle=`rgba(150,35,65,${maze.bite*.15})`;c.fillRect(0,0,renderer.canvas.width,renderer.canvas.height);}
 }
 drawIvan(renderer,p,time,biting){
  if(!this.ivan.complete||!this.ivan.naturalWidth)return;
  const c=renderer.ctx,frame=biting?1:Math.floor(time/410)%2,fw=this.ivan.naturalWidth/2,fh=this.ivan.naturalHeight,size=p.scale*.84,left=p.x-size/2,top=p.y-size+Math.sin(time/220)*p.scale*.018;
  c.save();c.imageSmoothingEnabled=false;
  // Recorte por columna contra la profundidad del muro: Ivan nunca se ve a través de paredes.
  for(let x=Math.max(0,Math.floor(left/3)*3);x<Math.min(renderer.canvas.width,left+size);x+=3){if(p.depth>(renderer.depths[x]??Infinity)+.05)continue;const u=Math.max(0,(x-left)/size);c.drawImage(this.ivan,frame*fw+u*fw,0,Math.min(3/size*fw,fw-u*fw),fh,x,top,3,size);}
  c.restore();
 }
 drawDoorLabels(renderer,room,player,maze){
  const c=renderer.ctx;
  for(const door of maze.doors.filter(d=>d.stage===maze.stage&&room.map[d.y][d.x]===2)){
   const x=door.x-.02,y=door.y+.5,p=this.project(renderer,player,x,y,.52);if(!p||p.depth<.45||p.depth>10)continue;
   const hit=renderer.cast(room,player.x,player.y,Math.atan2(y-player.y,x-player.x),false);if(hit.distance+.03<Math.hypot(x-player.x,y-player.y))continue;
   c.save();const width=Math.min(280,Math.max(104,p.scale*.83)),font=Math.max(14,Math.min(22,p.scale*.08));c.font=`${font}px Trebuchet MS`;c.textAlign='center';
   const lines=[];let line='';for(const word of door.text.split(' ')){if(c.measureText((line+' '+word).trim()).width>width-16){lines.push(line);line=word;}else line=(line+' '+word).trim();}if(line)lines.push(line);
   const height=lines.length*(font+4)+18;c.fillStyle='#102031';c.fillRect(p.x-width/2,p.y-height/2,width,height);c.strokeStyle='#cdb482';c.strokeRect(p.x-width/2,p.y-height/2,width,height);c.fillStyle='#f6e4c0';lines.forEach((text,i)=>c.fillText(text,p.x,p.y-height/2+font+6+i*(font+4)));c.restore();
  }
 }
};
