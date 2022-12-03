# Web-Engineering Abschlussprojekt

## Installation

1. Dieses Repository in ein beliebiges Verzeichnis klonen bzw. die Zip aus der Mail entpacken
2. Eine Shell in dem soeben entpackten Verzeichnis öffnen (in jenem Ordner sollten die Dateien myWebServer.js, package.json etc. liegen)
3. Command ausführen: ```npm install```
4. Nach der Installation sollte automatisch eine .env-Datei im Verzeichnis angelegt werden. Falls dies nicht geschehen ist, erstellen Sie die Datei bitte manuell [^1]
5. .env-Datei öffnen und einen gültigen API-Schlüssel für die API von OpeanWeatherMap.org hinterlegen [^2]
6. Die Installation ist abgeschlossen

## Start

1. Eine Shell im Projekverzeichnis öffnen (gleicher Pfad wie bei Installation)
2. ```node myWebServer.js```
3. Der Server startet nun auf dem Port 6001

## Beenden

Zum Beenden des Webservers die Tastenkombination ```Strg + C``` drücken

## Neue Funktionen

- (alle für das Projekt geforderten Teilprojekte)
- Die Website wurde so angepasst, dass nun auch aus dem gesamten LAN auf die Website und alle Funktionen zugegriffen werden kann (erforderte Anpassung der Proxy-IP von "localhost" zu ```location.host```)
- Es wurde eine weitere Navigation mit Icons hinzugefügt, die die Standard-Navigation auf sehr kleinen Bildschirmen ersetzt
- Die Website wurde mit zwei verschiedenen Computern, einem Tablet und einem Smartphone vollständig responsive entwickelt

## Verschiedenes

- Falls gewünscht, kann der automatische Sass-Compiler mit der Datei ```start-sass.bat``` gestartet werden (ist nicht für den Betrieb erforderlich; Bat-Dateien funktionieren nur in Windows)
- Die JavaScript-Aufgabe Nr. 2 aus der Vorlesung ist ebenfalls in diesem Projekt enthalten, allerding ist sie nicht über die normale Navigation zu erreichen (siehe #Informationen auf Startseite unter ```http://localhost:6001/```)

Bei Rückfragen stehe ich gerne per Mail zur Verfügung!

[^1]: Dafür eine neue Datei ".env" anlegen und ```API_OPENWEATHER_KEY={Ihr API-Key}``` in die Datei schreiben
[^2]: Zur einfachen Demonstration können Sie folgenden API-Key benutzen: 2f5468c2cd88a4cfe1b69720aa6ce5df. Dieser Key wurde explizit für dieses Projekt angelegt und kann frei benutzt werden, da das kostenlose Modell verwendet wird
