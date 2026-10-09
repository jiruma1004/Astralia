/* Despedida común a las dos rutas. Atlas propio de dos poses, pies anclados;
   solo se carga tras el diploma, junto con el epílogo elegido. */
window.FinalApplause={delay:3,duration:18,names:['Dr. Eric','EPI Iván','Karla','EPI Paola','Angélica'],
 // Bounding boxes of the opaque figures within each 1/5 × 1/2 atlas cell.
 bounds:[[[54,14,296,507],[54,15,246,507],[43,16,257,507],[37,15,252,507],[22,17,237,507]],[[58,7,292,498],[56,11,245,498],[49,10,250,498],[40,10,251,498],[25,12,234,498]]]
};
window.ApplauseScene=class {
 constructor(lib){this.lib=lib;this.motion=0;this.lastClap=-1;}
 tick(dt){if(this.lib.paused&&!this.lib.finished)return;this.motion+=dt;const beat=Math.floor(this.motion/.65);if(beat!==this.lastClap){this.lastClap=beat;Sound.applause();}}
 draw(t){
  const l=this.lib,c=l.ctx,w=l.canvas.width,h=l.canvas.height,bg=l.images.applauseSky,cast=l.images.applauseCast;
  const s=Math.max(w/bg.naturalWidth,h/bg.naturalHeight);c.drawImage(bg,(w-bg.naturalWidth*s)/2,(h-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s);
  const wide=w/h>1.2,body=wide?Math.min(h*.49,w*.24):Math.min(h*.26,w*.46);
  for(let i=0;i<5;i++){
   const x=wide?w*(.13+i*.185):w*(i<3?.18+i*.32:.34+(i-3)*.32),feet=wide?h*.81:(i<3?h*.54:h*.84);
   const phase=(this.motion+i*.09)%.65,frame=phase>.29&&phase<.45?1:0;
   const [left,top,right,bottom]=FinalApplause.bounds[frame][i],scale=body/(bottom-top),sx=Math.round(i*cast.naturalWidth/5),sw=Math.round((i+1)*cast.naturalWidth/5)-sx,sh=cast.naturalHeight/2;
   c.save();c.globalAlpha=Math.min(1,t/1.1);c.fillStyle='#1b355733';c.beginPath();c.ellipse(x,feet,body*.18,body*.026,0,0,Math.PI*2);c.fill();
   c.drawImage(cast,sx,frame*sh,sw,sh,x-(left+right)/2*scale,feet-bottom*scale,sw*scale,sh*scale);
   c.fillStyle='#172943';c.textAlign='center';c.font=`bold ${Math.max(11,Math.min(18,body*.07))}px Georgia`;c.fillText(FinalApplause.names[i],x,feet+body*.07);c.restore();
  }
  for(let i=0;i<45;i++){const x=(i*.618+Math.sin(this.motion+i)*.006)%1*w,y=(i*.17+this.motion*.037)%1*h;c.fillStyle=['#eaca72','#c692cf','#89d9c5'][i%3];c.fillRect(x,y,3,6);}
  const en=I18n.lang==='en',messages=en?['Congratulations!','You kept trying. You learned. You made it.','From all of us: congratulations!']:['¡Felicidades!','Lo intentaste. Aprendiste. Lo lograste.','De parte de todos: ¡felicidades!'];
  c.textAlign='center';c.font=`bold ${Math.min(w*.06,h*.075)}px Georgia`;c.lineWidth=5;c.strokeStyle='#142c4c';c.fillStyle='#fff5d9';const title=messages[Math.min(2,Math.floor(t/6))];
  // Fit the longer line on phones as well as landscape tablets.
  if(c.measureText(title).width>w*.9)c.font=`bold ${Math.min(w*.06,h*.075)*w*.9/c.measureText(title).width}px Georgia`;
  c.strokeText(title,w*.5,h*.16);c.fillText(title,w*.5,h*.16);
  c.font=`${Math.min(w*.04,h*.032)}px Georgia`;c.fillStyle='#223653';c.fillText('AVENTURA EPIK · IGNITIA',w*.5,h*.23);
  if(t<.7){c.fillStyle=`rgba(8,19,34,${1-t/.7})`;c.fillRect(0,0,w,h);}
  return en?'A final round of applause for your effort.':'Un último aplauso para reconocer tu esfuerzo.';
 }
};
