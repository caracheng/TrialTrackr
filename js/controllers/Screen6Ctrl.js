'use strict';
//The controller that displays final results after round 4

var module = angular.module('tabtracker');
module.controller('Screen6Ctrl', Screen6Ctrl);

function Screen6Ctrl($scope, $state){
	
	//triggered when user clicks on "back" button
	$scope.undoRound = function(){
		var loadPair = "pairings" + (tournament.roundNumber - 1);
		var loadTour = "tournament" + (tournament.roundNumber - 1);
		tournament = JSON.parse(localStorage.getItem(loadTour));
		pairings = JSON.parse(localStorage.getItem(loadPair));
		window.swapList = [];
	}
	
	$scope.getWinners = function() {
		//stuff to show on screen
		this.name = tournament.name;
		
		this.finalTeams = [];
		var unsortedTeams = [];
		
		//unpair the teams into a list of unsorted teams
		for (var i = 0; i < pairings.length; i+=1){
			var thisPair = pairings[i];
			var team1 = thisPair.pTeam;
			var team2 = thisPair.dTeam;
			unsortedTeams.push(team1);
			unsortedTeams.push(team2);
		}
		
		//update for the final time the CS of every team
		for (var i = 0; i < unsortedTeams.length; i+=1){
			updateCS(unsortedTeams[i], unsortedTeams);
		}
		
		var sortedTeams = unsortedTeams.sort(s); //sort teams by appropriate values: record, CS, and PD
			
		//set final ranks
		for (var i = 0; i < sortedTeams.length; i+=2) {
			sortedTeams[i].rank = i+1;
			sortedTeams[i+1].rank = i+2;
		}
		
		//display results
		this.finalTeams = sortedTeams;
	}
}