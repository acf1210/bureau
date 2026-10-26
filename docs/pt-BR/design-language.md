# Linguagem visual

BUREAU não tem um estilo fixo. Tem um **método** para construir um estilo que pertença ao assunto.

## 1. Pantone como âncora, não como paleta

Pantone é uma linguagem padronizada de cor para impressão, têxtil e marca. Não é um espaço de cor CSS.

- **PMS / Solid** — tintas de impressão.
- **TCX / TPG** — têxtil.
- **Pantone Connect** — bibliotecas licenciadas.
- **Hex/sRGB** — aproximações de tela.

Use Pantone para **nomear e ancorar** a paleta no brief; implemente em OKLCH e verifique contraste. Nunca afirme que uma cor de tela *é* Pantone. Para impressão, use bibliotecas licenciadas e prova física.

### Color of the Year — referência

| Ano | Código | Nome | Hex aprox. | Caráter |
|---|---|---|---|---|
| 2026 | 11-4201 | Cloud Dancer | `#F0EEE9` | off-white arejado, silêncio |
| 2025 | 17-1230 | Mocha Mousse | `#A47864` | marrom comestível, conforto |
| 2024 | 13-1023 | Peach Fuzz | `#FFBE98` | pêssego tátil |
| 2023 | 18-1750 | Viva Magenta | `#BE3455` | carmim assertivo |
| 2022 | 17-3938 | Very Peri | `#6667AB` | periwinkle otimista |
| 2021 | 17-5104 | Ultimate Gray | `#939597` | cinza estável |
| 2021 | 13-0647 | Illuminating | `#F5DF4D` | amarelo solar |
| 2020 | 19-4052 | Classic Blue | `#0F4C81` | azul confiável |
| 2019 | 16-1546 | Living Coral | `#FF6F61` | coral social |
| 2018 | 18-3838 | Ultra Violet | `#5F4B8B` | violeta cósmico |
| 2017 | 15-0343 | Greenery | `#88B04B` | verde botânico |
| 2016 | 13-1520 / 15-3919 | Rose Quartz / Serenity | `#F7CAC9` / `#92A8D1` | calma suave |

Tabela completa (2000–2026) em `skill/references/05-color-pantone.md`. Valores são aproximações do BUREAU, não conversões oficiais.

### Direção 2026: Cloud Dancer como ground

```css
:root{
  --ground: oklch(95.2% 0.008 85);
  --surface: oklch(97.5% 0.006 85);
  --ink: oklch(18% 0.012 70);
  --muted: oklch(52% 0.014 70);
  --line: oklch(30% 0.01 70 / .14);
  --accent: oklch(56% 0.19 32);      /* terracota */
  --accent-ink: oklch(97% 0.01 80);
  --signal: oklch(78% 0.16 92);
}
```

Cloud Dancer não é "branco". É material: papel, gesso, linho, luz difusa. Use com uma seção escura dura e um accent saturado para evitar a monotonia.

---

## 2. Cor como sistema

- **60/30/10** com intenção: ground, ink/superfícies, accent/signal.
- **5–7 papéis semânticos**, não 30 hex soltos.
- **OKLCH** para escala perceptualmente uniforme.
- **Contraste** AA em todos os estados.
- **Dark mode** recalculado, não invertido.
- **Gradiente** só quando representa luz, calor, profundidade ou material. Nunca em texto.
- **Dados** com paleta colorblind-safe e rótulos; cor nunca sozinha.

Paletas de partida:

| Nome | Ground | Ink | Accent | Uso |
|---|---|---|---|---|
| Quiet Precision | `#F0EEE9` | `#161616` | `#C8402A` | editorial, cultura |
| Night Archive | `#0C0D0C` | `#EDE7DA` | `#B7791F` | arquivo, cinema |
| Cold Signal | `#E7E9E6` | `#1B2226` | `#C6F04A` | engenharia, dados |
| Warm Instrument | `#E9DFD0` | `#2A1F1A` | `#B4553A` | produto, artesanato |
| Botanical Modern | `#10251C` | `#E8E5D8` | `#89A85C` | ciência, clima |
| Chrome Bloom | `#111214` | `#D9D9D6` | `#B98BC4` | moda, música |

---

## 3. Tipografia

- Máximo 2 famílias + 1 mono.
- Display com voz; corpo com legibilidade.
- Escala fluida com `clamp`, testada em 320–2560.
- Display: leading 0.9–0.98, tracking -0.02 a -0.04em.
- Corpo: 55–75ch, leading 1.55–1.7.
- Números tabulares em dados.
- Acentos PT/ES testados: ã, ç, é, ñ, ü.
- Fontes self-hosted, subset, `font-display: swap`.

Pares que funcionam:

1. Bodoni Moda + Archivo + JetBrains Mono
2. Instrument Serif + Libre Franklin + IBM Plex Mono
3. Fraunces + Public Sans + Space Mono
4. Newsreader + Archivo + IBM Plex Mono
5. Syne + Archivo + Space Mono
6. Cormorant Garamond + Work Sans + JetBrains Mono

Evite Inter + Space Grotesk como identidade inteira.

---

## 4. Motion

Um caráter por projeto:

| Caráter | Tempo | Easing | Uso |
|---|---|---|---|
| Preciso | 120–220 ms | `.2 .7 .2 1` | produto, dados |
| Viscoso | 600–1200 ms | `.22 1 .36 1` | editorial, luxo |
| Mecânico | stepped/linear | linear | instrumento, terminal |
| Orgânico | irregular | noise | natureza, saúde |
| Cinematográfico | 800–1600 ms | in-out longo | experiência |

Regras:

- uma sequência de entrada;
- uma narrativa de scroll;
- uma assinatura de interação;
- `transform` e `opacity`;
- reduced motion desenhado;
- 60 fps com CPU 4×;
- nada de scroll hijack.

---

## 5. Prova tecnológica

Escolha **uma** por projeto:

| Prova | Quando | Custo |
|---|---|---|
| Scroll-driven choreography | narrativa, produto | baixo |
| WebGL/shader | atmosfera, generativo, espacial | médio–alto |
| 3D real | produto, configurador | alto |
| Vídeo como material | moda, lugar, filme | médio |
| Identidade generativa | marca variável | médio |
| Dados ao vivo | fintech, clima, esporte | médio |
| View Transitions | fluxo multi-página | baixo |
| Instrumento interativo | áudio, configuração | médio |

A prova serve ao argumento. Shader em padaria não é ambição; é confusão.

---

## 6. Assinatura

Um *signature move* é a única coisa que alguém descreveria a um amigo. Precisa ser:

- legível sem explicação;
- possuível pela marca;
- repetível em outros viewports;
- performático;
- acessível.

Exemplos de **tipo**, nunca de cópia:

- produto que se monta no scroll com peças rotuladas;
- hero tipográfico que se comporta como uma impressora;
- dados ao vivo como escultura;
- vídeo que vira UI no momento da história;
- navegação como mapa do argumento;
- sistema de cor que muda com a hora, dentro de uma faixa desenhada.

---

## 7. Biblioteca de referência

Use para calibrar, não para montar:

- **land-book.com** — estrutura de landing;
- **minimal.gallery** — contenção;
- **godly.website** — ambição;
- **mobbin.com** — fluxos reais de app;
- **refero.design** — padrões de produto;
- **60fps.design** — timing de motion;
- **vibrant.design** — UI e interação;
- **recent.design** — radar diário;
- **backgrounds.supply** — material;
- **footer.design** — fechamento;
- **promptmotionsite.com** — vocabulário de motion;
- **april-zhu.com/colorfigures** — objetos isométricos com corte;
- **Font Awesome** — fallback de ícones;
- **Impeccable** — detecção e disciplina de artefatos.

Protocolo de extração: impressão → estrutura → ofício → comportamento → princípio transferível. Nunca abra uma referência e code imediatamente.

Lista completa e ética em `skill/references/20-reference-library.md`.
