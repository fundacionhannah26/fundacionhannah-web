/**
 * Sube una fotografía a la carpeta uploads/ del repositorio.
 *
 * El panel comprime la imagen en el navegador antes de enviarla, así que lo que
 * llega aquí ya viene optimizado (las fotos del sitio rondan los 200 KB). Este
 * archivo solo comprueba que quien la envía tiene sesión, que es de verdad una
 * imagen, y la escribe en el repositorio.
 *
 * Videos NO: Vercel corta las peticiones en 4,5 MB y los videos del sitio pesan
 * entre 2 y 10 MB. Ese caso sigue siendo un proceso manual.
 */

const REPO = 'fundacionhannah26/fundacionhannah-web';
const RAMA = 'main';
const CARPETA = 'uploads';                  // la ÚNICA carpeta donde esto puede escribir
const MAX_BYTES = 3 * 1024 * 1024;          // 3 MB ya comprimida; en base64 quedan ~4 MB

// Firmas reales del archivo. No basta con fiarse de lo que diga el navegador.
const FIRMAS = [
  { ext: 'jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { ext: 'png',  bytes: [0x89, 0x50, 0x4E, 0x47] },
  { ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] }   // RIFF....WEBP
];

function tipoReal(buf) {
  for (const f of FIRMAS) {
    if (f.bytes.every((b, i) => buf[i] === b)) {
      if (f.ext === 'webp' && buf.slice(8, 12).toString('ascii') !== 'WEBP') continue;
      return f.ext;
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mensaje: 'Método no permitido.' });
  }

  const { GITHUB_TOKEN, SUPABASE_URL, SUPABASE_KEY } = process.env;
  if (!GITHUB_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ ok: false, mensaje: 'El servidor no está configurado para subir fotos.' });
  }

  // ---- 1. Sesión ----
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, mensaje: 'Falta la sesión. Vuelve a entrar al panel.' });

  let usuario;
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token }
    });
    if (!r.ok) throw new Error('sesión no válida');
    usuario = await r.json();
    if (!usuario || !usuario.id) throw new Error('sesión sin usuario');
  } catch (e) {
    return res.status(401).json({ ok: false, mensaje: 'Tu sesión expiró. Vuelve a entrar al panel.' });
  }

  // ---- 2. La imagen ----
  let cuerpo = req.body;
  if (typeof cuerpo === 'string') {
    try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = null; }
  }
  if (!cuerpo || typeof cuerpo.datos !== 'string' || !cuerpo.datos) {
    return res.status(400).json({ ok: false, mensaje: 'No llegó ninguna imagen.' });
  }

  // Acepta tanto "data:image/jpeg;base64,XXXX" como el base64 pelado
  const base64 = cuerpo.datos.includes(',') ? cuerpo.datos.split(',').pop() : cuerpo.datos;
  let buf;
  try { buf = Buffer.from(base64, 'base64'); }
  catch (e) { return res.status(400).json({ ok: false, mensaje: 'La imagen llegó dañada.' }); }

  if (!buf.length) return res.status(400).json({ ok: false, mensaje: 'La imagen llegó vacía.' });
  if (buf.length > MAX_BYTES) {
    return res.status(413).json({
      ok: false,
      mensaje: 'La foto pesa ' + Math.round(buf.length / 1024 / 102.4) / 10 + ' MB y el máximo es 3 MB. Prueba con una más pequeña.'
    });
  }

  const ext = tipoReal(buf);
  if (!ext) {
    return res.status(400).json({ ok: false, mensaje: 'Ese archivo no es una imagen (solo JPG, PNG o WebP).' });
  }

  // ---- 3. Nombre seguro, decidido aquí y no por quien envía ----
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const azar = Math.random().toString(36).slice(2, 8);
  const ruta = `${CARPETA}/foto-${fecha}-${azar}.${ext}`;

  // ---- 4. Escribirla en el repositorio ----
  const cabeceras = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'panel-fundacion-hannah'
  };
  try {
    const quien = (usuario.email || 'panel').split('@')[0];
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${ruta}`, {
      method: 'PUT',
      headers: cabeceras,
      body: JSON.stringify({
        message: `Foto subida desde el panel (${quien})`,
        content: buf.toString('base64'),
        branch: RAMA
      })
    });
    if (!r.ok) {
      const detalle = await r.text();
      throw new Error('GitHub respondió ' + r.status + ': ' + detalle.slice(0, 160));
    }
    return res.status(200).json({
      ok: true,
      ruta,                                   // p.ej. uploads/foto-20260904-a1b2c3.jpeg
      peso: Math.round(buf.length / 1024) + ' KB',
      mensaje: 'Foto subida. Recuerda pulsar «Publicar cambios» para que aparezca en el sitio.'
    });
  } catch (e) {
    return res.status(502).json({ ok: false, mensaje: 'No se pudo subir la foto: ' + (e.message || 'error desconocido') });
  }
};
