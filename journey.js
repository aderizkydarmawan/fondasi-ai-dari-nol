/* Perjalanan di beranda: empat bentuk partikel 3D yang muncul, diam, lalu meledak melewati kamera saat di-scroll. */
(function(){
  var BAB = [
    {lab:'Bab 0 · Akal sehat', h:'Semua berawal dari <em>angka</em>', p:'Garis bilangan, tambah-kurang, kali-bagi, pecahan, dan pangkat. AI hanya mengulang operasi ini miliaran kali.', href:'#p0-1', go:'Mulai di Lapis 0', col:[201,184,255], col2:[127,216,242]},
    {lab:'Bab 1 · Aljabar', h:'Titik-titik mencari <em>garis</em>', p:'Data berserakan, lalu satu garis y = mx + b merangkum polanya. Inilah regresi linear, model paling sederhana dalam AI.', href:'#p1-1', go:'Mulai di Lapis 1', col:[127,216,242]},
    {lab:'Bab 2 · Statistika', h:'Ketidakpastian punya <em>bentuk</em>', p:'Banyak hal acak menumpuk menjadi kurva lonceng. Distribusi normal adalah cara AI bicara soal “mungkin”.', href:'#peta', go:'Lihat di peta (Lapis 2)', col:[201,184,255]},
    {lab:'Bab 3 · Jaringan saraf', h:'Neuron kecil, <em>jaringan</em> besar', p:'Setiap neuron hanya menghitung σ(Wx + b). Disusun berlapis-lapis, mereka bisa mengenali wajah dan menulis kalimat.', href:'#peta', go:'Lihat di peta (Lapis 3)', col:[127,216,242], col2:[201,184,255]},
    {lab:'Bab 4 · Belajar', h:'Menggelinding ke <em>dasar</em>', p:'Model belajar dengan menuruni lembah galat, selangkah demi selangkah: θ − η∇L. Itulah gradient descent.', href:'#peta', go:'Lihat di peta (Lapis 3)', col:[201,184,255], col2:[255,210,140]}
  ];
  function rnd(a){ return (Math.random()-.5)*a; }
  function shapes(){
    var S = [], a, i, j, x, y;
    // 0. garis bilangan: sumbu, garis tick, dan titik-titik yang berkumpul di bilangan bulat
    a = []; for(i=0;i<1400;i++){ x = -1.6 + i/1400*3.2; a.push([x, 0, rnd(.02), 0]); }
    for(j=-4;j<=4;j++){ for(i=0;i<70;i++) a.push([j*.38, -.12 + i/70*.24, rnd(.02), 1]); for(i=0;i<120;i++) a.push([j*.38 + rnd(.06), .32 + Math.abs(j)*.05 + rnd(.06), rnd(.06), 1]); }
    S.push({pts:a});
    // 1. garis regresi + titik data
    a = []; for(i=0;i<1800;i++){ x = rnd(2.4); a.push([x, .55*x + rnd(.5)*Math.abs(rnd(2)), rnd(.5), 0]); }
    for(i=0;i<1100;i++){ x = -1.3 + i/1100*2.6; a.push([x, .55*x, rnd(.03), 1]); }
    S.push({pts:a});
    // 2. permukaan lonceng 2D
    a = []; for(i=0;i<72;i++) for(j=0;j<72;j++){ x = -1.25 + i/71*2.5; var z = -1.25 + j/71*2.5; a.push([x, 1.3*Math.exp(-(x*x+z*z)/.5) - .5, z, (i%8===0||j%8===0)?1:0]); }
    S.push({pts:a});
    // 3. jaringan saraf: lapisan 4-7-7-3
    var L = [4,7,7,3], nodes = []; a = [];
    L.forEach(function(n, li){ for(i=0;i<n;i++){ var nd = [-1.5 + li, (i-(n-1)/2)*.36, rnd(.3)]; nodes.push(nd.concat(li)); for(j=0;j<80;j++) a.push([nd[0]+rnd(.09), nd[1]+rnd(.09), nd[2]+rnd(.09), 1]); } });
    var edges = []; nodes.forEach(function(p){ nodes.forEach(function(q){ if(q[3] === p[3]+1) edges.push([p,q]); }); });
    edges.forEach(function(e){ for(j=0;j<16;j++){ var t = Math.random(); a.push([e[0][0]+(e[1][0]-e[0][0])*t, e[0][1]+(e[1][1]-e[0][1])*t, e[0][2]+(e[1][2]-e[0][2])*t, 0]); } });
    S.push({pts:a, edges:edges});
    // 4. lembah galat + jejak bola
    a = []; for(i=0;i<68;i++) for(j=0;j<68;j++){ x = -1.5 + i/67*3; var z2 = -1.5 + j/67*3; a.push([x, .5*(x*x + .6*z2*z2) + .08*Math.sin(4*x)*Math.cos(3*z2) - .8, z2, 0]); }
    var trail = []; x = 1.35; var zz = -1.2;
    for(i=0;i<40;i++){ trail.push([x, .5*(x*x + .6*zz*zz) + .08*Math.sin(4*x)*Math.cos(3*zz) - .74, zz]); x -= .12*x; zz -= .12*.6*zz; }
    trail.forEach(function(t){ for(j=0;j<10;j++) a.push([t[0]+rnd(.03), t[1]+rnd(.03), t[2]+rnd(.03), 1]); });
    S.push({pts:a, trail:trail});
    return S;
  }
  function ease(t){ return t<0?0:t>1?1:t*t*(3-2*t); }

  window.journey = function(sec, mouse, dpr, RM){
    var cv = sec.querySelector('canvas'), cx = cv.getContext('2d'), panels = sec.querySelectorAll('.jp'), dots = sec.querySelectorAll('.jdots i');
    var S = shapes(), dust = [], W, H, alive = true, vis = true, cur = -1, t = 0;
    for(var i=0;i<1400;i++){ var u = Math.random()*2-1, ph = Math.random()*6.283, r = 2.2 + Math.random()*2.5, q = Math.sqrt(1-u*u); dust.push([q*Math.cos(ph)*r, u*r, q*Math.sin(ph)*r, Math.random()*6.283]); }
    function size(){ W = cv.clientWidth; H = cv.clientHeight; cv.width = W*dpr; cv.height = H*dpr; }
    function prog(){ var r = sec.getBoundingClientRect(), tot = r.height - innerHeight; return Math.max(0, Math.min(.9999, -r.top / tot)) * BAB.length; }
    function setPanel(k){ if(k === cur) return; cur = k; [].forEach.call(panels, function(p, i){ p.classList.toggle('on', i === k); p.setAttribute('aria-hidden', i === k ? 'false' : 'true'); }); [].forEach.call(dots, function(d, i){ d.classList.toggle('on', i === k); }); }
    function proj(p, rot, sc, wide){
      var c = Math.cos(rot), s = Math.sin(rot), x = p[0]*c - p[2]*s, z = p[0]*s + p[2]*c, y = p[1];
      var ct = Math.cos(.35), st = Math.sin(.35), y2 = y*ct - z*st, z2 = y*st + z*ct;
      x *= sc; y2 *= sc; z2 *= sc;
      var cam = 4.2 - z2; if(cam < .15) return null;
      var f = Math.min(W, H*1.25) * (wide ? .26 : .22) * 4.2 / cam;
      return [ (wide ? W*.66 : W*.5) + x*f, (wide ? H*.5 : H*.36) - y2*f, cam ];
    }
    function push(pt){
      var dx = pt[0] - mouse.mx, dy = pt[1] - mouse.my, d = Math.sqrt(dx*dx + dy*dy) || 1, R = 140;
      if(d < R){ var k = (R-d)/R * 34 * (1 + .35*Math.sin(d*.08 - t*.006)); pt[0] += dx/d*k; pt[1] += dy/d*k; }
    }
    function drawShape(k, f, rot, wide){
      if(k < 0 || k >= S.length) return;
      // tumbuh dari kecil (f<.22), diam, lalu meledak melewati kamera (f>.78)
      var sc = f < .22 ? .15 + .85*ease(f/.22) : f > .78 ? 1 + Math.pow((f-.78)/.22, 2)*5 : 1;
      var al = f < .22 ? ease(f/.22) : f > .78 ? 1 - ease((f-.78)/.22) : 1;
      if(al <= .01) return;
      var b = BAB[k], c1 = b.col, c2 = b.col2 || b.col, sh = S[k], pr = [];
      if(sh.edges){
        cx.strokeStyle = 'rgba('+c2+','+(.13*al)+')'; cx.lineWidth = 1; cx.beginPath();
        sh.edges.forEach(function(e){ var a = proj(e[0], rot, sc, wide), z = proj(e[1], rot, sc, wide); if(a && z){ push(a); push(z); cx.moveTo(a[0], a[1]); cx.lineTo(z[0], z[1]); } });
        cx.stroke();
      }
      sh.pts.forEach(function(p){
        var q = proj(p, rot, sc, wide); if(!q) return; push(q);
        var sz = Math.max(.9, 5/q[2]) * (p[3] ? 1.15 : .8), c = p[3] ? c2 : c1;
        cx.fillStyle = 'rgba('+c+','+(al*(p[3] ? .85 : .5))+')'; cx.fillRect(q[0], q[1], sz, sz);
      });
      if(sh.trail){
        var n = Math.floor(((t*.0004) % 1) * sh.trail.length), q = proj(sh.trail[n], rot, sc, wide);
        if(q){ push(q); var g = cx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 26/q[2]*4.2); g.addColorStop(0, 'rgba(255,230,180,'+al+')'); g.addColorStop(1, 'rgba(255,190,120,0)'); cx.fillStyle = g; cx.fillRect(q[0]-40, q[1]-40, 80, 80); }
      }
    }
    function frame(tm){
      if(!alive) return;
      if(vis){
        t = tm || 0;
        var P = prog(), k = Math.floor(P), f = P - k, wide = W > 900, rot = .35*Math.sin(t*.00025) + (f-.5)*.5;
        setPanel(k);
        var r = cv.getBoundingClientRect(); mouse.mx = mouse.x - r.left; mouse.my = mouse.y - r.top;
        cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,W,H); cx.globalCompositeOperation = 'lighter';
        // debu bola, warnanya ikut bab
        var dc = BAB[k].col;
        dust.forEach(function(d){
          var w = d[3] + t*.0004, p = [d[0] + .12*Math.sin(w), d[1] + .12*Math.cos(w*1.3), d[2] + .12*Math.sin(w*.7)];
          var q = proj(p, rot*.4, 1, wide); if(!q) return; push(q);
          cx.fillStyle = 'rgba('+dc+',.22)'; cx.fillRect(q[0], q[1], 1.3, 1.3);
        });
        drawShape(k, f, rot, wide);
        if(f > .7) drawShape(k+1, (f-.7)/.3*.22, rot, wide);
        cx.globalCompositeOperation = 'source-over';
      }
      if(!RM) requestAnimationFrame(frame);
    }
    size();
    var onR = function(){ size(); if(RM) frame(0); }, onS = function(){ if(RM) frame(0); };
    var io = new IntersectionObserver(function(e){ vis = e[0].isIntersecting; }); io.observe(sec);
    var onV = function(){ vis = !document.hidden; };
    window.addEventListener('resize', onR); window.addEventListener('scroll', onS, {passive:true}); document.addEventListener('visibilitychange', onV);
    requestAnimationFrame(frame);
    return function(){ alive = false; io.disconnect(); window.removeEventListener('resize', onR); window.removeEventListener('scroll', onS); document.removeEventListener('visibilitychange', onV); };
  };

  window.journeyHTML = function(){
    return '<section class="journey" aria-label="Perjalanan singkat: dari angka sampai belajar"><div class="jstick"><canvas aria-hidden="true"></canvas>'+
      BAB.map(function(b, i){ return '<div class="jp'+(i===0?' on':'')+'" aria-hidden="'+(i===0?'false':'true')+'"><small>'+b.lab+'</small><h2>'+b.h+'</h2><p>'+b.p+'</p><a class="btn glow" href="'+b.href+'">'+b.go+' →</a></div>'; }).join('')+
      '<div class="jdots" aria-hidden="true">'+BAB.map(function(_, i){ return '<i'+(i===0?' class="on"':'')+'></i>'; }).join('')+'</div></div></section>';
  };
})();
