# URE - Sección Vega de Granada (Vite + React + Tailwind)

Esto prepara un proyecto Vite que contiene el componente React que me pasaste, adaptado para funcionar en un entorno de navegador normal (usa localStorage si no existe una API window.storage).

Pasos para ejecutar localmente:

1. Asegúrate de tener Node.js (v16+) y npm instalados.
2. En la carpeta del proyecto ejecuta:
   - npm install
   - npm run dev
3. Abre el URL que indique la consola (por defecto http://localhost:5173).

Construcción para producción:
- npm run build
- npm run preview (para ver el build localmente)

Notas importantes:
- El proyecto usa Tailwind CSS para las clases utilitarias que hay en tu JSX.
- Si tu entorno original proveía window.storage con get/set (p. ej. un runtime específico), el código preferirá esa API. Si no existe, se usa localStorage como respaldo.
- Las dependencias relevantes se declaran en package.json: react, react-dom, lucide-react, vite y toolchain para Tailwind.

Si quieres, puedo:
- Empaquetar esto en un repositorio Git con commits iniciales.
- Añadir autenticación más segura (ahora las credenciales están en el código).
- Añadir subida real de ficheros (ahora sólo se guardan metadatos).
- Deploy en Vercel / Netlify (te preparo el repo y los pasos).