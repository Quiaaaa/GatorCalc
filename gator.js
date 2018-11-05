window.onload = setup;
var ticked = false;
var fuelStart = 230;
var fuelEnd = 230;
var fuelZones = fuelEnd - fuelStart;
var runEnd = 230;
var maxZone = 700; //Put this higher if there's a change for someone to reach this high.
var housingMod = 1;
var spiresCleared = 0;
var carp = 0;
var carp2 = 0;
var carpMod = 0;
var coord = 0;
var efficiency = 0;
var capacity = 0;
var maxCapacity = 3;
var supply = 0;
var maxSupply = 0.2;
var overclock = 0;
var overclocker = 0;
var storage = 2;
var slowburn = 0.4;
var magmaFlow = true;
var magmaCells = 18;
var popPerTick = 0;
var minTick = 0;
var maxTick = 0;
var tickRatio = 0;

var totalPop = 0;
var currentPop = [];
var finalAmals = 0;
var tauntimpPercent = 0;
var maxAmals = 0;
var lastCoord = 0;
var finalAmalZone = 0;
var neededPop = 0;
var finalArmySize = 0;
var coordIncrease = 0;
var coordinations = [];
var finalAmalRatio = 0;
var yourFinalRatio = 0;
var zonesOfMI = 0;
var magmaZones = 0;
var totalMI = 0;
var maxSupplyZone = 0;

var ar1 = 10000000000;
var ar2;
var ar3;
var ar4;
var ar5;

var fuelThisZone = [];
var totalFuel = [];
var overclockTicks = [];
var overclockPop = [];
var overclockPopThisZone = [];
var popWithTauntimp = [];
var popFromTauntimp = [];
var percentFromTauntimp = [];
var tauntimpThisZone = [];
var coordPop = [];
var amalRatio = [];
var adjustedRatio = [];
var currentAmals = [];

var minimizeZone = 0;

function setup() {
	loadSettings();
}

function changeFuelStart(value) {
	fuelStart = parseInt(value);
	if (fuelStart < 230) fuelStart = 230;
	if (fuelStart > fuelEnd) fuelEnd = fuelStart;
	if (fuelStart > runEnd) runEnd = fuelStart;
	fuelZones = fuelEnd - fuelStart;
	document.getElementById("fuelZones").value = (fuelEnd - fuelStart);
	calculateMagma();
	calculateCurrentPop();
}

function changeFuelEnd(value) {
	fuelEnd = parseInt(value);
	if (fuelEnd < fuelStart) fuelStart = fuelEnd;
	if (fuelEnd > runEnd) runEnd = fuelEnd;
	fuelZones = fuelEnd - fuelStart;
	document.getElementById("fuelZones").value = (fuelEnd - fuelStart);
	if (fuelZones != (fuelEnd - fuelStart)) changeFuelZones(fuelEnd - fuelStart);
	calculateMagma();
	calculateCurrentPop();
}

function changeFuelZones(value) {
	fuelZones = parseInt(value);
	fuelEnd = fuelStart + fuelZones;
	document.getElementById("fuelEnd").value = (fuelStart + fuelZones);
	if (fuelEnd != (fuelStart + fuelZones)) changeFuelEnd(fuelStart + fuelZones);
	calculateMagma();
	calculateCurrentPop();
}

function changeRunEnd(value) {
	runEnd = parseInt(value);
	calculateMagma();
	calculateCurrentPop();
}

function changeHousingMod(value) {
	housingMod = parseFloat(value);
	calculateCurrentPop();
}

function changeSpiresCleared(value) {
	spiresCleared = parseInt(value);
	calculateFinalAmalRatio();
	if (spiresCleared >= 2) ar2 = 1000000000;
	else ar2 = ar1;
	if (spiresCleared >= 3) ar3 = 100000000;
	else ar3 = ar2;
	if (spiresCleared >= 4) ar4 = 10000000;
	else ar4 = ar3;
	if (spiresCleared >= 5) ar5 = 1000000;
	else ar5 = ar4;
	calculateCurrentPop();
}

function changeCarp(value) {
	carp = parseInt(value);
	calculateCarpMod();
	calculateCurrentPop();
}

function changeCarp2(value) {
	carp2 = parseInt(value);
	calculateCarpMod();
	calculateCurrentPop();
}

function changeCoord(value) {
	coord = parseInt(value);
	calculateCoordIncrease();
	calculateCurrentPop();
}

function changeEfficiency(value) {
	efficiency = parseInt(value);
	calculateMinTick();
	calculateMaxTick();
	calculateCurrentPop();
}

function changeCapacity(value) {
	capacity = parseInt(value);
	maxCapacity = 3 + (capacity * 0.4);
	calculateMaxTick();
	calculateCurrentPop();
}

function changeSupply(value) {
	supply = parseInt(value);
	maxSupply = 0.2 + (supply * 0.02);
	calculateMaxSupplyZone();
	calculateCurrentPop();
}

function changeOverclocker(value) {
	overclocker = parseInt(value);
	overclock = overclocker;
	if (overclocker < 1) overclocker = 1;
	else overclocker = 1 - (0.5 * Math.pow(0.99, overclocker - 1));
	calculateCurrentPop();
}

function changeStorage(value) {
	if (value == "Yes" || value == 2) storage = 2;
	else storage = 1;
	calculateCurrentPop();
}

function changeSlowburn(value) {
	if (value == "Yes" || value == 0.4) slowburn = 0.4;
	else slowburn = 0.5;
	calculateMinTick();
	calculateCurrentPop();
}

function changeMagmaFlow(value) {
	if (value == "Yes" || value) magmaFlow = true;
	else magmaFlow = false;
	if (magmaFlow) magmaCells = 18;
	else magmaCells = 16;
	calculateMagma();
	calculateCurrentPop();
}

function calculateMagma() {
	document.getElementById("zonesOfFuel").innerHTML = fuelZones;
	zonesOfMI = (runEnd - 230) - fuelZones;
	document.getElementById("zonesOfMI").innerHTML = zonesOfMI;
	document.getElementById("zonesOfMagma").innerHTML = runEnd - 230;
	if (magmaFlow) totalMI = zonesOfMI * 18;
	else totalMI = zonesOfMI * 16;
	document.getElementById("totalMI").innerHTML = totalMI;
}

function calculateMaxSupplyZone() {
	document.getElementById("maxSupplyZone").innerHTML = (230 + (2 * supply));
}

function calculateCoordIncrease() {
	coordIncrease = 25 * Math.pow(0.98, coord);
	document.getElementById("coordIncrease").innerHTML = coordIncrease.toFixed(4);
	coordinations[0] = 3;
	var c = 0;
	for (i = 1; i <= 328; i++) {
		c = Math.ceil((coordinations[i - 1] / 3) * (1 + (coordIncrease / 100)));
		c *= 3;
		coordinations[i] = c;
	}
}

function calculateFinalAmalRatio() {
	document.getElementById("finalAmalRatio").innerHTML = Math.max(10000000000 / Math.pow(10, spiresCleared - 1), 1000000);
}

function calculateCarpMod() {
	carpMod = minTick * Math.pow(1.1, carp) * (1 + (carp2 * 0.0025));
}

function calculateMinTick() {
	minTick = Math.sqrt(slowburn) * 500000000 * (1 + (0.1 * efficiency));
	tickRatio = maxTick / minTick;
	calculateCarpMod();
}

function calculateMaxTick() {
	maxTick = Math.sqrt(maxCapacity) * 500000000 * (1 + (0.1 * efficiency));
	if (minTick > 0) tickRatio = maxTick / minTick;
}

function calculateCurrentPop() {
	var sum = [];
	for (i = 0; i <= (maxZone - 230); i++) {
		if (i == 0) fuelThisZone[0] = 0.2;
		else fuelThisZone[i] = Math.min(fuelThisZone[i - 1] + 0.01, 0.2 + (supply * 0.02));
		if ((i + 230) >= fuelStart && (i + 230) <= fuelEnd) {
			if (i == 0) fuelThisZone[0] = 0.2;
			else totalFuel[i] = (magmaCells * fuelThisZone[i]) + totalFuel[i - 1];
		} else totalFuel[i] = 0;
		overclockTicks[i] = Math.max((totalFuel[i] - (storage * maxCapacity)) / slowburn, 0);
		overclockPop[i] = Math.floor(overclockTicks[i]) * (carpMod * tickRatio) * overclocker;
		if (i == 0) overclockPopThisZone[0] = Math.max(overclockPop[0], 0);
		else overclockPopThisZone[i] = Math.max(overclockPop[i] - overclockPop[i - 1], 0);
		if (i == 0) popWithTauntimp[0] = Math.floor(overclockPopThisZone[0] * Math.pow(1.003, 2.97));
		else popWithTauntimp[i] = Math.floor((overclockPopThisZone[i] + popWithTauntimp[i - 1]) * Math.pow(1.003, 2.97));
		if (i == 0) sum[0] = overclockPopThisZone[0];
		else sum[i] = overclockPopThisZone[i] + sum[i - 1];
		popFromTauntimp[i] = popWithTauntimp[i] - sum[i];
		if (popWithTauntimp[i] > 0) percentFromTauntimp[i] = popFromTauntimp[i] / popWithTauntimp[i];
		else percentFromTauntimp[i] = 0;
		if (i == 0) tauntimpThisZone[0] = 0;
		else tauntimpThisZone[i] = popFromTauntimp[i] - popFromTauntimp[i - 1];
		if (i == 0) coordPop[0] = Math.ceil((coordinations[coordinations.length - 1] / 3) * (1 + (coordIncrease / 100))) * 3;
		else coordPop[i] = Math.ceil((coordPop[i - 1] / 3) * (1 + (coordIncrease / 100))) * 3;
		amalRatio[i] = (popWithTauntimp[i] * housingMod) / (coordPop[i] / 3);
		if (i == 0) currentAmals[0] = 0;
		else if (i <= 70) {
			if (adjustedRatio[i - 1] > Math.max(ar1, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		} else if (i <= 170) {
			if (adjustedRatio[i - 1] > Math.max(ar2, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		} else if (i <= 270) {
			if (adjustedRatio[i - 1] > Math.max(ar3, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		} else if (i <= 370) {
			if (adjustedRatio[i - 1] > Math.max(ar4, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		} else if (i <= 470) {
			if (adjustedRatio[i - 1] > Math.max(ar5, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		} 
		if (currentAmals[i] < 0) currentAmals[i] = 0;
		adjustedRatio[i] = amalRatio[i] / Math.pow(1000, currentAmals[i]);
	}
	totalPop = popWithTauntimp[runEnd - 230] * housingMod;
	document.getElementById("totalPop").innerHTML = totalPop.toPrecision(3);
	tauntimpPercent = (percentFromTauntimp[runEnd - 230] * 100);
	document.getElementById("tauntimpPercent").innerHTML = tauntimpPercent.toFixed(2);
	finalAmals = currentAmals[runEnd - 230];
	document.getElementById("finalAmals").innerHTML = finalAmals;
	maxAmals = 0;
	for (i = 0; i <= (runEnd - 230); i++) {
		if (currentAmals[i] > maxAmals) {
			maxAmals = currentAmals[i];
			finalAmalZone = i + 230;
		}
	}
	document.getElementById("maxAmals").innerHTML = maxAmals;
	document.getElementById("finalAmalZone").innerHTML = finalAmalZone;
	neededPop = coordPop[runEnd - 230] / 3;
	document.getElementById("neededPop").innerHTML = neededPop.toPrecision(3);
	finalArmySize = neededPop * Math.pow(1000, finalAmals);
	document.getElementById("finalArmySize").innerHTML = finalArmySize.toPrecision(3);
	yourFinalRatio = totalPop / finalArmySize;
	document.getElementById("yourFinalRatio").innerHTML = Math.ceil(yourFinalRatio);
	
	var x = -1;
	var y = "N/A";
	var z = "N/A";
	for (i = 0; i <= 70; i++) {
		if (currentAmals[i] >= maxAmals && (i + 230) > finalAmalZone) {
			if (adjustedRatio[i] > x) {
				x = adjustedRatio[i];
				y = i + 230;
				z = Math.ceil(Math.log(ar1 / x) / Math.log(1 + (coordIncrease / 100)));
			}
		}
	}
	if (x == -1) document.getElementById("npm1").innerHTML = "N/A";
	else document.getElementById("npm1").innerHTML = (ar1 / x).toPrecision(5);
	document.getElementById("ex1").innerHTML = y;
	document.getElementById("uc1").innerHTML = z;
	
	x = -1;
	y = "N/A";
	z = "N/A";
	for (i = 71; i <= 170; i++) {
		if (currentAmals[i] >= maxAmals && (i + 230) > finalAmalZone) {
			if (adjustedRatio[i] > x) {
				x = adjustedRatio[i];
				y = i + 230;
				z = Math.ceil(Math.log(ar2 / x) / Math.log(1 + (coordIncrease / 100)));
			}
		}
	}
	if (x == -1) document.getElementById("npm2").innerHTML = "N/A";
	else document.getElementById("npm2").innerHTML = (ar2 / x).toPrecision(5);
	document.getElementById("ex2").innerHTML = y;
	document.getElementById("uc2").innerHTML = z;
	
	x = -1;
	y = "N/A";
	z = "N/A";
	for (i = 171; i <= 270; i++) {
		if (currentAmals[i] >= maxAmals && (i + 230) > finalAmalZone) {
			if (adjustedRatio[i] > x) {
				x = adjustedRatio[i];
				y = i + 230;
				z = Math.ceil(Math.log(ar3 / x) / Math.log(1 + (coordIncrease / 100)));
			}
		}
	}
	if (x == -1) document.getElementById("npm3").innerHTML = "N/A";
	else document.getElementById("npm3").innerHTML = (ar3 / x).toPrecision(5);
	document.getElementById("ex3").innerHTML = y;
	document.getElementById("uc3").innerHTML = z;
	
	x = -1;
	y = "N/A";
	z = "N/A";
	for (i = 271; i <= 370; i++) {
		if (currentAmals[i] >= maxAmals && (i + 230) > finalAmalZone) {
			if (adjustedRatio[i] > x) {
				x = adjustedRatio[i];
				y = i + 230;
				z = Math.ceil(Math.log(ar4 / x) / Math.log(1 + (coordIncrease / 100)));
			}
		}
	}
	if (x == -1) document.getElementById("npm4").innerHTML = "N/A";
	else document.getElementById("npm4").innerHTML = (ar4 / x).toPrecision(5);
	document.getElementById("ex4").innerHTML = y;
	document.getElementById("uc4").innerHTML = z;
	
	x = -1;
	y = "N/A";
	z = "N/A";
	for (i = 371; i <= 470; i++) {
		if (currentAmals[i] >= maxAmals && (i + 230) > finalAmalZone) {
			if (adjustedRatio[i] > x) {
				x = adjustedRatio[i];
				y = i + 230;
				z = Math.ceil(Math.log(ar5 / x) / Math.log(1 + (coordIncrease / 100)));
			}
		}
	}
	if (x == -1) document.getElementById("npm5").innerHTML = "N/A";
	else document.getElementById("npm5").innerHTML = (ar5 / x).toPrecision(5);
	document.getElementById("ex5").innerHTML = y;
	document.getElementById("uc5").innerHTML = z;
	
	saveSettings();
}

function pasteSave(save) {
	ticked = document.getElementById("lockRun").checked;
	var saveString = save.clipboardData.getData("text/plain").replace(/\s/g, '');
	game = JSON.parse(LZString.decompressFromBase64(saveString));
	if (game == null) {
		document.getElementById("invalid").innerHTML = "Invalid Save!";
		return;
	}
	document.getElementById("invalid").innerHTML = "";
	carp = game.portal.Carpentry.level;
	changeCarp(carp);
	document.getElementById("carp").value = carp;
	carp2 = game.portal.Carpentry_II.level;
	changeCarp2(carp2);
	document.getElementById("carp2").value = carp2;
	coord = game.portal.Coordinated.level;
	changeCoord(coord);
	document.getElementById("coord").value = coord;
	efficiency = game.generatorUpgrades.Efficiency.upgrades;
	changeEfficiency(efficiency);
	document.getElementById("efficiency").value = efficiency;
	capacity = game.generatorUpgrades.Capacity.upgrades;
	changeCapacity(capacity);
	document.getElementById("capacity").value = capacity;
	supply = game.generatorUpgrades.Supply.upgrades;
	changeSupply(supply);
	document.getElementById("supply").value = supply;
	overclocker = game.generatorUpgrades.Overclocker.upgrades;
	changeOverclocker(overclocker);
	document.getElementById("overclocker").value = overclock;
	if (game.permanentGeneratorUpgrades.Storage.owned) changeStorage("Yes");
	else changeStorage("No");
	
	if (game.permanentGeneratorUpgrades.Slowburn.owned) changeSlowburn("Yes");
	else changeSlowburn("No");
	
	if (game.talents.magmaFlow.purchased) changeMagmaFlow("Yes");
	else changeMagmaFlow("No");
	
	if (!ticked) {
		runEnd = game.global.lastPortal;
		changeRunEnd(runEnd);
		document.getElementById("runEnd").value = runEnd;
		spiresCleared = game.global.spiresCompleted;
		changeSpiresCleared(spiresCleared);
		document.getElementById("spiresCleared").value = spiresCleared;
		if (game.global.genStateConfig.length == 0) fuelStart = 230;
		else fuelStart = game.global.genStateConfig[0][1];
		changeFuelStart(fuelStart);
		document.getElementById("fuelStart").value = fuelStart;
		if (game.global.genStateConfig.length == 0) fuelEnd = runEnd;
		else fuelEnd = game.global.genStateConfig[1][1];
		changeFuelEnd(fuelEnd);
		document.getElementById("fuelEnd").value = fuelEnd;
		if (game.global.dailyChallenge.large != undefined) {
			housingMod = 1 - (game.global.dailyChallenge.large.strength / 100)
		} else housingMod = 1;
		changeHousingMod(housingMod);
		document.getElementById("housingMod").value = housingMod.toFixed(2);
	}
	//console.log(game);
}

function optimize() {
	var myFuelZones = fuelZones;
	changeFuelStart(230);
	//changeFuelZones(myFuelZones);
	var bestPop = 0;
	var bestAmals = maxAmals;
	var myFuelStart = 230;
	for (f = 230; f <= (runEnd - myFuelZones); f++) {
		changeFuelStart(f);
		changeFuelZones(myFuelZones);
		if (totalPop > bestPop && bestAmals >= maxAmals) {
			bestPop = totalPop;
			myFuelStart = f;
		}
	}
	changeFuelStart(myFuelStart);
	document.getElementById("fuelStart").value = fuelStart;
	changeFuelZones(myFuelZones);
	document.getElementById("fuelZones").value = fuelZones;
}

function minimize(dif, atZone) {
	changeFuelStart(230);
	var myEnd = runEnd;
	if (atZone) changeRunEnd(minimizeZone);
	changeFuelEnd(runEnd);
	var bestAmals = maxAmals - dif;
	var bestJ = fuelZones;
	var maxedAmals = false;
	
	if (atZone) changeFuelStart(minimizeZone);
	else changeFuelStart(runEnd);
	changeFuelZones(0);
	
	while(fuelStart >= 230) {
		while (maxAmals == bestAmals && fuelZones >= 0) {
			bestJ = fuelZones;
			fuelZones -= 1;
			changeFuelZones(fuelZones);
			maxedAmals = true;
		}
		fuelStart -= 1;
		if (fuelStart >= 230) changeFuelStart(fuelStart);
		if (atZone) changeFuelZones(Math.min(minimizeZone - fuelStart, bestJ));
		else changeFuelZones(Math.min(runEnd - fuelStart, bestJ));
		if (maxedAmals == true && maxAmals < bestAmals) break;
	}
	if (atZone) {
		changeRunEnd(myEnd);
		document.getElementById("runEnd").value = runEnd;
	}
	changeFuelZones(bestJ);
	document.getElementById("fuelZones").value = fuelZones;
	optimize();
}

function changeMinimizeZone(value) {
	minimizeZone = parseInt(value);
	if (minimizeZone < 230) {
		minimizeZone = 230;
		document.getElementById("minimizeZone").value = minimizeZone;
	}
}

function minimizeCapacity() {
	
}

function saveSettings() {
	var settings = {
		ticked : ticked,
		fuelStart : fuelStart,
		fuelEnd : fuelEnd,
		fuelZones : fuelZones,
		runEnd : runEnd,
		housingMod : housingMod,
		spiresCleared : spiresCleared,
		carp : carp,
		carp2 : carp2,
		coord : coord,
		efficiency : efficiency,
		capacity : capacity,
		supply : supply,
		overclock : overclock,
		storage : storage,
		slowburn : slowburn,
		magmaFlow : magmaFlow,
		minimizeZone : minimizeZone
	}
	localStorage.setItem("GatorSettings", JSON.stringify(settings));
}

function loadSettings() {
	var settings = JSON.parse(localStorage.getItem("GatorSettings"));
	if (settings != null) {
		if (typeof settings.ticked != "undefined") ticked = settings.ticked;
		if (typeof settings.fuelStart != "undefined") fuelStart = settings.fuelStart;
		if (typeof settings.fuelEnd != "undefined") fuelEnd = settings.fuelEnd;
		if (typeof settings.fuelZones != "undefined") fuelZones = settings.fuelZones;
		if (typeof settings.runEnd != "undefined") runEnd = settings.runEnd;
		if (typeof settings.housingMod != "undefined") housingMod = settings.housingMod;
		if (typeof settings.spiresCleared != "undefined") spiresCleared = settings.spiresCleared;
		if (typeof settings.carp != "undefined") carp = settings.carp;
		if (typeof settings.carp2 != "undefined") carp2 = settings.carp2;
		if (typeof settings.coord != "undefined") coord = settings.coord;
		if (typeof settings.efficiency != "undefined") efficiency = settings.efficiency;
		if (typeof settings.capacity != "undefined") capacity = settings.capacity;
		if (typeof settings.supply != "undefined") supply = settings.supply;
		if (typeof settings.overclock != "undefined") overclock = settings.overclock;
		if (typeof settings.storage != "undefined") storage = settings.storage;
		if (typeof settings.slowburn != "undefined") slowburn = settings.slowburn;
		if (typeof settings.magmaFlow != "undefined") magmaFlow = settings.magmaFlow;
		if (typeof settings.minimizeZone != "undefined") minimizeZone = settings.minimizeZone;
		document.getElementById("lockRun").checked = ticked;
		changeFuelStart(fuelStart);
		document.getElementById("fuelStart").value = fuelStart;
		changeFuelEnd(fuelEnd);
		document.getElementById("fuelEnd").value = fuelEnd;
		changeFuelZones(fuelZones);
		document.getElementById("fuelZones").value = fuelZones;
		changeRunEnd(runEnd);
		document.getElementById("runEnd").value = runEnd;
		changeHousingMod(housingMod);
		document.getElementById("housingMod").value = housingMod;
		changeSpiresCleared(spiresCleared);
		document.getElementById("spiresCleared").value = spiresCleared;
		changeCarp(carp);
		document.getElementById("carp").value = carp;
		changeCarp2(carp2);
		document.getElementById("carp2").value = carp2;
		changeCoord(coord);
		document.getElementById("coord").value = coord;
		changeEfficiency(efficiency);
		document.getElementById("efficiency").value = efficiency;
		changeCapacity(capacity);
		document.getElementById("capacity").value = capacity;
		changeSupply(supply);
		document.getElementById("supply").value = supply;
		changeOverclocker(overclock);
		document.getElementById("overclocker").value = overclock;
		changeStorage(storage);
		//document.getElementById("storage").value = storage;
		changeSlowburn(slowburn);
		//document.getElementById("slowburn").value = slowburn;
		changeMagmaFlow(magmaFlow);
		//document.getElementById("magmaFlow").value = magmaFlow;
		changeMinimizeZone(minimizeZone);
		document.getElementById("minimizeZone").value = minimizeZone;
	}
}

function goFaq() {
	if (document.getElementById("faqScreen").style.display == "inline") document.getElementById("faqScreen").style.display = "none";
	else document.getElementById("faqScreen").style.display = "inline";
	document.getElementById("faqScreen").focus();
}

//Copyright Nohmou, 2018