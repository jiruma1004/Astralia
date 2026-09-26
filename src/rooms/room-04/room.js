// Un respiro entre el laberinto y las salas finales del castillo.
window.ESCAPE_ROOMS=window.ESCAPE_ROOMS||[];
window.ESCAPE_ROOMS.push({
 id:'room-04',name:'El corredor de las ideas',color:[121,112,94],
 environment:{kind:'interior',label:'Camino a la sala principal',tint:'#675333',portraits:['tesla','curie']},
 spawn:{x:2.5,y:4.5,angle:0},exitX:29.65,corridor:true,oakDoor:{x:29,y:4},
 challenge:{id:'challenge-04',title:'Salta, esquiva y respira',implemented:true},
 canUnlock(context){return context.ready===true;},
 map:Array.from({length:9},(_,y)=>Array.from({length:32},(_,x)=>x===0||x===31||y===0||y===8||x===29?(x===29&&y===4?2:1):0))
});
