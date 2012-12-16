{ 
    
"tutorial": {
            "basics": {
                "1": "Noţiuni de bază: Reguli şi sfaturi",
                "2": "În Phylo, obiectivul vostru este de a muta secvenţa de blocuri în ordine orizontală pentru a crea numărul maxim de coloane din culori similare. Fiecare potrivire de culoare vă oferă un bonus.",
                "3": "Totuşi, secvenţele nu sunt identice. Astfel, nepotrivirile dintre culori şi decalajele sunt inevitabile, în consecinţă veţi fi penalizat. Provocarea voastră este să găsiţi compromisul optim dintre bonusuri şi penalităţi.",
                "4": "Bonusurile şi penalităţile pentru culorile care se şi nu se potrivesc sunt mici. Dar costul decalajelor este mare! Este de preferat să aveţi un decalaj lung decât mai multe scurte. Încercaţi să reduceţi la minimum numărul de decalaje în funcţie de priorităţi.",
                "5": "Aţi observat arborele din stânga? El vă spune care secvenţe trebuiesc aliniate după prioritate. Acesta este ajutător când aveţi de favorizat o potrivire de culoare faţă de alta. Este mai important să conservaţi tipare identice pentru secvenţe din acelaşi grup decăt să măriţi numărul de similitudini din mai multe grupe.",
                "6": "Pentru a ajunge în ultimul stadiu, trebuie să treceţi de nivele. Aceasta necesită depăşirea scorului de egalitate (adică scorul computer-ului). Când scorul vostru este egal sau mai mare decât scorul de egalitate, o stea strălucitoare va apărea în colţul dreapta jos. Apăsaţi pe ea să promovaţi în următorul stadiu. Când toate secvenţele sunt pe tablă, încercaţi să obţineţi cel mai mare scor posibil apoi trimiteţi-l apăsând din nou pe stea!",
                "7": "Informaţiile de bază sunt disponibile în colţul din dreapta jos a tabelei de joc. Acolo, veţi găsi scorul vostru curent, scorul de egalitate (adică scorul calculatorului care trebuie depăşit), progresul vostru în cadrul jocului (adică stadiile) şi cel mai bun scor obţinut până acum. Puteţi oricând să reveniţi la cea mai bună soluţie găsită dând click pe roata multicoloră. Deasupra ei veţi vedea timpul rămas pentru a termina puzzle-ul. "
            },
            "scoring": {
            		"1": "Noţiuni avansate: Punctare",
            		"2": "Fiecare nod al arborelui phylogenetic stochează o secvenţă de predecesori. Predecesorii sunt calculaţi automat şi reprezintă un consens al tuturor secvenţelor derivate din el. Mutaţi cursorul pe oricare punct al arborelui pentru a vizualiza în josul grilei secvenţa corespunzătoare. În mod implicit, noi afişăm predecesorul în rădăcina arborelui.",
            		"3": "Scorul de aliniament estimează similitudinea dintre o secvenţă şi predecesorul ei. O potrivire de culoare vă aduce un bonus de +1 iar o nepotrivire de culoare vă costă -1. Crearea unui gol aduce o penalitate de -4 iar extensia ei cu o unitate costă -1 fiecare. Aici scorul de aliniament dintre secvenţa liliacului şi predecesorul lui este -5 (4 potriviri, 4 nepotriviri, 1 gol de lungime 1).",
            		"4": "Scorul vostru este suma scorurilor de aliniament al fiecarei secvenţe cu predecesorul ei imediat. Aici, scorul este suma comparaţiilor dintre predecesorul B cu om şi cimpanzeu, predecesorul C cu liliac şi câine, şi predecesorul A cu B şi C."
            },
            "example": {
            		"1": "Pregătire: Un exemplu",
                             "2": "Veţi începe cu două secvenţe (om şi cimpanzeu). Împingeţi totul la stânga şi verificaţi predecesorul. Prin alinierea predecesorului cu cele două secvenţe veţi forma 13 potriviri pentru prima secvenţă (omul), iar pentru a doua (cimpanzeul) se vor forma 5 potriviri, o nepotrivire, şi un gol de lungime 7. Aşadar un total de 18 × (+1) + 1 × (‐1) + (‐5 + 6 × (‐1)) = 6. Aţi depăşit scorul de egalitate. Apăsaţi pe stea pentru a trece la următorul stadiu!",
            		"3": "Au apărut două secvenţe noi (câine şi liliac). Din nou, împingeţi toate blocurile la stânga. Scorul vostru este 4. S-au format 18 potriviri şi un gol de lungime 1 dintre secvenţa câinelui şi predecesorul lui, iar dintre secvenţa liliacului şi acelaşi predecesor, 5 potriviri şi 14 nepotriviri (Prin urmare un total de 23 × (+1) + 14 × (‐1) + (‐5) = 4). Puteţi îmbunătăţi acest scor. Cum? ",
            		"4": "Mutaţi ultima secvenţă cu o unitate spre dreapta începând de la al şaptelea pătrat. Aţi creat un gol adiţional dar în acelaşi timp s-au format multe alte potriviri. Aţi observat modificarea predecesorului? Acum aveţi 18 potriviri şi un gol de lungime 2 cu secvenţa câinelui, iar cu secvenţa liliacului aveţi 12 potriviri, 7 nepotriviri şi un gol de lungime 1. Scorul vostru este 30 × (+1) + 7 × (‐1) + ( 2 × ‐5 + 1 × (-1)) = 12. Avansaţi în următorul stadiu.",
            		"5": "Acum, aveţi de asamblat aliniamentele anterioare. Scorul iniţial este 14. Acesta nu depăşeşte egalitatea (19)... Intuitiv, noi dorim să găsim un aliniament mai bun pentru primul bloc (primele două secvenţe) şi al doilea bloc (ultimele două secvenţe). Cum?",
            		"6": "Mutaţi primul bloc cu 4 unităţi spre dreapta. Această deplasare crează două coloane complet verzi. De asemenea, este îmbunătăţită similitudinea dintre secvenţa omului şi cele ale câinelui şi liliacului. Scorul vostru este acum 26. Cum este el calculat?",
            		"7": "Să ne uităm la predecesorul omului şi cimpanzeului. Scorul său de aliniament cu secvenţa omului este 11 (12 potriviri şi o nepotrivire), şi cu cea al cimpanzeului este -5 (6 potriviri şi un gol de lungime 7). Aşadar, scorul acestui nod de predecesor este 11 + (-5) = 6.",
            		"8": "Vom face acelaşi lucru pentru predecesorul câinelui şi liliacului. Scorul său de aliniament cu secvenţa câinelui este 14 (16 potriviri şi 2 nepotriviri), şi cu cea a liliacului este -4 (12 potriviri, 5 nepotriviri, un gol de lungime 1 şi un gol de lungime 2). Aşadar, scorul acestui nod de predecesor este 14 + (-4) = 10.",
            		"9": "Pentru a vă completa scorul, trebuie să calculaţi scorul de aliniament al predecesorului om/cimpanzeu şi cel al predecesorului câine/liliac cu predecesorul rădăcinii arborelui. Întâi, vom calcula scorul de aliniament al predecesorului om/cimpanzeu cu predecesorul global. Sunt 9 potriviri, 4 nepotriviri, un gol de lungime 4 şi un gol de lungime 1. Scorul este 9 × (+1) + 4 × (‐1) + (2 × ‐5 + 3 × (-1)) = -8.",
            		"10": " Apoi, vom calcula scorul de aliniament al predecesorului câine/liliac cu predecesorul global. Sunt 18 potriviri ş scorul este 18. Prin urmare, scorul asociat cu rădăcina este (-8) + 18 = 10.",
            		"11": "Scorul vostru final este suma tuturor scorurilor individuale calculate anterior. Este sumarizat în arbore, unde fiecare nod este marcat cu scorul de aliniament al descendenţilor săi. Aici, scorul de aliniament al om şi cimpanzeu este 6, cel al câine şi liliac este 10, iar cel al predecesori cu rădăcina este 10. Astfel, scorul vostru total este 26 şi este afişat la rădăcina arborelui.",
            		"12": "Aveţi cel mai mare scor. Apăsaţi pe stea şi trimiteţi-vă puzzle-ul. Aţi terminat! ID-ul acestui nivel este 3847. Acum, sunteţi gata să jucaţi!"
            },
            "misc": {
                "1": "potrivire",
                "2": "nepotrivire",
                "3": "gol",
                "4": "arbore phylogenetic"
            }

        }
    
    
    }



