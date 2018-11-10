window.onload = setup;
var version = "0.1";
var totalStones = 10000;
var spentStones = 0;
var remainingStones = totalStones - spentStones;
var fireTraps = 0;
var currentFireCost = 100;
var frostTraps = 0;
var currentFrostCost = 100;
var poisonTraps = 0;
var currentPoisonCost = 500;
var lightningTraps = 0;
var currentLightningCost = 1000;
var strengthTowers = 0;
var currentStrengthCost = 5000;
var condenserTowers = 0;
var currentCondenserCost = 5000;
var knowledgeTowers = 0;
var currentKnowledgeCost = 5000;

var rows = 10;
var maxCells = 5 * rows;

var selected = "none";
var bgColor = "#000000";
var baseDamage = 0;

var difficultyMod = 0;
var enemiesKilled = 0;
var enemiesEscaped = 0;

var cells = [];
class cell {
	constructor(id, name)
	{
		this.id = id;
		this.name = name;
		this.isPowered = false;
		this.isChilled = false;
		this.isFrozen = false; 
		this.isStrengthened = false;
		this.toxicity = 0;
		this.totalTox = 0;
		this.damage = 0;
		this.totalDamage = 0;
	}
}

class enemy {
	constructor (difficulty)
	{
		this.difficulty = difficulty;
		this.maxHP = 50 + (this.difficulty / 2) + Math.floor(Math.random() * 50 + this.difficulty);
		this.currentHP = maxHP;
		this.drops = Math.floor(this.maxHP / 20);
	}
}

function setup() {
	document.getElementById("version").innerHTML = "Version: " + version;
	for (i = 0; i <= maxCells; i++) {
		cells[i] = new cell(i, "empty");
	}
}

function selectTower(id) {
	document.getElementById("trapInfo").style.borderColor = "white";
	document.getElementById("sellTrap").style.borderColor = "white";
	document.getElementById("trapInfo").style.borderColor = "white";
	document.getElementById("selectFire").style.borderColor = "white";
	document.getElementById("selectFrost").style.borderColor = "white";
	document.getElementById("selectPoison").style.borderColor = "white";
	document.getElementById("selectLightning").style.borderColor = "white";
	document.getElementById("selectStrength").style.borderColor = "white";
	document.getElementById("selectCondenser").style.borderColor = "white";
	document.getElementById("selectKnowledge").style.borderColor = "white";
	
	switch(parseInt(id)) {
		case 0: 
			selected = "sell";
			bgColor = "#000000";
			document.getElementById("sellTrap").style.borderColor = "yellow";
			break;
		case 1:
			selected = "fire";
			bgColor = "#7F0505"
			document.getElementById("selectFire").style.borderColor = "yellow";
			break;
		case 2:
			selected = "frost";
			bgColor = "#02437C";
			document.getElementById("selectFrost").style.borderColor = "yellow";
			break;
		case 3:
			selected = "poison";
			bgColor = "#008238";
			document.getElementById("selectPoison").style.borderColor = "yellow";
			break;
		case 4:
			selected = "lightning";
			bgColor = "#A27D02";
			document.getElementById("selectLightning").style.borderColor = "yellow";
			break;
		case 5:
			selected = "strength";
			bgColor = "#684112";
			document.getElementById("selectStrength").style.borderColor = "yellow";
			break;
		case 6:
			selected = "condenser";
			bgColor = "#474747";
			document.getElementById("selectCondenser").style.borderColor = "yellow";
			break;
		case 7:
			selected = "knowledge";
			bgColor = "#2B112B";
			document.getElementById("selectKnowledge").style.borderColor = "yellow";
			break;
		case 8: 
			selected = "info";
			document.getElementById("trapInfo").style.borderColor = "yellow";
			break;
		default:
			console.log("Something went wrong with selectTower");
			break;
	}
	//console.log(selected);
}

function placeTower(where) {
	var cellNum = parseInt(where.charAt(0)) * 5 + parseInt(where.charAt(1));
	if (selected == "info") {
		document.getElementById("trapNum").innerHTML = cellNum;
		document.getElementById("trapType").innerHTML = cells[cellNum].name;
		document.getElementById("trapBoosted").innerHTML = cells[cellNum].isPowered;
		document.getElementById("trapChilled").innerHTML = cells[cellNum].isChilled;
		document.getElementById("trapFrozen").innerHTML = cells[cellNum].isFrozen;
		document.getElementById("trapStrength").innerHTML = cells[cellNum].isStrengthened;
		document.getElementById("trapTox").innerHTML = cells[cellNum].totalTox.toFixed(3);
		document.getElementById("trapDamage").innerHTML = Math.floor(cells[cellNum].damage);
		document.getElementById("trapTotalDamage").innerHTML = Math.floor(cells[cellNum].totalDamage);
		//console.log(cells[cellNum]);
	} else {
		
		document.getElementById(where).style.backgroundColor = bgColor;
		if (selected == "sell") {
			cells[cellNum] = new cell(cellNum, "empty");
		} else cells[cellNum].name = selected;
		clearVariables();
	}
	updateSpire();
}

function updateSpire() {
	for (i = 1; i <= maxCells; i++) {
		var currentCell = cells[i];
		var prevCell = cells[i - 1];
		var repeat = 1;
		if (currentCell.isChilled && currentCell.name != "knowledge") repeat = 2;
		if (currentCell.isFrozen && currentCell.name != "knowledge") repeat = 3;
		//if (currentCell.isBlocked) repeat += 1;
		var plus10 = i + 10;
		if (plus10 > maxCells) plus10 = maxCells;
		var plus5 = i + 5;
		if (plus5 > maxCells) plus5 = maxCells;
		currentCell.damage = 0;
		currentCell.toxicity = 0;
		currentCell.totalTox = 0;
		for (j = 1; j <= repeat; j++) {
			if (currentCell.name == "poison") {
				currentCell.toxicity += 3;
				if (currentCell.isPowered && j == 1) currentCell.toxicity += 3;
			} else if (currentCell.name == "fire") {
				var fireDamage = 70;
				if (currentCell.isStrengthened) fireDamage = 105;
				if (currentCell.isPowered && j == 1) currentCell.damage += fireDamage;
				currentCell.damage += fireDamage;
			} else if (currentCell.name == "frost") {
				currentCell.damage += 10;
				for (frosty = i + 1; frosty <= plus5; frosty++) {
					cells[frosty].isChilled = true;
				}
				if (currentCell.isPowered && j == 1) {
					currentCell.damage += 10;
					for (frosty = i + 1; frosty <= plus10; frosty++) {
						cells[frosty].isChilled = true;
					}
				}
				
			} else if (currentCell.name == "lightning") {
				cells[i + 1].isPowered = true;
				if (j == 2 || j == 3) currentCell.damage += 10;
				currentCell.damage += 10;
			} else if (currentCell.name == "strength") {
				currentCell.damage += 20;
				if (currentCell.isPowered && j == 1) currentCell.damage += 20;
			} else if (currentCell.name == "condenser") {
				if (currentCell.isPowered && j == 1) currentCell.totalTox += (prevCell.totalTox * 1.5);
				else if (j == 1) currentCell.totalTox += (prevCell.totalTox * 1.25);
				else if (j == 2) currentCell.totalTox *= 1.25;
				else if (j == 3) currentCell.totalTox *= 1.25;
				currentCell.toxicity = currentCell.totalTox - prevCell.totalTox;
			} else if (currentCell.name == "knowledge") {
				if (currentCell.isPowered && j == 1) {
					for (freezy = i + 1; freezy <= plus10; freezy++) {
						cells[freezy].isFrozen = true;
					}
				} else {
					for (freezy = i + 1; freezy <= plus5; freezy++) {
						cells[freezy].isFrozen = true;
					}
				}
			}
			currentCell.totalTox = prevCell.totalTox + currentCell.toxicity;
			currentCell.damage += currentCell.totalTox;
		}
		currentCell.totalDamage = prevCell.totalDamage + currentCell.damage;
	}
	document.getElementById("totalDamage").innerHTML = enumerate(cells[50].totalDamage);
}

function clearVariables() {
	spentStones = 0;
	fireTraps = 0;
	currentFireCost = 100;
	frostTraps = 0;
	currentFrostCost = 100;
	poisonTraps = 0;
	currentPoisonCost = 500;
	lightningTraps = 0
	currentLightningCost = 1000;
	strengthTowers = 0;
	currentStrengthCost = 5000;
	condenserTowers = 0;
	currentCondenserCost = 5000;
	knowledgeTowers = 0;
	currentKnowledgeCost = 5000;
	
	for (i = 1; i <= maxCells; i++) {
		var currentName = cells[i].name;
		cells[i] = new cell(i, currentName);
		if (currentName == "fire") {
			spentStones += currentFireCost;
			fireTraps++;
			currentFireCost = Math.floor(100 * Math.pow(1.1, fireTraps));
		}
		if (currentName == "frost") {
			spentStones += currentFrostCost;
			frostTraps++;
			currentFrostCost = Math.floor(100 * Math.pow(1.2, frostTraps));
			}
		if (currentName == "poison") {
			spentStones += currentPoisonCost;
			poisonTraps++;
			currentPoisonCost = Math.floor(500 * Math.pow(1.1, poisonTraps));
		}
		if (currentName == "lightning") {
			spentStones += currentLightningCost;
			lightningTraps++;
			currentLightningCost = Math.floor(1000 * Math.pow(1.5, lightningTraps));
		}
		if (currentName == "strength") {
			spentStones += currentStrengthCost;
			strengthTowers++;
			currentStrengthCost = Math.floor(5000 * Math.pow(10, strengthTowers));
		}
		if (currentName == "condenser") {
			spentStones += currentCondenserCost;
			condenserTowers++;
			currentCondenserCost = Math.floor(5000 * Math.pow(15, condenserTowers));
		}
		if (currentName == "knowledge") {
			spentStones += currentKnowledgeCost;
			knowledgeTowers++;
			currentKnowledgeCost = Math.floor(5000 * Math.pow(20, knowledgeTowers));
		}
	}
	for (i = 1; i <= maxCells; i++) {
		var currentName = cells[i].name;
		if (currentName == "strength") {
			var row = 5 * Math.floor((i - 1) / 5);
			for (j = 1; j <= 5; j++) {
				cells[row + j].isStrengthened = true;
			}
		}
	}
	
	remainingStones = totalStones - spentStones;
	document.getElementById("spentStones").innerHTML = enumerate(spentStones);
	document.getElementById("remainingStones").innerHTML = enumerate(remainingStones);
	document.getElementById("fireCost").innerHTML = currentFireCost;
	document.getElementById("frostCost").innerHTML = currentFrostCost;
	document.getElementById("poisonCost").innerHTML = currentPoisonCost;
	document.getElementById("lightningCost").innerHTML = enumerate(currentLightningCost);
	document.getElementById("strengthCost").innerHTML = enumerate(currentStrengthCost);
	document.getElementById("condenserCost").innerHTML = enumerate(currentCondenserCost);
	document.getElementById("knowledgeCost").innerHTML = enumerate(currentKnowledgeCost);
}

function resetSpire() {
	setup();
	//var lastSelected = selected;
	selectTower(0);
	for (k = 1; k <= 5; k++) {
		for (l = 0; l < 10; l++) {
			var c = "" + l + "" + k;
			placeTower(c);
		}
	}
	selectTower(8);
}

function getDifficulty() {
	difficultyMod = 0;
	difficultyMod += enemiesKilled * 4;
	difficultyMod -= enemiesEscaped * 2;
	if (difficultyMod < 0.1) difficultyMod = 0.1;
	difficultyMod = Math.floor(difficultyMod * 10) / 10;
	return difficultyMod;
}

//Make numbers look good.
function enumerate(x) {
	if (isNaN(x)) return x;
	if (x <= 9999) return x;
	if (x <= 100000) return (x/1000).toFixed(1) + "K";
	if (x <= 1000000) return (x/1000).toFixed(0) + "K";
	if (x <= 10000000) return (x/1000000).toFixed(2) + "M";
	if (x <= 100000000) return (x/1000000).toFixed(1) + "M";
	if (x <= 1000000000) return (x/1000000).toFixed(0) + "M";
	if (x <= 10000000000) return (x/1000000000).toFixed(2) + "B";
	if (x <= 100000000000) return (x/1000000000).toFixed(1) + "B";
	if (x <= 1000000000000) return (x/1000000000).toFixed(0) + "B";
	if (x <= 10000000000000) return (x/1000000000000).toFixed(2) + "T";
	if (x <= 100000000000000) return (x/1000000000000).toFixed(1) + "T";
	if (x <= 1000000000000000) return (x/1000000000000).toFixed(0) + "T";
	if (x <= 10000000000000000) return (x/1000000000000000).toFixed(2) + "Qa";
	if (x <= 100000000000000000) return (x/1000000000000000).toFixed(1) + "Qa";
	if (x <= 1000000000000000000) return (x/1000000000000000).toFixed(0) + "Qa";
	if (x <= 10000000000000000000) return (x/1000000000000000000).toFixed(2) + "Qi";
	if (x <= 100000000000000000000) return (x/1000000000000000000).toFixed(1) + "Qi";
	if (x <= 1000000000000000000000) return (x/1000000000000000000).toFixed(0) + "Qi";
	if (x <= 10000000000000000000000) return (x/1000000000000000000000).toFixed(2) + "Sx";
	if (x <= 100000000000000000000000) return (x/1000000000000000000000).toFixed(1) + "Sx";
	if (x <= 1000000000000000000000000) return (x/1000000000000000000000).toFixed(0) + "Sx";
	if (x <= 10000000000000000000000000) return (x/1000000000000000000000000).toFixed(2) + "Sp";
	if (x <= 100000000000000000000000000) return (x/1000000000000000000000000).toFixed(1) + "Sp";
	if (x <= 1000000000000000000000000000) return (x/1000000000000000000000000).toFixed(0) + "Sp";
	if (x <= 10000000000000000000000000000) return (x/1000000000000000000000000000).toFixed(2) + "Oc";
	if (x <= 100000000000000000000000000000) return (x/1000000000000000000000000000).toFixed(1) + "Oc";
	if (x <= 1000000000000000000000000000000) return (x/1000000000000000000000000000).toFixed(0) + "Oc";
	if (x <= 10000000000000000000000000000000) return (x/1000000000000000000000000000000).toFixed(2) + "No";
	if (x <= 100000000000000000000000000000000) return (x/1000000000000000000000000000000).toFixed(1) + "No";
	if (x <= 1000000000000000000000000000000000) return (x/1000000000000000000000000000000).toFixed(0) + "No";
	if (x <= 10000000000000000000000000000000000) return (x/1000000000000000000000000000000000).toFixed(2) + "Dc";
	if (x <= 100000000000000000000000000000000000) return (x/1000000000000000000000000000000000).toFixed(1) + "Dc";
	if (x <= 1000000000000000000000000000000000000) return (x/1000000000000000000000000000000000).toFixed(0) + "Dc";
	//add a while loop to deal with the rest
	x = (x/1000000000000000000000000000000000000).toFixed(3);
	var n = 36;
	while (x > 999.999) {
		x = (x/1000);
		n += 3;
	}
	if (x < 1000) x = (x/1).toFixed(0);
	if (x < 100) x = (x/1).toFixed(1);
	if (x < 10) x = (x/1).toFixed(2);
	return x + "e" + n;
}

function save() {
	var save = {
		cells : cells,
		totalStones : totalStones
	}
	localStorage.setItem("buildAspire", JSON.stringify(save));
}

function load() {
	var save = JSON.parse(localStorage.getItem("buildAspire"));
	if (save != null) {
		if (typeof save.cells != undefined) cells = save.cells;
		if (typeof save.totalStones != undefined) totalStones = save.totalStones;
		clearVariables();
		updateSpire();
		selectTower(8);
		for (i = 1; i <= maxCells; i++) {
			var where = Math.floor((i - 1) / 5);
			where += "" + (((i - 1) % 5) + 1);
			switch(cells[i].name) {
				case "empty":
					document.getElementById(where).style.backgroundColor = "black";
					break;
				case "fire":
					document.getElementById(where).style.backgroundColor = "#7F0505";
					break;
				case "frost":
					document.getElementById(where).style.backgroundColor = "#02437C";
					break;
				case "poison":
					document.getElementById(where).style.backgroundColor = "#008238";
					break;
				case "lightning":
					document.getElementById(where).style.backgroundColor = "#A27D02";
					break;
				case "strength":
					document.getElementById(where).style.backgroundColor = "#684112";
					break;
				case "condenser":
					document.getElementById(where).style.backgroundColor = "#474747";
					break;
				case "knowledge":
					document.getElementById(where).style.backgroundColor = "#2B112B";
					break;
				default: 
					console.log("Something went wrong with load!");
					break;
			}
		}
	}
}

