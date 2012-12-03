{    
		"tutorial": {
            "basics": {
                "1": "Introducción: Reglas y consejos",
                "2": "En Phylo, tu objetivo es mover las secuencias de bloques horizontalmente para crear el máximo número de columnas de colores similares. Cada color apareado te da una bonificación.",
                "3": "Sin embargo, las secuencias no son idénticas. Por lo tanto, siempre habra colores sin aparear y espacios, por los que recibirás sanciones. Tu reto es encontrar la mejor combinación entre bonificaciones y sanciones.",
                "4": "Las bonificaciones y las sanciones por igualdades y desigualdades de colores son pequeñas. ¡Pero el costo de los espacios es grande! Es preferible tener un espacio grande que varios espacios pequeños. Entonces intenta minimizar el número de estos espacios.",
                "5": "¿Te diste cuenta del árbol a la izquierda? Te dice que secuencias tienen prioridad de alinearse. Esto te puede ayudar cuando tienes que decidir entre aparear un color u otro. Es mas importante conservar patrones idénticos para las secuencias en el mismo grupo que incrementar similitudes entre diferentes grupos.",
                "6": "Para llegar a la etapa final, tienes que pasar los niveles previos. Esto requiere que venzas la puntuación de la computadora. Cuando tu puntuación es igual o más alta que la de la computadora, un estrella brillante aparece en la esquina inferior derecha. Hazle click para ir a la siguiente etapa. Cuando tengas todas las secuencias en la cuadrícula, ¡intenta conseguir la puntuación mas alta posible y enviala haciendo click en la estrella de nuevo!",
                "7": "La información básica se encuentra disponible en la esquina inferior derecha del tablero de juego. Allí encontrará su puntaje actual, el puntaje de la computadora, su nivel actual, y el mejor puntaje obtenido por usted hasta ahora. Usted puede volver en cualquier momento a la mejor solución que encontró, haciendo clic en la rueda multicolor. En la parte superior, también se puede ver el reloj y el tiempo restante para terminar el rompecabezas."
            },
            "scoring": {
            		"1": "Avanzado: Puntaje.",
            		"2": "Cada nodo del árbol filogenético almacena una secuencia de los antepasados. Los ancestros son calculados automáticamente y representan un consenso de todas las secuencias derivadas de ella. Apunte a cualquier nodo del árbol para mostrar la secuencia correspondiente en la parte inferiro del tablero. De forma predeterminada, se muestra el antepasado en la raíz del árbol",
            		"3": "La puntuación del alineamiento calcula la similitud entre una secuencia y su antecesor. Un coincidencia del color le otorga un bonus de +1 y una falta de coincidencia le cuesta una sanción de -1. La creación de un espacio tiene una penalización de -4 y su extensión le cuesta -1 por cada unidad. En este caso, la puntuación de la alineación entre la secuencia de los murciélagos y su antecesor es -5 (4 coincidencias, 4 no coincidencias, 1 espacio de longitud 1).",
            		"4": "Su puntuación es la suma de las puntuaciones de alineamiento de secuencias de cada secuencia con su antecesor inmediato. En este caso, la puntuación es la suma de las comparaciones entre el ancestro de B con humano y chimpancé, el ancestro C con el perro y el murciélago, y el antepasado A con B y C."
            },
            "example": {
            		"1": "Preparado?: Un ejemplo.",
                    "2": "Estas comenzando con dos secuencias (humano y chimpancé). Lleve todo a la izquierda y de un vistazo a los antepasados. La alineación de este ancestro con tus dos secuencias te da 13 coincidencias para la primera secuencia (humano), y 5 coincidencias, 1 no coincidencia, y un espacio de longitud 7 para la segunda secuencia (chimpancé). Entonces se obtiene un total de 18 × (+1) + 1 × (‐1) + (‐5 + 6 × (‐1)) = 6 puntos. Le acabas de ganar a la computadora. De Click sobre la estrella para ir al siguiente nivel!",
            		"3": "Dos nuevas secuencias (perro y murcielago) aparecen. De nuevo, llevelas a la izquierda. Su puntaje es 4. 18 coincidencias y 1 espacio de longitud 1 entre la secuencia del perro y su ancestro, y 5 coincidencias y 14 no coincidencias entre la secuencia del murcielago y el mismo ancestro (Entonces un total de 23 × (+1) + 14 × (‐1) + (‐5) = 4 es obtenido). Lo puedes hacer mejor. Cómo?",
            		"4": "Desplace la secuencia inferior una unidad a la izquierda a partir del séptimo bloque. Se crea una brecha adicional, pero también se crean muchos mas emparejamientos. Lo notas? el ancestro cambio. Tu tienes ahora 18 coincidencias y 1 espacio de longitud 2 con la secuencia del perro, y 12 coincidencias, 7 no coincidencias y 1 espacio de tamano 1 con la secuencia del murcielago. Tu puntaje es 30 × (+1) + 7 × (‐1) + ( 2 × ‐5 + 1 × (-1)) = 12. Continua con el siguiente nivel.",
            		"5": "Ahora, tiene que montar sus alineaciones anteriores. Tu puntaje inicial es 14, sin embargo no le ganas al puntaje del computador (19). Intuitivamente, queremos encontrar una mejor alineación del primer bloque (las dos secuencias superiores) y el segundo bloque (las dos secuencias inferiores). ¿Cómo? ",
            		"6": "Mueva el primer bloque 4 unidades a la derecha. Este movimiento crea dos columnas verdes completas. También mejora la similitud entre la secuencia de los humanos y la del perro y el murciélago. Su puntaje total es ahora 26. ¿Cómo se calcula?",
            		"7": "Vamos a echar un vistazo al antepasado del humano y el chimpancé. El resultado de la alineación con la secuencia humana es de 11 (12 coincidencias, y 1 no coincidencia), y -5 con la secuencia del chimpancé (6 coincidencias, y 1 espacio de longitud 7). De este modo, la puntuación en el nodo del antecesor es 11 + (-5) = 6.",
            		"8": "Hacemos lo mismo para el ancestro del perro y el murcielago. La puntuación del alineamiento con la secuencia del perro es de 14 (16 coincidencias y 2 no coincidencias) y -4 con la secuencia de murciélago (12 coincidencias, 5 no coincidencias, un espacio de longitud 1, y un espacio de longitud 2). De este modo, la puntuación en el nodo del antecesor es 14 + (-4) = 10",
            		"9": "Para completar su puntaje, es necesario calcular la puntuación del alineamiento del antepasado del humano y chimpancé y el ancestro del perro y murcielago con el ancestro en la raíz del árbol. En primer lugar, se calcula la puntuación del alineamiento del antepasado humano/chimpancé con el antepasado global. Existen 9 coincidencias, 4 no coincidencias, 1 espacio de longitud 4 y 1 espacio de longitud 1. El puntaje es 9 × (+1) + 4 × (‐1) + ( 2 × ‐5 + 3 × (-1)) = -8.",
            		"10": "A continuación, se calcula la puntuación de la alineación del antepasado del perro/murcielago con el ancestro global. Hay 18 coincidencias y el puntaje es 18. Por lo tanto, la puntuación asociada con la raíz es (-8) + 18 = 10.",
            		"11": "Su puntuación final es la suma de todas las puntuaciones individuales previamente calculadas. Esta informacion se resume en el árbol, donde cada nodo está etiquetado con la puntuación de la alineación de sus descendientes. En este caso, la puntuación de la alineación de humano y chimpancé es 6, el resultado de la alineación del perro y el murciélago es de 10, la puntuación de la alineación de los antepasados ​​con la raíz es de 10. Por lo tanto, su puntaje total es 26 y se muestra en la raíz del árbol.",
            		"12": "Usted tiene la puntuación más alta. Haga clic en la estrella y envía tu rompecabezas. Usted ha finalizado! La identificación del nivel de este rompecabezas es 3847. Ahora, usted está listo para jugar!"
            },
            "misc": {
                "1": "coincidencia",
                "2": "no coincidencia",
                "3": "espacio",
                "4": "árbol filogenético"
            }

        }
    
    }


