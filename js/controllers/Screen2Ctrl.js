'use strict';
//The controller that sets up the tournament

var module = angular.module('tabtracker');
module.controller('Screen2Ctrl', Screen2Ctrl);

function Screen2Ctrl($scope, $state){

		$scope.initTour = function(){
			//clear out old data
			if (tournament.totalTeams > 0){
				tournament.name = "";
				tournament.totalTeams = 0;
				pairings = [];
				tournament.byeTeam = false;
			}
			localStorage.clear();
			
			tournament.name = $('#tourName').val();
			tournament.totalTeams = $('#totalTeams').val();
			
			
			for (var j=0; j < tournament.totalTeams; j+=2) {
				if (j+1 >= tournament.totalTeams){
					var newTeam = new TeamObject(j);
					newTeam.status = "p";
					var newTeam2 = new TeamObject(j+1); 
					tournament.byeTeam = true; //require a bye team when there is odd number of teams
					newTeam2.status = "d";
					newTeam2.byeTeam = true;
					newTeam2.name = "Bye Team";
					newTeam2.uniqueID = "9999";
					var thisPair = new Pairing(newTeam, newTeam2);
					pairings.push(thisPair);
				}	
				else {			
					var newTeam = new TeamObject(j);
					var newTeam2 = new TeamObject(j+1);
					newTeam.status = "p";
					newTeam2.status = "d"; 
					var thisPair = new Pairing(newTeam, newTeam2);
					pairings.push(thisPair);					
				}
			}
		}
}