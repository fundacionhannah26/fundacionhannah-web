// Iconos disponibles para las tarjetas de programa. Los usan tanto el sitio
// (index.html) como el panel (admin/), así que viven en un solo archivo.
// Para añadir uno: mismo estilo que los demás (viewBox 0 0 24 24, solo trazos).
window.PROGRAM_ICONS = [
  { nombre: 'Plato', svg: '<path d="M3 11h18a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8z"/> <path d="M7 7c0-1 1-2 1-3M11 7c0-1 1-2 1-3M15 7c0-1 1-2 1-3"/> <path d="M3 19h18"/>' },
  { nombre: 'Familia', svg: '<circle cx="9" cy="8" r="3.2"/> <circle cx="17" cy="9" r="2.4"/> <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5"/> <path d="M14.5 19c.2-2 1.5-3.5 4-3.5s3.5 1.5 3.5 3.5"/>' },
  { nombre: 'Corazón', svg: '<path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 21 11c0 5.5-7 10-7 10z" transform="translate(-1 0)"/>' },
  { nombre: 'Libro', svg: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>' },
  { nombre: 'Hoja', svg: '<path d="M20 4c-7 0-14 5-14 13 0 1 .1 2 .3 3C13 20 19 15 20 4z"/><path d="M6 20c2-5 6-9 10-12"/>' },
  { nombre: 'Sol', svg: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' },
  { nombre: 'Casa', svg: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>' },
  { nombre: 'Estrella', svg: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5l-5.6 2.9 1.1-6.3L3 9.7l6.2-.9z"/>' },
  { nombre: 'Regalo', svg: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13"/><path d="M12 8S9.5 3 7 4.5 8 8 12 8s5-2 3-3.5S12 8 12 8z"/>' },
  { nombre: 'Globo', svg: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>' },
  { nombre: 'Maletín médico', svg: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 11v5M9.5 13.5h5"/>' },
  { nombre: 'Nota musical', svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  { nombre: 'Mano', svg: '<path d="M7 11V7a2 2 0 0 1 4 0v4M11 11V5a2 2 0 0 1 4 0v6M15 11V7a2 2 0 0 1 4 0v6a7 7 0 0 1-14 0v-2a2 2 0 0 1 4 0"/>' }
];
