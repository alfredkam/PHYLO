{
   "tutorial":{
      "basics":{
         "1":"Introducción: Reglas y consejos",
         "2":"En Phylo, tu objetivo es mover las secuencias de bloques horizontalmente para crear el máximo número de columnas de colores similares. Cada color apareado te da una bonificación.",
         "3":"Sin embargo, las secuencias no son idénticas. Por lo tanto, siempre habra colores sin aparear y espacios, por los que recibirás sanciones. Tu reto es encontrar la mejor combinación entre bonificaciones y sanciones. N.B.: Los bloques mas pequeno enfatizan discordancia.",
         "4":"Las bonificaciones y las sanciones por concordancia y discordancia de colores son pequeñas. ¡Pero el costo de los espacios es grande! Es preferible tener un espacio grande que varios espacios pequeños. Entonces intenta minimizar el número de estos espacios.",
         "5":"¿Te diste cuenta del árbol a la izquierda? Te dice que secuencias tienen prioridad de alinearse. Esto te puede ayudar cuando tienes que decidir entre aparear un color u otro. Es mas importante conservar patrones idénticos, para las secuencias en el mismo grupo, que incrementar similitudes entre diferentes grupos.",
         "6":"Para llegar a la etapa final, tienes que pasar los niveles previos. Esto requiere que venzas la puntuación de la computadora. Cuando tu puntuación es igual o más alta que la de la computadora, un estrella brillante aparece en la esquina inferior derecha. Hazle click para ir a la siguiente etapa. Cuando tengas todas las secuencias en la cuadrícula, ¡intenta conseguir la puntuación mas alta posible y enviala haciendo click en la estrella de nuevo!",
         "7":"La información del juego se encuentra disponible en la parte inferior del tablero de juego. La barra azul indica su puntuación actual. La marca roja indica el par (i.e. el puntaje a superar) y la marca azul muestra el mejor puntaje que usted ha obtenido hasta el momento.",
         "8":"La información básica se encuentra disponible en la parte inferior del tablero de juego. Alli, usted prodra ver su avance en el juego (i.e., niveles) y el número de concordancias, discordancias y espacios. Usted pueder revertir en cualquier momento la mejor solución que ha encontrado, simplemente de click en la rueda multicolor."

      },
      "scoring":{
         "1":"Avanzado: Puntaje",
         "2":"Cada nodo del árbol filogenético almacena una secuencia de antepasados. Ancestors are computed automatically and represent a consensus of all sequences derived from it. Los ancestros son calculados automáticamente y representan un consenso de todas las secuencias derivadas de ella. Apunte a cualquier nodo del árbol para mostrar la secuencia correspondiente en la parte inferior del tablero.",
         "3":"La puntuación del alineamiento calcula la similitud entre una secuencia y su antecesor. Un concordancia de color le otorga un bonus de +1 y una discordancia le cuesta una sanción de -1. La creación de un espacio tiene una penalización de -4 y su extensión le cuesta -1 por cada unidad. Los espacios en los extremos no son penalizados y las columnas vacias son ignoradas. En el ejemplo, el puntaje del alineamiento entre el elefante y su ancestro es -5 (4 concordancias, 4 disconcordancias, 1 espacio de longitud 1).",
         "4":"Su puntuación es la suma de las puntuaciones de alineamiento de cada secuencia con su antecesor inmediato. En este caso, la puntuación es la suma de las comparaciones entre el ancestro de B con humano y chimpancé, el ancestro C con el perro y el murciélago, y el antepasado A con B y C."

      },
      "example":{
         "1":"Preparado?: Veamos un ejemplo.",
         "2":"Estas comenzando con dos secuencias (humano y chimpancé). Lleve todo a la izquierda y de un vistazo a los ancestros. La alineación de este ancestro con sus dos secuencias da 13 concordancias para la primera secuencia (humano), y 5 concordancias, 1 discordancia para la segunda secuencia (chimpance). El espacio final es ignorado. Entonces se obtiene un total de 18 × (+1) + 1 × (‐1) = 17. Le acabas de ganar a la computadora. De Click sobre la estrella para ir al siguiente nivel!",
         "3":"Dos nuevas secuencias (perro y murcielago) aparecen. De nuevo, llevelas a la izquierda. Su puntaje es 9. 18 concordancias entre la secuencia del perro y su ancestro (el espacio en el extremo es de nuevo ignorado), y 5 concordancias y 14 discordancias entre el murcielago y el mismo ancestro (Para un total de 23 × (+1) + 14 × (‐1) = 9). Lo puedes hacer mejor. Cómo?",
         "4":"Desplace la secuencia inferior una unidad a la izquierda a partir del séptimo bloque. Se crea un espacio adicional, pero también se crean muchas mas concordancias. Lo notas? el ancestro cambio. Usted tiene ahora 18 concordancias con la secuencia del perro (espacio final ignorado), y 12 concordancias, 7 discordancias y 1 espacio de longitud 1 con la secuencia del murcielago. Su puntaje es 30 × (+1) + 7 × (‐1) + ( 1 × ‐4 ) = 19. Vaya al siguiente nivel.",
         "5":"Ahora, tiene que alinear sus alineaciones anteriores. Tu puntaje inicial es 41. Este puntaje vence el par (30) pero usted lo puede hacer mejor… Intuitivamente, queremos encontrar una mejor alineación del primer bloque (las dos secuencias superiores) y el segundo bloque (las dos secuencias inferiores). ¿Cómo?",
         "6":"Mueva el primer bloque 4 unidades a la derecha. Este movimiento crea dos columnas verdes completas. También mejora la similitud entre la secuencia de los humanos y la del perro y el murciélago. Su puntaje total es ahora 57. ¿Cómo se calcula?",
         "7":"Vamos a echar un vistazo al antepasado del humano y el chimpancé. El resultado de la alineación con la secuencia humana es de 11 (12 concordancias y 1 discordancia), y 6 con la secuencia del chimpance (6 concordancias). Entonces el puntaje en el nodo del ancestro es 11 + 6 = 17.",
         "8":"Hacemos lo mismo para el ancestro del perro y el murcielago. La puntuación del alineamiento con la secuencia del perro es de 14 (16 concordancias y 2 discordancias) y 3 con la secuencia del murciélago (12 concordancias, 5 discordancias, 1 espacio de longitud 1). De este modo, la puntuación en el nodo del antecesor es 14 + 3 = 17.",
         "9":"Para completar su puntaje, es necesario calcular la puntuación del alineamiento del antepasado del humano y chimpancé y el ancestro del perro y murcielago con el ancestro en la raíz del árbol. En primer lugar, se calcula la puntuación del alineamiento del antepasado humano/chimpancé con el antepasado global. Hay 9 concordancias, 4 discordancias (los espacios al final y comienzo son ignorados). El puntaje es 9 × (+1) + 4 × (‐1) = 5.",
         "10":"A continuación, se calcula la puntuación de la alineación del antepasado del perro/murcielago con el ancestro global. Hay 18 concordancias y el puntaje es 18. Por lo tanto, la puntuación asociada con la raíz es 5 + 18 = 23.",
         "11":"Su puntuación final es la suma de todas las puntuaciones individuales previamente calculadas. Aca, el puntaje del alineamiento de humano y chimpance es 17, el puntaje del alineamiento de perro y murcielago es 17, la puntuación de la alineación de los antepasados ​​con la raíz es de 23. Por lo tanto, su puntaje total es 57.",
         "12":"Usted tiene la puntuación más alta. Haga clic en la estrella y envía tu juego. Usted ha finalizado!. La identificación del nivel de este juego es 0. Ahora, usted está listo para jugar!!"

      },
      "misc":{
         "1":"concordancia",
         "2":"discordancia",
         "3":"espacio",
         "4":"árbol filogenético"

      }

   }
}
