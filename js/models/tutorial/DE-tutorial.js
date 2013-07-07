{
   "tutorial":{
      "basics":{
         "1":"Grundlagen: Regeln und Tipps",
         "2":"Ihr Ziel bie Phylo ist es, Sequenzen von Blöcken horizontal zu verschieben, um die maximale Zahl von Spalten gleicher Farbe zu finden. Jede  Farbübereinstimmung wird mit einem Bonus belohnt.",
         "3":"Die Sequenzen sind leider nicht identisch. Fehlstellen und Lücken sind unvermeidbar, wofür es Strafpunkte gibt. Ihre Herausforderung ist es, die beste Balance zwischen Bonus- und Strafpunkten zu finden.<br>Anmerkung: Kleinere Blöcke kennzeichnen  Stellen, die nicht passen.",
         "4":"Es gibt wenig Bonus- und Strafpunkte für passende und unpassende Farben. Aber die Strafe für Lücken ist groß! Normalerweise ist eine große Lücken besser als viele kleine. Priorität ist es, die Anzahl der Lücken zu minimieren.",
         "5":"Haben Sie die Baumstruktur links bemerkt? Sie zeigt, welche Sequenzen bevorzugt angeordnet werden sollen. Das ist hilfreich, wenn man zwischen zwei Farbanordnungen wählen muss. Es ist wichtiger, dass die Muster in der gleichen Gruppe zusammenpassen, als die Gemeinsamkeiten in verschiedenen Gruppen zu erhöhen.",
         "6":"Um die letzte Stufe zu erreichen, müssen Sie die Level abschließen. Dazu muss der Par-Wert (das berechnete Ergebnis) geschlagen werden. Wenn Ihr Wert gleich oder besser ist, erscheint unten rechts ein Stern. Klicken Sie auf den Stern, um die nächste Stufe zu erreichen. Wenn alle Sequenzen auf dem Spielfeld sind, versuchen Sie, die höchste Punktzahl zu erreichen, und senden Sie diese mit einem Klick auf den Stern ab.",
         "7":"Informationen zum Punktestand werden über dem Spielfeld angezeigt. Der blaue Balken zeigt Ihren aktuellen Punktestand. Die rote Markierung  zeigt den Par-Wert (d.h. das zu schlagende Ergebnis des Computers) und die grüne Markierung zeigt die beste Punktzahl, die Sie bisher erreicht haben.",
         "8":"Allgemeine Informationen sind unter dem Spielfeld verfügbar. Dort sehen Sie Ihren Spielfortschritt (d.h. die Level) und die Anzahl der Übereinstimmungen (Gleich), Fehlstellen (Ungleich) und Lücken. Sie können jederzeit zu Ihrem besten Ergebnis zurückkehren, indem Sie auf das bunte Rad klicken."
      },
      "scoring":{
         "1":"Ausführlich: Punktewertung",
         "2":"Jeder Knoten  des phylogenetische Baums enthält die Sequenz eines Vorfahren. Die Sequenzen werden automatisch berechnet und fassen alle Übereinstimmungen der Sequenzen zusammen. Fahren Sie mit der Maus über einen Knoten, um sie entsprechende Sequenz unten anzuzeigen.",
         "3":"Der Punktwert der Ausrichtung ermittelt die Gemeinsamkeiten einer Sequenz und ihres Vorfahren. Passende Farben bringen einen Bonuspunkt (+1) ein, unpassende Farben kosten einen Strafpunkt (-1). Das Anlegen einer Lücke wird mit vier Strafpunkten bestraft (-4), die Erweiterung kostet je einen Punkt pro Feld (-1). Lücken am Ende werden nicht bestraft, leere Spalten werden ignoriert. Im Beispiel beträgt die Punktzahl für den Elefanten und seinen Vorfahren -3 (gleich: 4, ungleich: 1, Lücken: 1 mit Länge 3)",
         "4":"Ihre Punktzahl ist die Summe der Punktzahlen jeder Sequenz mit den unmittelbaren Vorfahren. Im Beispiel ergibt sich die Punktzahl aus dem Vergleich von Vorfahr B mit Mensch und Schimpanse, Vorfahr C mit Hund und Fledermaus, und Vorfahr A mit B und C."
      },
      "example":{
         "1":"Letzte Schritte: Ein Beispiel",
         "2":"Sie fangen mit zwei Sequenzen an (Mensch und Schimpanse). Schieben Sie alles nach links und prüfen Sie den Vorfahren. Die Ausrichtung des Vorfahrens mit beiden Sequenzen ergibt 13 Übereinstimmungen für die erste Sequenz (Mensch), sowie 5 Übereinstimmungen und 1 Fehlstelle für die zweite Sequenz (Schimpanse). Lücken an den Enden werden ignoriert. Ihre Gesamtsumme ist also 18 x (+1) + 1 x (-1) = 17. Sie übertreffen den Par-Wert. Klicken Sie auf den Stern und gehen Sie zur nächsten Stufe.",
          "3":"Zwei neue Sequenzen (Hund und Fledermaus) erscheinen. Schieben Sie wieder alles nach links. Ihre Punktzahl ist 9: 18 Übereinstimmungen zwischen dem Hund und seinem Vorfahren (die Lücke an der Seite wird ignoriert), und 5 Übereinstimmungen sowie 14 Fehlstellen zwischen der Fledermaus und ihrem Vorfahren. (Somit ergibt sich insgesamt 23 × (+1) + 14 × (‐1) = 9). Das geht besser. Wie?",
         "4":"Verschieben Sie die untere Sequenz um eine Einheit nach recht, beginnend mit dem siebten Stein. Das verursacht eine Lücke, aber auch viele Übereinstimmungen. Haben Sie es bemerkt? Der Vorfahre hat sich geändert. Sie haben jetzt 18 Übereinstimmungen mit der Sequenz des Hundes  (Lücken am Ende werden ignoriert), sowie 12 Übereinstimmungen, 7 Fehlstellen und 1 Lücke der Länge 1 mit der Sequenz der Fledermaus. Ihre Punktzahl ist  30 × (+1) + 7 × (‐1) + ( 1 × ‐4 ) = 19. Auf zum nächsten Level!",
         "5":"Jetzt müssen Sie Ihre vorherige Anordnung ausrichten. Ihre Ausgangspunktzahl ist 41. Das ist besser als der Par-Wert (30), aber das können Sie besser... Intuitiv wollen wir eine bessere Anordnung für den 1. Block (die oberen beiden Sequenzen) und den 2. Block (die unteren beiden Sequenzen) finden. Wie?",
         "6":"Schieben Sie den ersten Block um 4 Einheiten nach rechts. Dieser Zug erzeugt zwei komplett grüne Spalten. Er verbessert auch die Übereinstimmung zwischen der Sequenz des Menschen und denen von Hund und Fledermaus. Ihre Gesamtpunktzahl beträgt jetzt 57. Wie wird sie berechnet?",
         "7":"Schauen wir uns den Vorfahren von Mensch und Schimpanse an. Die Punktzahl der Ausrichtung mit dem Menschen beträgt 11 (12 Übereinstimmung und 1 Fehlstelle) und 6 mit dem Schimpansen. Somit beträgt die Punktzahl an diesem Knoten 11 + 6 = 17.",
         "8":"Dasselbe machen wir für den Vorfahren von Hund und Fledermaus. Die Punktzahl der Ausrichtung  mit dem Hund beträgt 14 (16 Übereinstimmungen, 2 Fehlstellen) uns 3 mit der Fledermaus (12 Übereinstimmungen und 5 Fehlstellen, 1 Lücke der Länge 1).  Somit beträgt die Punktzahl an diesem Knoten 14 + 3 = 17.",
         "9":"Für die Gesamtpunktzahl benötigen Sie noch die Punkte des Mensch/Schimpansen-Vorfahrens und des Hund/Fledermaus-Vorfahrens mit dem Vorfahren an der Wurzel des Baums. Zuerst berechnen wir die Ausrichtung des Mensch/Schimpanse-Knotens mir dem globalen Vorfahren. Es gibt 9 Übereinstimmungen und 4 Fehlstellen (Lücken am Ende werden ignoriert). Die Summe beträgt 9 × (+1) + 4 × (‐1) = 5.",
         "10":"Dann berechnen wir die Punktzahl des Hund/Fledermaus-Vorfahrens mit dem globalen Vorfahren. Es gibt 18 Übereinstimmungen, die Summe beträgt 18. Damit beträgt die Summe am Wurzelknoten 5 + 18 = 23.",
          "11":"Ihre Endpunktzahl ist die Summe aller Einzelpunktzahlen, die wir bisher berechnet haben. Hier beträgt die Summe der Ausrichtung von Mensch und Schimpanse 17, die Summe der Ausrichtung von Hund und Fledermaus ist 17, und die Summe der Ausrichtung der Vorfahren mit der Wurzel ist 23. Damit beträgt Ihre Gesamtpunktzahl 57.",
         "12":"Sie haben die Höchstpunktzahl. Klicken Sie auf den Stern und senden Sie das Puzzle ab. Sie sind fertig! Die Level-Nr. dieses Puzzles ist 481. Jetzt sind Sie bereit zum Spiel!"

      },
      "misc":{
         "1":"Übereinstimmung",
         "2":"Fehlstelle",
         "3":"Lücke",
          "4":"Phylogenetischer Baum"

      }

   }
}
