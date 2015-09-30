var socket = io.connect('http://sociamvm-app-001.ecs.soton.ac.uk:9001');

//hard_cell is cell slider
var projects = ['galaxy_zoo' , 'moon_zoo' , 'solar_stormwatch' , 'old_weather' , 'the_milky_way_project' , 'planet_hunter' , 
				'ancient_lives' , 'whale_fm' , 'setilive' , 'seafloor_explorer' , 'cyclone_center' , 'bat_detective' , 'hard_cell' , 
				'serengeti' , 'planet_four' , 'notes_from_nature' , 'worms' , 'plankton' , 'radio' , 
				'operation_war_diary' , 'disk_detective' , 'sunspot' , 'condor_watch' , 'asteroid_zoo' , 'floating_forest' , 
				'chicago' , 'penguin' , 'higgs_hunter' , 'orchid', 'chimp']

var totalClassifications = 0;
var totalTalks = 0;
var users = {};
var subjects_classified = {};
var projects_active = {};
var countries_Active = {};

function start_socket(){

	loadProjectListToUI();

	socket.on('zooniverse_classifications', function (data) {
	        //console.log(data);
	        updateClassifiationActivity(data);
	        for(i in projects){
	        	document.getElementById(projects[i]).style.color = "#5c5c5c";
	        	if(projects[i] == data.project){
	        		//console.log("project matched: "+projects[i]);
	        		updateProjectColour(projects[i]);
	        	}
	        }
	        totalClassifications++;	
	        addProjectsToTotal(data.project);
	        addUsersToTotal(data.user_id);
	        addSubjectsToTotal(data.subjects);
	      	addCountriesToTotal(data.country_name)
	        updateStatsOverall();
	});

	socket.on('zooniverse_talk', function (data) {
			totalTalks++;
	        console.log(data);
	        updateTalkActivity(data);
	       	addUsersToTotal(data.data.user_zooniverse_id);
	       	addProjectsToTotal(data.project);
	        updateStatsOverall();
	});
	
};

function addSubjectsToTotal(subjectID){
	subjects_classified[subjectID] = true;
}

function addUsersToTotal(userID){
	users[userID] = true;
}


function addProjectsToTotal(projectID){
	projects_active[projectID] = true; 
}

function addCountriesToTotal(countryName){
	countries_Active[countryName] = true; 
}

function updateTalkActivity(data){

	var toUI = "";
	var person = "<div style=\"display: inline; font-size: 20px; color: #ff0071;\"><span>"+data.data.user_zooniverse_id+"</span></div>"
	var talk_text = "<div style=\"display: inline; font-size: 20px; color: #00CC00; \"><span>"+data.data.body+"</span></div>"
	var project = "<div style=\"display: inline; font-size: 20px; color: #ff0071; \"><span>"+data.project+"</span></div>"
	var created_at = "<div style=\"display: inline; font-size: 20px; color: #ff0071;\"><span>"+data.created_at.replace(" +0000","")+"</span></div>"


	// toUI = "Person "+data.user_id+" from "+data.country_name+" Has taken part in "+data.project+" Classifying the "+data.subjects+" Object at "+data.created_at;
	toUI = "Person "+person+" talked on project "+project+" saying "+talk_text;

	//console.log(toUI);
	updateUIActivityList(toUI);
}


function updateClassifiationActivity(data){

	var toUI = "";
	var person = "<div style=\"display: inline; font-size: 20px; color: #00aa78;\"><span>"+data.user_id+"</span></div>"
	var country = "<div style=\"display: inline; font-size: 20px; color: #FE7727; \"><span>"+data.country_name+"</span></div>"
	var project = "<div style=\"display: inline; font-size: 20px; color: #ff0071; \"><span>"+data.project+"</span></div>"
	var subjects = "<div style=\"display: inline; font-size: 20px; color: #a839b2; \"><span>"+data.subjects+"</span></div>"
	var date = data.created_at.split("2015 ")[1].replace(" +0000","");
	var created_at = "<div style=\"display: inline; font-size: 20px; color: #ff0071;\"><span>"+date+"</span></div>"


	// toUI = "Person "+data.user_id+" from "+data.country_name+" Has taken part in "+data.project+" Classifying the "+data.subjects+" Object at "+data.created_at;
	toUI = "Person "+person+" from "+country+" Has taken part in "+project+" Classifying the "+subjects+" Object at "+created_at+"<br>";

	//console.log(toUI);
	updateUIActivityList(toUI);
}

function updateStatsOverall(){
 
	var toUI = "";
	var classifications = "<div style=\"display: inline; font-size: 20px; color: #ff0071; \"><span>"+totalClassifications+"</span></div><div  style=\"display: inline;\"> classifications </div><br>"
	var talks = "<div style=\"display: inline; font-size: 20px; color: #00CC00; \"><span>"+totalTalks+" </span></div><div  style=\"display: inline;\"> talk messages </div><br>"
	var users_cnt = "<div style=\"display: inline; font-size: 20px; color: #00aa78; \"><span>"+Object.keys(users).length+" </span></div><div  style=\"display: inline;\"> users </div><br>"
	var subject_cnt = "<div style=\"display: inline; font-size: 20px; color: #a839b2; \"><span>"+Object.keys(subjects_classified).length+" </span></div><div  style=\"display: inline;\"> subjects </div><br>"
	var project_cnt = "<div style=\"display: inline; font-size: 20px; color: #ff0071; \"><span>"+Object.keys(projects_active).length+" </span></div><div  style=\"display: inline;\"> projects </div><br>"
	var country_cnt = "<div style=\"display: inline; font-size: 20px; color: #FE7727; \"><span>"+Object.keys(countries_Active).length+" </span></div><div  style=\"display: inline;\"> countries </div><br>"


	toUI = classifications + talks + users_cnt  + country_cnt + subject_cnt + project_cnt;

    $("#statsOverall span").html(toUI);

        

}




var numOfItems = 0;
function updateUIActivityList(data){
 
      if(numOfItems>8){
        $('#loc li:first').remove();
        --numOfItems;
      }

        //console.log(node.id, node.data.tags);
      ++numOfItems; 
       $('<li>' + data +'</li>').appendTo('ul#loc');
       
        

}






function loadProjectListToUI(){

	var html = "<div style=\"font-size: 25px; color: white; line-height: 25px;\">Zooniverse Projects </div>";
	var re = new RegExp('_', '');

	for(i in projects){

		html = html + "<div id=\""+projects[i]+"\"title=\""+projects[i]+"\"style=\"font-size: 20px; color: #5c5c5c; line-height: 25px;\"><span>"+projects[i].replace(re," ")+"</span></div>"

	}	

    $("#projects span").html(html);


}


function updateProjectColour(project_name){

	
		document.getElementById(project_name).style.color = "#ff0071";
		//console.log("no")
	

}
