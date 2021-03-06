'use strict';
//The controller that displays team names and matchups, and resolves impermissible matches

var module = angular.module('tabtracker');
module.controller('Screen5Ctrl', Screen5Ctrl);

function Screen5Ctrl($scope, $state){
	
		
	$scope.swapTeams = function(aPairing, thesePairings) {
		/*
		Data this function needs:
		- side constrained or not
		- "in" Team's location IN THE PAIRNGS and side
		- "out" Team's location IN THE PAIRINGS and side
		*/
		
		var inTeamRank = aPairing.inTeam.rank;
		var inTeamSide = aPairing.inTeam.status;
		var outTeamRank = aPairing.outTeam.rank;
		var outTeamSide = aPairing.outTeam.status;
		
		if (tournament.isSideConstrained){ //SC
			if (inTeamSide == "p"){
				thesePairings[outTeamRank].pTeam = aPairing.inTeam;
				thesePairings[inTeamRank].pTeam = aPairing.outTeam;
			} else if (inTeamSide == "d"){
				thesePairings[outTeamRank].dTeam = aPairing.inTeam;
				thesePairings[inTeamRank].dTeam = aPairing.outTeam;
			}
		} else if (!tournament.isSideConstrained) { //NSC
			inTeamRank = Math.floor(inTeamRank/2);
			outTeamRank = Math.floor(outTeamRank/2);
			console.log(inTeamRank, inTeamSide);
			console.log(outTeamRank, outTeamSide);
			if (inTeamSide == "p"){
				if (outTeamSide == "p"){
					thesePairings[outTeamRank].pTeam = aPairing.inTeam;
					thesePairings[inTeamRank].pTeam = aPairing.outTeam;
				} else if (outTeamSide == "d"){
					thesePairings[outTeamRank].dTeam = aPairing.inTeam;
					thesePairings[inTeamRank].pTeam = aPairing.outTeam;
				}
			} else if (inTeamSide == "d"){
				if (outTeamSide == "p"){
					thesePairings[outTeamRank].pTeam = aPairing.inTeam;
					thesePairings[inTeamRank].dTeam = aPairing.outTeam;
				} else if (outTeamSide == "d"){
					thesePairings[outTeamRank].dTeam = aPairing.inTeam;
					thesePairings[inTeamRank].dTeam = aPairing.outTeam;
				}
			}
		}
		
		//reset impermissibles to false before checking them again
		thesePairings[inTeamRank].isImpermissible = false;
		thesePairings[inTeamRank].topImp = false;
		thesePairings[outTeamRank].isImpermissible = false;
		thesePairings[outTeamRank].topImp = false;
		tournament.impRemain = false;
		console.log(thesePairings);
		
		//add swap to swap list so it cannot happen again
		swapList.push(aPairing.outTeam.uniqueID + "-" + aPairing.inTeam.uniqueID);
		$scope.swapList = swapList;
		
		//update pairings object and ranks
		tournament.pairings = thesePairings;
		console.log(tournament.pairings);
		updateRanks();
		
		//check the impermissibles again
		checkImpermissibles(tournament.pairings, swapList);
		//update the screen
		this.newPairings = tournament.pairings;
		console.log(this.newPairings);
		$scope.unresolved = tournament.impRemain;
	}
	
	$scope.flip = tournament.rnd3Flip;
	
	//$scope.unresolved = tournament.impRemain;
	
	$scope.flipSides = function(){ //executes when tab director switches pairing sides in round 3 
		for (var i = 0; i < tournament.pairings.length; i+=1){
			var wasP = tournament.pairings[i].pTeam;
			var wasD = tournament.pairings[i].dTeam;

			tournament.pairings[i].pTeam = wasD;
			tournament.pairings[i].dTeam = wasP;
			tournament.pairings[i].pTeam.status = "p";
			tournament.pairings[i].dTeam.status = "d";
		}
		if (tournament.rnd3Flip == "Heads") { //change coin flip result on click
			tournament.rnd3Flip = "Tails";
		} else {
				tournament.rnd3Flip = "Heads";
		} 
		this.flip = tournament.rnd3Flip;
		updateRanks();
		checkImpermissibles(tournament.pairings, swapList);
		this.newPairings = tournament.pairings;
	}
	
	$scope.coinflip = ["Heads", "Tails"]; //options for coinflip results, heads by default
	
	$scope.saveSwaps = function(){ //triggered when user finishes with impermissibles and saves their results
		tournament.pairings = this.newPairings;
		var saveTour = "tournament" + tournament.roundNumber;
		localStorage.setItem(saveTour, JSON.stringify(tournament));
	}
	
	$scope.undoRound = function(){ //triggered when user clicks "back". loads last round's tournament and pairing data
		var loadTour = "tournament" + (tournament.roundNumber - 1);
		tournament = JSON.parse(localStorage.getItem(loadTour));
		swapList = [];
	}
	
	$scope.pairTeams = function() {
		//display tournament name and round number
		this.name = tournament.name;
		this.round = tournament.roundNumber;
		
		var unsortedTeams = []; //unpair the teams
		var leftColumn = []; 
		var rightColumn = [];
		
		//swap list needs to be reset to empty after each round
		swapList = [];
		this.swapList = [];
		
		//determines whether or not this round is side constrained - only round 3 is side constrained
		if (tournament.roundNumber == 3) {
			tournament.isSideConstrained = false;
			} else {
				tournament.isSideConstrained = true;
			}
			
		var numTeams = 0; 
		
		//un-pair the teams, and push them into either two stacks of teams or one
		for (var i = 0; i < tournament.pairings.length; i+=1){
			var thisPair = tournament.pairings[i];
			var wasPTeam = thisPair.pTeam;
			var wasDTeam = thisPair.dTeam;
			
			if (!tournament.isSideConstrained){
				unsortedTeams.push(wasPTeam);
				unsortedTeams.push(wasDTeam);
				numTeams +=2;
			}
			if (tournament.isSideConstrained){
				rightColumn.push(wasPTeam);
				leftColumn.push(wasDTeam);
				numTeams +=2;
			}
		}
		
		// sort and re-pair the teams
		this.newPairings = [];
		var sortingAlgorithm = pickSortAlg(tournament.roundNumber); //picks the appropriate sorting algorithm, which varies by round
		
		var ByeTeam;
		var byeLocation;
		
		if (!tournament.isSideConstrained){ //round not side constrained
	
			for (var i = 0; i < numTeams; i+=2) {
				//reset values to undefined for error checking
				unsortedTeams[i].tempRecord = undefined;
				unsortedTeams[i+1].tempRecord = undefined;
				unsortedTeams[i].temp1 = undefined;
				unsortedTeams[i+1].temp1 = undefined;
				unsortedTeams[i].temp2 = undefined;
				unsortedTeams[i+1].temp2 = undefined;
				
				//find the byeTeam 
				if (unsortedTeams[i].byeTeam == true) {
					ByeTeam = unsortedTeams[i];
					byeLocation = i;
				}
				if (unsortedTeams[i+1].byeTeam == true) {
					ByeTeam = unsortedTeams[i+1];
					byeLocation = i+1;
				}
				
				//update CS
				updateCS(unsortedTeams[i], unsortedTeams);
				updateCS(unsortedTeams[i+1], unsortedTeams);
			}
			
			//remove the bye team
			if (tournament.byeTeam){unsortedTeams.splice(byeLocation, 1);}
			
			//sort teams by appropriate values
			var sortedTeams = unsortedTeams.sort(sortingAlgorithm); 
			
			//drop bye team back in at the bottom of the pairings
			if (tournament.byeTeam){sortedTeams.push(ByeTeam);}
			
			for (var i = 0; i < sortedTeams.length; i+=2) { //pair teams
				//set team ranks
				sortedTeams[i].rank = i;
				sortedTeams[i+1].rank = i+1;
				unsortedTeams[i].status = "p";
				unsortedTeams[i+1].status = "d";
				
				//make a pairing
				var pair =  new Pairing(sortedTeams[i],sortedTeams[i+1]);
				this.newPairings.push(pair);
			}
		}		
		
		if (tournament.isSideConstrained){ //round is side constrained

			for (var i = 0; i < numTeams/2; i+=1) {
				//undefine values for error checking
				leftColumn[i].tempRecord = undefined;
				rightColumn[i].tempRecord = undefined;
				leftColumn[i].temp1 = undefined;
				rightColumn[i].temp1 = undefined;
				leftColumn[i].temp2 = undefined;
				rightColumn[i].temp2 = undefined;
				leftColumn[i].status = "p";
				rightColumn[i].status = "d";
				
				//update CS
				updateCS(rightColumn[i], rightColumn.concat(leftColumn));
				updateCS(leftColumn[i], rightColumn.concat(leftColumn));
				
				//find Bye Team
				if (rightColumn[i].byeTeam == true) {
					ByeTeam = rightColumn[i];
					byeLocation = i;
				}
				if (leftColumn[i].byeTeam == true) {
					ByeTeam = leftColumn[i];
					byeLocation = i;
				}
			}
			//take out Bye Team
			if (tournament.byeTeam){
				if (ByeTeam.status == "p"){
					leftColumn.splice(byeLocation,1);
				} else {
					rightColumn.splice(byeLocation,1);
				}
			}

			//sort Teams
			var sortedDTeams = rightColumn.sort(sortingAlgorithm); //sort each stack of teams
			var sortedPTeams = leftColumn.sort(sortingAlgorithm);
			
			//drop bye team in at the bottom of the pairings
			if(tournament.byeTeam){
				if (ByeTeam.status == "p"){
					sortedPTeams.push(ByeTeam);
				} else {
					sortedDTeams.push(ByeTeam);
				}
			}

			
			for (var i = 0; i < sortedPTeams.length; i+=1) { //pair teams from P and D stack
				sortedPTeams[i].rank = i;
				sortedDTeams[i].rank = i;

				var pair =  new Pairing(sortedPTeams[i],sortedDTeams[i]);
				this.newPairings.push(pair);
			}
		}
		tournament.pairings = this.newPairings;
		checkImpermissibles(this.newPairings, swapList); //check for impermissibles
		$scope.unresolved = tournament.impRemain;
	}
}