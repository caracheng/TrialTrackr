window.checkAutosave = function(){
	//check for autosaved files
	var savepoints = ["tournament1", "tournament2", "tournament3", "tournament4"]
	var recentSave = null;
	for (var i = 0; i<savepoints.length; i++){
		var loaded = JSON.parse(localStorage.getItem(savepoints[i]));
		if(loaded){
			recentSave = loaded;
		}
	}
	return recentSave;
}

window.loadTournament = function(){
	//load tournament file
}

window.saveTournament = function(){
	//save tournament file
}