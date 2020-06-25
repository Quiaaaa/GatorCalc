window.onload = setup;
var version = "1.6";
var hze = 1;
var lockedRunStats = false;
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

var randimp = false;
var tauntimpFrequency = 2.97;
var magmaFlow = false;
var magmaCellsPerZone = 16;

var efficiency = 0;
var efficiencyMod = 1
var capacity = 0;
var maxCapacity = 3;
var supply = 0;
var supplyCap = 230;
var maxSupply = 0.2;
var overclocker = 0;
var overclockRate = 0;

var storage = false;
var storageMod = 1;
var slowburn = false;
var fuelPerTick = 0.5;
var popPerTick = 0;

var efficiencyCost = 8;
var capacityCost = 32;
var supplyCost = 64;
var overclockerCost = 512;

var efficiencyValue = 1;
var capacityValue = 1;
var supplyValue = 1;
var overclockerValue = 0;

var totalPop = 0;
var finalArmySize = 0;
var maxAmalgamators = 0;
var finalAmalgamators = 0;
var finalAmalgamatorZone = 0;

var magmaZones = 0;
var magmiteZones = 0;
var magmiteEarned = 0;
var currentPop = [];

var tauntimpPercent = 0;

var lastCoordination = 0;

var neededPop = 0;

var coordinationArmyIncrease = 0;
var armySizes = [];
var coordinationThresholds = [];
var finalAmalRatio = 0;
var yourFinalRatio = 0;


var minimizeZone = 230;
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
	calculateCarpentryMod();
}

function calculateCarpentryMod() {
	carpentryMod = Math.pow(1.1, carpentry) * (1 + 0.0025 * carpentry2);
}

function changeCoordinated(value) {
	coordinated = Math.max(0, parseInt(value));
	calculateCoordinationIncrease();
}

function calculateCoordinationIncrease() {
	coordinationArmyIncrease = 25 * 0.98 ** coordinated;
	document.getElementById("coordinationArmyIncrease").textContent = coordinationArmyIncrease.toFixed(4) + "%";
}

function changeRandimp(value) {
	randimp = value;
	if (value) tauntimpFrequency = 2.97;
	else tauntimpFrequency = 3.366;
}

function changeMagmaFlow(value) {
	magmaFlow = value;
	if (value) magmaCellsPerZone = 18;
	else magmaCellsPerZone = 16;
}

function calculateMagma() {
	magmaZones = runEnd - fuelStart;
	document.getElementById("magmaZones").textContent = magmaZones;
	
	document.getElementById("fuelZones").textContent = fuelZones;
	
	magmiteZones = magmaZones - fuelZones;
	document.getElementById("magmiteZones").textContent = magmiteZones;
	
	magmiteEarned = magmiteZones * magmaCelsPerZone;
	document.getElementById("magmiteEarned").textContent = magmiteEarned;
}

function changeEfficiency(value) {
	efficiency = Math.max(0, parseInt(value));
	efficiencyMod = 1 + efficiency / 10;
}

function changeCapacity(value) {
	capacity = Math.max(0, parseint(value));
	maxCapacity = 3 + capacity * 0.4;
}

function changeSupply(value) {
	supply = Math.max(0, parseInt(value));
	maxSupply = 0.2 + 0.02 * supply;
}

function changeOverclocker(value) {
	overclocker = Math.max(0, parseInt(value));
	if (overclocker = 0) overclockRate = 0;
	else overclockRate = 1 - 0.50 * Math.pow(0.99, overclocker-1);
}

function checkDimensionalGeneratorUpgrades() {}

function changeHZE(value) {
	hze = Math.max(1, parseInt(value));
}

function changeStorage(value) {
	storage = value;
	if (storage) storageMod = 2;
	else storageMod = 1;
}

function changeSlowburn(value) {
	slowburn = value;
	if (slowwburn) fuelPerTick = 0.4;
	else fuelPerTick = 0.5;
}

function calculateCurrentPop() {}

function pasteSave(save) {}

function clearSaveBox() {}

function optimize() {}

function minimize() {}

function changeMinimizeZone() {}

function saveSettings() {}

function loadSettings() {}

function openFAQ() {}

function enumerate() {}
