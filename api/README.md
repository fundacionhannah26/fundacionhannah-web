# Funciones del servidor

## `publicar.js`

Recibe el contenido editado en el panel (`/admin/`) y lo escribe como
`contenido.json` en este mismo repositorio. Vercel detecta el cambio y
republica el sitio automáticamente.

### Variables de entorno que necesita

Se configuran en **Vercel → proyecto → Settings → Environment Variables**.
Después de añadirlas hay que **redesplegar**: las variables solo se aplican a
despliegues nuevos, no a los que ya existen.

| Variable | Qué es | ¿Secreta? |
|---|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase | No, ya está en el HTML del sitio |
| `SUPABASE_KEY` | Clave publicable de Supabase | No, ya está en el HTML del sitio |
| `GITHUB_TOKEN` | Token con permiso de escritura sobre este repositorio | **Sí** |

Sobre el `GITHUB_TOKEN`: conviene que sea un *fine-grained token* limitado a
este repositorio y con permiso únicamente de **Contents: Read and write**. Un
token clásico con permisos de administrador funciona, pero si se filtrara daría
acceso a toda la cuenta.

### Cómo comprobar si está bien configurada

```bash
curl -s -X POST https://www.fundacionhannahdelacaridad.com/api/publicar \
  -H 'Content-Type: application/json' -d '{}'
```

- `"El servidor no está configurado para publicar"` → faltan variables, o falta redesplegar.
- `"Falta la sesión. Vuelve a entrar al panel."` → **correcto**: la función funciona y
  rechaza a quien no ha iniciado sesión.

### Qué protege

- Exige sesión válida de Supabase; sin ella responde 401 y no escribe nada.
- Solo puede escribir `contenido.json`, ningún otro archivo.
- Verifica que lleguen las nueve secciones; si falta alguna, no publica.
- Descarta cualquier clave `auth` que venga en el contenido.
- Rechaza cuerpos de más de 512 KB (el contenido real ronda los 15 KB).
- Si alguien publicó mientras editabas, devuelve 409 y pide recargar en vez de
  pisar el trabajo del otro.
