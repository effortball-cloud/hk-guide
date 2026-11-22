(function(){
"use strict";
const P = window.PLACES, GEO = window.GEO || {}, A = window.AREAS, CATS = window.CATS, R = window.REELS, TRIP = window.TRIP;
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try { const v = localStorage.getItem("hkguide." + k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("hkguide." + k, JSON.stringify(v)); } catch(e){} }
};

// ── 지역(상위) ──
const REGIONS = {island:"홍콩섬", kowloon:"구룡", macau:"마카오", outer:"공항·란타우"};
const regionOf = p => (A[p.a] || {}).rg || "island";
const mapRegionOf = p => p.r === "macau" ? "macau" : "hk";

// ── 데이터 정리 ──
const byId = {};
P.forEach(p => {
  const g = GEO[p.id];
  if (!p.ll && g && g.ll) p.ll = g.ll;
  p.r = p.r || "hk";
  byId[p.id] = p;
});
const NOMAP = !window.L;   // 지도 라이브러리를 못 불러와도 나머지 탭은 동작하게
const favs = new Set(store.get("fav", []));
const saveFav = () => store.set("fav", [...favs]);
const hasReel = p => (p.s || []).some(x => typeof x === "number");

// 음식 종류 태그 (이름·메뉴에서 자동 + tg로 직접 지정)
const FOOD_TAGS = [
  ["딤섬", /딤섬|dim ?sum|點心|카트|차슈번|창펀/i],
  ["완탕·국수", /완탕|누들|noodle|국수|면\b|면 |도삭|비앙비앙|라미엔|생전포/i],
  ["로스트구스·바비큐", /거위|구스|goose|차슈 |바비큐/i],
  ["차찬텡", /차찬텡|밀크티|토스트|cha chaan|파인애플번|cafe$/i],
  ["에그타르트·빵", /에그타르트|베이커리|bakery|데니시|번\b|빵/i],
  ["커피", /커피|coffee|라떼|아라비카/i],
  ["디저트", /푸딩|모찌|아이스크림|디저트|화채|사고|와플|dessert/i],
  ["사천·마라", /사천|마라|마파|sichuan/i],
  ["해산물·다이파이동", /다이파이동|해산물|seafood|조개/i],
  ["뷰·기념식사", /하버뷰|루프탑|뷰 |전망/i],
];
function foodTags(p){
  if (!["food","cafe","bar"].includes(p.c)) return [];
  const txt = [p.n, p.l, ...(p.m || []), ...(p.t || [])].join(" ");
  const tags = FOOD_TAGS.filter(([, re]) => re.test(txt)).map(([n]) => n);
  (p.tg || []).forEach(t => { if (!tags.includes(t)) tags.push(t); });
  if (p.c === "bar") tags.push("바");
  return tags;
}
P.forEach(p => { p._tags = foodTags(p); });

// ── 내 장소: 사용자가 직접 넣은 곳 (이 브라우저 localStorage에만 저장, 파일로 내보내기·불러오기) ──
// 저장 형식은 places.js 한 줄과 같은 필드(n·c·ll·t·cd·a·r) → 내보낸 파일을 그대로 places.js에 옮겨 넣을 수도 있다.
const inBounds = ll => Array.isArray(ll) && ll.length === 2 && ll.every(v => typeof v === "number" && isFinite(v))
  && ll[0] > 21.8 && ll[0] < 22.7 && ll[1] > 113.3 && ll[1] < 114.6;
function cleanMine(x){
  if (!x || typeof x.n !== "string" || !x.n.trim()) return null;
  const it = {
    id: typeof x.id === "string" && /^my_[a-z0-9]{1,24}$/.test(x.id) ? x.id : "my_" + (Date.now() + Math.floor(Math.random()*1e6)).toString(36),
    n: x.n.trim().slice(0, 60), c: CATS[x.c] ? x.c : "sight", r: x.r === "macau" ? "macau" : "hk",
  };
  if (typeof x.a === "string" && A[x.a]) it.a = x.a;
  if (inBounds(x.ll)) it.ll = [+x.ll[0].toFixed(6), +x.ll[1].toFixed(6)];
  if (Array.isArray(x.t)) it.t = x.t.filter(s => typeof s === "string" && s.trim()).map(s => s.trim().slice(0, 300)).slice(0, 20);
  if (x.cd === true || x.cd === false) it.cd = x.cd;
  return it;
}
let mine = store.get("mine", []).map(cleanMine).filter(Boolean);
const saveMine = () => store.set("mine", mine);
function addMineToP(it){
  const p = Object.assign({}, it, {mine: true});
  p._tags = foodTags(p);
  P.push(p); byId[p.id] = p;
}
mine.forEach(addMineToP);
// 가장 가까운 가이드 장소의 동네·지역을 빌려 온다 (3km 안에 없으면 지역만)
function guessArea(ll){
  let best = null, bd = 99;
  P.forEach(p => { if (p.mine || !p.ll || !p.a) return; const d = km(ll, p.ll); if (d < bd) { bd = d; best = p; } });
  return best && bd < 3 ? {a: best.a, r: best.r} : {a: null, r: ll[1] < 113.75 ? "macau" : "hk"};
}

// ── 유틸 ──
function km(a, b){
  const R0 = 6371, t = Math.PI/180;
  const dLa = (b[0]-a[0])*t, dLo = (b[1]-a[1])*t;
  const x = Math.sin(dLa/2)**2 + Math.cos(a[0]*t)*Math.cos(b[0]*t)*Math.sin(dLo/2)**2;
  return 2*R0*Math.asin(Math.sqrt(x));
}
const walkMin = d => Math.max(1, Math.round(d*1.3*1000/75));       // 직선거리 × 1.3, 분속 75m
const taxiMin = d => Math.round(d*1.35/22*60) + 4;
function won(h){
  const w = h * TRIP.rate;
  return w >= 10000 ? (Math.round(w/1000)/10).toFixed(1).replace(/\.0$/,"") + "만" : Math.round(w/1000) + "천";
}
function priceTxt(p, short){
  if (!p.p) return "";
  const [a, b] = p.p, range = b && b !== a;
  if (short) return `HK$${a}${range ? "~"+b : ""}`;
  return `HK$${a}${range ? "~"+b : ""} <span class="muted">(≈ ₩${won(a)}${range ? "~"+won(b) : ""})</span>`;
}
const llUrl = ll => "https://www.google.com/maps/search/?api=1&query=" + ll[0].toFixed(6) + "," + ll[1].toFixed(6);
// 구글맵 링크: (포토스팟·대략 위치는) 좌표 > 검색어(q 우선)
function gmapUrl(p){
  if (p.ll && (p.c === "photo" || p.chk === "approx" || p.pin || p.mine)) return llUrl(p.ll);
  const q = p.q || ((p.l || p.n) + (p.ad ? ", " + p.ad : "") + (p.r === "macau" ? ", Macau" : ", Hong Kong"));
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
}
function dirUrl(p){   // 출발지는 비워 두면 구글맵이 내 위치로 잡아요
  const dest = p.ll ? p.ll.join(",") : encodeURIComponent(p.q || p.l || p.n);
  return "https://www.google.com/maps/dir/?api=1&destination=" + dest + "&travelmode=transit";
}
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 1600);
}
function reelLinks(p){
  const nums = (p.s || []).filter(x => typeof x === "number" && R[x]);
  if (!nums.length) return "";
  return `<div class="reels">📱 관련 릴스 · ${nums.map(n => R[n].u
    ? `<a href="${R[n].u}" target="_blank" rel="noopener">${esc(R[n].a)}</a>`
    : `<span>${esc(R[n].a)}</span>`).join("")}</div>`;
}
const rvNeed = p => p.rv && p.rv.need;
const isMust = p => rvNeed(p) === "필수";
const isRecommend = p => ["권장","가능"].includes(rvNeed(p));
const isEatery = p => ["food","cafe","bar"].includes(p.c);
const noCard = p => p.cd === false;           // 카드 안 됨 (현금·옥토퍼스 등만)
const cardChk = p => p.cd === "?";            // 출처가 엇갈리거나 정보 없음
const aliOK = p => /알리페이/.test(p.pay || "");
function payRow(p){
  if (!p.pay && p.cd === undefined) return "";
  const head = noCard(p) ? '<b style="color:#ff4d5e">💳✕ 카드 안 됨</b> — 현금 준비'
    : cardChk(p) ? '<b style="color:var(--amber)">💳? 카드 확인 필요</b> — 현금도 챙기기'
    : p.cd === true ? '<b style="color:var(--lime)">💳 카드 OK</b>' : "";
  const ali = (noCard(p) || cardChk(p)) && aliOK(p) ? '<br><span class="tiny">알리페이 QR이 되면 카카오페이·네이버페이·토스(알리페이플러스)로 될 수도 있어요 (가게 단말에 따라 다름)</span>' : "";
  return (head ? head + "<br>" : "") + esc(p.pay || "") + ali;
}

// ── 장소 카드 ──
function badges(p){
  const b = [];
  const c = CATS[p.c];
  b.push(`<span class="b" style="color:${c.col};border-color:${c.col}66">${c.ic} ${c.n}</span>`);
  if (p.mine) b.push(`<span class="b lime">✏️ 내가 추가</span>`);
  if (A[p.a]) b.push(`<span class="b">${esc(REGIONS[regionOf(p)])} · ${esc(A[p.a].n)}</span>`);
  if (p.rv && p.rv.done) b.push(`<span class="b lime">✅ 예약완료</span>`);
  if (isMust(p)) b.push(`<span class="b red">🔴 예약 필수</span>`);
  else if (isRecommend(p)) b.push(`<span class="b yel">예약 ${p.rv.need}</span>`);
  if (noCard(p)) b.push(`<span class="b red">💳✕ 카드 안 됨</span>`);
  else if (cardChk(p)) b.push(`<span class="b yel">💳? 카드 확인 필요</span>`);
  if (p.star) b.push(`<span class="b star">⭐ 미쉐린 ${esc(p.star)}</span>`);
  if (!p.ll) b.push(p.mine ? `<span class="b">📍 위치 없음</span>` : `<span class="b red">📍 위치 확인 중</span>`);
  else if (p.chk === "approx") b.push(`<span class="b yel">📍 위치 대략</span>`);
  if (p.chk === "unknown") b.push(`<span class="b yel">❓ 가게 확인 필요</span>`);
  if (p.tm) b.push(`<span class="b lime">${{day:"☀ 낮",golden:"🌇 노을",night:"🌃 밤"}[p.tm]} 추천</span>`);
  if (hasReel(p)) b.push(`<span class="b pink">📱 릴스</span>`);
  return `<div class="badges">${b.join("")}</div>`;
}
function cardHTML(p, opts={}){
  const c = CATS[p.c], area = A[p.a] || {};
  const rows = [];
  if (p.ad) rows.push(["주소", esc(p.ad)]);
  if (p.h) rows.push(["영업", esc(p.h)]);
  if (p.m) rows.push(["메뉴", esc(p.m.join(" · "))]);
  if (p.p) rows.push(["1인", priceTxt(p)]);
  const pr = payRow(p);
  if (pr) rows.push(["결제", pr]);
  if (p.rv) {
    let r = esc(p.rv.need);
    if (p.rv.how) r += " · " + esc(p.rv.how);
    if (p.rv.url) r += ` · <a href="${p.rv.url}" target="_blank" rel="noopener">예약 링크</a>`;
    rows.push(["예약", r]);
  }
  if (p.url) rows.push(["공식", `<a href="${p.url}" target="_blank" rel="noopener">공식 안내 열기</a>`]);
  if (area.mtr) rows.push(["셩완에서", "🚇 " + esc(area.mtr)]);
  if (area.course) rows.push(["주변 코스", esc(area.course)]);
  const tips = (p.t || []).map(t => `<li>${esc(t)}</li>`).join("");
  const note = opts.note ? `<div class="callout" style="margin:8px 0 0">${opts.note}</div>` : "";
  return `<div class="card ${isMust(p) ? "hot" : ""}" data-id="${p.id}">
    <div class="top"><div class="ic">${c.ic}</div>
      <div class="nm">${esc(p.n)}<small>${esc(p.l || "")}</small></div>
      <button class="heart ${favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="찜">♥</button></div>
    ${badges(p)}${note}
    <dl class="kv">${rows.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    ${tips ? `<ul class="tips">${tips}</ul>` : ""}
    ${reelLinks(p)}
    <div class="btns">
      <a class="btn p" href="${gmapUrl(p)}" target="_blank" rel="noopener">구글맵 열기</a>
      <a class="btn c" href="${dirUrl(p)}" target="_blank" rel="noopener">내 위치에서 길찾기</a>
      ${opts.mapBtn && p.ll ? `<button class="btn" data-onmap="${p.id}">지도에서 보기</button>` : ""}
    </div>
    ${p.mine ? `<div class="btns"><button class="btn" data-mine-edit="${p.id}">✏️ 고치기</button><button class="btn" data-mine-del="${p.id}">🗑 지우기</button></div>` : ""}</div>`;
}
// 목록용 짧은 카드 (누르면 상세)
function rowHTML(p){
  const c = CATS[p.c];
  const meta = [A[p.a] && A[p.a].n, (p.m || []).slice(0,2).join("·"), priceTxt(p, true)].filter(Boolean).map(esc).join(" · ");
  const bs = [];
  if (p.mine) bs.push(`<span class="b lime">✏️ 내 장소</span>`);
  if (p.rv && p.rv.done) bs.push(`<span class="b lime">✅예약</span>`);
  if (isMust(p)) bs.push(`<span class="b red">예약필수</span>`);
  else if (isRecommend(p)) bs.push(`<span class="b yel">예약${p.rv.need}</span>`);
  if (noCard(p)) bs.push(`<span class="b red">💳✕카드X</span>`);
  else if (cardChk(p)) bs.push(`<span class="b yel">💳?</span>`);
  if (p.star) bs.push(`<span class="b star">⭐${esc(p.star)}</span>`);
  if (!p.ll) bs.push(p.mine ? `<span class="b">위치 없음</span>` : `<span class="b red">위치 확인 중</span>`);
  else if (p.chk === "approx") bs.push(`<span class="b yel">위치 대략</span>`);
  if (hasReel(p)) bs.push(`<span class="b pink">📱</span>`);
  return `<div class="row" data-open="${p.id}" role="button" tabindex="0">
    <div class="ric" style="--c:${c.col}">${c.ic}</div>
    <div class="rmain"><div class="rnm">${esc(p.n)} <small>${esc(p.l || "")}</small></div>
      <div class="rmeta">${meta}</div>
      ${bs.length ? `<div class="badges tight">${bs.join("")}</div>` : ""}</div>
    <button class="heart ${favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="찜">♥</button></div>`;
}

// ── 탭 ──
const TABS = ["map","plan","eat","snap","info"];
function go(tab, fromPop){
  if (!TABS.includes(tab)) tab = "map";
  if (picking && tab !== "map") endPick();
  $$("section.page").forEach(s => s.classList.toggle("on", s.id === "p-" + tab));
  document.body.classList.toggle("map-on", tab === "map");     // 지도 탭은 페이지 스크롤 없이 화면에 딱 맞게
  $$("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  closeSheet(true);
  if (location.hash !== "#" + tab) { if (fromPop || !location.hash) history.replaceState(null, "", "#" + tab); else history.pushState(null, "", "#" + tab); }
  if (tab === "map") setTimeout(() => {
    if (!map) return; map.invalidateSize();
    if (!mapViewSet) { mapViewSet = true; map.fitBounds(HK_VIEW); }
  }, 30);
  if (tab === "snap") setTimeout(() => { if (snapMap) { snapMap.invalidateSize(); if (snapBounds) snapMap.fitBounds(snapBounds, {padding: [24, 24], animate: false}); } }, 30);
  window.scrollTo(0, 0);
}

// ── 지도 탭: 지역(1개) + 종류(여러 개, OR) + 조건(여러 개, AND) ──
let map, cluster, markers = {}, meMarker = null, mapViewSet = false, listMode = false;
const HK_VIEW = [[22.274,114.135],[22.326,114.185]];
const MO_VIEW = [[22.135,113.535],[22.205,113.58]];
const MF = {
  region: "hk",
  cats: new Set(Object.keys(CATS)),   // 열 때마다 전체 보기
  conds: new Set(),
  q: "",
};
const COND = {
  fav:  {n:"♥ 찜", col:"#ff2fa0", f: p => favs.has(p.id)},
  must: {n:"🔴 예약 필수", col:"#ff4d5e", f: isMust},
  nocard: {n:"💳✕ 카드 안 됨", col:"#ff4d5e", f: noCard},
  reel: {n:"📱 릴스", col:"#b26bff", f: hasReel},
  mine: {n:"✏️ 내 장소", col:"#b6ff3b", f: p => !!p.mine},
};
function matchMap(p, needLL){
  if (needLL && !p.ll) return false;
  if (mapRegionOf(p) !== MF.region) return false;
  if (!MF.cats.has(p.c)) return false;
  for (const k of MF.conds) if (!COND[k].f(p)) return false;
  if (MF.q && !searchText(p).includes(MF.q.toLowerCase())) return false;
  return true;
}
const searchText = p => [p.n, p.l, ...(p.m||[]), (A[p.a]||{}).n, ...(p._tags||[]), p.ad, p.pay, noCard(p) ? "카드 안 됨 현금" : ""].join(" ").toLowerCase();
function tileLayer(){
  // OpenStreetMap 타일을 CSS로 어둡게 (키 필요 없음)
  return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, className: "dark-tiles",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
}
function pinIcon(p, sel){
  const c = CATS[p.c];
  return L.divIcon({className: "", iconSize: [30,30], iconAnchor: [15,15],
    html: `<div class="pin ${p.mine ? "mine" : ""} ${favs.has(p.id) ? "fav" : ""} ${sel ? "sel" : ""}" style="--c:${c.col}">${c.ic}${noCard(p) ? '<span class="nc">💵</span>' : ""}</div>`});
}
function mapSummary(n){
  const cats = Object.keys(CATS).filter(k => MF.cats.has(k));
  const catTxt = cats.length === Object.keys(CATS).length ? "전체 종류" : cats.map(k => CATS[k].n).join("·") || "종류 없음";
  const cond = [...MF.conds].map(k => COND[k].n).join(" · ");
  return `${MF.region === "hk" ? "홍콩" : "마카오"} › ${catTxt}${cond ? " › " + cond : ""}${MF.q ? ` › "${esc(MF.q)}"` : ""} · <b>${n}곳</b>`;
}
function renderMarkers(){
  if (!NOMAP) P.forEach(p => {
    const m = markers[p.id];
    const show = matchMap(p, true);
    if (show && !m) {
      const mk = L.marker(p.ll, {icon: pinIcon(p)}).on("click", () => openSheet(p.id));
      markers[p.id] = mk;
      cluster.addLayer(mk);
    } else if (!show && m) { cluster.removeLayer(m); delete markers[p.id]; }
  });
  const all = P.filter(p => matchMap(p, false));
  $("#mapcount").innerHTML = mapSummary(all.length) + (all.length ? "" : ` <button class="linkbtn" id="mapReset">조건 초기화</button>`);
  if (listMode) { renderMapList(all); placeList(); }
}
function renderMapList(all){
  all = all || P.filter(p => matchMap(p, false));
  const c = map && map.getCenter(), origin = myPos || (c ? [c.lat, c.lng] : null);
  if (origin) all.sort((a,b) => (a.ll ? km(origin, a.ll) : 999) - (b.ll ? km(origin, b.ll) : 999));
  $("#mapList").innerHTML = `<div class="tiny" style="margin:2px 2px 8px">${myPos ? "내 위치에서 직선거리순" : origin ? "지도 가운데에서 직선거리순" : "목록"} · 누르면 상세</div>`
    + (all.map(rowHTML).join("") || `<p class="muted">조건에 맞는 곳이 없어요. <button class="linkbtn" data-reset="map">조건 초기화</button></p>`);
}
let selId = null;
function openSheet(id, opts){
  const p = byId[id]; if (!p) return;
  if (selId && markers[selId]) markers[selId].setIcon(pinIcon(byId[selId]));
  selId = id;
  if (markers[id]) markers[id].setIcon(pinIcon(p, true));
  showSheet(cardHTML(p, Object.assign({mapBtn: !$("#p-map").classList.contains("on") || listMode}, opts || {})));
}
function showSheet(html){
  $("#sheet-body").innerHTML = html;
  if (!sheetOpen) history.pushState({sheet: true}, "", location.href);   // 폰 뒤로가기 = 카드 닫기
  sheetOpen = true;
  $("#sheet").classList.add("on"); $("#backdrop").classList.add("on");
  $("#sheet").scrollTop = 0;
}
let sheetOpen = false;
function closeSheet(silent){
  const was = sheetOpen; sheetOpen = false;
  if (was && !silent && history.state && history.state.sheet) history.back();
  $("#sheet").classList.remove("on"); $("#backdrop").classList.remove("on");
  if (selId && markers[selId]) markers[selId].setIcon(pinIcon(byId[selId]));
  selId = null;
}
function showOnMap(id){
  const p = byId[id]; if (!p) return;
  if (!p.ll) { openSheet(id, {note: "📍 아직 정확한 위치를 확인하지 못한 곳이라 지도에 핀이 없어요. '구글맵 열기'로 검색해 보세요."}); return; }
  mapViewSet = true;
  go("map");
  setListMode(false);
  if (NOMAP) { openSheet(id); return; }
  if (mapRegionOf(p) !== MF.region) setRegion(mapRegionOf(p), true);
  if (!matchMap(p, true)) { MF.cats.add(p.c); MF.conds.clear(); MF.q = ""; $("#mapQ").value = ""; syncChips(); renderMarkers(); }
  setTimeout(() => { map.invalidateSize(); map.setView(p.ll, 17, {animate: false}); openSheet(id); }, 60);
}
function setRegion(r, silent){
  MF.region = r;
  $$("#regionSeg button").forEach(b => b.classList.toggle("on", b.dataset.r === r));
  renderMarkers();
  if (!silent && map) map.fitBounds(r === "hk" ? HK_VIEW : MO_VIEW);
}
function syncChips(){
  const allOn = Object.keys(CATS).every(k => MF.cats.has(k));
  $$("#catChips .chip").forEach(ch => ch.classList.toggle("on", ch.dataset.all ? allOn : (!allOn && MF.cats.has(ch.dataset.k))));
  $$("#condChips .chip").forEach(ch => ch.classList.toggle("on", MF.conds.has(ch.dataset.k)));
}
function resetMap(){
  Object.keys(CATS).forEach(k => MF.cats.add(k)); MF.conds.clear(); MF.q = ""; $("#mapQ").value = ""; $("#mapQ").hidden = true; $("#searchBtn").classList.remove("on");
  syncChips(); renderMarkers();
}
function setListMode(on){
  listMode = on;
  $("#mapList").hidden = !on;
  $("#listBtn").classList.toggle("on", on);
  $("#listBtn").innerHTML = on ? '🗺<span class="t"> 지도</span>' : '📋<span class="t"> 목록</span>';
  if (on) { closeSheet(); $("#mapQ").hidden = false; $("#searchBtn").classList.add("on"); renderMapList(); placeList(); }
}
function showSearch(on){
  $("#mapQ").hidden = !on; $("#searchBtn").classList.toggle("on", on);
  if (on) $("#mapQ").focus(); else if (MF.q) { MF.q = ""; $("#mapQ").value = ""; renderMarkers(); }
  if (listMode) placeList();
}
const placeList = () => { $("#mapList").style.top = ($(".map-top").offsetHeight + 14) + "px"; };
window.addEventListener("resize", () => listMode && placeList());
function initMap(){
  if (NOMAP) { $("#map").innerHTML = '<p class="muted" style="padding:120px 20px;text-align:center">지도를 불러오지 못했어요. 신호가 좋은 곳에서 새로고침하면 다시 떠요.<br>📋 목록 버튼으로는 지금도 볼 수 있어요.</p>'; }
  else {
  map = L.map("map", {zoomControl: false, attributionControl: true, maxZoom: 19}).setView([22.29,114.16], 13);
  tileLayer().addTo(map);
  cluster = L.markerClusterGroup({maxClusterRadius: 38, disableClusteringAtZoom: 16, showCoverageOnHover: false, spiderfyOnMaxZoom: true,
    iconCreateFunction: c => L.divIcon({className: "", html: `<div class="cl">${c.getChildCount()}</div>`, iconSize: [36,36], iconAnchor: [18,18]})});
  map.addLayer(cluster);
  L.control.zoom({position: "bottomright"}).addTo(map);
  map.on("click", () => closeSheet());
  }
  $("#catChips").innerHTML = `<button class="chip all" data-all="1">전체</button>` +
    Object.entries(CATS).map(([k,c]) => `<button class="chip" data-k="${k}" style="--c:${c.col}">${c.ic} ${c.n}</button>`).join("");
  $("#condChips").innerHTML = Object.entries(COND).map(([k,c]) => `<button class="chip" data-k="${k}" style="--c:${c.col}">${c.n}</button>`).join("");
  $("#catChips").addEventListener("click", e => {
    const ch = e.target.closest(".chip"); if (!ch) return;
    if (ch.dataset.all) {
      Object.keys(CATS).forEach(k => MF.cats.add(k));                       // '전체'는 항상 모두 켜기
    } else {
      const k = ch.dataset.k, allOn = Object.keys(CATS).every(x => MF.cats.has(x));
      if (allOn) { MF.cats.clear(); MF.cats.add(k); }      // 전체 상태에서 누르면 그 종류만
      else { MF.cats.has(k) ? MF.cats.delete(k) : MF.cats.add(k); if (!MF.cats.size) Object.keys(CATS).forEach(x => MF.cats.add(x)); }
    }
    syncChips(); renderMarkers();
  });
  $("#condChips").addEventListener("click", e => {
    const ch = e.target.closest(".chip"); if (!ch) return;
    const k = ch.dataset.k; MF.conds.has(k) ? MF.conds.delete(k) : MF.conds.add(k);
    syncChips(); renderMarkers();
  });
  $("#mapQ").addEventListener("input", e => { MF.q = e.target.value.trim(); renderMarkers(); });
  $("#regionSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setRegion(b.dataset.r); });
  $("#locBtn").addEventListener("click", locate);
  $("#listBtn").addEventListener("click", () => setListMode(!listMode));
  $("#searchBtn").addEventListener("click", () => showSearch($("#mapQ").hidden));
  $("#addBtn").addEventListener("click", () => startPick({}));
  syncChips(); renderMarkers();
}
let myPos = null;
function locate(){
  if (!navigator.geolocation) return toast("위치 기능을 쓸 수 없어요");
  toast("내 위치 찾는 중…");
  navigator.geolocation.getCurrentPosition(pos => {
    myPos = [pos.coords.latitude, pos.coords.longitude];
    if (map) { if (meMarker) map.removeLayer(meMarker);
    meMarker = L.marker(myPos, {icon: L.divIcon({className:"", html:'<div class="me"></div>', iconSize:[16,16], iconAnchor:[8,8]}), zIndexOffset: 2000}).addTo(map);
    if ($("#p-map").classList.contains("on") && !listMode) map.setView(myPos, 16); }
    $("#locBtn").classList.add("on");
    refreshEat(); if (listMode) renderMapList();
  }, () => toast("위치 권한을 허용해 주세요"), {enableHighAccuracy: true, timeout: 10000});
}

// ── 예시 코스 탭 ──
function renderPlan(){
  $("#planList").innerHTML = window.DAYS.map((d, i) => {
    const open = i === 0 ? "open" : "";
    const items = d.items.map(it => {
      const p = it.p && byId[it.p];
      return `<li><div class="t">${esc(it.t)}</div><div>${esc(it.x)}
        ${p ? `<br><button class="go" data-onmap="${p.id}">📍 ${esc(p.n)} 지도</button>${noCard(p) ? ' <span class="b red">💳✕ 카드 안 됨</span>' : cardChk(p) ? ' <span class="b yel">💳? 확인 필요</span>' : ""}` : ""}</div></li>`;
    }).join("");
    return `<details class="day" ${open}>
      <summary><div class="dt">${esc(d.n)}<span>${esc(d.w)}</span></div>
      <div><div class="ttl">${esc(d.title)}</div></div></summary>
      ${d.note ? `<div class="note">${esc(d.note)}</div>` : ""}
      ${d.guide ? `<details class="acc dguide"><summary>${esc(d.guide.t)}</summary><div>${d.guide.h}</div></details>` : ""}
      ${d.snap ? `<div style="padding:0 14px"><button class="btn p" data-go="snap">📸 포토 동선 A·B·C·D 보기</button></div>` : ""}
      <ul class="tl">${items}</ul></details>`;
  }).join("");
}

// ── 먹기 탭: 지역/동네 → 종류 → 음식 → 조건 ──
const EAT = {cat: "all", area: "all", sort: "area", q: "", tags: new Set(), tog: new Set()};
const EATC = {
  fav:  {n:"♥ 찜", col:"#ff2fa0", f: p => favs.has(p.id)},
  must: {n:"🔴 예약 필수", col:"#ff4d5e", f: isMust},
  rec:  {n:"예약 권장·가능", col:"#ffb02e", f: isRecommend},
  nocard: {n:"💳✕ 카드 안 됨", col:"#ff4d5e", f: noCard},
  card: {n:"💳 카드 OK", col:"#b6ff3b", f: p => p.cd === true},
  star: {n:"⭐ 미쉐린", col:"#ffd84d", f: p => !!p.star},
  reel: {n:"📱 릴스", col:"#b26bff", f: hasReel},
  mine: {n:"✏️ 내 장소", col:"#b6ff3b", f: p => !!p.mine},
};
const AREA_ORDER = ["sw","ct","kt","adm","wc","cwb","np","peak","south","tst","ymt","mk","ssp","wts","kwt","mpen","taipa","col","air","lantau"];
function eatList(){
  return P.filter(p => ["food","cafe","bar"].includes(p.c))
    .filter(p => EAT.cat === "all" || p.c === EAT.cat)
    .filter(p => EAT.area === "all" || (EAT.area.startsWith("rg:") ? regionOf(p) === EAT.area.slice(3) : p.a === EAT.area))
    .filter(p => !EAT.tags.size || p._tags.some(t => EAT.tags.has(t)))
    .filter(p => [...EAT.tog].every(k => EATC[k].f(p)))
    .filter(p => !EAT.q || searchText(p).includes(EAT.q.toLowerCase()));
}
function refreshEat(){
  const list = eatList();
  const areaIdx = p => { const i = AREA_ORDER.indexOf(p.a); return i < 0 ? 99 : i; };
  if (EAT.sort === "name") list.sort((a,b) => a.n.localeCompare(b.n, "ko"));
  else if (EAT.sort === "price") list.sort((a,b) => (a.p ? a.p[0] : 9999) - (b.p ? b.p[0] : 9999));
  else if (EAT.sort === "me" && myPos) list.sort((a,b) => (a.ll ? km(myPos, a.ll) : 999) - (b.ll ? km(myPos, b.ll) : 999));
  else list.sort((a,b) => areaIdx(a) - areaIdx(b) || a.n.localeCompare(b.n, "ko"));
  // 현재 조건 요약
  const areaTxt = EAT.area === "all" ? "전체 지역" : EAT.area.startsWith("rg:") ? REGIONS[EAT.area.slice(3)] : `${REGIONS[(A[EAT.area]||{}).rg]} › ${A[EAT.area].n}`;
  const parts = [areaTxt, EAT.cat === "all" ? null : {food:"맛집",cafe:"카페·디저트",bar:"바"}[EAT.cat], [...EAT.tags].join("·") || null, [...EAT.tog].map(k => EATC[k].n).join(" · ") || null, EAT.q ? `"${EAT.q}"` : null].filter(Boolean);
  const sortTxt = {area:"동네순", me: myPos ? "내 위치에서 직선거리순" : "동네순 (위치 권한을 허용하면 거리순)", name:"이름순", price:"가격 낮은 순"}[EAT.sort];
  $("#eatCount").innerHTML = `${esc(parts.join(" › "))} · <b>${list.length}곳</b> · ${sortTxt}${EAT.sort === "me" && myPos ? " (바다 건너는 곳은 실제로 더 걸려요)" : ""} <button class="linkbtn" data-reset="eat">조건 초기화</button>`;
  const area = A[EAT.area];
  $("#eatCourse").innerHTML = area && area.course ? `<div class="callout"><b>${esc(area.n)} 주변 코스</b><br>${esc(area.course)}</div>` : "";
  $("#eatList").innerHTML = list.map(rowHTML).join("") || `<p class="muted">조건에 맞는 곳이 없어요. <button class="linkbtn" data-reset="eat">조건 초기화</button></p>`;
}
function resetEat(){
  EAT.cat = "all"; EAT.area = "all"; EAT.q = ""; EAT.tags.clear(); EAT.tog.clear();
  $("#eatArea").value = "all"; $("#eatQ").value = "";
  $$("#eatCat button").forEach(x => x.classList.toggle("on", x.dataset.c === "all"));
  $$("#eatTags .chip, #eatTog .chip").forEach(x => x.classList.remove("on")); $("#tagSel").textContent = "";
  refreshEat();
}
function initEat(){
  const used = new Set(P.filter(p => ["food","cafe","bar"].includes(p.c)).map(p => p.a));
  let opts = `<option value="all">전체 지역</option>`;
  Object.entries(REGIONS).forEach(([rg, rn]) => {
    const areas = AREA_ORDER.filter(a => used.has(a) && A[a].rg === rg);
    if (!areas.length) return;
    opts += `<optgroup label="${rn}"><option value="rg:${rg}">${rn} 전체</option>` + areas.map(a => `<option value="${a}">${esc(A[a].n)}</option>`).join("") + `</optgroup>`;
  });
  $("#eatArea").innerHTML = opts;
  $("#eatArea").onchange = e => { EAT.area = e.target.value; refreshEat(); };
  $("#eatSort").onchange = e => { EAT.sort = e.target.value; if (EAT.sort === "me" && !myPos) locate(); refreshEat(); };
  $("#eatQ").oninput = e => { EAT.q = e.target.value.trim(); refreshEat(); };
  $("#eatCat").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    EAT.cat = b.dataset.c; $$("#eatCat button").forEach(x => x.classList.toggle("on", x === b)); refreshEat();
  });
  const tagCount = {};
  P.forEach(p => p._tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
  $("#eatTags").innerHTML = [...FOOD_TAGS.map(([n]) => n), "바"].filter(t => tagCount[t]).map(t => `<button class="chip" data-t="${t}" style="--c:#22e6ff">${t} <span class="tiny">${tagCount[t]}</span></button>`).join("");
  $("#eatTags").addEventListener("click", e => {
    const ch = e.target.closest(".chip"); if (!ch) return;
    const t = ch.dataset.t; EAT.tags.has(t) ? EAT.tags.delete(t) : EAT.tags.add(t);
    ch.classList.toggle("on", EAT.tags.has(t)); refreshEat();
    $("#tagSel").textContent = EAT.tags.size ? `· ${[...EAT.tags].join(", ")}` : "";
  });
  $("#eatTog").innerHTML = Object.entries(EATC).map(([k,c]) => `<button class="chip" data-k="${k}" style="--c:${c.col}">${c.n}</button>`).join("");
  $("#eatTog").addEventListener("click", e => {
    const ch = e.target.closest(".chip"); if (!ch) return;
    const k = ch.dataset.k; EAT.tog.has(k) ? EAT.tog.delete(k) : EAT.tog.add(k);
    ch.classList.toggle("on", EAT.tog.has(k)); refreshEat();
  });
  refreshEat();
}

// ── 포토 동선 탭 ──
let snapBounds = null, snapMap, snapLayer, snapPlan = store.get("snapPlan", "A");
const LIGHT = {day:"낮", golden:"골든아워", blue:"블루아워", night:"밤"};
const stopLL = s => s.ll || (byId[s.p] && byId[s.p].ll);
const stopName = s => s.n || byId[s.p].n;
const stopUrl = s => s.ll ? llUrl(s.ll) : gmapUrl(byId[s.p]);   // 지정 촬영 지점이면 그 좌표로
function planStats(plan){
  let walkD = 0, walkM = 0, moveM = 0;
  const legs = plan.stops.map((s, i) => {
    const a = stopLL(s), nx = plan.stops[i+1], b = nx && stopLL(nx);
    if (!b || !a) return null;
    const d = km(a, b);
    let txt, m;
    if (s.leg === "ferry") { m = 9; txt = `⛴ 스타페리 약 9분 + 배 기다리기 5~10분 · ${d.toFixed(1)}km`; }
    else if (s.leg === "taxi") { m = taxiMin(d) + 3; txt = `🚕 택시 약 ${m}분 (잡고 타고 내리는 시간 포함) · 또는 🚶 도보 약 ${walkMin(d)}분`; }
    else if (s.wm) { m = s.wm; walkD += s.wd/1000; walkM += m; txt = `🚶 도보 약 ${m}분 · ${s.wd >= 1000 ? (s.wd/1000).toFixed(1) + "km" : s.wd + "m"} (구글맵 경로)`; }   // 직선 추정과 실제 길이 크게 다를 때
    else { m = walkMin(d); walkD += d*1.3; walkM += m; txt = `🚶 도보 약 ${m}분 · ${(d*1.3*1000).toFixed(0)}m`; }
    moveM += m;
    return {txt, m, d};
  });
  return {legs, walkD, walkM, moveM};
}
function renderSnap(){
  const plan = window.SNAP.plans.find(p => p.k === snapPlan);
  $$("#snapSeg button").forEach(b => b.classList.toggle("on", b.dataset.k === snapPlan));
  $("#snapSeg").style.setProperty("--c", plan.col);
  const st = planStats(plan);
  $("#snapHead").innerHTML = `<div class="callout"><b>${plan.k}안 · ${esc(plan.name)}</b><br><span class="muted">${esc(plan.tag)} · 시작: ${esc(plan.start)}</span></div>
    <div class="stat"><div><b>${plan.stops.length}곳</b><span>스팟${plan.stops.some(s => s.opt) ? " (선택 포함)" : ""}</span></div>
    <div><b>${(st.walkD).toFixed(1)}km</b><span>걷는 거리</span></div>
    <div><b>${st.moveM}분</b><span>이동 합계 (대기 제외)</span></div></div>`;
  if (snapMap) {
  if (snapLayer) snapMap.removeLayer(snapLayer);
  snapLayer = L.layerGroup().addTo(snapMap);
  const pts = plan.stops.map(stopLL);
  plan.stops.forEach((s, i) => {
    const a = stopLL(s), b = plan.stops[i+1] && stopLL(plan.stops[i+1]);
    if (b) L.polyline([a, b], {color: s.leg === "ferry" ? "#22e6ff" : plan.col, weight: 4, opacity: .9, dashArray: s.leg === "walk" ? null : "8 8"}).addTo(snapLayer);
  });
  plan.stops.forEach((s, i) => {
    L.marker(stopLL(s), {icon: L.divIcon({className:"", html:`<div class="num ${s.opt ? "opt" : ""}" style="--c:${plan.col}">${i+1}</div>`, iconSize:[28,28], iconAnchor:[14,14]})})
      .bindTooltip(`${s.t} ${stopName(s)}`, {direction:"top", offset:[0,-14], className:"lbl"}).addTo(snapLayer);
  });
  snapBounds = L.latLngBounds(pts);
  snapMap.invalidateSize(); snapMap.fitBounds(snapBounds, {padding: [24, 24], animate: false});
  }
  $("#snapStops").innerHTML = plan.stops.map((s, i) => {
    const leg = st.legs[i];
    return `<li><div class="n"><div class="num ${s.opt ? "opt" : ""}" style="--c:${plan.col};cursor:pointer" data-zoom="${i}" role="button" aria-label="${i+1}번 지도 확대">${i+1}</div></div>
      <div class="box"><b>${esc(s.t)}</b> <span class="light ${s.light}">${LIGHT[s.light]}</span>${s.opt ? ` <span class="b yel">선택 · 늦으면 건너뛰기</span>` : ""}
      <div style="font-weight:800;margin-top:3px">${esc(stopName(s))}</div>
      <div class="muted" style="font-size:13.5px">${esc(s.x)}</div>
      <div class="btns" style="margin-top:8px"><a class="btn p" href="${stopUrl(s)}" target="_blank" rel="noopener">${s.ll ? "촬영 지점 지도" : "구글맵"}</a><button class="btn" data-snapinfo="${i}">정보</button></div></div>
      ${leg ? `<div class="leg">${leg.txt}</div>` : ""}</li>`;
  }).join("") + `<li><div class="n"><div class="num" style="--c:#fff">🍽</div></div><div class="box"><b>19:00 동선 끝 → 저녁</b>
     <div class="muted" style="font-size:13.5px">${plan.dinner.map(id => byId[id]).filter(Boolean).map(p => `<button class="go" data-onmap="${p.id}">${esc(p.n)}${isMust(p) ? " (예약 필수)" : ""}</button>`).join(" · ")}</div></div></li>`;
  $("#snapHair").innerHTML = `<b>⏱ 현실성 체크</b><br>${esc(plan.note || "")}${plan.link ? `<br><a href="${plan.link[1]}" target="_blank" rel="noopener">${esc(plan.link[0])}</a>` : ""}`;
}
function snapText(){
  const plan = window.SNAP.plans.find(p => p.k === snapPlan);
  return `[홍콩 포토 동선 ${plan.k}안] ${window.SNAP.info}\n` +
    plan.stops.map((s,i) => `${i+1}. ${s.t} ${stopName(s)}${s.opt ? " (선택)" : ""} — ${s.x}\n   지도: ${stopUrl(s)}`).join("\n");
}
function initSnap(){
  const S = window.SNAP;
  $("#snapInfo").textContent = S.info;
  $("#snapSeg").innerHTML = S.plans.map(p => `<button data-k="${p.k}" style="--c:${p.col}">${p.k}안</button>`).join("");
  $("#snapSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; snapPlan = b.dataset.k; store.set("snapPlan", snapPlan); renderSnap(); });
  if (!NOMAP) { snapMap = L.map("snapMap", {zoomControl: true, attributionControl: true, scrollWheelZoom: false}); tileLayer().addTo(snapMap); }
  else $("#snapMap").innerHTML = '<p class="muted" style="padding:120px 20px;text-align:center">지도를 불러오지 못했어요 (시간표는 아래에 있어요)</p>';
  $("#copyPlan").onclick = async () => {
    try { await navigator.clipboard.writeText(snapText()); toast("동선을 복사했어요"); }
    catch(e){ prompt("복사해서 쓰세요", snapText()); }
  };
  renderSnap();
}

// ── 정보 탭 ──
const INFO_GROUPS = [["prep","🧳 출발 전 준비"],["local","🚇 현지 교통·결제"],["safe","🆘 비상·주의"],["ref","📚 참고 자료"]];
let reelFilter = "전체", reelQ = "";
function renderReels(){
  const nums = Object.keys(R).map(Number).sort((a,b) => a-b)
    .filter(n => reelFilter === "전체" || R[n].g === reelFilter)
    .filter(n => { if (!reelQ) return true; const ps = P.filter(p => (p.s||[]).includes(n)).map(p => p.n + p.l).join(" "); return (R[n].t + R[n].a + ps).toLowerCase().includes(reelQ.toLowerCase()); });
  const linked = n => P.filter(p => (p.s || []).includes(n)).map(p => `<button class="go" data-onmap="${p.id}">${esc(p.n)}${p.ll ? "" : " (위치 확인 중)"}</button>`).join(" · ");
  $("#reelList").innerHTML = nums.map(n => { const r = R[n]; return `<div class="reelrow"><span class="g">${esc(r.g)}</span><div>${r.u ? `<a href="${r.u}" target="_blank" rel="noopener">${esc(r.t)}</a>` : esc(r.t) + ' <span class="tiny">(링크 없는 캡션)</span>'} <span class="tiny">${esc(r.a)}</span>${linked(n) ? `<br><span class="tiny">→ </span>${linked(n)}` : ""}</div></div>`; }).join("") || `<p class="muted">없어요.</p>`;
}
function nocardBox(s){
  const eat = P.filter(isEatery);
  const no = eat.filter(noCard), chk = eat.filter(cardChk);
  const grp = list => Object.entries(REGIONS).map(([rg, rn]) => {
    const ps = list.filter(p => regionOf(p) === rg);
    return ps.length ? `<p class="tiny" style="margin:10px 0 4px"><b>${rn}</b> · ${ps.length}곳</p>${ps.map(rowHTML).join("")}` : "";
  }).join("");
  return `<details class="acc"><summary>${s.ic} ${esc(s.t)} · ${no.length}곳</summary><div>
    <p>트래블카드(Visa)로 결제가 <b>안 되는</b> 식당·카페예요. 현금(또는 옥토퍼스)을 챙기세요. 지도 핀에는 💵, 먹기 탭에는 <b>💳✕ 카드 안 됨</b> 필터가 있어요.</p>
    <p class="tiny">'알리페이' 표시가 있으면 카카오페이·네이버페이·토스(알리페이플러스)로 될 수도 있어요 — 가게 단말에 따라 달라요.</p>
    ${grp(no)}
    <p style="margin-top:14px"><b>💳? 확인 필요 ${chk.length}곳</b> — 자료가 엇갈리거나 결제 정보가 없어요. 현금도 같이 챙기면 안전해요.</p>
    ${grp(chk)}
    <p class="tiny" style="margin-top:10px">출처: OpenRice 결제수단 + 구글맵 결제 정보 (2026-10-10 확인). 가게 사정으로 바뀔 수 있어요.</p>
  </div></details>`;
}
function renderInfo(){
  const done = new Set(store.get("infoCheck", []));
  const acc = s => {
    const si = window.INFO.indexOf(s);
    let body = s.h || "";
    if (s.dyn === "nocard") return nocardBox(s);
    if (s.dyn === "a2hs") return a2hsBox(s);
    if (s.check) body = `<div class="check">${s.check.map((c,i) => `<label><input type="checkbox" data-k="${si}-${i}" ${done.has(si+"-"+i) ? "checked" : ""}> <span>${esc(c)}</span></label>`).join("")}</div><p class="tiny">체크는 이 폰에만 저장돼요.</p>`;
    return `<details class="acc"><summary>${s.ic} ${esc(s.t)}</summary><div>${body}</div></details>`;
  };
  const gs = [...new Set(Object.values(R).map(r => r.g))];
  const reelBox = `<details class="acc"><summary>🎬 릴스 보관함 (${Object.keys(R).length})</summary><div>
    <div class="chips wrap" id="reelChips">${["전체", ...gs].map(g => `<button class="chip ${g === "전체" ? "on" : ""}" data-g="${g}" style="--c:#b26bff">${g}</button>`).join("")}</div>
    <input class="search" id="reelQ" placeholder="릴스·연결 장소 검색" style="margin:6px 0">
    <div id="reelList"></div></div></details>`;
  const rv = window.REVIEWS.map(r => `<div class="reelrow"><span class="g">${r[0]}</span><div><a href="${r[3]}" target="_blank" rel="noopener">${esc(r[1])}</a> <span class="tiny">${r[2]}</span></div></div>`).join("");
  const rvBox = `<details class="acc"><summary>📝 최근 후기·영상</summary><div><p class="tiny">날짜는 검색 결과 기준이라 원문과 다를 수 있어요.</p>${rv}</div></details>`;
  $("#infoList").innerHTML = `<h3 class="grp">✏️ 내가 추가한 장소</h3><div id="mineBox"></div>` + INFO_GROUPS.map(([g, title]) => {
    const items = window.INFO.filter(s => (s.grp || "ref") === g).map(acc).join("") + (g === "ref" ? reelBox + rvBox : "");
    return `<h3 class="grp">${title}</h3>${items}`;
  }).join("");
  renderMine();
  renderReels();
  const swEl = $("#swState");
  if (swEl) swEl.textContent = (navigator.serviceWorker && navigator.serviceWorker.controller) ? "✅ 오프라인 준비됨" : "⏳ 준비 중 — 다음에 열면 완료";
  $("#infoList").addEventListener("change", e => { const k = e.target.dataset.k; if (!k) return; e.target.checked ? done.add(k) : done.delete(k); store.set("infoCheck", [...done]); });
  $("#reelChips").addEventListener("click", e => { const ch = e.target.closest(".chip"); if (!ch) return; reelFilter = ch.dataset.g; $$("#reelChips .chip").forEach(x => x.classList.toggle("on", x === ch)); renderReels(); });
  $("#reelQ").addEventListener("input", e => { reelQ = e.target.value.trim(); renderReels(); });
}

// ── 전역 클릭 ──
document.addEventListener("click", e => {
  if (e.target.closest("[data-a2open]")) { a2hsOpen(); return; }
  if (mineClick(e)) return;
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    e.stopPropagation();
    const id = fav.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id); saveFav();
    $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle("on", favs.has(id)));
    toast(favs.has(id) ? "찜했어요 ♥" : "찜 해제");
    renderMarkers(); refreshEat();                               // 찜 조건이 켜져 있으면 바로 반영
    if (markers[id]) markers[id].setIcon(pinIcon(byId[id], selId === id));
    return;
  }
  const rs = e.target.closest("[data-reset], #mapReset");
  if (rs) { (rs.dataset.reset === "eat") ? resetEat() : resetMap(); return; }
  const om = e.target.closest("[data-onmap]");
  if (om) { showOnMap(om.dataset.onmap); return; }
  const op = e.target.closest("[data-open]");
  if (op) { openSheet(op.dataset.open); return; }
  const zm = e.target.closest("[data-zoom]");
  if (zm) { const plan = window.SNAP.plans.find(p => p.k === snapPlan); const s = plan.stops[+zm.dataset.zoom];
    if (snapMap) snapMap.setView(stopLL(s), 17); $("#snapMap").scrollIntoView({behavior: "smooth", block: "center"}); return; }
  const si = e.target.closest("[data-snapinfo]");
  if (si) { const plan = window.SNAP.plans.find(p => p.k === snapPlan); const s = plan.stops[+si.dataset.snapinfo];
    openSheet(s.p, {note: s.ll ? `📸 촬영 지점: <b>${esc(stopName(s))}</b> — 아래 장소 카드와 위치가 조금 달라요. <a href="${stopUrl(s)}" target="_blank" rel="noopener">촬영 지점 지도 열기</a>` : ""}); return; }
  const g = e.target.closest("[data-go]");
  if (g) { go(g.dataset.go); return; }
  const t = e.target.closest("nav.tabs button");
  if (t) go(t.dataset.tab);
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-open]")) { e.preventDefault(); openSheet(e.target.dataset.open); }
});
$("#sheetX").addEventListener("click", () => closeSheet());
$("#backdrop").addEventListener("click", () => closeSheet());
// 카드 위쪽에서 아래로 쓸어내리면 닫기
(() => {
  const sh = $("#sheet"); let y0 = null;
  sh.addEventListener("touchstart", e => { y0 = sh.scrollTop <= 0 && !e.target.closest("input,textarea,select") ? e.touches[0].clientY : null; }, {passive: true});
  sh.addEventListener("touchmove", e => {
    if (y0 === null) return;
    const dy = e.touches[0].clientY - y0;
    if (dy > 0) sh.style.transform = `translateY(${dy}px)`;
  }, {passive: true});
  sh.addEventListener("touchend", e => {
    if (y0 === null) return;
    const dy = e.changedTouches[0].clientY - y0; y0 = null; sh.style.transform = "";
    if (dy > 90) closeSheet();
  });
})();

// ── 홈 화면에 추가 안내 ──
// 아이폰 사파리는 설치 창을 직접 띄울 수 없어서 '공유 → 홈 화면에 추가'를 안내. 홈 화면 앱(standalone)으로 열리면 안 띄움.
const UA = navigator.userAgent || "";
const isIOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () => navigator.standalone === true || !!(window.matchMedia && matchMedia("(display-mode: standalone)").matches);
const inAppUA = /KAKAOTALK|Instagram|NAVER|FBAN|FBAV|Line\//i.test(UA);
const SHARE_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></svg>';
const ADD_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
let bip = null;   // 안드로이드 크롬 설치 이벤트
function a2hsSteps(){
  if (isStandalone()) return `<p>✅ 지금 홈 화면 앱으로 열려 있어요.</p>`;
  if (inAppUA) return `<ol class="a2steps"><li>카카오톡·인스타 앱 안에서는 홈 화면에 추가가 안 돼요</li>
    <li>화면 아래(또는 위) <b>⋯</b> → <b>다른 브라우저로 열기</b> → <b>Safari</b></li><li>Safari에서 열리면 이 안내가 다시 떠요</li></ol>`;
  if (isIOS) {
    const other = /CriOS|EdgiOS|FxiOS/.test(UA);
    return `<ol class="a2steps">
      <li>${other ? "주소창 오른쪽" : "Safari 주소창 옆"} <b class="ico">${SHARE_SVG} 공유</b> 버튼${other ? "" : '<br><span class="tiny">안 보이면 <b>⋯</b> 버튼 → <b>공유</b></span>'}</li>
      <li>목록을 조금 내려 <b class="ico">${ADD_SVG} 홈 화면에 추가</b></li>
      <li>오른쪽 위 <b>추가</b> → 홈 화면에 <b>HK Pocket</b> 아이콘이 생겨요</li></ol>`;
  }
  if (bip) return `<p>아래 <b>설치</b>를 누르면 홈 화면에 아이콘이 생겨요.</p>`;
  return `<ol class="a2steps"><li>크롬 오른쪽 위 <b>⋮</b> 메뉴</li><li><b>홈 화면에 추가</b> (또는 <b>앱 설치</b>)</li><li><b>추가</b>를 누르면 끝</li></ol>`;
}
function a2hsOpen(){
  if ($("#a2hs")) return;
  const el = document.createElement("div");
  el.id = "a2hs"; el.className = "a2hs";
  el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "홈 화면에 추가하기");
  el.innerHTML = `<div class="a2card">
    <button class="x" data-a2="later" aria-label="닫기">✕</button>
    <div class="a2top"><img src="apple-touch-icon.png" alt="" width="58" height="58"><div><b>📲 홈 화면에 추가하기</b><span>아이콘을 누르면 앱처럼 바로 열려요 (주소창 없이 전체 화면)</span></div></div>
    ${a2hsSteps()}
    ${isIOS && !isStandalone() ? '<p class="tiny">아이폰은 홈 화면 앱의 저장공간이 사파리와 따로라서 찜은 따로 저장돼요.</p>' : ""}
    <div class="btns">${bip ? '<button class="btn p" data-a2="install">설치</button>' : ""}<button class="btn ${bip ? "" : "p"}" data-a2="later">나중에</button><button class="btn" data-a2="never">다시 보지 않기</button></div>
  </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("on"));
  el.addEventListener("click", async e => {
    const b = e.target.closest("[data-a2]");
    const a = b ? b.dataset.a2 : (e.target === el ? "later" : null);
    if (!a) return;
    if (a === "install" && bip) { bip.prompt(); try { await bip.userChoice; } catch(_){} bip = null; }
    if (a === "never") store.set("a2hsOff", true);
    try { sessionStorage.setItem("hkguide.a2hsShown", "1"); } catch(_){}
    el.classList.remove("on"); setTimeout(() => el.remove(), 220);
  });
}
function a2hsBox(s){
  return `<details class="acc"><summary>${s.ic} ${esc(s.t)}</summary><div>
    ${isStandalone() ? "<p>✅ 지금 홈 화면 앱으로 보고 있어요.</p>" : ""}
    <p><b>아이폰 (Safari)</b></p>
    <ol class="a2steps"><li><b class="ico">${SHARE_SVG} 공유</b> 버튼 (안 보이면 <b>⋯</b> → 공유)</li><li><b class="ico">${ADD_SVG} 홈 화면에 추가</b></li><li>오른쪽 위 <b>추가</b></li></ol>
    <p><b>안드로이드 (크롬)</b></p>
    <ol class="a2steps"><li>오른쪽 위 <b>⋮</b></li><li><b>홈 화면에 추가</b> 또는 <b>앱 설치</b></li><li><b>추가</b></li></ol>
    <ul><li>카카오톡·인스타 안에서 열었으면 먼저 <b>다른 브라우저로 열기</b> (아이폰은 Safari)</li>
    <li>아이폰은 홈 화면 앱 저장공간이 따로라 찜이 따로 저장돼요</li></ul>
    <p><b>📴 오프라인 (신호 없을 때)</b> <span id="swState" class="tiny"></span></p>
    <ul><li>한 번 열어 두면 <b>데이터가 끊겨도</b> 코스·맛집·포토 동선·정보·릴스 목록이 그대로 열려요</li>
    <li>지도 <b>바탕 그림</b>만 인터넷이 필요해요 — 핀·목록·장소 카드는 보이고, 바탕은 회색</li>
    <li>길찾기까지 오프라인으로 쓰려면 <b>구글맵 앱</b>에서 홍콩·마카오 지역을 '오프라인 지도'로 받아 두세요</li></ul>
    <div class="btns"><button class="btn p" data-a2open>📲 안내 팝업 다시 보기</button></div>
  </div></details>`;
}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); bip = e;
  let shown = false; try { shown = sessionStorage.getItem("hkguide.a2hsShown") === "1"; } catch(_){}
  if (!isStandalone() && !store.get("a2hsOff", false) && !shown) setTimeout(a2hsOpen, 800);
});
window.addEventListener("appinstalled", () => { const el = $("#a2hs"); if (el) el.remove(); });

// ── 내 장소 추가·고치기·지우기 ──
let picking = null;          // 지도에서 위치 고르는 중: {draft, back}
let formDraft = null;        // 열려 있는 입력 폼의 값
function startPick(draft, back){
  if (NOMAP) { openMineForm(draft || {}); return; }      // 지도가 없으면 위치 없이 바로 입력
  go("map"); setListMode(false);
  picking = {draft: draft || {}, back: !!back};
  $(".map-wrap").classList.add("picking");
  setTimeout(() => {
    map.invalidateSize();
    if (draft && draft.ll) map.setView(draft.ll, 17);
    else if (map.getZoom() < 16) map.setZoom(16);
  }, 60);
}
function endPick(){ picking = null; $(".map-wrap").classList.remove("picking"); }
function mineFormHTML(d){
  const cats = Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${(d.c || "food") === k ? "selected" : ""}>${c.ic} ${c.n}</option>`).join("");
  const cd = d.cd === true ? "y" : d.cd === false ? "n" : "";
  return `<div class="mform">
    <div class="nm">${d.id ? "✏️ 내 장소 고치기" : "＋ 내 장소 추가"}</div>
    <p class="tiny">이 폰 브라우저에만 저장돼요. 정보 탭에서 파일로 내보낼 수 있어요.</p>
    <label for="mfN">이름</label><input class="search" id="mfN" maxlength="60" value="${esc(d.n || "")}" placeholder="예: 숙소 앞 완탕집" autocomplete="off">
    <label for="mfC">종류</label><select id="mfC">${cats}</select>
    <label for="mfT">메모</label><textarea class="search" id="mfT" rows="3" maxlength="1000" placeholder="메뉴·가격·영업시간·팁 (줄마다 한 가지)">${esc((d.t || []).join("\n"))}</textarea>
    <label for="mfCd">카드 결제</label><select id="mfCd"><option value="">모름</option><option value="y" ${cd === "y" ? "selected" : ""}>💳 카드 OK</option><option value="n" ${cd === "n" ? "selected" : ""}>💳✕ 카드 안 됨 (현금)</option></select>
    <label>위치</label><div class="tiny">${d.ll ? `📍 지도에서 고른 곳 (${d.ll[0].toFixed(5)}, ${d.ll[1].toFixed(5)})` : "위치 없음 — 목록에만 보여요"}</div>
    ${NOMAP ? "" : `<div class="btns"><button class="btn" data-mine="repick">📍 지도에서 ${d.ll ? "다시 " : ""}고르기</button></div>`}
    <div class="btns"><button class="btn p" data-mine="save">저장</button><button class="btn" data-mine="cancel">취소</button></div>
  </div>`;
}
function openMineForm(d){ formDraft = Object.assign({}, d); showSheet(mineFormHTML(formDraft)); }
function readMineForm(){
  return Object.assign({}, formDraft, {
    n: $("#mfN").value.trim(), c: $("#mfC").value,
    t: $("#mfT").value.split("\n").map(s => s.trim()).filter(Boolean),
    cd: {y: true, n: false}[$("#mfCd").value],
  });
}
function removeMineFromP(id){
  const i = P.findIndex(p => p.id === id && p.mine);
  if (i >= 0) P.splice(i, 1);
  delete byId[id];
  if (markers[id]) { cluster.removeLayer(markers[id]); delete markers[id]; }
}
function upsertMine(it){
  const i = mine.findIndex(m => m.id === it.id);
  if (i >= 0) mine[i] = it; else mine.push(it);
  removeMineFromP(it.id); addMineToP(it);
}
function refreshMine(){ renderMarkers(); refreshEat(); renderMine(); }
function saveMineForm(){
  const d = readMineForm();
  if (!d.n) { toast("이름을 적어 주세요"); $("#mfN").focus(); return; }
  const g = d.ll ? guessArea(d.ll) : {a: null, r: MF.region === "macau" ? "macau" : "hk"};
  const it = cleanMine(Object.assign({}, d, {a: g.a, r: g.r}));
  upsertMine(it); saveMine();
  closeSheet(true);
  if (it.ll && map && mapRegionOf(it) !== MF.region) setRegion(mapRegionOf(it), true);
  refreshMine();
  if (it.ll) showOnMap(it.id); else openSheet(it.id);
  toast("저장했어요 · 이 폰에만 저장돼요");
}
function deleteMine(id){
  const p = byId[id]; if (!p || !p.mine) return;
  if (!confirm(`'${p.n}'을(를) 내 장소에서 지울까요?`)) return;
  mine = mine.filter(m => m.id !== id); saveMine();
  removeMineFromP(id);
  if (favs.has(id)) { favs.delete(id); saveFav(); }
  closeSheet(); refreshMine(); toast("지웠어요");
}
function renderMine(){
  const el = $("#mineBox"); if (!el) return;
  const list = P.filter(p => p.mine);
  el.innerHTML = `<div class="card">
    <p style="margin:0 0 8px">가이드에 없는 곳을 직접 넣어 쓸 수 있어요. 지도·먹기 탭에 같이 보이고, <b>이 폰 브라우저에만</b> 저장돼요.</p>
    ${list.length ? list.map(rowHTML).join("") : '<p class="tiny">아직 추가한 곳이 없어요. 지도 탭 오른쪽 위 <b>＋</b> 버튼으로도 넣을 수 있어요.</p>'}
    <div class="btns"><button class="btn p" data-mine="add">＋ 지도에서 추가</button></div>
    <div class="btns"><button class="btn" data-mine="export" ${list.length ? "" : "disabled"}>⬇ 파일로 내보내기</button><button class="btn" data-mine="import">⬆ 파일 불러오기</button></div>
    <p class="tiny">폰을 바꾸거나 같이 여행하는 사람과 나누려면 파일로 내보낸 뒤 그 폰에서 불러오기 하세요. 모두에게 알려 주고 싶은 곳은 <a href="https://github.com/effortball-cloud/hk-guide/issues" target="_blank" rel="noopener">GitHub Issues</a>로 제보해 주세요.</p>
    <input type="file" id="mineFile" accept=".json,application/json" hidden></div>`;
}
async function exportMine(){
  if (!mine.length) { toast("내보낼 장소가 없어요"); return; }
  const day = new Date().toISOString().slice(0, 10);
  const json = JSON.stringify({app: "hk-pocket-guide", v: 1, exported: day, places: mine}, null, 1);
  const name = `hk-pocket-my-places-${day}.json`;
  const file = new File([json], name, {type: "application/json"});
  if (navigator.maxTouchPoints > 0 && navigator.canShare && navigator.canShare({files: [file]})) {
    try { await navigator.share({files: [file], title: "HK Pocket 내 장소"}); return; }
    catch (e) { if (e && e.name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast("파일로 저장했어요");
}
function importMine(file){
  const fr = new FileReader();
  fr.onload = () => {
    let data; try { data = JSON.parse(fr.result); } catch (e) { toast("파일을 읽지 못했어요"); return; }
    const arr = Array.isArray(data) ? data : data && data.places;
    if (!Array.isArray(arr)) { toast("내 장소 파일이 아니에요"); return; }
    let n = 0;
    arr.slice(0, 500).forEach(x => {
      const it = cleanMine(x); if (!it) return;
      if (it.ll && !it.a) { const g = guessArea(it.ll); if (g.a) it.a = g.a; it.r = g.r; }
      upsertMine(it); n++;
    });
    saveMine(); refreshMine();
    toast(n ? `${n}곳 불러왔어요` : "불러올 장소가 없어요");
  };
  fr.readAsText(file);
}
function mineClick(e){
  const pk = e.target.closest("[data-pick]");
  if (pk && picking) {
    const a = pk.dataset.pick, pick = picking;
    if (a === "me") { locate(); return true; }
    endPick();
    if (a === "ok") { const c = map.getCenter(); openMineForm(Object.assign({}, pick.draft, {ll: [c.lat, c.lng]})); }
    else if (pick.back) openMineForm(pick.draft);
    return true;
  }
  const ed = e.target.closest("[data-mine-edit]");
  if (ed) { const p = byId[ed.dataset.mineEdit]; if (p) openMineForm({id: p.id, n: p.n, c: p.c, t: p.t, cd: p.cd, ll: p.ll}); return true; }
  const dl = e.target.closest("[data-mine-del]");
  if (dl) { deleteMine(dl.dataset.mineDel); return true; }
  const m = e.target.closest("[data-mine]");
  if (!m) return false;
  const a = m.dataset.mine;
  if (a === "save") saveMineForm();
  else if (a === "cancel") closeSheet();
  else if (a === "repick") { const d = readMineForm(); closeSheet(true); startPick(d, true); }
  else if (a === "add") startPick({});
  else if (a === "export") exportMine();
  else if (a === "import") $("#mineFile").click();
  return true;
}
document.addEventListener("change", e => {
  if (e.target.id === "mineFile" && e.target.files && e.target.files[0]) { importMine(e.target.files[0]); e.target.value = ""; }
});

// ── 시작 ──
initMap();
renderPlan();
initEat();
initSnap();
renderInfo();
go((location.hash || "#map").slice(1));
// 아이폰: 들어올 때 홈 화면 앱이 아니면 안내 팝업 (닫으면 이번 방문엔 다시 안 뜸, '다시 보지 않기'면 계속 안 뜸)
(() => {
  if (!isIOS || isStandalone() || store.get("a2hsOff", false)) return;
  let shown = false; try { shown = sessionStorage.getItem("hkguide.a2hsShown") === "1"; } catch(_){}
  if (!shown) setTimeout(a2hsOpen, 900);
})();
window.addEventListener("popstate", () => {
  if (sheetOpen) { closeSheet(true); return; }               // 카드가 열려 있으면 닫기만
  go((location.hash || "#map").slice(1), true);
});
})();
