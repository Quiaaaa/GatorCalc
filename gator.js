window.onload = setup;
var version = "1.7.1";
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
var randimp = false;
var moreImports = 0;
var scaffolding = 0;
var tauntimpFrequency = 2.97;
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

var uncoords = 0;
var uncoordsZone = -1;
var uncoordsGoal = 1;
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

var eradMode = false;
/*
TODO
GENERAL
Add a 'show extra options' toggle, off by default
Hide
	Minimize Capacity
	Force Gaor At Zone
	Coords Witheld (set to -1)
	Withhold coods (set to -1)

	Use 5z breakpoints (set to true)

	Extra gators info box

ERAD
Put a checkbox under 'use 5 zone breakpoints' to enable erad mode
	set fuel start to 1
	set fuel end to ~game.global.c2.erad 
	set run end to ~game.global.c2.erad 
	set push run goal to ~game.global.c2.erad ?? Do we need this one?

Put an input box for 'withold until zone X' by the checkbox
	default to 0
	set withheld coords to 2*input

Grant 2 coords per zone

bug that needs fixing: NaN error if you try to withhold more coords than you have at your starting zone
*/

const elementsToGet = ["inputs", "saveBox", "calculate", "lockRun", "invalid", "fuelStart", "fuelEnd", "fuelZones", "runEnd", "housingMod", "spiresCleared", "carp", "carp2", "coord", "randimp", "scaffolding", "moreImports", "magmaFlow", "efficiency", "efficiencyEfficiency", "capacity", "capacityEfficiency", "supply", "supplyEfficiency", "overclocker", "overclockerEfficiency", "checkDG", "hze", "storage", "slowburn", "macros", "version", "optimize", "minimize", "minimize-1", "minimizeAtZone", "minimizeZone", "minimizeCapacity", "forceGator", "gatorZone", "uncoords", "uncoordsZone", "uncoordsGoal", "minimizeCapacity-1", "minimizeAtZone-1", "offset5Label", "offset5", "message", "results", "resultsTable", "totalPop", "finalAmals", "tauntimpPercent", "maxAmals", "lastCoord", "finalAmalZone", "neededPop", "finalArmySize", "coordIncrease", "finalAmalRatio", "yourFinalRatio", "zonesOfMagma", "zonesWithheld", "zonesOfFuel", "zonesOfMI", "totalMI", "maxSupplyZone", "extraGators", "ex1", "npm1", "uc1", "ex2", "npm2", "uc2", "ex3", "npm3", "uc3", "ex4", "npm4", "uc4", "ex5", "npm5", "uc5", "faq", "faqScreen"]
let elements


function setup() {
	elements = Object.fromEntries(elementsToGet.map(element => [element, document.getElementById(element)]))
	loadSettings();
	elements["version"].innerText = version;
}

function changeFuelStart(value) {
	fuelStart = parseInt(value);
	if (fuelStart < 230) fuelStart = 230;
	if (fuelStart > fuelEnd) fuelEnd = fuelStart;
	if (fuelStart > runEnd) runEnd = fuelStart;
	fuelZones = fuelEnd - fuelStart;
	elements["fuelZones"].value = (fuelEnd - fuelStart);
	calculateMagma();
	calculateCurrentPop();
}

function changeFuelEnd(value) {
	fuelEnd = parseInt(value);
	if (fuelEnd < fuelStart) fuelStart = fuelEnd;
	if (fuelEnd > runEnd) runEnd = fuelEnd;
	fuelZones = fuelEnd - fuelStart;
	elements["fuelZones"].value = (fuelEnd - fuelStart);
	if (fuelZones != (fuelEnd - fuelStart)) changeFuelZones(fuelEnd - fuelStart);
	calculateMagma();
	calculateCurrentPop();
}

function changeFuelZones(value) {
	fuelZones = parseInt(value);
	fuelEnd = fuelStart + fuelZones;
	elements["fuelEnd"].value = (fuelStart + fuelZones);
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
		elements["housingMod"].value = housingMod.toFixed(2);
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

function changeRandimp(value) {
	if (value == "No" || !value) {
		randimp = false;
	}
	else {
		randimp = true
	}
	calculateTauntimpFrequency();
	calculateCurrentPop();
}

function changeImports(value) {
	moreImports = value;
	calculateTauntimpFrequency();
	calculateCurrentPop();
}

function changeScaffolding(value) {
	scaffolding = parseInt(value);
	calculateCarpMod();
	calculateCurrentPop();
}

function calculateTauntimpFrequency() {
	// Non-round numbers are because you only get 99 random cells per zone
	tauntimpFrequency = 2.97;
	if (randimp) {
		tauntimpFrequency += 0.396;
	}
	if (moreImports) {
		tauntimpFrequency += moreImports * .05 * 99 / 100; // inc chance * possible import cells / world cells
	}
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
	elements["maxSupplyZone"].innerText = (230 + (2 * supply));
	supplyCost = (supply + 1) * 64;
	calculateCurrentPop();
	if (mod == undefined) checkDGUpgrades();
}

function changeOverclocker(value, mod) {
	overclock = parseInt(value);
	if (overclock < 1) overclocker = 1;
	else overclocker = 1 - (0.5 * Math.pow(0.99, overclock - 1));
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

	if (efficiencyCost < 0) elements["efficiencyEfficiency"].innerText = "-----";
	else elements["efficiencyEfficiency"].innerText = "1";
	if (capacityCost < 0) elements["capacityEfficiency"].innerText = "-----";
	else elements["capacityEfficiency"].innerText = (capacityEfficiency / efficiencyEfficiency).toFixed(4);
	if (supplyCost < 0) elements["supplyEfficiency"].innerText = "-----";
	else elements["supplyEfficiency"].innerText = (supplyEfficiency / efficiencyEfficiency).toFixed(4);
	if (overclockerCost < 0) elements["overclockerEfficiency"].innerText = "-----";
	else elements["overclockerEfficiency"].innerText = (overclockerEfficiency / efficiencyEfficiency).toFixed(4);

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
	if (value == "No" || !value) magmaFlow = false;
	else magmaFlow = true;
	if (magmaFlow) magmaCells = 18;
	else magmaCells = 16;
	calculateMagma();
	calculateCurrentPop();
}

function calculateMagma() {
	elements["zonesOfFuel"].innerText = fuelZones;
	zonesOfMI = (runEnd - 230) - fuelZones;
	elements["zonesOfMI"].innerText = zonesOfMI;
	elements["zonesOfMagma"].innerText = runEnd - 230;
	if (magmaFlow) totalMI = zonesOfMI * 18;
	else totalMI = zonesOfMI * 16;
	elements["totalMI"].innerText = totalMI;
}

function calculateCoordIncrease() {
	coordIncrease = 25 * Math.pow(0.98, coord);
	elements["coordIncrease"].innerText = coordIncrease.toFixed(4);
	coordinations[0] = 3;
	var c = 0;
	for (i = 1; i <= 328; i++) {
		c = Math.ceil((coordinations[i - 1] / 3) * (1 + (coordIncrease / 100)));
		c *= 3;
		coordinations[i] = c;
	}
}

function calculateFinalAmalRatio() {
	elements["finalAmalRatio"].innerText = Math.max(10000000000 / Math.pow(10, spiresCleared - 1), 1000000);
	//elements["finalAmalRatio"].innerText = enumerate(Math.max(10000000000 / Math.pow(10, spiresCleared - 1), 1000000));
}

function calculateCarpMod() {
	carpMod = minTick * Math.pow(1.1, carp) * (1 + (carp2 * 0.0025)) * (1 + (scaffolding * Math.pow(1.1, scaffolding - 1)));
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

function calculateCurrentPop(confEndZone) {
	offset = elements["offset5"].checked;
	var sum = [];
	var myHze = runEnd;
	if (hze > myHze) myHze = hze;
	// base CI on last gator (recursive)
	if (!confEndZone) confEndZone = runEnd;
	var confInterval = (1 - (1.91 / Math.sqrt((confEndZone - fuelStart) * tauntimpFrequency)))
	var useConf = true;
	var skippedCoords = 0;
	var goalReached = false;
	//console.log(confValue);

	for (i = 0; i <= (myHze - 200); i++) { //calc an extra 30 zones because why not
		// i = zone offset from z230

		//calc fuel gain
		if (i == 0) fuelThisZone[0] = 0.2;
		else fuelThisZone[i] = Math.min(fuelThisZone[i - 1] + 0.01, maxSupply);
		if ((i + 230) >= fuelStart && (i + 230) <= fuelEnd) {
			if (i == 0) totalFuel[0] = 0.2;
			else totalFuel[i] = (magmaCells * fuelThisZone[i]) + totalFuel[i - 1];
		} else totalFuel[i] = 0;

		//calc generated pop
		overclockTicks[i] = Math.max((totalFuel[i] - (storage * maxCapacity)) / slowburn, 0);
		overclockPop[i] = Math.floor(overclockTicks[i]) * (carpMod * tickRatio) * overclocker;
		if (i == 0) overclockPopThisZone[0] = Math.max(overclockPop[0], 0);
		else overclockPopThisZone[i] = Math.max(overclockPop[i] - overclockPop[i - 1], 0);

		//calc tauntimp pop
		if (i == 0) popWithTauntimp[0] = Math.floor(overclockPopThisZone[0] * Math.pow(1.003, tauntimpFrequency));
		else if (useConf) popWithTauntimp[i] = Math.floor((overclockPopThisZone[i] + popWithTauntimp[i - 1]) * Math.pow(1.003, tauntimpFrequency * confInterval));
		else popWithTauntimp[i] = Math.floor((overclockPopThisZone[i] + popWithTauntimp[i - 1]) * Math.pow(1.003, tauntimpFrequency));

		//calc pop stats
		if (i == 0) sum[0] = overclockPopThisZone[0];
		else sum[i] = overclockPopThisZone[i] + sum[i - 1];
		popFromTauntimp[i] = popWithTauntimp[i] - sum[i];
		if (popWithTauntimp[i] > 0) percentFromTauntimp[i] = popFromTauntimp[i] / popWithTauntimp[i];
		else percentFromTauntimp[i] = 0;
		if (i == 0) tauntimpThisZone[0] = 0;
		else tauntimpThisZone[i] = popFromTauntimp[i] - popFromTauntimp[i - 1];

		//calc army size
		if (i == 0) coordPop[0] = Math.ceil((coordinations[coordinations.length - (1 + uncoords)] / 3) * (1 + (coordIncrease / 100))) * 3;
		else if (uncoordsZone == -1) {
			coordPop[i] = Math.ceil((coordPop[i - 1] / 3) * (1 + (coordIncrease / 100))) * 3;
		}
		else {
			if (i + 230 > uncoordsZone && currentAmals[i - 1] < uncoordsGoal && !goalReached) {
				coordPop[i] = coordPop[i - 1];
				skippedCoords++;
			} else if (i + 230 > uncoordsZone && currentAmals[i - 1] >= uncoordsGoal && !goalReached) {
				var tempCoordPop = coordPop[i - 1];
				for (skipped = 0; skipped <= skippedCoords; skipped++) {
					tempCoordPop = Math.ceil((tempCoordPop / 3) * (1 + (coordIncrease / 100))) * 3;
				}
				goalReached = true;
				coordPop[i] = tempCoordPop;
			} else coordPop[i] = Math.ceil((coordPop[i - 1] / 3) * (1 + (coordIncrease / 100))) * 3;
		}

		//calc gators
		amalRatio[i] = (popWithTauntimp[i] * housingMod) / (coordPop[i] / 3);
		if (i == 0) currentAmals[0] = 0;
		else if ((offset && ((i - 1) % 5) != 0) || (offset && ((i - 71) % 100) == 0)) {
			currentAmals[i] = currentAmals[i - 1];

			//TODO There has to be a less repetive way to write this
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
		} else {
			if (adjustedRatio[i - 1] > Math.max(ar5, finalAmalRatio)) currentAmals[i] = currentAmals[i - 1] + 1;
			else if (adjustedRatio[i - 1] < 1000) currentAmals[i] = currentAmals[i - 1] - 1;
			else currentAmals[i] = currentAmals[i - 1];
		}
		if (currentAmals[i] < 0) currentAmals[i] = 0;
		adjustedRatio[i] = amalRatio[i] / Math.pow(1000, currentAmals[i]);
	}
	elements["zonesWithheld"].innerText = skippedCoords <= 0 ? '-' : skippedCoords;
	totalPop = popWithTauntimp[runEnd - 230] * housingMod;
	elements["totalPop"].innerText = totalPop.toPrecision(3);
	//elements["totalPop"].innerText = enumerate(totalPop);
	tauntimpPercent = (percentFromTauntimp[runEnd - 230] * 100);
	elements["tauntimpPercent"].innerText = tauntimpPercent.toFixed(2);
	finalAmals = currentAmals[runEnd - 230];
	elements["finalAmals"].innerText = finalAmals;
	maxAmals = 0;
	for (i = 0; i <= (runEnd - 230); i++) {
		if (currentAmals[i] > maxAmals) {
			maxAmals = currentAmals[i];
			finalAmalZone = i + 230;
		}
	}
	elements["maxAmals"].innerText = maxAmals;
	elements["finalAmalZone"].innerText = finalAmalZone;
	neededPop = coordPop[runEnd - 230] / 3;
	elements["neededPop"].innerText = neededPop.toPrecision(3);
	//elements["neededPop"].innerText = enumerate(neededPop);
	finalArmySize = neededPop * Math.pow(1000, finalAmals);
	elements["finalArmySize"].innerText = finalArmySize.toPrecision(3);
	//elements["finalArmySize"].innerText = enumerate(finalArmySize);
	yourFinalRatio = totalPop / finalArmySize;
	elements["yourFinalRatio"].innerText = Math.ceil(yourFinalRatio);

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
	if (x == -1) elements["npm1"].innerText = "N/A";
	else elements["npm1"].innerText = (ar1 / x).toPrecision(5);
	elements["ex1"].innerText = y;
	elements["uc1"].innerText = z;

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
	if (x == -1) elements["npm2"].innerText = "N/A";
	else elements["npm2"].innerText = (ar2 / x).toPrecision(5);
	elements["ex2"].innerText = y;
	elements["uc2"].innerText = z;

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
	if (x == -1) elements["npm3"].innerText = "N/A";
	else elements["npm3"].innerText = (ar3 / x).toPrecision(5);
	elements["ex3"].innerText = y;
	elements["uc3"].innerText = z;

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
	if (x == -1) elements["npm4"].innerText = "N/A";
	else elements["npm4"].innerText = (ar4 / x).toPrecision(5);
	elements["ex4"].innerText = y;
	elements["uc4"].innerText = z;

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
	if (x == -1) elements["npm5"].innerText = "N/A";
	else elements["npm5"].innerText = (ar5 / x).toPrecision(5);
	elements["ex5"].innerText = y;
	elements["uc5"].innerText = z;

	saveSettings();
	elements["message"].innerText = "";
	if (finalAmalZone < confEndZone && finalAmals > 0) {
		// rerun calcs for highly uncertain gators
		calculateCurrentPop(finalAmalZone);
		return;
	}
}

function pasteSave(save) {
	ticked = elements["lockRun"].checked;
	var saveString = save.clipboardData.getData("text/plain").replace(/\s/g, '');
	game = JSON.parse(LZString.decompressFromBase64(saveString));
	if (game == null) {
		elements["invalid"].innerText = "Invalid Save!";
		return;
	}
	elements["invalid"].innerText = "";
	carp = game.portal.Carpentry.level;
	carp2 = game.portal.Carpentry_II.level;
	coord = game.portal.Coordinated.level;
	randimp = game.talents.magimp.purchased;
	magmaFlow = game.talents.magmaFlow.purchased;
	moreImports = game.permaBoneBonuses.exotic.owned;
	scaffolding = game.global.autoBattleData.bonuses?.Scaffolding ? game.global.autoBattleData.bonuses?.Scaffolding : 0;
	efficiency = game.generatorUpgrades.Efficiency.upgrades;
	capacity = game.generatorUpgrades.Capacity.upgrades;
	supply = game.generatorUpgrades.Supply.upgrades;
	overclock = game.generatorUpgrades.Overclocker.upgrades;
	storage = game.permanentGeneratorUpgrades.Storage.owned ? 2 : 1;
	slowburn = game.permanentGeneratorUpgrades.Slowburn.owned ? .4 : .5;
	if (!ticked) {
		hze = game.global.highestLevelCleared;
		runEnd = game.global.lastPortal;
		spiresCleared = game.global.spiresCompleted;
		if (game.global.genStateConfig.length == 0) fuelStart = 230;
		else fuelStart = game.global.genStateConfig[0][1];
		if (game.global.genStateConfig.length == 0) fuelEnd = runEnd;
		else fuelEnd = game.global.genStateConfig[1][1];
		if (game.global.dailyChallenge.large != undefined) {
			housingMod = 1 - (game.global.dailyChallenge.large.strength / 100)
		} else housingMod = 1;
	}
	checkDGUpgrades();
	updateAfterLoad();
	elements["message"].innerText = "Stats populated!";
	//console.log(game);
}

function clearText() {
	elements["saveBox"].value = "";
}

function optimize() {
	var myFuelZones = fuelZones;
	var bestAmals = maxAmals;
	changeFuelStart(230);
	var bestPop = 0;
	var myFuelStart = 230;
	for (f = 230; f <= (runEnd - myFuelZones); f++) {
		changeFuelStart(f);
		changeFuelZones(myFuelZones);
		if (totalPop > bestPop && maxAmals >= bestAmals) {
			bestPop = totalPop;
			myFuelStart = f;
			bestAmals = Math.max(maxAmals, bestAmals); // max pop is not always max gators
		}
	}
	changeFuelStart(myFuelStart);
	elements["fuelStart"].value = fuelStart;
	changeFuelZones(myFuelZones);
	elements["fuelZones"].value = fuelZones;
	elements["message"].innerText = "Starting fuel zone optimized!";
}

function minimize(dif, variant) {
	if (variant == 2) elements["message"].innerText = "Calculating...";
	changeFuelStart(230);
	var myEnd = runEnd;
	if (variant == 1) changeRunEnd(minimizeZone);
	changeFuelEnd(runEnd);
	var bestAmals = finalAmals - dif;
	var bestJ = fuelZones;
	var maxedAmals = false;
	if (variant == 1) {
		changeRunEnd(minimizeZone - 1);
		changeFuelStart(minimizeZone - 1);
	}
	else changeFuelStart(runEnd);
	changeFuelZones(0);
	if (variant == 2) var myCapacity = capacity;

	while (fuelStart >= 230) {
		while (finalAmals >= bestAmals && fuelZones >= 0) {
			// minimize capacity
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
		if (variant == 1) changeFuelZones(Math.min(minimizeZone - fuelStart, bestJ)); // minimize at zone
		else changeFuelZones(Math.min(runEnd - fuelStart, bestJ));
		if (maxedAmals == true && finalAmals < bestAmals) break;
	}
	// if ratios are dropping per zone, fuel a little extra for safety's sake
	if (amalRatio[finalAmalZone] > amalRatio[finalAmalZone + 1]) {
		bestJ += Math.ceil(bestJ * .1)
	}
	changeFuelZones(bestJ);
	elements["fuelZones"].value = fuelZones;
	optimize();
	if (variant == 1) {
		changeRunEnd(myEnd);
	}
	if (variant == 2) {
		myPop = totalPop;
		for (b = 0; b < 4; b++) { //run this a bunch or something
			changeCapacity(capacity + 1, 2);
			while (totalPop >= myPop && finalAmals >= bestAmals && capacity <= myCapacity) {
				myPop = totalPop;
				changeCapacity(capacity + 1, 2);
			}
			changeCapacity(capacity - 1);
			elements["capacity"].value = capacity;
			optimize();
		}
	}
	elements["message"].innerText = "Zones to fuel minimized!";
	if (variant == 2) elements["message"].innerText = "Ideal slider setting: " + (3 + capacity * slowburn) + " max fuel";
}

function changeMinimizeZone(value) {
	minimizeZone = parseInt(value);
	if (minimizeZone < 231) {
		minimizeZone = 231;
		elements["minimizeZone"].value = minimizeZone;
	}
	if (minimizeZone == 2151) {
		elements["minimizeCapacity-1"].style.display = "inline";
		elements["minimizeAtZone-1"].style.display = "inline";
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
			elements["npm1"].innerText = (ar1 / x1).toPrecision(5);
			elements["ex1"].innerText = y1;
			elements["uc1"].innerText = z1;
		}
	} else if (y1 < 401) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar2 / x1) / Math.log(1 + (coordIncrease / 100)));
			elements["npm2"].innerText = (ar2 / x1).toPrecision(5);
			elements["ex2"].innerText = y1;
			elements["uc2"].innerText = z1;
		}
	} else if (y1 < 501) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar3 / x1) / Math.log(1 + (coordIncrease / 100)));
			elements["npm3"].innerText = (ar3 / x1).toPrecision(5);
			elements["ex3"].innerText = y1;
			elements["uc3"].innerText = z1;
		}
	} else if (y1 < 601) {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar4 / x1) / Math.log(1 + (coordIncrease / 100)));
			elements["npm4"].innerText = (ar4 / x1).toPrecision(5);
			elements["ex4"].innerText = y1;
			elements["uc4"].innerText = z1;
		}
	} else {
		if (currentAmals[y1 - 230] >= maxAmals && y1 > finalAmalZone) {
			z1 = Math.ceil(Math.log(ar5 / x1) / Math.log(1 + (coordIncrease / 100)));
			elements["npm5"].innerText = (ar5 / x1).toPrecision(5);
			elements["ex5"].innerText = y1;
			elements["uc5"].innerText = z1;
		}
	}
	elements["message"].innerText = "Extra Gator box updated!";
	if (gatorZone <= finalAmalZone) elements["message"].innerText = "Zone too low!";
}

function changeGatorZone(value) {
	gatorZone = parseInt(value);
	if (gatorZone < 230) {
		gatorZone = 230;
		elements["gatorZone"].value = gatorZone;
	}
}

function changeUncoords(value) {
	uncoords = parseInt(value);
	if (uncoords <= 0) {
		uncoords = 0;
		elements["uncoords"].value = uncoords;
		calculateCurrentPop();
		return;
	} else if (uncoords > 100 + runEnd) {
		uncoords = 100 + runEnd;
		elements["uncoords"].value = uncoords;
	}
	changeUncoordsZone(-1);
	elements["uncoordsZone"].value = "";
	calculateCurrentPop();
}

function changeUncoordsZone(value) {
	uncoordsZone = parseInt(value);
	if (uncoordsZone <= -1) {
		uncoordsZone = -1;
		elements["uncoordsZone"].value = "";
	} else if (uncoordsZone > runEnd) {
		uncoordsZone = runEnd;
		elements["uncoordsZone"].value = runEnd;
	} else changeUncoords(0);
	calculateCurrentPop();
}

function changeUncoordsGoal(value) {
	uncoordsGoal = parseInt(value);
	calculateCurrentPop();
}

function saveSettings() {
	var settings = {
		hze: hze,
		ticked: ticked,
		fuelStart: fuelStart,
		fuelEnd: fuelEnd,
		fuelZones: fuelZones,
		runEnd: runEnd,
		housingMod: housingMod,
		spiresCleared: spiresCleared,
		carp: carp,
		carp2: carp2,
		coord: coord,
		randimp: randimp,
		magmaFlow: magmaFlow,
		moreImports: moreImports,
		scaffolding: scaffolding,
		efficiency: efficiency,
		capacity: capacity,
		supply: supply,
		overclock: overclock,
		storage: storage,
		slowburn: slowburn,
		minimizeZone: minimizeZone,
		gatorZone: gatorZone,
		offset: offset,
		uncoords: uncoords,
		uncoordsZone: uncoordsZone,
		uncoordsGoal: uncoordsGoal
	}
	localStorage.setItem("GatorSettings", JSON.stringify(settings));
}

function loadSettings() {
	var settings = JSON.parse(localStorage.getItem("GatorSettings"));
	if (settings != null) {
		for (const [setting, value] of Object.entries(settings)) {
			if (typeof value != "undefined") window[setting] = value;
		}
		updateAfterLoad()
		elements["message"].innerText = "Settings loaded!";
	}
}

function updateAfterLoad() {
	elements["lockRun"].checked = ticked;
	elements["offset5"].checked = offset;
	changeFuelStart(fuelStart);
	elements["fuelStart"].value = fuelStart;
	changeFuelEnd(fuelEnd);
	elements["fuelEnd"].value = fuelEnd;
	changeFuelZones(fuelZones);
	elements["fuelZones"].value = fuelZones;
	changeRunEnd(runEnd);
	elements["runEnd"].value = runEnd;
	changeUncoords(uncoords);
	elements["uncoords"].value = uncoords;
	changeUncoordsZone(uncoordsZone);
	elements["uncoordsZone"].value = uncoordsZone;
	changeUncoordsGoal(uncoordsGoal);
	elements["uncoordsGoal"].selected = uncoordsGoal;
	changeHousingMod(housingMod);
	elements["housingMod"].value = housingMod;
	changeSpiresCleared(spiresCleared);
	elements["spiresCleared"].value = spiresCleared;
	changeCarp(carp);
	elements["carp"].value = carp;
	changeCarp2(carp2);
	elements["carp2"].value = carp2;
	changeCoord(coord);
	elements["coord"].value = coord;
	changeRandimp(randimp);
	if (randimp) elements["randimp"].value = "Yes";
	else elements["randimp"].value = "No";
	elements["moreImports"].value = moreImports;
	changeImports(moreImports)
	elements["scaffolding"].value = scaffolding;
	changeScaffolding(scaffolding);
	changeEfficiency(efficiency);
	elements["efficiency"].value = efficiency;
	changeCapacity(capacity);
	elements["capacity"].value = capacity;
	changeSupply(supply);
	elements["supply"].value = supply;
	changeOverclocker(overclock);
	elements["overclocker"].value = overclock;
	changeHZE(hze);
	elements["hze"].value = hze;
	changeStorage(storage);
	if (storage == 2) elements["storage"].value = "Yes";
	else elements["storage"].value = "No";
	changeSlowburn(slowburn);
	if (slowburn == 0.4) elements["slowburn"].value = "Yes";
	else elements["slowburn"].value = "No";
	changeMagmaFlow(magmaFlow);
	if (magmaFlow) elements["magmaFlow"].value = "Yes";
	else elements["magmaFlow"].value = "No";
	changeMinimizeZone(minimizeZone);
	elements["minimizeZone"].value = minimizeZone;
	changeGatorZone(gatorZone);
	elements["gatorZone"].value = gatorZone;
	checkDGUpgrades();
}

function goFaq() {
	if (elements["faqScreen"].style.display == "inline") elements["faqScreen"].style.display = "none";
	else elements["faqScreen"].style.display = "inline";
	elements["faqScreen"].focus();
}

//Make numbers look good.
function enumerate(x) {
	if (isNaN(x)) return x;
	if (x <= 9999) return x;
	if (x <= 100000) return (x / 1000).toFixed(2) + "K";
	if (x <= 1000000) return (x / 1000).toFixed(1) + "K";
	if (x <= 10000000) return (x / 1000000).toFixed(3) + "M";
	if (x <= 100000000) return (x / 1000000).toFixed(2) + "M";
	if (x <= 1000000000) return (x / 1000000).toFixed(1) + "M";
	if (x <= 10000000000) return (x / 1000000000).toFixed(3) + "B";
	if (x <= 100000000000) return (x / 1000000000).toFixed(2) + "B";
	if (x <= 1000000000000) return (x / 1000000000).toFixed(1) + "B";
	if (x <= 10000000000000) return (x / 1000000000000).toFixed(3) + "T";
	if (x <= 100000000000000) return (x / 1000000000000).toFixed(2) + "T";
	if (x <= 1000000000000000) return (x / 1000000000000).toFixed(1) + "T";
	if (x <= 10000000000000000) return (x / 1000000000000000).toFixed(3) + "Qa";
	if (x <= 100000000000000000) return (x / 1000000000000000).toFixed(2) + "Qa";
	if (x <= 1000000000000000000) return (x / 1000000000000000).toFixed(1) + "Qa";
	if (x <= 10000000000000000000) return (x / 1000000000000000000).toFixed(3) + "Qi";
	if (x <= 100000000000000000000) return (x / 1000000000000000000).toFixed(2) + "Qi";
	if (x <= 1000000000000000000000) return (x / 1000000000000000000).toFixed(1) + "Qi";
	if (x <= 10000000000000000000000) return (x / 1000000000000000000000).toFixed(3) + "Sx";
	if (x <= 100000000000000000000000) return (x / 1000000000000000000000).toFixed(2) + "Sx";
	if (x <= 1000000000000000000000000) return (x / 1000000000000000000000).toFixed(1) + "Sx";
	if (x <= 10000000000000000000000000) return (x / 1000000000000000000000000).toFixed(3) + "Sp";
	if (x <= 100000000000000000000000000) return (x / 1000000000000000000000000).toFixed(2) + "Sp";
	if (x <= 1000000000000000000000000000) return (x / 1000000000000000000000000).toFixed(1) + "Sp";
	if (x <= 10000000000000000000000000000) return (x / 1000000000000000000000000000).toFixed(3) + "Oc";
	if (x <= 100000000000000000000000000000) return (x / 1000000000000000000000000000).toFixed(2) + "Oc";
	if (x <= 1000000000000000000000000000000) return (x / 1000000000000000000000000000).toFixed(1) + "Oc";
	if (x <= 10000000000000000000000000000000) return (x / 1000000000000000000000000000000).toFixed(3) + "No";
	if (x <= 100000000000000000000000000000000) return (x / 1000000000000000000000000000000).toFixed(2) + "No";
	if (x <= 1000000000000000000000000000000000) return (x / 1000000000000000000000000000000).toFixed(1) + "No";
	if (x <= 10000000000000000000000000000000000) return (x / 1000000000000000000000000000000000).toFixed(3) + "Dc";
	if (x <= 100000000000000000000000000000000000) return (x / 1000000000000000000000000000000000).toFixed(2) + "Dc";
	if (x <= 1000000000000000000000000000000000000) return (x / 1000000000000000000000000000000000).toFixed(1) + "Dc";
	//add a while loop to deal with the rest
	x = (x / 1000000000000000000000000000000000000).toFixed(3);
	var n = 36;
	while (x > 999.999) {
		x = (x / 1000);
		n += 3;
	}
	if (x < 1000) x = (x / 1).toFixed(1);
	if (x < 100) x = (x / 1).toFixed(2);
	if (x < 10) x = (x / 1).toFixed(3);
	return x + "e" + n;
}

//Copyright Nohmou, 2018
