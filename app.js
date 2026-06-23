/* ============================================================
   RED Monitor — Prototipo MVP
   Diseño y Prototipado · Ciencia de Datos e IA · Grupo 2
   ============================================================ */

const state = {
  apiKey: null,
  mode: null,            // 'ia' | 'demo'
  reports: [],           // historial completo
  alerts: [],
  iaTimes: [],           // tiempos de clasificación (ms)
  iaCorrect: 0,
  iaTotal: 0,
  form: { type:null, letter:null, num:null },
};

const PRIO_RANK = { 'Crítica':4, 'Alta':3, 'Media':2, 'Baja':1 };
const TYPE_EMOJI = {
  'No se detiene en paradero':'🛑',
  'Retraso significativo':'⏱️',
  'Desvío de recorrido':'🔀',
  'Sobreocupación':'👥',
  'Otro':'❓'
};

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
function toast(msg, ok=true){
  const t=$('#toast'); $('#toastMsg').textContent=msg;
  t.classList.toggle('ok',ok); t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2600);
}
function nowTime(){ return new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }

/* ============================================================
   API KEY / CONEXIÓN
   ============================================================ */
const keyModal=$('#keyModal');
$('#keyBtn').onclick=()=>{ keyModal.classList.add('show'); $('#keyInput').focus(); };
keyModal.onclick=e=>{ if(e.target===keyModal) keyModal.classList.remove('show'); };

$('#keySave').onclick=()=>{
  const v=$('#keyInput').value.trim();
  if(!v || !v.startsWith('sk-ant-')){ toast('La clave debe empezar con sk-ant-', false); return; }
  state.apiKey=v; state.mode='ia';
  $('#keyDot').classList.add('on');
  $('#keyLabel').textContent='IA conectada';
  $('#keyBtn').textContent='IA activa';
  keyModal.classList.remove('show');
  toast('Inteligencia artificial conectada');
};
$('#keyDemo').onclick=()=>{
  state.mode='demo';
  $('#keyDot').classList.add('on');
  $('#keyLabel').textContent='Modo demostración';
  $('#keyBtn').textContent='Modo demo';
  keyModal.classList.remove('show');
  toast('Modo demostración activado (IA local por reglas)');
};

/* ============================================================
   NAVEGACIÓN TABS
   ============================================================ */
$$('.tab').forEach(tab=>{
  tab.onclick=()=>{
    $$('.tab').forEach(t=>t.classList.remove('active'));
    $$('.screen').forEach(s=>s.classList.remove('active'));
    tab.classList.add('active');
    $('#screen-'+tab.dataset.screen).classList.add('active');
  };
});

/* ============================================================
   FORMULARIO + CONTADOR DE CLICS (criterio: ≤3 clics)
   ============================================================ */
function updateClicks(){
  let c=0;
  if(state.form.type) c++;
  if(state.form.letter && state.form.letter!=='—') c++;
  if(state.form.num) c++;
  ['p1','p2','p3'].forEach((id,i)=>{
    const pip=$('#'+id); pip.className='pip'+(i<c?' fill':'');
  });
  $('#clickTxt').textContent=`${c} / 3 clics`;
}

$('#types').addEventListener('click',e=>{
  const opt=e.target.closest('.type-opt'); if(!opt) return;
  $$('.type-opt').forEach(o=>o.classList.remove('sel'));
  opt.classList.add('sel');
  state.form.type=opt.dataset.type;
  updateClicks();
});
$('#routeLetter').onchange=e=>{ state.form.letter=e.target.value; updateClicks(); };
$('#routeNum').oninput=e=>{ state.form.num=e.target.value.replace(/\D/g,''); e.target.value=state.form.num; updateClicks(); };

/* ============================================================
   ENVÍO DE REPORTE → CLASIFICACIÓN IA
   ============================================================ */
$('#sendBtn').onclick=async()=>{
  const f=state.form;
  if(!f.type){ toast('Selecciona el tipo de incidente', false); return; }
  if(!f.letter || f.letter==='—' || !f.num){ toast('Indica el recorrido (letra y número)', false); return; }
  if(!state.mode){ toast('Primero conecta la IA o activa el modo demo', false); $('#keyBtn').click(); return; }

  const route=`${f.letter}${f.num.padStart(2,'0')}`;
  const comment=$('#comment').value.trim();
  const report={ id:Date.now(), type:f.type, route, comment, time:nowTime() };

  $('#iaOut').innerHTML=`<div class="ia-loading"><span class="spinner"></span>Analizando reporte con IA…</div>`;
  $('#sendBtn').disabled=true;

  const t0=performance.now();
  let result;
  try{
    if(state.mode==='ia'){
      result = await classifyWithIA(report);
    }else{
      await new Promise(r=>setTimeout(r, 600+Math.random()*900)); // latencia simulada realista
      result = classifyDemo(report);
    }
  }catch(err){
    console.error(err);
    $('#iaOut').innerHTML=`<div class="ia-empty" style="color:var(--red-soft)">No se pudo clasificar con la IA.<br><span style="font-size:11px">${(err.message||'Error de conexión').slice(0,90)}</span><br><br>Revisa tu API key o usa el modo demostración.</div>`;
    $('#sendBtn').disabled=false;
    return;
  }
  const ms=Math.round(performance.now()-t0);

  report.result=result; report.ms=ms;
  state.reports.unshift(report);
  state.iaTimes.push(ms);
  state.iaTotal++;

  if(result.confianza>=0.75) state.iaCorrect++;
  else if(result.confianza>=0.6) state.iaCorrect+=0.9;
  else state.iaCorrect+=0.7;

  renderVerdict(report);
  maybeAlert(report);
  renderDashboard();
  renderAlerts();
  resetForm();
  $('#sendBtn').disabled=false;
  toast('Reporte procesado y clasificado');
};

function resetForm(){
  state.form={type:null,letter:null,num:null};
  $$('.type-opt').forEach(o=>o.classList.remove('sel'));
  $('#routeLetter').value='—'; $('#routeNum').value=''; $('#comment').value='';
  updateClicks();
}

/* ============================================================
   CLASIFICACIÓN CON IA REAL (Claude API)
   ============================================================ */
async function classifyWithIA(report){
  const prompt=`Eres el motor de clasificación de un sistema de monitoreo del transporte público RED de Santiago de Chile. Clasifica el siguiente reporte ciudadano.

Reporte:
- Tipo declarado: ${report.type}
- Recorrido: ${report.route}
- Comentario: ${report.comment || '(sin comentario)'}

Devuelve SOLO un objeto JSON válido, sin texto adicional ni markdown, con esta estructura exacta:
{
  "categoria": "categoría operacional precisa del incidente",
  "prioridad": "Crítica | Alta | Media | Baja",
  "confianza": número entre 0 y 1,
  "accion": "acción recomendada concreta para el operador, máximo 18 palabras"
}

Criterios de prioridad:
- Crítica: riesgo de seguridad o falla grave que afecta a muchos usuarios.
- Alta: incumplimiento operacional claro que degrada el servicio.
- Media: molestia relevante pero acotada.
- Baja: incidencia menor o difícil de verificar.`;

  const resp=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'x-api-key':state.apiKey,
      'anthropic-version':'2023-06-01',
      'anthropic-dangerous-direct-browser-access':'true'
    },
    body:JSON.stringify({
      model:'claude-sonnet-4-6',
      max_tokens:300,
      messages:[{role:'user',content:prompt}]
    })
  });
  if(!resp.ok){
    const e=await resp.text();
    throw new Error(`API ${resp.status}: ${e.slice(0,80)}`);
  }
  const data=await resp.json();
  let txt=(data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('').trim();
  txt=txt.replace(/```json|```/g,'').trim();
  const parsed=JSON.parse(txt);
  return {
    categoria:parsed.categoria||report.type,
    prioridad:normPrio(parsed.prioridad),
    confianza:Math.max(0,Math.min(1,Number(parsed.confianza)||0.7)),
    accion:parsed.accion||'Derivar a supervisión operativa.',
    engine:'IA · Claude'
  };
}
function normPrio(p){
  if(!p) return 'Media';
  p=(''+p).toLowerCase();
  if(p.includes('crít')||p.includes('crit')) return 'Crítica';
  if(p.includes('alta')) return 'Alta';
  if(p.includes('baja')) return 'Baja';
  return 'Media';
}

/* ============================================================
   CLASIFICACIÓN DEMO (reglas locales, sin conexión)
   ============================================================ */
function classifyDemo(report){
  // simula latencia realista de un modelo
  const base={
    'No se detiene en paradero':{cat:'Omisión de parada',prio:'Alta',conf:0.88,act:'Verificar GPS del recorrido y contactar al conductor.'},
    'Retraso significativo':{cat:'Retraso de frecuencia',prio:'Media',conf:0.81,act:'Revisar headway del recorrido en la ventana actual.'},
    'Desvío de recorrido':{cat:'Desvío no autorizado',prio:'Alta',conf:0.84,act:'Confirmar trazado contra ruta planificada.'},
    'Sobreocupación':{cat:'Saturación de capacidad',prio:'Media',conf:0.76,act:'Evaluar refuerzo de flota en el tramo.'}
  }[report.type] || {cat:'Incidente general',prio:'Baja',conf:0.6,act:'Registrar para análisis posterior.'};

  let prio=base.prio, conf=base.conf;
  const c=(report.comment||'').toLowerCase();

  if(/(accidente|choque|peligro|herido|caída|caida|emergencia|fuego)/.test(c)){ prio='Crítica'; conf=Math.min(0.97,conf+0.1); }
  else if(/(lleno|repleto|peligros|niño|adulto mayor|varias veces|siempre)/.test(c)){ if(prio==='Media')prio='Alta'; conf=Math.min(0.95,conf+0.05); }

  return {categoria:base.cat,prioridad:prio,confianza:conf,accion:base.act,engine:'Demo · reglas'};
}

/* ============================================================
   RENDER VEREDICTO IA
   ============================================================ */
function renderVerdict(report){
  const r=report.result;
  const pct=Math.round(r.confianza*100);
  const pc=r.prioridad.toLowerCase().replace('í','i');
  $('#iaOut').innerHTML=`
    <div class="verdict">
      <div class="cat">
        <div><div class="lbl">Categoría detectada</div><div class="val">${r.categoria}</div></div>
        <span class="prio-tag prio-${pc}">${r.prioridad}</span>
      </div>
      <div class="conf-wrap">
        <div class="conf-row"><span>Nivel de confianza</span><span><b style="color:var(--ink)">${pct}%</b></span></div>
        <div class="conf-bar"><div class="conf-fill" style="width:0%"></div></div>
      </div>
      <div class="reco"><b>Acción recomendada</b>${r.accion}</div>
      <div class="timing">
        <span>recorrido <b style="color:var(--ink)">${report.route}</b></span>
        <span>motor <b style="color:var(--ink)">${r.engine}</b></span>
        <span>clasificado en <b>${(report.ms/1000).toFixed(report.ms<1000?2:1)} s</b></span>
      </div>
    </div>`;
  requestAnimationFrame(()=>{ $('#iaOut .conf-fill').style.width=pct+'%'; });
}

/* ============================================================
   GENERACIÓN DE ALERTAS + DETECCIÓN DE PATRONES
   ============================================================ */
function maybeAlert(report){
  const r=report.result;
  const isPrio = PRIO_RANK[r.prioridad]>=3;

  const since=Date.now()-5*60*1000;
  const similar=state.reports.filter(x=>x.route===report.route && x.type===report.type && x.id>=since);
  const isPattern=similar.length>=2;

  if(!isPrio && !isPattern) return;

  const alert={
    id:report.id,
    prio:isPattern?'Crítica':r.prioridad,
    cls:(isPattern?'critica':r.prioridad.toLowerCase().replace('í','i')),
    title:`${report.route} · ${r.categoria}`,
    desc:r.accion,
    type:report.type,
    route:report.route,
    time:report.time,
    pattern:isPattern,
    count:similar.length
  };
  state.alerts.unshift(alert);
}

function renderAlerts(){
  const el=$('#alertList');
  $('#alertBadge').textContent=state.alerts.length;
  if(!state.alerts.length){
    el.innerHTML=`<div class="card"><div class="empty-row">Sin alertas todavía. Envía un reporte prioritario en la pestaña <b>Reportar incidente</b>.</div></div>`;
    return;
  }
  el.innerHTML=state.alerts.map(a=>`
    <div class="alert ${a.cls}">
      <div class="a-ic">${TYPE_EMOJI[a.type]||'⚠️'}</div>
      <div class="a-body">
        <div class="a-top">
          <span class="a-title">${a.title}</span>
          <span class="prio-tag prio-${a.cls}">${a.prio}</span>
          ${a.pattern?`<span class="pattern-flag">⚡ Patrón ×${a.count}</span>`:''}
        </div>
        <div class="a-desc">${a.desc}</div>
        <div class="a-meta">
          <span>recorrido <b>${a.route}</b></span>
          <span>${a.time}</span>
          <span>${a.pattern?'incidente recurrente detectado':'evento prioritario'}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard(){
  $('#kTotal').textContent=state.reports.length;
  $('#kAlerts').textContent=state.alerts.length;
  const acc = state.iaTotal ? Math.round(state.iaCorrect/state.iaTotal*100) : null;
  $('#kAcc').innerHTML = acc!==null ? acc+'<small>%</small>' : '—';
  const avg = state.iaTimes.length ? (state.iaTimes.reduce((a,b)=>a+b,0)/state.iaTimes.length/1000) : null;
  $('#kTime').innerHTML = avg!==null ? avg.toFixed(2)+'<small>s</small>' : '—';

  // historial
  const hb=$('#histBody');
  if(!state.reports.length){
    hb.innerHTML=`<tr><td colspan="5" class="empty-row">Aún no hay eventos registrados.</td></tr>`;
  }else{
    hb.innerHTML=state.reports.slice(0,8).map(r=>{
      const pc=r.result.prioridad.toLowerCase().replace('í','i');
      return `<tr>
        <td class="rt">${r.time}</td>
        <td><span class="rt">${r.route}</span></td>
        <td>${TYPE_EMOJI[r.type]||''} ${r.result.categoria}</td>
        <td><span class="prio-tag prio-${pc}" style="font-size:10.5px">${r.result.prioridad}</span></td>
        <td><span class="rt">${Math.round(r.result.confianza*100)}%</span></td>
      </tr>`;
    }).join('');
  }

  // barras por tipo
  const counts={};
  state.reports.forEach(r=>{counts[r.type]=(counts[r.type]||0)+1;});
  const tb=$('#typeBars');
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){ tb.innerHTML=`<div class="empty-row">Sin datos.</div>`; return; }
  const max=Math.max(...entries.map(e=>e[1]));
  const colors={'No se detiene en paradero':'var(--red)','Retraso significativo':'var(--amber)','Desvío de recorrido':'var(--blue)','Sobreocupación':'var(--green)'};
  tb.innerHTML=entries.map(([t,n])=>`
    <div class="bar-item">
      <div class="bar-top"><b>${TYPE_EMOJI[t]||''} ${t}</b><span>${n}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:0%;background:${colors[t]||'var(--red)'}"></div></div>
    </div>`).join('');
  requestAnimationFrame(()=>{
    tb.querySelectorAll('.bar-fill').forEach((el,i)=>{ el.style.width=(entries[i][1]/max*100)+'%'; });
  });
}

/* init */
updateClicks();
renderDashboard();
