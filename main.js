class Player {
	constructor(name, score=0) {
		this.name = name;
		this.score = score;
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

var addedAfterRound = 3; // 0 for never

var currentTurn = 0;
var currentBall = 0;

var timeOnColor = 0;

const turnName = document.getElementById("turnName");
const redsRemainingText = document.getElementById("redRemaining");
const timer = document.getElementById("timer");
const nextButton = document.getElementById("nextTurn");

var order = []

const redButton    = document.getElementById("red");
const yellowButton = document.getElementById("yellow");
const greenButton  = document.getElementById("green");
const brownButton  = document.getElementById("brown");
const blueButton   = document.getElementById("blue");
const pinkButton   = document.getElementById("pink");
const blackButton  = document.getElementById("black");

const ballButtons = [redButton, yellowButton, greenButton, brownButton, blueButton, pinkButton, blackButton];

var addedItems = [];

function extraButton() {
	var button = document.createElement("button");
	button.textContent = addedItems[Math.floor(Math.random()*addedItems.length)]
	button.classList.add("extraButton")
	button.onclick = function() { score(button) } 

	var ballButtonContainer = document.getElementById("scoreButtons");

	Array.from(ballButtonContainer.children).forEach((element) => {
		if (element.style.display == "block") { 
			button.dataset.score = element.dataset.score;
		}
	})

	ballButtonContainer.appendChild(button);
}

function playersIncludes(name) {
	for (const player in players) {
		if (players[player].name == name) {
			return true;
		}
	}
	return false;
}

function addName(name) {
	if (name) {
		players.push(new Player(name));
		return
	} 

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

	playersRanked = [...players];

	playersRanked.sort((a,b) => b.score - a.score);

	for (player in playersRanked) {
		leaderboard.appendChild(playersRanked[player].tableRow);
	}
}

function updateButtons(removeExtra=false) { 
	if (removeExtra){
		extraButtons = Array.from(document.getElementsByClassName("extraButton"));

		if (extraButtons.length > 0) {
			extraButtons.forEach((element) => element.remove());
		}
	}
	
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
	addedAfterRound = document.getElementById("addedAfterRound").value;

	if (addedAfterRound > 0) { getVehicles(); }

	order = generateOrder(redsRemaining);

	redsRemainingText.textContent = redsRemaining + " Reds Remaining";

	nextTurn();
}

async function getVehicles() {
	const url = window.location.href + "vehicles.json"

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	addedItems = await response.json();
}

function nextTurn() {
	nextButton.style.display = "none";

	document.getElementById("turn").style.textAlign = "left";

	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("scoreButtons").style.display = "block";

	if (order[currentBall] == 0) {
		currentBall++;
		timeOnColor = 0;
	}

	updateButtons();

	turnName.textContent = "It's " + players[currentTurn].name + "'s turn. ";

	timeOnColor++;

	if (timeOnColor > addedAfterRound * players.length && addedAfterRound != 0) {
		extraButton();
		timeOnColor = 1;
	}

	timer.textContent = turnDuration + "s";
	var timeRemaining = turnDuration - 1; 

	let timerInterval = setInterval(function() {
		timer.textContent = timeRemaining + "s";

		timeRemaining--;

		if (timeRemaining < 0) {
			clearInterval(timerInterval);
			timer.textContent = "";

			document.getElementById("scoreButtons").style.display = "none";
			document.getElementById("leaderboard").style.display = "table";

			updateLeaderboard();

			currentTurn++;

			currentTurn %= players.length;

			document.getElementById("turn").style.textAlign = "center";

			turnName.innerHTML = "Next up: " + players[currentTurn].name + "'s turn. ";


			nextButton.style.display = "block";

		}
	}, 1000);
}

function gameOver() {
	document.getElementById("turn").style.display = "none";
	document.getElementById("leaderboard").style.display = "table";
	document.getElementById("gameOver").style.display = "block";
	updateLeaderboard();
}

function score(btn) {
	ball = parseInt(btn.dataset.score);

	players[currentTurn].score += ball;

	if (ball == 1) {
		redsRemaining--;
		redsRemainingText.textContent = redsRemaining + " Reds Remaining";
	}

	currentBall++;

	if (currentBall > order.length - 1) {
		gameOver();
		return
	}

	updateButtons(true);

	timeOnColor = 1;
}

// addName("P1")
// addName("P2")
// start()
