# Trabajo Práctico: Gestión de la Configuración del Software

Este repositorio contiene la configuración, código y documentación para el control de versiones y gestión de cambios del proyecto.

---

## 1. ¿Cómo documentar con Git?

Git permite registrar el ciclo de vida del software mediante varias capas de documentación:
* **Mensajes de commit estructurados:** Describen el motivo de cada cambio puntual, facilitando auditorías históricas con `git log`.
* **Archivos Markdown integrados:** Archivos como `README.md`, `CONTRIBUTING.md` y `CHANGELOG.md` centralizan la inducción de nuevos desarrolladores y el registro de cambios.
* **Etiquetas y Releases (`git tag`):** Documentan formalmente el estado de versiones estables (ej. `v1.0.0`) junto con sus notas de versión.
* **Trazabilidad (`git blame`):** Permite inspeccionar en qué commit y por qué motivo se introdujo cada línea de código.

---

## 2. Contenido esencial de este README

Todo proyecto versionado debe incluir en su documento principal:
1. **Descripción del proyecto:** Propósito y alcance del sistema.
2. **Requisitos previos:** Dependencias, runtimes y herramientas necesarias para su compilación.
3. **Guía de instalación y ejecución:** Comandos paso a paso para levantar el entorno de desarrollo local.
4. **Estrategia de ramas:** Explicación del modelo de ramas utilizado (ej. `main` para producción, `develop` para integración y `feature/` para desarrollo).

---

## 3. Gestión de contribuciones externas y Pull Requests (PR)

Cuando un colaborador externo o miembro del equipo propone cambios, se debe asegurar la trazabilidad, calidad y bajo riesgo para la rama base.

### Datos solicitados al autor del PR (Racionales)
* **Descripción y justificación:** Explicar qué se modificó y por qué.  
  * *Racional:* Permite al revisor entender la intención del autor sin tener que deducirla leyendo línea por línea de código.
* **Tipo de cambio:** Clasificación (Bugfix, Feature, Refactor, Documentación).  
  * *Racional:* Ayuda a priorizar la revisión y definir el impacto en el versionado semántico.
* **Vinculación con Issue:** Enlace al ticket o requerimiento (`Fixes #ID`).  
  * *Racional:* Mantiene la trazabilidad entre el gestor de requerimientos y el código fuente.
* **Guía de pruebas (*Testing*):** Pasos detallados para reproducir y verificar el cambio.  
  * *Racional:* Asegura que el cambio fue probado y ahorra tiempo al revisor al validar el funcionamiento.
* **Checklist de validación:** Confirmación de que el código compila, cumple con estándares de estilo y no rompe tests existentes.  
  * *Racional:* Traslada la responsabilidad de calidad previa al autor antes de demandar tiempo del equipo revisor.

### Herramientas que provee GitHub
1. **Pull Request Templates (`.github/PULL_REQUEST_TEMPLATE.md`):** Genera automáticamente una plantilla con preguntas y checkboxes cada vez que se abre un PR.
2. **Branch Protection Rules:** Impide fusionar código directamente a ramas principales sin contar con aprobaciones previas y validaciones de CI en verde.
3. **GitHub Actions:** Ejecuta integración continua para comprobar automáticamente que el código compile y pase los tests unitarios.
4. **CODEOWNERS:** Define revisores obligatorios según las áreas o módulos que fueron modificados.
EOFcat << 'EOF' > README.md
# Trabajo Práctico: Gestión de la Configuración del Software

Este repositorio contiene la configuración, código y documentación para el control de versiones y gestión de cambios del proyecto.

---

## 1. ¿Cómo documentar con Git?

Git permite registrar el ciclo de vida del software mediante varias capas de documentación:
* **Mensajes de commit estructurados:** Describen el motivo de cada cambio puntual, facilitando auditorías históricas con `git log`.
* **Archivos Markdown integrados:** Archivos como `README.md`, `CONTRIBUTING.md` y `CHANGELOG.md` centralizan la inducción de nuevos desarrolladores y el registro de cambios.
* **Etiquetas y Releases (`git tag`):** Documentan formalmente el estado de versiones estables (ej. `v1.0.0`) junto con sus notas de versión.
* **Trazabilidad (`git blame`):** Permite inspeccionar en qué commit y por qué motivo se introdujo cada línea de código.

---

## 2. Contenido esencial de este README

Todo proyecto versionado debe incluir en su documento principal:
1. **Descripción del proyecto:** Propósito y alcance del sistema.
2. **Requisitos previos:** Dependencias, runtimes y herramientas necesarias para su compilación.
3. **Guía de instalación y ejecución:** Comandos paso a paso para levantar el entorno de desarrollo local.
4. **Estrategia de ramas:** Explicación del modelo de ramas utilizado (ej. `main` para producción, `develop` para integración y `feature/` para desarrollo).

---

## 3. Gestión de contribuciones externas y Pull Requests (PR)

Cuando un colaborador externo o miembro del equipo propone cambios, se debe asegurar la trazabilidad, calidad y bajo riesgo para la rama base.

### Datos solicitados al autor del PR (Racionales)
* **Descripción y justificación:** Explicar qué se modificó y por qué.  
  * *Racional:* Permite al revisor entender la intención del autor sin tener que deducirla leyendo línea por línea de código.
* **Tipo de cambio:** Clasificación (Bugfix, Feature, Refactor, Documentación).  
  * *Racional:* Ayuda a priorizar la revisión y definir el impacto en el versionado semántico.
* **Vinculación con Issue:** Enlace al ticket o requerimiento (`Fixes #ID`).  
  * *Racional:* Mantiene la trazabilidad entre el gestor de requerimientos y el código fuente.
* **Guía de pruebas (*Testing*):** Pasos detallados para reproducir y verificar el cambio.  
  * *Racional:* Asegura que el cambio fue probado y ahorra tiempo al revisor al validar el funcionamiento.
* **Checklist de validación:** Confirmación de que el código compila, cumple con estándares de estilo y no rompe tests existentes.  
  * *Racional:* Traslada la responsabilidad de calidad previa al autor antes de demandar tiempo del equipo revisor.

### Herramientas que provee GitHub
1. **Pull Request Templates (`.github/PULL_REQUEST_TEMPLATE.md`):** Genera automáticamente una plantilla con preguntas y checkboxes cada vez que se abre un PR.
2. **Branch Protection Rules:** Impide fusionar código directamente a ramas principales sin contar con aprobaciones previas y validaciones de CI en verde.
3. **GitHub Actions:** Ejecuta integración continua para comprobar automáticamente que el código compile y pase los tests unitarios.
4. **CODEOWNERS:** Define revisores obligatorios según las áreas o módulos que fueron modificados.
