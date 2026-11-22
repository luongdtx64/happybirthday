(function(){
var NS="http://www.w3.org/2000/svg",$=function(i){return document.getElementById(i)};
var pal=["#ff8fb1","#ffffff","#ffc9da","#e0457b","#fff0f5","#ff6f9c"];
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}

/* ---------- link encoding: JSON -> UTF-8 -> hex, a plain #name ---------- */
function enc(o){var b=new TextEncoder().encode(JSON.stringify(o)),s="";b.forEach(function(x){s+=("0"+x.toString(16)).slice(-2)});return s}
function dec(h){if(!/^[0-9a-f]+$/.test(h)||h.length%2)return null;try{var a=[];for(var i=0;i<h.length;i+=2)a.push(parseInt(h.substr(i,2),16));return JSON.parse(new TextDecoder().decode(new Uint8Array(a)))}catch(e){return null}}

/* ---------- candles ---------- */
var cg=$("candles"),cx=[110,145,180,215,250],cc=["#ffb3c9","#fff","#e0457b","#ffc9da","#fff"];
cx.forEach(function(x,i){
  el("rect",{x:x-4,y:96,width:8,height:42,rx:2,fill:cc[i],stroke:"#ff8fb1","stroke-width":1},cg);
  var f=el("g",{"class":"flame"},cg);
  el("path",{d:"M"+x+" 70c8 10 8 18 0 24c-8-6-8-14 0-24z",fill:"#ffb02e"},f);
  el("path",{d:"M"+x+" 80c4 5 4 9 0 12c-4-3-4-7 0-12z",fill:"#fff7c2"},f);
  el("path",{"class":"smoke",d:"M"+x+" 92c-6-10 6-14 0-24",stroke:"#c98aa2",fill:"none","stroke-width":2,"stroke-linecap":"round"},cg);
});

/* ---------- flowers ---------- */
var g=$("garden");
[[70,150,.8],[170,170,1],[270,140,.7],[370,175,1.1],[450,155,.8],[540,175,1.1],[640,140,.7],[730,170,1],[830,150,.8],[120,188,.55],[600,190,.55],[800,190,.55]].forEach(function(s,i){
  var x=s[0],top=s[1],sc=s[2],h=200-top,fl=el("g",{"class":"fl",style:"transition-delay:"+(i*.12)+"s"},g);
  el("path",{d:"M"+x+" 205Q"+(x+(i%2?10:-10))+" "+(205-h/2)+" "+x+" "+top,stroke:"#6fbf8f","stroke-width":4,fill:"none","stroke-linecap":"round"},fl);
  var lx=x+(i%2?-14:14),ly=top+h*.55;
  el("ellipse",{cx:lx,cy:ly,rx:12,ry:5,fill:"#6fbf8f",transform:"rotate("+(i%2?-30:30)+" "+lx+" "+ly+")"},fl);
  var col=pal[i%pal.length],hd=el("g",{transform:"translate("+x+" "+top+") scale("+sc+")"},fl);
  for(var k=0;k<8;k++)el("ellipse",{cx:0,cy:-17,rx:9,ry:16,fill:col,stroke:"#ff8fb1","stroke-width":1,transform:"rotate("+(k*45)+")"},hd);
  el("circle",{r:8,fill:"#ffd76a"},hd);
});

/* ---------- confetti ---------- */
var cv=$("cf"),ctx=cv.getContext("2d"),parts=[],raf=0,cols=["#ff8fb1","#e0457b","#ffc9da","#ffd76a","#ff6f9c"];
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener("resize",size);
function burst(){for(var i=0;i<140;i++)parts.push({x:innerWidth/2,y:innerHeight*.4,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,r:Math.random()*6+3,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.4,l:0});if(!raf)loop()}
function loop(){ctx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(function(p){return p.y<cv.height+20&&p.l<260});
  parts.forEach(function(p){p.l++;p.vy+=.3;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);ctx.restore()});
  raf=parts.length?requestAnimationFrame(loop):0}

/* ---------- Happy Birthday on Web Audio ---------- */
var AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function song(){
  var c=ac();if(!c)return;
  var N={G4:392,A4:440,B4:494,C5:523,D5:587,E5:659,F5:698,G5:784};
  var s=[["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
  var t=c.currentTime+.1,beat=.42;
  s.forEach(function(n){var o=c.createOscillator(),v=c.createGain();o.type="triangle";o.frequency.value=N[n[0]];
    var d=n[1]*beat;v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(.25,t+.03);v.gain.exponentialRampToValueAtTime(.001,t+d*.95);
    o.connect(v);v.connect(c.destination);o.start(t);o.stop(t+d);t+=d});
}

/* ---------- photos / slideshow ---------- */
var photos=[],caps=["Kỷ niệm đáng nhớ","Những ngày vui","Cùng nhau nhé","Nụ cười của bạn","Một năm mới","Mãi xinh tươi"],idx=0,timer=0;
function show(){var ph=$("ph");ph.innerHTML="";
  if(photos[idx]){var im=document.createElement("img");im.src=photos[idx];im.alt="Ảnh kỷ niệm";ph.appendChild(im)}else ph.textContent="🌸";
  $("cap").textContent=caps[idx%caps.length];$("pol").style.transform="rotate("+(idx%2?3:-3)+"deg)"}
function step(d){var n=Math.max(photos.length,caps.length);idx=(idx+d+n)%n;if(photos.length&&idx>=photos.length)idx=d>0?0:photos.length-1;show()}
$("prev").onclick=function(){step(-1)};$("next").onclick=function(){step(1)};
$("pics").addEventListener("change",function(e){photos=[];Array.prototype.slice.call(e.target.files,0,6).forEach(function(f){photos.push(URL.createObjectURL(f))});idx=0});

/* ---------- typewriter ---------- */
var tw=0;
function type(txt){var L=$("letter");clearInterval(tw);L.textContent="";L.classList.add("typing");var i=0;
  tw=setInterval(function(){L.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(tw);L.classList.remove("typing")}},48)}

/* ---------- main flow ---------- */
var data={n:"",w:""},blown=false,stream=null,mraf=0;
function wish(){var n=data.n||"bạn";return data.w||("Chúc "+n+" tuổi mới thật nhiều niềm vui, sức khỏe và mọi điều mình mong ước đều thành hiện thực. Hôm nay cứ thoải mái ăn bánh nhé!")}
function stopMic(){cancelAnimationFrame(mraf);if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}}
function blowOut(){
  if(blown)return;blown=true;stopMic();
  document.body.classList.add("out","bloom");$("after").classList.remove("hide");$("garden").classList.remove("hide");
  $("hint").classList.add("hide");$("meterbox").classList.add("hide");$("tap").classList.add("hide");
  burst();setTimeout(burst,600);song();type(wish());show();
  clearInterval(timer);timer=setInterval(function(){step(1)},4000);
}
function startMic(){
  var fallback=function(){$("hint").textContent="Không dùng được micro, hãy bấm nút bên dưới."};
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){fallback();return}
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(function(s){
    stream=s;var c=ac(),an=c.createAnalyser();an.fftSize=1024;c.createMediaStreamSource(s).connect(an);
    var buf=new Uint8Array(an.fftSize),hold=0;
    (function tick(){an.getByteTimeDomainData(buf);var sum=0;for(var i=0;i<buf.length;i++){var v=(buf[i]-128)/128;sum+=v*v}
      var r=Math.sqrt(sum/buf.length);$("meter").style.width=Math.min(100,r*500)+"%";
      hold=r>.1?hold+1:Math.max(0,hold-2);
      if(hold>25){blowOut();return}
      mraf=requestAnimationFrame(tick)})();
  }).catch(fallback);
}
function reset(){blown=false;stopMic();clearInterval(timer);clearInterval(tw);
  document.body.classList.remove("out","bloom");$("after").classList.add("hide");$("garden").classList.add("hide");
  $("hint").classList.remove("hide");$("meterbox").classList.remove("hide");$("tap").classList.remove("hide");$("hint").textContent="Hãy thổi vào micro để tắt nến.";$("meter").style.width="0";startMic()}
$("open").onclick=function(){ac();$("start").classList.add("hide");$("stage").classList.remove("hide");startMic()};
$("tap").onclick=blowOut;$("again").onclick=reset;

function route(){
  var h=location.hash.replace("#",""),d=h?dec(h):null;
  if(d){data=d;$("setup").classList.add("hide");$("gift").classList.remove("hide");
    $("title").textContent=data.n?"Chúc mừng sinh nhật, "+data.n+"!":"Chúc mừng sinh nhật!"}
  else{$("gift").classList.add("hide");$("setup").classList.remove("hide")}
}
function link(){var base=location.href.split("#")[0];return base+"#"+enc({n:$("n").value.trim(),w:$("w").value.trim()})}
$("make").onclick=function(){$("link").textContent=link();$("out").classList.remove("hide")};
$("preview").onclick=function(){location.hash=enc({n:$("n").value.trim(),w:$("w").value.trim()})};
$("copy").onclick=function(){var b=$("copy");try{navigator.clipboard.writeText(link()).then(function(){b.textContent="Đã sao chép"},function(){b.textContent="Hãy chọn và sao chép thủ công"})}catch(e){b.textContent="Hãy chọn và sao chép thủ công"}};
addEventListener("hashchange",function(){reset();route()});
route();show();
})();
