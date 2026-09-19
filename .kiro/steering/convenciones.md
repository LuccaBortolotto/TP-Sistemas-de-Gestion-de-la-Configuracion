# Convenciones del Proyecto

## Estructura de archivos

- Máximo **3 archivos** por proyecto: `index.html`, `styles.css`, `script.js`
- Siempre separar HTML, CSS y JS en archivos distintos — nunca embeber `<style>` ni `<script>` inline
- No crear carpetas `src/`, `tests/`, `dist/` ni similares
- No crear `package.json`, `tsconfig.json`, `.eslintrc`, ni ningún archivo de configuración de herramientas
- No escribir unit tests ni archivos de prueba de ningún tipo

## JavaScript

- **Nomenclatura:** `camelCase` para todas las variables y funciones
- **Documentación:** JSDoc obligatorio en todas las funciones, incluyendo `@param` y `@returns`
- **Manejo de errores:** Toda lógica debe estar envuelta en `try/catch`; los mensajes de error van en español
- **Errores:** Mostrar mensajes de error al usuario en español, nunca en inglés

Ejemplo de función correcta:

```js
/**
 * Calcula el puntaje final del jugador.
 * @param {number} tiempoSegundos - Tiempo jugado en segundos.
 * @param {number} nivel - Nivel alcanzado.
 * @returns {number} Puntaje final calculado.
 */
function calcularPuntaje(tiempoSegundos, nivel) {
  try {
    return tiempoSegundos * nivel * 10;
  } catch (error) {
    console.error('Error al calcular el puntaje:', error);
    return 0;
  }
}
```

## CSS

- **Color principal:** `#7540b0` (morado) y `#c2a9df` (lila claro)
- **Tipografía:** Roboto — importar desde Google Fonts en el `<head>` del HTML
- Usar variables CSS (`--color-primario`, `--color-secundario`, `--fuente-base`) definidas en `:root`

Ejemplo de `:root` estándar:

```css
:root {
  --color-primario:   #7540b0;
  --color-secundario: #c2a9df;
  --fuente-base:      'Roboto', sans-serif;
}
```

## HTML

- Incluir siempre `<meta charset="UTF-8">` y `<meta name="viewport" ...>`
- Enlazar Roboto desde Google Fonts antes del `<link>` al CSS
- Atributos `lang="es"` en la etiqueta `<html>`
