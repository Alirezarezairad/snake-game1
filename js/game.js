let //Diese Variable bezieht sich auf das canvas-Element im HTML-Dokument. Auf diesem Element wird das Spiel gezeichnet.
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),  //Dies ist der "Zeichenkontext" des canvas, der verwendet wird, um Grafiken zu zeichnen.
	scoreBlock = document.getElementById('score'), //Repräsentiert das HTML-Element, in dem die aktuelle Punktzahl angezeigt wird.
	scoreCount = 0,  //Hält die aktuelle Punktzahl des Spiels.
	bestScoreBlock = document.getElementById('best-score'), //Repräsentiert das HTML-Element, in dem die beste erreichte Punktzahl gespeichert wird.
	dir = '', //Diese Variable hält die aktuelle Richtung der Schlange.
	diff = 'Easy', //Bezeichnet den Schwierigkeitsgrad des Spiels ("Easy" oder "Hard").
	diffBlock = document.getElementById('difficulty'), //Repräsentiert das HTML-Element, das den aktuellen Schwierigkeitsgrad anzeigt.
	btnChange = document.getElementById('changeDif'); //Repräsentiert den Button, mit dem der Schwierigkeitsgrad geändert werden kann.

const config = { // Ein Objekt, das allgemeine Einstellungen für das Spiel speichert.
	sizeCell: 25,//Die Größe jeder Zelle des Spielfeldes (im Grunde die Größe eines Segments der Schlange).
	sizeFood: 25,// Die Größe des Essens auf dem Spielfeld.
	step: 0,//Eine Zählvariable, die verwendet wird, um die Bewegung der Schlange zu kontrollieren.
	stepMax: 7,//Die maximale Anzahl von Schritten zwischen Bewegungen der Schlange.
}

const snake = { // Ein Objekt, das alle Eigenschaften der Schlange speichert
	x: config.sizeCell,//Die aktuelle Position der Schlange auf dem Spielfeld.
	y: config.sizeCell,//Die aktuelle Position der Schlange auf dem Spielfeld.
	dirX: 0, // Die Richtung der Schlange in x- und y-Richtung (Horizontal und Vertikal).
	dirY: 0, // Die Richtung der Schlange in x- und y-Richtung (Horizontal und Vertikal).
	body: [],//Ein Array, das die Position jedes Segments der Schlange speichert.
	maxBodySize: 1,//Die maximale Länge der Schlange.
}
const snakeSkins = [ //Ein Array, das die Dateipfade der Grafiken der Schlange enthält.
	'../img/snake/head.svg',
];
const snakeImages = [//Ein Array von Bildobjekten (Image), die im Spiel verwendet werden.
	imgHead = new Image(),
];
for (let i = 0; i < snakeImages.length; i++) { //Diese Schleife weist den snakeImages die entsprechenden Bilder aus snakeSkins zu.
	snakeImages[i].src = snakeSkins[i];
}

const food = { // Ein Objekt, das die Position des Essens auf dem Spielfeld speichert
	x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell,//Zufällige Positionen, an denen das Essen auf dem Spielfeld erscheint.
	y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell,//Zufällige Positionen, an denen das Essen auf dem Spielfeld erscheint.
}
console.log(food);
const images = [ // Ein Array von Dateipfaden zu den Bildern des Essens.
	'../img/food/apple.svg',
	'../img/food/carrot.svg',
	'../img/food/eggplant.svg',
	'../img/food/banana.svg',
];
let img = new Image();//Ein Bildobjekt, das standardmäßig das erste Bild aus dem images-Array enthält.
img.src = images[0]; // the default will be the first image

const bomb = { // Ein Objekt, das die Position der Bombe speichert, die standardmäßig außerhalb des Spielfelds versteckt ist.
	x: -config.sizeCell,
	y: -config.sizeCell,
};
const bombImg = new Image();//Ein Bildobjekt für die Bombe.
bombImg.src = './img/food/bomb.svg';

const audio = [ // Ein Array von Dateipfaden zu den Audiodateien des Spiels.
	'../audio/eat.mp3',
	'../audio/turn.mp3',
	'../audio/dead.mp3',
	'../audio/hit.mp3',
];
const audioNames = [//Ein Array von Audio-Objekten.
	audioEat = new Audio(),
	audioTurn = new Audio(),
	audioDead = new Audio(),
	audioHit = new Audio(),
];
for (let i = 0; i < audio.length; i++) {//Diese Schleife weist den Audio-Objekten die entsprechenden Dateipfade aus audio zu.
	audioNames[i].src = audio[i];
}//Die Schleife läuft so oft, wie es Einträge im audio-Array gibt. i ist der Zähler, der bei 0 startet und mit jeder Iteration um 1 erhöht wird, bis i die Anzahl der Audio-Dateien im Array audio erreicht.
//Die Schleife sorgt dafür, dass jeder Eintrag im audioNames-Array den richtigen Pfad zu einer Audiodatei aus dem audio-Array erhält, sodass die Audio-Elemente dann die entsprechenden Audiodateien abspielen können.
// canvas settings
window.addEventListener('load', (e) => {//Diese Funktion wird aufgerufen, sobald die Seite geladen ist. Sie passt die Größe und das Aussehen des Spielfelds basierend auf der Breite des Fensters an.
	if (window.innerWidth <= 650) {
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.border = "30px outset rgba(0,0,0,.8)";
		canvas.boxShadow = " 0px 0px 0px black, 0 0 3em rgb(0,0,250), 0 0 3em rgb(0,0,250)";
		canvas.margin = "0 auto";
		canvas.display = "block";
		canvas.backgroundColor = "rgba(0, 150, 200,.8)";
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 15;
		config.sizeFood = 15;
		restart();
	}
	else if (window.innerWidth > 650) {
		canvas.width = 600;
		canvas.height = 480;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 24;
		config.sizeFood = 24;
		restart();
	}
});
// adaptive
window.addEventListener('resize', (e) => {//Diese Funktion passt das Spielfeld an, wenn das Fenster in der Größe verändert wird.
	if (window.innerWidth <= 650) {
		canvas.width = 300;
		canvas.height = 300;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 15;
		config.sizeFood = 15;
	}
	else if (window.innerWidth > 650) {
		canvas.width = 600;
		canvas.height = 480;
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		config.sizeCell = 24;
		config.sizeFood = 24;
	}
});
// score
function score() {// Diese Funktion erhöht die Punktzahl und passt die Geschwindigkeit der Schlange an.
	scoreCount++;
	bestScore();//Speichert und zeigt die höchste Punktzahl im localStorage an.
	if (scoreCount > 15) config.stepMax = 5;
	else if (scoreCount <= 15) config.stepMax = 6;
	drawScore();//Aktualisiert die angezeigte Punktzahl im Spiel.
}
function drawScore() {//Aktualisiert die angezeigte Punktzahl im Spiel.

	scoreBlock.innerHTML = scoreCount;
}
function bestScore() {//Speichert und zeigt die höchste Punktzahl im localStorage an.
	if (!localStorage.getItem('best score')) {
		localStorage.setItem('best score', 0);
	}
	if (scoreCount > localStorage.getItem('best score')) {
		localStorage.setItem('best score', scoreCount);
	}
	bestScoreBlock.innerHTML = localStorage.getItem('best score');
}

// game
function gameLoop() {//Diese Funktion sorgt dafür, dass die gameLoop-Funktion wiederholt ausgeführt wird, was das Spiel kontinuierlich aktualisiert.

	requestAnimationFrame(gameLoop);

	if (++config.step < config.stepMax) return;
	config.step = 0;//Diese Zeile steuert die Geschwindigkeit der Schlange. Die Schlange bewegt sich nur, wenn der step-Wert den stepMax-Wert erreicht.


	ctx.clearRect(0, 0, canvas.width, canvas.height); // Dies löscht den Canvas, bevor die Schlange und das Essen neu gezeichnet werden.
	drawFood();//eichnen die entsprechenden Elemente auf den Canvas.
	drawSnake();
	if (diff === 'Hard') {//Wenn der Schwierigkeitsgrad auf "Hard" gesetzt ist, wird eine rote Umrandung gezeichnet und eine Bombe hinzugefügt.
		ctx.strokeStyle = '#f00';
		ctx.lineWidth = 5;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		drawBomb();
	};
}
gameLoop();

// difficulty, restart
function checkBorder() { // Diese Funktion stellt sicher, dass die Schlange am anderen Rand des Spielfelds erscheint, wenn sie einen Rand erreicht. Dies wird nur im "Easy"-Modus verwendet.
	// x
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if (snake.x >= canvas.width) {
		snake.x = 0;
	}
	// y
	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if (snake.y >= canvas.height) {
		snake.y = 0;
	}
}

function withoutBorder() { //  Diese Funktion beendet das Spiel und startet es neu, wenn die Schlange einen Rand berührt, was im "Hard"-Modus geschieht.
	if (snake.x < 0) {
		audioPlay('dead');
		alert("GAME OVER")
		restart();
	} else if (snake.x >= canvas.width) {
		audioPlay('dead');
		alert("GAME OVER")
		restart();
	}
	if (snake.y < 0) {
		audioPlay('dead');
		alert("GAME OVER")
		restart();
	} else if (snake.y >= canvas.height) {
		audioPlay('dead');
		alert("GAME OVER")
		restart();
	}
}

function restart() { // Diese Funktion setzt das Spiel zurück. Die Schlange wird auf ihre Anfangslänge und -position zurückgesetzt, und das Essen sowie die Bombe (falls "Hard" aktiviert ist) werden neu positioniert.
	config.stepMax = 6;
	scoreCount = 0;
	drawScore();

	snake.x = config.sizeCell;
	snake.y = config.sizeCell;
	snake.body = [];
	snake.maxBodySize = 1;
	snake.dirX = 0;
	snake.dirY = 0;
	dir = '';

	randomPosFood();
	if (diff === 'Hard') randomPosBomb();
}


// draw snake
function drawSnake() {//Die Position der Schlange wird durch snake.dirX und snake.dirY verändert.
	snake.x += snake.dirX;
	snake.y += snake.dirY;

	if (diff === 'Easy') checkBorder();// Im "Easy"-Modus wird die checkBorder()-Funktion verwendet, im "Hard"-Modus die withoutBorder()-Funktion.
	if (diff === 'Hard') withoutBorder();

	// Das snake.body-Array verwaltet die Länge der Schlange. Neue Segmente werden am Anfang hinzugefügt, und alte Segmente werden entfernt, wenn die Schlange ihre maximale Länge erreicht.
	snake.body.unshift({ x: snake.x, y: snake.y });
	if (snake.body.length > snake.maxBodySize) {
		snake.body.pop();
	}
	//Wenn die Schlange auf das Essen trifft, wird sie länger und die Punktzahl erhöht. Im "Hard"-Modus wird außerdem die Bombe neu positioniert. Wenn die Schlange auf die Bombe trifft, wird die Länge reduziert oder das Spiel endet.
	snake.body.forEach((e, index) => {

		snakeStyles(e, index);
		if (e.x == food.x && e.y == food.y) { // wenn die schlange das futter frisst
			audioPlay('eat');
			score();
			randomPosFood();
			snake.maxBodySize++;

			if (diff === 'Hard') {
				randomPosBomb();
			}
		}

		if (diff === 'Hard') { // if snake has touched the bomd, reduce the length of the snake
			if (e.x === bomb.x && e.y === bomb.y) {
				if (scoreCount >= 2) {
					audioPlay('hit');
					scoreCount = Math.ceil(scoreCount / 2);
					snake.maxBodySize = scoreCount + 1;
					for (let i = 0; i < snake.maxBodySize; i++) {
						snake.body.pop();
					}
					drawScore();
					randomPosFood();
					randomPosBomb();
				} else {
					audioPlay('dead');
					alert("GAME OVER")
					restart()
				}
			}
		}

		// Checking if the snake has touched the tail
		for (let i = index + 1; i < snake.body.length; i++) {
			if (e.x === snake.body[i].x && e.y === snake.body[i].y) {
				audioPlay('dead');
				alert("GAME OVER")
				restart();
			}
		}
	});
}
// snake styles
function snakeStyles(e, index) {//// Diese Funktion zeichnet die Schlange. Der Kopf der Schlange wird als Bild gezeichnet, während die restlichen Segmente als farbige Rechtecke gezeichnet werden.
	if (index === 0) { // for the first snake element(head)
		ctx.drawImage(snakeImages[0], e.x, e.y, config.sizeCell, config.sizeCell);
	}
	else { // other elements
		ctx.fillStyle = '#093D14';
		ctx.strokeStyle = '#071510';
		ctx.lineWidth = 1;
		ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);
		ctx.strokeRect(e.x, e.y, config.sizeCell - 1, config.sizeCell - 1);
	}
}

// draw food
function drawFood() { //Diese Funktion zeichnet das Essen auf dem Canvas.
	ctx.drawImage(img, food.x, food.y, config.sizeFood, config.sizeFood);
}

// draw bomb
function drawBomb() { //Diese Funktion zeichnet die Bombe auf dem Canvas.
	ctx.drawImage(bombImg, bomb.x, bomb.y, config.sizeFood, config.sizeFood);
}

// Load the best score
document.addEventListener('load', bestScore());

// constrols
//Diese Funktionen ändern die Richtung der Schlange basierend auf der Benutzereingabe, wobei verhindert wird, dass die Schlange direkt in die entgegengesetzte Richtung dreht.
function turnUp() {
	if (dir != 'down') {
		audioPlay('turn');
		dir = 'up';
		snake.dirY = -config.sizeCell;
		snake.dirX = 0;
	}
}
function turnLeft() {
	if (dir != 'right') {
		audioPlay('turn');
		dir = 'left';
		snake.dirX = -config.sizeCell;
		snake.dirY = 0;
	}
}
function turnDown() {
	if (dir != 'up') {
		audioPlay('turn');
		dir = 'down';
		snake.dirY = config.sizeCell;
		snake.dirX = 0;
	}
}
function turnRight() {
	if (dir != 'left') {
		audioPlay('turn');
		dir = 'right';
		snake.dirX = config.sizeCell;
		snake.dirY = 0;
	}
}
//Diese Funktion überwacht Tastaturereignisse und ändert die Richtung der Schlange entsprechend.
document.addEventListener('keydown', (e) => {
	if (e.keyCode == 87 || e.keyCode == 38) { // W (up) or arrow up
		turnUp();
	}
	else if (e.keyCode == 65 || e.keyCode == 37) { // A (left) or arrow left
		turnLeft();
	}
	else if (e.keyCode == 83 || e.keyCode == 40) { // S (down) or arrow down
		turnDown();
	}
	else if (e.keyCode == 68 || e.keyCode == 39) { // D (right) or arrow right
		turnRight();
	}
});

// Variablen, um die Position des Touch-Starts und -Endes zu speichern
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Funktion zur Erkennung der Wischrichtung
function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontaler Swipe
        if (diffX > 0) {
            turnRight(); // Wisch nach rechts
        } else {
            turnLeft(); // Wisch nach links
        }
    } else {
        // Vertikaler Swipe
        if (diffY > 0) {
            turnDown(); // Wisch nach unten
        } else {
            turnUp(); // Wisch nach oben
        }
    }
}

// Ereignislistener für Touch-Steuerung
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Verhindert, dass der Bildschirm scrollt
});

canvas.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe(); // Wischrichtung auswerten
});

// schwerichkeiten
btnChange.addEventListener('click', (e) => {
	if (diff === 'Easy') {
		diff = 'Hard';
		diffBlock.innerHTML = 'Hard';
		restart();
	} else {
		diff = 'Easy';
		diffBlock.innerHTML = 'Easy';
		restart();
	}
});
// Variablen für Touch-Start-Koordinaten
let startX = 0;
let startY = 0;

// Eventlistener für Touchstart
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]; // Erster Touchpunkt
    startX = touch.clientX;
    startY = touch.clientY;
});

// Eventlistener für Touchmove
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Verhindert das Scrollen während des Spiels

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Überprüfen der Bewegungsrichtung
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontaler Wisch
        if (deltaX > 0 && dir !== 'left') {
            // Nach rechts wischen
            turnRight();
        } else if (deltaX < 0 && dir !== 'right') {
            // Nach links wischen
            turnLeft();
        }
    } else {
        // Vertikaler Wisch
        if (deltaY > 0 && dir !== 'up') {
            // Nach unten wischen
            turnDown();
        } else if (deltaY < 0 && dir !== 'down') {
            // Nach oben wischen
            turnUp();
        }
    }

    // Reset Touch-Start-Koordinaten
    startX = touch.clientX;
    startY = touch.clientY;
});

// Eventlistener für Touchend (optional, falls nötig)
canvas.addEventListener('touchend', () => {
    // Hier kannst du weitere Aktionen hinzufügen, falls nötig
});


// Additional functions
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
function randomImg() { // random img ( for food )
	let imgCount = randomInt(0, images.length);
	let imgPath = images[imgCount];
	img.src = imgPath;
	return img;
}
//randomPosFood() und randomPosBomb(): Diese Funktionen setzen die Position von Essen und Bomben zufällig neu.
function randomPosFood() { // random food position
	ctx.drawImage(randomImg(), food.x, food.y, config.sizeFood, config.sizeFood);
	food.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	food.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
	drawFood();
}

function randomPosBomb() { // random bomb position
	let chance = randomInt(1, 5);
	if (chance === 3) {
		bomb.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
		bomb.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
		drawBomb();
	}
	else {
		bomb.x = -config.sizeCell;
		bomb.y = -config.sizeCell;
		drawBomb();
	}
}
// Diese Funktion spielt verschiedene Sounds ab, abhängig von den Ereignissen im Spiel.
function audioPlay(name) { // play audio
	if (name === 'eat') {
		audioNames[0].play();
	}
	if (name === 'turn') {
		audioNames[1].play();
	}
	if (name === 'dead') {
		audioNames[2].play();
	}
	if (name === 'hit') {
		audioNames[3].play();
	}
}