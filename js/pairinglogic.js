//File contains logical functions used in pairing each new round at the tournament

//Microlibrary used to sort teams, pairings and swaps
//ThenBy.JS microlibrary is Copyright 2013 Teun Duynstee
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//http://www.apache.org/licenses/LICENSE-2.0
window.firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();

//algorithm used for final results page - never changes
window.s = firstBy(function (v1, v2) { return v2.record - v1.record; })
			.thenBy(function (v1, v2) { return v2.combinedStr - v1.combinedStr ; })
			.thenBy(function (v1, v2) { return v2.pointDiff - v1.pointDiff ; });				

window.pickSwapAlg = function(round){ //picks the algorithm to sort swap options, which depends on the round
	var result;
	if (round >= 3){
		result = firstBy(function (v1, v2) { return v1.distance - v2.distance; })
			.thenBy(function (v1, v2) { return v1.recordDiff - v2.recordDiff ; })
			.thenBy(function (v1, v2) { return v1.CSdiff - v2.CSdiff ; })
			.thenBy(function (v1, v2) { return v1.PDdiff - v2.PDdiff ; })
			.thenBy(function (v1, v2) { return v2.rankSum - v1.rankSum ; });
	} else {
		result = firstBy(function (v1, v2) { return v1.distance - v2.distance; })
			.thenBy(function (v1, v2) { return v1.recordDiff - v2.recordDiff ; })
			.thenBy(function (v1, v2) { return v1.PDdiff - v2.PDdiff ; })
			.thenBy(function (v1, v2) { return v2.rankSum - v1.rankSum ; });
	}
	return result;
}

window.pickSortAlg = function(round){ //picks the algorithm to sort teams, which depends on the round
	var result;
	
	if(round == 2){
		if (tournament.rnd1Flip == "Heads"){
			result = firstBy(function (v1, v2) { return v2.record - v1.record; })
				.thenBy(function (v1, v2) { return v2.pointDiff - v1.pointDiff ; })
				.thenBy(function (v1, v2) { return v2.uniqueID - v1.uniqueID ; });
		}
		if (tournament.rnd1Flip == "Tails"){
			result = firstBy(function (v1, v2) { return v2.record - v1.record; })
				.thenBy(function (v1, v2) { return v2.pointDiff - v1.pointDiff ; })
				.thenBy(function (v1, v2) { return v1.uniqueID - v2.uniqueID ; });
		}
	} else {
		if (tournament.rnd1Flip == "Heads"){
			result = firstBy(function (v1, v2) { return v2.record - v1.record; })
				.thenBy(function (v1, v2) { return v2.combinedStr - v1.combinedStr ; })
				.thenBy(function (v1, v2) { return v2.pointDiff - v1.pointDiff ; })
				.thenBy(function (v1, v2) { return v2.uniqueID - v1.uniqueID ; });
		}
		if (tournament.rnd1Flip == "Tails"){
			result = firstBy(function (v1, v2) { return v2.record - v1.record; })
				.thenBy(function (v1, v2) { return v2.combinedStr - v1.combinedStr ; })
				.thenBy(function (v1, v2) { return v2.pointDiff - v1.pointDiff ; })
				.thenBy(function (v1, v2) { return v1.uniqueID - v2.uniqueID ; });
		}
	}
	return result;
}
		
window.updateCS = function(team, allTeams){	//updates the CS of a team
	team.combinedStr = 0;
	var newCS = 0;
	var opponents = team.opponents;

	for (var i =0; i < opponents.length; i++){ //go through opponents
		var opponent = opponents[i]; //grab the opponent
		var oppID = opponent[2]; //grab the opponent's team number
		
		for (var j=0; j<allTeams.length; j++){ //go through other teams
			if (allTeams[j].uniqueID == oppID){ //if we hit that team
				newCS += allTeams[j].record; //add their record to our CS
			}
		}
	}
	team.combinedStr = newCS;
}

window.updateRanks = function(){ //updates the rank and side of every team
	if(!tournament.isSideConstrained){
		var rank = 0
		for(var i = 0; i< pairings.length; i+=1){
			pairings[i].pTeam.rank = rank;
			rank +=1;
			pairings[i].dTeam.rank = rank;
			rank +=1;
			pairings[i].pTeam.status = "p";
			pairings[i].dTeam.status = "d";
		}
	}
	if(tournament.isSideConstrained){
		for(var i = 0; i< pairings.length; i+=1){
			pairings[i].pTeam.rank = i;
			pairings[i].dTeam.rank = i;
			pairings[i].pTeam.status = "p";
			pairings[i].dTeam.status = "d";
		}
	}
}

window.checkImpermissibles = function(pairedTeams, swapped){ //check for impermissibles in the sorted pairings
	for (i = 0; i < pairedTeams.length; i++){
		var list = pairedTeams[i].pTeam.impermissibles;
		var ID = pairedTeams[i].dTeam.uniqueID;
		
		if (_.contains(list, ID)){
			pairedTeams[i].isImpermissible = true; //set pairing as impermissible
			tournament.impRemain = true; //tell tournament that there are impermissibles
		}

	}
	if (tournament.impRemain){	//if there are impermissibles, propose swaps to resolve them
		for (var x = 0; x < pairedTeams.length; x+=1){
			if (pairedTeams[x].isImpermissible){ //need to merge the logic here
				if (!tournament.isSideConstrained){
					proposeSwapNSC(pairedTeams[x], x, pairedTeams, swapped); //Non SC swaps
					} 
				if (tournament.isSideConstrained){
					proposeSwapSC(pairedTeams[x], x, pairedTeams, swapped); //SC swaps
					} 
			}
		}
	}
}

window.proposeSwapNSC = function(impMatch, location, pairs, swapped){ //non side constrained swap search algorithm
	p = impMatch.pTeam; //take the teams out of the impermissible match
	d = impMatch.dTeam;
	swOptions = [];
	radius = 1;
	while (radius < pairs.length){
		if (location - radius >= 0){
			swap = new ProposedSwap(p, pairs[location-radius].dTeam);
			swap.distance = radius;
			var teamIDa = swap.outTeam.uniqueID + "-" + swap.inTeam.uniqueID;
			var teamIDb = swap.inTeam.uniqueID + "-" + swap.outTeam.uniqueID;
			if (!_.contains(swapped, teamIDa) && !_.contains(swapped, teamIDb)){
				console.log("legal swap proposed");
				swOptions.push(swap);
			}
		}
		if (location + radius <= (pairs.length-1)){
			swap2 = new ProposedSwap(d, pairs[location+radius].pTeam);
			swap2.distance = radius;
			var teamIDa = swap2.outTeam.uniqueID + "-" + swap2.inTeam.uniqueID;
			var teamIDb = swap2.inTeam.uniqueID + "-" + swap2.outTeam.uniqueID;
			if (!_.contains(swapped, teamIDa) && !_.contains(swapped, teamIDb)){

				swOptions.push(swap2);
			}
		}
		radius+=1;
	}

	var leastDiff = pickSwapAlg(tournament.roundNumber); //pick sorting algorithm for swaps
	swOptions.sort(leastDiff); //sort the proposed swaps by closest score
	//console.log(swOptions);
	pairs[location].inTeam = swOptions[0].inTeam;
	pairs[location].outTeam = swOptions[0].outTeam;
}	

window.proposeSwapSC = function(impMatch, location, pairs, swapped){ //proposing side constrained swaps
	p = impMatch.pTeam;
	d = impMatch.dTeam;
	pSwaps = [];
	dSwaps = [];
	swOptions = [];
	radius = 1;
	
	while (radius < pairs.length){
		if (location - radius >= 0){
			pSwaps.push(pairs[location-radius].pTeam)
			dSwaps.push(pairs[location-radius].dTeam)
		}
		if (location + radius <= (pairs.length-1)){
			pSwaps.push(pairs[location+radius].pTeam)
			dSwaps.push(pairs[location+radius].dTeam)
		}
	
		for (var a = 0; a<pSwaps.length; a++){
			swap = new ProposedSwap(p, pSwaps[a]);
			swap.distance = radius;
			var teamIDa = swap.outTeam.uniqueID + "-" + swap.inTeam.uniqueID;
			var teamIDb = swap.inTeam.uniqueID + "-" + swap.outTeam.uniqueID;
			//if the proposed swap hasn't already taken place, add it to the proposed swap list
			if (!_.contains(swapped, teamIDa) && !_.contains(swapped, teamIDb)){
				swOptions.push(swap);
			}
		
			swap2 = new ProposedSwap(d, dSwaps[a]);
			swap2.distance = radius;
			var teamIDa = swap2.outTeam.uniqueID + "-" + swap2.inTeam.uniqueID;
			var teamIDb = swap2.inTeam.uniqueID + "-" + swap2.outTeam.uniqueID;
			if (!_.contains(swapped, teamIDa) && !_.contains(swapped, teamIDb)){
				swOptions.push(swap2);
			}
		}
		radius +=1;
	}

	var leastDiff = pickSwapAlg(tournament.roundNumber); //pick a sorting algorithm for proposed swaps
	swOptions.sort(leastDiff); //sort the proposed swaps by least difference betweens scores
	//console.log(swOptions);
	//console.log(swOptions[0]);
	pairs[location].inTeam = swOptions[0].inTeam; //put proposed teams to swap in place
	pairs[location].outTeam = swOptions[0].outTeam;
}	
