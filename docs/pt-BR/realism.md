# Realismo primeiro

O BUREAU trata fotografia, filme e material físico como a linguagem visual padrão. Uma página deve parecer produzida, não gerada. Ilustração vetorial é ferramenta para logotipos, ícones e diagramas; não é o substituto de uma fotografia ausente.

## A hierarquia de mídia

Escolha a fonte mais alta disponível que sirva ao briefing. Nunca pule um nível porque o próximo é mais fácil.

| Nível | Fonte | Usar quando |
|---|---|---|
| 1 | Fotografia ou filme original do projeto | O assunto existe e pode ser fotografado |
| 2 | Fotografia ou filmagem real licenciada | O assunto existe, mas não pode ser fotografado |
| 3 | Produção contratada | O orçamento cobre uma diária |
| 4 | Geração fotorrealista | Não existe material real, e o assunto não é evidência |
| 5 | Renderização fisicamente plausível | Um produto ou espaço precisa ser mostrado e não há fotografia |

Uma imagem sintética nunca é evidência de um produto, pessoa, lugar ou acontecimento real. Se nenhum nível produzir um material utilizável, entregue uma composição tipográfica ou de material. Não preencha a lacuna com um vetor decorativo.

## O briefing fotográfico

Todo material visualmente relevante começa com um briefing. Um briefing sem estes campos não é um briefing.

| Campo | Pergunta |
|---|---|
| Assunto | O que está no quadro, e o que ele precisa provar? |
| História | O que aconteceu um segundo antes e depois? |
| Composição | Plano geral, médio, detalhe ou aéreo? Onde está o assunto? |
| Lente | Distância focal, abertura, distância, profundidade de campo |
| Luz | Fonte, direção, dureza, temperatura de cor, hora do dia |
| Material | Superfícies visíveis e como reagem à luz |
| Imperfeição | Poeira, desgaste, assimetria, uma dobra, uma borda molhada |
| Exclusões | Logotipos, rostos, marcas, artefatos, elementos a adicionar em código |
| Uso | Proporções, cortes, áreas seguras, zonas de texto sobreposto |
| Direitos | Proprietário, licença, território, duração, crédito |

Escreva linguagem de fotografia, não de humor. "35 mm em f/2, luz de janela à esquerda da câmera, 4300 K" vale mais que "iluminação premium e atmosférica".

## O que é rejeitado

- Ilustração vetorial como imagem dominante de uma página.
- Desenhos flat, isométricos ou geométricos usados como direção de arte.
- Objetos 3D flutuantes sem justificativa física.
- Esferas cromadas, blobs, partículas abstratas, escultura digital genérica.
- Circuitos luminosos, cérebros digitais e hologramas como "IA".
- Gradientes usados no lugar de uma imagem.
- Decoração geométrica sem função informacional.
- Texturas plásticas, reflexos impossíveis, materiais sintéticos.
- Movimento que simula objetos impossíveis.
- Artefatos visíveis de geração: geometria fundida, luz inconsistente, profundidade de campo impossível.

Uma imagem tecnicamente perfeita que ainda parece gerada é reprovada.

## O que permanece em SVG

Logotipos, ícones funcionais, gráficos de dados, mapas técnicos, plantas, indicadores de escala e primitivas de interface. Um diagrama não é uma ilustração. A verificação mecânica ignora SVGs com `aria-hidden`, `role="img"` e `role="graphics-document"`, e só dispara quando a página não tem nenhuma fotografia ou filme.

## Vídeo cinematográfico

O filme ganha seu lugar ao mostrar duração, mudança, escala, processo ou performance. Busque na mesma hierarquia da fotografia.

| Verificação | Falha |
|---|---|
| Gramática de câmera | Movimento através de um sólido, morphing, zoom falso sobre uma foto |
| Integridade temporal | A luz muda de direção dentro do plano, objetos mudam de forma |
| Loop | O último quadro não encontra o primeiro |
| Primeira pintura | Filme em autoplay sem pôster |
| Acessibilidade | Sem pausa, sem estado de movimento reduzido, áudio em autoplay |
| Formato | Sem fallback H.264, sem dimensões, filme de herói acima de 1,5 MB no celular |

Guarde primeiro, meio e último quadros, uma comparação de loop e um registro de formato ao lado do filme. Um filme que não pode ser inspecionado quadro a quadro não está verificado.

## Validação

| Camada | O que verifica | Ferramenta |
|---|---|---|
| Mecânica | Mídia presente, pôster, proveniência, licença, hábitos de vetor-herói e gradiente/blur | `scripts/realism.mjs`, `scripts/audit.mjs` |
| Humana | Anatomia, geometria, material, luz, óptica, perspectiva, continuidade, autenticidade | Capturas renderizadas e quadros de filme em 100% |

Um relatório mecânico limpo não é aprovação de realismo. Uma aprovação humana sem a verificação mecânica também não é: a proveniência pode ser inventada.

## Proveniência

`.bureau/media/provenance.json` registra cada imagem e filme:

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

A auditoria verifica que cada `<img>` e `<video>` carrega `data-provenance` ou aparece neste arquivo. Ela não julga a licença; uma pessoa faz isso no Portão 8.

## Modos de revisão

O trabalho de realismo é julgado pelo mesmo circuito em três profundidades.

| Modo | Portões exigidos | Tribunal | Júri | Veredito máximo |
|---|---|---|---|---|
| **Fast** | 6 | Opcional | Nenhum | Pass |
| **Standard** | 10 | Obrigatório | Nenhum | Pass |
| **Signature** | 10 | Obrigatório, isolado | 10–15 avaliadores | Award |

Defina o modo com `review.mjs --mode fast|standard|signature`, ou com `review.mode` em `.bureau/config.json`. Um projeto Standard que quiser julgamento de prêmio passa para Signature e completa o júri.

## Limites

As verificações mecânicas não enxergam. Elas pegam uma fotografia ausente, um filme sem pôster, uma licença não registrada, um herói vetorial, um gradiente no lugar de imagem e um orbe desfocado. Elas não dizem se a luz está certa, se as mãos são reais ou se o produto poderia existir. Isso é revisão humana sobre artefatos renderizados, registrada como evidência, não afirmada.
