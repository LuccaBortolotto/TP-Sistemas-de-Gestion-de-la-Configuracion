Trabajo Práctico: Gestión de la Configuración del Software
Este repositorio contiene la configuración, código y documentación para el control de versiones y gestión de cambios del proyecto.

# Respuestas Inciso 8:
##7)b) ¿Cómo hacemos para no subir cambios de configuraciones locales?

Para evitar versionar archivos de entorno local, credenciales, artefactos generados o configuraciones dependientes del IDE, se utiliza el archivo especial .gitignore ubicado en la raíz del repositorio.

Mecanismo: Git lee este archivo antes de realizar el seguimiento (tracking) de nuevos ficheros. Cualquier patrón o ruta declarada allí será omitida por los comandos git status y git add.
Configuración aplicada: Se agregaron al .gitignore patrones específicos para entornos de desarrollo y sistemas operativos:
# Configuraciones locales de editores e IDEs
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj

# Variables de entorno y secretos locales
.env
.env.local

# Dependencias y compilados (según stack)
node_modules/
dist/
build/
*.log

# Archivos temporales de SO
.DS_Store
Thumbs.db

##7)e) Llevar al entorno productivo Release 1. ¿Cómo lo hace siguiendo Gitflow?

Siguiendo la metodología Gitflow, la estabilización y publicación de una entrega hacia producción sigue un flujo formal de integración y etiquetado:
* 1) Creación de la rama de release: Se desprende desde develop cuando las funcionalidades planificadas están listas y estables:
git switch develop
git pull origin develop
git switch -c release/1.0.0

* 2) Ajustes finales de release: En esta rama únicamente se resuelven detalles de documentación, números de versión y correcciones menores de último momento (no se añaden nuevas funcionalidades).

* 3) Fusión hacia producción (main): Se abre un Pull Request desde release/1.0.0 hacia main. Una vez aprobado y fusionado, se descarga main localmente y se genera una etiqueta (tag) anotada bajo Semantic Versioning para marcar el hito productivo:
git switch main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0: version inicial productiva"
git push origin v1.0.0

* 4) Retroalimentación a develop: Para que los ajustes realizados durante la fase de release persistan en el desarrollo continuo, la rama de release (o main) se fusiona nuevamente hacia develop:
git switch develop
git merge release/1.0.0
git push origin develop

* 5) Limpieza: Se elimina la rama release/1.0.0 tanto en local como en el remoto.

##7)f) Se encontró un error en la versión productiva, ¿Cómo lo corregimos? Realizar una nueva rama para corregir este problema siguiendo GitFlow.

* 1) En Gitflow, los errores detectados directamente en el entorno productivo se tratan como emergencias críticas mediante ramas de tipo hotfix, evitando interrumpir el trabajo en curso de la rama develop.) Creación de la rama de hotfix desde main:
git switch main
git pull origin main
git switch -c hotfix/error-colision

* 2) Corrección del defecto: Se aplica el parche puntual sobre el código fuente, se prueba exhaustivamente y se comitea el cambio:
git add script.js
git commit -m "fix(colision): corregir calculo de margen AABB y vida del fantasma"

* 3) Cierre e integración en ambos entornos:
Hacia main: Se abre un Pull Request desde hotfix/error-colision hacia main. Al fusionarse, se genera un nuevo tag con incremento de parche (ej. v1.0.1):
git switch main
git pull origin main
git tag -a v1.0.1 -m "Hotfix v1.0.1: correccion de colision en produccion"
git push origin v1.0.1

Hacia develop: Es obligatorio propagar la corrección a la línea de desarrollo activo para evitar que el fallo reaparezca en la siguiente versión:
git switch develop
git merge hotfix/error-colision
git push origin develop

* 4) Eliminación de la rama: Se borra hotfix/error-colision.

##7)j) Llevar los cambios de la nueva funcionalidad a producción. ¿Cómo lo hace siguiendo Gitflow?
Una nueva funcionalidad no viaja directamente a producción; debe cumplir el ciclo completo de integración y estabilización previsto por el framework:

* 1) Integración de la feature en develop:
Habiendo concluido el desarrollo de la funcionalidad (y tras aplicar la reversión solicitada mediante git revert <hash-commit-B>), se sube la rama y se abre un Pull Request hacia develop:
git push origin feature/nueva-funcionalidad

Se revisa el código, se aprueba y se mergea hacia develop.

* 2) Apertura de una nueva rama de release:
Cuando develop contiene las características planificadas para el siguiente ciclo productivo, se crea una rama de release (por ejemplo, para la versión menor 1.1.0 o parche 1.0.1 según corresponda):
git switch develop
git pull origin develop
git switch -c release/1.1.0

* 3) Promoción a producción (main): Se abre el Pull Request de release/1.1.0 con destino a main. 
Una vez integrado en main, se etiqueta formalmente la nueva versión productiva:
git switch main
git pull origin main
git tag -a v1.1.0 -m "Release 1.1.0: incorporacion de nueva funcionalidad"
git push origin v1.1.0

* 4) Sincronización final con develop: Se mergea la release hacia develop para asegurar paridad absoluta en ambos historiales y se elimina la rama temporal de release.

#Respuestas Inciso 8:

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
