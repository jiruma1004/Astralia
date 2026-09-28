// Retrato A: habla por sílabas y vuelve a una pose estable al terminar el texto.
window.PaolaPortrait={
 draw(canvas,image,speaking,time=0){
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  c.clearRect(0,0,w,h);if(!image.complete||!image.naturalWidth)return;
  const frame=speaking?[0,1,1,0,1,0][Math.floor(time/.11)%6]:0;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const bob=speaking&&!reduced?Math.sin(time*7)*h*.006:0;
  const tilt=speaking&&!reduced?Math.sin(time*3.5)*.008:0;
  canvas.dataset.frame=String(frame);canvas.dataset.speaking=String(speaking);
  c.save();c.imageSmoothingEnabled=false;c.translate(w/2,h/2+bob);c.rotate(tilt);
  const fw=image.naturalWidth/2;c.drawImage(image,frame*fw,0,fw,image.naturalHeight,-w*.48,-h*.48,w*.96,h*.96);c.restore();
 }
};
