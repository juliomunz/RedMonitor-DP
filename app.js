/* ============================================================
   RED Monitor — Prototipo MVP
   Diseño y Prototipado · Ciencia de Datos e IA · Grupo 2
   ============================================================ */

const state = {
  apiKey: null,
  mode: null,
  reports: [],
  alerts: [],
  iaTimes: [],
  iaCorrect: 0,
  iaTotal: 0,
  form: { type:null, letter:null, num:null },
};

/* ============================================================
   GTFS DATA — Recorridos RED reales (routes.txt V165.20260530)
   417 recorridos RM · generado automáticamente
   ============================================================ */
const GTFS_ROUTES = {"101":"Recoleta - Cerrillos","102":"(M) Las Rejas - San Carlos Oriente","103":"Providencia - San Luis De Macul","104":"Providencia - Camilo Henriquez","105":"Renca - Lo Espejo","105C":"Lo Valledor - Lo Espejo","106":"Nueva San Martin - Peñalolen","107":"Ciudad Empresarial - Av. Departamental","107C":"Ciudad Empresarial - Plaza Renca","108":"Maipu - La Florida","109":"Renca - Maipu","109N":"Plaza Italia - Maipu","110":"Renca - Maipu","110C":"Lo Echevers - Pudahuel Sur","111":"(M) Pajaritos - Ciudad Satelite","113":"Ciudad Satelite - (M) Los Heroes","113C":"Ciudad Satelite - (M) Cerrillos","113E":"Ciudad Satelite - (M) Los Heroes","114":"(M) Ñuñoa - Camilo Henriquez","115":"Villa El Abrazo -  (M) Los Heroes","115C":"Villa El Abrazo -  (M) Cerrillos","116":"Huechuraba - Centro","117":"(M) Vespucio Norte - Departamental Oriente","117C":"Huechuraba - Providencia","118":"Maipu - La Florida","119":"Mapocho - Lo Espejo","120":"Renca - (M) La Cisterna","121":"Mapocho - Lo Espejo","124":"(M) Macul - Puente Alto","125":"(M) U. De Chile - Lo Espejo","126":"La Higuera - (M) Manuel Montt","201":"Mall Plaza Norte - San Bernardo","201E":"(M) Santa Ana - San Bernardo","203":"Av. Recoleta - La Pintana","203C":"La Pintana - La Granja","203E":"Centro - La Pintana","203N":"Huechuraba - La Pintana","204":"Alameda - Pie Andino","204N":"Alameda - Pie Andino","205":"Santiago - Puente Alto","206":"Centro - La Pintana","206C":"(M) Bio Bio - La Pintana","207":"Mapocho - Av. Santa Rosa","207C":"El Retiro - (M) Santa Rosa","207E":"Mapocho - Av. Santa Rosa","208":"Huechuraba - Centro","208C":"Huechuraba - (M) Zapadores","209":"Alameda - El Volcan","209C":"El Volcan - (M) Santa Rosa","210":"Estacion Central - Puente Alto","210E":"Estacion Central - Puente Alto","210V":"Estacion Central - Av. Mexico","211":"La Florida - Nos","211C":"(M) La Cisterna - San Bernardo","212":"Mall Costanera Center - La Pintana","213E":"Plaza Italia - Puente Alto","214":"Santa Olga - Los Libertadores","216":"Pablo De Rokha - Vitacura","217E":"Maestranza - (M) Santa Ana","219E":"(M) La Cisterna - Ciudad Empresarial","223":"Santiago - Lo Espejo","224":"Ñuñoa - Gabriela","225":"Las Condes - Villa Los Aromos","225C":"Villa Los Aromos - (M) Vicente Valdes","226":"Centro - Nonato Coo","227":"La Reina - Av. Lo Ovalle","228":"(M) La Cisterna - Estacion San Bernardo","229":"(M) La Moneda - La Pintana","230":"Los Libertadores - Centro","233":"El Castillo - (M) B. De La Florida","234":"Alameda - Ejercito Libertador","244":"La Foresta - Hospital Eloisa Diaz","245":"Puente Alto - (M) Santa Rosa","246":"La Platina - (M) Hospital Sotero Del Rio","262N":"(M) Macul - Villa España","264N":"Pedro Fontova - Santo Tomas","271":"Santiago - San Bernardo","272":"Los Libertadores - Ciudad Empresarial","282":"Nos - (M) Plaza Puente Alto","286":"La Pintana - Mall Alto Las Condes","301":"Juan Antonio Rios - Angelmo","301C":"(M) La Cisterna - Angelmo","302":"(M) Santa Ana - La Pintana","302N":"Alameda - La Pintana","303":"Quilicura - Plaza Italia","306":"Juan Antonio Rios - Pob. Las Turbinas","307":"Lo Marcoleta - Plaza Italia","307C":"Lo Marcoleta - (M) Los Libertadores","307E":"Rigoberto Jara - (M) Santa Lucia","308":"Lo Marcoleta - Mapocho","308C":"San Luis - (M) Lo Cruzat","313E":"Quilicura - Estacion Central","314":"Lo Marcoleta - Plaza Italia","314C":"Lo Marcoleta - (M) Lo Cruzat","315E":"Rigoberto Jara - (M) Santa Lucia","320":"(M) Franklin - Maria Angelica","320C":"(M) Bellavista De La Florida - Maria Angelica","321":"(M) Lo Ovalle - Lo Sierra","322":"(M) Bellavista De La Florida - Jardin Alto","323":"(M) Bellavista De La Florida - La Loma","325":"Gabriela - (M) Irarrazaval","329":"Mall Plaza Oeste - Mall Florida Center","345":"Lo Espejo - Alameda","346N":"Lo Espejo - Alameda","348":"Rinconada - (M) Lo Ovalle","385":"Villa Francia - Florida Center","401":"Maipu - Las Condes","401C":"(M) Escuela Militar - Las Condes","402":"Pudahuel - Centro","403":"(M) Santa Ana - La Reina","404":"El Descanso - Mapocho","404C":"El Descanso - (M) Las Rejas","405":"Maipu - Cantagallo","405C":"Plaza Italia - Cantagallo","406":"Pudahuel - Cantagallo","406C":"(M) Escuela Militar - Av. El Rodeo","407":"Enea - Las Condes","408":"Renca - Mapocho","408E":"Renca - Mapocho","409":"Mapocho - Plaza San Enrique","410":"Renca - Providencia","410E":"Renca - Providencia","411":"Providencia - Plaza San Enrique","412":"Enea - La Reina","414E":"(M) Pudahuel -  Los Trapenses","415E":"(M) Pudahuel - (M) Manquehue","417E":"Maipu - (M) Manquehue","418":"Enea - Av. Tobalaba","419":"Villa Los Heroes - Plaza Italia","420":"Av. Tobalaba - (M) Escuela Militar","421":"Maipu - San Carlos De Apoquindo","421C":"San Carlos De Apoquindo - (M) Los Dominicos","422":"Pob. Teniente Merino -  La Reina","422C":"Pob. Teniente Merino -  (M) San Pablo","423":"Nueva San Martin - Plaza Italia","424":"Pudahuel Sur - (M) U. De Chile","425":"Rigoberto Jara - Lo Hermida","426":"Pudahuel - La Dehesa","428":"(M) Los Libertadores - (M) La Cisterna","428E":"(M) Los Libertadores - (M) La Cisterna","429":"Lo Echevers - Lo Hermida","429C":"Quilicura - (M) Tobalaba","430":"Quilicura - La Dehesa","431C":"Nueva San Martin - (M) Ecuador","432N":"Maipu - La Reina","435":"Quilicura - Vitacura","444":"Intermodal Aeropuerto - (M) La Cisterna","445C":"Centro - Vitacura","481":"Plaza Italia - Avenida Portales","486":"Enea - (M) San Pablo","501":"(M) Parque Bustamante - Fleming","502":"Cerro Navia - Cantagallo","502C":"Cerro Navia - Santiago","503":"Av. La Estrella - Vital Apoquindo","504":"El Tranque - Hospital Dipreca","505":"Cerro Navia - Las Parcelas","505C":"Las Parcelas - (M) Salvador","506":"Maipu - Peñalolen","506E":"Maipu - Peñalolen","506V":"Villa El Abrazo - Peñalolen","507":"Enea - Av Grecia","507C":"(M) Parque O'Higgins - Peñalolen","508":"Av. Mapocho - Av. Las Torres","509":"Maipu - Mapocho","510":"Pudahuel Sur - Rio Claro","511":"Cerro Navia - Peñalolen","513":"El Montijo - Jose Arrieta","514":"Enea - San Luis De Macul","514C":"(M) Salvador - San Luis De Macul","516":"Pudahuel Sur - Las Parcelas","517":"J. J. Pérez - Peñalolén","518":"J.J. Perez - Bilbao","519":"(M) Pajaritos - Av. Grecia","541N":"El Tranque - Colon","542":"Cerro Navia - Cantagallo","546E":"Villa El Abrazo - Vitacura","555":"Intermodal Aeropuerto - (M) Pajaritos","712":"Puente Alto - La Piramide","722":"Gonel - Av. Colon","B01":"Huamachuco - El Salto","B02":"El Barrero - Centro","B02N":"El Barrero - Plaza Italia","B03":"Miraflores - (M) Cerro Blanco","B04":"(M) Los Libertadores - Mapocho","B05":"(M) Los Libertadores - Ciudad Empresarial","B06":"(M) Zapadores - Santa Laura","B07":"M) Los Libertadores - San Ignacio","B08":"Lo Marcoleta - Mall Plaza Norte","B09":"Lo Boza - Lo Franco","B10":"Santa Marta Huechuraba - (M) Cerro Blanco","B11":"El Salto - Lo Marcoleta","B12":"(M) Zapadores - Lo Marcoleta","B12C":"Lo Marcoleta - Buenaventura","B13":"Valle Grande - (M) Lo Cruzat","B14":"El Salto - Mapocho","B15":"El Salto - Plaza Italia","B16":"El Carmen - (M) Vespucio Norte","B17":"Huamachuco - Av. Arzobispo Valdivieso","B18":"Villa Pucara - (M) Vespucio Norte","B18E":"Villa Pucara - (M) Los Libertadores","B19":"(M) Cardenal Caro - (M) Vespucio Norte","B20":"Miraflores - Mapocho","B21":"Plaza Chacabuco - Lo Marcoleta","B22":"Palacio Riesco - Urmeneta","B24":"Huamachuco - Centro","B25":"(M) Vespucio Norte - (M) Cerro Blanco","B26":"(M) Los Libertadores - (M) Estacion Central","B27":"(M) Vespucio Norte - (M) Salvador","B28":"Huamachuco - (M) Estacion Central","B29":"Miraflores - Mapocho","B30N":"Renca - Centro","B31N":"Centro - Quilicura","B32":"Valle Lo Campino - Muni. Quilicura","B33":"(M) Los Libertadores - Buenaventura","B35":"(M) Los Libertadores - (M) Zapadores","B36":"(M) Los Libertadores - Pedro Fontova Norte","B37":"(M) Los Libertadores - Parque Industrial","B38":"Hospital Felix Bulnes - Huamachuco","B41":"Mall Plaza Norte - (M) Cerro Blanco","B42":"(M) Los Libertadores - Valle Grande","B43":"(M) Vespucio Norte - Lo Marcoleta","B45":"Rigoberto Jara - El Mañio","C01":"(M) Francisco Bilbao - Cerro 18","C01C":"(M) Escuela Militar - Plaza San Enrique","C02":"San Carlos De Apoquindo - (M) Escuela Militar","C02C":"San Carlos De Apoquindo - (M) Los Dominicos","C03":"(M) Tobalaba - Vital Apoquindo","C03C":"Lo Gallo - Vital Apoquindo","C05":"La Ermita - (M) Francisco Bilbao","C06":"Vital Apoquindo - Ciudad Empresarial","C07":"La Piramide - (M) Francisco Bilbao","C09":"La Dehesa - (M) Los Dominicos","C09C":"San Carlos De Apoquindo - (M) Los Dominicos","C10E":"(M) Tobalaba - Camino Juan Pablo Ii","C11":"(M) Escuela Militar - Tabancura","C13":"Vital Apoquindo - Parque Del Sol","C14":"(M) Escuela Militar - Los Trapenses","C15":"(M) Escuela Militar - Estoril","C16":"Vital Apoquindo - El Huinganal","C17":"Cerro 18 - Camino Real","C18":"(M) Escuela Militar - (M) Dorsal","C19":"(M) Escuela Militar - Valle De La Dehesa","C20":"(M) Escuela Militar - Parque Arauco","C22":"(M) Escuela Militar - Rotonda Lo Curro","C25":"San Carlos De Apoquindo - Villa La Reina","C26C":"Ciudad Empresarial - (M) Tobalaba","C27":"Republica De Honduras - (M) Los Dominicos","C28":"(M) Escuela Militar - Los Bravos","C30E":"(M) Los Leones - Los Trapenses","C33C":"Vitacura - (M) Tobalaba","C37":"(M) Los Dominicos - San Ramon Oriente","D01":"Antupirén - (M) Plaza Egaña","D02":"(M) Irarrázaval - Álvaro Casanova","D03":"Las Parcelas - (M) Toesca","D03C":"Las Parcelas - (M) Plaza Egaña","D05":"(M) Franklin - Av. Tobalaba","D07":"Diagonal Las Torres - (M) Franklin","D07C":"Antupiren - (M) Grecia","D08":"Av. Grecia - (M) Francisco Bilbao","D09":"Av. Grecia Oriente - (M) Manuel Montt","D10":"(M) Carlos Valdovinos - Diagonal Las Torres","D11":"Diagonal Las Torres - Mall Alto Las Condes","D13":"(M) Bellavista De La Florida - (M) Irarrazaval","D14":"(M) Pedrero - (M) Quilin","D15":"Diagonal Las Torres - La Reina Alta","D16":"San Luis De Macul - (M) Francisco Bilbao","D17":"(M) Quilin - Alto Macul","D17V":"(M) Quilin - Las Pircas","D18":"Álvaro Casanova - (M) Santa Isabel","D20":"Av. Grecia Oriente - Av. Las Torres","D26":"San Luis De Macul - Maria Angelica","E01":"San Jose De La Estrella - (M) Santa Rosa","E02":"(M) Lo Ovalle - Diego Portales","E03":"(M) Lo Ovalle - Jardin Alto","E04":"Av. La Florida - (M) Franklin","E05":"(M) La Cisterna - (M) Bellavista De La Florida","E07":"(M) Bellavista De La Florida - Rojas Magallanes","E08":"Diego Portales - (M) Bellavista De La Florida","E09":"(M) Elisa Correa - (M) Santa Rosa","E10":"El Hualle - Santa Rosa P21","E11":"Diego Portales - (M) Santa Rosa","E12":"Gabriela - Santa Rosa P18","E13":"Gabriela - (M) Bellavista De La Florida","E14":"San Jose De La Estrella - (M) Bellavista De La Florida","E15C":"Gabriela - (M) Bellavista De La Florida","E16":"Gabriela - (M) Santa Rosa","E17":"(M) Bellavista De La Florida - Las Perdices","E18":"(M) La Cisterna - (M) Bellavista De La Florida","E20":"Jardin Del Este - (M) Macul","F01":"Villa Padre Hurtado - Casas Viejas","F01C":"(M) Plaza Puente Alto - Casas Viejas","F02":"Pie Andino - San Geronimo","F03":"(M) Plaza Puente Alto - Plaza San Bernardo","F03C":"Pie Andino - Villa Las Mamiñas","F05":"(M) La Cisterna - Pie Andino","F06":"(M) La Cisterna - Pie Andino","F07":"Mall Plaza Tobalaba - Villa Padre Hurtado","F08":"Villa Padre Hurtado - Diego Portales","F09":"Pie Andino - (M) Elisa Correa","F10":"San Guillermo - Mall Plaza Tobalaba","F10C":"San Guillermo - (M) Plaza Puente Alto","F11":"Pie Andino - Las Vizcachas","F12":"Bajos De Mena - (M) Plaza Puente Alto","F12C":"Villa Costa Azul - (M) Plaza Puente Alto","F13":"Bajos De Mena - Mall Plaza Tobalaba","F13C":"Mall Plaza Tobalaba - (M) Elisa Correa","F14":"Villa Padre Hurtado - (M) Plaza Puente Alto","F15":"Bajos De Mena - (M) Elisa Correa","F16":"Villa Padre Hurtado - Ribera Rio Maipo","F18":"Villa Chiloe - (M) Plaza Puente Alto","F20":"(M) La Cisterna - Pie Andino","F24":"Casas Viejas - Ciudad Del Sol","F25":"Bajos De Mena - (M) Bellavista De La Florida","F25E":"Bajos De Mena - (M) Bellavista De La Florida","F26":"Villa Padre Hurtado - San Carlos Oriente","F27":"Villa Padre Hurtado - Villa Portezuelo Oriente","F28":"Sargento Menadier - Eduardo Cordero","F29":"Pie Andino - Casas Viejas","F30N":"Bajos De Mena - La Moneda","F33":"Bajos De Mena - (M) Plaza Puente Alto","G01":"La Vara - Santo Tomas","G01C":"La Vara - Santa Rosa Parad. 21","G02":"Catemito - Puente Los Morros","G04":"(M) La Cisterna - Santo Tomas","G05":"El Castillo - (M) La Cisterna","G07":"San Francisco - Villa La Estrella","G08":"Poblacion La Selva - (M) La Cisterna","G08V":"Nos - (M) La Cisterna","G09":"Santa Margarita - Lo Blanco","G11":"(M) Lo Ovalle - Lo Blanco","G12":"(M) Lo Ovalle - Av. Lo Espejo","G13":"(M) La Cisterna - El Castillo","G13C":"El Castillo - (M) Copa Lo Martinez","G14":"Estacion Lo Blanco - Poblacion Valle Nevado","G15":"(M) La Cisterna - Santo Tomas","G16":"(M) La Cisterna - El Castillo","G18":"Santo Tomas - (M) Lo Ovalle","G22":"Estacion 5 Pinos - (M) La Cisterna","G23":"Estacion Lo Blanco - Santa Rosa P.43","G24":"Poblacion Valle Nevado - San Francisco","G27":"Mall Plaza Sur - Estacion San Bernardo","G28":"Angelmo - La Pintana","G31":"Lo Blanco - Angelmo","G32":"Santa Ines - Estacion San Bernardo","G34":"La Vara - (M) La Cisterna","G35":"El Castillo - (M) Copa Lo Martinez","G37":"Estacion San Bernardo - El Romeral","G38":"Mall Plaza Sur - (M) Hospital El Pino","G39":"Lo Espejo - Santa Mercedes","G43":"Estacion Lo Blanco - San Alberto De Nos","G46":"General Urrutia - La Estancilla De Nos","H03":"(M) Lo Ovalle - Mall Plaza Oeste","H05":"(M) Carlos Valdovinos - Jose Maria Caro","H07":"(M) Ñuble - (M) Lo Ovalle","H08":"Pobl. Las Turbinas - (M) Lo Ovalle","H09":"Jose Maria Caro - (M) Valdovinos","H12":"Lo Espejo - (M) Franklin","H13":"Santa Olga - (M) Los Heroes","H24":"La Victoria - Portal Oeste","I01":"Villa Los Heroes - Hospital Borja Arriarán","I02":"Rinconada - (M) Laguna Sur","I03":"Villa Los Heroes - (M) Quinta Normal","I03C":"Valle Verde - (M) San Alberto Hurtado","I04":"Villa El Abrazo - (M) San Alberto Hur","I04C":"Villa El Abrazo - (M) Plaza Maipu","I04E":"Villa El Abrazo - (M) Plaza Maipu","I05":"Rinconada - (M) Lo Ovalle","I07":"Rinconada - Mall Arauco Maipu","I08":"Mall Arauco Maipu - (M) San Alberto H","I08N":"La Farfana - Alameda","I08C":"La Farfana - (M) Del Sol","I09":"Rinconada - (M) U. De Chile","I09C":"Rinconada - (M) Las Rejas","I09E":"Rinconada - (M) U. De Chile","I10":"Villa Los Heroes - (M) Quinta Normal","I10N":"Villa Los Heroes - Alameda","I11":"Ciudad Satelite - Rinconada","I11N":"Ciudad Satelite - (M) Plaza Maipu","I12":"Pueblito La Farfana - Mall Plaza Oeste","I13":"(M) Del Sol - (M) San Alberto Hurtado","I14":"Mall Plaza Oeste - Estacion Central","I14N":"Mall Plaza Oeste - Centro","I16":"Poblacion Santiago - Ferrocarril","I17":"Villa Francia - Hospital San Juan De Dios","I18":"Rinconada - (M) Ula","I20":"Valle Verde - Marta Ossa Ruiz","I21":"Villa Hernan Diaz - (M) Plaza Maipu","I22":"La Farfana - (M) Del Sol","I24":"Villa Los Maitenes - Plaza Oeste","I25":"Villa S. Henriquez - Portal Oeste","I26":"Avenida Portales - (M) Cerrillos","I35":"(M) Del Sol - Padre Hurtado","I39":"Villa San Alberto - (M) Cerrillos","J01":"Pudahuel Sur - (M) Quinta Normal","J01C":"Carrascal - (M) San Pablo","J02":"Enea - (M) Ula","J03":"El Montijo - (M) Republica","J04":"(M) Neptuno - La Alianza","J05":"El Montijo - (M) Ula","J06":"(M) Pudahuel - (M) Pajaritos","J07":"Noviciado - (M) Pudahuel","J07C":"(M) Pudahuel - Lo Boza","J07E":"Noviciado - (M) Pudahuel","J08":"Pudahuel Sur - Lo Franco","J10":"San Daniel - Parque De Los Reyes","J11":"Lomas De Lo Aguirre - (M) Pajaritos","J12":"(M) Pajaritos - Ciudad De Los Valles","J13":"(M) Estacion Central - El Monitjo","J13C":"(M) San Pablo - El Montijo","J15C":"La Alianza - (M) Neptuno","J16":"Cerro Navia - (M) Estacion Central","J17":"(M) Pajaritos - Puerto Santiago","J18":"Enea - (M) San Pablo","J18C":"El Tranque - (M) San Pablo","J19":"Pudahuel Sur - (M) Quinta Normal","J20":"El Montijo - (M) Pudahuel","J22":"(M) Pajaritos - Praderas De Lo Aguirre"}
;

function buildRouteId(letter, num) {
  const l = (!letter || letter === '—') ? '' : letter.trim().toUpperCase();
  const n = (num || '').trim().toUpperCase();
  return l + n;
}

function lookupRoute(letter, num) {
  const key = buildRouteId(letter, num);
  if (!key) return { found: false, routeId: key, name: null, suggestions: [] };
  if (GTFS_ROUTES[key]) return { found: true, routeId: key, name: GTFS_ROUTES[key], suggestions: [] };
  const suggestions = Object.keys(GTFS_ROUTES)
    .filter(k => k.startsWith(key))
    .slice(0, 4)
    .map(k => ({ id: k, name: GTFS_ROUTES[k] }));
  const numOnly = key.replace(/[A-Z]/g,'');
  const fuzzy = suggestions.length === 0
    ? Object.keys(GTFS_ROUTES).filter(k => k.includes(numOnly) && numOnly.length >= 2).slice(0,3).map(k=>({id:k,name:GTFS_ROUTES[k]}))
    : [];
  return { found: false, routeId: key, name: null, suggestions: [...suggestions,...fuzzy].slice(0,4) };
}

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
  if(state.form.gtfsValid) c++;
  if(state.form.stopId) c++;
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
$('#routeLetter').onchange=e=>{ state.form.letter=e.target.value; validateRouteInput(); updateClicks(); };
$('#routeNum').oninput=e=>{
  state.form.num=e.target.value.replace(/\D/g,''); e.target.value=state.form.num;
  validateRouteInput(); updateClicks();
};

function validateRouteInput(){
  const letter = state.form.letter;
  const num    = state.form.num;
  let hint = $('#routeHint');
  if(!hint){
    hint=document.createElement('div'); hint.id='routeHint';
    hint.style.cssText='font-size:12px;margin-top:6px;min-height:18px;transition:opacity .2s';
    // Insertar DESPUÉS del route-row, no dentro de él
    const routeRow = $('#routeNum').closest('.route-row') || $('#routeNum').parentNode;
    routeRow.parentNode.insertBefore(hint, routeRow.nextSibling);
  }
  if(!num || num.length < 1){ hint.innerHTML=''; state.form.gtfsValid=false; return; }
  const result = lookupRoute(letter, num);
  if(result.found){
    hint.innerHTML=`<span style="color:#4ade80">✓ ${result.routeId} · ${result.name}</span>`;
    state.form.gtfsName=result.name; state.form.gtfsRouteId=result.routeId; state.form.gtfsValid=true;
    showStopSelector(result.routeId);
  } else if(result.suggestions.length){
    const sugs=result.suggestions.map(s=>`<span class="route-sug" data-id="${s.id}" style="cursor:pointer;text-decoration:underline;margin-right:8px;color:inherit">${s.id}</span>`).join('');
    hint.innerHTML=`<span style="color:#f59e0b">⚠ No encontrado. ¿Quisiste decir: ${sugs}?</span>`;
    state.form.gtfsValid=false; state.form.gtfsName=null;
    showStopSelector(null);
    hint.querySelectorAll('.route-sug').forEach(el=>{
      el.onclick=()=>{
        const sid=el.dataset.id;
        const m=sid.match(/^([A-Z]+)?(\d+\w*)$/i);
        if(m){ $('#routeLetter').value=m[1]||'—'; $('#routeNum').value=m[2];
               state.form.letter=m[1]||'—'; state.form.num=m[2]; }
        validateRouteInput(); updateClicks();
      };
    });
  } else {
    hint.innerHTML=`<span style="color:#f87171">✗ "${result.routeId}" no existe en RED</span>`;
    state.form.gtfsValid=false; state.form.gtfsName=null;
    showStopSelector(null);
  }
}

/* ============================================================
   PARADEROS GTFS — Selector + Geolocalización
   ============================================================ */
function initStopSelector() {
  // Insertar después de routeHint (que ya está fuera del route-row)
  const anchor = $('#routeHint');
  if (!anchor) return null;
  let box = $('#stopBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'stopBox';
    box.style.cssText = 'margin-top:12px;display:none';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
  }
  return box;
}

function showStopSelector(routeId) {
  const box = initStopSelector();
  if (!box) return;
  if (!routeId || typeof getRouteDirections !== 'function' || !hasRouteStops(routeId)) {
    box.style.display = 'none';
    state.form.stopId = null; state.form.stopName = null;
    return;
  }

  const dirs = getRouteDirections(routeId);
  if (!dirs.length) { box.style.display = 'none'; return; }

  box.style.display = 'block';
  box.innerHTML = `
    <label style="display:block;font-size:13px;font-weight:600;color:var(--ink);margin-bottom:8px">Paradero <span style="color:var(--red-soft)">*</span></label>
    <div style="display:flex;gap:8px;align-items:stretch;margin-bottom:8px">
      <select id="stopDir" style="flex:1;font-size:12px;padding:6px 8px;background:var(--surface);color:var(--ink);border:1px solid var(--border);border-radius:6px">
        ${dirs.map(d => `<option value="${d.dir}">${d.label}: ${d.origin} → ${d.dest}</option>`).join('')}
      </select>
      <button id="geoBtn" type="button" style="white-space:nowrap;font-size:12px;padding:6px 12px;background:var(--surface);color:var(--ink);border:1px solid var(--border);border-radius:6px;cursor:pointer">📍 Ubicarme</button>
    </div>
    <select id="stopSelect" size="1" style="width:100%;font-size:13px;padding:8px;background:var(--surface);color:var(--ink);border:1px solid var(--border);border-radius:6px">
      <option value="">— Seleccionar paradero —</option>
    </select>
    <div id="stopInfo" style="font-size:12px;margin-top:6px;min-height:16px"></div>`;

  // Llenar paradas al cambiar dirección
  const fillStops = () => {
    const dir = $('#stopDir').value;
    const stops = getRouteStops(routeId, dir);
    const sel = $('#stopSelect');
    sel.innerHTML = '<option value="">— Seleccionar paradero (opcional) —</option>' +
      stops.map((s, i) => `<option value="${s[3]}" data-lat="${s[0]}" data-lon="${s[1]}">#${i+1} ${s[2]}</option>`).join('');
    state.form.stopId = null; state.form.stopName = null; state.form.stopDir = dir;
    $('#stopInfo').innerHTML = `<span style="color:var(--muted)">${stops.length} paradas en este sentido</span>`;
    updateClicks();
  };

  $('#stopDir').onchange = fillStops;
  fillStops();

  // Seleccionar parada manualmente
  $('#stopSelect').onchange = () => {
    const sel = $('#stopSelect');
    const opt = sel.options[sel.selectedIndex];
    if (sel.value) {
      state.form.stopId = sel.value;
      state.form.stopName = opt.textContent.replace(/^#\d+\s*/, '');
      state.form.stopLat = parseFloat(opt.dataset.lat);
      state.form.stopLon = parseFloat(opt.dataset.lon);
      $('#stopInfo').innerHTML = `<span style="color:#4ade80">✓ ${state.form.stopName}</span>`;
    } else {
      state.form.stopId = null; state.form.stopName = null;
      $('#stopInfo').innerHTML = '';
    }
    updateClicks();
  };

  // Geolocalización
  $('#geoBtn').onclick = () => {
    if (!navigator.geolocation) {
      $('#stopInfo').innerHTML = '<span style="color:var(--red-soft)">Tu navegador no soporta geolocalización</span>';
      return;
    }
    $('#geoBtn').disabled = true;
    $('#geoBtn').textContent = '📍 Buscando…';

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const dir = $('#stopDir').value;
        const nearest = findNearestStop(routeId, lat, lon, dir);
        const nearby  = findNearbyStops(routeId, lat, lon, 500, dir);

        if (nearest) {
          // Seleccionar automáticamente la más cercana en el dropdown
          const sel = $('#stopSelect');
          sel.value = nearest.stop_id;
          state.form.stopId   = nearest.stop_id;
          state.form.stopName = nearest.name;
          state.form.stopLat  = nearest.lat;
          state.form.stopLon  = nearest.lon;

          let info = `<span style="color:#4ade80">📍 ${nearest.name} (a ${nearest.distanceM}m de ti)</span>`;
          if (nearby.length > 1) {
            info += '<br><span style="color:var(--muted);font-size:11px">También cerca: ' +
              nearby.slice(1).map(s =>
                `<span class="route-sug" data-sid="${s.stop_id}" style="cursor:pointer;text-decoration:underline">${s.name} (${s.distanceM}m)</span>`
              ).join(', ') + '</span>';
          }
          $('#stopInfo').innerHTML = info;
          updateClicks();

          // Click en parada alternativa
          $('#stopInfo').querySelectorAll('.route-sug').forEach(el => {
            el.onclick = () => {
              const alt = nearby.find(s => s.stop_id === el.dataset.sid);
              if (alt) {
                sel.value = alt.stop_id;
                state.form.stopId   = alt.stop_id;
                state.form.stopName = alt.name;
                state.form.stopLat  = alt.lat;
                state.form.stopLon  = alt.lon;
                $('#stopInfo').innerHTML = `<span style="color:#4ade80">📍 ${alt.name} (a ${alt.distanceM}m)</span>`;
                updateClicks();
              }
            };
          });
        } else {
          $('#stopInfo').innerHTML = '<span style="color:var(--amber)">No se encontraron paradas cerca de tu ubicación para este recorrido</span>';
        }
        $('#geoBtn').disabled = false;
        $('#geoBtn').textContent = '📍 Ubicarme';
      },
      err => {
        const msgs = { 1: 'Permiso de ubicación denegado', 2: 'Ubicación no disponible', 3: 'Tiempo de espera agotado' };
        $('#stopInfo').innerHTML = `<span style="color:var(--red-soft)">${msgs[err.code] || 'Error de geolocalización'}</span>`;
        $('#geoBtn').disabled = false;
        $('#geoBtn').textContent = '📍 Ubicarme';
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };
}

/* ============================================================
   ENVÍO DE REPORTE → CLASIFICACIÓN IA
   ============================================================ */
$('#sendBtn').onclick=async()=>{
  const f=state.form;
  if(!f.type){ toast('Selecciona el tipo de incidente', false); return; }
  if(!f.num){ toast('Indica el número de recorrido', false); return; }
  if(!state.mode){ toast('Primero conecta la IA o activa el modo demo', false); $('#keyBtn').click(); return; }

  // [GTFS] Validar recorrido contra datos reales
  if(f.num && !f.gtfsValid){
    const r=lookupRoute(f.letter, f.num);
    if(r.found){ f.gtfsName=r.name; f.gtfsRouteId=r.routeId; f.gtfsValid=true; }
    else{ toast(`Recorrido "${buildRouteId(f.letter,f.num)}" no existe en RED. Verifica el número.`, false); return; }
  }

  // [GTFS v3] Paradero obligatorio
  if(!f.stopId){ toast('Selecciona el paradero donde te encuentras', false); return; }

  // [GTFS v2] Advertir si el recorrido no opera hoy
  if(f.gtfsRouteId && typeof getCurrentFrequency === 'function'){
    const chk = getCurrentFrequency(f.gtfsRouteId);
    if(chk && !chk.operates){
      toast(`⚠ ${f.gtfsRouteId} no tiene servicio programado hoy (${chk.serviceLabel}). El reporte igual se registrará.`, false);
    }
  }

  const route = f.gtfsRouteId || buildRouteId(f.letter, f.num);
  const comment=$('#comment').value.trim();
  // [GTFS v2] capturar frecuencia y servicio en el momento del reporte
  const freqSnapshot = (typeof getCurrentFrequency === 'function') ? getCurrentFrequency(f.gtfsRouteId || route) : null;
  const svcSnapshot  = (typeof getTodayService === 'function') ? getTodayService() : null;
  const stopInfo = f.stopId ? { id:f.stopId, name:f.stopName, lat:f.stopLat, lon:f.stopLon, dir:f.stopDir } : null;
  const report={ id:Date.now(), type:f.type, route, gtfsName:f.gtfsName||null,
                 stop:stopInfo, freq:freqSnapshot, svc:svcSnapshot, comment, time:nowTime() };

  $('#iaOut').innerHTML=`<div class="ia-loading"><span class="spinner"></span>Analizando reporte con IA…</div>`;
  $('#sendBtn').disabled=true;

  const t0=performance.now();
  let result;
  try{
    if(state.mode==='ia'){
      result = await classifyWithIA(report);
    }else{
      await new Promise(r=>setTimeout(r, 600+Math.random()*900));
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
  const stopBox=$('#stopBox'); if(stopBox) stopBox.style.display='none';
  state.form.stopId=null; state.form.stopName=null;
  $$('.type-opt').forEach(o=>o.classList.remove('sel'));
  $('#routeLetter').value='—'; $('#routeNum').value=''; $('#comment').value='';
  updateClicks();
}

/* ============================================================
   CLASIFICACIÓN CON IA REAL (Claude API)
   ============================================================ */
async function classifyWithIA(report){
  const routeCtx = report.gtfsName ? `${report.route} (${report.gtfsName})` : report.route;

  // [GTFS v2] Contexto de frecuencia real
  const freqInfo = (typeof getCurrentFrequency === 'function') ? getCurrentFrequency(report.route) : null;
  const stopCtx  = report.stop
    ? `- Paradero: ${report.stop.name} (${report.stop.id}, coords: ${report.stop.lat}, ${report.stop.lon})`
    : '';
  const freqCtx  = freqInfo && freqInfo.operates && !freqInfo.outOfService
    ? `- Frecuencia programada AHORA: cada ${freqInfo.headwayMin} min (franja ${freqInfo.startTime}–${freqInfo.endTime}, ${freqInfo.serviceLabel})`
    : freqInfo && freqInfo.operates && freqInfo.outOfService
    ? `- Recorrido fuera de horario activo. Próxima salida: ${freqInfo.nextStart}`
    : freqInfo
    ? `- Sin servicio programado hoy (${freqInfo.serviceLabel}): ${freqInfo.reason}`
    : '';
  const svcCtx = (typeof getTodayService === 'function')
    ? `- Tipo de día: ${getTodayService().label}`
    : '';

  const prompt=`Eres el motor de clasificación de un sistema de monitoreo del transporte público RED de Santiago de Chile. Clasifica el siguiente reporte ciudadano.

Reporte:
- Tipo declarado: ${report.type}
- Recorrido: ${routeCtx}
${svcCtx}
${freqCtx}
${stopCtx}
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
        <span>recorrido <b style="color:var(--ink)">${report.route}</b>${report.gtfsName ? ` <span style="color:var(--muted);font-weight:400">· ${report.gtfsName}</span>` : ''}</span>
        ${report.stop ? `<span>paradero <b style="color:var(--ink)">${report.stop.name}</b> <span style="color:var(--muted)">(${report.stop.id})</span></span>` : ''}
        ${report.svc ? `<span>día <b style="color:var(--ink)">${report.svc.label}</b></span>` : ''}
        ${report.freq && report.freq.operates && !report.freq.outOfService
          ? `<span>frecuencia programada <b style="color:var(--ink)">cada ${report.freq.headwayMin} min</b> <span style="color:var(--muted)">(${report.freq.startTime}–${report.freq.endTime})</span></span>`
          : report.freq && report.freq.outOfService
          ? `<span style="color:var(--amber)">⚠ fuera de horario · próxima salida <b>${report.freq.nextStart}</b></span>`
          : report.freq
          ? `<span style="color:var(--muted)">${report.freq.reason}</span>`
          : ''}
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

updateClicks();
renderDashboard();