/**
 * Pasa un video del almacén temporal de Supabase al repositorio del sitio.
 *
 * Por qué este rodeo: Vercel corta las peticiones en 4,5 MB y los videos pesan
 * entre 2 y 10 MB, así que no se pueden enviar aquí directamente. El panel los
 * sube primero a Supabase (que admite hasta 50 MB y no pasa por Vercel) y luego
 * llama a esta función, que solo recibe el nombre del archivo.
 *
 * El video termina en uploads/, igual que las fotos, para que el sitio no
 * dependa de que Supabase esté encendido para mostrarlo.
 */

const REPO = 'fundacionhannah26/fundacionhannah-web';
const RAMA = 'main';
const CARPETA = 'uploads';
const BUCKET = 'videos-temp';
const MAX_BYTES = 30 * 1024 * 1024;   // 30 MB: por encima de eso hay riesgo de que la función se agote

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mensaje: 'Método no permitido.' });
  }

  const { GITHUB_TOKEN, SUPABASE_URL, SUPABASE_KEY } = process.env;
  if (!GITHUB_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ ok: false, mensaje: 'El servidor no está configurado para subir videos.' });
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

  // ---- 2. Qué archivo hay que traer ----
  let cuerpo = req.body;
  if (typeof cuerpo === 'string') { try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = null; } }
  const nombre = cuerpo && typeof cuerpo.archivo === 'string' ? cuerpo.archivo : null;
  // Solo un nombre simple: nada de rutas ni saltos a otras carpetas
  if (!nombre || !/^[a-z0-9._-]{1,80}\.(mp4|mov|webm)$/i.test(nombre)) {
    return res.status(400).json({ ok: false, mensaje: 'No se indicó qué video subir.' });
  }

  const cabeceras = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'panel-fundacion-hannah'
  };

  try {
    // ---- 3. Traerlo del almacén temporal ----
    const origen = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(nombre)}`;
    const descarga = await fetch(origen);
    if (!descarga.ok) {
      return res.status(404).json({ ok: false, mensaje: 'No se encontró el video que se acababa de subir. Inténtalo otra vez.' });
    }
    const buf = Buffer.from(await descarga.arrayBuffer());
    if (!buf.length) return res.status(400).json({ ok: false, mensaje: 'El video llegó vacío.' });
    if (buf.length > MAX_BYTES) {
      return res.status(413).json({
        ok: false,
        mensaje: 'El video pesa ' + (buf.length / 1024 / 1024).toFixed(1) + ' MB y el máximo es 30 MB.'
      });
    }
    // Comprobar que de verdad es un MP4/MOV: los bytes 4-8 dicen "ftyp"
    if (buf.slice(4, 8).toString('ascii') !== 'ftyp' && buf.slice(0, 4).toString('hex') !== '1a45dfa3') {
      return res.status(400).json({ ok: false, mensaje: 'Ese archivo no parece un video válido.' });
    }

    // ---- 4. Guardarlo en el repositorio ----
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const azar = Math.random().toString(36).slice(2, 8);
    const ext = nombre.split('.').pop().toLowerCase() === 'webm' ? 'webm' : 'mp4';
    const ruta = `${CARPETA}/video-${fecha}-${azar}.${ext}`;
    const quien = (usuario.email || 'panel').split('@')[0];

    const escritura = await fetch(`https://api.github.com/repos/${REPO}/contents/${ruta}`, {
      method: 'PUT',
      headers: cabeceras,
      body: JSON.stringify({
        message: `Video subido desde el panel (${quien})`,
        content: buf.toString('base64'),
        branch: RAMA
      })
    });
    if (!escritura.ok) {
      const detalle = await escritura.text();
      throw new Error('GitHub respondió ' + escritura.status + ': ' + detalle.slice(0, 160));
    }

    // ---- 5. Limpiar el almacén temporal (si falla, no importa) ----
    try {
      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token }
      });
    } catch (e) { /* queda un archivo suelto en el temporal; no rompe nada */ }

    return res.status(200).json({
      ok: true,
      ruta,
      peso: (buf.length / 1024 / 1024).toFixed(1) + ' MB',
      mensaje: 'Video subido. Recuerda pulsar «Publicar cambios» para que aparezca en el sitio.'
    });
  } catch (e) {
    return res.status(502).json({
      ok: false,
      mensaje: 'No se pudo subir el video: ' + (e.message || 'error desconocido')
    });
  }
};
