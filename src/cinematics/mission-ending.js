/* Final principal: un único lanzamiento, ruta confirmada y epílogo bajo demanda. */
window.MissionEnding={
 duration:55,launchAt:7,releaseAt:13,orbitAt:18,impactAt:29,
 phase(t){return t<3?'warning':t<6?'walk':t<7?'tangle':t<13?'ascent':t<18?'release':SpaceInterception.phase(t-12);},
 ascent(t){const u=Math.max(0,Math.min(1,(t-7)/11));return {x:.53+.08*u*u,y:.68-.99*u*u};}
};
window.MissionEndingScene=class {
 constructor(library){this.lib=library;this.space=new SpaceCinematic(library);}
 draw(t){
  if(t>=18){const result=this.space.draw(t-12);this.fade(Math.max(0,1-(t-18)/.55));return result;}
  const l=this.lib,c=l.ctx,w=l.canvas.width,h=l.canvas.height,size=Math.min(w,h);
  l.background(0,1,l.images.spaceAtlas);
  // La cámara sube hacia el cielo; no se muestra el destino de Iván todavía.
  const sky=Math.max(0,Math.min(1,(t-10)/5));if(sky){c.save();c.globalAlpha=sky;l.background(1,1,l.images.spaceAtlas);c.restore();}
  const rocket=MissionEnding.ascent(t),rx=w*rocket.x,ry=h*rocket.y,rh=size*.48;
  const footX=t<6?w*(.16+.30*Math.max(0,(t-3)/3)):w*.46;
  let ix=footX,iy=h*.88,rotation=0;const bh=size*.23;
  if(t>=7){const turn=Math.max(0,Math.min(1,(t-9)/1.2)),ease=turn*turn*(3-2*turn);rotation=Math.PI*ease+.20*Math.sin(t*3)*ease;ix=rx-size*.13+Math.sin(t*2)*size*.025;iy=h*.88+(ry+rh*.45-h*.88)*ease;}
  if(t>=13){const released=MissionEnding.ascent(13),age=t-13;ix=w*released.x-size*.13+size*.045*age;iy=h*released.y+rh*.45+size*.10*age*age;rotation=Math.PI+.55*age;}
  // Cable curvo: anclaje al fuselaje y lazo en el tobillo, nunca sobre el torso.
  c.save();c.strokeStyle='#d8bb83';c.lineWidth=Math.max(2,size*.006);c.beginPath();c.moveTo(rx-rh*.12,ry+rh*.32);
  if(t<13)c.quadraticCurveTo((rx+ix)/2,Math.max(ry+rh*.32,iy)+size*(t<9?.035:.012),ix,iy);
  else c.quadraticCurveTo(rx-size*.1,ry+rh*.52,rx-size*.07+Math.sin(t*4)*size*.03,ry+rh*.65);
  c.stroke();c.restore();
  this.space.sprite('ignitiaRocket',rx,ry,rh,t<7?0:.12*Math.max(0,(t-7)/11));
  if(t>=3&&t<17.5&&iy-bh<h){l.ivan(ix,iy,bh,{walk:t<6,rotation});if(t>=6&&t<13){c.save();c.strokeStyle='#d8bb83';c.lineWidth=3;c.beginPath();c.ellipse(ix,iy,bh*.05,bh*.025,0,0,Math.PI*2);c.stroke();c.restore();}}
  let caption=t<3?'Paola: «¡Espera! Alguien está pasando detrás del cohete…»':t<6?'Iván: «¿Eric? ¿Dónde te metiste?»':t<7?'Iván pisa un cable suelto. El lazo se cierra alrededor de su tobillo.':t<13?'Ignitia despega. Iván queda enganchado por accidente.':'Iván se suelta y desaparece entre las nubes. El cohete mantiene la trayectoria confirmada.';
  if(t>=9.5&&t<14.4){c.save();c.font=`bold ${Math.max(14,size*.032)}px sans-serif`;c.textAlign='center';const bx=Math.min(w*.75,ix+size*.19),by=Math.min(h*.75,iy+bh*.42);c.fillStyle='#fff0cf';c.beginPath();c.roundRect(bx-size*.18,by-size*.055,size*.36,size*.075,8);c.fill();c.fillStyle='#35213e';c.fillText('AAAAAAAAHHHH',bx,by);c.restore();}
  this.fade(Math.max(0,(t-17.45)/.55));return {caption,speech:''};
 }
 fade(alpha){if(alpha<=0)return;const l=this.lib;l.ctx.save();l.ctx.fillStyle=`rgba(8,19,34,${Math.min(1,alpha)})`;l.ctx.fillRect(0,0,l.canvas.width,l.canvas.height);l.ctx.restore();}
};
