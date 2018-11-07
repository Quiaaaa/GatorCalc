window.onload = setup;
var version = "1.4c";
var hze = 0;
var ticked = false;
var fuelStart = 230;
var fuelEnd = 230;
var fuelZones = fuelEnd - fuelStart;
var runEnd = 230;
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

var efficiencyCost = 8;
var capacityCost = 32;
var supplyCost = 64;
var overclockerCost = 512;

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

var minimizeZone = 230;
var gatorZone = 230;
var offset = false;

function setup() {
	loadSettings();
	document.getElementById("version").innerHTML = version;
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
	if (housingMod < 0) {
		housingMod = 1 + (housingMod / 100);
		document.getElementById("housingMod").value = housingMod.toFixed(2);
	}
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

function changeEfficiency(value, mod) {
	efficiency = parseInt(value);
	calculateMinTick();
	calculateMaxTick();
	efficiencyCost = (efficiency + 1) * 8;
	calculateCurrentPop();
	if (mod == undefined) checkDGUpgrades();
}

function changeCapacity(value, mod) {
	capacity = parseInt(value);
	maxCapacity = 3 + (capacity * 0.4);
	calculateMaxTick();
	capacityCost = (capacity + 1) * 32;
	calculateCurrentPop();
	if (mod == undefined) checkDGUpgrades();
}

function changeSupply(value, mod) {
	supply = parseInt(value);
	maxSupply = 0.2 + (supply * 0.02);
	document.getElementById("maxSupplyZone").innerHTML = (230 + (2 * supply));
	supplyCost = (supply + 1) * 64;
	calculateCurrentPop();
	if (mod == undefined) checkDGUpgrades();
}

function changeOverclocker(value, mod) {
	overclocker = parseInt(value);
	overclock = overclocker;
	if (overclocker < 1) overclocker = 1;
	else overclocker = 1 - (0.5 * Math.pow(0.99, overclocker - 1));
	overclockerCost = (overclock * 32) + 512;
	calculateCurrentPop();
	if (mod == undefined) checkDGUpgrades();
}

function checkDGUpgrades() {
	var myStart = fuelStart;
	var myEnd = fuelEnd;
	var myRunEnd = runEnd;
	var myMI = totalMI;
	if (myMI == 0) return;
	changeFuelStart(230);
	if (hze > 0) {
		changeRunEnd(hze);
		changeFuelEnd(hze);
	}
	else {
		changeFuelEnd(runEnd);
	}
	var myPop = totalPop;
	
	changeEfficiency(efficiency + 1, 1);
	var efficiencyEfficiency = totalPop - myPop;
	changeEfficiency(efficiency - 1, 1);
	changeCapacity(capacity + 1, 1);
	var capacityEfficiency = totalPop - myPop;
	changeCapacity(capacity - 1, 1);
	changeSupply(supply + 1, 1);
	var supplyEfficiency = totalPop - myPop;
	changeSupply(supply - 1, 1);
	changeOverclocker(overclock + 1, 1);
	var overclockerEfficiency = totalPop - myPop;
	changeOverclocker(overclock - 1, 1);
	
	var eCost = efficiencyCost;
	var cCost = capacityCost;
	var sCost = supplyCost;
	var oCost = overclockerCost;
	
	if (eCost > myMI * 4.9) efficiencyCost = -1;
	else if ((eCost * 2) + 8 <= myMI);
	else if (eCost <= myMI) {
		efficiencyCost += (myMI - eCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (eCost > myMI) {
			efficiencyCost += myMI;
			eCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		efficiencyCost += (myMI - eCost) * 0.2;
	}
	if (cCost > myMI * 4.9) capacityCost = -1;
	else if ((cCost * 2) + 32 <= myMI);
	else if (cCost <= myMI) {
		capacityCost += (myMI - cCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (cCost > myMI) {
			capacityCost += myMI;
			cCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		capacityCost += (myMI - cCost) * 0.2;
	}
	if (sCost > myMI * 4.9) supplyCost = -1;
	else if ((sCost * 2) + 64 <= myMI);
	else if (sCost <= myMI) {
		supplyCost += (myMI - sCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (sCost > myMI) {
			supplyCost += myMI;
			sCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		supplyCost += (myMI - sCost) * 0.2;
	}
	if (oCost > myMI * 4.9) overclockerCost = -1;
	else if ((oCost * 2) + 32 <= myMI);
	else if (oCost <= myMI) {
		overclockerCost += (myMI - oCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (oCost > myMI) {
			overclockerCost += myMI;
			oCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		overclockerCost += (myMI - oCost) * 0.2;
	}
	
	efficiencyEfficiency /= efficiencyCost;
	capacityEfficiency /= capacityCost;
	supplyEfficiency /= supplyCost;
	overclockerEfficiency /= overclockerCost;
	
	if (efficiencyCost < 0) document.getElementById("efficiencyEfficiency").innerHTML = "-----";
	else document.getElementById("efficiencyEfficiency").innerHTML = "1";
	if (capacityCost < 0) document.getElementById("capacityEfficiency").innerHTML = "-----";
	else document.getElementById("capacityEfficiency").innerHTML = (capacityEfficiency / efficiencyEfficiency).toFixed(4);
	if (supplyCost < 0) document.getElementById("supplyEfficiency").innerHTML = "-----";
	else document.getElementById("supplyEfficiency").innerHTML = (supplyEfficiency / efficiencyEfficiency).toFixed(4);
	if (overclockerCost < 0) document.getElementById("overclockerEfficiency").innerHTML = "-----";
	else document.getElementById("overclockerEfficiency").innerHTML = (overclockerEfficiency / efficiencyEfficiency).toFixed(4);
	
	changeRunEnd(myRunEnd);
	changeFuelStart(myStart);
	changeFuelEnd(myEnd);
}

function changeHZE(value) {
	hze = parseInt(value);
	checkDGUpgrades();
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
	offset = document.getElementById("offset5").checked;
	var sum = [];
	for (i = 0; i <= (runEnd - 230); i++) {
		if (i == 0) fuelThisZone[0] = 0.2;
		else fuelThisZone[i] = Math.min(fuelThisZone[i - 1] + 0.01, maxSupply);
		if ((i + 230) >= fuelStart && (i + 230) <= fuelEnd) {
			if (i == 0) totalFuel[0] = 0.2;
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
		else if ((offset && ((i - 1) % 5) != 0) || (offset && ((i - 71) % 100) == 0)) {
			currentAmals[i] = currentAmals[i - 1];
		} else if (i <= 70) {
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
	document.getElementById("message").innerHTML = "";
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
	if (game.permanentGeneratorUpgrades.Storage.owned) {
		changeStorage("Yes");
		document.getElementById("storage").value = "Yes";
	} else {
		changeStorage("No");
		document.getElementById("storage").value = "No";
	}
	if (game.permanentGeneratorUpgrades.Slowburn.owned) {
		changeSlowburn("Yes");
		document.getElementById("slowburn").value = "Yes";
	} else {
		changeSlowburn("No");
		document.getElementById("slowburn").value = "No";
	}
	if (game.talents.magmaFlow.purchased) {
		changeMagmaFlow("Yes");
		document.getElementById("magmaFlow").value = "Yes";
	} else {
		changeMagmaFlow("No");
		document.getElementById("magmaFlow").value = "No";
	}
	if (!ticked) {
		hze = game.global.highestLevelCleared;
		document.getElementById("hze").value = hze;
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
	checkDGUpgrades();
	document.getElementById("message").innerHTML = "Stats populated!";
	//console.log(game);
}

function optimize() {
	var myFuelZones = fuelZones;
	changeFuelStart(230);
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
	document.getElementById("message").innerHTML = "Starting fuel zone optimized!";
}

function minimize(dif, variant) {
	if (variant == 2) document.getElementById("message").innerHTML = "Calculating...";
	changeFuelStart(230); 
	var myEnd = runEnd;
	if (variant == 1) changeRunEnd(minimizeZone);
	changeFuelEnd(runEnd);
	var bestAmals = maxAmals - dif;
	var bestJ = fuelZones;
	var maxedAmals = false;
	
	if (variant == 1) changeFuelStart(minimizeZone);
	else changeFuelStart(runEnd);
	changeFuelZones(0);
	if (variant == 2) var myCapacity = capacity;
	
	while (fuelStart >= 230) {
		while (maxAmals == bestAmals && fuelZones >= 0) {
			if (variant == 2) {
				var myPop = totalPop;
				while (totalPop >= myPop) {
					changeCapacity(capacity - 1, 2);
					if (totalPop >= myPop) myPop = totalPop;
					else {
						changeCapacity(capacity + 1, 2);
						break;
					}
				}
			}
			bestJ = fuelZones;
			fuelZones -= 1;
			changeFuelZones(fuelZones);
			maxedAmals = true;
		}
		fuelStart -= 1;
		if (fuelStart >= 230) changeFuelStart(fuelStart);
		if (variant == 1) changeFuelZones(Math.min(minimizeZone - fuelStart, bestJ));
		else changeFuelZones(Math.min(runEnd - fuelStart, bestJ));
		if (maxedAmals == true && maxAmals < bestAmals) break;
	}
	if (variant == 1) {
		changeRunEnd(myEnd);
		document.getElementById("runEnd").value = runEnd;
	}
	changeFuelZones(bestJ);
	document.getElementById("fuelZones").value = fuelZones;
	optimize();
	if (variant == 2) {
		myPop = totalPop;
		for (b = 0; b < 4; b++) { //run this a bunch or something
			changeCapacity(capacity + 1, 2);
			while (totalPop >= myPop && maxAmals >= bestAmals && capacity <= myCapacity) {
				myPop = totalPop;
				changeCapacity(capacity + 1, 2);
			}
			changeCapacity(capacity - 1);
			document.getElementById("capacity").value = capacity;
			optimize();
		}
	}
	document.getElementById("message").innerHTML = "Zones to fuel minimized!";
	if (variant == 2) document.getElementById("message").innerHTML = "Ideal slider setting: " + (3 + capacity * slowburn) + " max fuel";
}

function changeMinimizeZone(value) {
	minimizeZone = parseInt(value);
	if (minimizeZone < 230) {
		minimizeZone = 230;
		document.getElementById("minimizeZone").value = minimizeZone;
	}
	if (minimizeZone == 2151) {
		document.getElementById("minimizeCapacity-1").style.display = "inline";
		document.getElementById("minimizeAtZone-1").style.display = "inline";
	}
}

function forceGator() {
	var x1 = adjustedRatio[gatorZone - 230];
	var y1 = gatorZone;
	var z1 = "N/A";
	if (y1 < 230) {
		
	} else if (y1 < 301) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar1 / x1) / Math.log(1 + (coordIncrease / 100)));
			document.getElementById("npm1").innerHTML = (ar1 / x1).toPrecision(5);
			document.getElementById("ex1").innerHTML = y1;
			document.getElementById("uc1").innerHTML = z1;
		}
	} else if (y1 < 401) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar2 / x1) / Math.log(1 + (coordIncrease / 100)));
			document.getElementById("npm2").innerHTML = (ar2 / x1).toPrecision(5);
			document.getElementById("ex2").innerHTML = y1;
			document.getElementById("uc2").innerHTML = z1;
		}
	} else if (y1 < 501) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar3 / x1) / Math.log(1 + (coordIncrease / 100)));
			document.getElementById("npm3").innerHTML = (ar3 / x1).toPrecision(5);
			document.getElementById("ex3").innerHTML = y1;
			document.getElementById("uc3").innerHTML = z1;
		}
	} else if (y1 < 601) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar4 / x1) / Math.log(1 + (coordIncrease / 100)));
			document.getElementById("npm4").innerHTML = (ar4 / x1).toPrecision(5);
			document.getElementById("ex4").innerHTML = y1;
			document.getElementById("uc4").innerHTML = z1;
		}
	} else {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar5 / x1) / Math.log(1 + (coordIncrease / 100)));
			document.getElementById("npm5").innerHTML = (ar5 / x1).toPrecision(5);
			document.getElementById("ex5").innerHTML = y1;
			document.getElementById("uc5").innerHTML = z1;
		}
	}
	document.getElementById("message").innerHTML = "Extra Gator box updated!";
	if (gatorZone <= finalAmalZone) document.getElementById("message").innerHTML = "Zone too low!";
}

function changeGatorZone(value) {
	gatorZone = parseInt(value);
	if (gatorZone < 230) {
		gatorZone = 230;
		document.getElementById("gatorZone").value = gatorZone;
	}
}

function saveSettings() {
	var settings = {
		hze : hze,
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
		minimizeZone : minimizeZone,
		gatorZone : gatorZone,
		offset : offset
	}
	localStorage.setItem("GatorSettings", JSON.stringify(settings));
}

function loadSettings() {
	var settings = JSON.parse(localStorage.getItem("GatorSettings"));
	if (settings != null) {
		if (typeof settings.hze != "undefined") hze = settings.hze;
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
		if (typeof settings.gatorZone != "undefined") gatorZone = settings.gatorZone;
		if (typeof settings.offset != "undefined") offset = settings.offset;
		document.getElementById("lockRun").checked = ticked;
		document.getElementById("offset5").checked = offset;
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
		changeHZE(hze);
		document.getElementById("hze").value = hze;
		changeStorage(storage);
		if (storage == 2) document.getElementById("storage").value = "Yes";
		else document.getElementById("storage").value = "No";
		changeSlowburn(slowburn);
		if (slowburn == 0.4) document.getElementById("slowburn").value = "Yes";
		else document.getElementById("slowburn").value = "No";
		changeMagmaFlow(magmaFlow);
		if (magmaFlow) document.getElementById("magmaFlow").value = "Yes";
		else document.getElementById("magmaFlow").value = "No";
		changeMinimizeZone(minimizeZone);
		document.getElementById("minimizeZone").value = minimizeZone;
		changeGatorZone(gatorZone);
		document.getElementById("gatorZone").value = gatorZone;
		checkDGUpgrades();
		document.getElementById("message").innerHTML = "Settings loaded!";
	}
}

function goFaq() {
	if (document.getElementById("faqScreen").style.display == "inline") document.getElementById("faqScreen").style.display = "none";
	else document.getElementById("faqScreen").style.display = "inline";
	document.getElementById("faqScreen").focus();
}

//Copyright Nohmou, 2018