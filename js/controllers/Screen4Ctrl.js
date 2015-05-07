'use strict';
//The controller that takes in data on how a team did in each round

var module = angular.module('tabtracker');
module.controller('Screen4Ctrl', Screen4Ctrl);

function Screen4Ctrl($scope, $state){
	
	$scope.showTeams = function() {
		this.name = tournament.name;
		this.round = tournament.roundNumber;
		this.flip1 = tournament.rnd1Flip;
		this.pairings = window.pairings;
	}
	
	$scope.values = [0, 0.5, 1, 1.5, 2];
	
	$scope.coinflip = ["Heads", "Tails"];
	
	$scope.undoRound = function(){
		var loadPair = "pairings" + (tournament.roundNumber - 1);
		var loadTour = "tournament" + (tournament.roundNumber - 1);
		tournament = JSON.parse(localStorage.getItem(loadTour));
		pairings = JSON.parse(localStorage.getItem(loadPair));
		console.log("loaded last round");
		window.swapList = [];
		$scope.showTeams();
	}
	
	$scope.saveRound = function() {
		
		//save the round without latest entries
		var savePair = "pairings" + tournament.roundNumber;
		var saveTour = "tournament" + tournament.roundNumber;
		localStorage.setItem(savePair, JSON.stringify(pairings));
		localStorage.setItem(saveTour, JSON.stringify(tournament));
		
		//save the round
		if (tournament.roundNumber == 1){tournament.rnd1Flip = this.flip1;}
		for (var i = 0; i < this.pairings.length; i++) {
			//update p team's record and points
			this.pairings[i].pTeam.record = pairings[i].pTeam.tempRecord + pairings[i].pTeam.record;
			this.pairings[i].pTeam.pointDiff = pairings[i].pTeam.temp1 + pairings[i].pTeam.temp2 + pairings[i].pTeam.pointDiff;
			
			//update d team's record and points
			this.pairings[i].dTeam.record = pairings[i].dTeam.tempRecord + pairings[i].dTeam.record;
			this.pairings[i].dTeam.pointDiff = pairings[i].dTeam.temp1 + pairings[i].dTeam.temp2 + pairings[i].dTeam.pointDiff;

			//to be used for determining impermissibles
			this.pairings[i].pTeam.impermissibles.push(pairings[i].dTeam.uniqueID);
			this.pairings[i].dTeam.impermissibles.push(pairings[i].pTeam.uniqueID);
			
			//to be used for calculating CS
			this.pairings[i].pTeam.opponents.push([pairings[i].dTeam.temp1, pairings[i].dTeam.temp2, pairings[i].dTeam.uniqueID]);
			this.pairings[i].dTeam.opponents.push([pairings[i].pTeam.temp1, pairings[i].pTeam.temp2, pairings[i].pTeam.uniqueID]);
		}
		//Save the round for the back button
		tournament.roundNumber += 1;
	}
	
}