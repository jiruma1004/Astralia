// Un respiro entre el laberinto y las salas finales del castillo.
window.CORRIDOR_LAVA={
 start:20,end:33,minY:1.7,maxY:7.3,
 // Dos recorridos laterales, con una isla central para cambiar de ruta.
 platforms:[
  {id:'L1',x:21.1,y:3.6,size:1.7},{id:'L2',x:23.8,y:2.75,size:1.7},{id:'L3',x:26.5,y:2.75,size:1.7},{id:'L4',x:29.2,y:3.3,size:1.7},
  {id:'R1',x:21.1,y:5.4,size:1.7},{id:'R2',x:23.8,y:6.25,size:1.7},{id:'R3',x:26.5,y:6.25,size:1.7},{id:'R4',x:29.2,y:5.7,size:1.7},
  {id:'cross',x:26.5,y:4.5,size:1.35},{id:'exit',x:31.9,y:4.5,size:1.9}],
 routes:[['L1','L2','L3','L4','exit'],['R1','R2','R3','R4','exit'],['L1','L2','L3','cross','R3','R4','exit']],
 contains(x,y){return x>=this.start&&x<this.end&&y>=this.minY&&y<=this.maxY;},
 platformAt(x,y){return this.platforms.find(p=>Math.abs(x-p.x)<=p.size/2&&Math.abs(y-p.y)<=p.size/2);},
 supports(x,y){return !this.contains(x,y)||!!this.platformAt(x,y);},
 color(x,y,time){
  const p=this.platformAt(x,y);
  if(p){const edge=Math.min(p.size/2-Math.abs(x-p.x),p.size/2-Math.abs(y-p.y));if(edge<.065)return '#bbaa7f';const seam=Math.abs((x-p.x)*2%1)<.035||Math.abs((y-p.y)*2%1)<.035;return seam?'#3a3d49':'#7b8391';}
  const wave=Math.sin(Math.floor(x*9)*1.3+Math.floor(y*11)*1.7+time*.0018)+Math.sin(x*4-y*7-time*.0008);
  return wave>1.25?'#ffe184':wave>.25?'#ff962e':wave>-.7?'#da461e':'#82251b';
 }
};
window.ESCAPE_ROOMS=window.ESCAPE_ROOMS||[];
window.ESCAPE_ROOMS.push({
 id:'room-04',name:'El corredor de las ideas',color:[121,112,94],
 environment:{kind:'courtyard',label:'Camino a la sala principal',tint:'#675333',portraits:['tesla','curie']},
 spawn:{x:2.9,y:4.5,angle:0},exitX:51.65,corridor:true,lava:window.CORRIDOR_LAVA,bounds:{minY:1.7,maxY:7.3},oakDoor:{x:51,y:4},
 challenge:{id:'challenge-04',title:'Salta, esquiva y respira',implemented:true},
 canUnlock(context){return context.ready===true;},
 map:Array.from({length:9},(_,y)=>Array.from({length:54},(_,x)=>x===0||x===53||y===0||y===8||x===51?(x===51&&y===4?2:1):0))
});
