// 동네 · 예시 코스 · 포토 동선 · 정보 · 릴스 데이터 (2026년 10월 기준)
window.TRIP = {
  rate: 175, // 1 HKD ≈ 175원 (2026-10 기준 대략값)
};

// 동네: 셩완 기준 대중교통 감(대략), 주변 코스
window.AREAS = {
  sw: {rg:"island", n:"셩완·사이잉푼", mtr:"같은 동네 (도보)", course:"캣스트리트 골동품 → 만모사원 → 타이핑산 골목 → 하프웨이 커피 / 아침엔 상기콘지·잉키·창판왕"},
  ct: {rg:"island", n:"센트럴·소호", mtr:"MTR 셩완→센트럴 1정거장 (문앞까지 약 15분)", course:"PMQ → 타이쿤 → 미드레벨 에스컬레이터 → 소호 카페·바 → 란콰이퐁 · 바 레오네는 17시 오픈 전 대기 등록"},
  kt: {rg:"island", n:"케네디타운", mtr:"MTR 셩완→케네디타운 3정거장 (약 15분) · 트램도 가능", course:"윈스턴스 커피 → 게틴(티라미수 라떼) → %아라비카 → 농구장 → 트램 스토어 → 해안 산책로 노을 (3~5시간)"},
  adm: {rg:"island", n:"애드미럴티", mtr:"MTR 약 15분", course:"애드미럴티 F출구 → 스타스트리트(해·달·별 거리) → 퍼시픽플레이스 5층 → 홍콩공원·다기 박물관"},
  wc: {rg:"island", n:"완차이", mtr:"MTR 약 20분 · 트램 약 30분", course:"캄스 로스트구스 → 스프링가든 골목(마이컵오브티·람힝) → 크루 커피 → 완차이 부두"},
  cwb: {rg:"island", n:"코즈웨이베이", mtr:"MTR 약 25분", course:"해시태그B 에그타르트 → 섭듀드 쇼핑 → N.O.T. 커피(뷰) → 이순 우유푸딩 → 코스트파크 노을"},
  np: {rg:"island", n:"노스포인트·쿼리베이", mtr:"MTR 약 30분", course:"익청빌딩(오전) → 춘영 스트리트 트램 시장 → 과일가게 횡단보도 → 흑임자 아이스크림"},
  tst: {rg:"kowloon", n:"침사추이", mtr:"MTR 약 25분 · 스타페리(센트럴 7번 부두) 약 30분", course:"스타페리 → 시계탑 → 해변 산책로 → K11 MUSEA → 청흥키 생전포 → 20:00 심포니 오브 라이트"},
  ymt: {rg:"kowloon", n:"조던·야우마테이", mtr:"MTR 약 25분", course:"오스트레일리아 데어리 → 딤섬히어 → 미도카페 → 템플스트리트 야시장(7~9시)"},
  mk: {rg:"kowloon", n:"몽콕·태자", mtr:"MTR 약 30분", course:"꽃시장 → 금붕어 시장 → 하프웨이 커피 몽콕 → 레이디스 마켓 → 몽콕 네온 · 타이콕추이 푸와 베이커리 초코 카스테라"},
  ssp: {rg:"kowloon", n:"삼수이포·섹킵메이", mtr:"MTR 약 35분", course:"압류가 디카 → 푹와 카메라 → 남산 망고두부푸딩 → 다이파이동 저녁(아이만생·만팟)"},
  wts: {rg:"kowloon", n:"웡타이신·초이홍", mtr:"MTR 약 40분", course:"초이홍 아파트(오전) → 웡타이신 사원 · 산포콩 LY 베이커리 티라미수 버터떡"},
  kwt: {rg:"kowloon", n:"쿤통", mtr:"MTR 약 40분 (환승 1회)", course:"클라우디 그라운드 티라미수 라떼 (테이크아웃) — 일부러 가기엔 먼 곳"},
  peak: {rg:"island", n:"피크", mtr:"버스 15번 or 피크트램 (약 40분)", course:"피크타워 → 루가드로드 전망대 → 해 지기 30~40분 전 도착"},
  south: {rg:"island", n:"홍콩섬 남부", mtr:"버스·MTR 40분~1시간", course:"스탠리 마켓 해변 / 오션파크"},
  air: {rg:"outer", n:"공항", mtr:"공항철도 약 45분", course:"도착 첫 끼 호흥키·크리스탈 제이드 (T1 도착층)"},
  lantau: {rg:"outer", n:"란타우", mtr:"MTR 약 1시간", course:"옹핑360 → 빅 부다 / 디즈니랜드"},
  mpen: {rg:"macau", n:"마카오 반도", mtr:"셩완 페리 약 1시간 (외항)", course:"세나도 광장 → 펠리시다데 거리 → 성 도미니크 → 연애골목 → 성 바울 유적 → 몬테 요새 → 성 라자루 지구"},
  taipa: {rg:"macau", n:"타이파·코타이", mtr:"셩완 페리 약 1시간 (타이파)", course:"타이파 빌리지 → 타이파 주택박물관(카사 마퀴스타·코타이 뷰) → 베네시안 → 런더너 → 파리지앵 → 윈 팰리스"},
  col: {rg:"macau", n:"콜로안", mtr:"코타이에서 택시 약 15분", course:"콜로안 빌리지(로드스토우 에그타르트 본점) → 고통의 성모 성당(카호)"},
};

window.CATS = {
  move:  {n:"교통", ic:"✈️", col:"#9aa4ff"},
  sight: {n:"관광", ic:"🗺️", col:"#22e6ff"},
  photo: {n:"포토", ic:"📸", col:"#b6ff3b"},
  food:  {n:"맛집", ic:"🍜", col:"#ff2fa0"},
  cafe:  {n:"카페·디저트", ic:"☕", col:"#ffb02e"},
  shop:  {n:"쇼핑", ic:"🛍️", col:"#b26bff"},
  bar:   {n:"바", ic:"🍸", col:"#ff5e5e"},
};

// 릴스 번호 → 링크·작성자·주제 (릴스_수집목록.md 기준)
window.REELS = {
  1:{u:"https://www.instagram.com/reel/DeHLVTVh_bH/",a:"@henriuniverse",t:"홍콩 쇼핑코스 9곳",g:"쇼핑"},
  2:{u:"https://www.instagram.com/reel/DeHNZEFTYIJ/",a:"@nicolefromkorea",t:"스타스트리트 + 홍콩공원 루트",g:"산책"},
  3:{u:"https://www.instagram.com/reel/DcJB0S7S7_J/",a:"@_yonii_i",t:"케네디타운 필수 코스",g:"포토"},
  4:{u:"https://www.instagram.com/reel/DbIhcqxBVQP/",a:"@nicolefromkorea",t:"삼수이포 다이파이동 만팟",g:"맛집"},
  5:{u:"https://www.instagram.com/reel/DbncOQBgj_d/",a:"@ordinary_dayout",t:"모르면 손해 꿀팁 10",g:"꿀팁"},
  6:{u:"https://www.instagram.com/reel/DXecANQEzxd/",a:"@yunique94_",t:"미리 알면 좋을 꿀팁 BEST7",g:"꿀팁"},
  7:{u:"https://www.instagram.com/reel/DccoHYoTvr6/",a:"@sunnyhongtv_trip",t:"스프링뱅크 위스키 쇼핑",g:"쇼핑"},
  8:{u:"https://www.instagram.com/reel/DYhKBVwRLbM/",a:"@hip_teamjang",t:"란퐁유엔 옆 현지인 차찬텡",g:"맛집"},
  9:{u:"https://www.instagram.com/reel/DbH4pHQCgT5/",a:"@perfectkenton",t:"홍콩 유학생 추천 맛집 5",g:"맛집"},
  10:{u:"https://www.instagram.com/reel/DWd7MAhTVrn/",a:"@by_beardman_select",t:"21끼 중 살아남은 3곳",g:"맛집"},
  11:{u:"https://www.instagram.com/reel/DcC-rR7xqbi/",a:"@a.hyuniiii",t:"캐세이 공항철도 무료",g:"꿀팁"},
  12:{u:"https://www.instagram.com/reel/DeEePW_ANYU/",a:"@newwdoor__",t:"건기 홍콩 엄선 스팟",g:"맛집"},
  13:{u:"https://www.instagram.com/reel/Db26tIHSqPw/",a:"@evelyn_wasseoyo",t:"주성치 영화 촬영지 차찬텡",g:"맛집"},
  14:{u:"",a:"(캡션)",t:"비앙비앙면 랴오자리에",g:"맛집"},
  15:{u:"https://www.instagram.com/reel/DMco74wSwEe/",a:"@onsoo_film",t:"홍콩 웨딩스냅 레퍼런스",g:"스냅"},
  16:{u:"https://www.instagram.com/reel/Dd0ECFdpJiC/",a:"@musteat_official",t:"케네디타운 윈스턴스 커피",g:"포토"},
  17:{u:"https://www.instagram.com/p/DdyDLefkcqb/",a:"지인 추천",t:"추천해준 곳들 요약",g:"맛집"},
  18:{u:"https://www.instagram.com/reel/DZSMRwit651/",a:"@yoonporo_trip",t:"인생 사천요리 칠리파가라",g:"맛집"},
  19:{u:"https://www.instagram.com/reel/DdpfDb6t1Ei/",a:"@flying_yoni_701",t:"두리안 먹는 법",g:"꿀팁"},
  20:{u:"https://www.instagram.com/p/Ddu4TJvCYbK/",a:"(게시물)",t:"에그타르트 BEST 5",g:"카페"},
  21:{u:"https://www.instagram.com/reel/Dd-u5aQTdOu/",a:"@sunnyhongtv_trip",t:"홍콩공항 맛집 도장깨기",g:"맛집"},
  22:{u:"https://www.instagram.com/p/Ddya_SNCeN-/",a:"(게시물)",t:"N.O.T. 스페셜티 커피",g:"카페"},
  23:{u:"https://www.instagram.com/reel/DdIgdC0Szwv/",a:"(릴스)",t:"공항→마카오 무료 버스",g:"마카오"},
  24:{u:"https://www.instagram.com/reel/Ddsr1aNR-Xh/",a:"@bellamanzano",t:"홍콩 푸드 가이드",g:"맛집"},
  25:{u:"",a:"사진작가 (캡션)",t:"사진 히든스팟 7곳",g:"포토"},
  26:{u:"https://www.instagram.com/reel/DeA3dARN-mw/",a:"(릴스)",t:"망고모찌 춘워",g:"카페"},
  27:{u:"https://www.instagram.com/reel/Ddy0VQbzfn9/",a:"@_gmeum",t:"처음 가면 이 5곳",g:"맛집"},
  28:{u:"",a:"(캡션)",t:"미도카페",g:"맛집"},
  29:{u:"https://www.instagram.com/reel/Dd_AWo1SwOd/",a:"@yummy.september",t:"셩완 감성 디저트 Soon",g:"카페"},
  30:{u:"https://www.instagram.com/reel/Dbni7zIyC6B/",a:"@evelyn_wasseoyo",t:"이순 우유푸딩",g:"카페"},
  31:{u:"https://www.instagram.com/reel/DdltIj5zLYm/",a:"@trip.c0ng",t:"몽콕 도삭면",g:"맛집"},
  32:{u:"https://www.instagram.com/p/DdYhNaVD1uu/",a:"@leesutory",t:"2박3일 1인 경비",g:"꿀팁"},
  33:{u:"https://www.instagram.com/reel/DcQojRKzPw2/",a:"@ankat_eats",t:"카페 TOP10",g:"카페"},
  34:{u:"https://www.instagram.com/reel/DdJZPpSJVL6/",a:"@travelailleurs",t:"13km 해안 산책로",g:"산책"},
  35:{u:"https://www.instagram.com/reel/DcaQL0WzVNu/",a:"@sunnyhongtv_trip",t:"심포니 오브 라이트 종료 예고",g:"꿀팁"},
  36:{u:"https://www.instagram.com/reel/DXMf7Q6j2UZ/",a:"@yeonibroadcast",t:"빨간 2층버스 야경 스팟",g:"포토"},
  37:{u:"https://www.instagram.com/reel/Dd6LVP8Bki_/",a:"@yeeranyy",t:"72시간 홍콩 (셩완)",g:"맛집"},
  38:{u:"https://www.instagram.com/reel/Dd3cOcSzGj0/",a:"@haddo_pick",t:"호주우유공사 메뉴 가격",g:"맛집"},
  39:{u:"",a:"@immingoo_film (캡션)",t:"촬영 스팟 10곳 (좌표)",g:"포토"},
  40:{u:"https://www.instagram.com/reel/DeBAEsRS8UF/",a:"@s._.mile_ee",t:"비전 베이커리",g:"카페"},
  41:{u:"https://www.instagram.com/reel/Dd_Ru2bS7vz/",a:"@zzieun.zip",t:"마지막 날 먹방 루트",g:"맛집"},
  42:{u:"https://www.instagram.com/reel/DcGe9sXJhQ0/",a:"@_peachberry___",t:"승무원 레이오버 먹방",g:"맛집"},
  43:{u:"https://www.instagram.com/p/DNrrP4s5pKM/",a:"(게시물)",t:"홍콩 빈티지 여행 스팟",g:"포토"},
  44:{u:"https://www.instagram.com/p/Dc-iO2VCVtR/",a:"(게시물)",t:"흑임자 아이스크림",g:"카페"},
  45:{u:"https://www.instagram.com/reel/DcI4UVqyJbO/",a:"@s._.mile_ee",t:"막안키",g:"맛집"},
  46:{u:"https://www.instagram.com/reel/DdBaz8Jhr1b/",a:"@barhopping_girl",t:"슈가킹 바",g:"바"},
  47:{u:"https://www.instagram.com/reel/Dd6Of_gSIgT/",a:"@oops_0617",t:"홍콩공항 마라 맛집 (가게명 영상에 없음)",g:"맛집"},
  48:{u:"https://www.instagram.com/reel/DcTGnTeAJLR/",a:"@minsu.pick_",t:"시우싱홍 향 오일",g:"쇼핑"},
  49:{u:"https://www.instagram.com/reel/DeIsTLIPMYn/",a:"@its.__yen",t:"PMQ 빈티지 카메라 사진관 (告白鎏影館)",g:"포토"},
  50:{u:"https://www.instagram.com/reel/DeJaZ_YT7Ol/",a:"@trip.c0ng",t:"홍콩섬 1일차 코스 10곳",g:"산책"},
  51:{u:"https://www.instagram.com/p/DeOs2jOGNlB/",a:"@meizehk",t:"홍콩 SNS 유행 디저트 (티라미수 버터떡·초코 카스테라 등)",g:"카페"},
  52:{u:"https://www.instagram.com/reel/DeO1rZKBM67/",a:"@nicolefromkorea",t:"바 레오네 웨이팅 팁 + 근처 바·식당",g:"바"},
  53:{u:"https://www.instagram.com/reel/DdWVCZ-N3YQ/",a:"@crystal.film_",t:"마카오 하루 꽉 채운 코스 (07~22시)",g:"마카오"},
  54:{u:"https://www.instagram.com/reel/DeMjkHgBU6O/",a:"@rachl.jpg",t:"케네디타운 카페 게틴 (티라미수 라떼)",g:"카페"},
  55:{u:"https://www.instagram.com/reel/DeMCdC_TPLY/",a:"@se__young_1",t:"맛집 BEST3 (아주르80·트웰브 플레이버스·푸와 카페)",g:"맛집"},
  56:{u:"https://www.instagram.com/reel/DeOy5zCRbns/",a:"@taein.hk",t:"서구룡 문화지구 조용한 야경 스팟",g:"포토"},
  57:{u:"https://www.instagram.com/p/DeTBlGjk8Gk/",a:"@ggomggomfairy",t:"미식·바 코스 (연령 제한 게시물 — 공개된 첫 장 바 레오네만 확인)",g:"바"},
  58:{u:"https://www.instagram.com/reel/DdGuqZPzhY-/",a:"@c.chloe_a",t:"침사추이 루틴 (페닌슐라 부티크·메르카토·롱브릿지 카페·길거리 분식)",g:"쇼핑"},
  59:{u:"https://www.instagram.com/reel/Dc1BmqwJYAn/",a:"@jellaby_trip",t:"피크트램 야경 꿀팁 (사전예매·자리·무료 전망)",g:"꿀팁"},
  60:{u:"https://www.instagram.com/reel/DbaoD_7yqQT/",a:"@mangu_travel",t:"마카오 에그타르트 에그와플 (Egg n' Sip)",g:"마카오"},
  61:{u:"https://www.instagram.com/p/DdY0CxKGvF2/",a:"@be_happic",t:"마카오 당일치기 무료 셔틀 코스",g:"마카오"},
  62:{u:"https://www.instagram.com/p/DeJuuQegdu3/",a:"@mimisamlim",t:"타이쿤 앞 할리우드로드·올드베일리 St 횡단보도 스냅 레퍼런스",g:"스냅"},
  63:{u:"https://www.instagram.com/reel/DeVmCa9PNq_/",a:"@its.__yen",t:"에그타르트 맛집 2곳 — 홈베이크(바삭 생지) · 베이크하우스(촉촉 필링)",g:"카페"},
  64:{u:"https://www.instagram.com/reel/DeY-A6nuRRS/",a:"@trip_n_9u",t:"2박3일 알짜 코스 (#광고 · 캡션에 구체 장소 없음 — 참고용)",g:"산책"},
  65:{u:"https://www.instagram.com/p/DeZG3OUGCCo/",a:"@meizehk",t:"차찬텡 실패 없는 메뉴 8가지 → 정보 탭 주문 가이드 카드로 정리",g:"꿀팁"},
  66:{u:"https://www.instagram.com/reel/DeWhVpWzfDS/",a:"@c.chloe_a",t:"숨은 사진 스팟 — 쑨원 기념관(미드레벨, 입장 무료) + 센트럴 도보 코스",g:"포토"},
  67:{u:"https://www.instagram.com/p/DdlVdenoyog/",a:"@gong.gaan",t:"마카오 당일치기 밤 풍경 — 로드스토우 코타이점·파리지앵·런더너·북방관·베네시안",g:"마카오"},
};

// 일정 (p = 장소 id)
window.GUIDE_D1 = `<p><b>한눈에</b> 착륙 → 입국·짐 (약 40분) → 도착홀 → 공항철도 24분 → 홍콩역 → 택시 5~10분 → 숙소</p>
  <p><b>① 공항 도착 → 도착홀</b></p>
  <ol class="a2steps">
  <li>내려서 'Arrival 입국' 표지 → <b>입국심사</b>(Visitors 줄) → <b>짐 찾기</b> → 세관은 신고할 것 없으면 초록색 <b>Nothing to Declare</b></li>
  <li>문을 나오면 <b>도착홀(A 또는 B, 5층)</b> — 배고프면 여기서 점심 (호흥키·크리스탈 제이드)</li></ol>
  <p><b>② 공항철도 표 — 카드 새로 살 필요 없어요</b></p>
  <table><tr><th>2인 그룹티켓</th><td><b>HK$170</b> (1인 85) · 도착홀 <b>Airport Express 고객서비스센터</b> 창구 · "Group ticket, two, Hong Kong Station" · 당일만 · 같이 타기</td></tr>
  <tr><th>각자 카드 태그</th><td>HK$240 (1인 120) · 트래블월렛·옥토퍼스 · <b>1인 1카드</b> · 창구 갈 필요 없음</td></tr>
  <tr><th>1회권</th><td>HK$260 (1인 130) · 가장 비쌈</td></tr></table>
  <p class="tiny">💳 창구 결제: MTR 공식 안내에 창구가 받는 카드가 나와 있지 않아요. <b>트래블월렛(Visa)을 먼저 내밀어 보고</b>, 안 되면 <b>현금 HK$170</b> (준비해 간 현금으로). 창구 줄이 길면 그냥 각자 트래블월렛 태그로 타도 돼요.</p>
  <p><b>③ 타기 → 내리기</b></p>
  <ol class="a2steps">
  <li><b>'Trains to City · 往市區'</b> 표지 따라 도착홀에서 그대로 직진 → <b>같은 층 승강장</b> (계단 없이 캐리어 그대로)</li>
  <li>공항역은 원래 개찰구 없이 바로 타고 <b>내리는 역에서 요금 처리</b>. 2026-05에 개찰구가 바뀌었으니 승강장 앞에 청록색 새 개찰구가 있으면 거기서 태그·표 넣기</li>
  <li>약 10분 간격 · 칭이 → 구룡 → <b>홍콩역(종점) 24분</b> · 캐리어는 입구 쪽 짐칸</li>
  <li>홍콩역 개찰구: 그룹티켓은 <b>각자 1장씩</b> 넣고 같이 나가기 / 카드는 탈 때 쓴 <b>같은 카드</b>로 태그</li></ol>
  <p><b>④ 홍콩역 → 셩완 숙소 (택시가 꼭 필수는 아니에요)</b></p>
  <table><tr><th>🚕 택시 (추천)</th><td><b>5~10분 · 약 HK$40~50</b> (기본 HK$29가 첫 2km + 신호 대기 + 트렁크 짐 1개당 HK$6) · 'Taxi' 표지 → 택시 승강장</td></tr>
  <tr><th>🚇 MTR</th><td>지하 통로로 <b>센트럴역</b>(도보 5~8분) → <b>아일랜드선</b>(파란색) 케네디타운 방향 <b>1정거장 셩완</b> → <b>A2 출구</b> → 도보 5~7분 · 1인 약 HK$5~6 (카드 태그) · 셩완역 출구가 계단이라 큰 캐리어는 힘들다는 후기</td></tr>
  <tr><th>📱 우버</th><td>앱에 목적지 입력 · 앱 결제라 말할 필요 없음 · 요금은 앱에 표시</td></tr>
  <tr><th>🚋 트램</th><td>데보로드 서쪽 방향 → 종점 웨스턴마켓(셩완) · 1인 약 HK$3 · 좁고 계단이 있어 캐리어는 비추천</td></tr>
  <tr><th>🚶 도보</th><td>약 20분 (IFC~셩완 고가 보행로) · 짐 있으면 비추천</td></tr></table>
  <p><b>⑤ 택시 타는 법</b></p>
  <ol class="a2steps">
  <li>'Taxi' 표지 → <b>승강장에서 줄 서서</b> 차례대로 (도심은 빨간 택시)</li>
  <li>트렁크: 손짓 or "<b>唔該開尾箱</b>" (음꺼이, 호이 메이쌍 — 트렁크 열어 주세요)</li>
  <li>숙소의 <b>중문(한자) 주소를 화면째 보여주기</b> (예약 확인서·호텔 홈페이지에서 미리 찾아 두기)</li>
  <li>출발할 때 미터기가 <b>HK$29</b>부터 올라가는지 확인</li>
  <li>도착: 미터 금액 + 트렁크 짐 요금 → 현금(작은 지폐) 또는 카드·QR (2026-04부터 택시 전자결제 의무, 그래도 현금이 가장 확실)</li>
  <li>"<b>收據</b>" (싸우꺼이) — 영수증 받기 (차량 번호가 찍혀 있어 분실물·민원 때 필요)</li></ol>
  <p><b>⑥ 택시 안전해요?</b></p>
  <ul><li>홍콩 택시는 정부 면허·미터제라 대체로 안전해요. 대시보드에 기사 사진 신분증이 붙어 있어요</li>
  <li><b>승강장 택시만</b> 타고, 호객하는 일반 차량은 타지 않기</li>
  <li>내리기 전 영수증 받기 · 불안하면 차량 번호 사진 · 민원은 교통불편신고(TCU) <b>2889 9999</b></li>
  <li>말이 안 통하면 한자 주소만 보여줘도 충분해요. 말 걸기 싫으면 우버도 방법</li>
  <li>짧은 말: 唔該 (음꺼이: 감사합니다·부탁해요) · 呢度落車 (니도 록체: 여기서 내릴게요)</li></ul>
  <p class="tiny">돌아갈 땐 홍콩역 공항철도 창구에서 2인 그룹티켓 HK$170 · 출국 체크인 터미널(T1/T2)은 앱·탑승권 확인.<br>출처: MTR·홍콩공항·교통국 공식 안내 (2026). 요금은 성인 기준 대략값.</p>`;

window.DAYS = [
  {n:"1일차", w:"도착", title:"도착 · 셩완·센트럴 · 피크 야경", guide:{t:"📖 공항 → 시내 가는 법 (공항철도·택시)", h:window.GUIDE_D1}, note:"피크 야경은 주말보다 평일 저녁이 덜 붐벼요 · 점심은 🅰 공항 / 🅱 셩완 중 그날 고르기 (두 안 모두 15:00 산책 시작)", items:[
    {t:"12:00", x:"홍콩 도착 → 입국심사·짐 찾기 → 도착홀 (위 📖 공항 → 시내 가는 법)", p:"hkg"},
    {t:"12:45", x:"🅰 A안 · 공항 점심: T1 도착층 호흥키 완탕면 or 크리스탈 제이드 (카드 OK)", p:"hohungkee"},
    {t:"13:40", x:"🅰 A안 · 공항철도(2인 그룹티켓 HK$170) → 홍콩역 → 택시 → 14:20 체크인", p:"hkstation"},
    {t:"12:50", x:"🅱 B안 · 바로 공항철도(2인 그룹티켓 HK$170) → 홍콩역 → 택시 → 13:35 숙소에 짐 맡기기 (방 준비되면 바로 체크인)", p:"hkstation"},
    {t:"13:45", x:"🅱 B안 · 셩완 점심: 카우키 소고기 국수(일요일·공휴일 휴무) or 권키 완탕면 — 둘 다 현금 → 14:40 체크인", p:"kaukee"},
    {t:"15:00", x:"셩완 산책: 캣스트리트 → 만모사원 → 하프웨이 커피 (제니베이커리 쿠키는 현금)", p:"manmo"},
    {t:"16:00", x:"PMQ: 告白鎏影館 빈티지 카메라 사진(선택) · G.O.D. · 그린레몬 아틀리에(반지)", p:"koku"},
    {t:"16:40", x:"타이쿤 → 베이크하우스(품절 주의) · 림헝링 레몬티", p:"taikwun"},
    {t:"17:15", x:"피크 출발 (피크트램 사전예매 · 올라갈 때 오른쪽 자리) → 해 지기 전 루가드로드 도착 (10월 중순 일몰 약 17:58) · 무료 야경은 피크 갤러리아 옥상도", p:"lugard"},
    {t:"19:30", x:"저녁: 칠리파가라 (예약 필수)", p:"chilli"},
    {t:"21:00", x:"(선택) 슈가킹 한잔", p:"sugarking"},
  ]},
  {n:"2일차", w:"포토", title:"케네디타운 · 노을 포토 동선 📸", note:"17:00~19:00 노을 시간에 맞춘 포토 동선 · 포토 탭에서 A/B/C/D 비교", snap:true, items:[
    {t:"08:30", x:"아침: 상기콘지 or 창판왕", p:"sangkee"},
    {t:"10:00", x:"(선택) 케네디타운: 윈스턴스 커피 · 게틴(티라미수 라떼) · %아라비카 · 농구장 · 트램스토어", p:"winstons"},
    {t:"12:30", x:"숙소에서 쉬며 준비"},
    {t:"16:30", x:"포토 동선 시작점으로 이동 (A·B·C: 할리우드로드 — A는 타이쿤 앞, B·C는 길 건너 Amber Lodge 앞 / D: 몽콕 꽃시장)"},
    {t:"17:00", x:"포토 동선 2시간 (A·B·C·D 중 고르기)"},
    {t:"19:15", x:"저녁 (A·C: 테라스 불루드·더들스 / B: 예상하이 / D: 밍힝·미도카페)"},
  ]},
  {n:"3일차", w:"마카오", title:"마카오 당일치기", note:"왕복 페리 미리 예매 · 여권 필수 · 💱 현금은 HKD 그대로(거스름돈 MOP는 마카오에서 다 쓰기), 카드는 MOP로 청구 → 전날 밤 트래블월렛에 MOP 충전", region:"macau", items:[
    {t:"08:30", x:"셩완 페리터미널 수속", p:"shuntak"},
    {t:"09:00", x:"터보젯 → 마카오 외항 → 그랜드 리스보아 무료 호텔 셔틀 → 세나도 광장까지 걸어서", p:"mo_outer"},
    {t:"10:00", x:"세나도 광장 → 펠리시다데 거리(빨간 덧문 골목) → 성 도미니크 → 마가렛 에그타르트 · 에그타르트 에그와플(에그앤십, 펠리시다데 4번지)", p:"mo_senado"},
    {t:"11:00", x:"연애골목(성 바울 뷰) → 성 바울 성당 유적(계단 위 오른쪽 나무길 숨은 포토존) → 몬테 요새 · (선택) 치파오 대여 촬영 · 성 라자루 지구 골목", p:"mo_stpaul"},
    {t:"12:30", x:"점심: 디에잇(미쉐린 2스타·예약 필수) or 호텔 센트럴 팰리스 or 마곡멩께이(마카니즈, 현금) or 쏸라펀", p:"mo_theeight"},
    {t:"14:00", x:"AIA Tower 앞 무료 셔틀(시티 오브 드림즈)로 코타이 → 타이파 빌리지 + 대리래기 쭈빠빠오 · 타이파 주택박물관 코타이 전망", p:"mo_taipa"},
    {t:"16:00", x:"코타이: 베네시안 곤돌라 · 북방관(베네시안 1층, 저녁 대기 길면 홈페이지 예약) · 런더너", p:"mo_venetian"},
    {t:"17:45", x:"(선택) 저녁: 카사 마퀴스타 — 타이파 주택 안 마카니즈 요리, 창밖 코타이 야경 (예약 권장)", p:"mo_maquista"},
    {t:"19:00", x:"파리지앵 에펠탑 야경 · 윈 팰리스 분수쇼 (18~24시 약 20분 간격)", p:"mo_parisian"},
    {t:"20:15", x:"타이파 페리터미널 도착·수속 (출항 30분 전까지)", p:"mo_taipaferry"},
    {t:"21:00", x:"코타이워터젯 → 셩완 (공식표 저녁 편 20:00·21:00·22:00 — 예약할 때 실제 편 확인)"},
  ]},
  {n:"4일차", w:"구룡", title:"구룡: 삼수이포 · 몽콕 · 야시장", note:"주말·공휴일엔 붐벼요", items:[
    {t:"09:00", x:"(선택) 익청빌딩 오전 촬영 — 사람 적을 때", p:"ph_yick"},
    {t:"10:30", x:"브런치: 오스트레일리아 데어리 or 딤섬히어(예약 가능)", p:"aus"},
    {t:"12:00", x:"삼수이포: 압류가 디카 → 푹와 카메라", p:"apliu"},
    {t:"14:00", x:"태자: 꽃시장 → 금붕어 시장", p:"flowermkt"},
    {t:"15:30", x:"남산 망고두부푸딩 (15시 오픈) or 하프웨이 커피 몽콕", p:"namshan"},
    {t:"17:00", x:"이른 저녁: 아이만생(17시 오픈런) or 만팟(7시 전)", p:"oiman"},
    {t:"19:00", x:"템플스트리트 야시장 (7~9시 피크) · 미도카페", p:"templest"},
    {t:"20:00", x:"(선택) 침사추이 심포니 오브 라이트 — 운영 여부 확인 / 조용한 야경은 서구룡 해변 산책로", p:"tstprom"},
  ]},
  {n:"5일차", w:"출국", title:"출국", note:"체크아웃 후 공항철도로 공항까지 (오후 1시 반 출발편 예시)", items:[
    {t:"08:00", x:"아침: 잉키 누들 or 상기콘지", p:"yingkee"},
    {t:"09:30", x:"체크아웃"},
    {t:"10:00", x:"택시 → 홍콩역 → 공항철도 24분 (홍콩역 공항철도 창구에서 2인 그룹티켓 HK$170)", p:"hkstation"},
    {t:"11:00", x:"공항 도착 → 체크인 (2026-05부터 일부 항공사는 T2 체크인 → 앱·탑승권에서 터미널 확인, 공항역은 T1·T2 양쪽 문이 열림)", p:"hkg"},
  ]},
];

// 포토 동선 A/B/C/D — leg: 다음 스팟까지 이동수단 (walk|ferry|taxi) · wm/wd = 구글맵 도보 분·m
window.SNAP = {
  info:"17:00~19:00 · 2시간 · 10월 중순 기준 일몰 약 17:57 · 블루아워 약 17:57~18:20",
  plans:[
    {k:"A", name:"타이쿤 할리우드로드 → 종심법원 트램 → 대관람차 노을·야경", tag:"스팟 3곳 · 이동 적음 · 걷는 길은 내리막·평지", col:"#ff9f1c",
     dinner:["terrace","duddells","chilli"], start:"타이쿤 본관 앞 할리우드로드 인도 (Amber Lodge 길 건너편)",
     note:"타이쿤 앞 약 15분 → 종심법원 앞 약 15분 → 관람차 약 1시간. 이동 시간은 구글맵 도보 기준(타이쿤 → 종심법원 12분·900m, Wyndham St 내리막 / 종심법원 → 관람차 15분·1.0km, Chater Rd)이라 찍으면서 걸으면 밀려요 — 관람차 노을을 꼭 잡으려면 타이쿤은 10분만. 종심법원 앞은 트램이 들어올 때마다 여러 번 — 차도 쪽으로 나가지 않기. 고정 시간은 17:57 일몰 전후 하버프런트 노을, 해 지면 관람차 조명 + 하버 야경. 관람차는 토요일 11:00~23:00 운행(성인 HK$20, 최근 안내 기준) — 안 타고 촬영만 해도 돼요. 해가 건물에 가리는지·촬영 방향은 현장에서 확인.",
     stops:[
      {p:"ph_tkhr", t:"17:00", light:"day", x:"크림색 타이쿤 벽 + 'Wyndham St / Arbuthnot Rd' 이정표 + 검은 난간 · 'HOLLYWOOD RD' 표지판 앞 빨간 택시", leg:"walk", wm:12, wd:900},
      {p:"ph_cfa", t:"17:27", light:"golden", x:"돌기둥 법원 건물 앞으로 트램 지나갈 때 · 바로 옆 황후상 광장에서도 몇 컷", leg:"walk", wm:15, wd:1000},
      {p:"wheel", t:"17:57", light:"golden", x:"🌅 일몰 시각 도착 → 하버프런트 노을 → 블루아워 → 불 켜진 관람차 야경까지 한자리에서", leg:null},
     ]},
    {k:"B", name:"홍콩섬 골목 → 스타페리 노을 → 침사추이 야경", tag:"추천 · 홍콩다운 컷 총집합 · 가장 촘촘함", col:"#ff2fa0",
     dinner:["yeshanghai","azure80"], start:"할리우드로드 (센트럴)",
     note:"부두 도착 목표 17:45. 3번(웰링턴)은 선택 — 늦으면 건너뛰기. 트램 교차로 → 부두가 밀리면 택시(5분). 배 시간에 따라 일몰을 페리 위에서 못 볼 수도 있어요(보장 아님) — 그땐 침사추이 쪽에서 블루아워를 찍으면 돼요.",
     link:["스타페리 공식 운항 안내","https://starferry.com.hk/en/service"],
     stops:[
      {p:"ph_amber", t:"17:00", light:"day", x:"유럽식 건물 + 신호등 + 빨간 택시", leg:"walk"},
      {p:"ph_graham", t:"17:08", light:"day", x:"벽화 앞 길을 건너며 걷는 컷", leg:"walk"},
      {p:"ph_wellington", t:"17:16", light:"golden", x:"소호 오르막, 간판 사이 걷기 (가는 길에 2~3컷)", leg:"walk", opt:true},
      {p:"ph_tram", t:"17:28", light:"golden", x:"트램 + 신호등 + 빌딩 숲", leg:"walk"},
      {p:"pier7", t:"17:45", light:"golden", x:"부두에서 하버 배경 → 17:50 전후 페리 탑승", leg:"ferry"},
      {p:"clocktower", t:"18:03", light:"blue", x:"🌅 페리 2층 노을 → 내려서 바로 시계탑 앞 블루아워", leg:"walk"},
      {p:"tstprom", ll:[22.29385,114.17120], n:"문화센터 앞 해변 산책로", t:"18:22", light:"night", x:"홍콩섬 스카이라인 정면", leg:"walk"},
      {p:"avenue", ll:[22.29445,114.17420], n:"애비뉴 오브 스타 입구", t:"18:36", light:"night", x:"애비뉴 오브 스타 야경", leg:"walk"},
      {p:"ph_space", t:"18:50", light:"night", x:"빨간 2층버스 + 야경 (펜스 앞)", leg:null},
     ]},
    {k:"C", name:"홍콩섬에서만 —하버 노을 → 빌딩숲 야경 → 가스등", tag:"페리 환승 없음 · 운영하기 쉬움", col:"#22e6ff",
     dinner:["duddells","terrace","chilli"], start:"할리우드로드 (센트럴)",
     note:"고정 시간은 17:47~18:05 하버프런트 노을. 3번(웰링턴)은 선택. 관람차 쪽에서 해가 건물에 가리는지·촬영 방향은 현장에서 확인.",
     stops:[
      {p:"ph_amber", t:"17:00", light:"day", x:"유럽식 건물 + 빨간 택시", leg:"walk"},
      {p:"ph_graham", t:"17:08", light:"day", x:"벽화 앞 횡단 컷", leg:"walk"},
      {p:"ph_wellington", t:"17:16", light:"golden", x:"소호 오르막 간판 (가는 길에 2~3컷)", leg:"walk", opt:true},
      {p:"ph_tram", t:"17:28", light:"golden", x:"트램 교차로", leg:"walk"},
      {p:"wheel", t:"17:47", light:"golden", x:"🌅 하버프런트 노을(일몰 17:57) + 관람차", leg:"walk"},
      {p:"ph_bocbridge", t:"18:15", light:"blue", x:"육교 위 빌딩숲 블루아워", leg:"walk"},
      {p:"ph_duddell", t:"18:35", light:"night", x:"가스등 켜진 돌계단", leg:"walk"},
      {p:"lkf", t:"18:50", light:"night", x:"란콰이퐁 네온 골목", leg:null},
     ]},
    {k:"D", name:"구룡 레트로 · 필름 감성", tag:"흰 옷 + 꽃 + 네온 · 촬영 여유 가장 큼", col:"#b6ff3b",
     dinner:["mido","minghing"], start:"몽콕 꽃시장 (태자역)",
     note:"꽃다발은 촬영 시작 전(16:40쯤) 미리 사 두기. 물가 노을 컷은 없고 골목·간판·네온 위주. 마지막 구간은 걸어서 13분(택시는 잡는 시간 포함 10분 안팎이라 큰 차이 없음).",
     stops:[
      {p:"flowermkt", t:"17:00", light:"day", x:"꽃 사이 걷기, 미리 산 꽃다발로", leg:"walk"},
      {p:"ph_shanghai", t:"17:20", light:"golden", x:"빨간 한자 간판 옛 상점 앞 (홍완카페 일대)", leg:"walk"},
      {p:"ph_fayuen", t:"17:40", light:"golden", x:"노란 옛 건물 앞 횡단보도 건너기", leg:"walk"},
      {p:"ph_mkneon", t:"18:00", light:"blue", x:"블루아워 네온 켜지는 몽콕 거리", leg:"walk"},
      {p:"ph_portland", ll:[22.31535,114.16955], n:"포틀랜드 스트리트 (몽콕 남쪽, 밍힝 도삭면 앞)", t:"18:20", light:"night", x:"간판 빽빽한 골목", leg:"walk"},
      {p:"ph_kansu", t:"18:45", light:"night", x:"템플스트리트 입구 네온 → 끝나면 바로 미도카페", leg:null},
     ]},
  ],
};

// 정보 탭 (HTML)
window.INFO = [
 {ic:"📖", grp:"prep", t:"공항 → 시내 가는 법 (공항철도·택시)", h:window.GUIDE_D1},
 {ic:"📲", grp:"prep", t:"홈 화면에 추가하기 (앱처럼 쓰기)", dyn:"a2hs"},
 {ic:"💳", grp:"local", t:"환전 · 결제", h:`<ul>
  <li>현금은 <b>출발 전 한국에서 미리 환전</b>해 가요 — 얼마나 가져갈지는 '💵 현금 · 트래블월렛 얼마나?' 카드</li>
  <li>MTR·공항철도·버스·트램·스타페리·피크트램 = <b>트래블월렛 카드 바로 태그</b> (1인 1카드, 들어갈 때·나올 때 같은 카드) · 교통비는 하루치를 모아 청구 → HKD 잔액 여유 있게</li>
  <li>카드 결제 때 원화(KRW)로 할지 물으면 거절 → <b>HKD</b>로 (원화 결제는 3~8% 손해)</li>
  <li><b>카드 안 되는 식당</b>은 바로 아래 '💳 카드 안 되는 곳' 목록 · 먹기 탭 <b>💳✕ 카드 안 됨</b> 필터 · 지도 핀 💵 로 확인 (노점·마카오 버스도 현금)</li>
  <li>카카오·네이버·토스페이(알리페이플러스) 대부분 가맹점 OK</li>
  <li>택시: 2026-04부터 전자결제(QR·카드/옥토퍼스) 의무지만 현금이 가장 확실</li>
  <li>옥토퍼스는 선택. 반납 시 수수료 HK$11 → 잔액 남기지 않게</li>
  <li>마카오는 통화가 달라요 → '🇲🇴 마카오 돈 쓰는 법' 카드</li></ul>`},
 {ic:"💳", grp:"local", t:"카드 안 되는 곳 (현금 준비)", dyn:"nocard"},
 {ic:"💰", grp:"ref", t:"예산 감", h:`<ul>
  <li>최근 후기(2박3일, 1인): 항공 36만 · 숙소 14만 · 교통 3만 · <b>식비 15만 원</b></li>
  <li>영상 후기: "홍콩은 식비가 생각보다 더 든다" — 로컬 한 끼 HK$40~100, 미쉐린·뷰 레스토랑 HK$500+</li>
  <li>2인 4박 예시: 현금 HK$3,000 + 트래블월렛 HK$5,000 + MOP 1,500 ≈ 167만 원 (항공·숙소·쇼핑 제외) — '💵 현금 · 트래블월렛 얼마나?' 카드</li>
  <li>환율은 1 HKD ≈ 175원으로 계산해 표시 (대략)</li></ul>`},
 {ic:"🎰", grp:"local", t:"마카오 페리", h:`<ul>
  <li><b>갈 때</b> 셩완 → 외항 <b>터보젯</b> · 평일 HK$194 / 주말·공휴일 212 / 야간 242</li>
  <li><b>올 때</b> 타이파 → 셩완 <b>코타이워터젯</b> · 평일 192 / 주말 209 / 야간 242</li>
  <li>출항 30분 전 수속 · 여권 필수 · 주말·연휴엔 왕복 미리 예매 (귀국편 시간 지정)</li>
  <li><b>타이파 → 셩완 저녁 편</b>: 20:00 · 21:00 · 22:00 (공식표 기준, <b>20:30 편 없음</b>) → 예시 코스는 21:00 편 기준. 야간 요금은 17:10 이후 출발부터</li>
  <li>카운터에서 여권 + 홍콩 입국 항공권 보여주면 무료 티켓 이벤트(수량 한정) 후기 → 물어보기</li>
  <li>디에잇(그랜드 리스보아): 미쉐린 2스타 · 점심 11:30–15:00 · 월 휴무 · ☎ +853 8803 7788</li>
  <li>마카오 돈(파타카) 쓰는 법은 바로 아래 '🇲🇴 마카오 돈 쓰는 법' 카드</li>
  <li>카지노 무료 셔틀: 타이파 터미널 ↔ 베네시안·파리지앵·런더너</li>
  <li><b>무료 호텔 셔틀</b>(릴스 61): 외항 → 그랜드 리스보아(반도) / 반도 AIA Tower 앞 → 시티 오브 드림즈(코타이) 약 20분 간격 / 돌아올 땐 MGM 지하 셔틀 → 외항. 호텔마다 노선·배차가 달라요</li>
  <li><b>오픈탑 야경 버스</b>(릴스 53): 외항 페리터미널 출발 19:00·20:30·21:40 (판매처마다 다름) · 약 50분 논스톱 · 사전 예매, 환불 불가 많음 → 예시 코스(21:00 타이파 페리)와는 시간이 안 맞아요</li>
  <li><a href="https://www2.turbojet.com.hk/travel-with-us-sea-ferry/" target="_blank" rel="noopener">터보젯 운항표</a> · <a href="https://www.cotaiwaterjet.com/ferry-schedule/hongkong-macau-taipa.html" target="_blank" rel="noopener">코타이워터젯 운항표</a></li></ul>`},
 {ic:"🗺️", grp:"ref", t:"마카오 하루 꽉 채운 코스 (릴스 53)", h:`
  <p>@crystal.film_ 이 07:00~22:00 하루에 돈 코스예요. 예시 코스(10:00 도착 ~ 21:00 페리)에 맞는 것만 골라 넣었어요.</p>
  <ul><li>07:00 연애골목('파이샹 골목') → 07:30 성 바울 유적 → 치파오 대여(旗緣)</li>
  <li>08:30 펠리시다데 거리 → 10:00 호텔 센트럴 → 11:00 팰리스 레스토랑</li>
  <li>13:00 성 라자루 지구 → 15:00 콜로안 빌리지 → 16:00 고통의 성모 성당</li>
  <li>17:30 원 그란타이(코타이 전망) → 18:30 카사 마퀴스타 → 20:45 오픈탑 버스 → 22:00 파리지앵 야경</li></ul>
  <p>✅ <b>예시 코스에 넣은 것</b>: 펠리시다데 · 연애골목 · 성 라자루(선택) · 치파오(선택) · 호텔 센트럴(점심 후보) · 타이파 주택박물관 뷰 · 카사 마퀴스타(저녁 후보)<br>
  ⏭ <b>뺀 것</b>: 콜로안(왕복 시간 부족, 남으면 택시로) · 오픈탑 버스(21:00 페리와 겹침)</p>`},
 {ic:"🇲🇴", grp:"local", t:"마카오 돈 쓰는 법 (통화가 달라요)", h:`
  <p>마카오 돈은 <b>파타카(MOP)</b>지만 따로 환전할 필요는 없어요. 이렇게만 하면 돼요.</p>
  <table><tr><th>현금</th><td>가져간 <b>홍콩달러 그대로</b> 내기 (1:1로 받아요). 거스름돈은 MOP로 주니 <b>받은 MOP부터 먼저</b> 쓰기. MOP는 홍콩에서 못 쓰니 마카오에서 다 쓰고 오기 (HKD가 약 3% 손해지만 소액이라 신경 안 써도 돼요)</td></tr>
  <tr><th>카드</th><td>마카오 가게는 원칙적으로 <b>MOP로 청구</b> (마카오 법령) → 트래블월렛에 <b>MOP가 충전돼 있어야</b> 결제돼요. <b>마카오 가기 전날 밤 앱에서 MOP 충전</b> (디에잇 가면 MOP 1,500 · 안 가면 MOP 500 정도). HKD로 청구하는 곳은 HKD 잔액에서 빠져요</td></tr>
  <tr><th>이동</th><td>무료 호텔 셔틀로 다니면 교통비 0 · 시내버스는 현금 MOP 6 (거스름돈 없음 → 받은 MOP 동전 활용) · 택시 기본 MOP 21, 현금 위주</td></tr>
  <tr><th>페리</th><td>왕복 모두 미리 온라인 예매 (HKD)</td></tr>
  <tr><th>남으면</th><td>현금 MOP는 돌아오기 전 페리터미널 편의점에서 쓰기 · 트래블월렛 MOP 잔액은 앱에서 원화로 환불</td></tr></table>
  <ul><li>마카오 현금 쓸 곳: 마가렛 에그타르트 · 대리래기 · 쏸라펀/마곡멩께이 · 에그앤십(확인 필요) · 아몬드쿠키·간식 → 2인 약 HK$500~650</li>
  <li>카드 결제 때 원화(KRW)로 할지 물으면 거절 → MOP(또는 HKD)로</li>
  <li>카카오·네이버·토스페이(알리페이플러스)는 되는 가게도 있지만 보조로만</li></ul>`},
 {ic:"⚠️", grp:"safe", t:"주의사항", h:`<ul>
  <li><b>전자담배</b> 2026-04-30부터 공공장소 소지·사용 시 최대 HK$50,000 벌금 → 가져가지 않기</li>
  <li><b>공휴일·연휴</b>엔 관광지·페리 혼잡, 일부 가게 휴무 (가을엔 국경절·중양절 연휴)</li>
  <li><b>태풍</b>: T8 이상이면 페리·버스 중단 → MyObservatory 앱 · 블랙 레인이면 실내 대기</li>
  <li>콘센트 영국식 3핀(G타입) → 어댑터 · 비닐봉투 HK$1 → 장바구니</li>
  <li>식당 봉사료 10% 포함 → 팁 불필요 · 딤섬집 찻값 별도</li>
  <li>몽콕·네이단로드: 가짜 승려 기부, 찻집 초대 사기, 소매치기 주의</li>
  <li>두리안은 호텔·대중교통 반입 금지 많음</li>
  <li><b>육포</b>는 한국으로 가져올 수 없어요 (마카오 육포거리에서 산 건 현지에서 다 먹기)</li>
  <li>비상: 경찰·구급 <b>999</b> · 총영사관 +852 2529 4141 · 긴급 당직 <b>+852 9731 0092</b></li></ul>`},
 {ic:"🍳", grp:"ref", t:"차찬텡 메뉴 주문 가이드 (릴스 65)", h:`
  <p>토스트·파인애플번 말고 뭘 고를지 — 광동어 메뉴에서 <b>실패 없는 8가지</b>. 글자를 그대로 보여주면 주문돼요.</p>
  <table>
  <tr><th>咕嚕肉</th><td><b>탕수육</b> — 파인애플·양파·피망에 새콤달콤. 가장 무난한 첫 주문</td></tr>
  <tr><th>蔥油豬扒飯</th><td><b>파기름 포크찹 덮밥</b> — 바삭한 돼지고기 + 짭짤한 파기름 소스</td></tr>
  <tr><th>咖喱飯</th><td><b>홍콩 카레라이스</b> — 코코넛밀크로 묽고 순한 맛, 고기·감자. 토핑 선택 가능</td></tr>
  <tr><th>椒鹽豬扒飯</th><td><b>소금·후추 포크찹 덮밥</b> — 마늘·고추를 같이 튀겨 향이 좋음</td></tr>
  <tr><th>麻婆豆腐</th><td><b>마파두부</b> — 홍콩 것은 아니지만 차찬텡에 흔하고, 많이 안 매움</td></tr>
  <tr><th>番茄焗豬扒飯</th><td><b>토마토 포크찹 오븐밥</b> — 볶음밥 + 토마토소스 + 치즈를 구움 (칼로리 주의)</td></tr>
  <tr><th>滑蛋飯</th><td><b>부드러운 계란 덮밥</b> — 반숙 스크램블 + 차슈·소고기·새우 중 선택</td></tr>
  <tr><th>番茄炒蛋</th><td><b>토마토 계란볶음</b> — 집밥 같은 맛, 고기·두부 추가도 가능</td></tr></table>
  <p class="tiny">안 매운 걸 좋아하면 咕嚕肉 · 椒鹽豬扒飯. 란퐁유엔·미도카페·푸와 카페에서 바로 써먹기.</p>`},
 {ic:"💡", grp:"ref", t:"릴스 꿀팁 모음", h:`<ul>
  <li>피크는 <b>해 지기 30~40분 전</b> 올라가기 (낮·노을·야경 한 번에)</li>
  <li>미드레벨 에스컬레이터: 오전 하행 / 오후 상행</li>
  <li>야시장은 <b>7~9시</b>가 분위기 최고, 10시 넘으면 마감</li>
  <li>익청빌딩·초이홍은 <b>오전</b>에 (사람 다 걸림)</li>
  <li>미드레벨 에스컬레이터 근처 <b>쑨원 기념관</b>은 입장 무료 — 붉은 벽돌 저택 외관이 사진 스팟 (실내 촬영은 금지)</li>
  <li>2명 이상이면 택시가 편하고 저렴한 편 (기본 HK$29 안팎)</li>
  <li>얇은 긴팔 + 편한 운동화 (실내 냉방 강하고 언덕·계단 많음)</li>
  <li>베이크하우스는 오전에 (오후엔 품절) · 생지 바삭한 에그타르트는 <b>홈베이크</b>(퀸즈로드센트럴)와 비교</li>
  <li>PMQ 빈티지 카메라 사진관(告白鎏影館): 사진 받을 때 가게 이름을 <b>중국어로 써 달라고</b> 하기</li>
  <li>란퐁유엔 줄 길면 바로 옆 先滋先覺</li>
  <li><b>피크트램</b>: 사전예매 · 17~18시 가장 붐빔 · 올라갈 때 오른쪽, 내려올 때 왼쪽 자리 · 무료 야경은 피크 갤러리아 옥상</li>
  <li><b>마카오 성 바울</b>: 계단 위 오른쪽 나무길 숨은 포토존 (마테오 리치 동상) · 마카오는 무료 호텔 셔틀만으로 이동 가능</li>
  <li><b>바 레오네</b>: 17시 오픈 전에 대기 등록 → WhatsApp 알림 오면 <b>10분 안에</b> 복귀 (PMQ·캣스트리트·몬타나에서 대기)</li>
  <li>조용한 야경은 <b>서구룡 해변 산책로</b> — 해 지기 전에 가서 노을부터 (오스틴역)</li>
  <li>요즘 유행 디저트: 티라미수 버터떡(LY 베이커리) · 티라미수 라떼(게틴·클라우디 그라운드) · 초코 카스테라(푸와 베이커리)</li></ul>`},
 {ic:"🛍️", grp:"ref", t:"쇼핑 메모", h:`<ul>
  <li><b>디카</b>: 압류가 노점(흥정, 한국보다 30~40% 저렴) vs 푹와 카메라(상가, 정찰제, 상태 좋음)</li>
  <li><b>위스키</b>: 스프링뱅크 10년 HK$880 / 15년 HK$1,580 · 다 싼 건 아님 · <b>입국 면세 주류 2병·2L·US$400</b></li>
  <li><b>향 오일</b>: 시우싱홍 50ml HK$80 (월–토 09:30–17:30)</li>
  <li><b>선물용 쿠키</b>: 제니베이커리 셩완점 (현금만)</li>
  <li><b>간식 선물</b>: 세븐일레븐 피스타치오 코코아 크런치 (대만 여행객 품절대란) — 시내에 없으면 공항 편의점</li>
  <li><b>페닌슐라</b>: 부티크 펜베어 키링 HK$238 · 지하 메르카토 고메(치즈·올리브·와인)</li>
  <li><b>할리우드로드 소품</b>: G.O.D.(홍콩 감성 소품) · 그린레몬 아틀리에(반지, WhatsApp 6357 9905) · 폴레트(안경·선글라스)</li>
  <li>K11 MUSEA 로컬 편집숍 Kapok · I.T / 셩완 빈티지 Select 18 / 케네디타운 트램 스토어 / 코즈웨이베이 섭듀드(홍콩 티)</li>
  <li>위치 확인 중: 2nd Street(빈티지), Sindart(자수 수제화), Elegant Tang Dynasty(마그넷)</li></ul>`},
 {ic:"📱", grp:"prep", t:"예약 방법", h:`<ul>
  <li><b>SevenRooms</b> (칠리파가라·얏퉁힌·더들스·만와·테라스 불루드): 링크 → 날짜·인원 → 영문 이름·이메일·+82 번호</li>
  <li><b>OpenRice</b> = 홍콩판 캐치테이블 (예약 + 원격 줄서기). +82 인증은 출국 전 테스트</li>
  <li><b>Gulu</b> (아이만생): 홍콩 번호 요구 사례 → 안 되면 전화·오픈런</li>
  <li>캐치테이블 글로벌은 홍콩 식당 미지원</li></ul>`},
 {ic:"💵", grp:"prep", t:"현금 · 트래블월렛 얼마나? (2인 4박 예시)", h:`
  <table><tr><th>현금</th><td><b>HK$3,000</b> (약 53만 원) — 출발 전 한국에서 환전<br><span class="tiny">카드 안 되는 노포·간식 약 HK$1,700 (5일) · 택시·마카오 현금 HK$400 · 야시장·노점 HK$400 · 비상금 HK$500</span></td></tr>
  <tr><th>트래블월렛<br>HKD</th><td><b>HK$5,000</b> (약 88만 원) 출발 전 충전<br><span class="tiny">공항철도·MTR·피크트램 약 HK$1,000 · 칠리파가라·포토 동선 날 저녁·아이만생 등 식사·카페 HK$2,700~4,300 · 바·기타 HK$900~1,200</span></td></tr>
  <tr><th>트래블월렛<br>MOP</th><td><b>MOP 1,500</b> (약 26만 원) — 마카오 가기 전날 밤 충전, 마카오 카드 결제용 (디에잇·북방관·카사 마퀴스타). 디에잇 안 가면 MOP 500</td></tr></table>
  <ul><li>합계 약 <b>167만 원</b> (항공·숙소·쇼핑 제외) · 1인으로 나누면 현금 HK$1,500씩</li>
  <li>쇼핑(위스키 HK$880~·안경·기념품)은 따로 — 현지에서 앱으로 바로 추가 충전 (해외에서도 몇 초)</li>
  <li>압류가에서 디카 살 거면 현금 <b>+HK$1,000~2,000</b> (노점은 현금 흥정)</li>
  <li>마카오 페리·피크트램을 클룩 등에서 미리 사면 그만큼 빼기</li>
  <li><b>지폐는 HK$100·50·20 위주</b> (작은 가게·택시는 HK$500·1,000 거스름돈이 없을 수 있음) — 은행 지점 수령 때 소액권 요청</li></ul>
  <p><b>트래블월렛 규칙</b> (공식 고객센터, 2026)</p>
  <ul><li>결제 통화와 <b>같은 통화가 충전돼 있어야</b> 결제돼요 → 홍콩은 HKD, 마카오는 MOP</li>
  <li>HKD·MOP 충전 수수료 0.5~2.5% (원화·달러·엔·유로만 0%) → 한꺼번에 많이 넣지 말고 모자라면 추가</li>
  <li>잔액 포함 200만 원까지 (앱 '더보기 → 이용한도'에서 300만 원으로 증액)</li>
  <li><b>잔액 부족 시 자동충전</b> 켜 두기: 앱 '더보기 → 계좌/충전 관리' (신한·국민·토스·우리·카카오·IBK·농협 계좌, 1만 원 단위)</li>
  <li>교통 태그는 <b>1인 1카드</b> — 트래블월렛이 한 장뿐이면 다른 한 명은 다른 트래블카드나 옥토퍼스 필요</li>
  <li>남은 잔액은 앱에서 원화로 환불</li></ul>
  <p class="tiny">예시 코스·가게 가격으로 계산한 대략값이에요 (1 HKD ≈ 175원, 1 MOP ≈ 170원). 사람마다 차이가 커요.</p>`},
];

// 최근 후기·영상
window.REVIEWS = [
  ["블로그","직장인 무계획 홍콩 여행 1일차","2026-09-22","https://blog.naver.com/slow__house/224420305591"],
  ["블로그","홍콩 3박4일 옥토퍼스·교통·숙박 A to Z","2026-08-15","https://blog.naver.com/philosophiejin/224379587396"],
  ["블로그","트래블월렛+HSBC ATM 환전 꿀팁","2026-09-16","https://blog.naver.com/suzin-n/224413985077"],
  ["블로그","늦여름 홍콩 여행 총정리 (셩완 숙소)","2026-09-12","https://blog.naver.com/u___rim_/224409570434"],
  ["블로그","피크트램 티켓 대기시간","2026-09-20","https://blog.naver.com/qlalfrhdrks122/224418064940"],
  ["블로그","센트럴 커플스냅 솔직 후기","2026-06-29","https://blog.naver.com/alsgml4726/224331080331"],
  ["블로그","몽콕 현지 포토그래퍼 커플스냅","2026-08-31","https://blog.naver.com/wlgusthgus36/224395450726"],
  ["블로그","몽콕 꽃시장 & 커플스냅","2026-08-22","https://blog.naver.com/butterxup/224386680324"],
  ["블로그","페리 타고 마카오 당일치기","2026-09-23","https://blog.naver.com/yogahippo/224421198630"],
  ["블로그","마카오 페리 무료로 타는 법","2026-09-16","https://blog.naver.com/gyusdaily/224414238173"],
  ["유튜브","3박4일 홍콩 (마카오 당일치기)","2026-09-04","https://www.youtube.com/watch?v=8jY8_rtwOnI"],
  ["유튜브","혼자 2박3일 (익청·피크트램·카우키)","2026-08-30","https://www.youtube.com/watch?v=IFtswJtQbrs"],
  ["유튜브","인생 첫 홍콩 여행 브이로그","2026-09-08","https://www.youtube.com/watch?v=rIM_IM6dO-I"],
  ["유튜브","마카오 당일치기 브이로그","2026-09-11","https://www.youtube.com/watch?v=B8_k_ClxHJ4"],
  ["유튜브","마카오 당일치기 꿀팁","2026-07-12","https://www.youtube.com/watch?v=VfIrpVdwWYI"],
  ["유튜브","44 Tips Before Visiting Hong Kong","2026-08-07","https://www.youtube.com/watch?v=TsPFy9teqtE"],
];
