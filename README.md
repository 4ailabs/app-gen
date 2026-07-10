# Constructor de Genogramas — Bioenergética Transgeneracional

Aplicación web para construir genogramas y genosociogramas, detectar patrones transgeneracionales y trabajar el método de rastreo de la Sesión 1.

**Instituto Centrobioenergética · Dr. Miguel Ojeda Rios**

## Qué hace

- **Construye tu árbol** — agrega personas al lienzo con la notación clínica estándar (hombre/mujer, matrimonio, divorcio, corte emocional, fallecimiento, embarazo y pérdidas).
- **Modo Genosociograma** — registra fechas, edades, roles/oficios y eventos de vida en 8 categorías (muerte, abandono, traición, violencia, humillación, accidente, secreto, crisis).
- **Detección de patrones (A / R / E)** — el método de la Sesión 1: la app recorre tu árbol y sugiere coincidencias de **A**niversario (edad o fecha), **R**ol y **E**vento por rama. Marca con estrella el patrón que puedas explicar en una sola frase.
- **Guardar y cargar** — tu trabajo se guarda solo en el navegador (localStorage) y puedes exportarlo a un archivo `.json` para retomarlo en otra sesión.
- **Exportar** — el árbol se exporta como imagen PNG o PDF.

## Uso en clase

Los estudiantes abren la app, empiezan por sí mismos, suben a padres y abuelos (tres generaciones) y llenan el genosociograma. Al final usan **Patrones** para encontrar el hilo que llevan a las próximas sesiones.

## Correr en local

**Requisito:** Node.js

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Publicar en la web (Vercel)

El proyecto ya incluye `vercel.json`. Para desplegarlo:

```bash
npm i -g vercel     # si no lo tienes
vercel              # sigue las instrucciones; detecta Vite automáticamente
```

O conecta el repositorio en vercel.com — el build (`npm run build` → `dist/`) ya está preconfigurado.

## Stack

React 19 · Vite · Tailwind CSS 4 · React Flow (@xyflow/react) · Zustand · jsPDF + html-to-image.
