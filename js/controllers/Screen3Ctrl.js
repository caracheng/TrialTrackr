'use strict';
//The controller that saves team name info

var module = angular.module('tabtracker');
module.controller('Screen3Ctrl', Screen3Ctrl);

function Screen3Ctrl($scope, $state){

	this.showActiveNext = false;
	
		
	$scope.swapTeams = function(){
		var lastIndex = pairings.length-1;
		var lastPairing = pairings[lastIndex];
		var dTeam = lastPairing.pTeam;
		var pTeam = lastPairing.dTeam;
		var swappedPairing = new Pairing(pTeam, dTeam);
		pairings[lastIndex] = swappedPairing;
		updateRanks();
		//alert(pTeam.rank);
	}

	//runAutoPop: triggered when you click the auto populate button on screen 3
	//Automatically populates the team name and team ids
	//Because of the way I built this algorithm, where each team's impermissible is the id of the team before it the first team card does not get an automatically generated impermissible
	$scope.runAutoPop = function(numOfTeams) {
		var teamCardsFormFields= document.getElementById("teamCards").elements; //Grab every field in the form of team cards
		var numOfEmptyCardFields= teamCardsFormFields.length; 
		var j; 
		for (j=0; j < numOfEmptyCardFields; j++){ //For every form field...
			var field = teamCardsFormFields[j]; //grab the field
			//4 branches of if and else statements. the logic here is BAD and probably redundant -Gozong
			if (field.name == "teamName"){ //if the field is for team names...
				var teamName = randomTeamName(); //generate a random team name
				field.value = teamName; //update the form field value
			}
			else if (field.name == "teamNumber"){  //if the field is for team number..
				var uniqueID = randomUniqueID(); //generate a random id..
				field.value = uniqueID; //update the form field value
			}
			else if (field.name == "impermissible"){ //if the field name is impermissible..
				if (j == 2){ //but you're still autopopulating the FIRST team card
					field.value = ""; //set the impermissibles to nothing
				}
				else{ //if you've autopopulated more than 1 team card
					var prevUniqueID = teamCardsFormFields[j-4].value; //grab the unique id of the previous team card
					field.value = prevUniqueID; //update the impermissible field value
				}
			}
			else{ //if the field name is NOT team number, team name, or impermissible... it HAS to be the button for next round..
				field.disabled = false; //in that case, reenable the button so its clickable.
			}
		}
		document.getElementById("teamCards").className = "ng-valid";
		this.showActiveNext = true;
	}
	
	//'Randomizers'
	function randomUniqueID(){
		var number1 = Math.floor((Math.random() * 100) + 1);//randomly generate a number between 1 and 100
		var number2 = Math.floor((Math.random() * 100) + 1);//randomly generate another number
		var uniqueID = number1+""+number2; //Unique ID
		return uniqueID;
	}
	
	function randomTeamName(){
		var colleges = ['Macalester', 
						'Harvard', 
						'St. Thomas',
						'Hamline',
						'Carleton',
						'U of M',
						'Princeton',
						'Saint Paul Tech',
						'Monsters University',
						'Hogwarts',
						'University of Florida',
						'St. Cloud State',
						'Mankato State',
						'Winona State',
						'John Hopkins',
						'U W Madison',
						'Michigan State',
						'Chicago University',
						];
		var colors = ['Red', 'Blue', 'Yellow', 'Orange','Green', 'Silver', 'Gold', 'International'];
		
		var teams = ['Team', 
					'Division', 
					'Troop', 
					'Squad', 
					'Duo', 
					'Contingent', 
					'Trio', 
					'Triple', 
					'Faction', 
					'Party'];
		var etc = ['Baking Club',
				'Breakfast Club',
				'Kung Fu Fighters',
				'Knitting Club', 
				'Legal Geekery', 
				'Drama Club', 
				'Theatre Fanatics', 
				'Glee Club', 
				'Football Team', 
				'Bar Association', 
				'Republicans', 
				'Democrats', 
				'Marxists'];

		
		var wordLists1 = [colleges, colors];
		var wordLists2 = [teams, etc];
		
		var randomList1 = (Math.floor(Math.random()*2));
		var randomList2 = (Math.floor(Math.random()*2));
		
		var list1 = wordLists1[randomList1];
		var list2 = wordLists2[randomList2];
		
		var word1 = Math.floor(Math.random()*list1.length);
		var word2 = Math.floor(Math.random()*list2.length);
		
		var teamName = list1[word1]+" "+list2[word2];
		
		return teamName;
	}
		

	$scope.configTeams = function() { //on load, build the empty team forms 
		//var thisTournament = JSON.parse(localStorage.getItem('tournament')); //grab tournament object
		this.name = tournament.name; //assign {{name}} to the name of the tournament
		this.round = tournament.roundNumber;
		this.pairings = pairings;
		this.numTeams = Math.ceil(tournament.totalTeams/2) - 1;
		//this is grabbing the empty placeholder of all team forms
		//[[**pairing 1**{teamObject},{teamObject}],[**pairing 2**{teamObject1},{teamObject1}], etc...]
		//this.pairings = JSON.parse(localStorage.getItem('pairings'));
	}
	
	$scope.byeTeamOptions = [true, false];
	$scope.isByeTeam = tournament.byeTeam;
	
	// NEEDS EDITED TO UPDATE PAIRINGS OBJECTS
	$scope.startR1 = function($scope) { //clicking the button to start round 1
		//check and see if forms have been filled out yet (ng click is triggered regardless if ng disable is enabled or not on an image)
		// is any of this doing anything?
		var classes = document.getElementById("teamCards").className;
		var classesList = classes.split(" ");
		if (classesList.indexOf("ng-valid") == -1){
			//Alert the user of their mistake
			//alert("Please fill out every team card.");
			//this.showActiveNext = true;
			return;
		}
	
		//this.showActiveNext = true;
		//double check this is the right tournament
		//alert("testing: her eis the round number: "+tournament.roundNumber+" and here is the tournament total teams: "+tournament.totalTeams);
	
		//save the current tournament team information
		//localStorage.setItem('round'+tournament.roundNumber+'pairings', JSON.stringify(pairings)); //store pairings from the global model js file into local storage
		//localStorage.setItem('round'+tournament.roundNumber+'tournamentinfo', JSON.stringify(tournament)); //store pairings from the global model js file into local storage

		//alert("Completed storing round "+tournament.roundNumber+" info.");
		//var tournament = JSON.parse(localStorage.getItem('tournament'));//grab the number of totals teams from local storage
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
			var impList = $(imp_label).val();
			impList = impList.replace(/ /g, "");
			plaintiff.impermissibles = impList.split(",");
			
			counter +=1; //increment the counter/index of the pairing object, so we can grab the 2nd team of the pairing
			name_label = "#teamName"+counter;// similar to above--build the name of the name input box
			id_label = "#teamID"+counter; //build the name of the id input box
			imp_label = "#teamImp"+counter;
			defendant.name= $(name_label).val(); //update defendant's name and number properties
			defendant.uniqueID = $(id_label).val();
			impList = $(imp_label).val();
			impList = impList.replace(/ /g, "");
			defendant.impermissibles = impList.split(",");
			//---Insert into 
			pairing.pTeam = plaintiff;
			pairing.dTeam = defendant;
			counter +=1

		}
		//localStorage.setItem('pairings', JSON.stringify(this.pairings)); //store tournament teams into local storage
		//NEEDS EDITED UP UPDATE PAIRINGS
	}
	
}