# Implementation Plan: Sistema de Vidas y Dificultad Progresiva

## Overview

Extender el juego Kiro Ghost Runner (vanilla JS) con cuatro subsistemas: sistema de vidas con invulnerabilidad temporal, dificultad progresiva vinculada a puntos, persistencia de high score en localStorage, y HUD ampliado con overlay de game over actualizado. Toda la lógica vive en los tres archivos existentes (`script.js`, `index.html`, `styles.css`).

## Tasks

- [ ] 1. Ampliar el HTML con los iconos de vida en el HUD
  - [ ] 1.1 Añadir el bloque `#hud-vidas` con los tres `<span>` de iconos al `#hud` en `index.html`
    - Crear `<div id="hud-vidas">` con `<span id="hud-vida-1">👻</span>`, `<span id="hud-vida-2">👻</span>`, `<span id="hud-vida-3">👻</span>`
    - Colocar el div dentro de `#hud`, junto a los indicadores existentes de PUNTOS, MEJOR y NIVEL
    - _Requirements: 1.2_

- [ ] 2. Añadir estilos CSS para los iconos de vida y el HUD ampliado
  - [ ] 2.1 Definir clases `.vida-activa` y `.vida-inactiva` en `styles.css`
    - `.vida-activa`: color completo, opacidad 1, tamaño visible
    - `.vida-inactiva`: `filter: grayscale(1)`, opacidad 0.25
    - Estilar `#hud-vidas` con `display: flex` y `gap` coherente con el HUD existente
    - _Requirements: 1.4_

- [ ] 3. Implementar las funciones puras del Sistema_de_Dificultad en `script.js`
  - [ ] 3.1 Añadir `calcularVelocidad(puntos)` al bloque de lógica de estado
    - Fórmula: `Math.min(15, 5 + Math.floor(puntos / 100) * 0.5)`
    - JSDoc completo con `@param` y `@returns`; envuelto en `try/catch`
    - _Requirements: 4.1_

  - [ ] 3.2 Añadir `calcularIntervalo(puntos)` al bloque de lógica de estado
    - Fórmula: `Math.max(40, 80 - Math.floor(puntos / 100) * 5)`
    - JSDoc completo; envuelto en `try/catch`
    - _Requirements: 4.2_

  - [ ] 3.3 Añadir `calcularNivel(puntos)` al bloque de lógica de estado
    - Fórmula: `1 + Math.floor(puntos / 100)`
    - JSDoc completo; envuelto en `try/catch`
    - _Requirements: 4.4_

  - [ ]* 3.4 Escribir tests de propiedad para las funciones puras de dificultad (P7, P8, P9)
    - **Property 7: Velocidad calculada es monótonamente creciente y acotada**
    - **Validates: Requirements 4.1**
    - **Property 8: Intervalo calculado es monótonamente decreciente y acotado**
    - **Validates: Requirements 4.2**
    - **Property 9: Nivel calculado es función pura y monótonamente no-decreciente**
    - **Validates: Requirements 4.4**

- [ ] 4. Implementar la persistencia del High Score en `script.js`
  - [ ] 4.1 Añadir `cargarHighScore()` y `guardarHighScore(puntos)` al bloque de lógica de estado
    - `cargarHighScore()`: lee `kiroRunner_highScore` de `localStorage`; si el valor no es entero ≥ 0 devuelve `0`; nunca lanza
    - `guardarHighScore(puntos)`: solo escribe si `puntos > mejorPuntos`; `try/catch` con mensaje de error en español al usuario si falla
    - Añadir variable de estado `let mejorPuntos = cargarHighScore()` al bloque de estado global
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]* 4.2 Escribir test de propiedad P10 para el round-trip de high score en localStorage
    - **Property 10: Round-trip de High Score en localStorage**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 4.3 Escribir test de propiedad P11 para valores inválidos en localStorage
    - **Property 11: Valores inválidos en localStorage producen High Score = 0**
    - **Validates: Requirements 5.3**

- [ ] 5. Checkpoint — funciones puras y persistencia
  - Verificar que `calcularVelocidad`, `calcularIntervalo`, `calcularNivel`, `cargarHighScore` y `guardarHighScore` estén definidas y funcionan correctamente. Preguntar al usuario si hay dudas antes de continuar.

- [ ] 6. Implementar el Sistema_de_Vidas en `script.js`
  - [ ] 6.1 Añadir variables de estado de vidas al bloque de estado global
    - `let vidas = 3`, `let invulnerable = false`, `let timerInvul = null`
    - _Requirements: 1.1_

  - [ ] 6.2 Implementar `activarInvulnerabilidad()` y `desactivarInvulnerabilidad()`
    - `activarInvulnerabilidad()`: fija `invulnerable = true`, guarda referencia en `timerInvul`, programa `setTimeout(desactivarInvulnerabilidad, 2000)`
    - `desactivarInvulnerabilidad()`: fija `invulnerable = false`, limpia `timerInvul = null`
    - JSDoc + `try/catch` en ambas
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 6.3 Implementar `registrarColision()`
    - Si `invulnerable === true`: retornar sin hacer nada (Property 4)
    - Si `vidas > 1`: `vidas -= 1`, llamar `activarInvulnerabilidad()`, llamar `renderizarHudVidas()`
    - Si `vidas === 1`: `vidas = 0`, llamar `renderizarHudVidas()`, activar secuencia de game over (igual que el bloque inline actual en `actualizar()`)
    - JSDoc + `try/catch` con `console.error` en español
    - _Requirements: 2.1, 2.2, 3.1_

  - [ ]* 6.4 Escribir test de propiedad P3 para la lógica de colisión y decremento de vida
    - **Property 3: Colisión resta exactamente una vida y activa invulnerabilidad**
    - **Validates: Requirements 2.1, 2.2, 3.1**

  - [ ]* 6.5 Escribir test de propiedad P4 para invulnerabilidad que bloquea colisiones
    - **Property 4: Invulnerabilidad bloquea colisiones posteriores**
    - **Validates: Requirements 2.3**

- [ ] 7. Implementar `renderizarHudVidas()` y la visualización de parpadeo en `script.js`
  - [ ] 7.1 Implementar `renderizarHudVidas()`
    - Obtener referencias a `#hud-vida-1`, `#hud-vida-2`, `#hud-vida-3`
    - Para `i` de 1 a 3: si `i <= vidas` → clase `vida-activa`; si `i > vidas` → clase `vida-inactiva`
    - JSDoc + `try/catch`
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ]* 7.2 Escribir test de propiedad P2 para la sincronización de iconos con el estado de vidas
    - **Property 2: Sincronización de iconos con el estado de vidas**
    - **Validates: Requirements 1.2, 1.4**

  - [ ] 7.3 Añadir lógica de parpadeo del fantasma durante invulnerabilidad en `dibujar()`
    - Calcular visibilidad: `Math.floor((Date.now() - tiempoInicioInvul) / 100) % 2 === 0`
    - Añadir variable de estado `let tiempoInicioInvul = 0` y asignarla en `activarInvulnerabilidad()`
    - Si `invulnerable && !visible`: omitir la llamada a `dibujarFantasma` del fantasma principal (trail sigue dibujándose normalmente)
    - _Requirements: 2.6_

  - [ ]* 7.4 Escribir test de propiedad P5 para el parpadeo determinista durante invulnerabilidad
    - **Property 5: Parpadeo determinista durante invulnerabilidad**
    - **Validates: Requirements 2.6**

- [ ] 8. Refactorizar `actualizar()` para usar las nuevas funciones
  - [ ] 8.1 Sustituir el cálculo inline de `velocidad`, `intervaloObs` y `nivel` por llamadas a `calcularVelocidad(puntos)`, `calcularIntervalo(puntos)` y `calcularNivel(puntos)`
    - Eliminar las líneas de cálculo directo actualmente en `actualizar()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 8.2 Reemplazar el bloque inline de colisión en `actualizar()` por una llamada a `registrarColision()`
    - Eliminar el bloque `if (hayColision(obs)) { muerto = true; … }` inline
    - Sustituir por `if (hayColision(obs)) { registrarColision(); return; }`
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [ ] 9. Implementar `formatearPuntajeFinal()` y actualizar `mostrarGameOver()` en `script.js`
  - [ ] 9.1 Añadir `formatearPuntajeFinal(puntos, highScore, esNuevoRecord)`
    - Si `esNuevoRecord === false`: devuelve `"Puntaje: ${puntos} | Récord: ${highScore}"`
    - Si `esNuevoRecord === true`: devuelve `"Puntaje: ${puntos} | Récord: ${highScore} — ¡Nuevo récord!"`
    - JSDoc + `try/catch`
    - _Requirements: 6.2, 6.3_

  - [ ]* 9.2 Escribir test de propiedad P12 para el formato del overlay
    - **Property 12: Formato del overlay siempre es correcto**
    - **Validates: Requirements 6.2**

  - [ ]* 9.3 Escribir test de propiedad P13 para "¡Nuevo récord!" condicional
    - **Property 13: "¡Nuevo récord!" aparece si y solo si se supera el récord previo**
    - **Validates: Requirements 6.3**

  - [ ] 9.4 Actualizar `mostrarGameOver()` para usar `formatearPuntajeFinal()` y llamar a `guardarHighScore()`
    - Calcular `esNuevoRecord = puntos > mejorPuntos` antes de guardar
    - Llamar `guardarHighScore(puntos)` para persistir si corresponde
    - Asignar `puntajeFinal.textContent = formatearPuntajeFinal(puntos, mejorPuntos, esNuevoRecord)`
    - Actualizar `tituloOverlay.textContent = "💀 JUEGO TERMINADO"` y `btnJugar.textContent = "REINTENTAR"`
    - _Requirements: 6.1, 6.2, 6.3, 5.1, 5.4_

- [ ] 10. Actualizar `reiniciar()` e `iniciarPartida()` en `script.js`
  - [ ] 10.1 Añadir a `reiniciar()`: `vidas = 3`, `clearTimeout(timerInvul)`, `timerInvul = null`, `invulnerable = false`, `tiempoInicioInvul = 0`; llamar `renderizarHudVidas()` al final del bloque
    - _Requirements: 1.1, 6.4, 6.5_

  - [ ]* 10.2 Escribir test de propiedad P1 para inicialización de vidas en `reiniciar()`
    - **Property 1: Inicialización de vidas**
    - **Validates: Requirements 1.1**

  - [ ]* 10.3 Escribir test de propiedad P14 para reinicio completo del estado
    - **Property 14: Reinicio restaura estado inicial completo**
    - **Validates: Requirements 6.4, 6.5, 1.1**

- [ ] 11. Añadir llamada inicial a `cargarHighScore()` al arrancar la aplicación en `script.js`
  - [ ] 11.1 En el bloque de inicialización al final del archivo, asignar `mejorPuntos = cargarHighScore()` antes de llamar a `reiniciar()` y `dibujar()`
    - Asegurarse de que `actualizarHud()` se llame después para reflejar el high score cargado en el DOM
    - _Requirements: 5.2, 5.3, 5.4_

- [ ] 12. Checkpoint final — integración completa
  - Verificar que `reiniciar()`, `iniciarPartida()`, `actualizar()`, `mostrarGameOver()` y `dibujar()` funcionen de forma integrada. Comprobar que el HUD de vidas se actualiza correctamente, el parpadeo funciona, el high score se persiste y el overlay muestra el formato correcto. Preguntar al usuario si hay dudas antes de cerrar.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Las funciones de dificultad (`calcularVelocidad`, `calcularIntervalo`, `calcularNivel`) deben implementarse antes de refactorizar `actualizar()` (tarea 8)
- `registrarColision()` debe implementarse antes de sustituir el bloque inline de colisión (tarea 8.2)
- Los tests de propiedad usan **fast-check** ejecutado directamente en el navegador, sin bundler ni `package.json`
- Los mensajes de error visibles al usuario deben ir siempre en español

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "3.1", "3.2", "3.3"] },
    { "id": 1, "tasks": ["2.1", "4.1", "6.1"] },
    { "id": 2, "tasks": ["3.4", "4.2", "4.3", "6.2", "6.3"] },
    { "id": 3, "tasks": ["6.4", "6.5", "7.1", "8.1"] },
    { "id": 4, "tasks": ["7.2", "7.3", "8.2"] },
    { "id": 5, "tasks": ["7.4", "9.1", "10.1"] },
    { "id": 6, "tasks": ["9.2", "9.3", "9.4", "10.2", "10.3"] },
    { "id": 7, "tasks": ["11.1"] }
  ]
}
```
