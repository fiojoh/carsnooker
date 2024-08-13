class Player {
	constructor(name) {
		this.name = name;
		this.score = 0;
	}

	get tableRow() {
		var row = document.createElement("tr");
		var nameElement = document.createElement("td");
		var scoreElement = document.createElement("td");

		nameElement.textContent = this.name;
		scoreElement.textContent = this.score;

		row.appendChild(nameElement);
		row.appendChild(scoreElement);

		return row
	}
}

var players = []
var turnDuration = 60;

var redsRemaining = 15;

var currentTurn = 0;
var currentBall = 0;

const turnName = document.getElementById("turnName");
const redsRemainingText = document.getElementById("redRemaining");
const timer = document.getElementById("timer");
const nextButton = document.getElementById("nextTurn");

var order = []
// const order = [1, 0]

const redButton    = document.getElementById("red");
const yellowButton = document.getElementById("yellow");
const greenButton  = document.getElementById("green");
const brownButton  = document.getElementById("brown");
const blueButton   = document.getElementById("blue");
const pinkButton   = document.getElementById("pink");
const blackButton  = document.getElementById("black");

const ballButtons = [redButton, yellowButton, greenButton, brownButton, blueButton, pinkButton, blackButton];

function playersIncludes(name) {
	for (const player in players) {
		if (players[player].name == name) {
			return true;
		}
	}
	return false;
}

function addName() {
	const nameEntry = document.getElementById("enterName");
	const nameEntryError = document.getElementById("enterNameErr");

	nameEntryError.textContent = "";

	if (nameEntry.value == "") {
		nameEntryError.textContent = "Name cannot be blank.";
		return
	} 

	if (playersIncludes(nameEntry.value)) {
		nameEntryError.textContent = "Name's cannot be duplicate";
		return
	}

	players.push(new Player(nameEntry.value));

	const nameList = document.getElementById("names");

	var name = document.createElement("li");
	name.textContent = nameEntry.value;

	nameList.appendChild(name);

	nameEntry.value = "";
}

function generateOrder(numReds) {
	var order = []

	for (var i = 0; i < numReds; i++) {
		order.push(1, 0);
	}

	order.push(2, 3, 4, 5, 6, 7);

	return order;
}

function updateLeaderboard() {
	leaderboard.innerHTML = '';

	var headers = document.createElement("tr");
	var playerHeader = document.createElement("th");
	var scoreHeader = document.createElement("th");

	playerHeader.textContent = "Player";
	scoreHeader.textContent = "Score";

	headers.appendChild(playerHeader);
	headers.appendChild(scoreHeader);

	leaderboard.appendChild(headers);

	for (player in players) {
		leaderboard.appendChild(players[player].tableRow);
	}
}

function updateButtons() { 
	ballButtons.forEach((element) => element.style.display = "none");

	if (order[currentBall] == 0){
		ballButtons.forEach((element) => element.style.display = "block");
		ballButtons[0].style.display = "none";

		return
	}

	ballButtons[order[currentBall] - 1].style.display = "block";

}

function start() {
	if (players.length < 2) {
		const nameEntryError = document.getElementById("enterNameErr");	

		nameEntryError.textContent = "Please add at least two players.";
		return
	}

	document.getElementById("setup").style.display = "none";
	document.getElementById("turn").style.display = "block";

	redsRemaining = document.getElementById("numReds").value;
	turnDuration = document.getElementById("enterDuration").value;

	order = generateOrder(redsRemaining);

	redsRemainingText.textContent = "Reds Remaining: " + redsRemaining;

	nextTurn();
}

function nextTurn() {
	nextButton.style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("scoreButtons").style.display = "block";

	if (order[currentBall] == 0) {
		currentBall++;
	}

	updateButtons();

	turnName.textContent = "It is " + players[currentTurn].name + "'s turn. ";

	timer.textContent = turnDuration + "s";
	var timeRemaining = turnDuration - 1; 



	let timerInterval = setInterval(function() {
		timer.textContent = timeRemaining + "s";

		timeRemaining--;

		if (timeRemaining < 0) {
			clearInterval(timerInterval);
			timer.textContent = "Time's up";

			document.getElementById("scoreButtons").style.display = "none";
			document.getElementById("leaderboard").style.display = "block";

			updateLeaderboard();

			currentTurn++;

			currentTurn %= players.length;

			turnName.textContent = "Next up it is " + players[currentTurn].name + "'s turn. ";

			nextButton.style.display = "block";

		}
	}, 1000);
}

function score(ball) {
	players[currentTurn].score += ball;

	if (ball == 1) {
		redsRemaining--;
		redsRemainingText.textContent = "Reds Remaining: " + redsRemaining;
	}

	currentBall++;

	if (currentBall > order.length - 1) {
		document.getElementById("turn").style.display = "none";
		document.getElementById("leaderboard").style.display = "block";
		document.getElementById("gameOver").style.display = "block";
		updateLeaderboard();
		return
	}

	updateButtons();
}


