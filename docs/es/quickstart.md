# Primeros 15 minutos

Esta guía va de una instalación limpia a un proyecto con brief, tres comps, build, QA y el circuito abierto.

## 1. Requisitos

- Node.js 20 o superior.
- Git.
- Opcional: Playwright + Chromium para QA visual.
- Opcional: Figma Desktop/Dev Mode o Figma MCP para sincronizar variables.
- Opcional: ffmpeg e ImageMagick para medios.

```bash
node --version
git --version
node skill/scripts/doctor.mjs
```

El `doctor` dice qué está disponible y qué va a degradarse.

## 2. Instalar

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau

# previsualizar primero
bash installers/install.sh --agent all --scope user --dry-run

# instalar
bash installers/install.sh --agent all --scope user
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Reiniciar el agente. El comando `/bureau` debe aparecer.

## 3. Instalar dependencias del toolkit

```bash
npm install --no-bin-links
npx playwright install chromium
```

`--no-bin-links` solo es necesario en montajes que no admiten symlink (algunos shares SMB). En disco local, `npm install` basta.

Si el Chromium de Playwright no se descarga, el script usa automáticamente un Chromium del sistema. También se puede apuntar:

```bash
BUREAU_CHROMIUM=/usr/bin/chromium node skill/scripts/visual-audit.mjs ...
```

## 4. Crear un proyecto

```bash
node skill/scripts/new-project.mjs mi-sitio --template kinetic-editorial
cd mi-sitio
```

Plantillas:

| Plantilla | Uso |
|---|---|
| `kinetic-editorial` | Revista nocturna: Tschichold × Lubalin × Bass. Un índice ordenado por la hora de Lisboa en vivo |
| `product-surface` | Mesa de planificación: Tufte × Vignelli × Aicher. Sube la línea de agua; el orden de falla la sigue |
| `immersive-experience` | Instalación de luz: Moholy-Nagy × Cooper × Eames. Cambia la luz; shader, título y foco la siguen |
| `legal-practice` | Cámara de arbitraje: Sutnar × Rand × Ruder. Cada cláusula en dos registros: jurídico y llano |
| `architecture-studio` | Estudio de arquitectura: Ando × Mies × Scarpa. Una ranura de luz que se abre con el scroll |
| `restaurant-table` | Barra de degustación: Barragán × Wyman × J. Albers. Elige tus lugares en el arco de la barra |
| `private-bank` | Family office: Müller-Brockmann × Crouwel × Tufte. Interés compuesto con tus números, fórmula a la vista |
| `clinic-care` | Clínica respiratoria: Hara × Kare × Tanaka. Una guía de respiración que solo empieza cuando la pulsas |
| `developer-api` | API de geocodificación: Gerstner × Weingart × Greiman. Un playground que realmente acierta con erratas |
| `fashion-atelier` | Sastrería a medida: Brodovitch × A. Albers × B. Thompson. Un patrón trazado con tus medidas |
| `record-label` | Sello discográfico: Reid Miles × Saville × Brody. Portadas solo de tipo que tocan un boceto sintetizado |
| `museum-archive` | Archivo fotográfico: Bo Bardi × Lustig × Munari. Caballetes de vidrio con la ficha al dorso |
| `hardware-store` | Tienda de producto: Rams × Sottsass × Castiglioni. Configura la lámpara y mírala desarmada, con precio |

Cada plantilla es autónoma: HTML, CSS, JS, medios y tokens.

## 5. Completar la verdad

Abrir `BUREAU.md`. Sustituir todos los `TODO`:

- público específico y alternativa actual;
- oferta y prueba con fuente;
- lo que no se puede afirmar;
- modo (`PERSUADE`, `EXPERIENCE`, `OPERATE`, `READ`);
- presupuesto de performance;
- criterio de terminado.

Sin eso, la puerta G0 no pasa. No es burocracia: es lo que impide que el proyecto se convierta en decoración.

## 6. Tres direcciones

Pedir al agente:

```text
/bureau concept
```

O hacerlo manualmente:

1. Crear `.bureau/comps/`.
2. Producir tres comps en el mismo viewport (1440×900) con contenido real.
3. Nombrar cada dirección, escribir la tesis, el *signature move* y el riesgo.
4. Puntuar con la matriz de `skill/references/02-concept-engine.md`.
5. Registrar la decisión en `.bureau/comps/decision.md` y la mezcla en `.bureau/comps/blend.md`.

Sin tres direcciones, no hay decisión: solo el primer impulso.

## 7. Construir

```bash
# servir en local
python3 -m http.server 4173
# o
npx serve .
```

Construir el primer viewport como una tesis completa, no como un encabezado. Después, la página entera.

## 8. QA visual

```bash
node <bureau>/skill/scripts/visual-audit.mjs http://localhost:4173 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Abrir los screenshots. El JSON es evidencia; el ojo es el juez.

## 9. Abrir el circuito

Crear los archivos de score. Ejemplo para la puerta 0:

```json
{
  "gate": "g0-intake",
  "score": 4.5,
  "notes": "Brief completo; la prueba principal tiene fuente; non-goals explícitos.",
  "issues": [],
  "evidence": ["BUREAU.md", ".bureau/config.json"]
}
```

```bash
node <bureau>/skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node <bureau>/skill/scripts/review.mjs --status
```

El script rechaza puertas fuera de orden, evidencia ausente y scores por debajo de 3,5.

## 10. Tribunal

```bash
node <bureau>/skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
```

El Tribunal exige una declaración escrita. El resultado sale en `.bureau/review/scorecard.html`.

## Qué existe en el proyecto

```
BUREAU.md              verdad y alcance
DESIGN.md              contrato visual
MOTION.md              gramática de movimiento
.bureau/
  config.json          modo, budgets, viewports
  comps/               tres direcciones + decisión
  evidence/            auditorías, contraste, tipografía, copy
  qa/                  screenshots + report.json
  review/              estado, scores, scorecard
```

## Si algo falla

| Síntoma | Causa probable | Corrección |
|---|---|---|
| La skill no aparece | carpeta equivocada o host no reiniciado | comprobar `SKILL.md` en la raíz; reiniciar |
| `/bureau` desconocido | comando no instalado | reinstalar con el comando habilitado |
| `Cannot find package 'playwright'` | dependencia ausente | `npm install` |
| Chromium no abre | navegador no descargado | `npx playwright install chromium` |
| Figma sin herramientas | MCP no conectado | reconectar o exportar tokens |
| Evidencia rechazada | el archivo no existe | generar el artefacto; no inventar la ruta |
| Fuente equivocada | fallback/licencia | self-host y comparar estilos computados |

Próximo: [Arquitectura](architecture.md) · [Circuito](review-circuit.md) · [Comandos](commands.md).
