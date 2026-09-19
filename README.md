# Trabajo Práctico 1: Sistemas de Gestión de la Configuración - Release 1.0.0

## Propósito
Este repositorio corresponde a un trabajo práctico universitario de la materia **Sistemas de Gestión de la Configuración**. Incluye un minijuego web tipo *endless runner* llamado **Kiro Ghost Runner** junto con toda la infraestructura de herramientas, convenciones y especificaciones orientadas a flujos de trabajo con IA.

---

## Estructura del Repositorio
```text
├── README.md             → Documentación oficial del proyecto y respuestas del TP
├── ejemplo.js            → Ejemplo de función sumar() con JSDoc y try/catch
├── .github/
│   ├── CODEOWNERS        → Asignación de dueños de código (@LuccaBortolotto, @nacho-mazzoni, @S11RD)
│   └── workflows/ci.yml  → CI mínima ejecutada en push/PR a main y develop
├── kiro-runner/          → Directorio del juego web
│   ├── index.html        → HTML principal con HUD, canvas (800×240) y overlay de inicio/game over
│   ├── styles.css        → Estilos visuales (tema morado/lila: #7540b0 / #c2a9df, tipografía Roboto)
│   └── script.js         → Lógica completa del juego (677 líneas)
└── .kiro/                → Configuración y especificaciones para asistencia de IA
    ├── hooks/            → Validaciones automáticas (ej. jsdoc-checker.json)
    ├── steering/         → Reglas de estilo y convenciones del proyecto
    └── specs/            → Especificaciones funcionales planificadas