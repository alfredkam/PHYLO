{		"tutorial": {
            "basics": {
            "1": "Основы игры: правила и советы",
		    "2": "Задача игры Phylo - перемещать горизонтально цепочки квадратов, чтобы получить максимальное соответвие цветов по-вертикали. За каждое цветовое соответствие вы получаете бонус.",
		    "3": "Однако, цепочки не идентичны, поэтому несоответствия цветов и пробелы неизбежны, и за это вы теряете баллы. Ваша задача - найти золотую середину между бонусами и потерей баллов.",
		   "4": "Бонусы и потери баллов за соответствия и несоответствия цветов в цепочках малы. Однако, потери баллов за создание пробелов высоки! Намного лучше оставлять один большой пробел, чем много маленьких. Одним словом, постарайтесь минимизировать количество пробелов.",
		    "5": "Заметили дерево слева? Оно показывает, какую последовательность квадратов необходимо сравнить первоначально. Это помогает выбрать одно соответствие цветов перед другим. Намного важнее сохранить соответствия цветов между цепочками квадратов одной группы, чем увеличивать соответствия между цепочками разных групп.",
		    "6": "Чтобы достичь последней стадии головоломки, вам необходимо пройти все этапы выравнивания. Для этого следует обойти пар, т.е. решение компьютера. Когда ваш счет равен или превышает пар, в нижнем углу загорится звездочка. Нажмите на нее, чтобы перейти на следующий этап. Когда на игровом поле выложены все цепочки, попытайтесь добиться наибольшего количества баллов! Не забудьте зарегестрировать ваше решение, еще раз нажав на звездочку.",
            "7":"Scoring information are available at the top of your game board. The blue bar indicates your current score. The red marker indicates the par (i.e. the computer score to beat) and the green marker displays the best score you obtained so far.",
            "8":"Basic information are available at the bottom of your game board. There, you will find your advancement in the game (i.e. stages) and the numbers of match, mismatch and gap. You can revert at anytime to the best solution you found by clicking the multi-color wheel."
            },
            "scoring": {
		    "1": "Правила набора очков",
		    "2": "Каждый узел филогенетического дерева содержит информацию о последовательности предков. Эта последовательность вычитывается автоматически и представляет компромиссное решение для последовательностей группы данного узла. Укажите на какой-нибудь узел филогенетического дерева, чтобы увидеть соответствующую последовательность внизу игрового поля. По умолчанию, там изображена последовательность, компромиссная для всего дерева.",
		    "3": "Счет игры определяется степенью соответствия каждой последовательности компромиссной последовательности ее группы. Соответствие цветов означает +1 балл, а несоответствие -1. Пробел представляет штраф в -4 балла, а его размер -1х количество пустых квадратов (кв.). В данном случае, количество баллов за соответствие последовательности летучей мыши последовательности ее предка, или ее группы, равно -3 (4 соответствий, 1 несоответствий, 1 пробел размером 3 кв.)",
		    "4": "Ваш общий счет представляет сумму соответствий каждой последовательности с последовательностью ее предка. В данном случае, общий счет - это сумма соответствий предка В с человеком и шимпанзе, предка С с собакой и летучей мышью, и предка А с В и С."
            },
            "example": {
		    "1": "Готовы? Пример",
            "2":"You are starting with two sequences (human and chimp). Push everything on the left and check out the ancestor. Aligning this ancestor with your two sequences gives you 13 matches for the first sequence (human), and 5 matches, 1 mismatch for the second sequence (chimp). The trailing gap is ignored. Thus your total is 18 × (+1) + 1 × (‐1) = 17. You beat the par. Click on the star and jump to the next stage!",
            "3":"Two new sequences (dog and bat) appear. Again, push them all to the left. Your score is 9. 18 matches between the dog sequence and its ancestor (gap at extremity is again ignored), and 5 matches and 14 mismatches between the bat sequence and the ancestor (Thus a total of 23 × (+1) + 14 × (‐1) = 9). You can do better. How?",
            "4":"Shift the bottom sequence by one unit to the right starting from the seventh brick. You create an additional gap but you also create many matches. Did you notice? The ancestor changed. You have now 18 matches with the dog sequence (trailing gap ignored), and 12 matches, 7 mismatches and 1 gap of length 1 with the bat sequence. Your score is 30 × (+1) + 7 × (‐1) + ( 1 × ‐4 ) = 19. Move to the next stage.",
            "5":"Now, you have to assemble your previous alignments. Your initial score is 41. It beats the par (30) but you can do better… Intuitively, we want to find a better alignment of the 1st block (the two top sequences) and the 2nd block (the two lower sequences). How?",
            "6":"Shift the first block by 4 units to the right. This move creates two complete green columns. It also improves the similarity between the human's sequence and those of the dog and the bat. Your total score is now 57. How is it calculated?",
            "7":"Let's have a look at the human and chimp ancestor. Its alignment score with the human sequence is 11 (12 matches and 1 mismatch), and 6 with the chimp sequence (6 matches). Thus the score at this ancestor node is 11 + 6 = 17.",
            "8":"We do the same thing for the dog and bat ancestor. Its alignment score with the dog sequence is 14 (16 matches and 2 mismatches) and 3 with the bat sequence (12 matches, 5 mismatches, 1 gap of length 1). Thus, the score at this ancestor node is 14 + 3 = 17.",
            "9":"To complete your score, you need to compute the alignment score of the human/chimp ancestor and dog/bat ancestor with the ancestor at the root of the tree. First, we compute the alignment score of the human/chimp ancestor with the global ancestor. There are 9 matches, 4 mismatches (gaps at the end and beginning are ignored). The score is 9 × (+1) + 4 × (‐1) = 5.",
            "10":"Then, we compute the alignment score of the dog/bat ancestor with the global ancestor. There is 18 matches and the score is 18. Therefore, the score associated with the root is 5 + 18 = 23.",
            "11":"Your final score is the sum of all individual scores previously computed. Here, the score of the alignment of human and chimp is 17, the score  of the alignment of dog and bat is 17, the score of the alignment of ancestors with the root is 23. Thus, your total score is 57.",
            "12":"You have the highest score. Click the star and submit your puzzle. You are done! The level id for this puzzle is 481. Now, you are ready to play!"
            },
            "misc": {
                "1": "соответствие",
                "2": "несоответствие",
                "3": "пробел",
                "4": "филогенетическое дерево"
            }

        }
    
    }



