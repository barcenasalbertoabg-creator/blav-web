# BLAV Bienes Raíces — Sitio Web

Next.js 14 + Tailwind CSS + Framer Motion + **Sanity CMS**.
Gestión de contenido desde panel web. Deploy automático en Vercel.

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| Tailwind CSS | Estilos |
| Framer Motion | Animaciones |
| React Hook Form | Formularios |
| **Sanity v3** | CMS — gestión de proyectos, imágenes y textos |
| Vercel | Hosting + deploys automáticos |

---

## Configuración inicial (solo una vez)

### Paso 1 — Crear proyecto en Sanity

1. Ve a [sanity.io/manage](https://sanity.io/manage)
2. Crea una cuenta gratuita (o inicia sesión)
3. Crea un nuevo proyecto: **"BLAV Bienes Raíces"**, dataset: `production`
4. Copia el **Project ID** que aparece en el dashboard

### Paso 2 — Crear token de API

En tu proyecto de Sanity → **API** → **Tokens** → **Add API token**
- Nombre: `Migration / Admin`
- Permisos: `Editor`
- Copia el token generado

### Paso 3 — Configurar variables de entorno

Copia el archivo de ejemplo y rellénalo:
```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id-aqui
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tu-token-aqui
```

### Paso 4 — Migrar datos existentes a Sanity

```bash
npm run migrate
```

Esto sube el proyecto **Distrito Comercial 2.17** (y cualquier otro JSON en `data/projects/`) a Sanity.

### Paso 5 — Iniciar el proyecto

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Studio (panel CMS): http://localhost:3000/studio

---

## Uso del Studio (panel de administración)

### Acceder al studio

- **Desarrollo:** http://localhost:3000/studio
- **Producción:** https://tudominio.com/studio *(solo tú puedes acceder — protégelo con Sanity CORS)*

### Agregar un nuevo proyecto

1. Abre el studio
2. Clic en **"Proyectos"** en el menú lateral
3. Clic en **"+ New document"**
4. Rellena todos los campos:
   - **Nombre** y **Slug** (URL) — el slug se genera automáticamente
   - **Categoría** y **Estado**
   - **Imagen de portada** — sube la imagen o pon una URL externa temporal
   - **Descripción corta** — máx 300 caracteres, aparece en tarjetas
   - **Descripción completa** — editor de texto enriquecido
   - **Cifras clave** — los KPIs grandes (ej: "300 locales")
   - **Características** — tabla de datos técnicos
   - **Ubicación** — ciudad, zona y link de Google Maps
   - **SEO** — título, meta descripción e imagen para compartir
5. Clic en **Publish**
6. El proyecto aparece en el sitio en ~60 segundos (si está en producción)

### Editar contenido existente

1. Abre el studio → clic en el proyecto
2. Edita cualquier campo
3. Clic en **Publish** para guardar cambios

### Subir imágenes reales (cuando lleguen los renders)

1. Abre el proyecto en el studio
2. En **"Imagen de portada"**: clic en el campo → **Upload**
3. En **"Galería de imágenes"**: clic en **"+"** → **Upload**
4. Una vez subida la imagen real, puedes borrar la **"URL externa"** del campo
5. Publica los cambios

---

## Deploy en Vercel

### Paso 1 — Conectar repositorio

1. Sube el proyecto a GitHub:
   ```bash
   git init && git add . && git commit -m "initial commit"
   gh repo create blav-web --private && git push -u origin main
   ```

2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa el repo de GitHub

### Paso 2 — Configurar variables de entorno en Vercel

En el dashboard de Vercel → tu proyecto → **Settings** → **Environment Variables**:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | tu project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

*(No pongas el `SANITY_API_TOKEN` en Vercel — solo se usa para la migración local)*

### Paso 3 — Deploy

Vercel hace el primer deploy automáticamente. Cada `git push` a `main` dispara un nuevo deploy.

### Actualizaciones automáticas al publicar en Sanity

Con `revalidate = 60` activado en las páginas, los cambios que hagas en Sanity aparecen en el sitio **en menos de 60 segundos** sin necesidad de hacer un deploy.

Para actualizaciones **instantáneas**, configura un webhook en Sanity → Vercel:
1. Sanity manage → tu proyecto → **API** → **Webhooks** → **Add webhook**
2. URL: `https://api.vercel.com/v1/integrations/deploy/TU_DEPLOY_HOOK`
3. Genera el deploy hook en Vercel → **Settings** → **Git** → **Deploy Hooks**

---

## Desarrollo local

```bash
npm install
npm run dev        # Servidor en http://localhost:3000
npm run build      # Build de producción
npm run migrate    # Migrar JSON locales a Sanity (solo una vez)
```

---

## Estructura de archivos

```
blav-web/
├── data/projects/              ← JSONs originales (referencia, ya no se usan en prod)
├── public/images/              ← Imágenes locales (si las hay)
├── sanity/
│   ├── schemaTypes/project.ts  ← Schema del CMS (campos y validaciones)
│   ├── lib/client.ts           ← Cliente de Sanity
│   ├── lib/queries.ts          ← Consultas GROQ
│   └── lib/image.ts            ← Resolución de URLs de imagen
├── sanity.config.ts            ← Configuración del studio
├── scripts/
│   └── migrate-to-sanity.mjs  ← Script de migración
└── src/
    ├── app/
    │   ├── (site)/             ← Todas las páginas del sitio
    │   └── studio/             ← Panel de administración Sanity
    ├── components/
    ├── lib/projects.ts         ← Obtiene datos de Sanity
    └── types/project.ts        ← Tipos TypeScript
```

---

## Cambiar datos de contacto

Si cambias de asesor o número de WhatsApp:
- `src/lib/whatsapp.ts` → línea `const PHONE = "524428378891"`
- Busca y reemplaza en todos los componentes de `src/components/layout/` y `src/components/home/`

---

*BLAV Bienes Raíces · Alberto Bárcenas · (442) 837 88 91 · blav.com.mx*
