[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [日本語](README.ja.md)

# 🎃 Witch’s Potion Match — Jogo de combinar 3 de Halloween

**Um pouco de luar, um punhado de doces e mais uma cascata caprichada.** Prepare doze poções de Halloween trocando ingredientes ilustrados, completando receitas e acendendo velas. Este jogo de combinar três faz parte do Midnight Candy Club e foi criado para o [BlockBlasty](https://blockblasty.top/).

**[Jogar agora](https://halloween-potion-match.crazy3d.org/)** · [Coleção de Halloween](https://github.com/AshinTop/halloween-games) · [Guia de incorporação](EMBEDDING.md) · [Notas de design](DESIGN.md)

**Idiomas da documentação:** English, 简体中文, Español, Português (Brasil), 日本語. **Interface do jogo:** apenas inglês e chinês simplificado. Os demais idiomas do README não significam que os menus do jogo já foram traduzidos.

![Tabuleiro de Witch’s Potion Match com cinco ingredientes, metas da receita e velas](docs/images/gameplay.jpg)

## O que tem no caldeirão? 👻

- **12 receitas reproduzíveis** em um tabuleiro 6×6, com doce de abóbora, luar, frutas de morcego, folhas de hortelã e poeira estelar.
- Trocas entre vizinhos, combinações simultâneas, gravidade e cascatas. Todas as receitas têm uma conclusão verificada usando trocas comuns.
- Velas que tornam importante o lugar da combinação e um Moon Spark por receita para limpar uma cruz.
- Partículas coloridas, ingredientes voando até a receita, quedas coerentes e pequenos saltos ao aterrissar.
- Dicas úteis, seleção de receitas, reinícios ilimitados, recordes locais, estrelas, som opcional e movimento reduzido.

## Como preparar a poção

Confira as quantidades pedidas antes de jogar. Troque duas casas vizinhas para formar uma linha horizontal ou vertical com pelo menos três ingredientes iguais. Não vale trocar na diagonal ou atravessar a borda de uma linha. Uma troca sem combinação não gasta jogada.

Cada troca válida custa uma jogada, mesmo que gere várias cascatas. As combinações que surgem depois da queda também contam para a receita. A pontuação cresce conforme a profundidade da cascata, então uma troca pequena pode render uma boa surpresa.

Algumas receitas incluem velas. Elimine o ingrediente sobre a vela ou imediatamente acima, abaixo, à esquerda ou à direita dela para acendê-la. É preciso concluir **todas as quantidades e todas as velas**; completar apenas os ingredientes não basta.

Aperte **Moon Spark** e escolha uma casa. Sua linha e coluna serão eliminadas juntas: onze casas diferentes na primeira onda, seguidas das cascatas normais. Há uma faísca por receita e ela não consome jogada. Se o contador chegar a zero com a faísca disponível, você ainda tem essa última chance.

Não há contagem regressiva. Vencer com pelo menos oito jogadas sobrando rende três estrelas; com pelo menos três, duas; as demais vitórias rendem uma. A dica avalia trocas legais úteis para as metas atuais, mas não garante que qualquer decisão seguinte levará à vitória.

## Controles

| Ação | Mouse ou toque | Teclado |
|---|---|---|
| Escolher e trocar | Toque em duas vizinhas ou deslize | Setas movem o foco; Enter ou Espaço seleciona |
| Moon Spark | Botão e depois uma casa | Tab até o botão, ative e selecione |
| Dica | Botão Hint | H |
| Cancelar seleção | Toque novamente na casa escolhida | Escape |
| Reiniciar ou trocar receita | Botão ou seletor | Tab até o controle |

Espere a cascata terminar antes da próxima troca. Reiniciar e selecionar outra receita continuam disponíveis durante os efeitos: a sequência anterior é cancelada para não alterar o tabuleiro novo.

## Receitas, registros e compartilhamento

A mesma receita com as mesmas ações produz os mesmos resultados. Melhores pontuações, estrelas, idioma e som ficam no navegador. Recarregar reinicia a receita; partidas incompletas não são retomadas. O link da [receita 8](https://halloween-potion-match.crazy3d.org/#recipe=8) compartilha a disposição inicial, não um replay.

## Perguntas frequentes

**Preciso usar Moon Spark para vencer?** Não. As doze receitas têm verificações de conclusão por trocas comuns.

**Por que o tabuleiro se reorganizou?** Quando não resta uma troca legal, o jogo tenta embaralhar os ingredientes existentes. Uma distribuição muito desequilibrada pode exigir reposição. Metas, pontos e jogadas são preservados.

**E se um efeito parar?** A sequência visual conta com cancelamento e limite de espera. O resultado legal já calculado pode ser concluído sem o efeito, evitando que os controles fiquem travados.

## Imagens e vídeo

![Janela compacta com o tabuleiro de poções, jogadas restantes e Moon Spark](docs/images/mobile.jpg)

Interface real capturada em um iframe compacto no navegador. A imagem mostra a organização dos controles; não representa um teste de desempenho em um celular físico.

[Assista à apresentação de 24 segundos](https://halloween-potion-match.crazy3d.org/intro.html) · [Baixe o MP4 com legendas](docs/media/intro.mp4). O vídeo é silencioso e foi montado com capturas reais do jogo, não com uma partida gravada continuamente. As imagens registram a interface na data da captura e podem ser anteriores a melhorias visuais posteriores.

## Coloque o jogo no seu site

```html
<iframe src="https://halloween-potion-match.crazy3d.org/"
  title="Witch’s Potion Match"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

As janelas de referência são 1160×654 no computador, 390×650 / 390×794 em retrato e 844×340 em paisagem. O tabuleiro usa o espaço real do iframe; essas verificações não certificam todos os aparelhos físicos.

A versão on-line é publicada no Cloudflare a partir deste repositório do GitHub. Defina uma altura real para o iframe e reserve espaço para a barra do site principal. O site pode oferecer tela cheia. Consulte [EMBEDDING.md](EMBEDDING.md) para os detalhes.

## Executar e verificar localmente

```sh
python3 -m http.server 4173
```

Sirva a pasta raiz do repositório e abra [http://localhost:4173/](http://localhost:4173/). O jogo é estático, sem compilação ou instalação de dependências. Use HTTP(S), pois abrir por `file://` pode bloquear os módulos JavaScript. Os testes exigem Node.js.

```sh
npm test
```

Os **24 testes** cobrem regras, as doze receitas, gestos antigos, entradas simultâneas, trajetórias de queda, contadores por onda, cancelamento e recuperação de efeitos com falha ou linhas de animação que deixam de avançar.

O código do jogo não exige conta, API remota, SDK de anúncios nem CDN de arquivos externos. Os registros ficam no navegador, sem sincronização na nuvem. O Cloudflare pode adicionar scripts de hospedagem e registros de requisições. O áudio sintetizado opcional segue as permissões do navegador.

## Outras aventuras ao luar 🍬

- [Witch’s Candy Blocks](https://halloween-block-blast.crazy3d.org/) · [Código](https://github.com/AshinTop/halloween-block-blast) — Encaixe blocos de doces em um tabuleiro 8×8.
- [Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/) · [Código](https://github.com/AshinTop/halloween-pumpkin-shift) — Quebra-cabeças deslizantes com Moon Glides.
- [Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/) · [Código](https://github.com/AshinTop/halloween-tripeaks) — Paciência com valores vizinhos e Moon Bridges.
- [Moonlit Mirrors](https://halloween-mirror-hearts.crazy3d.org/) · [Código](https://github.com/AshinTop/halloween-mirror-hearts) — Leve dois fantasmas espelhados de volta para casa.

## Créditos e apoio

Criado para o **Midnight Candy Club de AshinTop**, com colaboração de IA orientada por pessoas em design, programação, documentação, testes e revisão. As ilustrações originais e os sons sintetizados foram feitos para este projeto. Veja as [notas de design](DESIGN.md).

Gostou desta pequena aventura? **[Deixe uma estrela para Witch’s Potion Match no GitHub](https://github.com/AshinTop/halloween-potion-match)** para guardar o projeto e acompanhar novidades. Ao relatar um problema, informe fase ou modo, navegador, tamanho da janela e passos para reproduzi-lo. Conheça a [coleção completa de Halloween](https://github.com/AshinTop/halloween-games).
