# Realismo primero

BUREAU trata la fotografía, el filme y el material físico como el lenguaje visual predeterminado. Una página debe parecer producida, no generada. La ilustración vectorial es una herramienta para logotipos, iconos y diagramas; no es el sustituto de una fotografía ausente.

## La jerarquía de medios

Elija la fuente más alta disponible que sirva al briefing. Nunca salte un nivel porque el siguiente sea más fácil.

| Nivel | Fuente | Usar cuando |
|---|---|---|
| 1 | Fotografía o filme original del proyecto | El tema existe y puede fotografiarse |
| 2 | Fotografía o metraje real licenciado | El tema existe, pero no puede fotografiarse |
| 3 | Producción contratada | El presupuesto cubre una jornada |
| 4 | Generación fotorrealista | No existe material real, y el tema no es evidencia |
| 5 | Renderizado físicamente plausible | Un producto o espacio debe mostrarse y no hay fotografía |

Una imagen sintética nunca es evidencia de un producto, persona, lugar o acontecimiento real. Si ningún nivel produce un material utilizable, entregue una composición tipográfica o de material. No rellene el hueco con un vector decorativo.

## El briefing fotográfico

Todo material visualmente relevante empieza con un briefing. Un briefing sin estos campos no es un briefing.

| Campo | Pregunta |
|---|---|
| Tema | ¿Qué está en el encuadre y qué debe probar? |
| Historia | ¿Qué ocurrió un segundo antes y después? |
| Composición | ¿Plano general, medio, detalle o aéreo? ¿Dónde está el sujeto? |
| Lente | Distancia focal, apertura, distancia, profundidad de campo |
| Luz | Fuente, dirección, dureza, temperatura de color, hora del día |
| Material | Superficies visibles y cómo reaccionan a la luz |
| Imperfección | Polvo, desgaste, asimetría, una arruga, un borde mojado |
| Exclusiones | Logotipos, rostros, marcas, artefactos, elementos a añadir en código |
| Uso | Proporciones, recortes, áreas seguras, zonas de texto superpuesto |
| Derechos | Propietario, licencia, territorio, duración, crédito |

Escriba lenguaje de fotografía, no de ambiente. "35 mm en f/2, luz de ventana a la izquierda de la cámara, 4300 K" vale más que "iluminación premium y atmosférica".

## Lo que se rechaza

- Ilustración vectorial como imagen dominante de una página.
- Dibujos planos, isométricos o geométricos usados como dirección de arte.
- Objetos 3D flotantes sin justificación física.
- Esferas cromadas, blobs, partículas abstractas, escultura digital genérica.
- Circuitos luminosos, cerebros digitales y hologramas como "IA".
- Degradados usados en lugar de una imagen.
- Decoración geométrica sin función informativa.
- Texturas plásticas, reflejos imposibles, materiales sintéticos.
- Movimiento que simula objetos imposibles.
- Artefactos visibles de generación: geometría fundida, luz inconsistente, profundidad de campo imposible.

Una imagen técnicamente perfecta que aún parece generada se rechaza.

## Lo que permanece en SVG

Logotipos, iconos funcionales, gráficos de datos, mapas técnicos, planos, indicadores de escala y primitivas de interfaz. Un diagrama no es una ilustración. La comprobación mecánica ignora SVG con `aria-hidden`, `role="img"` y `role="graphics-document"`, y solo se activa cuando la página no tiene ninguna fotografía ni filme.

## Vídeo cinematográfico

El filme se gana su lugar al mostrar duración, cambio, escala, proceso o interpretación. Búsquelo en la misma jerarquía que la fotografía.

| Comprobación | Fallo |
|---|---|
| Gramática de cámara | Movimiento a través de un sólido, morphing, zoom falso sobre una foto |
| Integridad temporal | La luz cambia de dirección dentro del plano, los objetos cambian de forma |
| Bucle | El último fotograma no encuentra el primero |
| Primera pintura | Filme en autoplay sin póster |
| Accesibilidad | Sin pausa, sin estado de movimiento reducido, audio en autoplay |
| Formato | Sin fallback H.264, sin dimensiones, filme de héroe por encima de 1,5 MB en móvil |

Guarde primer, medio y último fotogramas, una comparación de bucle y un registro de formato junto al filme. Un filme que no puede inspeccionarse fotograma a fotograma no está verificado.

## Validación

| Capa | Qué comprueba | Herramienta |
|---|---|---|
| Mecánica | Medio presente, póster, procedencia, licencia, hábitos de vector-héroe y degradado/blur | `scripts/realism.mjs`, `scripts/audit.mjs` |
| Humana | Anatomía, geometría, material, luz, óptica, perspectiva, continuidad, autenticidad | Capturas renderizadas y fotogramas al 100% |

Un informe mecánico limpio no es una aprobación de realismo. Una aprobación humana sin la comprobación mecánica tampoco lo es: la procedencia puede ser inventada.

## Procedencia

`.bureau/media/provenance.json` registra cada imagen y filme:

```json
{
  "media": [
    {
      "src": "media/atelier-hero.avif",
      "kind": "photograph",
      "owner": "Project owner",
      "source": "Commissioned shoot, 2026-10-12",
      "licence": "All rights, web use",
      "date": "2026-10-12",
      "synthetic": false
    }
  ]
}
```

La auditoría comprueba que cada `<img>` y `<video>` lleva `data-provenance` o aparece en este archivo. No juzga la licencia; una persona lo hace en la Puerta 8.

## Modos de revisión

El trabajo de realismo se juzga con el mismo circuito en tres profundidades.

| Modo | Puertas exigidas | Tribunal | Jurado | Veredicto máximo |
|---|---|---|---|---|
| **Fast** | 6 | Opcional | Ninguno | Pass |
| **Standard** | 10 | Obligatorio | Ninguno | Pass |
| **Signature** | 10 | Obligatorio, aislado | 10–15 evaluadores | Award |

Defina el modo con `review.mjs --mode fast|standard|signature`, o con `review.mode` en `.bureau/config.json`. Un proyecto Standard que quiera juicio de premio pasa a Signature y completa el jurado.

## Límites

Las comprobaciones mecánicas no ven. Detectan una fotografía ausente, un filme sin póster, una licencia no registrada, un héroe vectorial, un degradado en lugar de imagen y un orbe desenfocado. No dicen si la luz es correcta, si las manos son reales o si el producto podría existir. Eso es revisión humana sobre artefactos renderizados, registrada como evidencia, no afirmada.
