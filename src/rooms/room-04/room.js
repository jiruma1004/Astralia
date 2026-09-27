// Un respiro entre el laberinto y las salas finales del castillo.
window.ESCAPE_ROOMS=window.ESCAPE_ROOMS||[];
window.ESCAPE_ROOMS.push({
 id:'room-04',name:'El corredor de las ideas',color:[121,112,94],
 environment:{kind:'courtyard',label:'Camino a la sala principal',tint:'#675333',portraits:['tesla','curie']},
 spawn:{x:2.5,y:4.5,angle:0},exitX:56.65,corridor:true,bounds:{minY:1.7,maxY:7.3},oakDoor:{x:56,y:4},
 challenge:{id:'challenge-04',title:'Salta, esquiva y respira',implemented:true},
 canUnlock(context){return context.ready===true;},
 map:Array.from({length:9},(_,y)=>Array.from({length:59},(_,x)=>x===0||x===58||y===0||y===8||x===56?(x===56&&y===4?2:1):0))
});
