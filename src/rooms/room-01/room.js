window.ESCAPE_ROOMS = window.ESCAPE_ROOMS || [];
window.ESCAPE_ROOMS.push({
  id: 'room-01', name: 'El puente de Galileo', color: [77,92,148],
  environment:{kind:'forest',label:'Bosque del abismo',portraits:[]},
  calculationMode:true,
  spawn: {x:2.2,y:4.0,angle:0}, exitX:25.6, bridge:{start:6,end:21,y:3},
  challenge: {id:'challenge-01',title:'Tiro parabólico',implemented:true},
  physics: {maxDistance:43,maxEnergy:180,gravity:9.81,metersPerCell:2,originX:3.5,originY:3.5,height:1.2,targetX:13.5,targetHeight:1.2,tolerance:.5},
  canUnlock(context) {return context.targetHit===true;},
  map: Array.from({length:7},(_,y)=>Array.from({length:28},(_,x)=>{
    if(y===0||y===6||x===0||x===27)return 1;
    if(x===25)return y===3?2:1;
    if(x>=6&&x<21)return 3;
    return 0;
  }))
});
