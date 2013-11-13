{ 
    "tutorial": {
            "basics": {
                "1": "Noţiuni de bază: Reguli şi sfaturi",
                "2": "În Phylo, obiectivul dumneavoastră este de a muta secvenţa de blocuri în direcţie orizontală pentru a crea numărul maxim de coloane din culori similare. Fiecare potrivire de culoare vă oferă un bonus.",
                "3": "Totuşi, secvenţele nu sunt identice. Astfel, nepotrivirile dintre culori şi decalajele sunt inevitabile, în consecinţă veţi fi penalizat. Provocarea dumneavoastră este să găsiţi compromisul optim dintre bonusuri şi penalităţi.",
                "4": "Bonusurile şi penalităţile pentru culorile care se şi nu se potrivesc sunt mici. Dar costul decalajelor este mare! Este de preferat să aveţi un decalaj lung decât mai multe scurte. Încercaţi să reduceţi la minimum numărul de decalaje în funcţie de priorităţi.",
                "5": "Aţi observat arborele din stânga? El vă spune care secvenţe trebuiesc aliniate după prioritate. Acesta este de ajutor când aveţi de favorizat o potrivire de culoare faţă de alta. Este mai important să conservaţi tipare identice pentru secvenţe din acelaşi grup decăt să măriţi numărul de similitudini din mai multe grupe.",
                "6": "Pentru a ajunge în ultimul stadiu, trebuie să treceţi de nivele. Aceasta necesită depăşirea scorului de egalitate (adică scorul computer-ului). Când scorul vostru este egal sau mai mare decât scorul de egalitate, o stea strălucitoare va apărea în colţul dreapta jos. Apăsaţi pe ea să promovaţi la următorul stadiu. Când toate secvenţele sunt pe tablă, încercaţi să obţineţi cel mai mare scor posibil apoi trimiteţi-l apăsând din nou pe stea!",
                "7": "Acolo, veţi găsi scorul vostru curent, scorul de egalitate (adică scorul calculatorului care trebuie depăşit), progresul vostru în cadrul jocului (adică stadiile) şi cel mai bun scor obţinut până acum."
                "8": "Informaţiile de bază sunt disponibile în colţul din dreapta jos a tabelei de joc. Puteţi oricând să reveniţi la cea mai bună soluţie găsită dând click pe roata multicoloră. "
            },
            "scoring": {
            		"1": "Noţiuni avansate: Punctare",
            		"2": "Fiecare nod al arborelui filogenetic stochează o secvenţă de predecesori. Predecesorii sunt calculaţi automat şi reprezintă un consens al tuturor secvenţelor derivate din el. Mutaţi cursorul pe oricare punct al arborelui pentru a vizualiza în josul grilei secvenţa corespunzătoare. În mod implicit, noi afişăm predecesorul în rădăcina arborelui.",
            		"3": "Scorul de aliniament estimează similitudinea dintre o secvenţă şi predecesorul ei. O potrivire de culoare vă aduce un bonus de +1 iar o nepotrivire de culoare vă costă -1. Crearea unui gol aduce o penalitate de -4 iar extensia acestuia cu o unitate costă -1 fiecare. Aici scorul de aliniament dintre secvenţa liliacului şi predecesorul sau este -3 (4 potriviri, 1 nepotriviri, 1 gol de lungime 3).",
            		"4": "Scorul vostru este suma scorurilor de aliniament ale fiecarei secvenţe cu predecesorul ei imediat. Aici, scorul este suma comparaţiilor dintre predecesorul B cu om şi cimpanzeu, predecesorul C cu liliac şi câine, şi predecesorul A cu B şi C."
            },
            "example": {
                "1":"Getting ready: An example",
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
                "1": "potrivire",
                "2": "nepotrivire",
                "3": "gol",
                "4": "arbore phylogenetic"
            }

        }
    
    
    }



