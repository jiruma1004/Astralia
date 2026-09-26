/* Motor visual compartido: raycasting de una cuadrícula, sin dependencias. */
window.EscapeRenderer = class {
  constructor(canvas) { this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.art={...makeWallArt(),...makeScenery()}; }
  decorate(room,hit,x,top,height){
    if(room.environment?.kind==='forest'){
      if(hit.axis==='x'&&hit.cx===0&&hit.py>=3.25&&hit.py<=4.75){const art=this.art.chalkWall,u=(4.75-hit.py)/1.5;this.ctx.drawImage(art,Math.min(art.width-1,Math.max(0,u*art.width)),0,1,art.height,x,top-height*.1,3,height);}
      return;
    }
    if(hit.tile!==1)return;
    const south=hit.axis==='y'&&hit.cy===6,north=hit.axis==='y'&&hit.cy===0;
    if(!south&&!north)return;
    let art,start,end;
    const portraitWidth=(320/380)*.76*this.canvas.height*1.32/this.canvas.width;
    if(room.environment?.portraits?.length&&Math.abs(hit.px-4.5)<=portraitWidth/2){art=this.art[room.environment.portraits[south?0:1]];start=4.5-portraitWidth/2;end=4.5+portraitWidth/2;}
    else if(south&&room.environment?.kind!=='gateway'&&Math.abs(hit.px-5.9)<=portraitWidth/2){art=this.art.portrait;start=5.9-portraitWidth/2;end=5.9+portraitWidth/2;}
    else if(north&&hit.px>=4.2&&hit.px<=7.4){art=this.art.equations;start=4.2;end=7.4;}
    else if(hit.px%4>1.65&&hit.px%4<2.15){art=this.art.crest;start=Math.floor(hit.px/4)*4+1.65;end=start+.5;}
    if(!art)return;
    const u=south?(end-hit.px)/(end-start):(hit.px-start)/(end-start);
    this.ctx.save();this.ctx.globalAlpha=Math.max(.35,1/(1+hit.distance*.055));this.ctx.drawImage(art,Math.min(art.width-1,Math.max(0,u*art.width)),0,1,art.height,x,top+height*.12,3,height*.76);this.ctx.restore();
  }
  cast(room,x,y,angle,opened) {
    // Cruces exactos de cuadrícula: las juntas permanecen fijas al mirar alrededor.
    const dx=Math.cos(angle),dy=Math.sin(angle),stepX=dx<0?-1:1,stepY=dy<0?-1:1;
    const deltaX=Math.abs(dx)>1e-10?Math.abs(1/dx):Infinity,deltaY=Math.abs(dy)>1e-10?Math.abs(1/dy):Infinity;
    let cx=Math.floor(x),cy=Math.floor(y),sideX=deltaX===Infinity?Infinity:(dx<0?x-cx:cx+1-x)*deltaX,sideY=deltaY===Infinity?Infinity:(dy<0?y-cy:cy+1-y)*deltaY;
    for(let step=0;step<128;step++){
      let distance,axis;if(sideX<sideY){distance=sideX;sideX+=deltaX;cx+=stepX;axis='x';}else{distance=sideY;sideY+=deltaY;cy+=stepY;axis='y';}
      if(distance>40)break;const tile=room.map[cy]?.[cx]??1;
      if(tile===1||(tile===2&&!opened))return {distance,tile,px:x+dx*distance,py:y+dy*distance,cx,cy,axis};
    }
    return {distance:40,tile:0,px:0,py:0};
  }
  draw(room,player,opened,flash,time,lab,roulette){
    this.tableButton=null;this.cannonBounds=null;this.depths=[];
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height,horizon=h*(.5+(player.pitch||0)),eye=.5+(player.jumpHeight||0);
    const sky=c.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#080e29');sky.addColorStop(1,'#25345c');c.fillStyle=sky;c.fillRect(0,0,w,horizon);if(room.environment?.kind!=='interior')for(let i=0;i<45;i++){c.fillStyle='rgba(190,215,255,'+(.2+.3*Math.sin(time/2200+i)**2)+')';c.fillRect((i*137.5)%w,(i*53.8)%(horizon*.86),1.8,1.8);}
    const floor=c.createLinearGradient(0,horizon,0,h);floor.addColorStop(0,'#17213f');floor.addColorStop(1,'#465477');c.fillStyle=floor;c.fillRect(0,horizon,w,h-horizon);
    if(room.environment?.kind==='interior')this.drawCeiling(room,player,horizon,eye);
    if(room.physics||room.environment?.kind==='interior'){
      // Proyección del suelo: el abismo y el puente ocupan las mismas casillas que las colisiones.
      for(let sy=Math.max(0,horizon+2);sy<h;sy+=4){const depth=(h*eye)/(sy-horizon);
        for(let sx=0;sx<w;sx+=6){const lateral=(sx/w*2-1)*.66;
          const wx=player.x+depth*(Math.cos(player.angle)-Math.sin(player.angle)*lateral),wy=player.y+depth*(Math.sin(player.angle)+Math.cos(player.angle)*lateral);
          const tile=room.map[Math.floor(wy)]?.[Math.floor(wx)];
          if(tile===3){const bridge=opened&&Math.floor(wy)===3;c.fillStyle=bridge?(wx%1<.08?'#a6d6f8':'#4b6586'):'#04090d';}
          else if(room.environment?.kind==='forest'){const noise=Math.sin(Math.floor(wx*9)*12.9898+Math.floor(wy*9)*78.233)*43758.5453,grain=noise-Math.floor(noise);c.fillStyle=grain>.85?'#405435':grain>.4?'#344a30':'#293f2c';}
          else {const seam=wx%1<.035||wy%1<.035;c.fillStyle=seam?'#151b25':(Math.floor(wx)+Math.floor(wy))%2?'#3b3c40':'#303339';}
          c.fillRect(sx,sy,6,4);
        }
      }
    }
    for(let x=0;x<w;x+=3){
      const angle=player.angle+Math.atan((x/w*2-1)*.66);
      const hit=this.cast(room,player.x,player.y,angle,opened);
      const d=Math.max(.02,hit.distance*Math.cos(angle-player.angle)),height=h/d,top=horizon-(1-eye)*height;
      this.depths[x]=d;
      const side=hit.axis==='x';
      const shade=Math.max(.15,1/(1+d*.15))*(side?.7:1);
      if(hit.tile===1){
        const along=side?hit.py:hit.px,u=((along%1)+1)%1,texture=room.environment?.kind==='forest'&&hit.cx!==0?this.art.forest:this.art.brick;
        const forest=room.environment?.kind==='forest'&&hit.cx!==0,wallTop=forest?horizon-(2.6-eye)*height:top,wallHeight=forest?height*2.6:height;
        c.drawImage(texture,Math.min(texture.width-1,Math.floor(u*texture.width)),0,1,texture.height,x,wallTop,3,wallHeight);
        if(room.environment?.tint){c.fillStyle=room.environment.tint;c.globalAlpha=.2;c.fillRect(x,top,3,height);c.globalAlpha=1;}
        c.fillStyle=`rgba(4,8,17,${1-shade})`;c.fillRect(x,wallTop,3,wallHeight);this.decorate(room,hit,x,top,height);continue;
      }
      if(hit.tile===2&&room.maze){const door=room.maze.doorAt(hit.cx,hit.cy);if(door){const art=this.actors.doorTexture(door),u=((hit.py%1)+1)%1;c.drawImage(art,Math.min(511,Math.floor(u*512)),0,1,512,x,top,3,height);continue;}}
      if(hit.tile===2&&room.environment?.portal){const u=hit.py-Math.floor(hit.py);c.drawImage(this.art.portalSealed,Math.min(511,Math.floor(u*512)),0,1,512,x,top,3,height);continue;}
      const base=hit.tile===2?[174,105,54]:room.color;
      c.fillStyle=`rgb(${base.map(v=>Math.round(v*shade)).join(',')})`;c.fillRect(x,top,3,height);
      const u=Math.max(Math.abs(hit.px-Math.round(hit.px)),Math.abs(hit.py-Math.round(hit.py)));
      c.fillStyle='rgba(0,0,0,.25)';
      for(let k=1;k<5;k++)c.fillRect(x,top+height*k/5,3,Math.max(1,height*.009));
      if(u<.025)c.fillRect(x,top,3,height);
      if(hit.tile===2 && u>.28){c.fillStyle='#ffcb78';c.fillRect(x,top+height*.43,3,height*.14);}
      this.decorate(room,hit,x,top,height);
    }
    if(room.environment?.portal&&opened)this.drawPortal(room,player,time,horizon,eye);
    if(room.physics){
      const p=room.physics;
      const project=(x,y,z)=>{const dx=x-player.x,dy=y-player.y,depth=dx*Math.cos(player.angle)+dy*Math.sin(player.angle),side=-dx*Math.sin(player.angle)+dy*Math.cos(player.angle);if(depth<.15)return null;
        const obstruction=this.cast(room,player.x,player.y,Math.atan2(dy,dx),opened);
        if(obstruction.distance+.1<Math.hypot(dx,dy))return null;
        return {x:w/2+side/depth*w/1.32,y:horizon-(z-eye)*h/depth,scale:h/depth};};
      const target=project(p.targetX,p.originY,p.targetHeight/p.metersPerCell);
      if(target){const r=Math.max(6,target.scale*p.tolerance/p.metersPerCell);c.fillStyle=opened?'#c2ee86':'#ffa95a';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(target.x,target.y,r,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#f7edca';c.lineWidth=2;c.strokeRect(target.x-r-5,target.y-r-5,2*r+10,2*r+10);c.fillStyle='#eef3d8';c.font='12px Arial';c.textAlign='center';c.fillText(opened?'PUENTE ACTIVO':'BOTÓN SUSPENDIDO',target.x,target.y-r-18);c.textAlign='left';}
      if(lab?.shot){const shot=lab.shot;const q=Projectile.sample(shot.v,shot.angle,shot.t,p,shot.azimuth),pos=project(p.originX+q.x/p.metersPerCell,p.originY+q.z/p.metersPerCell,q.y/p.metersPerCell);if(pos&&q.y>=0){c.fillStyle=shot.ammo.color;c.beginPath();c.arc(pos.x,pos.y,Math.max(3,pos.scale*.07),0,Math.PI*2);c.fill();}}
      const cannon=project(p.originX,p.originY,.22);
      if(cannon){const scale=Math.min(1.5,cannon.scale/300),cx=cannon.x,cy=cannon.y;
        c.save();c.translate(cx,cy);c.scale(scale,scale);c.strokeStyle='#b7c5db';c.lineWidth=2;
        const poly=(points,fill)=>{c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
        // Plataforma hexagonal y patas estabilizadoras. Silueta baja y ancha.
        poly([[-104,12],[-67,-14],[65,-14],[104,12],[78,41],[-78,41]],'#17243c');
        for(const x of [-82,82]){poly([[x-18,0],[x+18,0],[x+26,34],[x-26,34]],'#3b4d69');c.fillStyle='#e1c38c';c.fillRect(x-18,27,36,5);}
        poly([[-57,0],[-44,-48],[44,-48],[57,0]],'#263a56');
        if(lab.destroyed){poly([[-50,-6],[-31,-37],[-5,-14],[15,-45],[47,-12]],'#282634');c.fillStyle='#ff9762';c.fillRect(-16,-12,32,4);}
        else{
          const recoil=lab.shot&&!lab.shot.done&&lab.shot.t<.2?9:0;
          c.save();c.translate(Math.sin(lab.azimuth*Math.PI/180-player.angle)*24,-52+recoil);c.rotate(lab.azimuth*Math.PI/180*.22);
          const lift=Math.sin(lab.angle*Math.PI/180)*22;
          poly([[-65,17],[-78,-20-lift],[-50,-42-lift],[50,-42-lift],[78,-20-lift],[65,17]],'#496284');
          poly([[-54,6],[-62,-22-lift],[-42,-32-lift],[-33,6]],'#9cbed3');
          poly([[54,6],[62,-22-lift],[42,-32-lift],[33,6]],'#9cbed3');
          poly([[-30,7],[-32,-31-lift],[32,-31-lift],[30,7]],'#101e39');
          const color=lab.loaded?.color??'#8acced';c.strokeStyle='#d3f4ff';c.shadowColor=color;c.shadowBlur=lab.loaded?22:8;
          poly([[0,-56-lift],[22,-25-lift],[0,1],[-22,-25-lift]],color);c.shadowBlur=0;c.strokeStyle='#b7c5db';
          c.fillStyle='#dfcb95';for(const x of [-72,62])c.fillRect(x,-12-lift,10,22);
          if(recoil){c.strokeStyle='#fff1b1';c.lineWidth=4;c.beginPath();c.arc(0,-42-lift,35,0,Math.PI*2);c.stroke();}c.restore();
        }
        c.fillStyle='#c4d7ef';c.font='10px Georgia';c.textAlign='center';c.fillText(lab.destroyed?'SOBRECARGA':'TORRETA PRISMA · 180 J',0,59);c.restore();
        this.cannonBounds={x:cx-115*scale,y:cy-165*scale,w:230*scale,h:225*scale};
      }
      const screen=project(p.originX+.3,p.originY+.7,.75);if(screen){const sc=Math.min(1.1,screen.scale/320);c.save();c.translate(screen.x,screen.y);c.scale(sc,sc);c.fillStyle='#111d3bea';c.strokeStyle='#96b7db';c.lineWidth=2;c.fillRect(-75,-55,150,110);c.strokeRect(-75,-55,150,110);c.font='13px Georgia';c.fillStyle='#e4d3a0';c.fillText('ASTROLABIO',-57,-30);c.fillStyle='#bce6ff';c.fillText('Elevación  '+lab.angle+'°',-57,-6);c.fillText('Giro  '+lab.azimuth+'°',-57,15);c.fillText(lab.loaded?lab.loaded.mass+' kg · CARGADO':'RECÁMARA VACÍA',-57,38);c.restore();}
      c.fillStyle='rgba(9,17,35,.8)';c.fillRect(20,h-64,315,42);c.fillStyle='#cce099';c.font='12px Arial';c.fillText(opened?'PUENTE DESPLEGADO · AVANZA POR EL CENTRO':'ABISMO · ACTIVA EL BOTÓN PARA CRUZAR',32,h-39);
      return;
    }
    if(room.roulette){this.drawTable(room,player,opened,roulette,time);return;}
    if(room.conceptual)return;
    // Retícula y silueta del cañón; sustituibles por sprites en assets/.
    c.strokeStyle='#dbe8c3';c.lineWidth=2;c.beginPath();c.moveTo(w/2-10,h/2);c.lineTo(w/2-4,h/2);c.moveTo(w/2+4,h/2);c.lineTo(w/2+10,h/2);c.moveTo(w/2,h/2-10);c.lineTo(w/2,h/2-4);c.stroke();
    const recoil=flash>0?18:0;
    c.save();c.translate(w/2,h+recoil);c.fillStyle='#101713';c.beginPath();c.moveTo(-95,0);c.lineTo(-46,-120);c.lineTo(-31,-166);c.lineTo(31,-166);c.lineTo(46,-120);c.lineTo(95,0);c.fill();c.fillStyle='#657061';c.fillRect(-26,-157,52,127);c.fillStyle='#303e32';c.fillRect(-17,-149,34,112);c.fillStyle='#d0e690';c.fillRect(-12,-76,24,8);
    if(flash>0){c.fillStyle='#ffe2a1';c.beginPath();c.moveTo(-32,-166);c.lineTo(-46,-220);c.lineTo(-12,-203);c.lineTo(0,-264);c.lineTo(15,-201);c.lineTo(44,-225);c.lineTo(28,-166);c.fill();}c.restore();
    c.fillStyle='rgba(0,0,0,.10)';for(let y=0;y<h;y+=4)c.fillRect(0,y,w,1);
  }
  drawCeiling(room,player,horizon,eye){
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
    c.fillStyle='#151922';c.fillRect(0,0,w,horizon);
    for(let sy=0;sy<horizon-1;sy+=5){const depth=h*(1-eye)/(horizon-sy);
      for(let sx=0;sx<w;sx+=7){const lateral=(sx/w*2-1)*.66,wx=player.x+depth*(Math.cos(player.angle)-Math.sin(player.angle)*lateral),wy=player.y+depth*(Math.sin(player.angle)+Math.cos(player.angle)*lateral);
        const beam=((wx%2)+2)%2<.16||((wy%2)+2)%2<.12;
        c.fillStyle=beam?'#161b23':(Math.floor(wx*2)+Math.floor(wy*2))%2?'#30333c':'#2a2c34';c.fillRect(sx,sy,7,5);
      }
    }
    c.fillStyle=room.environment.tint;c.globalAlpha=.13;c.fillRect(0,0,w,horizon);c.globalAlpha=1;
  }
  drawPortal(room,player,time,horizon,eye){
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
    // El mismo plano que la puerta física: visible desde ambos lados y atravesable.
    for(let x=0;x<w;x+=3){const angle=player.angle+Math.atan((x/w*2-1)*.66),dx=Math.cos(angle);if(Math.abs(dx)<1e-7)continue;
      const distance=(7-player.x)/dx;if(distance<=.03)continue;const y=player.y+Math.sin(angle)*distance;if(y<3||y>=4)continue;
      const hit=this.cast(room,player.x,player.y,angle,true);if(hit.distance<distance-.01)continue;
      const height=h/(distance*Math.cos(angle-player.angle)),top=horizon-(1-eye)*height;c.globalAlpha=.88+.12*Math.sin(time/650);c.drawImage(this.art.portalOpen,Math.floor((y-3)*512),0,1,512,x,top,3,height);c.globalAlpha=1;
    }
  }
  drawTable(room,player,opened,roulette,time){
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height,dx=room.table.x-player.x,dy=room.table.y-player.y,depth=dx*Math.cos(player.angle)+dy*Math.sin(player.angle),side=-dx*Math.sin(player.angle)+dy*Math.cos(player.angle);if(depth<.25)return;
    const obstruction=this.cast(room,player.x,player.y,Math.atan2(dy,dx),opened);if(obstruction.distance+.1<Math.hypot(dx,dy))return;
    const x=w/2+side/depth*w/1.32,scale=Math.min(1.7,2/depth),y=h*(.5+(player.pitch||0))+(player.jumpHeight||0)*h/depth+50*scale;
    c.save();c.translate(x,y);c.scale(scale,scale);c.fillStyle='#101936';c.strokeStyle='#b4a071';c.lineWidth=3;c.fillRect(-105,18,22,130);c.strokeRect(-105,18,22,130);c.fillRect(83,18,22,130);c.strokeRect(83,18,22,130);c.fillStyle='#273654';c.beginPath();c.ellipse(0,10,147,49,0,0,Math.PI*2);c.fill();c.stroke();
    c.save();c.translate(0,-96);c.shadowColor='#8ab9ff';c.shadowBlur=20;for(let i=0;i<10;i++){const start=roulette.angle+i*Math.PI/5,end=start+Math.PI/5;c.fillStyle=i>=8?'#7c314c':(i%2?'#293c79':'#435595');c.beginPath();c.moveTo(0,0);c.arc(0,0,94,start,end);c.closePath();c.fill();c.strokeStyle='#b0bfe5';c.lineWidth=1;c.stroke();const a=(start+end)/2;c.save();c.translate(Math.cos(a)*67,Math.sin(a)*67);c.rotate(a+Math.PI/2);c.fillStyle='#fff1d0';c.font='bold 19px Georgia';c.textAlign='center';c.fillText(String(i+1).padStart(2,'0'),0,6);c.restore();}c.shadowBlur=0;c.fillStyle='#c9eaff';c.beginPath();c.arc(0,0,20,0,Math.PI*2);c.fill();c.fillStyle='#e2cc92';c.beginPath();c.moveTo(-12,-112);c.lineTo(12,-112);c.lineTo(0,-86);c.fill();c.restore();
    c.fillStyle=roulette.spinning?'#786882':'#a9e8ff';c.shadowColor='#96daff';c.shadowBlur=15;c.beginPath();c.ellipse(0,31,27,12,0,0,Math.PI*2);c.fill();c.shadowBlur=0;c.fillStyle='#ece1b9';c.font='14px Georgia';c.textAlign='center';c.fillText(roulette.spinning?'EL DESTINO GIRA…':'PULSA EL CRISTAL',0,81);c.restore();this.tableButton={x,y:y+31*scale,r:30*scale};
  }

};
