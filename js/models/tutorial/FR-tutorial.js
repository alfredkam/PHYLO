//enclosure
(function() {
	//json structure

	window.json = { //declared global
    
		tutorial: {
            "basics": {
                "field 1": "Bases: Règles et astuçes",
                "field 2": "Dans Phylo, ton but est de déplacer les séquences de blocs horizontalement dans le but de créer le maximum de colonnes de couleurs similaires. Chaque alignement de couleur te donne un bonus.",
                "field 3": "Cependant, les séquences ne sont pas identiques. En conséquence, les disparités de couleurs et les espaces vides sont inévitables et tu es pénalisé pour cela. Ton challenge est de trouver la meilleur balance entre les bonus et les pénalités.",
                "field 4": "Les bonus et pénalités pour les alignements de couleurs sont faible. Mais le coût de création d’un espace est grand! Il est souvent préférable d’avoir un long espace plutôt que plusieurs petits. Essaie de minimiser le nombre d‘espaces en priorité!",
                "field 5": "As-tu remarqué l’arbre sur la gauche? Il indique quelles séquences doivent être alignées en priorité. C’est utile quand tu dois favoriser un alignment de blocs par rapport à un autre. Il est plus important de conserver des motifs de couleur pour des séquences dans un même groupe plutôt que dans des groupes différents.",
                "field 6": "Pour atteindre le niveau final tu dois passer des niveaux. Pour cela tu dois atteindre le par (i.e. le score de l’ordinateur). Quand ton score est égal ou supérieur au par, une étoile s’illumine en bas a droite. Clique dessus pour atteindre le niveau suivant. Quand toutes les séquences sont présente dans le tableau, essaie d’obtenir le meilleur score possible et soumet ta solution en cliquant encore sur l’étoile!",
                "field 7": "Des informations élémentaires sont disponible en bas a droite de la grille de jeu. Tu y trouveras ton score courant, le par (i.e. le score à battre de l'ordinateur), ton avancement dans le jeu (i.e. les niveaux) et le meilleur score que tu as obtenu à ce niveau du puzzle. Tu peux revenir à ton meilleur score à tout moment en cliquant sur la roue multicolore. Au dessus tu trouveras aussi l'horloge t'indiquant le temps qu'il te reste pour finir ton puzzle.",
                },
            "scoring": {
            		"field 1": "Avançé: Calcul du score",
            		"field 2": "Chaque noeud de l'arbre phylogénétique stocke une séquence ancestrale. Les séquences ancestrales sont calculées automatiquement et représentent un consensus des séquence qui en dérivent. Pointe sur un noeud pour afficher la séquence ancestrale correspondante en bas de la grille. Par défaut nous affichons la séquence liée à la raçine de l'arbre.",
            		"field 3": "Le score d'alignement évalue la similarité entre une séquence et son ancêtre. Une couleur de blocs identique t'apportes un bonus de +1 et une dissimilarité de couleur une pénalité de -1. La création d'un espace apporte une pénalité de -5 et son extension d'une unité coûte -1. Ici, le score de l'alignement entre la séquence de la chauve-souris avec son ancêtre est -4 (12 similarités, 5 dissimilarités, un espace de longueur 1 et un espace de longueur 2).",
            		"field 4": "Ton score est la somme des scores des alignements de chaque séquence avec leur ancêtre immédiat. Ici, le score est la somme de la comparaison entre l'ancêtre B avec la séquence de l'homme et du chimpanzé, de l'ancêtre C avec la séquence du chien et de la chauve-souris, et de l'ancêtre A avec B et C.",
            },
            "example": {
            		"field 1": "Se préparer: Un exemple",
                    "field 2": "Tu démarres avec 2 séquences (homme et chimpanzé). Pousse ces séquences vers la gauche et inspecte la séquence ancestrale. L'alignement de cette séquence ancestrale avec tes 2 séquences débouche sur 13 similarités avec la première séquence (homme), et 5 similarités, 1 dissimilarités, et 1 espace de longueur 7 avec la seconde séquence (chimpanzé). Cela correspond à un score de 18 × (+1) + 1 × (‐1) + (‐5 + 6 × (‐1)) = 6. Tu as atteinds le par. Clique sur l'étoile et passe au second niveau!",
            		"field 3": "Deux séquences (chien et chauve-souris) apparaissent.  Une fois encore, pousse les vers la gauche. Ton score est 4. 18 similarités et 1 gap de longueur 1 avec la séquence du chien, et 5 similarités et 14 dissimilarités entre la séquence de la chauve-souris et le même ancêtre (Donc un total de 23 × (+1) + 14 × (‐1) + (‐5) = 4). Tu peux mieux faire. Comment?",
            		"field 4": "Déplace la séquence inférieure d'une unité vers la droite à partir de la septième position. Tu as crée un nouvel espace mais aussi plusieures similarités. As-tu remarqué? La séquence ancestrale a changé. Tu as maintenant 18 similarités et 1 espace de longueur 2 avec la séquence du chien, et 12 similiarités, 7 dissimilarités et 1 espace de longueur 1 avec la séquence de la chauve-souris. Ton score est 30 × (+1) + 7 × (‐1) + ( 2 × ‐5 + 1 × (-1)) = 12. Avançe au prochain niveau.",
            		"field 5": "Tu peux maintenant assembler tes alignements précédents. Ton score initial est 14. Ce n'est pas suffisant pour battre le par (19)… Intuitivement, nous voudrions trouver un meilleur alignement du premier bloc (les deux séquences supérieures) avec le second bloc (les deux séquences inférieures). Comment?",
            		"field 6": "Pousse le premier bloc de 4 unités vers la droite. Ce mouvement a crée deux colonnes vertes complètes. Il améliore aussi la similarité entre la sequence de l'homme avec celles du chien et de la chauve-souris. Ton score est maintenant de 26. Comment est-il calculé?",
                    "field 7": "Regardons la séquence ancestrale de l'homme et du chimpanzé. Son score d'alignement avec la séquence de l'homme est 11 (12 similarités et 1 dissimilarité), et -5 avec la séquence du chimpanzé (6 similarités et un espace de longueur 7). Ainsi, le score de cet ancêtre est is 11 + (-5) = 6.",
            		"field 8": "Faisons la même chose avec la séquence ancestrale du chien et de la chauve-souris. Son score d'alignment avec la séquence du chien est 14 (16 similarités et 2 dissimilarités) et -4 avec la séquence de la chauve-souris (12 similarités, 5 dissimilarités, 1 espace de longueur 1 et 1 espace de longueur 2). Ainsi, le score de cet ancêtre est is 14 + (-4) = 10.",
            		"field 9": "Pour compléter ton score tu as besoin de calculer le score de l'alignement de la séquence ancestrale de l'homme et du chimpanzé, et celle du chien et de la chauve-souris avec la séquence ancestrale globale. D'abord nous calculons le score de l'alignement de l'ancêtre homme/chimpanzé avec l'ancêtre global. Il y a 9 similarités, 4 dissimilarités, 1 espace de longueur 4 et 1 espace de longueur 1. Le score est donc 9 × (+1) + 4 × (‐1) + ( 2 × ‐5 + 3 × (-1)) = -8.",
            		"field 10": "Ensuite, nous calculons le score de l'alignement de l'ancêter chien/chauve-souris avec l'ancêtre global. Il y a 18 similarités et ton score est 18. Le score associé à la raçine de arbre est donc (-8) + 18 = 10.",
            		"field 11": "Ton score final est la somme de tous les alignements individuels que tu viens de calculer. C'est résumé dans l'arbre, où chaque noeud est étiquetté avec les scores d'alignement avec ses déscendants. Ici, le score de l'alignement des séquences de l'homme et du chimpanzé est 6, celui de l'alignement du chien et de la chauve-souris est 10, et le score de l'alignement des séquences ancestrales avec celle de la raçine est 10. Ainsi, ton score final est 26. Il est affiché à la raçine de l'arbre.",
            		"field 12": "Tu as maintenant le meilleur score! Clique sur l'étoile et soumets ton puzzle. Tu as fini! L'identifiant de ce puzzle est 3847. Tu es maintenant prêt à jouer!",
                    
            },
            "misc": {
                "field 1": "similarité",
                "field 2": "dissimilarité",
                "field 3": "espace",
                "field 4": "arbre phylogénétique",
            },

        },
    
    }

})();

//enclosure
(function() {

	
	$("#basics1").html(json.tutorial["basics"]["field 1"]);
	$("#basics2").html(json.tutorial["basics"]["field 2"]);
	$("#basics3").html(json.tutorial["basics"]["field 3"]);
	$("#basics4").html(json.tutorial["basics"]["field 4"]);
	$("#basics5").html(json.tutorial["basics"]["field 5"]);
	$("#basics6").html(json.tutorial["basics"]["field 6"]);
	$("#basics7").html(json.tutorial["basics"]["field 7"]);

	$("#scoring1").html(json.tutorial["scoring"]["field 1"]);
	$("#scoring2").html(json.tutorial["scoring"]["field 2"]);
	$("#scoring3").html(json.tutorial["scoring"]["field 3"]);
	$("#scoring4").html(json.tutorial["scoring"]["field 4"]);
    
	$("#example1").html(json.tutorial["example"]["field 1"]);
	$("#example2").html(json.tutorial["example"]["field 2"]);
	$("#example3").html(json.tutorial["example"]["field 3"]);
	$("#example4").html(json.tutorial["example"]["field 4"]);
	$("#example5").html(json.tutorial["example"]["field 5"]);
	$("#example6").html(json.tutorial["example"]["field 6"]);
	$("#example7").html(json.tutorial["example"]["field 7"]);
	$("#example8").html(json.tutorial["example"]["field 8"]);
	$("#example9").html(json.tutorial["example"]["field 9"]);
	$("#example10").html(json.tutorial["example"]["field 10"]);
	$("#example11").html(json.tutorial["example"]["field 11"]);
	$("#example12").html(json.tutorial["example"]["field 12"]);


})();
