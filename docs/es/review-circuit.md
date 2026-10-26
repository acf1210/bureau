# El circuito de revisión

Diez puertas independientes y un Tribunal. El objetivo no es producir una nota bonita; es impedir que el bureau apruebe un trabajo por apego.

![Circuito de revisión](../assets/diagrams/circuit.svg)

## Cómo funciona la nota

Cada puerta vale de **0 a 5**, en pasos de 0,5. El peso convierte:

```
puntos de la puerta = (nota / 5) × peso
total               = suma de los puntos
```

| Veredicto | Total | Significado |
|---|---:|---|
| **Award Track** | ≥ 90 | nivel de presentación ante un jurado serio |
| **Pass** | 82–89 | se puede publicar |
| **Conditional** | 72–81 | se publica solo con P1 nombrados y fecha límite |
| **Fail** | < 72 | no se publica |

## Fallas duras

- Cualquier puerta por debajo de **3,5/5**.
- Cualquier **P0** no resuelto.
- Evidencia obligatoria ausente.
- Afirmación, logo, métrica, testimonio o premio inventado.
- Revisión hecha sobre código que cambió después (hash distinto).
- Veto del Tribunal.

Un promedio de 95 con un P0 de accesibilidad es **Fail**. Ese es el punto.

---

## Las puertas

| Puerta | Persona | Peso | Pregunta |
|---|---|---:|---|
| **G0 Intake** | The Producer | 5 | ¿El brief es verdadero, limitado y evidenciado? |
| **G1 Concept** | The Creative Director | 14 | ¿Existe una idea que solo esta marca podría tener? |
| **G2 Direction** | The Art Director | 15 | ¿El mundo visual parece inevitable y vivo? |
| **G3 Type & Color** | The Type Director | 12 | ¿La tipografía tiene voz y el color tiene narrativa? |
| **G4 Composition** | The Layout Architect | 12 | ¿La composición dirige la atención en todos los viewports? |
| **G5 Motion** | The Motion Director | 12 | ¿El movimiento está coreografiado, es útil y performático? |
| **G6 Engineering** | The Tech Lead | 10 | ¿Es rápido, resiliente y mantenible? |
| **G7 Access** | The Access Lead | 9 | ¿Todas las personas pueden usarlo, incluso con teclado? |
| **G8 Truth** | The Editor-in-Chief | 8 | ¿Cada palabra es verdadera y está libre de señales de IA? |
| **G9 Launch** | The Release Engineer | 3 | ¿Se puede publicar, encontrar, medir y recuperar? |

### G0 — Intake

**Criterios:** público, oferta, prueba con fuente, non-goals, métrica, constraints, inventario honesto.

**Fallas duras:** prueba inventada; público vago; alcance imposible sin trade-off registrado.

**Evidencia:** `BUREAU.md`, `.bureau/config.json`.

### G1 — Concept

**Criterios:** tres direcciones distintas; la elegida es poseíble, legible, generativa y construible; *signature move* nombrado y testeable.

**Fallas duras:** la idea serviría a cualquier competidor; no hay firma; depende de assets inexistentes.

**Evidencia:** tres comps en el mismo viewport + `decision.md`.

### G2 — Direction

**Criterios:** ground, voz, luz y movimiento cuentan una historia; toda sección pertenece; una firma; disciplina de accent; reconocible en miniatura gris.

**Fallas duras:** plantilla con logo cambiado; dos firmas compitiendo; sección de otro mundo.

**Evidencia:** `DESIGN.md`, espécimen tipográfico, hoja de color, viewports 1440/768/390.

### G3 — Type & Color

**Criterios:** display con voz; cuerpo cómodo; escala y medida compuestas; paleta con roles; contraste en todos los estados; dark/light diseñados.

**Fallas duras:** cuerpo < 4,5:1; degradado en el texto; > 3 familias sin razón; accent > 3 veces sobre el pliegue; acentos PT/ES que rompen la display.

**Evidencia:** tokens, informe de contraste, espécimen, hoja de color.

### G4 — Composition

**Criterios:** eje claro; ritmo de densidad; una ruptura de retícula; pliegue completo; 320 px recomponiendo; sin overflow.

**Fallas duras:** scroll horizontal en 320; CTA inalcanzable; contenido cortado al 200%; fijos superponiendo interacción.

**Evidencia:** screenshots 390/768/1440/1920 + full page + notas de zoom.

### G5 — Motion

**Criterios:** una entrada, una narrativa de scroll, una firma de interacción; carácter consistente; reduced motion diseñado; 60 fps; sin secuestro de scroll.

**Fallas duras:** reduced motion ignorado; scroll hijack; audio automático; P0 de performance; flash > 3 Hz.

**Evidencia:** `MOTION.md`, grabación corta, screenshot reduced, notas de FPS.

### G6 — Engineering

**Criterios:** budgets alcanzados; HTML semántico; consola limpia; degradación graciosa; sin JS el contenido estático sigue siendo legible; sin código muerto.

**Fallas duras:** LCP > 4 s o CLS > 0,25; error que rompe la interacción; página en blanco sin JS; licencia incompatible.

**Evidencia:** `report.json`, Lighthouse/RUM, consola, notas de build.

### G7 — Access

**Criterios:** cero P0/P1; teclado completo; foco visible; semántica; formularios útiles; medios con subtítulos; zoom 200/400%; prueba con lector de pantalla.

**Fallas duras:** cualquier barrera P0; label ausente; trampa de teclado; contraste sobre medios; sin subtítulos para el habla.

**Evidencia:** axe/visual audit, notas de teclado, reduced, tabla de contraste, lector de pantalla.

### G8 — Truth

**Criterios:** afirmaciones con fuente; voz específica; cero patrones P0; cero datos falsos; microcopy humana; la página suena como una persona con punto de vista.

**Fallas duras:** cualquier fabricación; lorem ipsum; patrón P0 que define la página; copy que distorsiona precio, disponibilidad o capacidad.

**Evidencia:** `audit.json`, `copy-review.md`, lista de fuentes, deck final.

### G9 — Launch

**Criterios:** metadata/OG; sitemap/robots; 404/500; analytics + consentimiento; monitoreo; rollback; locale routing; redirects; DNS/TLS.

**Fallas duras:** acción principal rota; secreto expuesto; consentimiento ausente; sin rollback.

**Evidencia:** launch checklist, preview OG, sitemap, plan de analytics, rollback.

---

## Evidencia obligatoria

El `review.mjs` verifica rutas reales. Ejemplo de score:

```json
{
  "gate": "g2-direction",
  "score": 4.5,
  "reviewer": "art-director",
  "notes": "El mundo se mantiene; la sección de precios se escapa a otro sistema de radio.",
  "strengths": ["Tipografía", "Objeto-firma", "Disciplina de color"],
  "issues": [
    {
      "id": "G2-01",
      "severity": "P1",
      "title": "Las tarjetas de precio usan radio de 24px y sombra genérica",
      "evidence": ".bureau/qa/screenshots/laptop-1440x900-full.png",
      "fix": "Usar la familia de 6px y la estructura de líneas de la sección de producto."
    }
  ],
  "evidence": [
    "DESIGN.md",
    ".bureau/qa/screenshots/laptop-1440x900-fold.png",
    ".bureau/evidence/type-specimen.png"
  ]
}
```

El script rechaza:

- puerta fuera de orden;
- `notes` con menos de 12 caracteres;
- severidad inválida;
- issue sin `fix`;
- issue con evidencia inexistente;
- evidencia obligatoria ausente;
- score fuera de 0–5.

---

## Estado y staleness

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

Cada puerta guarda un hash de fuente y documentos. Si el código cambió, la puerta queda `STALE` y el Tribunal falla. Para retomar: volver a ejecutar la puerta y todas las posteriores.

El estado queda en `.bureau/review/state.json`. El scorecard sale en `.md`, `.json` y `.html`.

---

## El Tribunal

El Tribunal lee todas las puertas, la evidencia y el brief. No reescribe notas. Pregunta:

1. ¿El trabajo cumple la promesa del `BUREAU.md`?
2. ¿La firma es memorable o solo está presente?
3. ¿Alguna puerta está pasando por encanto, no por evidencia?
4. ¿Firmaríamos esto en público?
5. ¿Cuál es la corrección más pequeña que sube un nivel?

**Veto:** genérico técnicamente aprobado; evidencia montada; P1 convertido en media; vergüenza pública.

Un veto exige motivo, corrección mínima y responsable. "No me gustó" no es un veto.

```json
{
  "decision": "conditional",
  "notes": "El trabajo cumple el brief, pero la firma todavía es un efecto, no una prueba del producto.",
  "fix": "Convertir la escena de scroll en una demostración del mecanismo real; mantener el resto.",
  "reviewer": "The Partner"
}
```

---

## Anti-juego

- No revisar de memoria.
- No ejecutar todas las puertas de una vez y llamarlo circuito.
- No reutilizar evidencia de otro build.
- No dejar que la misma persona sea directora y Tribunal sin un desafío escrito.
- No pasar porque llegó la fecha límite.
- No escribir "está genial" como nota.

El circuito solo vale si es capaz de decir **fail**.
