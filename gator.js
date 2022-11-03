window.onload = setup;
var version = "1.8";
var ticked = false; // lock runstats
var offset = true; // 5 zone offset

var carpMod = 0;
var tauntimpFrequency = 2.97;
var maxCapacity = 3;
var maxSupply = 0.2;
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



let elements;


function setup() {
	const elementsToGet = ["inputs", "saveBox", "calculate", "lockRun", "invalid", "efficiencyEfficiency", "capacityEfficiency", "supplyEfficiency", "overclockerEfficiency", "checkDG", "macros", "version", "optimize", "minimize", "minimizeAtZone", "minimizeZone", "minimizeCapacity", "message", "results", "resultsTable", "totalPop", "finalAmals", "tauntimpPercent", "maxAmals", "lastCoord", "finalAmalZone", "neededPop", "finalArmySize", "coordIncrease", "finalAmalRatio", "yourFinalRatio", "zonesOfMagma", "zonesWithheld", "zonesOfFuel", "zonesOfMI", "totalMI", "maxSupplyZone", "extraGators", "ex1", "npm1", "uc1", "ex2", "npm2", "uc2", "ex3", "npm3", "uc3", "ex4", "npm4", "uc4", "ex5", "npm5", "uc5", "faq", "faqScreen"]
	elementsToGet.push(...Object.values(settings).map(s => s.elementName)); // include all 
	elements = Object.fromEntries(elementsToGet.map(element => [element, document.getElementById(element)]))
	loadSettings();
	elements["version"].innerText = version;
}


// All user inputs, UI updates, and recalculations required on change
const settings = {
	//runstats
	fuelStart: {
		value: 230,
		elementName: "fuelStart",
		update: function (value = this.value, show = true) {
			this.value = parseInt(value);
			if (this.value < 230) this.value = 230;
			if (this.value > settings.fuelEnd.value) settings.fuelEnd.value = this.value;
			if (this.value > settings.runEnd.value) settings.runEnd.value = this.value;
			if (show) elements[this.elementName].value = this.value;
			settings.fuelZones.value = settings.fuelEnd.value - this.value;
			calculateMagma();
			calculateCurrentPop(show);
		},
	},
	fuelEnd: {
		value: 235,
		elementName: "fuelEnd",
		update: function (value = this.value, show = true) {
			this.value = parseInt(value);
			if (this.value < settings.fuelStart.value) settings.fuelStart.value = this.value;
			if (this.value > settings.runEnd.value) settings.runEnd.value = this.value;
			if (show) elements[this.elementName].value = this.value;
			if (settings.fuelZones.value != (this.value - settings.fuelStart.value)) settings.fuelZones.update(this.value - settings.fuelStart.value, show);
			calculateMagma();
			calculateCurrentPop(show);
		},
	},
	fuelZones: {
		value: 5,
		elementName: "fuelZones",
		update: function (value = this.value, show = true) {
			this.value = parseInt(value);
			if (show) elements[this.elementName].value = this.value;
			if (settings.fuelEnd.value != (settings.fuelStart.value + this.value)) settings.fuelEnd.update(settings.fuelStart.value + this.value, show);
			calculateMagma();
			calculateCurrentPop(show);
		}
	},
	runEnd: {
		value: 0,
		elementName: "runEnd",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateMagma();
			calculateCurrentPop();
		}
	},
	housingMod: {
		value: 1,
		elementName: "housingMod",
		update: function (value = this.value) {
			this.value = parseInt(value);
			if (this.value < 0) {
				this.value = 1 + (this.value / 100);
				elements[this.elementName].value = this.value.toFixed(2);
			}
			calculateCurrentPop();
		}
	},
	spiresCleared: {
		value: 0,
		elementName: "spiresCleared",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateFinalAmalRatio();
			if (this.value >= 2) ar2 = 1000000000;
			else ar2 = ar1;
			if (this.value >= 3) ar3 = 100000000;
			else ar3 = ar2;
			if (this.value >= 4) ar4 = 10000000;
			else ar4 = ar3;
			if (this.value >= 5) ar5 = 1000000;
			else ar5 = ar4;
			calculateCurrentPop();
		}
	},
	hze: {
		value: 0,
		elementName: "hze",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			checkDGUpgrades();
		}
	},
	//perks
	carp: {
		value: 0,
		elementName: "carp",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateCarpMod();
			calculateCurrentPop();
		}
	},
	carp2: {
		value: 0,
		elementName: "carp2",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateCarpMod();
			calculateCurrentPop();
		}
	},
	coord: {
		value: 0,
		elementName: "coord",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateCoordIncrease();
			calculateCurrentPop();
		}
	},
	//misc upgrades
	randimp: {
		value: false,
		elementName: "randimp",
		update: function (value = this.value) {
			this.value = !(value == "No" || !value);
			elements[this.elementName].value = this.value ? "Yes" : "No";
			calculateTauntimpFrequency();
			calculateCurrentPop();
		}
	},
	magmaFlow: {
		value: 0,
		elementName: "magmaFlow",
		update: function (value = this.value) {
			this.value = !(value == "No" || !value);
			elements[this.elementName].value = this.value ? "Yes" : "No";
			magmaCells = this.value ? 18 : 16;
			calculateMagma();
			calculateCurrentPop();
		}
	},
	moreImports: {
		value: 0,
		elementName: "moreImports",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateTauntimpFrequency();
			calculateCurrentPop();
		}
	},
	scaffolding: {
		value: 0,
		elementName: "scaffolding",
		update: function (value = this.value) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			calculateCarpMod();
			calculateCurrentPop();
		}
	},
	//dg upgrades
	efficiency: {
		value: 0,
		elementName: "efficiency",
		cost: 8,
		update: function (value = this.value, mod) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			this.cost = (this.value + 1) * 8;
			calculateMinTick();
			calculateMaxTick();
			calculateCurrentPop();
			if (mod == undefined) checkDGUpgrades();
		}
	},
	capacity: {
		value: 0,
		elementName: "capacity",
		cost: 32,
		update: function (value = this.value, mod) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			this.cost = (this.value + 1) * 32;
			maxCapacity = 3 + (settings.capacity.value * 0.4);
			calculateMaxTick();
			calculateCurrentPop();
			if (mod == undefined) checkDGUpgrades();
		}
	},
	supply: {
		value: 0,
		elementName: "supply",
		cost: 64,
		update: function (value = this.value, mod) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			this.cost = (this.value + 1) * 64;
			maxSupply = 0.2 + (this.value * 0.02);
			elements["maxSupplyZone"].innerText = (230 + (2 * this.value));
			calculateCurrentPop();
			if (mod == undefined) checkDGUpgrades();
		}
	},
	overclocker: {
		value: 0,
		elementName: "overclocker",
		cost: 512,
		bonus: 0,
		update: function (value = this.value, mod) {
			this.value = parseInt(value);
			elements[this.elementName].value = this.value;
			this.cost = 512 + (this.value) * 32;
			this.bonus = (this.value < 1) ? 1 : 1 - (0.5 * Math.pow(0.99, this.value - 1));
			calculateCurrentPop();
			if (mod == undefined) checkDGUpgrades();
		}
	},
	//perm dg upgrades
	storage: {
		value: 1,
		elementName: "storage",
		update: function (value = this.value) {
			this.value = (value == "Yes" || value == 2) ? 2 : 1;
			elements[this.elementName].value = this.value == 2 ? "Yes" : "No";
			calculateCurrentPop();
		}
	},
	slowburn: {
		value: 0.4,
		elementName: "slowburn",
		update: function (value = this.value) {
			this.value = (value == "Yes" || value == 0.4) ? 0.4 : 0.5;
			elements[this.elementName].value = this.value == 0.4 ? "Yes" : "No";
			calculateMinTick();
			calculateCurrentPop();
		}
	},
	//optimization targets
	minimizeZone: {
		value: 231,
		elementName: "minimizeZone",
		update: function (value = this.value) {
			this.value = value < 231 ? 231 : value;
			elements[this.elementName].value = this.value;
		}
	},
	gatorTarget: {
		value: "Max",
		elementName: "gatorTarget",
		update: function (value = this.value) {
			this.value = value;
			elements[this.elementName].value = this.value;
			if (this.value == "Max") {
				elements["minimize"].setAttribute("onclick", "minimize(0)");
				elements["minimizeAtZone"].setAttribute("onclick", "minimize(0, 1)");
				elements["minimizeCapacity"].setAttribute("onclick", "minimize(0, 2)");
			}
			else {
				elements["minimize"].setAttribute("onclick", "minimize(1)");
				elements["minimizeAtZone"].setAttribute("onclick", "minimize(1, 1)");
				elements["minimizeCapacity"].setAttribute("onclick", "minimize(1, 2)");
			}
		}
	}

	/*
	gatorZone: {
		value: 231,
		elementName: "gatorZone",
		update: function (value = this.value) {
			this.value = value < 231 ? 231 : value;
			elements[this.elementName].value = this.value;
		}
	},
	*/
}

/*
function changeUncoords(value) {
	uncoords = parseInt(value);
	if (uncoords <= 0) {
		uncoords = 0;
		elements["uncoords"].value = uncoords;
		calculateCurrentPop();
		return;
	} else if (uncoords > 100 + settings.runEnd.value) {
		uncoords = 100 + settings.runEnd.value;
		elements["uncoords"].value = uncoords;
	}
	changeUncoordsZone(-1);
	calculateCurrentPop();
}

function changeUncoordsZone(value) {
	uncoordsZone = parseInt(value);
	if (uncoordsZone <= -1) {
		uncoordsZone = -1;
		elements["uncoordsZone"].value = "";
	} else if (uncoordsZone > settings.runEnd.value) {
		uncoordsZone = settings.runEnd.value;
		elements["uncoordsZone"].value = settings.runEnd.value;
	} else changeUncoords(0);
	calculateCurrentPop();
}

function changeUncoordsGoal(value) {
	uncoordsGoal = parseInt(value);
	elements["uncoordsGoal"].selected = uncoordsGoal;
	calculateCurrentPop();
}
*/

function calculateTauntimpFrequency() {
	// Non-round numbers are because you only get 99 random cells per zone
	tauntimpFrequency = 2.97;
	if (settings.randimp.value) tauntimpFrequency += 0.396;
	if (settings.moreImports.value) tauntimpFrequency += settings.moreImports.value * .05 * 99 / 100; // inc chance * possible import cells / world cells
}

function checkDGUpgrades() {
	var myStart = settings.fuelStart.value;
	var myEnd = settings.fuelEnd.value;
	var myRunEnd = settings.runEnd.value;
	var myMI = totalMI;
	if (myMI == 0) return;
	settings.fuelStart.update(230);
	if (settings.hze.value > 0) {
		settings.runEnd.update(settings.hze.value);
		settings.fuelEnd.update(settings.hze.value);
	}
	else {
		settings.fuelEnd.update(settings.runEnd.value);
	}
	var myPop = totalPop;

	settings.efficiency.update(settings.efficiency.value + 1, 1);
	var efficiencyEfficiency = totalPop - myPop;
	settings.efficiency.update(settings.efficiency.value - 1, 1);
	settings.capacity.update(settings.capacity.value + 1, 1);
	var capacityEfficiency = totalPop - myPop;
	settings.capacity.update(settings.capacity.value - 1, 1);
	settings.supply.update(settings.supply.value + 1, 1);
	var supplyEfficiency = totalPop - myPop;
	settings.supply.update(settings.supply.value - 1, 1);
	settings.overclocker.update(settings.overclocker.value + 1, 1);
	var overclockerEfficiency = totalPop - myPop;
	settings.overclocker.update(settings.overclocker.value - 1, 1);

	var eCost = settings.efficiency.cost;
	var cCost = settings.capacity.cost;
	var sCost = settings.supply.cost;
	var oCost = settings.overclocker.cost;

	if (eCost > myMI * 4.9) settings.efficiency.cost = -1;
	else if ((eCost * 2) + 8 <= myMI);
	else if (eCost <= myMI) {
		settings.efficiency.cost += (myMI - eCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (eCost > myMI) {
			settings.efficiency.cost += myMI;
			eCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		settings.efficiency.cost += (myMI - eCost) * 0.2;
	}
	if (cCost > myMI * 4.9) settings.capacity.cost = -1;
	else if ((cCost * 2) + 32 <= myMI);
	else if (cCost <= myMI) {
		settings.capacity.cost += (myMI - cCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (cCost > myMI) {
			settings.capacity.cost += myMI;
			cCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		settings.capacity.cost += (myMI - cCost) * 0.2;
	}
	if (sCost > myMI * 4.9) settings.supply.cost = -1;
	else if ((sCost * 2) + 64 <= myMI);
	else if (sCost <= myMI) {
		settings.supply.cost += (myMI - sCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (sCost > myMI) {
			settings.supply.cost += myMI;
			sCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		settings.supply.cost += (myMI - sCost) * 0.2;
	}
	if (oCost > myMI * 4.9) settings.overclocker.cost = -1;
	else if ((oCost * 2) + 32 <= myMI);
	else if (oCost <= myMI) {
		settings.overclocker.cost += (myMI - oCost) * 0.2;
	} else {
		var runsNeeded = 1;
		while (oCost > myMI) {
			settings.overclocker.cost += myMI;
			oCost -= myMI * Math.pow(0.8, runsNeeded);
			runsNeeded++;
			if (runsNeeded > 20) {
				break;
			}
		}
		settings.overclocker.cost += (myMI - oCost) * 0.2;
	}

	efficiencyEfficiency /= settings.efficiency.cost;
	capacityEfficiency /= settings.capacity.cost;
	supplyEfficiency /= settings.supply.cost;
	overclockerEfficiency /= settings.overclocker.cost;

	if (settings.efficiency.cost < 0) elements["efficiencyEfficiency"].innerText = "-----";
	else elements["efficiencyEfficiency"].innerText = "1";
	if (settings.capacity.cost < 0) elements["capacityEfficiency"].innerText = "-----";
	else elements["capacityEfficiency"].innerText = (capacityEfficiency / efficiencyEfficiency).toFixed(4);
	if (settings.supply.cost < 0) elements["supplyEfficiency"].innerText = "-----";
	else elements["supplyEfficiency"].innerText = (supplyEfficiency / efficiencyEfficiency).toFixed(4);
	if (settings.overclocker.cost < 0) elements["overclockerEfficiency"].innerText = "-----";
	else elements["overclockerEfficiency"].innerText = (overclockerEfficiency / efficiencyEfficiency).toFixed(4);

	settings.runEnd.update(myRunEnd);
	settings.fuelStart.update(myStart);
	settings.fuelEnd.update(myEnd);
}


function calculateMagma() {
	elements["zonesOfFuel"].innerText = settings.fuelZones.value;
	zonesOfMI = (settings.runEnd.value - 230) - settings.fuelZones.value;
	elements["zonesOfMI"].innerText = zonesOfMI;
	elements["zonesOfMagma"].innerText = settings.runEnd.value - 230;
	if (settings.magmaFlow.value) totalMI = zonesOfMI * 18;
	else totalMI = zonesOfMI * 16;
	elements["totalMI"].innerText = totalMI;
}

function calculateCoordIncrease() {
	coordIncrease = 25 * Math.pow(0.98, settings.coord.value);
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
	elements["finalAmalRatio"].innerText = Math.max(10000000000 / Math.pow(10, settings.spiresCleared.value - 1), 1000000);
	//elements["finalAmalRatio"].innerText = enumerate(Math.max(10000000000 / Math.pow(10, spiresCleared - 1), 1000000));
}

function calculateCarpMod() {
	carpMod = minTick * Math.pow(1.1, settings.carp.value) * (1 + (settings.carp2.value * 0.0025)) * (1 + (settings.scaffolding.value * Math.pow(1.1, settings.scaffolding.value - 1)));
}

function calculateMinTick() {
	minTick = Math.sqrt(settings.slowburn.value) * 500000000 * (1 + (0.1 * settings.efficiency.value));
	tickRatio = maxTick / minTick;
	calculateCarpMod();
}

function calculateMaxTick() {
	maxTick = Math.sqrt(maxCapacity) * 500000000 * (1 + (0.1 * settings.efficiency.value));
	if (minTick > 0) tickRatio = maxTick / minTick;
}

function calculateCurrentPop(show = true) {
	//offset = elements["offset5"].checked;
	var sum = [];
	var myHze = settings.runEnd.value;
	if (settings.hze.value > myHze) myHze = settings.hze.value;
	// base CI on end zone
	var confInterval = (1 - (1.91 / Math.sqrt((settings.runEnd.value - settings.fuelStart.value) * tauntimpFrequency)))
	var useConf = true;
	var skippedCoords = 0;
	var goalReached = false;
	//console.log(confValue);

	for (i = 0; i <= (myHze - 200); i++) { //calc an extra 30 zones because why not
		// i = zone offset from z230

		//calc fuel gain
		if (i == 0) fuelThisZone[0] = 0.2;
		else fuelThisZone[i] = Math.min(fuelThisZone[i - 1] + 0.01, maxSupply);
		if ((i + 230) >= settings.fuelStart.value && (i + 230) <= settings.fuelEnd.value) {
			if (i == 0) totalFuel[0] = 0.2;
			else totalFuel[i] = (magmaCells * fuelThisZone[i]) + totalFuel[i - 1];
		} else totalFuel[i] = 0;

		//calc generated pop
		overclockTicks[i] = Math.max((totalFuel[i] - (settings.storage.value * maxCapacity)) / settings.slowburn.value, 0);
		overclockPop[i] = Math.floor(overclockTicks[i]) * (carpMod * tickRatio) * settings.overclocker.bonus;
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
		amalRatio[i] = (popWithTauntimp[i] * settings.housingMod.value) / (coordPop[i] / 3);
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
	totalPop = popWithTauntimp[settings.runEnd.value - 230] * settings.housingMod.value;
	tauntimpPercent = (percentFromTauntimp[settings.runEnd.value - 230] * 100);
	finalAmals = currentAmals[settings.runEnd.value - 230];
	maxAmals = 0;
	for (i = 0; i <= (settings.runEnd.value - 230); i++) {
		if (currentAmals[i] > maxAmals) {
			maxAmals = currentAmals[i];
			finalAmalZone = i + 230;
		}
	}
	neededPop = coordPop[settings.runEnd.value - 230] / 3;
	finalArmySize = neededPop * Math.pow(1000, finalAmals);
	yourFinalRatio = totalPop / finalArmySize;
	saveSettings();

	if (show) {
		elements["zonesWithheld"].innerText = skippedCoords <= 0 ? '-' : skippedCoords;
		elements["totalPop"].innerText = totalPop.toPrecision(3);
		elements["tauntimpPercent"].innerText = tauntimpPercent.toFixed(2);
		elements["finalAmals"].innerText = finalAmals;
		elements["maxAmals"].innerText = maxAmals;
		elements["finalAmalZone"].innerText = finalAmalZone;
		elements["neededPop"].innerText = neededPop.toPrecision(3);
		elements["finalArmySize"].innerText = finalArmySize.toPrecision(3);
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
		elements["message"].innerText = "";
	}

}


function optimize() {
	var myFuelZones = settings.fuelZones.value;
	var bestAmals = maxAmals;
	settings.fuelStart.update(230, false);
	var bestPop = 0;
	var myFuelStart = 230;
	for (f = 230; f <= (settings.runEnd.value - myFuelZones); f++) {
		settings.fuelStart.update(f, false);
		settings.fuelZones.update(myFuelZones, false);
		if (totalPop > bestPop && maxAmals >= bestAmals) {
			bestPop = totalPop;
			myFuelStart = f;
			bestAmals = Math.max(maxAmals, bestAmals); // max pop is not always max gators
		}
	}
	settings.fuelStart.update(myFuelStart);
	settings.fuelZones.update(myFuelZones);
	elements["message"].innerText = "Starting fuel zone optimized!";
}

function minimize(dif, variant) {
	if (variant == 2) elements["message"].innerText = "Calculating...";
	settings.fuelStart.update(230, false);
	var myEnd = settings.runEnd.value;
	if (variant == 1) settings.runEnd.update(settings.minimizeZone.value, false);
	settings.fuelEnd.update(settings.runEnd.value, false);
	var bestAmals = finalAmals - dif;
	var bestJ = settings.fuelZones.value;
	var maxedAmals = false;
	if (variant == 1) {
		settings.runEnd.update(settings.minimizeZone.value - 1);
		settings.fuelStart.update(settings.minimizeZone.value - 1, false);
	}
	else settings.fuelStart.update(settings.runEnd.value, false);
	settings.fuelZones.update(0, false);
	if (variant == 2) var myCapacity = settings.capacity.value;

	while (settings.fuelStart.value >= 230) {
		while (finalAmals > 0 && finalAmals >= bestAmals && settings.fuelZones.value > 0) {
			// minimize capacity
			if (variant == 2) {
				var myPop = totalPop;
				while (totalPop >= myPop) {
					settings.capacity.update(settings.capacity.value - 1, 2);
					if (totalPop >= myPop) myPop = totalPop;
					else {
						settings.capacity.update(settings.capacity.value + 1, 2);
						break;
					}
				}
			}
			bestJ = settings.fuelZones.value;
			settings.fuelZones.value -= 1;
			settings.fuelZones.update(settings.fuelZones.value, false);
			maxedAmals = true;
		}
		settings.fuelZones.update(settings.fuelZones.value, false);
		settings.fuelStart.value -= 1;
		if (settings.fuelStart.value >= 230) settings.fuelStart.update(settings.fuelStart.value, false);
		if (variant == 1) settings.fuelZones.update(Math.min(settings.minimizeZone.value - settings.fuelStart.value, bestJ), false); // minimize at zone
		else settings.fuelZones.update(Math.min(settings.runEnd.value - settings.fuelStart.value, bestJ), false);
		if (maxedAmals == true && finalAmals < bestAmals) break;
	}
	// if ratios are dropping per zone, fuel a little extra for safety's sake
	if (amalRatio[finalAmalZone] > amalRatio[finalAmalZone + 1]) {
		bestJ += Math.ceil(bestJ * .1)
	}
	if (finalAmals === 0) {
		bestJ = Math.min(Math.max(10, bestJ * .1), settings.runEnd.value - 230);
	}
	settings.fuelZones.update(bestJ, true);
	optimize();
	if (variant == 1) {
		settings.runEnd.update(myEnd);
	}
	if (variant == 2) {
		myPop = totalPop;
		for (b = 0; b < 4; b++) { //run this a bunch or something
			settings.capacity.update(settings.capacity.value + 1, 2);
			while (totalPop >= myPop && finalAmals >= bestAmals && settings.capacity.value <= myCapacity) {
				myPop = totalPop;
				settings.capacity.update(settings.capacity.value + 1, 2);
			}
			settings.capacity.update(settings.capacity.value - 1);
			optimize();
		}
	}
	elements["message"].innerText = "Zones to fuel minimized!";
	if (variant == 2) elements["message"].innerText = "Ideal slider setting: " + (3 + settings.capacity.value * settings.slowburn.value) + " max fuel";
}


/*
function forceGator() {
	var x1 = adjustedRatio[settings.gatorZone.value - 230];
	var y1 = settings.gatorZone.value;
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
	if (settings.gatorZone.value <= finalAmalZone) elements["message"].innerText = "Zone too low!";
}
*/

// Save and Load functions
function clearText() {
	elements["saveBox"].value = "";
}

function saveSettings() {
	let saveObj = Object.fromEntries(Object.entries(settings).map(([name, data]) => [name, data.value]))
	saveObj["ticked"] = ticked;
	//saveObj["offset"] = offset;
	localStorage.setItem("GatorSettings", JSON.stringify(saveObj));
	//	uncoords: uncoords,
	//	uncoordsZone: uncoordsZone,
	//	uncoordsGoal: uncoordsGoal
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
	settings.carp.value = game.portal.Carpentry.level;
	settings.carp2.value = game.portal.Carpentry_II.level;
	settings.coord.value = game.portal.Coordinated.level;
	settings.randimp.value = game.talents.magimp.purchased;
	settings.magmaFlow.value = game.talents.magmaFlow.purchased;
	settings.moreImports.value = game.permaBoneBonuses.exotic.owned;
	settings.scaffolding.value = game.global.autoBattleData.bonuses?.Scaffolding ? game.global.autoBattleData.bonuses?.Scaffolding : 0;
	settings.efficiency.value = game.generatorUpgrades.Efficiency.upgrades;
	settings.capacity.value = game.generatorUpgrades.Capacity.upgrades;
	settings.supply.value = game.generatorUpgrades.Supply.upgrades;
	settings.overclocker.value = game.generatorUpgrades.Overclocker.upgrades;
	settings.storage.value = game.permanentGeneratorUpgrades.Storage.owned ? 2 : 1;
	settings.slowburn.value = game.permanentGeneratorUpgrades.Slowburn.owned ? .4 : .5;
	if (!ticked) {
		settings.hze.value = game.global.highestLevelCleared;
		settings.runEnd.value = game.global.lastPortal;
		settings.spiresCleared.value = game.global.spiresCompleted;
		// pull supervision settings
		if (game.global.genStateConfig.length == 0) {
			settings.fuelStart.value = 230;
			settings.fuelEnd.value = settings.runEnd.value;
		}
		else {
			settings.fuelStart.value = game.global.genStateConfig[0][1];
			settings.fuelEnd.value = game.global.genStateConfig[1][1];
		}
		if (game.global.dailyChallenge.large != undefined) {
			settings.housingMod.value = 1 - (game.global.dailyChallenge.large.strength / 100)
		} else settings.housingMod.value = 1;
	}
	checkDGUpgrades();
	updateAfterLoad();
	elements["message"].innerText = "Stats populated!";
	//console.log(game);
}

function loadSettings() {
	var loadedSettings = JSON.parse(localStorage.getItem("GatorSettings"));
	if (loadedSettings != null) {
		for (const [setting, value] of Object.entries(loadedSettings)) {
			if (settings[setting]) settings[setting].value = value;
		}
		ticked = loadedSettings.ticked;
		//offset = loadedSettings.offset;
		updateAfterLoad()
		elements["message"].innerText = "Settings loaded!";
	}
}

function updateAfterLoad() {
	elements["lockRun"].checked = ticked;
	//elements["offset5"].checked = offset;
	Object.values(settings).forEach((setting) => setting.update());
	//changeUncoords(uncoords);
	//changeUncoordsZone(uncoordsZone);
	//changeUncoordsGoal(uncoordsGoal);

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
