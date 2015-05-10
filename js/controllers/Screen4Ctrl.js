'use strict';
//The controller that takes in data on how a team did in each round

var module = angular.module('tabtracker');
module.controller('Screen4Ctrl', Screen4Ctrl);

function Screen4Ctrl($scope, $state){
	
	$scope.showTeams = function() {
		this.name = tournament.name;
		this.round = tournament.roundNumber;
		this.flip1 = tournament.rnd1Flip;
		this.pairings = tournament.pairings;
	}
	
	$scope.values = [0, 0.5, 1, 1.5, 2];
	
	$scope.coinflip = ["Heads", "Tails"];
	
	$scope.pdChanged = function(pairing, team){
		
		//calculate record from PD
		if (team.temp1>0 && team.temp2>0){
			team.tempRecord = 2;
		} else if (team.temp1>0 && team.temp2<0 || team.temp1<0 && team.temp2>0 || team.temp1==0 && team.temp2==0) {
			team.tempRecord = 1;
		} else if (team.temp1>0 && team.temp2==0 || team.temp1==0 && team.temp2>0) {
			team.tempRecord = 1.5;
		} else if (team.temp1<0 && team.temp2==0 || team.temp1==0 && team.temp2<0) {
			team.tempRecord = 0.5;
		} else if (team.temp1<0 && team.temp2<0){
			team.tempRecord = 0;
		}
		
		//update opponent results, so long as there is no penalty (all loss, point subtraction, etc.)
		if (pairing.penalty == false){
			if (team.status == "p"){
				pairing.dTeam.tempRecord = (2-team.tempRecord);
				pairing.dTeam.temp1 = team.temp1 * -1;
				pairing.dTeam.temp2 = team.temp2 * -1;
			}
			if (team.status == "d"){
				pairing.pTeam.tempRecord = (2-team.tempRecord);
				pairing.pTeam.temp1 = team.temp1 * -1;
				pairing.pTeam.temp2 = team.temp2 * -1;
			}
		}
	}
	
	$scope.undoRound = function(){
		var loadTour = "tournament" + (tournament.roundNumber - 1);
		tournament = JSON.parse(localStorage.getItem(loadTour));
		window.swapList = [];
		$scope.showTeams();
	}
	
	$scope.saveRound = function() {
		
		//save the round without latest entries
		var saveTour = "tournament" + tournament.roundNumber;
		localStorage.setItem(saveTour, JSON.stringify(tournament));
		
		//save the round
		if (tournament.roundNumber == 1){tournament.rnd1Flip = this.flip1;}
		for (var i = 0; i < tournament.pairings.length; i++) {
			//update p team's record and points
			tournament.pairings[i].pTeam.record = tournament.pairings[i].pTeam.tempRecord + tournament.pairings[i].pTeam.record;
			tournament.pairings[i].pTeam.pointDiff = tournament.pairings[i].pTeam.temp1 + tournament.pairings[i].pTeam.temp2 + tournament.pairings[i].pTeam.pointDiff;
			
			//update d team's record and points
			tournament.pairings[i].dTeam.record = tournament.pairings[i].dTeam.tempRecord + tournament.pairings[i].dTeam.record;
			tournament.pairings[i].dTeam.pointDiff = tournament.pairings[i].dTeam.temp1 + tournament.pairings[i].dTeam.temp2 + tournament.pairings[i].dTeam.pointDiff;

			//to be used for determining impermissibles
			tournament.pairings[i].pTeam.impermissibles.push(tournament.pairings[i].dTeam.uniqueID);
			tournament.pairings[i].dTeam.impermissibles.push(tournament.pairings[i].pTeam.uniqueID);
			
			//to be used for calculating CS
			tournament.pairings[i].pTeam.opponents.push([tournament.pairings[i].dTeam.temp1, tournament.pairings[i].dTeam.temp2, tournament.pairings[i].dTeam.uniqueID]);
			tournament.pairings[i].dTeam.opponents.push([tournament.pairings[i].pTeam.temp1, tournament.pairings[i].pTeam.temp2, tournament.pairings[i].pTeam.uniqueID]);
		}
		tournament.roundNumber += 1;
	}
	
}