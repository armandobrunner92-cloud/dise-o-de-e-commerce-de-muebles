const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const P=[{id:1,s:12,i:"img/mesa-ratona.jpg",n:"Mesa ratona de pino",p:38000,m:"90 × 50 × 45 cm",w:"pino"},{id:2,s:30,i:"img/silla-eucalipto.jpg",n:"Silla de eucalipto",p:24000,m:"45 × 50 × 90 cm",w:"eucalipto"},{id:3,s:8,i:"img/estante-5-repisas.jpg",n:"Estante de 5 repisas",p:52000,m:"80 × 30 × 180 cm",w:"pino"},{id:4,s:5,i:"img/cama-1-plaza-y-media.jpg",n:"Cama de 1½ plaza",p:98000,m:"190 × 100 × 40 cm",w:"pino"},{id:5,s:4,i:"img/mesa-comedor.jpg",n:"Mesa de comedor (6 personas)",p:145000,m:"160 × 80 × 75 cm",w:"eucalipto"},{id:6,s:15,i:"img/mesa-de-luz.jpg",n:"Mesa de luz",p:29000,m:"40 × 35 × 50 cm",w:"pino"}];
const Z=[["Retiro en fábrica",0],["Zona 1 · cerca de la planta",6000],["Zona 2",12000],["Zona 3",20000]];
const R=["Ninguno","Mueblería A","Mueblería B","Mueblería C"];
const money=n=>"$ "+n.toLocaleString("es-AR");
const cot=p=>{const d=p.m.split(" × ");return `<i class="cx">${d[0]} cm</i><i class="cy">${parseInt(d[2])} cm</i>`};
const dueno=()=>document.body.classList.contains("dueno");
const IC=['<rect x="8" y="24" width="48" height="7" rx="2"/><path d="M14 31v18M50 31v18M8 40h48"/>','<path d="M20 10v28h24V10"/><path d="M16 38h32M20 38v16M44 38v16"/>','<rect x="14" y="8" width="36" height="48" rx="2"/><path d="M14 20h36M14 32h36M14 44h36"/>','<path d="M6 48V20M58 48V32M6 38h52"/><rect x="12" y="26" width="14" height="10" rx="3"/><path d="M26 32h32v6"/>','<rect x="6" y="22" width="52" height="6" rx="2"/><path d="M12 28v22M52 28v22M24 28v14M40 28v14"/>','<rect x="16" y="14" width="32" height="38" rx="2"/><path d="M16 30h32M28 22h8M28 40h8"/>'];
const ic=id=>`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${IC[id-1]}</svg>`;
let cart={},orders=[],bot={q:0,h:0};
const slots=[];for(let d=2;d<=4;d++){const s=new Date(Date.now()+d*864e5).toLocaleDateString("es-AR",{weekday:"short",day:"2-digit",month:"2-digit"});slots.push(s+" · mañana (8 a 12 h)",s+" · tarde (14 a 18 h)")}
function go(n){$$(".sec").forEach((s,i)=>s.hidden=i!=n);$$(".tab").forEach((t,i)=>t.classList.toggle("on",i==n))}
function shop(){$("#grid").innerHTML=P.map(p=>{const l=p.s-(cart[p.id]||0);return `<div class="pc ${p.w}"><div class="ph"><img src="${p.i}" alt="${p.n}" loading="lazy" onerror="this.remove()">${ic(p.id)}${cot(p)}<span class="bd ${l<1?"low":l<=3?"mid":"ok"}">${l<1?"Sin stock":l<=3?"Quedan "+l:"Disponible"}</span></div><b>${p.n}</b><small>${p.w} · ${p.m}</small><div class="pr">${money(p.p)}</div><button onclick="add(${p.id})" ${l<1?"disabled":""}>${l<1?"Sin stock":"Agregar"}</button></div>`}).join("")}shop();
$("#zn").innerHTML=Z.map((z,i)=>`<option value="${i}">${z[0]}${z[1]?" (+"+money(z[1])+")":""}</option>`).join("");
$("#sl").innerHTML=slots.map(s=>`<option>${s}</option>`).join("");
$("#rf").innerHTML=R.map((r,i)=>`<option value="${i}">${r}</option>`).join("");
$("#qs").innerHTML=R.slice(1).map((r,i)=>`<option value="${i}">${r}</option>`).join("");
function add(id){const p=P.find(x=>x.id==id);if((cart[id]||0)>=p.s)return toast("No hay más stock de "+p.n);cart[id]=(cart[id]||0)+1;shop();drawCart()}
function rm(id){if(--cart[id]<=0)delete cart[id];shop();drawCart()}
const sub=()=>Object.entries(cart).reduce((a,[i,q])=>a+P.find(x=>x.id==i).p*q,0);
function drawCart(){const e=Object.entries(cart);
$("#cl").innerHTML=e.length?e.map(([i,q])=>{const p=P.find(x=>x.id==i);return `<div class="ln"><span>${p.n} × ${q}</span><span>${money(p.p*q)} <button class="mini" onclick="rm(${i})">−</button></span></div>`}).join(""):"<small>Tu carrito está vacío.</small>";
$("#tot").textContent=money(e.length?sub()+Z[$("#zn").value][1]:0);$("#ok").disabled=!e.length||!$("#nm").value.trim()}
$("#ok").onclick=()=>{const it=Object.entries(cart).map(([i,q])=>({p:P.find(x=>x.id==i),q}));
const o={nm:$("#nm").value.trim().replace(/</g,"&lt;"),zn:Z[$("#zn").value][0],sl:$("#sl").value,rf:$("#rf").value=="0"?"":R[$("#rf").value],tot:sub()+Z[$("#zn").value][1],u:it.reduce((a,x)=>a+x.q,0),it:it.map(x=>({id:x.p.id,q:x.q}))};
cart={};$("#nm").value="";drawCart();place(o)};
function demo(){if(P[0].s<1)return toast("Sin stock de la mesa ratona: reponga en Panel y QR > Inventario");place({nm:"Cliente de ejemplo",zn:Z[1][0],sl:slots[0],rf:"Mueblería A",tot:P[0].p+Z[1][1],u:1,it:[{id:1,q:1}]})}
function place(o){o.id="MN-"+(1001+orders.length);o.st="Pedido recibido";orders.push(o);o.it.forEach(x=>P.find(p=>p.id==x.id).s-=x.q);shop();dueno()?go(1):toast("¡Pedido confirmado! "+o.id+" · te avisamos la entrega por WhatsApp");flow(o);panel()}
function flow(o){const S=["Webhook: pedido "+o.id+" recibido desde la tienda","Validar y descontar stock: "+o.it.map(x=>{const p=P.find(q=>q.id==x.id);return p.n+" × "+x.q+" (quedan "+p.s+")"}).join(", ")+(o.it.some(x=>P.find(q=>q.id==x.id).s<=3)?" · alerta de stock bajo":""),"Avisar a producción y despacho","Confirmar al cliente por WhatsApp (ManyChat)","Agendar entrega: "+o.zn+" · "+o.sl,"Registrar en el panel de KPIs"+(o.rf?" y comisión para "+o.rf:"")];
$("#fl").innerHTML=S.map((s,i)=>`<div class="nd" id="n${i}"><i>${i+1}</i><span>${s}</span></div>`).join("");$("#wa").hidden=true;
S.forEach((_,i)=>setTimeout(()=>{$("#n"+i).classList.add("on");if(i==3){$("#wa").innerHTML="<small>Mensaje al cliente</small><br>Hola "+o.nm+", recibimos tu pedido "+o.id+" por "+money(o.tot)+". Entrega: "+o.sl+" ("+o.zn+"). Respondé este mensaje si necesitás cambiar la franja.";$("#wa").hidden=false}},600*(i+1)));
setTimeout(()=>{o.st="Despacho programado";panel()},600*7)}
function say(t,me){const d=document.createElement("div");d.className="b "+(me?"me":"bt");d.innerHTML=t;$("#ch").append(d);$("#ch").scrollTop=1e9}
const Q=[["catalogo","Ver catálogo"],["medidas","Medidas"],["envio","Costo de envío"],["pedido","Estado de mi pedido"],["humano","Hablar con una persona"]];
$("#qr").innerHTML=Q.map(([k,l])=>`<button class="chip" onclick="ask('${k}','${l}')">${l}</button>`).join("");
const ans={catalogo:()=>P.map(p=>`• ${p.n}: ${money(p.p)}`).join("<br>"),medidas:()=>P.map(p=>`• ${p.n}: ${p.m}`).join("<br>"),
envio:()=>Z.map(z=>`• ${z[0]}: ${z[1]?money(z[1]):"sin costo"}`).join("<br>")+"<br>Elegís fecha y franja al comprar.",
pedido:()=>{const o=orders[orders.length-1];return o?`Tu pedido ${o.id}: ${o.st}. Entrega: ${o.sl}.`:"Todavía no tenés pedidos. Podés hacerlo en la pestaña Tienda."},
humano:()=>{bot.h++;return "Te derivo con una persona del equipo. Te responden en horario comercial."}};
say("¡Hola! Soy el asistente de Fábrica a tu Casa. ¿En qué te ayudo?");
function ask(k,l){bot.q++;say(l,1);setTimeout(()=>{say(ans[k]());panel()},350)}
function free(){const v=$("#in").value.trim();if(!v)return;$("#in").value="";
const k=/cat|mueble|precio/i.test(v)?"catalogo":/medida|tama/i.test(v)?"medidas":/env|entrega|flete/i.test(v)?"envio":/pedido|estado|segui/i.test(v)?"pedido":/persona|humano|asesor/i.test(v)?"humano":"";
bot.q++;say(v.replace(/</g,"&lt;"),1);setTimeout(()=>{say(k?ans[k]():"No te entendí del todo. Elegí una de las opciones de abajo.");panel()},350)}
function dl(i,v){orders[i].d=v;panel()}
function panel(){inv();const u=orders.reduce((a,o)=>a+o.u,0),sh=u/(u+90)*100,dn=orders.filter(o=>o.d=="ok").length,lt=orders.filter(o=>o.d=="late").length,ot=dn+lt?dn/(dn+lt)*100:null,rf=orders.filter(o=>o.rf);
const st=r=>r==null?["no","Sin datos"]:r>=1?["ok","En meta"]:["mid","En camino"];
const K=[["Venta directa",sh.toFixed(1)+"%",u?sh/10:null,"Meta: 10% de las unidades","Qué mide: qué parte de las unidades se vende sin pasar por un revendedor.","Cómo se calcula: unidades de la tienda ÷ (unidades de la tienda + 90 de base de revendedores)."],
["Entregas en fecha",ot==null?"—":ot.toFixed(0)+"%",ot==null?null:ot/90,"Meta: 90% en fecha y franja","Qué mide: si el pedido llega el día y en la franja prometidos.","Cómo se calcula: entregas en fecha ÷ entregas realizadas (marcalas en la tabla de pedidos)."],
["Respuesta rápida","< 1 min",bot.q?1:null,"Meta: menos de 5 minutos","Qué mide: cuánto espera el cliente una respuesta a su consulta.","Cómo se calcula: el asistente responde al instante. Consultas: "+bot.q+" · derivadas a una persona: "+bot.h+"."],
["Canal revendedores",rf.length+" referidos",rf.length?1:null,"Meta: caída máxima de 5% en sus ventas","Qué mide: si la venta directa convive con los revendedores sin quitarles ventas.","Cómo se calcula: pedidos que llegan con el QR de un revendedor (cobra comisión). Falta comparar sus ventas con su base."]];
$("#k").innerHTML=K.map(([a,b,r,m,w,x])=>{const s=st(r);return `<div class="kc ${s[0]}"><div class="kh"><small>${a}</small><span class="bd ${s[0]}">${s[1]}</span></div><div class="ring" style="--p:${r==null?0:Math.min(100,r*100)}"><strong>${b}</strong></div><small><b>${m}</b></small><details><summary>¿Qué mide?</summary><p class="kx">${w}</p><p class="kx">${x}</p></details></div>`}).join("");
$("#ot").innerHTML=orders.length?orders.map((o,i)=>`<tr><td>${o.id}</td><td>${o.nm}</td><td>${money(o.tot)}</td><td>${o.d=="ok"?"Entregado en fecha":o.d=="late"?"Entregado con demora":o.st}</td><td>${o.d?"":`<button class="mini" onclick="dl(${i},'ok')">En fecha</button> <button class="mini" onclick="dl(${i},'late')">Con demora</button>`}</td></tr>`).join(""):`<tr><td colspan="5"><small>Sin pedidos todavía.</small></td></tr>`;
$("#cm").innerHTML=R.slice(1).map(r=>{const f=rf.filter(o=>o.rf==r);return `<tr><td>${r}</td><td>${f.length}</td><td>${money(Math.round(f.reduce((a,o)=>a+o.tot,0)*.05))}</td></tr>`}).join("")}
function qrdraw(i){const n=21;let x=i*7+3,s=`<svg viewBox="0 0 ${n} ${n}" width="140" height="140" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/>`;
const f=(a,b)=>`<path fill="#2A1C10" d="M${a} ${b}h7v7h-7z"/><path fill="#fff" d="M${a+1} ${b+1}h5v5h-5z"/><path fill="#2A1C10" d="M${a+2} ${b+2}h3v3h-3z"/>`;s+=f(0,0)+f(14,0)+f(0,14);
for(let y=0;y<n;y++)for(let c=0;c<n;c++){if((c<8&&y<8)||(c>12&&y<8)||(c<8&&y>12))continue;x=(Math.imul(x,1103515245)+12345)&0x7fffffff;if(x%3==0)s+=`<rect x="${c}" y="${y}" width="1" height="1" fill="#2A1C10"/>`}return s+"</svg>"}
function qrshow(){const i=+$("#qs").value;$("#qi").innerHTML=qrdraw(i);$("#qu").textContent="tienda.ejemplo/r/"+R[i+1].toLowerCase().replace(/ /g,"-").normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
$("#qs").onchange=qrshow;qrshow();drawCart();panel();
$("#fab").onclick=()=>{$("#cw").hidden=!$("#cw").hidden;if(!$("#cw").hidden)$("#in").focus()};
$("#cx").onclick=()=>{$("#cw").hidden=true};
function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2400)}
function rs(id){P.find(p=>p.id==id).s+=10;panel();shop();toast("Stock repuesto: +10 unidades")}
function inv(){const lo=P.filter(p=>p.s<=3).length;$("#sa").textContent=lo?" · "+lo+" con stock bajo":"";$("#inv").innerHTML=P.map(p=>{const k=p.s<1?["low","Sin stock"]:p.s<=3?["mid","Stock bajo"]:["ok","Normal"];return `<tr><td>${p.n}</td><td><b>${p.s}</b> u.</td><td><span class="bd ${k[0]}">${k[1]}</span></td><td><button class="mini" onclick="rs(${p.id})">Reponer +10</button></td></tr>`}).join("")}

/* ---- App móvil ---- */
let mv="home",mf="todos",nogo=0;
const NAV=[["home","Inicio",'<path d="M3 11l9-8 9 8v10H3z"/>'],["cart","Carrito",'<path d="M5 7h14l-1.5 11h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/>'],["track","Mi pedido",'<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>']];
const _go=go;go=function(n){if(!nogo)_go(n)};
const _add=add;add=function(id){_add(id);mob()};
const _rm=rm;rm=function(id){_rm(id);mob()};
const _pl=place;place=function(o){_pl(o);mob()};
const _rs=rs;rs=function(id){_rs(id);mob()};
function mgo(v){mv=v;mob()}
function setF(f){mf=f;mob()}
function buy(){const it=Object.entries(cart).map(([i,q])=>({id:+i,q})),zi=$("#mz").value,o={nm:($("#mn").value.trim()||"Cliente de la app").replace(/</g,"&lt;"),zn:Z[zi][0],sl:$("#ms").value,rf:"",tot:sub()+Z[zi][1],u:it.reduce((a,x)=>a+x.q,0),it,mv:1,sp:1};cart={};drawCart();nogo=1;place(o);nogo=0;mv="track";mob()}
function adv(){const o=orders.filter(x=>x.mv).pop();if(o.sp<4){o.sp++;o.st=["","","En producción","En camino","Entregado"][o.sp];if(o.sp==4)o.d="ok"}panel();mob()}
function mob(){const sc=$("#ap").scrollTop,n=Object.values(cart).reduce((a,b)=>a+b,0),o=orders.filter(x=>x.mv).pop();let h="";
if(mv=="home")h=`<div class="ah"><small>Maderas del Norte</small><b>Muebles directo de fábrica</b></div><div>${["todos","pino","eucalipto"].map(f=>`<button class="chip ${mf==f?"on":""}" onclick="setF('${f}')">${f[0].toUpperCase()+f.slice(1)}</button>`).join("")}</div>`+P.filter(p=>mf=="todos"||p.w==mf).map(p=>{const l=p.s-(cart[p.id]||0);return `<div class="mi ${p.w}"><div class="mp">${ic(p.id)}<img src="${p.i}" alt="" onerror="this.remove()"></div><div><b>${p.n}</b><small>${p.m}</small><div class="pr">${money(p.p)}</div></div><button class="ma" onclick="add(${p.id})" ${l<1?"disabled":""}>${l<1?"Agotado":"Agregar"}</button></div>`}).join("")+(n?`<button class="go wide" onclick="mgo('cart')">Continuar con mi pedido (${n})</button>`:`<p class="mt">Tocá <b>Agregar</b> en los muebles que quieras y seguí con tu pedido.</p>`);
else if(mv=="cart"){const it=Object.entries(cart);h=`<div class="ah"><b>Tu carrito</b><small>Revisá, completá tus datos y confirmá</small></div>`+(it.length?it.map(([i,q])=>{const p=P.find(x=>x.id==i);return `<div class="ml"><span>${p.n} × ${q}</span><span>${money(p.p*q)} <button class="mini" onclick="rm(${i})">−</button></span></div>`}).join("")+`<label>Nombre</label><input id="mn" placeholder="Tu nombre"><label>Zona de entrega</label><select id="mz" onchange="$('#mt').textContent=money(sub()+Z[this.value][1])">${Z.map((z,i)=>`<option value="${i}">${z[0]}</option>`).join("")}</select><label>Fecha y franja</label><select id="ms">${slots.map(s=>`<option>${s}</option>`).join("")}</select><div class="tot"><span>Total</span><span id="mt">${money(sub())}</span></div><button class="go wide" onclick="buy()">Confirmar pedido</button>`:`<p class="mt">Tu carrito está vacío.</p><button class="go wide" onclick="mgo('home')">Elegir muebles</button>`)}
else h=`<div class="ah"><b>${o?"Pedido "+o.id:"Mi pedido"}</b><small>${o?o.zn+" · "+o.sl:"Seguimiento de entrega"}</small></div>`+(o?`<div class="nt">Mensaje de WhatsApp: tu entrega está programada para ${o.sl}.</div>`+["Pedido recibido","Stock confirmado","En producción","En camino","Entregado"].map((s,i)=>`<div class="ts ${i<=o.sp?"on":""}"><i></i><span>${s}</span></div>`).join("")+(o.sp<4?`<button class="go wide" onclick="adv()">Avanzar estado (demo)</button>`:`<p class="mt">Entregado en la fecha acordada.</p>`):`<p class="mt">Todavía no hiciste pedidos desde la app.</p><button class="go wide" onclick="mgo('home')">Elegir muebles</button>`);
$("#ap").innerHTML=h;$("#ap").scrollTop=sc;const si={home:0,cart:1,track:2}[mv];$("#st").innerHTML=["Elegí","Confirmá","Seguí"].map((s,i)=>`<span class="${i==si?"on":i<si?"dn":""}"><i>${i<si?"✓":i+1}</i>${s}</span>`).join("");
$("#tb").innerHTML=NAV.map(([k,l,d])=>`<button class="${mv==k?"on":""}" onclick="mgo('${k}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg><span>${l}${k=="cart"&&n?" ("+n+")":""}</span></button>`).join("")}
mob();
function mode(d){document.body.classList.toggle("dueno",d);$("#md").textContent=d?"Salir de la vista del dueño":"Ingresar como dueño";$("#cw").hidden=true;go(d?2:0)}
$("#md").onclick=()=>mode(!dueno());
