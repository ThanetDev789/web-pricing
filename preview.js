/*
 * Website preview — builds a working sample website from the add-ons chosen
 * on the pricing page and shows it in a dialog (desktop / mobile, site / admin
 * / Google / services). Everything is generated client-side, in Thai or English.
 *
 *   WebPreview.open({ qty: { page: 4, cms: 1, ... }, hostName: 'Standard', labels: [...], lang: 'th' | 'en' })
 */
(() => {
  let LG = 'th';
  const X = (th, en) => (LG === 'en' ? en : th);

  /* ─────────────── Sample content ─────────────── */
  const LANGS = [
    { code: 'th', label: 'ไทย' }, { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' }, { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' }, { code: 'de', label: 'Deutsch' }, { code: 'fr', label: 'Français' },
    { code: 'vi', label: 'Tiếng Việt' }, { code: 'id', label: 'Bahasa' }, { code: 'ar', label: 'العربية' }, { code: 'ru', label: 'Русский' },
  ];
  // Sample-site UI text. Languages missing here fall back to English.
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
    { id: 'durian', th: 'ทุเรียนหมอนทอง', en: 'Monthong Durian', img: 'img/p-durian.webp', price: 450, months: [4, 5, 6, 7, 8] },
    { id: 'mango', th: 'มะม่วงน้ำดอกไม้', en: 'Nam Dok Mai Mango', img: 'img/p-mango.webp', price: 120, months: [3, 4, 5, 6] },
    { id: 'mangosteen', th: 'มังคุด', en: 'Mangosteen', img: 'img/p-mangosteen.webp', price: 150, months: [5, 6, 7, 8] },
    { id: 'coconut', th: 'มะพร้าวน้ำหอม', en: 'Young Coconut', img: 'img/p-coconut.webp', price: 45, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'pineapple', th: 'สับปะรด', en: 'Pineapple', img: 'img/p-pineapple.webp', price: 60, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'pomelo', th: 'ส้มโอ', en: 'Pomelo', img: 'img/p-pomelo.webp', price: 90, months: [8, 9, 10, 11] },
  ];
  const MONTHS = { th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  const SPECIALS = () => [X('ปฏิทินฤดูกาลสินค้า', 'Seasonal calendar'), X('ตารางราคาประจำสัปดาห์', 'Weekly price table'), X('แผนที่จุดรับสินค้า', 'Pick-up point map'), X('คำนวณค่าขนส่ง', 'Shipping cost calculator'), X('ติดตามสถานะคำสั่งซื้อ', 'Order tracking')];
  const ARTICLES = () => [X('วิธีเลือกทุเรียนหมอนทองให้อร่อย', 'How to pick a great Monthong durian'), X('ฤดูกาลผลไม้ไทย 2026', 'Thai fruit seasons 2026'), X('มาตรฐาน GMP คืออะไร', 'What GMP certification means'), X('ส่งออกผลไม้ไปจีนต้องรู้อะไรบ้าง', 'Exporting fruit to China: what to know'), X('มะพร้าวน้ำหอมดีอย่างไร', 'Why Nam Hom coconut stands out'), X('เทคนิคยืดอายุผลไม้สด', 'Keeping fresh fruit fresh for longer')];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = (n) => Number(n).toLocaleString(LG === 'en' ? 'en-US' : 'th-TH');
  const pname = (p) => (LG === 'en' ? p.en : p.th);
  const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Noto+Serif+Thai:wght@500&display=swap">';

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
    const L = T[LG];
    const cfg = { onePage, line: !!o.line, lg: LG, msgs: {
      added: X('ใส่ตะกร้าแล้ว', 'Added to cart'), pay: X('ตัวอย่าง: ไปหน้าชำระเงิน (QR พร้อมเพย์ / บัตรเครดิต)', 'Sample: go to payment (PromptPay QR / credit card)'),
      login: X('เข้าสู่ระบบแล้ว (ตัวอย่าง)', 'Signed in (sample)'), hello: X('สวัสดี คุณลูกค้า', 'Hello, customer'),
      quote: X('ส่งคำขอใบเสนอราคาแล้ว ข้อมูลเข้าหลังบ้าน', 'Quote request sent. It is now in the CMS.'), contact: X('ส่งข้อความเข้าอีเมลบริษัทแล้ว', 'Message sent to the company email'),
      line: X('LINE แจ้งเตือน: มีลูกค้า{k}ใหม่ — สมชาย ใจดี', 'LINE alert: new {k} from Somchai Jaidee'), kq: X('ขอใบเสนอราคา', 'quote request'), kc: X('ติดต่อ', 'message'),
      empty: X('ยังไม่มีสินค้า', 'Your cart is empty'), kg: X('กก.', 'kg'), season: X('ฤดูกาล', 'Season'), year: X('ตลอดปี', 'All year'), month: X('เดือน ', 'months '),
      ship: X('การขนส่ง', 'Shipping'), shipV: X('ทางอากาศ / ทางเรือ', 'Air / sea freight'), pack: X('บรรจุภัณฑ์', 'Packaging'), packV: X('กล่องส่งออก 10 กก.', '10 kg export carton'),
      other: X('ภาษานี้แปลเนื้อหาในโครงการจริง (ตัวอย่างแสดงภาษาอังกฤษ)', 'This language is translated in the real project (the sample shows English)'),
    } };

    const t = (k) => `<span data-t="${k}">${esc(L[k] || k)}</span>`;
    const product = (p) => `
      <article class="card prod">
        <div class="pimg${o.photo ? ' edited' : ''}"><img src="${base}${p.img}" alt="${esc(pname(p))}"></div>
        <div class="pbody">
          <h4 data-en="${esc(p.en)}" data-th="${esc(p.th)}">${esc(pname(p))}</h4>
          ${o.catalog ? `<p class="muted">${cfg.msgs.season}: ${p.months.length === 12 ? cfg.msgs.year : p.months.map((m) => MONTHS[LG][m - 1]).join(', ')}</p>` : ''}
          ${o.shop ? `<div class="row"><b>${fmt(p.price)} ${X('บาท/กก.', 'THB/kg')}</b><button class="btn sm" data-add="${p.id}">${t('add')}</button></div>`
            : o.catalog ? `<button class="link" data-detail="${p.id}">${X('รายละเอียดสินค้า →', 'Product details →')}</button>` : ''}
        </div>
      </article>`;

    const productsBlock = o.catalog
      ? `<div class="chips"><span class="chip on">${X('ทั้งหมด', 'All')}</span><span class="chip">${X('ผลไม้สด', 'Fresh fruit')}</span><span class="chip">${X('ผลไม้ตัดแต่ง', 'Fresh-cut')}</span><span class="chip">${X('แปรรูป', 'Processed')}</span></div>
         <div class="grid3">${PRODUCTS.map(product).join('')}</div>
         <div class="detail card" id="detail" hidden></div>`
      : `<div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div>
         <p class="muted note">${X('หน้าสินค้าแบบข้อความและรูป (แก้ไขผ่านผู้พัฒนา) · เพิ่ม “แคตตาล็อกสินค้า” เพื่อมีหมวดหมู่และหน้ารายละเอียด', 'A simple products page with text and images (edited by the developer) · add “Product catalogue” for categories and detail pages')}</p>`;

    const calendar = `
      <div class="card cal">
        <h3>${t('season')}</h3>
        <div class="calgrid"><span></span>${MONTHS[LG].map((m) => `<span class="mh">${m}</span>`).join('')}
        ${PRODUCTS.map((p) => `<span class="pn">${esc(pname(p))}</span>${Array.from({ length: 12 }, (_, i) => `<span class="${p.months.includes(i + 1) ? 'on' : ''}"></span>`).join('')}`).join('')}</div>
      </div>`;
    const priceTable = `
      <div class="card"><h3>${SPECIALS()[1]}</h3>
        <table class="tbl"><tr><th>${X('สินค้า', 'Product')}</th><th>${X('เกรด A', 'Grade A')}</th><th>${X('เกรด B', 'Grade B')}</th></tr>
        ${PRODUCTS.slice(0, 4).map((p) => `<tr><td>${esc(pname(p))}</td><td>${fmt(p.price)}</td><td>${fmt(Math.round(p.price * 0.8))}</td></tr>`).join('')}</table></div>`;
    const specials = Array.from({ length: o.special }, (_, i) =>
      i === 0 ? calendar : i === 1 ? priceTable : `<div class="card"><h3>${SPECIALS()[i]}</h3><p class="muted">${X(`ฟีเจอร์เฉพาะธุรกิจรายการที่ ${i + 1} ออกแบบตามความต้องการ`, `Business feature #${i + 1}, designed for your needs`)}</p></div>`).join('');

    const form = (quote) => `
      <form class="card form" data-form="${quote ? 'quote' : 'contact'}">
        <h3>${quote ? t('quote') : t('contact')}</h3>
        <label>${t('name')}<input required value="${X('สมชาย ใจดี', 'Somchai Jaidee')}"></label>
        <label>${t('email')}<input type="email" required value="somchai@example.com"></label>
        ${quote ? `<label>${t('product')}<select>${PRODUCTS.map((p) => `<option>${esc(pname(p))}</option>`).join('')}</select></label><label>${X('ปริมาณ', 'Volume')}<input value="${X('2 ตัน / เดือน', '2 tonnes / month')}"></label>` : ''}
        <label>${t('msg')}<textarea rows="3">${X('สนใจสินค้า ขอรายละเอียดเพิ่มเติมครับ', 'We are interested. Please send more details.')}</textarea></label>
        <button class="btn" type="submit">${quote ? t('quote') : t('send')}</button>
      </form>`;

    const contactBlock = `
      <div class="split">
        <div class="card"><h3>${t('contact')}</h3>
          <p>📍 ${X('123 ถนนตัวอย่าง กรุงเทพฯ 10110', '123 Sample Road, Bangkok 10110')}<br>📞 02-123-4567<br>✉️ sales@yourcompany.com<br>💬 LINE: @yourcompany</p>
          <div class="map">${X('แผนที่ Google Maps', 'Google Maps')}</div></div>
        ${o.quote ? form(true) : o.form ? form(false) : `<div class="card muted">${X('ฟอร์มติดต่อ: เพิ่ม add-on “ฟอร์มติดต่อ” หรือ “ฟอร์มขอใบเสนอราคา”', 'Contact form: add “Contact form” or “Quote request form”')}</div>`}
      </div>`;

    const titles = ARTICLES();
    const articles = Array.from({ length: Math.max(3, Math.min(6, o.article || 3)) }, (_, i) => ({ title: titles[i], img: PRODUCTS[i % PRODUCTS.length].img }));
    const newsBlock = `<div class="grid3">${articles.map((a, i) => `
      <article class="card prod"><div class="pimg"><img src="${base}${a.img}" alt=""></div>
      <div class="pbody"><span class="muted">${X(`${12 - i} พ.ย. 2569`, `${12 - i} Nov 2026`)}</span><h4>${a.title}</h4><button class="link">${t('read')} →</button></div></article>`).join('')}</div>
      ${o.article > 6 ? `<p class="muted note">${X(`และบทความอื่นอีก ${o.article - 6} บทความ`, `and ${o.article - 6} more articles`)}</p>` : ''}`;

    const genericPage = (k) => `<div class="split"><div class="card"><h3>${t(k)}</h3><p class="muted">${X('เนื้อหาหน้านี้ เช่น ข้อความ รูปภาพ และรายละเอียด', 'This page holds text, images and details')}${o.cms ? X(' แก้ไขเองได้จากหลังบ้าน', ', editable from the CMS') : ''}</p><p>${X('บริษัทตัวอย่างดำเนินธุรกิจมากว่า 10 ปี มีลูกค้าใน 9 ประเทศ ได้รับมาตรฐาน GMP และ HACCP', 'Sample Co. has traded for over 10 years, serves customers in 9 countries and is GMP and HACCP certified.')}</p></div><div class="ph-img"><img src="${base}img/p-farm.webp" alt=""></div></div>`;

    const sections = {
      home: `
        <section class="hero"><div class="hero-in">
          <span class="eyebrow">${X('บริษัทตัวอย่าง จำกัด', 'Sample Co., Ltd.')}</span>
          <h1>${t('heroTitle')}</h1><p>${t('heroLead')}</p>
          <div class="row"><a class="btn" href="#" data-go="${onePage ? 'products' : nav.includes('products') ? 'products' : nav.includes('about') ? 'about' : 'home'}">${t('cta')}</a>
          ${showForm ? `<a class="btn ghost" href="#" data-go="contact">${o.quote ? t('quote') : t('contact')}</a>` : ''}</div>
        </div></section>
        <section class="wrap stats"><div><b>10+</b><span>${X('ปีประสบการณ์', 'years of experience')}</span></div><div><b>9</b><span>${X('ประเทศ', 'countries')}</span></div><div><b>GMP</b><span>${X('มาตรฐานโรงงาน', 'certified facility')}</span></div><div><b>${langs.length}</b><span>${X('ภาษา', 'languages')}</span></div></section>
        ${specials ? `<section class="wrap">${specials}</section>` : ''}
        ${onePage ? `
          <section class="wrap" id="sec-about">${genericPage('about')}</section>
          <section class="wrap" id="sec-products"><h2>${t('products')}</h2>${o.catalog ? productsBlock : `<div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div>`}</section>
          <section class="wrap" id="sec-contact">${contactBlock}</section>`
        : `<section class="wrap"><h2>${t('products')}</h2><div class="grid3">${PRODUCTS.slice(0, 3).map(product).join('')}</div></section>`}`,
      about: `<section class="wrap">${genericPage('about')}</section>`,
      products: `<section class="wrap"><h2>${t('products')}</h2>${o.photo ? `<div class="ba"><span>${X('ตกแต่งรูปสินค้า:', 'Photo retouching:')}</span><button class="chip on" data-photo="after">${X('หลังตกแต่ง', 'After')}</button><button class="chip" data-photo="before">${X('ก่อนตกแต่ง', 'Before')}</button></div>` : ''}${productsBlock}</section>`,
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
      ${brand ? '' : '.hero .btn:not(.ghost){background:#fff;color:var(--c)}'}
      .hero-in{max-width:1080px;margin:0 auto;padding:48px 24px;width:100%}.hero h1{font-size:${brand ? '40px' : '30px'};max-width:16em;color:#fff}.hero p{max-width:40em;opacity:.9}
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
      .cal{margin-bottom:14px}.calgrid{display:grid;grid-template-columns:120px repeat(12,1fr);gap:3px;font-size:11px;align-items:center}.calgrid .mh{text-align:center;color:var(--mute)}.calgrid .pn{font-size:12px}
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
        .dock{top:auto;bottom:0;left:0;right:0;transform:none;flex-direction:row;border-radius:0;justify-content:space-around}.dock a+a{border-top:0}body{padding-bottom:${o.dock ? '56px' : '0'}}.calgrid{grid-template-columns:84px repeat(12,1fr)}}`;

    const body = `
      <header>
        <a class="logo" href="#" data-go="home"><i></i>${X('บริษัทตัวอย่าง', 'Sample Co.')}</a>
        <nav>${nav.map((k) => `<a href="#" data-go="${k}" class="${k === 'home' ? 'on' : ''}">${t(k)}</a>`).join('')}${extraPages ? `<a href="#" data-go="about">+${extraPages} ${X('หน้า', 'pages')}</a>` : ''}</nav>
        <div class="tools">
          <select class="lang" aria-label="${X('ภาษา', 'Language')}">${langs.map((l) => `<option value="${l.code}"${l.code === LG ? ' selected' : ''}>${l.label}</option>`).join('')}</select>
          ${o.member ? `<button class="btn sm line" data-open="login">${t('login')}</button>` : ''}
          ${o.shop ? `<button class="btn sm cartbtn" data-open="cart">🛒 ${t('cart')} <em id="cc">0</em></button>` : ''}
        </div>
      </header>
      <main>${nav.map((k) => `<div data-page="${k}" class="${k === 'home' ? 'show' : ''}">${sections[k] || ''}</div>`).join('')}</main>
      <footer><div class="in"><div><b>${X('บริษัทตัวอย่าง จำกัด', 'Sample Co., Ltd.')}</b><br>${X('123 ถนนตัวอย่าง กรุงเทพฯ', '123 Sample Road, Bangkok')} · 02-123-4567</div><div>${nav.map((k) => L[k]).join(' · ')}</div><div>© 2026 ${o.hosted ? '· www.yourcompany.com 🔒' : ''}</div></div></footer>
      ${o.dock ? `<div class="dock"><a href="#" data-go="contact"><b>💬</b>${t('quote')}</a><a href="#"><b style="color:#06c755">LINE</b>LINE</a><a href="#"><b>🟢</b>WhatsApp</a><a href="#"><b>📞</b>${X('โทร', 'Call')}</a></div>` : ''}
      <div class="modal" id="m-login" hidden><form class="card form" data-form="login"><h3>${t('login')}</h3><label>${t('email')}<input value="member@example.com"></label><label>${X('รหัสผ่าน', 'Password')}<input type="password" value="12345678"></label><button class="btn">${t('login')}</button> <button class="link" type="button" data-close>${X('ยกเลิก', 'Cancel')}</button></form></div>
      <div class="modal" id="m-cart" hidden><div class="card"><h3>${t('cart')}</h3><div id="cart-lines" class="muted">${cfg.msgs.empty}</div><hr><p><b id="cart-total">0</b> ${X('บาท', 'THB')}</p><p class="muted">${X('ชำระเงิน: QR พร้อมเพย์ · บัตรเครดิต · โอนผ่านธนาคาร', 'Payment: PromptPay QR · credit card · bank transfer')}</p><button class="btn" data-pay>${X('ชำระเงิน', 'Pay now')}</button> <button class="link" type="button" data-close>${X('ปิด', 'Close')}</button></div></div>`;

    const script = `
      const CFG=${JSON.stringify(cfg)};const M=CFG.msgs;const T=${JSON.stringify(T)};const PRODUCTS=${JSON.stringify(PRODUCTS)};
      const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
      const pn=p=>CFG.lg==='en'?p.en:p.th;
      function go(k){if(CFG.onePage&&k!=='home'){const el=document.getElementById('sec-'+k);if(el){el.scrollIntoView({behavior:'smooth'});return}}
        $$('[data-page]').forEach(p=>p.classList.toggle('show',p.dataset.page===k));$$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.go===k));if(!$('[data-page].show'))$('[data-page="home"]').classList.add('show');window.scrollTo(0,0)}
      function toast(msg,plain){const d=document.createElement('div');d.className='toast'+(plain?' plain':'');d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}
      const cart={};function renderCart(){const ids=Object.keys(cart);$('#cc')&&($('#cc').textContent=ids.reduce((s,k)=>s+cart[k],0));
        if(!$('#cart-lines'))return;$('#cart-lines').innerHTML=ids.length?ids.map(k=>{const p=PRODUCTS.find(x=>x.id===k);return pn(p)+' × '+cart[k]+' '+M.kg+' = '+(p.price*cart[k]).toLocaleString()}).join('<br>'):M.empty;
        $('#cart-total').textContent=ids.reduce((s,k)=>s+PRODUCTS.find(x=>x.id===k).price*cart[k],0).toLocaleString()}
      document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go);return}
        const a=e.target.closest('[data-add]');if(a){cart[a.dataset.add]=(cart[a.dataset.add]||0)+1;renderCart();toast(M.added,true);return}
        const o=e.target.closest('[data-open]');if(o){$('#m-'+o.dataset.open).hidden=false;return}
        if(e.target.closest('[data-close]')){$$('.modal').forEach(m=>m.hidden=true);return}
        if(e.target.closest('[data-pay]')){$$('.modal').forEach(m=>m.hidden=true);toast(M.pay,true);return}
        const ph=e.target.closest('[data-photo]');if(ph){document.body.classList.toggle('before',ph.dataset.photo==='before');$$('[data-photo]').forEach(b=>b.classList.toggle('on',b===ph));return}
        const dt=e.target.closest('[data-detail]');if(dt){const p=PRODUCTS.find(x=>x.id===dt.dataset.detail);if(!CFG.onePage&&$('[data-page="products"]'))go('products');const d=$('#detail');if(!d)return;d.hidden=false;
          d.innerHTML='<img src="'+dt.closest('.prod').querySelector('img').src+'" alt=""><div><h3>'+pn(p)+'</h3><p class="muted">'+(CFG.lg==='en'?p.th:p.en)+'</p><table class="tbl"><tr><td>'+M.season+'</td><td>'+(p.months.length===12?M.year:M.month+p.months.join(', '))+'</td></tr><tr><td>'+M.ship+'</td><td>'+M.shipV+'</td></tr><tr><td>'+M.pack+'</td><td>'+M.packV+'</td></tr></table></div>';d.scrollIntoView({behavior:'smooth'})}});
      document.addEventListener('submit',e=>{e.preventDefault();const k=e.target.dataset.form;
        if(k==='login'){$$('.modal').forEach(m=>m.hidden=true);const b=$('[data-open="login"]');if(b)b.textContent=M.hello;toast(M.login,true);return}
        toast(k==='quote'?M.quote:M.contact,true);
        if(CFG.line)setTimeout(()=>toast(M.line.replace('{k}',k==='quote'?M.kq:M.kc)),900)});
      $('select.lang').addEventListener('change',e=>{const L=T[e.target.value]||T.en;$$('[data-t]').forEach(n=>n.textContent=L[n.dataset.t]||T.en[n.dataset.t]||n.textContent);
        $$('[data-en]').forEach(n=>n.textContent=e.target.value==='th'?n.dataset.th:n.dataset.en);document.documentElement.dir=e.target.value==='ar'?'rtl':'ltr';
        if(!T[e.target.value])toast(M.other,true)});`;

    return `<!doctype html><html lang="${LG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fonts}<style>${css}</style></head><body>${body}<script>${script}<\/script></body></html>`;
  }

  /* ─────────────── Admin (CMS) mock ─────────────── */
  function adminHTML(o) {
    const menu = [
      ['📊', X('ภาพรวม', 'Dashboard'), true, 'dash'], ['📄', X('หน้าเว็บ', 'Pages'), true, 'pages'], ['🍍', X('สินค้า', 'Products'), o.catalog, 'products'],
      ['📰', X('บทความ', 'Articles'), o.news, 'news'], ['📨', X('คำขอใบเสนอราคา', 'Quote requests'), o.quote, 'quotes'], ['🛒', X('คำสั่งซื้อ', 'Orders'), o.shop, 'orders'],
      ['👤', X('สมาชิก', 'Members'), o.member, 'members'], ['🖼️', X('คลังรูปภาพ', 'Media'), true, 'media'], ['⚙️', X('ตั้งค่าเว็บไซต์', 'Site settings'), true, 'settings'], ['👥', X('ผู้ดูแลระบบ', 'Users'), true, 'users'],
    ].filter((m) => m[2]);
    const langs = LANGS.slice(0, 2 + Math.min(o.lang, LANGS.length - 2));
    const bars = [32, 41, 38, 55, 61, 48, 72, 66, 80, 77, 91, 88, 97, 104];
    const pill = (txt, g) => `<span class="pill${g ? ' g' : ''}">${txt}</span>`;
    const panels = {
      products: `<div class="card"><table><tr><th>${X('สินค้า', 'Product')}</th><th>${X('หมวด', 'Category')}</th><th>${X('สถานะ', 'Status')}</th></tr>${PRODUCTS.map((p) => `<tr><td>${pname(p)}</td><td>${X('ผลไม้สด', 'Fresh fruit')}</td><td>${pill(X('เผยแพร่', 'Published'), 1)}</td></tr>`).join('')}</table><button class="btn">${X('+ เพิ่มสินค้า', '+ Add product')}</button></div>`,
      news: `<div class="card"><table><tr><th>${X('บทความ', 'Article')}</th><th>${X('วันที่', 'Date')}</th></tr><tr><td>${ARTICLES()[0]}</td><td>${X('12 พ.ย.', '12 Nov')}</td></tr><tr><td>${ARTICLES()[1]}</td><td>${X('5 พ.ย.', '5 Nov')}</td></tr></table><button class="btn">${X('+ เขียนบทความ', '+ Write article')}</button></div>`,
      quotes: `<div class="card"><table><tr><th>${X('ลูกค้า', 'Customer')}</th><th>${X('สินค้า', 'Product')}</th><th>${X('สถานะ', 'Status')}</th></tr><tr><td>${X('สมชาย ใจดี', 'Somchai Jaidee')}</td><td>${X('ทุเรียน 2 ตัน', 'Durian, 2 tonnes')}</td><td>${pill(X('ใหม่', 'New'))}</td></tr><tr><td>Green Import Ltd.</td><td>${X('มังคุด', 'Mangosteen')}</td><td>${pill(X('เสนอราคาแล้ว', 'Quoted'), 1)}</td></tr><tr><td>Tokyo Fruits</td><td>${X('มะม่วง', 'Mango')}</td><td>${pill(X('ใหม่', 'New'))}</td></tr></table></div>`,
      orders: `<div class="card"><table><tr><th>${X('เลขที่', 'Order')}</th><th>${X('ยอด', 'Total')}</th><th>${X('สถานะ', 'Status')}</th></tr><tr><td>#1024</td><td>${X('1,350 บาท', '1,350 THB')}</td><td>${pill(X('ชำระแล้ว', 'Paid'), 1)}</td></tr><tr><td>#1023</td><td>${X('540 บาท', '540 THB')}</td><td>${pill(X('รอจัดส่ง', 'To ship'))}</td></tr></table></div>`,
      members: `<div class="card"><table><tr><th>${X('สมาชิก', 'Member')}</th><th>${X('สมัครเมื่อ', 'Joined')}</th></tr><tr><td>member@example.com</td><td>${X('10 พ.ย.', '10 Nov')}</td></tr><tr><td>shop@example.co.th</td><td>${X('2 พ.ย.', '2 Nov')}</td></tr></table></div>`,
      media: `<div class="card muted">${X('อัปโหลด จัดการ และใส่คำอธิบายรูปภาพทั้งหมดของเว็บ', 'Upload, organise and describe every image on the site')}</div>`,
      settings: `<div class="card"><label>${X('ชื่อบริษัท', 'Company name')}<input value="${X('บริษัทตัวอย่าง จำกัด', 'Sample Co., Ltd.')}"></label><label>${X('เบอร์โทร', 'Phone')}<input value="02-123-4567"></label><label>LINE<input value="@yourcompany"></label><button class="btn">${X('บันทึก', 'Save')}</button></div>`,
      users: `<div class="card"><table><tr><th>${X('ผู้ดูแล', 'User')}</th><th>${X('สิทธิ์', 'Role')}</th></tr><tr><td>admin@yourcompany.com</td><td>${X('ผู้ดูแลหลัก', 'Administrator')}</td></tr><tr><td>marketing@yourcompany.com</td><td>${X('แก้ไขเนื้อหา', 'Editor')}</td></tr></table></div>`,
    };
    return `<!doctype html><html lang="${LG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fonts}
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
      <aside><b>${X('หลังบ้าน · บริษัทตัวอย่าง', 'CMS · Sample Co.')}</b>${menu.map((m, i) => `<a data-to="${i}" class="${i === 0 ? 'on' : ''}">${m[0]} ${m[1]}</a>`).join('')}</aside>
      <main>
        <section data-v="0" class="show"><h2>${X('ภาพรวม', 'Dashboard')}</h2><p class="muted">${X('ยินดีต้อนรับ ผู้ดูแลระบบ', 'Welcome back, administrator')}</p>
          <div class="grid">
            <div class="card kpi"><span class="muted">${X('หน้าเว็บ', 'Pages')}</span><b>${1 + o.page}</b></div>
            ${o.catalog ? `<div class="card kpi"><span class="muted">${X('สินค้า', 'Products')}</span><b>${PRODUCTS.length}</b></div>` : ''}
            ${o.quote ? `<div class="card kpi"><span class="muted">${X('คำขอใบเสนอราคาใหม่', 'New quote requests')}</span><b>3</b></div>` : ''}
            <div class="card kpi"><span class="muted">${X('ภาษา', 'Languages')}</span><b>${langs.length}</b></div>
          </div>
          ${o.ga ? `<div class="card"><b>${X('ผู้เข้าชมเว็บ 14 วันล่าสุด', 'Visitors, last 14 days')}</b> <span class="muted">(Google Analytics)</span>
            <svg viewBox="0 0 420 120" width="100%" height="120" role="img" aria-label="${X('กราฟผู้เข้าชม', 'Visitor chart')}">${bars.map((v, i) => `<rect x="${i * 30 + 4}" y="${110 - v}" width="22" height="${v}" rx="3" fill="#1b7047"/>`).join('')}</svg></div>` : ''}
        </section>
        <section data-v="1"><h2>${X('แก้ไขหน้าเว็บ: หน้าแรก', 'Edit page: Home')}</h2><div class="tabs">${langs.map((l) => `<span class="${l.code === LG ? 'on' : ''}">${l.label}</span>`).join('')}</div>
          <div class="card"><label>${X('หัวข้อหลัก', 'Headline')}<input value="${T[LG].heroTitle}"></label><label>${X('คำอธิบาย', 'Description')}<textarea rows="3">${T[LG].heroLead}</textarea></label><label>${X('รูปภาพหน้าแรก', 'Hero image')}<input value="hero-durian.jpg"></label><button class="btn">${X('บันทึก', 'Save')}</button></div></section>
        ${menu.slice(2).map((m, i) => `<section data-v="${i + 2}"><h2>${m[1]}</h2>${panels[m[3]] || ''}</section>`).join('')}
      </main>
      <script>document.addEventListener('click',e=>{const a=e.target.closest('[data-to]');if(!a)return;document.querySelectorAll('[data-to]').forEach(x=>x.classList.toggle('on',x===a));document.querySelectorAll('[data-v]').forEach(s=>s.classList.toggle('show',s.dataset.v===a.dataset.to))});<\/script></body></html>`;
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
    return `<!doctype html><html lang="${LG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <style>body{margin:0;font:14px/1.5 Arial,system-ui,sans-serif;background:#fff;color:#202124}.top{display:flex;gap:16px;align-items:center;padding:18px 24px;border-bottom:1px solid #ebebeb}
      .g{font:600 24px Arial}.g b:nth-child(1){color:#4285f4}.g b:nth-child(2){color:#ea4335}.g b:nth-child(3){color:#fbbc05}.g b:nth-child(4){color:#4285f4}.g b:nth-child(5){color:#34a853}.g b:nth-child(6){color:#ea4335}
      .q{flex:1;max-width:560px;border:1px solid #dfe1e5;border-radius:24px;padding:10px 18px}.res{max-width:640px;padding:20px 24px}.r{margin-bottom:26px}.u{font-size:12px;color:#4d5156}.t{font-size:19px;color:#1a0dab}.d{color:#4d5156}
      .lang{font-size:11px;background:#e8f0fe;color:#1a73e8;border-radius:4px;padding:1px 6px;margin-left:6px}.note{max-width:640px;margin:0 24px 24px;font-size:13px;color:#5f6368;background:#f8f9fa;border-radius:8px;padding:12px}</style></head><body>
      <div class="top"><div class="g"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></div><div class="q">${X('ผลไม้ส่งออก ทุเรียน ผู้ส่งออก', 'thai durian exporter')}</div></div>
      <div class="res">${results.map((r) => `<div class="r"><div class="u">${r[1]}<span class="lang">${r[0].toUpperCase()}</span></div><div class="t">${r[2]}</div><div class="d">${r[3]}</div></div>`).join('')}</div>
      <div class="note">${X('ตัวอย่างผลค้นหา: SEO ระดับสากลทำให้ Google แสดงหน้าตามภาษาของผู้ค้นหา (hreflang) มี sitemap ส่งให้ Google และข้อมูลบริษัทแบบมีโครงสร้าง', 'Sample results: international SEO lets Google show the page in each searcher’s language (hreflang), with a sitemap submitted to Google and structured company data.')}</div></body></html>`;
  }

  /* ─────────────── Services without a screen ─────────────── */
  function servicesHTML(o, hostName) {
    const rows = [
      [hostName, '🌐', X(`โดเมน + โฮสติ้ง + SSL แพ็กเกจ ${hostName} พร้อมติดตั้งเว็บให้ · ชำระพร้อมงวดแรก · ต่ออายุรายปี`, `Domain + hosting + SSL, ${hostName} package, website installed for you · paid with the first payment · renews yearly`)],
      [!hostName, '⚠️', X('ลูกค้าใช้โดเมนและโฮสติ้งของตัวเอง ต้องมีก่อนเปิดใช้งานเว็บ', 'You use your own domain and hosting, which must be ready before going live')],
      [o.migrate, '📦', X('ย้ายสินค้า บทความ และรูปภาพจากเว็บเดิมเข้าระบบใหม่', 'Products, articles and images moved from your old website')],
      [o.deploy, '🖥️', X('ติดตั้งเว็บบนเซิร์ฟเวอร์ของบริษัท (Linux / Windows) พร้อม HTTPS และคู่มือสำรองข้อมูล', 'Installed on your company server (Linux / Windows) with HTTPS and a backup guide')],
      [o.training, '🎓', X('อบรมการใช้งานหลังบ้าน 1 ครั้ง พร้อมคู่มือภาษาไทย', 'One CMS training session with a user guide')],
      [o.care, '🛠️', X('ดูแลหลังส่งมอบ 3 เดือน: แก้ปัญหา ปรับแก้เล็กน้อย อัปเดตความปลอดภัย', '3 months of aftercare: support, small changes, security updates')],
      [o.monthly, '📅', X(`ดูแลรายเดือน ${o.monthly} เดือน ต่อจากช่วงรับประกัน`, `Monthly care for ${o.monthly} month(s) after the warranty`)],
      [o.article, '✍️', X(`เขียนบทความ SEO ${o.article} บทความ`, `${o.article} SEO article(s) written for you`)],
      [o.photo, '🖼️', X(`ตกแต่งรูปสินค้า ${o.photo} รูป (ดูตัวอย่างก่อน/หลังได้ที่หน้าสินค้า)`, `${o.photo} product photos retouched (see before/after on the products page)`)],
      [o.seo, '🔎', X('SEO ระดับสากล: sitemap · hreflang ทุกภาษา · redirect URL เดิม', 'International SEO: sitemap · hreflang for every language · redirects from old URLs')],
      [o.ga, '📊', X('ตั้งค่า Google Analytics + Search Console ดูสถิติผู้เข้าชม', 'Google Analytics + Search Console set up to track visitors')],
      [true, '📱', X('รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์', 'Works on phones, tablets and computers')],
      [true, '📁', X('ส่งมอบ source code คู่มือ และสิทธิ์ผู้ดูแลระบบทั้งหมด', 'Full handover: source code, guides and admin access')],
    ].filter((r) => r[0]);
    return `<!doctype html><html lang="${LG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fonts}
      <style>body{margin:0;padding:24px;font:14px/1.6 'IBM Plex Sans Thai',system-ui,sans-serif;background:#f6f7f4;color:#14201a}h2{margin:0 0 14px}
      .r{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid #dde2db;border-radius:10px;padding:12px 14px;margin-bottom:8px}.r b{font-size:20px}</style></head><body>
      <h2>${X('บริการที่ได้รับ (นอกจากหน้าจอเว็บ)', 'Services included (beyond the screens)')}</h2>${rows.map((r) => `<div class="r"><b>${r[1]}</b><div>${r[2]}</div></div>`).join('')}</body></html>`;
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
    dlg = document.createElement('dialog'); dlg.className = 'wp-dlg';
    dlg.innerHTML = `<div class="wp-wrap"><div><div class="wp-bar">
        <h2 id="wp-title"></h2>
        <div class="wp-seg" id="wp-views"></div>
        <div class="wp-seg wp-hide-sm" id="wp-device"><button type="button" data-dev="desktop" aria-pressed="true"></button><button type="button" data-dev="mobile" aria-pressed="false"></button></div>
        <span class="wp-sp"></span><button class="wp-close" type="button" id="wp-close"></button></div>
        <div class="wp-chips" id="wp-chips"></div></div>
      <div class="wp-stage"><div class="wp-device" id="wp-dev"><div class="wp-url"><i></i><i></i><i></i><span id="wp-url"></span></div><iframe class="wp-frame" id="wp-frame"></iframe></div></div></div>`;
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
    dlg.setAttribute('aria-label', X('ตัวอย่างเว็บไซต์', 'Website preview'));
    dlg.querySelector('#wp-title').textContent = X('ตัวอย่างเว็บไซต์ของคุณ', 'Your website preview');
    dlg.querySelector('[data-dev="desktop"]').textContent = X('💻 คอม', '💻 Desktop');
    dlg.querySelector('[data-dev="mobile"]').textContent = X('📱 มือถือ', '📱 Mobile');
    dlg.querySelector('#wp-close').textContent = X('ปิดตัวอย่าง', 'Close preview');
    frame.title = X('ตัวอย่างเว็บไซต์', 'Website preview');
    const views = [['site', X('หน้าเว็บ', 'Website')], ...(o.cms ? [['admin', X('หลังบ้าน', 'CMS')]] : []), ...(o.seo ? [['seo', 'Google']] : []), ['services', X('บริการ', 'Services')]];
    if (!views.some((v) => v[0] === view)) view = 'site';
    dlg.querySelector('#wp-views').innerHTML = views.map(([k, l]) => `<button type="button" data-view="${k}" aria-pressed="${k === view}">${l}</button>`).join('');
    dlg.querySelectorAll('[data-dev]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dev === device)));
    dlg.querySelector('#wp-dev').classList.toggle('mobile', device === 'mobile');
    const domain = state.hostName ? 'https://www.yourcompany.com' : X('https://(โดเมนของลูกค้า)', 'https://(your domain)');
    url.textContent = (state.hostName ? '🔒 ' : '') + domain + (view === 'admin' ? '/admin' : view === 'seo' ? ' — google.com' : '');
    frame.srcdoc = view === 'admin' ? adminHTML(o) : view === 'seo' ? seoHTML(o) : view === 'services' ? servicesHTML(o, state.hostName) : siteHTML(o, base());
    dlg.querySelector('#wp-chips').innerHTML = X('ที่เลือก: ', 'Selected: ') + state.labels.map((l) => `<span>${esc(l)}</span>`).join('');
  }

  window.WebPreview = {
    open(s) {
      ensure();
      LG = s.lang === 'en' ? 'en' : 'th';
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
