/**
 * Publica el contenido editado en el panel.
 *
 * Recibe el contenido nuevo, comprueba que quien lo envía tiene sesión abierta
 * en el panel, y lo escribe como contenido.json en el repositorio. Vercel ve el
 * cambio y republica el sitio solo, en un par de minutos.
 *
 * Por qué se escribe en el repositorio y no en una base de datos: así el
 * contenido viaja siempre dentro del sitio y no depende de que ningún servicio
 * esté vivo. Ademas queda historial de cada cambio y se puede revertir.
 *
 * Variables de entorno necesarias (se configuran en Vercel):
 *   GITHUB_TOKEN   token con permiso de escritura sobre el repositorio
 *   SUPABASE_URL   url del proyecto, para verificar la sesión
 *   SUPABASE_KEY   clave publicable del proyecto
 */

const REPO = 'fundacionhannah26/fundacionhannah-web';
const RAMA = 'main';
const ARCHIVO = 'contenido.json';           // el ÚNICO archivo que esto puede tocar
const MAX_BYTES = 512 * 1024;               // 512 KB: el contenido real ronda los 15 KB
const SECCIONES = ['hero', 'marquee', 'mission', 'stats', 'programs', 'gallery', 'donation', 'contact', 'footer'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mensaje: 'Método no permitido.' });
  }

  const { GITHUB_TOKEN, SUPABASE_URL, SUPABASE_KEY } = process.env;
  if (!GITHUB_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({
      ok: false,
      mensaje: 'El servidor no está configurado para publicar. Faltan variables de entorno en Vercel.'
    });
  }

  // ---- 1. ¿Quién envía esto tiene sesión abierta en el panel? ----
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Falta la sesión. Vuelve a entrar al panel.' });
  }

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

  // ---- 2. ¿El contenido tiene la forma esperada? ----
  let contenido = req.body;
  if (typeof contenido === 'string') {
    try { contenido = JSON.parse(contenido); }
    catch (e) { return res.status(400).json({ ok: false, mensaje: 'El contenido enviado no es válido.' }); }
  }
  if (!contenido || typeof contenido !== 'object' || Array.isArray(contenido)) {
    return res.status(400).json({ ok: false, mensaje: 'El contenido enviado no es válido.' });
  }
  const faltan = SECCIONES.filter((k) => !(k in contenido));
  if (faltan.length) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El contenido está incompleto; faltan secciones: ' + faltan.join(', ') + '. No se publicó nada.'
    });
  }
  // Nada de credenciales dentro del contenido público
  delete contenido.auth;

  const texto = JSON.stringify(contenido, null, 2) + '\n';
  if (Buffer.byteLength(texto, 'utf8') > MAX_BYTES) {
    return res.status(413).json({ ok: false, mensaje: 'El contenido es demasiado grande para publicarse.' });
  }

  // ---- 3. Escribirlo en el repositorio ----
  const cabeceras = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'panel-fundacion-hannah'
  };
  const urlArchivo = `https://api.github.com/repos/${REPO}/contents/${ARCHIVO}`;

  try {
    // Hay que mandar el sha de la versión actual, o GitHub rechaza la escritura.
    let sha;
    const actual = await fetch(`${urlArchivo}?ref=${RAMA}`, { headers: cabeceras });
    if (actual.ok) sha = (await actual.json()).sha;
    else if (actual.status !== 404) throw new Error('GitHub respondió ' + actual.status + ' al leer el archivo');

    const quien = (usuario.email || 'panel').split('@')[0];
    const cuerpo = {
      message: `Contenido actualizado desde el panel (${quien})`,
      content: Buffer.from(texto, 'utf8').toString('base64'),
      branch: RAMA
    };
    if (sha) cuerpo.sha = sha;

    const escritura = await fetch(urlArchivo, {
      method: 'PUT', headers: cabeceras, body: JSON.stringify(cuerpo)
    });
    if (!escritura.ok) {
      const detalle = await escritura.text();
      // 409 = alguien más publicó mientras tanto y el sha quedó viejo
      if (escritura.status === 409) {
        return res.status(409).json({
          ok: false,
          mensaje: 'Alguien publicó cambios mientras editabas. Recarga el panel y vuelve a aplicar los tuyos.'
        });
      }
      throw new Error('GitHub respondió ' + escritura.status + ': ' + detalle.slice(0, 200));
    }

    const hecho = await escritura.json();
    return res.status(200).json({
      ok: true,
      mensaje: 'Cambios publicados. El sitio se actualiza en un par de minutos.',
      commit: hecho.commit ? hecho.commit.sha.slice(0, 7) : null
    });
  } catch (e) {
    return res.status(502).json({
      ok: false,
      mensaje: 'No se pudo publicar: ' + (e.message || 'error desconocido') + '. Tus cambios siguen en pantalla.'
    });
  }
};
