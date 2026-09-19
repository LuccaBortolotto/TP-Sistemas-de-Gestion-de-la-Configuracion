# Requirements Document

## Introduction

Este documento describe los requisitos para el sistema de vidas y dificultad progresiva del juego Kiro Ghost Runner. La funcionalidad añade un sistema de 3 vidas que le da al jugador múltiples oportunidades por partida, vincula la velocidad de los obstáculos a los puntos acumulados para incrementar la dificultad gradualmente, persiste el mejor puntaje entre sesiones mediante localStorage, y presenta una pantalla de game over completa con opción de reiniciar.

## Glossary

- **Juego**: La aplicación Kiro Ghost Runner en su conjunto.
- **Jugador**: El usuario que controla al fantasma en pantalla.
- **Fantasma**: El personaje controlable del Jugador.
- **Vida**: Unidad de resiliencia del Jugador; al perder todas las vidas la partida termina.
- **HUD**: Interfaz de información en pantalla (puntos, mejor puntaje, nivel, vidas).
- **Obstáculo**: Elemento del entorno que produce daño al colisionar con el Fantasma.
- **Colisión**: Superposición entre el área del Fantasma y el área de un Obstáculo.
- **Puntos**: Contador numérico que aumenta con el tiempo durante una partida.
- **Nivel**: Etapa de dificultad derivada de los Puntos acumulados.
- **Velocidad**: Rapidez a la que se desplazan los Obstáculos a través del canvas.
- **High Score**: El mayor puntaje obtenido por el Jugador, almacenado entre sesiones.
- **localStorage**: Mecanismo de persistencia del navegador para datos clave-valor.
- **Invulnerabilidad**: Estado temporal en el que el Fantasma no recibe daño.
- **Overlay**: Panel semitransparente superpuesto al canvas para mostrar mensajes.
- **Sistema_de_Vidas**: El subsistema encargado de gestionar vidas, invulnerabilidad y fin de partida.
- **Sistema_de_Dificultad**: El subsistema encargado de escalar velocidad e intervalo de obstáculos.
- **HUD_Vidas**: El componente visual del HUD que representa las vidas restantes como iconos.

---

## Requirements

### Requirement 1: Vidas iniciales y visualización en el HUD

**User Story:** Como Jugador, quiero empezar cada partida con 3 vidas representadas visualmente en el HUD, para saber cuántas oportunidades me quedan antes de que acabe el juego.

#### Acceptance Criteria

1. THE Sistema_de_Vidas SHALL inicializar el contador de vidas en 3 al comienzo de cada partida nueva, incluyendo las partidas iniciadas desde el botón "REINTENTAR".
2. THE HUD_Vidas SHALL mostrar exactamente tantos iconos de vida como vidas tenga el Jugador en ese momento, con un máximo de 3 iconos visibles simultáneamente.
3. WHEN el Jugador pierde una vida, THE HUD_Vidas SHALL actualizar los iconos en el mismo frame de renderizado en que se registra la pérdida de vida.
4. THE HUD_Vidas SHALL representar las vidas activas con un icono en color completo y las vidas inactivas (perdidas) con el mismo icono en escala de grises o semitransparente.
5. WHEN el contador de vidas llega a 0, THE HUD_Vidas SHALL mostrar los 3 iconos en estado inactivo hasta que el Overlay de game over sea visible.

---

### Requirement 2: Pérdida de vida al colisionar

**User Story:** Como Jugador, quiero que al chocar con un obstáculo pierda una vida en lugar de morir al instante, para tener más oportunidades de continuar la partida.

#### Acceptance Criteria

1. WHEN ocurre una Colisión y el Jugador tiene más de 1 vida, THE Sistema_de_Vidas SHALL decrementar el contador de vidas en 1 y activar el estado de Invulnerabilidad.
2. IF ocurre una Colisión y el Jugador tiene exactamente 1 vida, THEN THE Sistema_de_Vidas SHALL decrementar el contador de vidas a 0 y activar el estado de Game Over sin activar el estado de Invulnerabilidad.
3. WHILE el Fantasma está en estado de Invulnerabilidad, THE Sistema_de_Vidas SHALL ignorar nuevas Colisiones con Obstáculos.
4. THE Sistema_de_Vidas SHALL mantener el estado de Invulnerabilidad durante exactamente 2 000 ms a partir del instante en que se registró la Colisión que lo activó.
5. WHEN finaliza el período de Invulnerabilidad de 2 000 ms, THE Sistema_de_Vidas SHALL restablecer el Fantasma al estado normal de colisión.
6. WHILE el Fantasma está en estado de Invulnerabilidad, THE Juego SHALL aplicar un efecto visual de parpadeo al Fantasma alternando entre visible e invisible a una frecuencia de 10 Hz (intervalo de 100 ms por ciclo).

---

### Requirement 3: Fin de partida al agotar vidas

**User Story:** Como Jugador, quiero que la partida termine cuando pierda la última vida, para que el juego tenga un límite claro.

#### Acceptance Criteria

1. WHEN ocurre una Colisión y el Jugador tiene exactamente 1 vida, THE Sistema_de_Vidas SHALL decrementar el contador de vidas a 0 y activar la secuencia de fin de partida.
2. WHEN el contador de vidas llega a 0, THE Juego SHALL detener el loop principal dentro de los siguientes 100 ms y reproducir el efecto de partículas de muerte con una duración máxima de 600 ms.
3. WHEN el contador de vidas llega a 0, THE Juego SHALL mostrar el Overlay de game over exactamente 600 ms después de detener el loop principal.
4. IF el contador de vidas llega a 0 y el efecto de partículas de muerte no puede reproducirse, THEN THE Juego SHALL omitir el efecto y mostrar el Overlay de game over igualmente tras la pausa de 600 ms.
5. WHILE el Overlay de game over está visible, THE Juego SHALL mantener el loop principal detenido e ignorar cualquier entrada del Jugador que no sea reiniciar la partida.

---

### Requirement 4: Dificultad progresiva vinculada a los puntos

**User Story:** Como Jugador, quiero que el juego se vuelva progresivamente más difícil conforme acumulo puntos, para que la experiencia sea retadora a lo largo de la partida.

#### Acceptance Criteria

1. WHEN el Jugador alcanza un múltiplo de 100 Puntos, THE Sistema_de_Dificultad SHALL incrementar la Velocidad de los Obstáculos en 0,5 unidades respecto a la Velocidad base de 5, hasta un máximo de 15 unidades.
2. WHEN el Jugador alcanza un múltiplo de 100 Puntos, THE Sistema_de_Dificultad SHALL reducir el intervalo de generación de Obstáculos en 5 frames respecto al intervalo base de 80 frames, sin bajar de 40 frames como mínimo.
3. WHEN el Jugador alcanza un múltiplo de 100 Puntos, THE HUD SHALL actualizar el indicador de Nivel en el mismo frame.
4. THE Sistema_de_Dificultad SHALL calcular el Nivel como `1 + floor(Puntos / 100)`, evaluado sobre el total de Puntos acumulados en la partida actual, sin decrementar si los Puntos no disminuyen.

---

### Requirement 5: Persistencia del High Score en localStorage

**User Story:** Como Jugador, quiero que mi mejor puntaje se guarde entre sesiones, para poder ver mi récord histórico aunque cierre el navegador.

#### Acceptance Criteria

1. WHEN finaliza una partida y el puntaje obtenido supera el High Score almacenado, THE Juego SHALL guardar el nuevo puntaje como número entero en localStorage bajo la clave `kiroRunner_highScore`.
2. WHEN se inicia la aplicación, THE Juego SHALL leer el valor almacenado en `kiroRunner_highScore` e inicializar el High Score con ese valor entero.
3. IF el valor leído de localStorage no es un número entero válido mayor o igual a 0, o la clave `kiroRunner_highScore` no existe, THEN THE Juego SHALL inicializar el High Score en 0.
4. WHEN el High Score es actualizado en localStorage, THE HUD SHALL reflejar el nuevo valor en el indicador de High Score en un plazo máximo de 100 ms.
5. IF la operación de escritura en localStorage falla, THEN THE Juego SHALL mantener el High Score actualizado en memoria durante la sesión activa y mostrar un mensaje de error al usuario indicando que el puntaje no pudo guardarse de forma permanente.

---

### Requirement 6: Pantalla de Game Over con opción de reiniciar

**User Story:** Como Jugador, quiero ver una pantalla de game over que muestre mis resultados y me permita reiniciar fácilmente, para poder intentar superar mi récord sin recargar la página.

#### Acceptance Criteria

1. WHEN el contador de vidas llega a 0, THE Juego SHALL mostrar el Overlay con el título "JUEGO TERMINADO" en un plazo máximo de 100 ms tras registrarse la última vida perdida.
2. THE Overlay SHALL mostrar el puntaje de la partida finalizada y el High Score actual en el mismo elemento de puntaje final, con formato "Puntaje: [X] | Récord: [Y]" donde X e Y son enteros mayores o iguales a 0.
3. IF el puntaje de la partida finalizada supera el High Score previo al inicio de esa partida, THEN THE Overlay SHALL mostrar el texto "¡Nuevo récord!" junto al puntaje en el elemento de puntaje final.
4. THE Overlay SHALL presentar un botón "REINTENTAR" visible y activable mientras el Overlay esté visible, que al ser pulsado inicia una nueva partida con el contador de vidas en 3, el puntaje en 0 y el Overlay oculto antes de que el primer frame de la nueva partida se renderice.
5. IF el Jugador pulsa el botón "REINTENTAR" mientras el Overlay está visible, THEN THE Juego SHALL ocultar el Overlay y restablecer todos los elementos del estado inicial —vidas a 3, puntaje a 0, nivel al inicial— antes de renderizar el primer frame de la nueva partida.
