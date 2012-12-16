{
		"tutorial": {
            "basics": {
                "1": "Básico: Regras e Dicas",
                "2": "Em Phylo, seu objetivo é mover seqüências de blocos horizontalmente de forma a criar um número máximo de colunas de cores semelhantes. Cada par de quadrados de uma mesma cor (concordância) numa coluna vale um bônus.",
                "3": "Entretanto, as seqüências não são idênticas. Logo, cores diferentes numa coluna (discordância) e lacunas são inevitáveis, e você é penalizado por elas. Seu desafio é encontrar o alinhamento que dá a maior pontuação na soma de bônus (positivos) e penalidades (negativas).",
                "4": "Bônus e penalidades para concordâncias e discordâncias são pequenos. Mas o custo para lacunas é grande! Normalmente, é preferível ter uma lacuna grande em vez de várias pequenas. Tente primeiro minimizar o número de lacunas.",
                "5": "Você notou a árvore à esquerda? Ela diz que seqüências devem ser alinhadas prioritáriamente. Isto é importante quando você tiver que escolher entre que pares de linhas alinhar uma concordância. É mais importante criar alinhamentos próximos entre seqüências de um mesmo grupo filogênico do que tentar aumentar a similaridade entre classificações mais afastadas.",
                "6": "Para passar as fases de um nível, você precisa atingir a pontuação mínima, ou seja, o valor dado pelo computador. Quando sua pontuação é maior ou igual a este mínimo, a estrela dourada aparece no canto inferior direito. Clique nela para iniciar a fase seguinte. Quando todas as seqüências estiver na tela, tente atingir a pontuação mais alta possível e envie seu resultado clicando na estrela novamente!",
                "7": "Informações básicas estão disponíveis no canto inferior direito da janela. Lá você encontra sua pontuação atual, a pontuação mínima (i.e. a pontuação do computador que você precisa superar), seu progresso no jogo (i.e. fases) e a melhor pontuação que obteve até agora. Você pode a qualquer momento retornar à melhor solução que já encontrou, clicando na roda multicolorida. Acima, você vê também o relógio e o tempo restante para completar o puzzle."
            },
            "scoring": {
            		"1": "Avançado: Pontuação",
            		"2": "Cada nó da árvore filogenética contém uma sequência ancestral. Ancestrais são computadas automaticamente e representam um consenso de todas as sequências derivadas delas. Coloque o cursor sobre qualquer nó da árvore para exibir a sequência correspondente na parte de baixo da grade. Por default, nós exibimos a ancestral da raiz da árvore.",
            		"3": "A pontuação do alinhamento é uma estimativa da similaridade entre a sequência e a de sua ancestral. Concordâncias aumentam sua pontuação em +1 ponto, discordâncias penalizam-no em -1 ponto. Abrir uma lacuna incorre numa penalidade de -4 pontos, e cada espaço extra na lacuna custa outro -1 ponto negativo. No exemplo, a pontuação do alinhamento da sequência do morcego com sua ancestral é -5 (4 concordâncias, 4 discordâncias, 1 lacuna de extensão 1).",
            		"4": "Sua pontuação é a soma das pontuações dos alinhamentos de cada sequência com sua ancestral imediata. No exemplo, a pontuação é a soma das comparações entre a ancestral de B com humano e chimpanzé, da ancestral C com cão e morcego, a da ancestral A com B e C."
            },
            "example": {
		"1": "Mão na massa: Um exemplo.",
		"2": "Você começa com duas sequências (humano e chimpanzé). Arraste tudo para a esquerda e observe a ancestral. Alinhar esta ancestral com suas duas sequências resulta em 13 concordâncias para a primeira sequência (humano), e 5 concordâncias, 1 discordância, e 1 lacuna de extensão 7 para a segunda sequência (chimpanzé), levando a um total de 18 × (+1) + 1 × (‐1) + (‐5 + 6 × (‐1)) = 6. Você passa do mínimo. Clique na estrela e passe para a próxima fase!",
		"3": "Duas novas sequências (cão e morcego) aparecem. Novamente, arraste-as para a esquerda. Sua pontuação é 4. 18 concordâncias e 1 lacuna de extensão 1 entre a sequência do cão e sua ancestral, e 5 concordâncias e 14 discordâncias entre a sequência do morcego e a mesma ancestral, (logo um total de 23 × (+1) + 14 × (‐1) + (‐5) = 4). Você pode melhorar isso. Como?",
            		"4": "Traga a sequência de baixo uma casa para a esquerda a partir do sétimo bloco. Você cria uma nova lacuna mas também cria muitas novas concordâncias. E viu só? A ancestral mudou. Você agora tem 18 concordâncias e 1 lacuna de extensão 2 para a sequência do cão, e 12 concordâncias, 7 discordâncias e 1 lacuna de extensão 1 para a sequência do morcego. Sua pontuação é 30 × (+1) + 7 × (‐1) + ( 2 × ‐5 + 1 × (-1)) = 12. Passe para a próxima fase.",
            		"5": "Agora, você precisa montar seus alinhamentos anteriores. Sua pontuação inicial é 14. Não vence o mínimo (19)… Intuitivamente, queremos chegar a uma alinhamento melhor entre o primeiro bloco (as duas sequências de cima) e o segundo bloco (as duas de baixo). Como?",
            		"6": "Mova o primeiro bloco 4 casas para a direita. Isto cria duas colunas totalmente verdes. Com isso a similaridade entre sequência humana e as do cão e do morcego aumenta. Sua pontuação total aumenta para 26. Como este número é calculado?",
            		"7": "Vejamos a ancestral do humano e do chimpanzé. A pontuação do seu alinhamento com a sequência humana é 11 (12 concordâncias e 1 discordância), e -5 com a sequência do chimpanzé (6 concordâncias e 1 lacuna de extensão 7). Logo a pontuação desta ancestral é 11 + (-5) = 6.",
            		"8": "Façamos o mesmo para a ancestral do cão e do morcego. A pontuação do seu alinhamento com a sequência do cão é 14 (16 concordâncias e 2 discordâncias) and -4 com a sequência do morcego (12 concordâncias, 5 discordâncias, 1 lacuna de extensão 1, e 1 lacuna de extensão 2). Logo, a pontuação para este nó ancestral é 14 + (-4) = 10",
            		"9": "Para completar o cálculo da pontuação, precisamos computar a pontuação do alinhamento da ancestral humano/chimpanzé e da a ancestral cão/morcego com a ancestral na raiz da árvore. Primeiro, computemos a pontuação do alinhamento da ancestral humano/chimpanzé com a ancestral global. Há 9 concordâncias, 4 discordâncias, 1 lacuna de extensão 4 e 1 lacuna de extensão 1. A pontuação é 9 × (+1) + 4 × (‐1) + ( 2 × ‐5 + 3 × (-1)) = -8.",
            		"10": "Agora, computemos a pontuação do alinhamento da ancestral cão/morcego com a ancestral global. Há 18 concordâncias, e a pontuação é 18. Portanto, a pontuação total associada à raiz é (-8) + 18 = 10.",
            		"11": "Sua pontuação final é a soma de todas as pontuações individuais obtidas anteriormente. Encontra-se resumida na árvore, onde cada nó exibe a pontuação do alinhamento entre seus descendentes. Neste caso, a pontuação do alinhamento entre humano e chimpanzé é 6, a pontuação do alinhamento entre cão e morcego é 10, e a pontuação do alinhamento dos ancestrais com a raiz é 10. Com isso, sua pontuação total é 26, exibida na raiz da árvore.",
            		"12": "Você obteve a pontuação máxima. Clique na estrela e envie sua solução. Pronto! O número deste puzzle é 3847. Agora, você está pronto para jogar!"
            },
            "misc": {
                "1": "concordância",
                "2": "discordância",
                "3": "lacuna",
                "4": "árvore filogênica"
            }

        }
    
    
    }

