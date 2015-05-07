//file holds objects and constructors used by the software in every tournament

window.tournament = { 
	name: "", 
	totalTeams: 0, 
	roundNumber: 1, 
	rnd1Flip: "Heads", 
	rnd3Flip: "Heads", 
	isSideConstrained: false, 
	byeTeam: false, 
	impRemain: false
	};
window.pairings = [];
window.swapList = [];

function TeamObject(inputnumber) {
	this.name= "",
	this.record= 0, //ballots won
	this.pointDiff= 0, //points won
	this.combinedStr= 0, //combined strength
	this.rank= inputnumber, //lets make this the one that is assigned by tabber, and uniqueID as the school's special id
	this.impermissibles= [], //a list of teams (teamObjects) a team cannot face
	this.status= "", //plaintiff or defense
	this.uniqueID, // team number
	this.byeTeam = false, //not a bye team when we start
	this.temp1, //GL - Originally = 0. Uninstantiated for field validation.
	this.temp2, //GL - Originally = 0. Uninstantiated for field validation.
	this.tempRecord, //GL - Originally = 0. Uninstantiated for field validation.
	this.opponents = []; //list of opponents used to calculate CS
}

function Pairing(team1, team2) {
	this.isImpermissible = false; //presumed permissible
	this.pTeam = team1; //plaintiff team
	this.dTeam = team2; //defense team
	this.inTeamSwap; //holds proposed swaps for impermissible resolution
	this.outTeamSwap;
}

function ProposedSwap(inTeam, outTeam) { //swap object used only in solving impermissibles
	this.inTeam = inTeam; //team held "in" impermissible pairing object
	this.outTeam = outTeam; //team in different pairing we are proposing a swap with
	this.recordDiff = Math.abs(inTeam.record - outTeam.record); //calculate score differences
	this.CSdiff = Math.abs(inTeam.combinedStr - outTeam.combinedStr);
	this.PDdiff = Math.abs(inTeam.pointDiff - outTeam.pointDiff);
	this.rankSum = inTeam.rank + outTeam.rank;
	this.distance; //distance of teams from each other (adjacent or not?)
}
