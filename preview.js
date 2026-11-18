/*
 * Website preview — builds a working sample website from the add-ons chosen
 * on the pricing page and shows it in a dialog (desktop / mobile, site / admin
 * / Google / services). Everything is generated client-side.
 *
 *   WebPreview.open({ qty: { page: 4, cms: 1, ... }, host: 'standard' })
 */
(() => {
  /* ─────────────── Sample content ─────────────── */
  const LANGS = [
    { code: 'th', label: 'ไทย' }, { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' }, { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' }, { code: 'de', label: 'Deutsch' }, { code: 'fr', label: 'Français' },
    { code: 'vi', label: 'Tiếng Việt' }, { code: 'id', label: 'Bahasa' }, { code: 'ar', label: 'العربية' }, { code: 'ru', label: 'Русский' },
  ];
  // UI text for the sample site. Languages missing here fall back to English.
  const T = {
    th: { home: 'หน้าแรก', about: 'เกี่ยวกับเรา', products: 'สินค้า', contact: 'ติดต่อเรา', services: 'บริการ', portfolio: 'ผลงาน', team: 'ทีมงาน', careers: 'ร่วมงานกับเรา', faq: 'คำถามที่พบบ่อย', gallery: 'แกลเลอรี', partners: 'พันธมิตร', certificates: 'มาตรฐาน', locations: 'สาขา', news: 'ข่าวสาร', heroTitle: 'ผลไม้ไทยคุณภาพส่งออก ส่งตรงถึงมือคุณ', heroLead: 'บริษัทตัวอย่าง คัดผลไม้จากสวนทั่วประเทศ บรรจุในโรงงานมาตรฐาน GMP ส่งทั้งในและต่างประเทศ', cta: 'ดูสินค้า', quote: 'ขอใบเสนอราคา', send: 'ส่งข้อความ', login: 'เข้าสู่ระบบ', cart: 'ตะกร้า', add: 'ใส่ตะกร้า', season: 'ปฏิทินฤดูกาล', read: 'อ่านต่อ', name: 'ชื่อ', email: 'อีเมล', msg: 'ข้อความ', product: 'สินค้าที่สนใจ' },
    en: { home: 'Home', about: 'About us', products: 'Products', contact: 'Contact', services: 'Services', portfolio: 'Portfolio', team: 'Our team', careers: 'Careers', faq: 'FAQ', gallery: 'Gallery', partners: 'Partners', certificates: 'Certificates', locations: 'Locations', news: 'News', heroTitle: 'Export-grade Thai fruit, delivered to you', heroLead: 'Sample Co. selects fruit from farms across Thailand, packs it in a GMP facility and ships worldwide.', cta: 'View products', quote: 'Request a quote', send: 'Send message', login: 'Sign in', cart: 'Cart', add: 'Add to cart', season: 'Harvest calendar', read: 'Read more', name: 'Name', email: 'Email', msg: 'Message', product: 'Product of interest' },
    zh: { home: '首页', about: '关于我们', products: '产品', contact: '联系我们', services: '服务', portfolio: '案例', team: '团队', careers: '招聘', faq: '常见问题', gallery: '图库', partners: '合作伙伴', certificates: '认证', locations: '网点', news: '新闻', heroTitle: '出口级泰国水果，直送到您手中', heroLead: '示例公司从泰国各地果园精选水果，在 GMP 工厂包装，发往全球。', cta: '查看产品', quote: '索取报价', send: '发送', login: '登录', cart: '购物车', add: '加入购物车', season: '产季日历', read: '阅读', name: '姓名', email: '邮箱', msg: '留言', product: '意向产品' },
    ja: { home: 'ホーム', about: '会社案内', products: '製品', contact: 'お問い合わせ', services: 'サービス', portfolio: '実績', team: 'チーム', careers: '採用情報', faq: 'よくある質問', gallery: 'ギャラリー', partners: 'パートナー', certificates: '認証', locations: '拠点', news: 'ニュース', heroTitle: '輸出品質のタイ産フルーツをお届けします', heroLead: 'サンプル社はタイ各地の農園から果物を選び、GMP工場で梱包して世界へ出荷します。', cta: '製品を見る', quote: '見積もりを依頼', send: '送信', login: 'ログイン', cart: 'カート', add: 'カートに入れる', season: '収穫カレンダー', read: '読む', name: 'お名前', email: 'メール', msg: 'メッセージ', product: 'ご希望の製品' },
    ko: { home: '홈', about: '회사 소개', products: '제품', contact: '문의', services: '서비스', portfolio: '실적', team: '팀', careers: '채용', faq: '자주 묻는 질문', gallery: '갤러리', partners: '파트너', certificates: '인증', locations: '지점', news: '뉴스', heroTitle: '수출 품질의 태국 과일을 전해 드립니다', heroLead: '샘플 회사는 태국 전역의 농장에서 과일을 선별해 GMP 공장에서 포장하고 전 세계로 보냅니다.', cta: '제품 보기', quote: '견적 요청', send: '보내기', login: '로그인', cart: '장바구니', add: '장바구니 담기', season: '수확 달력', read: '읽기', name: '이름', email: '이메일', msg: '메시지', product: '관심 제품' },
    es: { home: 'Inicio', about: 'Nosotros', products: 'Productos', contact: 'Contacto', services: 'Servicios', portfolio: 'Proyectos', team: 'Equipo', careers: 'Empleo', faq: 'Preguntas', gallery: 'Galería', partners: 'Socios', certificates: 'Certificados', locations: 'Sedes', news: 'Noticias', heroTitle: 'Fruta tailandesa de calidad exportación', heroLead: 'Sample Co. selecciona fruta de fincas de toda Tailandia, la empaca en una planta GMP y la envía al mundo.', cta: 'Ver productos', quote: 'Solicitar cotización', send: 'Enviar', login: 'Entrar', cart: 'Carrito', add: 'Añadir', season: 'Calendario de cosecha', read: 'Leer', name: 'Nombre', email: 'Correo', msg: 'Mensaje', product: 'Producto' },
    de: { home: 'Start', about: 'Über uns', products: 'Produkte', contact: 'Kontakt', services: 'Leistungen', portfolio: 'Referenzen', team: 'Team', careers: 'Karriere', faq: 'FAQ', gallery: 'Galerie', partners: 'Partner', certificates: 'Zertifikate', locations: 'Standorte', news: 'News', heroTitle: 'Thailändisches Obst in Exportqualität', heroLead: 'Sample Co. wählt Obst von Farmen in ganz Thailand, verpackt es GMP-gerecht und liefert weltweit.', cta: 'Produkte ansehen', quote: 'Angebot anfragen', send: 'Senden', login: 'Anmelden', cart: 'Warenkorb', add: 'In den Warenkorb', season: 'Erntekalender', read: 'Lesen', name: 'Name', email: 'E-Mail', msg: 'Nachricht', product: 'Produkt' },
  };
  const PAGE_ORDER = ['about', 'products', 'contact', 'services', 'portfolio', 'team', 'careers', 'faq', 'gallery', 'partners', 'certificates', 'locations'];
  const PRODUCTS = [
    { id: 'durian', th: 'ทุเรียนหมอนทอง', en: 'Monthong Durian', cat: 'fruit', img: 'img/p-durian.webp', price: 450, months: [4, 5, 6, 7, 8] },
    { id: 'mango', th: 'มะม่วงน้ำดอกไม้', en: 'Nam Dok Mai Mango', cat: 'fruit', img: 'img/p-mango.webp', price: 120, months: [3, 4, 5, 6] },
    { id: 'mangosteen', th: 'มังคุด', en: 'Mangosteen', cat: 'fruit', img: 'img/p-mangosteen.webp', price: 150, months: [5, 6, 7, 8] },
    { id: 'coconut', th: 'มะพร้าวน้ำหอม', en: 'Young Coconut', cat: 'fruit', img: 'img/p-coconut.webp', price: 45, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'pineapple', th: 'สับปะรด', en: 'Pineapple', cat: 'fruit', img: 'img/p-pineapple.webp', price: 60, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'pomelo', th: 'ส้มโอ', en: 'Pomelo', cat: 'fruit', img: 'img/p-pomelo.webp', price: 90, months: [8, 9, 10, 11] },
  ];
  const SPECIALS = ['ปฏิทินฤดูกาลสินค้า', 'ตารางราคาประจำสัปดาห์', 'แผนที่จุดรับสินค้า', 'คำนวณค่าขนส่ง', 'ติดตามสถานะคำสั่งซื้อ'];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = (n) => Number(n).toLocaleString('th-TH');

  /* ─────────────── Sample website (rendered inside an iframe) ─────────────── */
  function siteHTML(o, base) {
    const langs = LANGS.slice(0, 2 + Math.min(o.lang, LANGS.length - 2));
    const pages = PAGE_ORDER.slice(0, Math.min(o.page, PAGE_ORDER.length));
    const extraPages = Math.max(0, o.page - PAGE_ORDER.length);
    const nav = ['home', ...pages, ...(o.news ? ['news'] : [])];
    if (o.page === 0 && !nav.includes('contact')) nav.push('contact'); // one-page site: anchor sections
    const onePage = o.page === 0;
    const brand = !!o.design;
    const showForm = o.form || o.quote;
    if (showForm && !onePage && !nav.includes('contact')) nav.splice(nav.length - (o.news ? 1 : 0), 0, 'contact');
    const cfg = { onePage, langs: langs.map((l) => l.code), shop: !!o.shop, line: !!o.line, member: !!o.member, photo: o.photo > 0 };

    const t = (k) => `<span data-t="${k}">${esc(T.th[k] || k)}</span>`;
    const product = (p) => `
      <article class="card prod">
        <div class="pimg${o.photo ? ' edited' : ''}"><img src="${base}${p.img}" alt="${esc(p.th)}"></div>
        <div class="pbody">
          <h4 data-en="${esc(p.en)}" data-th="${esc(p.th)}">${esc(p.th)}</h4>
          ${o.catalog ? `<p class="muted">ฤดูกาล: ${p.months.length === 12 ? 'ตลอดปี' : p.months.map((m) => m + '').join(', ')}</p>` : ''}
          ${o.shop ? `<div class="row"><b>${fmt(p.price)} บาท/กก.</b><button class="btn sm" data-add="${p.id}">${t('add')}</button></div>`
            : o.catalog ? `<button class="link" data-detail="${p.id}">รายละเอียดสินค้า →</button>` : ''}
        </div>
      </article>`;

    const productsBlock = o.catalog
      ? `<div class="chips"><span class="chip on">ทั้งหมด</span><span class="chip">ผลไม้สด</span><span class="chip">ผลไม้ตัดแต่ง</span><span class="chip">แปรรูป</span></div>
         <div class="grid3">${PRODUCTS.map(product).join('')}</div>
         <div class="detail card" id="detail" hidden></div>`
      : `<div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div>
         <p class="muted note">หน้าสินค้าแบบข้อความและรูป (แก้ไขผ่านผู้พัฒนา) · เพิ่ม “แคตตาล็อกสินค้า” เพื่อมีหมวดหมู่และหน้ารายละเอียด</p>`;

    const calendar = `
      <div class="card cal">
        <h3>${t('season')}</h3>
        <div class="calgrid"><span></span>${['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m) => `<span class="mh">${m}</span>`).join('')}
        ${PRODUCTS.map((p) => `<span class="pn">${esc(p.th)}</span>${Array.from({ length: 12 }, (_, i) => `<span class="${p.months.includes(i + 1) ? 'on' : ''}"></span>`).join('')}`).join('')}</div>
      </div>`;
    const priceTable = `
      <div class="card"><h3>ตารางราคาประจำสัปดาห์</h3>
        <table class="tbl"><tr><th>สินค้า</th><th>เกรด A</th><th>เกรด B</th></tr>
        ${PRODUCTS.slice(0, 4).map((p) => `<tr><td>${esc(p.th)}</td><td>${fmt(p.price)}</td><td>${fmt(Math.round(p.price * 0.8))}</td></tr>`).join('')}</table></div>`;
    const specials = Array.from({ length: o.special }, (_, i) =>
      i === 0 ? calendar : i === 1 ? priceTable : `<div class="card"><h3>${SPECIALS[i]}</h3><p class="muted">ฟีเจอร์เฉพาะธุรกิจรายการที่ ${i + 1} ออกแบบตามความต้องการ</p></div>`).join('');

    const form = (quote) => `
      <form class="card form" data-form="${quote ? 'quote' : 'contact'}">
        <h3>${quote ? t('quote') : t('contact')}</h3>
        <label>${t('name')}<input required value="สมชาย ใจดี"></label>
        <label>${t('email')}<input type="email" required value="somchai@example.com"></label>
        ${quote ? `<label>${t('product')}<select>${PRODUCTS.map((p) => `<option>${esc(p.th)}</option>`).join('')}</select></label><label>ปริมาณ<input value="2 ตัน / เดือน"></label>` : ''}
        <label>${t('msg')}<textarea rows="3">สนใจสินค้า ขอรายละเอียดเพิ่มเติมครับ</textarea></label>
        <button class="btn" type="submit">${quote ? t('quote') : t('send')}</button>
      </form>`;

    const contactBlock = `
      <div class="split">
        <div class="card"><h3>${t('contact')}</h3>
          <p>📍 123 ถนนตัวอย่าง กรุงเทพฯ 10110<br>📞 02-123-4567<br>✉️ sales@yourcompany.com<br>💬 LINE: @yourcompany</p>
          <div class="map">แผนที่ Google Maps</div></div>
        ${o.quote ? form(true) : o.form ? form(false) : '<div class="card muted">ฟอร์มติดต่อ: เพิ่ม add-on “ฟอร์มติดต่อ” หรือ “ฟอร์มขอใบเสนอราคา”</div>'}
      </div>`;

    const articles = Array.from({ length: Math.max(3, Math.min(6, o.article || 3)) }, (_, i) => ({
      title: ['วิธีเลือกทุเรียนหมอนทองให้อร่อย', 'ฤดูกาลผลไม้ไทย 2026', 'มาตรฐาน GMP คืออะไร', 'ส่งออกผลไม้ไปจีนต้องรู้อะไรบ้าง', 'มะพร้าวน้ำหอมดีอย่างไร', 'เทคนิคยืดอายุผลไม้สด'][i],
      img: PRODUCTS[i % PRODUCTS.length].img,
    }));
    const newsBlock = `<div class="grid3">${articles.map((a, i) => `
      <article class="card prod"><div class="pimg"><img src="${base}${a.img}" alt=""></div>
      <div class="pbody"><span class="muted">${12 - i} พ.ย. 2569</span><h4>${a.title}</h4><button class="link">${t('read')} →</button></div></article>`).join('')}</div>
      ${o.article > 6 ? `<p class="muted note">และบทความอื่นอีก ${o.article - 6} บทความ</p>` : ''}`;

    const genericPage = (k) => `<div class="split"><div class="card"><h3>${t(k)}</h3><p class="muted">เนื้อหาหน้านี้ เช่น ข้อความ รูปภาพ และรายละเอียด${o.cms ? ' แก้ไขเองได้จากหลังบ้าน' : ''}</p><p>บริษัทตัวอย่างดำเนินธุรกิจมากว่า 10 ปี มีลูกค้าใน 9 ประเทศ ได้รับมาตรฐาน GMP และ HACCP</p></div><div class="ph-img"><img src="${base}img/p-farm.webp" alt=""></div></div>`;

    const sections = {
      home: `
        <section class="hero"><div class="hero-in">
          <span class="eyebrow">บริษัทตัวอย่าง จำกัด</span>
          <h1>${t('heroTitle')}</h1><p>${t('heroLead')}</p>
          <div class="row"><a class="btn" href="#" data-go="${onePage ? 'products' : nav.includes('products') ? 'products' : nav.includes('about') ? 'about' : 'home'}">${t('cta')}</a>
          ${showForm ? `<a class="btn ghost" href="#" data-go="contact">${o.quote ? t('quote') : t('contact')}</a>` : ''}</div>
        </div></section>
        <section class="wrap stats"><div><b>10+</b><span>ปีประสบการณ์</span></div><div><b>9</b><span>ประเทศ</span></div><div><b>GMP</b><span>มาตรฐานโรงงาน</span></div><div><b>${langs.length}</b><span>ภาษา</span></div></section>
        ${specials ? `<section class="wrap">${specials}</section>` : ''}
        ${onePage ? `
          <section class="wrap" id="sec-about">${genericPage('about')}</section>
          <section class="wrap" id="sec-products"><h2>${t('products')}</h2>${o.catalog ? productsBlock : `<div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div>`}</section>
          <section class="wrap" id="sec-contact">${contactBlock}</section>`
        : `<section class="wrap"><h2>${t('products')}</h2><div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div></section>`}`,
      about: `<section class="wrap">${genericPage('about')}</section>`,
      products: `<section class="wrap"><h2>${t('products')}</h2>${o.photo ? '<div class="ba"><span>ตกแต่งรูปสินค้า:</span><button class="chip on" data-photo="after">หลังตกแต่ง</button><button class="chip" data-photo="before">ก่อนตกแต่ง</button></div>' : ''}${productsBlock}</section>`,
      contact: `<section class="wrap">${contactBlock}</section>`,
      news: `<section class="wrap"><h2>${t('news')}</h2>${newsBlock}</section>`,
    };
    pages.forEach((k) => { if (!sections[k]) sections[k] = `<section class="wrap">${genericPage(k)}</section>`; });

    const css = `
      :root{--c:${brand ? '#0f4c30' : '#1f4e79'};--c2:${brand ? '#1b7047' : '#2f6aa3'};--soft:${brand ? '#e7f0ea' : '#e8eef6'};--bg:#fff;--ink:#16212b;--mute:#6b7680;--line:#e1e5ea;
        --fh:${brand ? "'Source Serif 4', 'Noto Serif Thai', Georgia, serif" : "'IBM Plex Sans Thai', system-ui, sans-serif"};--fb:'IBM Plex Sans Thai', system-ui, sans-serif}
      *{box-sizing:border-box}body{margin:0;font:15px/1.6 var(--fb);color:var(--ink);background:var(--bg)}
      h1,h2,h3,h4{font-family:var(--fh);margin:0 0 .4em;line-height:1.2;font-weight:${brand ? 500 : 700}}
      a{color:inherit;text-decoration:none}.muted{color:var(--mute);font-size:13px}.note{margin-top:12px}
      header{position:sticky;top:0;z-index:5;display:flex;gap:14px;align-items:center;padding:12px 20px;background:#fff;border-bottom:1px solid var(--line);flex-wrap:wrap}
      .logo{font-weight:700;font-family:var(--fh);font-size:18px;color:var(--c);display:flex;gap:8px;align-items:center}.logo i{width:26px;height:26px;border-radius:${brand ? '50% 50% 50% 0' : '6px'};background:var(--c);display:inline-block}
      nav{display:flex;gap:4px;flex-wrap:wrap;flex:1}nav a{padding:6px 10px;border-radius:6px;font-size:14px;color:#3a4652}nav a.on,nav a:hover{background:var(--soft);color:var(--c)}
      .tools{display:flex;gap:8px;align-items:center}select.lang{font:inherit;font-size:13px;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#fff}
      .btn{display:inline-flex;align-items:center;gap:6px;border:0;cursor:pointer;background:var(--c);color:#fff;padding:10px 18px;border-radius:${brand ? '3px' : '8px'};font:600 14px var(--fb)}
      .btn.sm{padding:6px 10px;font-size:13px}.btn.ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}.btn.line{background:transparent;color:var(--c);box-shadow:inset 0 0 0 1px var(--c)}
      .link{border:0;background:none;color:var(--c2);cursor:pointer;font:600 13px var(--fb);padding:0}
      .hero{${brand ? `background:linear-gradient(90deg,rgba(10,50,33,.92),rgba(10,50,33,.35)),url(${base}img/p-hero.webp) center/cover;min-height:380px` : 'background:var(--c);min-height:280px'};color:#fff;display:flex;align-items:center}
      .hero-in{max-width:1080px;margin:0 auto;padding:48px 24px;width:100%}.hero h1{font-size:${brand ? '40px' : '30px'};max-width:16em;color:#fff}.hero p{max-width:40em;opacity:.9}
      ${brand ? '' : '.hero .btn:not(.ghost){background:#fff;color:var(--c)}'}
      .eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85}.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between}.hero .row{justify-content:flex-start;margin-top:16px}
      .wrap{max-width:1080px;margin:0 auto;padding:32px 24px}.wrap h2{font-size:26px}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stats div{background:${brand ? '#fff' : 'var(--soft)'};${brand ? 'box-shadow:0 10px 30px -18px rgba(0,0,0,.4);' : ''}padding:16px;border-radius:8px}.stats b{display:block;font:600 26px var(--fh);color:var(--c)}.stats span{font-size:13px;color:var(--mute)}
      .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.card{border:1px solid var(--line);border-radius:10px;padding:16px;background:#fff}
      .prod{padding:0;overflow:hidden}.pimg{aspect-ratio:4/3;background:var(--soft);overflow:hidden}.pimg img{width:100%;height:100%;object-fit:cover;${brand ? 'mix-blend-mode:multiply' : ''}}
      .before .edited img{filter:saturate(.55) brightness(.8) contrast(.85) sepia(.15)}.pbody{padding:12px 14px}.pbody h4{font-size:17px}
      .chips,.ba{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;align-items:center}.chip{border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:13px;background:#fff;cursor:pointer}.chip.on{background:var(--c);color:#fff;border-color:var(--c)}
      .split{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.ph-img{border-radius:10px;overflow:hidden;aspect-ratio:4/3}.ph-img img{width:100%;height:100%;object-fit:cover}
      .map{margin-top:10px;height:120px;border-radius:8px;background:repeating-linear-gradient(45deg,var(--soft),var(--soft) 10px,#fff 10px,#fff 20px);display:grid;place-items:center;color:var(--mute);font-size:13px}
      .form label{display:block;font-size:13px;color:var(--mute);margin-bottom:8px}.form input,.form select,.form textarea{width:100%;font:inherit;font-size:14px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;margin-top:3px;color:var(--ink)}
      .cal{margin-bottom:14px}.calgrid{display:grid;grid-template-columns:110px repeat(12,1fr);gap:3px;font-size:11px;align-items:center}.calgrid .mh{text-align:center;color:var(--mute)}.calgrid .pn{font-size:12px}
      .calgrid span:not(.mh):not(.pn){height:10px;border-radius:3px;background:var(--soft)}.calgrid span.on{background:var(--c2)}
      .tbl{width:100%;border-collapse:collapse;font-size:14px}.tbl th,.tbl td{text-align:left;padding:6px 8px;border-top:1px solid var(--line)}
      footer{background:${brand ? '#0a3221' : '#1b2733'};color:#d6dde3;padding:28px 24px;font-size:13px}footer .in{max-width:1080px;margin:0 auto;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
      .dock{position:fixed;right:12px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 30px -14px rgba(0,0,0,.4);overflow:hidden;z-index:6}
      .dock a{display:flex;flex-direction:column;align-items:center;font-size:11px;padding:8px 10px;gap:2px}.dock a+a{border-top:1px solid var(--line)}.dock b{font-size:18px}
      .modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;z-index:10}.modal[hidden]{display:none}.modal .card{width:min(360px,90vw)}
      .toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#06c755;color:#fff;padding:10px 16px;border-radius:12px;font-size:13px;box-shadow:0 10px 30px -10px rgba(0,0,0,.4);z-index:12;max-width:90vw}.toast.plain{background:#1b2733}
      .cartbtn{position:relative}.cartbtn em{position:absolute;top:-6px;right:-6px;background:#e5484d;color:#fff;font-style:normal;font-size:11px;border-radius:999px;padding:0 5px}
      .detail{margin-top:14px;display:grid;grid-template-columns:200px 1fr;gap:16px}.detail img{width:100%;border-radius:8px}
      [data-page]{display:none}[data-page].show{display:block}
      @media (max-width:640px){.grid3,.split,.detail{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}.hero h1{font-size:26px}nav{order:3;flex-basis:100%;overflow-x:auto;flex-wrap:nowrap}nav a{white-space:nowrap}
        .dock{top:auto;bottom:0;left:0;right:0;transform:none;flex-direction:row;border-radius:0;justify-content:space-around}.dock a+a{border-top:0}body{padding-bottom:${o.dock ? '56px' : '0'}}.calgrid{grid-template-columns:80px repeat(12,1fr)}}`;

    const body = `
      <header>
        <a class="logo" href="#" data-go="home">${o.ownLogo ? '' : '<i></i>'}บริษัทตัวอย่าง</a>
        <nav>${nav.map((k) => `<a href="#" data-go="${k}" class="${k === 'home' ? 'on' : ''}">${t(k)}</a>`).join('')}${extraPages ? `<a href="#" data-go="about">+${extraPages} หน้า</a>` : ''}</nav>
        <div class="tools">
          <select class="lang" aria-label="ภาษา">${langs.map((l) => `<option value="${l.code}">${l.label}</option>`).join('')}</select>
          ${o.member ? `<button class="btn sm line" data-open="login">${t('login')}</button>` : ''}
          ${o.shop ? `<button class="btn sm cartbtn" data-open="cart">🛒 ${t('cart')} <em id="cc">0</em></button>` : ''}
        </div>
      </header>
      <main>${nav.concat(onePage ? [] : []).map((k) => `<div data-page="${k}" class="${k === 'home' ? 'show' : ''}">${sections[k] || ''}</div>`).join('')}</main>
      <footer><div class="in"><div><b>บริษัทตัวอย่าง จำกัด</b><br>123 ถนนตัวอย่าง กรุงเทพฯ · 02-123-4567</div><div>${nav.map((k) => T.th[k]).join(' · ')}</div><div>© 2026 ${o.hosted ? '· www.yourcompany.com 🔒' : ''}</div></div></footer>
      ${o.dock ? `<div class="dock"><a href="#" data-go="contact"><b>💬</b>${t('quote')}</a><a href="#"><b style="color:#06c755">LINE</b>LINE</a><a href="#"><b>🟢</b>WhatsApp</a><a href="#"><b>📞</b>โทร</a></div>` : ''}
      <div class="modal" id="m-login" hidden><form class="card form" data-form="login"><h3>${t('login')}</h3><label>${t('email')}<input value="member@example.com"></label><label>รหัสผ่าน<input type="password" value="12345678"></label><button class="btn">${t('login')}</button> <button class="link" type="button" data-close>ยกเลิก</button></form></div>
      <div class="modal" id="m-cart" hidden><div class="card"><h3>${t('cart')}</h3><div id="cart-lines" class="muted">ยังไม่มีสินค้า</div><hr><p><b id="cart-total">0</b> บาท</p><p class="muted">ชำระเงิน: QR พร้อมเพย์ · บัตรเครดิต · โอนผ่านธนาคาร</p><button class="btn" data-pay>ชำระเงิน</button> <button class="link" type="button" data-close>ปิด</button></div></div>`;

    const script = `
      const CFG=${JSON.stringify(cfg)};const T=${JSON.stringify(T)};const PRODUCTS=${JSON.stringify(PRODUCTS)};
      const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
      function go(k){if(CFG.onePage&&k!=='home'){const el=document.getElementById('sec-'+k);if(el){el.scrollIntoView({behavior:'smooth'});return}}
        $$('[data-page]').forEach(p=>p.classList.toggle('show',p.dataset.page===k));$$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.go===k));if(!$('[data-page].show'))$('[data-page="home"]').classList.add('show');window.scrollTo(0,0)}
      function toast(msg,plain){const d=document.createElement('div');d.className='toast'+(plain?' plain':'');d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}
      const cart={};function renderCart(){const ids=Object.keys(cart);$('#cc')&&($('#cc').textContent=ids.reduce((s,k)=>s+cart[k],0));
        if(!$('#cart-lines'))return;$('#cart-lines').innerHTML=ids.length?ids.map(k=>{const p=PRODUCTS.find(x=>x.id===k);return p.th+' × '+cart[k]+' กก. = '+(p.price*cart[k]).toLocaleString('th-TH')}).join('<br>'):'ยังไม่มีสินค้า';
        $('#cart-total').textContent=ids.reduce((s,k)=>s+PRODUCTS.find(x=>x.id===k).price*cart[k],0).toLocaleString('th-TH')}
      document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go);return}
        const a=e.target.closest('[data-add]');if(a){cart[a.dataset.add]=(cart[a.dataset.add]||0)+1;renderCart();toast('ใส่ตะกร้าแล้ว',true);return}
        const o=e.target.closest('[data-open]');if(o){$('#m-'+o.dataset.open).hidden=false;return}
        if(e.target.closest('[data-close]')){$$('.modal').forEach(m=>m.hidden=true);return}
        if(e.target.closest('[data-pay]')){$$('.modal').forEach(m=>m.hidden=true);toast('ตัวอย่าง: ไปหน้าชำระเงิน (QR พร้อมเพย์ / บัตรเครดิต)',true);return}
        const ph=e.target.closest('[data-photo]');if(ph){document.body.classList.toggle('before',ph.dataset.photo==='before');$$('[data-photo]').forEach(b=>b.classList.toggle('on',b===ph));return}
        const dt=e.target.closest('[data-detail]');if(dt){const p=PRODUCTS.find(x=>x.id===dt.dataset.detail);if(!CFG.onePage&&$('[data-page="products"]'))go('products');const d=$('#detail');if(!d)return;d.hidden=false;
          d.innerHTML='<img src="'+document.querySelector('[data-detail="'+p.id+'"]').closest('.prod').querySelector('img').src+'" alt=""><div><h3>'+p.th+'</h3><p class="muted">'+p.en+'</p><table class="tbl"><tr><td>ฤดูกาล</td><td>'+(p.months.length===12?'ตลอดปี':'เดือน '+p.months.join(', '))+'</td></tr><tr><td>การขนส่ง</td><td>ทางอากาศ / ทางเรือ</td></tr><tr><td>บรรจุภัณฑ์</td><td>กล่องส่งออก 10 กก.</td></tr></table></div>';d.scrollIntoView({behavior:'smooth'})}});
      document.addEventListener('submit',e=>{e.preventDefault();const k=e.target.dataset.form;
        if(k==='login'){$$('.modal').forEach(m=>m.hidden=true);const b=$('[data-open="login"]');if(b)b.textContent='สวัสดี คุณลูกค้า';toast('เข้าสู่ระบบแล้ว (ตัวอย่าง)',true);return}
        toast(k==='quote'?'ส่งคำขอใบเสนอราคาแล้ว ข้อมูลเข้าหลังบ้าน':'ส่งข้อความเข้าอีเมลบริษัทแล้ว',true);
        if(CFG.line)setTimeout(()=>toast('LINE แจ้งเตือน: มีลูกค้า'+(k==='quote'?'ขอใบเสนอราคา':'ติดต่อ')+'ใหม่ — สมชาย ใจดี'),900)});
      $('select.lang').addEventListener('change',e=>{const L=T[e.target.value]||T.en;$$('[data-t]').forEach(n=>n.textContent=L[n.dataset.t]||T.en[n.dataset.t]||n.textContent);
        $$('[data-en]').forEach(n=>n.textContent=e.target.value==='th'?n.dataset.th:n.dataset.en);document.documentElement.dir=e.target.value==='ar'?'rtl':'ltr';
        if(!T[e.target.value])toast('ภาษานี้แปลเนื้อหาในโครงการจริง (ตัวอย่างแสดงภาษาอังกฤษ)',true)});`;

    return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Noto+Serif+Thai:wght@500&display=swap">
      <style>${css}</style></head><body>${body}<script>${script}<\/script></body></html>`;
  }

  /* ─────────────── Admin (CMS) mock ─────────────── */
  function adminHTML(o) {
    const menu = [
      ['📊', 'ภาพรวม', true], ['📄', 'หน้าเว็บ', true], ['🍍', 'สินค้า', o.catalog], ['📰', 'บทความ', o.news], ['📨', 'คำขอใบเสนอราคา', o.quote],
      ['🛒', 'คำสั่งซื้อ', o.shop], ['👤', 'สมาชิก', o.member], ['🖼️', 'คลังรูปภาพ', true], ['⚙️', 'ตั้งค่าเว็บไซต์', true], ['👥', 'ผู้ดูแลระบบ', true],
    ].filter((m) => m[2]);
    const langs = LANGS.slice(0, 2 + Math.min(o.lang, LANGS.length - 2));
    const bars = [32, 41, 38, 55, 61, 48, 72, 66, 80, 77, 91, 88, 97, 104];
    return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&display=swap">
      <style>*{box-sizing:border-box}body{margin:0;font:14px/1.55 'IBM Plex Sans Thai',system-ui,sans-serif;color:#1c2530;background:#f4f6f8;display:grid;grid-template-columns:220px 1fr;min-height:100vh}
      aside{background:#fff;border-right:1px solid #e3e7eb;padding:16px}aside b{display:block;margin-bottom:14px}aside a{display:flex;gap:8px;padding:8px 10px;border-radius:6px;color:#3b4652;text-decoration:none;cursor:pointer}aside a.on,aside a:hover{background:#e7f0ea;color:#0f4c30}
      main{padding:20px 24px}h2{margin:0 0 4px}.muted{color:#6b7680;font-size:13px}.card{background:#fff;border:1px solid #e3e7eb;border-radius:10px;padding:16px;margin-top:14px}
      .tabs{display:flex;gap:4px;flex-wrap:wrap;margin:10px 0}.tabs span{padding:4px 10px;border-radius:6px;border:1px solid #e3e7eb;font-size:12px;background:#fff}.tabs span.on{background:#0f4c30;color:#fff;border-color:#0f4c30}
      label{display:block;font-size:13px;color:#6b7680;margin-top:10px}input,textarea{width:100%;font:inherit;padding:8px 10px;border:1px solid #d8dde2;border-radius:6px;margin-top:3px}
      .btn{background:#0f4c30;color:#fff;border:0;border-radius:6px;padding:8px 16px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer;margin-top:12px}
      table{width:100%;border-collapse:collapse;font-size:13px}td,th{text-align:left;padding:8px;border-top:1px solid #eef1f3}.pill{font-size:11px;padding:2px 8px;border-radius:999px;background:#fff3d6;color:#8a5a00}.pill.g{background:#e3f4e9;color:#1b7047}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.kpi b{display:block;font-size:24px;color:#0f4c30}
      [data-v]{display:none}[data-v].show{display:block}
      @media (max-width:640px){body{grid-template-columns:1fr}aside{display:flex;overflow-x:auto;gap:4px;padding:8px}aside b{display:none}aside a{white-space:nowrap}.grid{grid-template-columns:1fr}}</style></head><body>
      <aside><b>หลังบ้าน · บริษัทตัวอย่าง</b>${menu.map((m, i) => `<a data-to="${i}" class="${i === 0 ? 'on' : ''}">${m[0]} ${m[1]}</a>`).join('')}</aside>
      <main>
        <section data-v="0" class="show"><h2>ภาพรวม</h2><p class="muted">ยินดีต้อนรับ ผู้ดูแลระบบ</p>
          <div class="grid">
            <div class="card kpi"><span class="muted">หน้าเว็บ</span><b>${1 + o.page}</b></div>
            ${o.catalog ? `<div class="card kpi"><span class="muted">สินค้า</span><b>${PRODUCTS.length}</b></div>` : ''}
            ${o.quote ? '<div class="card kpi"><span class="muted">คำขอใบเสนอราคาใหม่</span><b>3</b></div>' : ''}
            <div class="card kpi"><span class="muted">ภาษา</span><b>${langs.length}</b></div>
          </div>
          ${o.ga ? `<div class="card"><b>ผู้เข้าชมเว็บ 14 วันล่าสุด</b> <span class="muted">(Google Analytics)</span>
            <svg viewBox="0 0 420 120" width="100%" height="120" role="img" aria-label="กราฟผู้เข้าชม">${bars.map((v, i) => `<rect x="${i * 30 + 4}" y="${110 - v}" width="22" height="${v}" rx="3" fill="#1b7047"/>`).join('')}</svg></div>` : ''}
        </section>
        <section data-v="1"><h2>แก้ไขหน้าเว็บ: หน้าแรก</h2><div class="tabs">${langs.map((l, i) => `<span class="${i === 0 ? 'on' : ''}">${l.label}</span>`).join('')}</div>
          <div class="card"><label>หัวข้อหลัก<input value="ผลไม้ไทยคุณภาพส่งออก ส่งตรงถึงมือคุณ"></label><label>คำอธิบาย<textarea rows="3">บริษัทตัวอย่าง คัดผลไม้จากสวนทั่วประเทศ บรรจุในโรงงานมาตรฐาน GMP</textarea></label><label>รูปภาพหน้าแรก<input value="hero-durian.jpg"></label><button class="btn">บันทึก</button></div></section>
        ${menu.slice(2).map((m, i) => `<section data-v="${i + 2}"><h2>${m[1]}</h2>${adminPanel(m[1])}</section>`).join('')}
      </main>
      <script>document.addEventListener('click',e=>{const a=e.target.closest('[data-to]');if(!a)return;document.querySelectorAll('[data-to]').forEach(x=>x.classList.toggle('on',x===a));document.querySelectorAll('[data-v]').forEach(s=>s.classList.toggle('show',s.dataset.v===a.dataset.to))});<\/script></body></html>`;

    function adminPanel(name) {
      if (name === 'สินค้า') return `<div class="card"><table><tr><th>สินค้า</th><th>หมวด</th><th>สถานะ</th></tr>${PRODUCTS.map((p) => `<tr><td>${p.th}</td><td>ผลไม้สด</td><td><span class="pill g">เผยแพร่</span></td></tr>`).join('')}</table><button class="btn">+ เพิ่มสินค้า</button></div>`;
      if (name === 'บทความ') return `<div class="card"><table><tr><th>บทความ</th><th>วันที่</th></tr><tr><td>วิธีเลือกทุเรียนหมอนทองให้อร่อย</td><td>12 พ.ย.</td></tr><tr><td>ฤดูกาลผลไม้ไทย 2026</td><td>5 พ.ย.</td></tr></table><button class="btn">+ เขียนบทความ</button></div>`;
      if (name === 'คำขอใบเสนอราคา') return `<div class="card"><table><tr><th>ลูกค้า</th><th>สินค้า</th><th>สถานะ</th></tr><tr><td>สมชาย ใจดี</td><td>ทุเรียน 2 ตัน</td><td><span class="pill">ใหม่</span></td></tr><tr><td>Green Import Ltd.</td><td>มังคุด</td><td><span class="pill g">เสนอราคาแล้ว</span></td></tr><tr><td>Tokyo Fruits</td><td>มะม่วง</td><td><span class="pill">ใหม่</span></td></tr></table></div>`;
      if (name === 'คำสั่งซื้อ') return `<div class="card"><table><tr><th>เลขที่</th><th>ยอด</th><th>สถานะ</th></tr><tr><td>#1024</td><td>1,350 บาท</td><td><span class="pill g">ชำระแล้ว</span></td></tr><tr><td>#1023</td><td>540 บาท</td><td><span class="pill">รอจัดส่ง</span></td></tr></table></div>`;
      if (name === 'สมาชิก') return `<div class="card"><table><tr><th>สมาชิก</th><th>สมัครเมื่อ</th></tr><tr><td>member@example.com</td><td>10 พ.ย.</td></tr><tr><td>shop@example.co.th</td><td>2 พ.ย.</td></tr></table></div>`;
      if (name === 'คลังรูปภาพ') return `<div class="card muted">อัปโหลด จัดการ และใส่คำอธิบายรูปภาพทั้งหมดของเว็บ</div>`;
      if (name === 'ตั้งค่าเว็บไซต์') return `<div class="card"><label>ชื่อบริษัท<input value="บริษัทตัวอย่าง จำกัด"></label><label>เบอร์โทร<input value="02-123-4567"></label><label>LINE<input value="@yourcompany"></label><button class="btn">บันทึก</button></div>`;
      return `<div class="card"><table><tr><th>ผู้ดูแล</th><th>สิทธิ์</th></tr><tr><td>admin@yourcompany.com</td><td>ผู้ดูแลหลัก</td></tr><tr><td>marketing@yourcompany.com</td><td>แก้ไขเนื้อหา</td></tr></table></div>`;
    }
  }

  /* ─────────────── Google (SEO) mock ─────────────── */
  function seoHTML(o) {
    const langs = LANGS.slice(0, 2 + Math.min(o.lang, LANGS.length - 2));
    const results = [
      ['th', 'www.yourcompany.com › th', 'บริษัทตัวอย่าง | ผลไม้ไทยคุณภาพส่งออก', 'คัดผลไม้จากสวนทั่วประเทศ บรรจุในโรงงานมาตรฐาน GMP ส่งทั้งในและต่างประเทศ ขอใบเสนอราคาได้ทันที'],
      ['en', 'www.yourcompany.com', 'Sample Co. | Export-grade Thai fruit supplier', 'Durian, mango, mangosteen and young coconut from Thai farms. GMP-certified packing, air & sea freight.'],
      ['zh', 'www.yourcompany.com › zh', '示例公司 | 泰国出口级水果供应商', '榴莲、芒果、山竹、椰子，GMP 认证包装，空运海运。'],
      ['ja', 'www.yourcompany.com › ja', 'サンプル社 | 輸出品質のタイ産フルーツ', 'ドリアン、マンゴー、マンゴスチン。GMP認証工場で梱包、航空便・海上便に対応。'],
    ].filter((r) => langs.some((l) => l.code === r[0]));
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <style>body{margin:0;font:14px/1.5 Arial,system-ui,sans-serif;background:#fff;color:#202124}.top{display:flex;gap:16px;align-items:center;padding:18px 24px;border-bottom:1px solid #ebebeb}
      .g{font:600 24px Arial}.g b:nth-child(1){color:#4285f4}.g b:nth-child(2){color:#ea4335}.g b:nth-child(3){color:#fbbc05}.g b:nth-child(4){color:#4285f4}.g b:nth-child(5){color:#34a853}.g b:nth-child(6){color:#ea4335}
      .q{flex:1;max-width:560px;border:1px solid #dfe1e5;border-radius:24px;padding:10px 18px}.res{max-width:640px;padding:20px 24px}.r{margin-bottom:26px}.u{font-size:12px;color:#4d5156}.t{font-size:19px;color:#1a0dab}.d{color:#4d5156}
      .lang{font-size:11px;background:#e8f0fe;color:#1a73e8;border-radius:4px;padding:1px 6px;margin-left:6px}.note{max-width:640px;margin:0 24px 24px;font-size:13px;color:#5f6368;background:#f8f9fa;border-radius:8px;padding:12px}</style></head><body>
      <div class="top"><div class="g"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></div><div class="q">ผลไม้ส่งออก ทุเรียน ผู้ส่งออก</div></div>
      <div class="res">${results.map((r) => `<div class="r"><div class="u">${r[1]}<span class="lang">${r[0].toUpperCase()}</span></div><div class="t">${r[2]}</div><div class="d">${r[3]}</div></div>`).join('')}</div>
      <div class="note">ตัวอย่างผลค้นหา: SEO ระดับสากลทำให้ Google แสดงหน้าตามภาษาของผู้ค้นหา (hreflang) มี sitemap ส่งให้ Google และข้อมูลบริษัทแบบมีโครงสร้าง</div></body></html>`;
  }

  /* ─────────────── Services without a screen ─────────────── */
  function servicesHTML(o, hostName) {
    const rows = [
      [hostName, '🌐', `โดเมน + โฮสติ้ง + SSL แพ็กเกจ ${hostName} พร้อมติดตั้งเว็บให้ · ต่ออายุรายปี`],
      [!hostName, '⚠️', 'ลูกค้าใช้โดเมนและโฮสติ้งของตัวเอง ต้องมีก่อนเปิดใช้งานเว็บ'],
      [o.migrate, '📦', 'ย้ายสินค้า บทความ และรูปภาพจากเว็บเดิมเข้าระบบใหม่'],
      [o.deploy, '🖥️', 'ติดตั้งเว็บบนเซิร์ฟเวอร์ของบริษัท (Linux / Windows) พร้อม HTTPS และคู่มือสำรองข้อมูล'],
      [o.training, '🎓', 'อบรมการใช้งานหลังบ้าน 1 ครั้ง พร้อมคู่มือภาษาไทย'],
      [o.care, '🛠️', 'ดูแลหลังส่งมอบ 3 เดือน: แก้ปัญหา ปรับแก้เล็กน้อย อัปเดตความปลอดภัย'],
      [o.monthly, '📅', `ดูแลรายเดือน ${o.monthly} เดือน ต่อจากช่วงรับประกัน`],
      [o.article, '✍️', `เขียนบทความ SEO ${o.article} บทความ`],
      [o.photo, '🖼️', `ตกแต่งรูปสินค้า ${o.photo} รูป (ดูตัวอย่างก่อน/หลังได้ที่หน้าสินค้า)`],
      [o.seo, '🔎', 'SEO ระดับสากล: sitemap · hreflang ทุกภาษา · redirect URL เดิม'],
      [o.ga, '📊', 'ตั้งค่า Google Analytics + Search Console ดูสถิติผู้เข้าชม'],
      [true, '📱', 'รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์'],
      [true, '📁', 'ส่งมอบ source code คู่มือ และสิทธิ์ผู้ดูแลระบบทั้งหมด'],
    ].filter((r) => r[0]);
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600&display=swap">
      <style>body{margin:0;padding:24px;font:14px/1.6 'IBM Plex Sans Thai',system-ui,sans-serif;background:#f6f7f4;color:#14201a}h2{margin:0 0 14px}
      .r{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid #dde2db;border-radius:10px;padding:12px 14px;margin-bottom:8px}.r b{font-size:20px}</style></head><body>
      <h2>บริการที่ได้รับ (นอกจากหน้าจอเว็บ)</h2>${rows.map((r) => `<div class="r"><b>${r[1]}</b><div>${r[2]}</div></div>`).join('')}</body></html>`;
  }

  /* ─────────────── Dialog ─────────────── */
  const css = `
    .wp-dlg{border:0;padding:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;background:var(--bg,#f6f7f4);color:var(--ink,#14201a)}
    .wp-dlg::backdrop{background:rgba(0,0,0,.5)}.wp-wrap{display:grid;grid-template-rows:auto 1fr;height:100%}
    .wp-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px max(14px,env(safe-area-inset-left,0px));background:var(--surface,#fff);border-bottom:1px solid var(--line,#dde2db)}
    .wp-bar h2{font-size:16px;margin:0 8px 0 0}.wp-seg{display:inline-flex;border:1px solid var(--line,#dde2db);border-radius:8px;overflow:hidden}
    .wp-seg button{border:0;background:transparent;padding:7px 12px;font-weight:600;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink-2,#44514a)}.wp-seg button[aria-pressed="true"]{background:var(--brand,#0f4c30);color:var(--on-brand,#fff)}
    .wp-sp{flex:1}.wp-close{border:1px solid var(--line,#dde2db);background:var(--surface,#fff);border-radius:8px;padding:7px 14px;font-weight:600;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink,#14201a)}
    .wp-stage{overflow:auto;display:flex;justify-content:center;align-items:flex-start;padding:16px;background:repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(0,0,0,.025) 12px,rgba(0,0,0,.025) 24px)}
    .wp-device{width:100%;max-width:1280px;height:100%;min-height:520px;display:flex;flex-direction:column;border:1px solid var(--line,#dde2db);border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transition:max-width .25s}
    .wp-device.mobile{max-width:390px;border-radius:28px;border-width:10px;border-color:#1c2420}
    .wp-url{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#eef1ec;border-bottom:1px solid #dde2db;font:12px 'IBM Plex Sans',system-ui,sans-serif;color:#44514a}
    .wp-url i{width:9px;height:9px;border-radius:50%;background:#c9cfc8;display:inline-block}.wp-url span{flex:1;background:#fff;border-radius:6px;padding:3px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wp-device.mobile .wp-url i{display:none}.wp-frame{flex:1;width:100%;border:0;background:#fff}
    .wp-chips{display:flex;gap:6px;flex-wrap:wrap;padding:8px max(14px,env(safe-area-inset-left,0px));background:var(--surface,#fff);border-bottom:1px solid var(--line,#dde2db);font-size:12px;color:var(--mute,#6f7a73)}
    .wp-chips span{background:var(--brand-soft,#e7f0ea);color:var(--brand,#0f4c30);border-radius:999px;padding:2px 9px;font-weight:600}
    @media (max-width:640px){.wp-stage{padding:0}.wp-device,.wp-device.mobile{max-width:none;border:0;border-radius:0;min-height:0}.wp-hide-sm{display:none}}`;

  let dlg, frame, url, state, view = 'site', device = 'desktop';
  const base = () => location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');

  function ensure() {
    if (dlg) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    dlg = document.createElement('dialog'); dlg.className = 'wp-dlg'; dlg.setAttribute('aria-label', 'ตัวอย่างเว็บไซต์');
    dlg.innerHTML = `<div class="wp-wrap"><div><div class="wp-bar">
        <h2>ตัวอย่างเว็บไซต์ของคุณ</h2>
        <div class="wp-seg" id="wp-views"></div>
        <div class="wp-seg wp-hide-sm" id="wp-device"><button type="button" data-dev="desktop" aria-pressed="true">💻 คอม</button><button type="button" data-dev="mobile" aria-pressed="false">📱 มือถือ</button></div>
        <span class="wp-sp"></span><button class="wp-close" type="button" id="wp-close">ปิดตัวอย่าง</button></div>
        <div class="wp-chips" id="wp-chips"></div></div>
      <div class="wp-stage"><div class="wp-device" id="wp-dev"><div class="wp-url"><i></i><i></i><i></i><span id="wp-url"></span></div><iframe class="wp-frame" id="wp-frame" title="ตัวอย่างเว็บไซต์"></iframe></div></div></div>`;
    document.body.appendChild(dlg);
    frame = dlg.querySelector('#wp-frame'); url = dlg.querySelector('#wp-url');
    dlg.addEventListener('click', (e) => {
      const v = e.target.closest('[data-view]'); if (v) { view = v.dataset.view; render(); }
      const d = e.target.closest('[data-dev]'); if (d) { device = d.dataset.dev; render(); }
    });
    dlg.querySelector('#wp-close').addEventListener('click', () => dlg.close());
  }

  function render() {
    const o = state.o;
    const views = [['site', 'หน้าเว็บ'], ...(o.cms ? [['admin', 'หลังบ้าน']] : []), ...(o.seo ? [['seo', 'Google']] : []), ['services', 'บริการ']];
    if (!views.some((v) => v[0] === view)) view = 'site';
    dlg.querySelector('#wp-views').innerHTML = views.map(([k, l]) => `<button type="button" data-view="${k}" aria-pressed="${k === view}">${l}</button>`).join('');
    dlg.querySelectorAll('[data-dev]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dev === device)));
    dlg.querySelector('#wp-dev').classList.toggle('mobile', device === 'mobile');
    const domain = state.hostName ? 'https://www.yourcompany.com' : 'https://(โดเมนของลูกค้า)';
    url.textContent = (state.hostName ? '🔒 ' : '') + domain + (view === 'admin' ? '/admin' : view === 'seo' ? ' — google.com' : '');
    frame.srcdoc = view === 'admin' ? adminHTML(o) : view === 'seo' ? seoHTML(o) : view === 'services' ? servicesHTML(o, state.hostName) : siteHTML(o, base());
    dlg.querySelector('#wp-chips').innerHTML = 'ที่เลือก: ' + state.labels.map((l) => `<span>${esc(l)}</span>`).join('');
  }

  window.WebPreview = {
    /** @param {{qty: Record<string, number>, hostName: string, labels: string[]}} s */
    open(s) {
      ensure();
      const o = { ...s.qty };
      ['page', 'lang', 'special', 'article', 'photo', 'monthly'].forEach((k) => (o[k] = o[k] || 0));
      o.hosted = !!s.hostName;
      state = { o, hostName: s.hostName, labels: s.labels };
      view = 'site';
      render();
      dlg.showModal();
    },
  };
})();
