/* Fundación Hannah — content store shared by Landing.html and Admin.html
   Text/structure -> localStorage. Uploaded images -> IndexedDB (blobs).      */
window.CMS = (function () {
  const LS_KEY = 'hannah_cms_v1';
  const SESSION_KEY = 'hannah_admin_session';

  const DEFAULTS = {
    hero: {
      eyebrow: 'Pitalito · Huila · Colombia',
      headline: 'Alimentando sueños, sembrando sonrisas.',
      lede: 'Llevamos comidas ricas en proteína a niños y niñas en situación de vulnerabilidad. Comida real, manos reales, futuros que comienzan en una mesa.',
      cta1: 'Conocer cómo ayudar',
      cta2: 'Nuestra historia',
      photos: ['uploads/01-foto-real.jpeg', 'uploads/25-foto-real.jpeg', 'uploads/05-foto-real.jpeg', 'uploads/35-galeria-5.jpeg'],
      stats: [
        { label: 'RTE — ESAL', value: 'Tu donación es deducible', desc: 'Régimen Tributario Especial: tu aporte se descuenta del impuesto de renta.' },
        { label: 'Desde 2022', value: '+1.200 raciones servidas', desc: 'Comidas calientes, ricas en proteína, entregadas con dignidad.' }
      ]
    },
    marquee: 'Alimentando sueños · sembrando sonrisas · nutriendo futuros · abriendo mesas · Pitalito · Huila',
    mission: {
      num: '01 / Misión',
      eyebrow: 'Por qué existimos',
      title: 'Cada plato es una *promesa*: ningún niño en Pitalito debería crecer con hambre.',
      p1: 'Fundación Hannah de la Caridad nació en 2022 con una idea simple y obstinada: la nutrición es el primer derecho. En los barrios más vulnerables de Pitalito, Huila, llevamos comidas calientes y ricas en proteína —preparadas con cariño, servidas con respeto— a niños, niñas y familias que las necesitan.',
      p2: 'Trabajamos con voluntarios, vecinos y aliados locales. Sin intermediarios, sin distancias innecesarias. Cada aporte que recibimos termina en una mesa, en un plato, en una sonrisa.',
      pull: '“Cuando un niño come bien, el barrio entero respira distinto.”'
    },
    stats: [
      { lbl: 'Fundada', num: '2022', desc: 'Tres años entregando comidas, escuchando familias, construyendo confianza.' },
      { lbl: 'Cobertura', num: '100%', desc: 'De cada peso donado va directo a comida y atención de los niños.' },
      { lbl: 'Territorio', num: 'Pitalito, Huila', desc: 'Operamos en barrios y veredas del sur del Huila colombiano.' },
      { lbl: 'Beneficiarios', num: '+300', desc: 'Niños, niñas y familias acompañados con alimentación y comunidad.' },
      { lbl: 'Beneficio tributario', num: 'Donaciones deducibles del impuesto de renta', desc: 'Somos ESAL bajo Régimen Tributario Especial (NIT 901.631.639-1). Empresas y personas naturales pueden descontar su aporte.' }
    ],
    programs: {
      num: '02 / Lo que hacemos',
      eyebrow: 'Tres frentes, una mesa',
      title: 'Comida con propósito, familias con respaldo, comunidad en acción.',
      lede: 'Cada programa nace de lo que hemos escuchado en los barrios. No improvisamos: ajustamos, medimos y volvemos al territorio.',
      items: [
        { title: 'Alimentación con propósito', body: 'Jornadas semanales de comida caliente y rica en proteína, diseñadas con criterios nutricionales y servidas en los barrios donde más se necesita.', tag: 'Comidas · Refrigerios · Mercados', photo: 'uploads/01-foto-real.jpeg' },
        { title: 'Apoyo a familias', body: 'Acompañamos a las familias con orientación, mercados solidarios y conexiones con redes de apoyo local. Nadie come solo; nadie cría solo.', tag: 'Mercados · Acompañamiento · Redes', photo: 'uploads/30-foto-real.jpeg' },
        { title: 'Comunidad en acción', body: 'Voluntarios, cocineras del barrio, parroquias y aliados que se suman cada semana. La fundación no es un edificio: es una red de manos.', tag: 'Voluntariado · Eventos · Aliados', photo: 'uploads/45-galeria-15.jpeg' }
      ]
    },
    gallery: {
      num: '03 / Galería',
      eyebrow: 'Lo que pasa en la mesa',
      title: 'Rostros, manos y momentos del territorio.',
      lede: 'Estas no son fotos de archivo. Son niños, niñas y voluntarios reales en jornadas reales en Pitalito.',
      items: [
        { src: 'uploads/01-foto-real.jpeg', tag: 'Comida y compañía' },
        { src: 'uploads/02-foto-real.jpeg', tag: 'Sonrisas con plato' },
        { src: 'uploads/03-foto-real.jpeg', tag: 'Familia entera' },
        { src: 'uploads/04-foto-real.jpeg', tag: 'Compartir el pan' },
        { src: 'uploads/05-foto-real.jpeg', tag: 'Sueño en la mesa' },
        { src: 'uploads/06-foto-real.jpeg', tag: 'Pitalito en jornada' },
        { src: 'uploads/07-foto-real.jpeg', tag: 'Voluntariado' },
        { src: 'uploads/08-foto-real.jpeg', tag: 'Manos al servicio' },
        { src: 'uploads/09-foto-real.jpeg', tag: 'Cocina solidaria' },
        { src: 'uploads/10-foto-real.jpeg', tag: 'Retrato del barrio' },
        { src: 'uploads/11-foto-real.jpeg', tag: 'Niños del Solarte' },
        { src: 'uploads/12-foto-real.jpeg', tag: 'Pitalito, Huila' },
        { src: 'uploads/13-foto-real.jpeg', tag: 'En el comedor' },
        { src: 'uploads/14-foto-real.jpeg', tag: 'Acompañamiento' },
        { src: 'uploads/15-foto-real.jpeg', tag: 'Nochebuena 2024' },
        { src: 'uploads/16-foto-real.jpeg', tag: 'Aprender jugando' },
        { src: 'uploads/17-foto-real.jpeg', tag: 'Trabajo de campo' },
        { src: 'uploads/18-foto-real.jpeg', tag: 'Familias unidas' },
        { src: 'uploads/19-foto-real.jpeg', tag: 'Comunidad' },
        { src: 'uploads/20-foto-real.jpeg', tag: 'Visita pastoral' },
        { src: 'uploads/21-foto-real.jpeg', tag: 'Mercado solidario' },
        { src: 'uploads/22-foto-real.jpeg', tag: 'Manos pequeñas' },
        { src: 'uploads/23-foto-real.jpeg', tag: 'Compartir' },
        { src: 'uploads/24-foto-real.jpeg', tag: 'Tarde de entrega' },
        { src: 'uploads/25-foto-real.jpeg', tag: 'Bolsa con cariño' },
        { src: 'uploads/26-foto-real.jpeg', tag: 'En la fila' },
        { src: 'uploads/27-foto-real.jpeg', tag: 'Voluntarias' },
        { src: 'uploads/28-foto-real.jpeg', tag: 'En el barrio' },
        { src: 'uploads/29-foto-real.jpeg', tag: 'Comer juntos' },
        { src: 'uploads/30-foto-real.jpeg', tag: 'Padre e hijo' },
        { src: 'uploads/31-galeria-1.jpeg', tag: 'Jornada' },
        { src: 'uploads/32-galeria-2.jpeg', tag: 'Jornada' },
        { src: 'uploads/33-galeria-3.jpeg', tag: 'Jornada' },
        { src: 'uploads/34-galeria-4.jpeg', tag: 'Jornada' },
        { src: 'uploads/35-galeria-5.jpeg', tag: 'Entrega' },
        { src: 'uploads/36-galeria-6.jpeg', tag: 'Entrega' },
        { src: 'uploads/37-galeria-7.jpeg', tag: 'Equipo' },
        { src: 'uploads/38-galeria-8.jpeg', tag: 'Equipo' },
        { src: 'uploads/39-galeria-9.jpeg', tag: 'Comunidad' },
        { src: 'uploads/40-galeria-10.jpeg', tag: 'Convocatoria' },
        { src: 'uploads/41-galeria-11.jpeg', tag: 'Convocatoria' },
        { src: 'uploads/42-galeria-12.jpeg', tag: 'Voluntariado' },
        { src: 'uploads/43-galeria-13.jpeg', tag: 'Donaciones' },
        { src: 'uploads/44-galeria-14.jpeg', tag: 'Niños del barrio' },
        { src: 'uploads/45-galeria-15.jpeg', tag: 'Equipo Hannah' },
        { src: 'uploads/46-galeria-16.jpeg', tag: 'Comunidad en acción' }
      ]
    },
    donation: {
      num: '04 / Cómo ayudar',
      pill: 'Donación deducible del impuesto de renta — RTE',
      eyebrow: 'Tu aporte transforma',
      title: 'Cada aporte transforma *una vida.*',
      lede: 'Como Entidad Sin Ánimo de Lucro bajo Régimen Tributario Especial, tus donaciones —de empresa o persona natural— son deducibles del impuesto de renta. Y se traducen, sin desvíos, en comida caliente para un niño esta semana.',
      cta: 'Donar ahora',
      photo: 'uploads/03-foto-real.jpeg',
      modalTitle: 'Tu aporte llega *directo* a un plato.',
      modalDesc: 'Cada peso se traduce en comida caliente y rica en proteína para niños y niñas en Pitalito.',
      tiles: [
        { label: 'Empresas', title: 'Aporta y descuenta', body: 'Tu empresa puede deducir hasta el 25% del aporte. Solicita certificado de donación con NIT 901.631.639-1.' },
        { label: 'Personas naturales', title: 'Tu donación, tu deducción', body: 'Benefíciate del descuento tributario y entrega comida real a un niño en Pitalito.' },
        { label: 'Voluntariado', title: 'Suma tus manos', body: 'Cocinas, jornadas, logística, redes. Hay un lugar para ti los sábados en Pitalito.' }
      ],
      amounts: [
        { value: '20000', note: '1 plato' },
        { value: '50000', note: '3 platos' },
        { value: '100000', note: 'una familia' },
        { value: '250000', note: 'un barrio' },
        { value: '500000', note: 'una jornada' },
        { value: '1000000', note: 'un mes' }
      ]
    },
    contact: {
      num: '05 / Contacto',
      eyebrow: 'Hablemos',
      title: 'Te respondemos. Te recibimos.',
      lede: 'Empresa, donante, voluntario o vecino: escríbenos. Estamos en Pitalito y siempre tenemos café.',
      infoTitle: 'Pitalito, el corazón del Huila.',
      address: 'Calle 15 Sur # 2 Este — 200\nBarrio Solarte, Pitalito, Huila',
      email: 'hannahdelacaridad26@gmail.com',
      phone: '+57 315 989 9377',
      instagram: '@hannah_delacaridad',
      mapQuery: 'Pitalito,Huila,Colombia'
    },
    footer: {
      quote: '“Alimentando sueños, sembrando sonrisas.”',
      desc: 'Entidad Sin Ánimo de Lucro (ESAL) bajo Régimen Tributario Especial. Pitalito, Huila — Colombia.',
      nit: 'NIT 901.631.639-1 · ESAL — Régimen Tributario Especial',
      copyright: '© 2022—2026 Fundación Hannah de la Caridad. Todos los derechos reservados.'
    },
  };

  /* ---------- schema that drives the admin forms ---------- */
  const SCHEMA = [
    { id: 'hero', label: 'Portada', icon: 'home', fields: [
      { path: 'hero.eyebrow', label: 'Ubicación / etiqueta superior', type: 'text' },
      { path: 'hero.headline', label: 'Titular principal', type: 'textarea', hint: 'El texto después de la primera coma se pinta con el degradado de color.' },
      { path: 'hero.lede', label: 'Párrafo de entrada', type: 'textarea' },
      { path: 'hero.cta1', label: 'Botón principal', type: 'text' },
      { path: 'hero.cta2', label: 'Botón secundario', type: 'text' },
      { path: 'hero.photos', label: 'Fotos del carrusel', type: 'imagelist' },
      { path: 'hero.stats', label: 'Tarjetas flotantes', type: 'repeat', sub: [
        { key: 'label', label: 'Etiqueta', type: 'text' },
        { key: 'value', label: 'Titular', type: 'text' },
        { key: 'desc', label: 'Descripción', type: 'textarea' }
      ] },
      { path: 'marquee', label: 'Cinta deslizante', type: 'text', hint: 'Separa las frases con · (punto medio).' }
    ] },
    { id: 'mission', label: 'Misión e impacto', icon: 'heart', fields: [
      { path: 'mission.num', label: 'Numeral de sección', type: 'text' },
      { path: 'mission.eyebrow', label: 'Etiqueta', type: 'text' },
      { path: 'mission.title', label: 'Título', type: 'textarea', hint: 'Encierra palabras entre *asteriscos* para resaltarlas en cursiva y color.' },
      { path: 'mission.p1', label: 'Primer párrafo', type: 'textarea' },
      { path: 'mission.p2', label: 'Segundo párrafo', type: 'textarea' },
      { path: 'mission.pull', label: 'Frase destacada', type: 'textarea' },
      { path: 'stats', label: 'Tarjetas de cifras', type: 'repeat', sub: [
        { key: 'lbl', label: 'Etiqueta', type: 'text' },
        { key: 'num', label: 'Cifra o titular', type: 'text' },
        { key: 'desc', label: 'Descripción', type: 'textarea' }
      ] }
    ] },
    { id: 'programs', label: 'Programas', icon: 'grid', fields: [
      { path: 'programs.num', label: 'Numeral de sección', type: 'text' },
      { path: 'programs.eyebrow', label: 'Etiqueta', type: 'text' },
      { path: 'programs.title', label: 'Título', type: 'textarea' },
      { path: 'programs.lede', label: 'Bajada', type: 'textarea' },
      { path: 'programs.items', label: 'Tarjetas de programa', type: 'repeat', sub: [
        { key: 'title', label: 'Nombre del programa', type: 'text' },
        { key: 'body', label: 'Descripción', type: 'textarea' },
        { key: 'tag', label: 'Etiqueta inferior', type: 'text' },
        { key: 'photo', label: 'Fotografía', type: 'image' }
      ] }
    ] },
    { id: 'gallery', label: 'Galería', icon: 'image', fields: [
      { path: 'gallery.num', label: 'Numeral de sección', type: 'text' },
      { path: 'gallery.eyebrow', label: 'Etiqueta', type: 'text' },
      { path: 'gallery.title', label: 'Título', type: 'textarea' },
      { path: 'gallery.lede', label: 'Bajada', type: 'textarea' },
      { path: 'gallery.items', label: 'Fotografías', type: 'gallery' }
    ] },
    { id: 'donation', label: 'Donaciones', icon: 'gift', fields: [
      { path: 'donation.num', label: 'Numeral de sección', type: 'text' },
      { path: 'donation.pill', label: 'Píldora tributaria', type: 'text' },
      { path: 'donation.eyebrow', label: 'Etiqueta', type: 'text' },
      { path: 'donation.title', label: 'Título', type: 'textarea', hint: 'Usa *asteriscos* para resaltar.' },
      { path: 'donation.lede', label: 'Párrafo', type: 'textarea' },
      { path: 'donation.cta', label: 'Texto del botón', type: 'text' },
      { path: 'donation.photo', label: 'Fotografía de fondo', type: 'image' },
      { path: 'donation.modalTitle', label: 'Título de la ventana de pago', type: 'textarea' },
      { path: 'donation.modalDesc', label: 'Texto de la ventana de pago', type: 'textarea' },
      { path: 'donation.tiles', label: 'Tarjetas laterales', type: 'repeat', sub: [
        { key: 'label', label: 'Etiqueta', type: 'text' },
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'body', label: 'Descripción', type: 'textarea' }
      ] },
      { path: 'donation.amounts', label: 'Montos sugeridos (COP)', type: 'repeat', compact: true, sub: [
        { key: 'value', label: 'Monto en pesos', type: 'text' },
        { key: 'note', label: 'Equivalencia', type: 'text' }
      ] }
    ] },
    { id: 'contact', label: 'Contacto', icon: 'pin', fields: [
      { path: 'contact.num', label: 'Numeral de sección', type: 'text' },
      { path: 'contact.eyebrow', label: 'Etiqueta', type: 'text' },
      { path: 'contact.title', label: 'Título', type: 'textarea' },
      { path: 'contact.lede', label: 'Bajada', type: 'textarea' },
      { path: 'contact.infoTitle', label: 'Título del bloque de datos', type: 'textarea' },
      { path: 'contact.address', label: 'Dirección', type: 'textarea' },
      { path: 'contact.email', label: 'Correo electrónico', type: 'text' },
      { path: 'contact.phone', label: 'Teléfono', type: 'text' },
      { path: 'contact.instagram', label: 'Instagram', type: 'text' },
      { path: 'contact.mapQuery', label: 'Ubicación del mapa', type: 'text', hint: 'Dirección o ciudad que Google Maps debe mostrar.' }
    ] },
    { id: 'footer', label: 'Pie de página', icon: 'layers', fields: [
      { path: 'footer.quote', label: 'Frase de marca', type: 'textarea' },
      { path: 'footer.desc', label: 'Descripción legal', type: 'textarea' },
      { path: 'footer.nit', label: 'Línea de NIT / régimen', type: 'text' },
      { path: 'footer.copyright', label: 'Aviso de derechos', type: 'text' }
    ] }
  ];

  /* ---------- path helpers ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function get(obj, path) {
    return path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);
  }
  function set(obj, path, val) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((a, k) => (a[k] = a[k] || {}), obj);
    target[last] = val;
  }

  /* ---------- IndexedDB for uploaded images ---------- */
  const DB_NAME = 'hannah_media';
  const STORE = 'images';
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const rq = indexedDB.open(DB_NAME, 1);
      rq.onupgradeneeded = () => { if (!rq.result.objectStoreNames.contains(STORE)) rq.result.createObjectStore(STORE); };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction(STORE, mode);
      const rq = fn(t.objectStore(STORE));
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  }
  const mediaPut = (id, blob) => tx('readwrite', (s) => s.put(blob, id));
  const mediaGet = (id) => tx('readonly', (s) => s.get(id));
  const mediaDel = (id) => tx('readwrite', (s) => s.delete(id));
  const mediaKeys = () => tx('readonly', (s) => s.getAllKeys());

  /* ---------- state ---------- */
  let data = clone(DEFAULTS);
  const urlCache = new Map();

  // El contenido real del sitio vive en ../contenido.json. Los valores de
  // DEFAULTS solo sirven de respaldo si ese archivo no se puede leer.
  async function init() {
    try {
      const r = await fetch('../contenido.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      data = deepMerge(clone(DEFAULTS), await r.json());
      original = clone(data);
    } catch (e) {
      console.warn('No se pudo leer contenido.json; se muestran los valores por defecto.', e);
    }
    return data;
  }
  function load() { return data; }
  function deepMerge(base, patch) {
    if (Array.isArray(patch)) return patch;
    if (patch && typeof patch === 'object') {
      Object.keys(patch).forEach((k) => {
        base[k] = (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]))
          ? deepMerge(base[k], patch[k]) : patch[k];
      });
      return base;
    }
    return patch === undefined ? base : patch;
  }
  let original = clone(DEFAULTS);
  function save(next) {
    if (next) data = next;
    return data; // La publicación real llega en la fase 3
  }
  function reset() {
    data = clone(original);
    return data;
  }
  // ¿Hay cambios respecto a lo que está publicado?
  // Compara lo que se está editando (el borrador) con lo que está publicado.
  // Sin argumento compara el contenido cargado, que es justamente lo publicado:
  // por eso antes nunca detectaba cambios.
  function dirty(actual) { return JSON.stringify(actual || data) !== JSON.stringify(original); }
  function diff(actual) {
    const nuevo = actual || data;
    const out = [];
    const walk = (a, b, ruta) => {
      if (JSON.stringify(a) === JSON.stringify(b)) return;
      if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
        new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => walk(a[k], b[k], ruta ? ruta + '.' + k : k));
      } else out.push(ruta);
    };
    walk(original, nuevo, '');
    return out;
  }

  /* ---------- media ---------- */
  async function upload(file) {
    const id = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const blob = await compress(file);
    await mediaPut(id, blob);
    return 'media:' + id;
  }
  function compress(file, maxW = 1800, quality = 0.86) {
    return new Promise((res) => {
      const img = new Image();
      const rd = new FileReader();
      rd.onload = () => { img.src = rd.result; };
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const cx = c.getContext('2d');
        cx.imageSmoothingQuality = 'high';
        cx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => res(b || file), 'image/jpeg', quality);
      };
      img.onerror = () => res(file);
      rd.readAsDataURL(file);
    });
  }
  async function url(src) {
    // Las imágenes del sitio son rutas normales dentro de uploads/
    if (typeof src === 'string' && !src.startsWith('media:')) return '../' + src;
    if (!src) return '';
    if (!src.startsWith('media:')) return src;
    if (urlCache.has(src)) return urlCache.get(src);
    const blob = await mediaGet(src.slice(6));
    if (!blob) return '';
    const u = URL.createObjectURL(blob);
    urlCache.set(src, u);
    return u;
  }
  /** Resolve every media: reference used anywhere in the content tree. */
  async function resolveAll() {
    const srcs = new Set();
    (function walk(v) {
      if (typeof v === 'string' && v.startsWith('media:')) srcs.add(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    })(data);
    await Promise.all([...srcs].map(url));
  }
  /** Delete blobs no longer referenced by the content. */
  async function gc() {
    const used = new Set();
    (function walk(v) {
      if (typeof v === 'string' && v.startsWith('media:')) used.add(v.slice(6));
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    })(data);
    const keys = await mediaKeys();
    await Promise.all(keys.filter((k) => !used.has(k)).map(mediaDel));
  }
  async function usage() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    return navigator.storage.estimate();
  }

  /* ---------- text markup: *word* -> <em>word</em> ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }
  function rich(s) {
    return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  }

  /* ---------- session ---------- */
  // Autenticación real contra Supabase. La contraseña nunca viaja en el código
  // ni se guarda aquí: la verifica Supabase y devuelve un token de sesión.
  const SB_URL = 'https://gchassziamqbrgqiijpo.supabase.co';
  const SB_KEY = 'sb_publishable_aRu6LMgrGgEnogb1dQ6DsA_M7MgZQlU';
  let sb = null;
  function cliente() {
    if (!sb) {
      if (!window.supabase) throw new Error('No se pudo cargar el sistema de acceso.');
      sb = window.supabase.createClient(SB_URL, SB_KEY);
    }
    return sb;
  }
  const session = {
    async login(correo, clave) {
      const { data: d, error } = await cliente().auth.signInWithPassword({ email: correo, password: clave });
      if (error) return { ok: false, error: error.message };
      return { ok: true, user: d.user };
    },
    async active() {
      try {
        const { data: d } = await cliente().auth.getSession();
        return !!(d && d.session);
      } catch (e) { return false; }
    },
    async user() {
      const { data: d } = await cliente().auth.getUser();
      return d ? d.user : null;
    },
    async logout() { try { await cliente().auth.signOut(); } catch (e) {} },
    async token() {
      const { data: d } = await cliente().auth.getSession();
      return d && d.session ? d.session.access_token : null;
    }
  };


  return {
    DEFAULTS, SCHEMA, data: () => data, get: (p) => get(data, p), set: (p, v) => set(data, p, v),
    init, load, save, reset, clone, upload, url, resolveAll, gc, usage, rich, esc, session, dirty, diff
  };
})();
