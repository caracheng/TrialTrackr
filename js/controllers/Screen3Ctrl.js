'use strict';
//The controller that saves team name info

var module = angular.module('tabtracker');
module.controller('Screen3Ctrl', Screen3Ctrl);

function Screen3Ctrl($scope, $state){

	this.showActiveNext = false;
	
		
	$scope.swapByeTeam = function(){
		var lastIndex = pairings.length-1;
		var lastPairing = pairings[lastIndex];
		var dTeam = lastPairing.pTeam;
		var pTeam = lastPairing.dTeam;
		var swappedPairing = new Pairing(pTeam, dTeam);
		pairings[lastIndex] = swappedPairing;
		updateRanks();
		//alert(pTeam.rank);
	}

	$scope.configTeams = function() { 
		//on load, pull tournament data from the model 
		this.name = tournament.name; 
		this.round = tournament.roundNumber;
		this.pairings = pairings;
		this.numTeams = Math.ceil(tournament.totalTeams/2) - 1;
	}
	
	$scope.byeTeamOptions = [true, false];
	$scope.isByeTeam = tournament.byeTeam;
	
	$scope.startR1 = function($scope) { 
		//clicking the button to start round 1

		var counter = 0;
		for (var i=0; i < (parseInt(tournament.totalTeams)/2); i++){
						
			var pairing = pairings[i];//grab the pairing
			var plaintiff = pairing.pTeam;//grab the plaintiff
			var defendant = pairing.dTeam;//grab the defendant
			
			//---Update the properties of the plaintiff and defendant
			var name_label = "#teamName"+counter; // build the name of the name input box in html
			var id_label = "#teamID"+counter; //build the name of the id input box
			var imp_label = "#teamImp"+counter;
			plaintiff.name = $(name_label).val(); //update plaintiff to have value user feeds into input box
			plaintiff.uniqueID = $(id_label).val(); //update plaintiff to have value user feeds into input box
			var impList = $(imp_label).val(); //load the impermissibles
			impList = impList.replace(/ /g, "");
			plaintiff.impermissibles = impList.split(",");
			
			counter +=1; //increment the counter/index of the pairing object, so we can grab the 2nd team of the pairing
			name_label = "#teamName"+counter;// similar to above--build the name of the name input box
			id_label = "#teamID"+counter; //build the name of the id input box
			imp_label = "#teamImp"+counter;
			defendant.name= $(name_label).val(); //update defendant's name and number properties
			defendant.uniqueID = $(id_label).val();
			impList = $(imp_label).val(); //load the impermissibles
			impList = impList.replace(/ /g, "");
			defendant.impermissibles = impList.split(",");
			//---Insert into 
			pairing.pTeam = plaintiff;
			pairing.dTeam = defendant;
			counter +=1

		}

	}
	
}