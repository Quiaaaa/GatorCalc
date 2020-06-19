window.onload = setup;
var version = "1.6";
var hze = 0;
var ticked = false;
var fuelStart = 230;
var fuelEnd = 230;
var fuelZones = 0;
var runEnd = 230;
var housingMod = 1;
var spiresCleared = 0;
var carpentry = 0;
var carpentry2 = 0;
var carpentryMod = 0;
var coordinated = 0;
var tauntimpFrequency = 2.97;
var efficiency = 0;
var efficiencyMod = 1
var capacity = 0;
var maxCapacity = 3;
var supply = 0;
var maxSupply = 0.2;
var overclocker = 0;
var overclockRate = 0;
var storage = 1;
var fuelPerTick = 0.5;
var magmaCellsPerZone = 16;
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
var maxAmalgamators = 0;
var lastCoord = 0;
var finalAmalgamatorZone = 0;
var neededPop = 0;
var finalArmySize = 0;
var coordinationArmyIncrease = 0;
var ArmySizes = [];
var coordinationThresholds;
var finalAmalRatio = 0;
var yourFinalRatio = 0;
var magmaZones = 0;
var magmiteZones = 0;
var totalMagmite = 0;

var ar1 = 10000000000;
var ar2;
var ar3;
var ar4;
var ar5;

var withheldCoords = 0;
var withholdStopZone = -1;
var totalGatorGoal = 1;
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
	loadSettings(); //Load
	document.getElementById("version").innerHTML = version;
}

function changeFuelStart(value) {
	fuelStart = Math.max(230, parseInt(value));
	if (fuelEnd < fuelStart) {
		fuelEnd = fuelStart;
		document.getElementById("fuelEnd").value = fuelEnd;
	}
	if (runEnd < fuelEnd) {
		runEnd = fuelEnd;
		document.getElementById("runEnd").value = runEnd;
	}
	fuelZones = fuelEnd - fuelStart;
	document.getElementById("fuelZones").value = fuelZones;
}

function changeFuelEnd(value) {
	fuelEnd = Math.max(230, parseInt(value));
	if (fuelStart > fuelEnd) {
		fuelStart = fuelEnd;
		document.getElementById("fuelStart").value = fuelStart;
	}
	if (runEnd < fuelEnd) {
		runEnd = fuelEnd;
		document.getElementById("runEnd").value = runEnd;
	}
	fuelZones = fuelEnd - fuelStart;
	document.getElementById("fuelZones").value = fuelZones;
}

function changeFuelZones(value) {
	fuelZones = Math.max(0, parseInt(value));
	fuelEnd = fuelStart + fuelZones;
	document.getElementById("fuelEnd").value = fuelEnd;
	if (runEnd < fuelEnd) {
		runEnd = fuelEnd;
		document.getElementById("runEnd").value = runEnd;
	}
}

function changeRunEnd(value) {
	runEnd = Math.max(1, parseInt(value));
	if (fuelStart > runEnd) {
		fuelStart = runEnd;
		document.getElementById("fuelStart").value = fuelStart;
	}
	if (fuelEnd > runEnd) {
		fuelEnd = runEnd;
		document.getElementById("fuelEnd").value = fuelEnd;
		fuelZones = fuelEnd - fuelStart;
		document.getElementById("fuelZones").value = fuelZones;
	}
}

function changeHousingMod(value) {
	housingMod = parsefloat(value);
	if (housingMod < 0) {
		housingMod = 1 + housingMod / 100;
		document.getElementById("housingMod").value = housingMod;
	}
}

function changeSpiresCleared(value) {
	spiresCleared = Math.min(7, Math.max(0, parseInt(value)));
}

function changeCarpentry(value) {
	carpentry = Math.max(0, parseInt(value));
	calculateCarpentryMod();
}

function changeCarpentry2(value) {
	carpentry2 = Math.max(0, parseInt(value));
}

function calculateCarpentryMod() {
	carpentryMod = Math.pow(1.1, carpentry) * (1+ 0.0025 * carpentry2);
}

function changeCoord() {}

function changeRandimp() {}

function changeEfficiency() {}

function changeCapacity() {}

function changeSupply() {}

function changeOverclocker() {}

function checkDGUpgrades() {}

function changeHZE() {}

function changeStorage() {}

function changeSlowburn() {}

function changeMagmaFlow() {}

function calculateMagma() {}

function calculateCoordIncrease() {}

function calculateFinalAmalRatio() {}

function calculateMinTick() {}

function calculateMaxTick() {}

function calculateCurrentPop() {}

function pasteSave(save) {}

function clearText() {}

function optimize() {}

function minimize() {}

function changeMinimizeZone() {}

function forceGator() {}

function changeGatorZone() {}

function changeWithheldCoords() {}

function changeWithheldCoordsZone() {}

function changeGatorGoal() {}

function saveSettings() {}

function loadSettings() {}

function openFAQ() {}

function enumerate() {}
