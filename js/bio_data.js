/*
 *  This is a Generic Resumé building JavaScript given the CV data is sent in the format of the JSON object attached
 *  see the visualised JSON object attached.
 *  It is a Generic generator and not related to myself, So the multiple resumé data can be parsed and a page can be
 *  built out.
 */


// var bioParsed = $.parseJSON(bio_data); if a third party JSON object is received uncomment
// otherwise use the following to simply use the JSON Object itself (can use bio_data as this an object of itself)
// for clarity I have used this as a JSON parsed object
var bioParsed = bio_data;

// Define and empty array to create the HTML section needed by the page
var html_sections = [];

// Create the HTML Elements to be inserted on the main page
var HTMLObject = new HTML_Helpers();
console.log (HTMLObject);

// for each JSON object build the appropriate HTML section , about me, education, work, skills, etc.
$.each(bioParsed, function(key, value) {
	analyse_bio_and_build_html(key, value);
});

// Check if the all the HTML Tags are built properly
console.log("analysed sections: ", html_sections);

// map the user locations
bio_locations = new map_locations();
console.log(bio_locations);

// Now that we have all the HTML Tags, build the page using the Seleton structure on index.html
build_out_page();


// This function builds the sections out by analysing if each section was supplied in the
// JSON object
function build_out_page(){
	// create the contact row, its always at the HTML section
	if (html_sections[0].hasOwnProperty("HTMLemail")){
		$("#contact-list").append(html_sections[0].HTMLemail);
	}
	if (html_sections[0].hasOwnProperty("HTMLtwitter")){
		$("#contact-list").append(html_sections[0].HTMLtwitter);
	}
	if (html_sections[0].hasOwnProperty("HTMLgithub")){
		$("#contact-list").append(html_sections[0].HTMLgithub);
	}
	if (html_sections[0].hasOwnProperty("HTMLlinkedin")){
		$("#contact-list").append(html_sections[0].HTMLlinkedin);
	}
	// build the name image and address
	if (html_sections[0].hasOwnProperty("HTMLbioPic")){
		$("#biopic").append(html_sections[0].HTMLbioPic);
	}
	if (html_sections[0].hasOwnProperty("locations")){
		$("#current-address").append(html_sections[0].locations[0]);
	}
	if (html_sections[0].hasOwnProperty("HTMLheaderName")){
		$("#indie_name").append(html_sections[0].HTMLheaderName);
		$("#title").append(html_sections[0].HTMLheaderRole);
	}

	// add the skills section
	// check if there' any skills first before adding the sections
	if (html_sections[3].skills.length > 0) {
		$("#skillschart").append(HTMLObject.HTMLskillsStart);
		for (var eachSkill in html_sections[3].skills) {
			$("#skills").append(html_sections[3].skills[eachSkill].HTMLskill);
			// check each sub skills if exists add them to the list
			if (html_sections[3].skills[eachSkill].keywords.length > 0 ) {
				for (var eachsubSkill in html_sections[3].skills[eachSkill].keywords) {
					$("#skills").append(html_sections[3].skills[eachSkill].keywords[eachsubSkill]);
				}
			}
		}
	}

	// load the about me section if there' data found
	if (html_sections[0].hasOwnProperty("HTMLsummary") > 0) {
		$("#aboutme").append(html_sections[0].HTMLsummary);
		// log the specialities if any
		if (html_sections[0].specialties.length >0 ) {
			for (var eachSpeciality in html_sections[0].specialties ) {
				$("#specialties").append(html_sections[0].specialties[eachSpeciality]);
			}
		}
	}


	// load the work section related the HTML Page
	if (html_sections[1].hasOwnProperty("work") > 0) {

		// add the accordion for each work location
		for (var eachJob in html_sections[1].work) {
			$("#work-experience").append(HTMLObject.HTMLworkStart);
			if (html_sections[1].work[eachJob].hasOwnProperty("HTMLemployer") ) {
				$(".work-entry").last().append(html_sections[1].work[eachJob].HTMLemployer);
			}
			if (html_sections[1].work[eachJob].hasOwnProperty("HTMLtitle") ) {
				$(".employer").last().append(html_sections[1].work[eachJob].HTMLtitle);
			}
			$("#work-experience").last().append(HTMLObject.HTMLworkdetails);
			if (html_sections[1].work[eachJob].hasOwnProperty("HTMLstartDate") ) {
				$(".work-details").last().append(html_sections[1].work[eachJob].HTMLstartDate);
			}

			if (html_sections[1].work[eachJob].hasOwnProperty("HTMLendDate") ) {
				$(".work-start").last().append(html_sections[1].work[eachJob].HTMLendDate);
			}

			if (html_sections[1].work[eachJob].hasOwnProperty("HTMLworksummary") ) {
				$(".work-details").last().append(html_sections[1].work[eachJob].HTMLworksummary);
			}

			if (html_sections[1].work[eachJob].highlights.length > 0){  // if user has specified any work highlights
				for (var jobHigh in html_sections[1].work[eachJob].highlights )	{
					$(".highlights").last().append(html_sections[1].work[eachJob].highlights[jobHigh]);
				}

			}
			console.log("has property " ,html_sections[1].work[eachJob].hasOwnProperty("location"), html_sections[1].work[eachJob]);
			if ( (html_sections[1].work[eachJob].hasOwnProperty("location") ) && html_sections[1].work[eachJob].location.length > 0) {
				// add the location header
				$(".work-details").last().append(HTMLObject.HTMLworklocations);
				for (var jobAddr in html_sections[1].work[eachJob].location )	{
					$(".work-addresses").last().append(HTMLObject.HTMLworkaddress.replace("%data%",  html_sections[1].work[eachJob].location[jobAddr])) ;
				}
			}
		}
	}

	 // load the education section related the HTML Page
	console.log("education section" , html_sections[2]);
	if (html_sections[2].hasOwnProperty("education") > 0) {

		// add the accordion for each work location
		for (var eachSchool in html_sections[2].education) {
			console.log("schools : " , html_sections[2].education[eachSchool]);
			$("#education-history").append(HTMLObject.HTMLschoolStart);
			if (html_sections[2].education[eachSchool].hasOwnProperty("HTMLinstitution") ) {
				$(".education-entry").last().append(html_sections[2].education[eachSchool].HTMLinstitution);
			}
			if (html_sections[2].education[eachSchool].hasOwnProperty("HTMLareaofStudy") ) {
				$(".school").last().append(html_sections[2].education[eachSchool].HTMLareaofStudy);
			}
			$("#education-history").last().append(HTMLObject.HTMLschooldetails);
			if (html_sections[2].education[eachSchool].hasOwnProperty("HTMLschoolstartDate") ) {
				$(".school-details").last().append(html_sections[2].education[eachSchool].HTMLschoolstartDate);
			}

			if (html_sections[2].education[eachSchool].hasOwnProperty("HTMLschoolendDate") ) {
				$(".school-details").last().append(html_sections[2].education[eachSchool].HTMLschoolendDate);
			}


			if (html_sections[2].education[eachSchool].hasOwnProperty("schoolSubject") ) {
				$(".school-details").last().append(HTMLObject.HTMLschoolSummary);
			}

			if (html_sections[2].education[eachSchool].schoolSubject.length > 0){  // if user has specified any School subjects
				for (var schoolSub in html_sections[2].education[eachSchool].schoolSubject )	{
					$(".edu-highlights").last().append(html_sections[2].education[eachSchool].schoolSubject[schoolSub]);
				}

			}


		}
	}

}

// build a partial list of Locations to be used by Google Maps, this cannot be no more than 10
// Take the current location and 3 work and 1 education location

function map_locations(){

	this.locations = [];
	this.location_type = [];
	this.location_description = [];
	// check if an about me location exists
	if (bio_data.about.hasOwnProperty("location")) { // assuming that at least some properties are populated
		this.locations.push(location_string(bio_data.about.location[0]));
		this.location_type.push("live");
		this.location_description.push(bio_data.about.location[0].content); // assuming this is always populated if location is defined
	}
	// check if any work locations exists and record only max of 3
	var i = 0;
	for (var workObj in bio_data.work) {
		if (i <= 2) {
			if (bio_data.work[workObj].hasOwnProperty("location")) { // assuming that at least some properties are populated
				this.locations.push(location_string(bio_data.work[workObj].location[0]));
				this.location_type.push("work");
				this.location_description.push(bio_data.work[workObj].location[0].content); // assuming this is always populated if location is defined
				i = i+ 1; // increase the number of recorded locations
			}
		}
	}
	// check if any educations locations exists and record only max of 1
	var i = 0; // we can use the same loop variable
	for (var eduObj in bio_data.education) {
		if (i < 1) {  // only for one object
			if (bio_data.education[eduObj].hasOwnProperty("schoollocation")) { // assuming that at least some properties are populated
				this.locations.push(location_string(bio_data.education[eduObj].schoollocation[0]));
				this.location_type.push("school");
				this.location_description.push(bio_data.education[eduObj].schoollocation[0].content);
				i = i+ 1; // increase the number of recorded locations
			}
		}
	}
}

function location_string(objLocation){
	// check if each area of the location is given or not
	var locationString = null;
	if (objLocation.hasOwnProperty("address_1")) {
		locationString  = objLocation.address_1 + ",  ";
	}

	if (objLocation.hasOwnProperty("address_2")) {
		locationString  += objLocation.address_2 + ",  ";
	}

	if (objLocation.hasOwnProperty("city")) {
		locationString  += objLocation.city + ",  ";
	}

	if (objLocation.hasOwnProperty("postalCode")) {
		locationString  += objLocation.postalCode + ",  ";
	}
	// country must always be given otherwise google maps may fail
	if (objLocation.hasOwnProperty("country")) {
		locationString  += objLocation.country ;
	}
	return locationString;
}

// The Function/Object defined to create the HTML Tags required to be built out by the analyser

function HTML_Helpers(){
	this.HTMLheaderName = "<h2 id='title'>%data%</h2>";
	this.HTMLheaderRole = "<small> -%data%</small>";
	this.HTMLcurrentAddress= "<address>%address_1% %address_2%<strong>%city%%postalCode%</strong><br>%country%</address>";
	this.HTMLsummary = "<p>%data%</p><ul id='specialties'></ul>";
	this.HTMLspecialties = "<li><p>%data%</p></li>";

	this.HTMLcontactGeneric = "<li class='flex-item'><span class='orange-text'>%contact%</span><span class='white-text'>%data%</span></li>";
	this.HTMLmobile = "<li class='flex-item'><span class='orange-text'>mobile</span><span class='white-text'>%data%</span></li>";
	this.HTMLemail = "<a id='email' href='mailto:%data%'><i class='fa fa-pencil'>email</i> </a>";
	this.HTMLtwitter = "<a id='twitter' href=%data%><i class='fa fa-twitter'> twitter</i> </a>";
	this.HTMLlinkedin = "<a id='linkedin' href=%data%><i class='fa fa-linkedin'> linkedin</i></a>";
	this.HTMLgithub = "<a id='github' href=%data%><i class='fa fa-github-alt'> git</i> </a>";
	this.HTMLblog = "<li class='flex-item'><span class='orange-text'>blog</span><span class='white-text'>%data%</span></li>";
	this.HTMLlocation = "<address>%address_1%<br>%address_2%<strong><br>%city%<br>%postalCode%</strong><br>%country%</address>";

	this.HTMLbioPic = "<img src='%data%' class='img-responsive img-self' alt='Associated Resume Image'>";
	this.HTMLWelcomeMsg = "<span class='wlcome-message'>%data%</span>";

	this.HTMLskillsStart = "<h3 id='skillsH3'>Skills at a Glance:</h3><ul id='skills'></ul><hr>";
	this.HTMLskills_spin = "<li class='flex-item'><span class='white-text'><i class='fa fa-futbol-o fa-spin'> <strong>%data%</strong></i>/span></li>";
	this.HTMLskill = "<li class='flex-item'><span class='white-text'><i class='fa fa-futbol-o main-skill'><strong> %data%</strong></i> </span></li>";
	this.HTMLkeywords = "<li class='flex-item'><span class='white-text'><i class='fa fa-info-circle skill-detail'><small> %data%</small></i> </span></li>";

	this.HTMLworkStart = "<dt class='col-md-10 col-xs-12 work-entry'></dt>";
	this.HTMLemployer = "<a class='employer' href='#'>%data%</a>";
	this.HTMLtitle = "<small> - %data%</small>";
	this.HTMLworkdetails = "<dd class='work-details'></dd>";
	this.HTMLstartDate = "<span class='date-text work-start'>%data% to </span>";
	this.HTMLendDate = "<span>%data%</span>"
	this.HTMLworksummary = "<div class='row detail-description'><p><br>%data%</p></div><ul class='row highlights'></ul>";
	this.HTMLhighlights = "<li><p>%data%</p></li>";
	this.HTMLworklocations ="<div class='row work-addresses'></div>";
	this.HTMLworkaddress =  "<div class='col-md-4'>%data%</div>"

	this.HTMLprojectStart = "<div class='project-entry'></div>";
	this.HTMLprojectTitle = "<a href='#'>%data%</a>";
	this.HTMLprojectDates = "<div class='date-text'>%data%</div>";
	this.HTMLprojectDescription = "<p><br>%data%</p>";
	this.HTMLprojectImage = "<img src='%data%'>";

	this.HTMLschoolStart = "<dt class='col-md-10 col-xs-12 education-entry'></dt>";
	this.HTMLinstitution = "<a class='school' href='#'>%data%</a>";
	this.HTMLareaofStudy = " -- %data% ";
	this.HTMLstudyType = " -- %data%</a>";
	this.HTMLschooldetails = "<dd class='school-details'></dd>";
	this.HTMLschoolstartDate = "<div class='date-text school-dates'><span>From : %data% </span></div>";
	this.HTMLschoolendDate = "<div class='date-text school-dates'>To : %data%</div>";
	this.HTMLschoolSummary = "<div class='row school-description'></div><ul class='row edu-highlights'></ul>";
	this.HTMLschoollocation = "<address>%address_1%<br>%address_2%<strong><br>%city%<br>%postalCode%</strong><br>%country%</address>";
	this.HTMLschoolSubject = "<li> %data% </li>"

	this.HTMLonlineClasses = "<h3>Online Classes</h3>";
	this.HTMLonlineTitle = "<a href='#'>%data%";
	this.HTMLonlineSchool = " - %data%</a>";
	this.HTMLonlineDates = "<div class='date-text'>%data%</div>";
	this.HTMLonlineURL = "<br><a href='#'>%data%</a>";

	this.internationalizeButton = "<button>Internationalize</button>";
	this.googleMap = "<div id='map'></div>";
}


//This is the primary function that builds each HTML section
function section_builder (sectionKey, sectionObj){

	     this.newHTMLTag = new Object(); // use "this" to avoid other conflicts
	     var firstJob = true;
	 	 var firstSchool = true;
	     var firstSkill = true;
		// var HTML_Section = "HTML" + sectionKey;
		// Locate the appropriate HTML tag to insert the CV data to

		for (var nextVar in sectionObj) {
			// if the HTML is tag is found as a var add to this var directly
			var tagName  = "HTML" + nextVar;
			if (HTMLObject.hasOwnProperty(tagName) && typeof sectionObj[nextVar] !== "object" ) { // do this for items that would have a value.
				 // create additional properties for the new html object created above
				 // treat location as a special object
					newHTMLTag[tagName] = HTMLObject[tagName].replace("%data%", sectionObj[nextVar]);
			}
			else {  //analyse and build the strings where there are objects in concern.. first the location information
				switch (true) {
					case (typeof sectionObj[nextVar] === "object" && nextVar === "location" && HTMLObject.hasOwnProperty(tagName) ) :
						var locationTag = build_objArray_string(sectionObj[nextVar], tagName );
						this.newHTMLTag["locations"] = new Array();
						for (var locProp in locationTag ){
							this.newHTMLTag["locations"].push(locationTag[locProp]);
						};
						break;
					case (typeof sectionObj[nextVar] === "object" && sectionKey === "work" ) :
						// pass this to the location builder function
						if (firstJob) {
							this.newHTMLTag["work"] = new Array();
							firstJob = false;
						}
						this.newHTMLTag["work"].push(partial_section_builder (nextVar, sectionObj[nextVar]));
						break;
					case (typeof sectionObj[nextVar] === "object" && sectionKey === "skills" ) :
						// pass this to the location builder function
						if (firstSkill) {
							this.newHTMLTag["skills"] = new Array();
							firstSkill = false;
						}
						this.newHTMLTag["skills"].push(partial_section_builder (nextVar, sectionObj[nextVar]));
						break;
					case (typeof sectionObj[nextVar] === "object" && sectionKey === "education" ) :
						// pass this to the location builder function
						if (firstSchool) {
							this.newHTMLTag["education"] = new Array();
							firstSchool = false;
						}
						this.newHTMLTag["education"].push(partial_section_builder (nextVar, sectionObj[nextVar]));
						break;
					case (typeof sectionObj[nextVar] === "object" && nextVar === "specialties" && HTMLObject.hasOwnProperty(tagName) ) :
						var spcTag = build_objArray_string(sectionObj[nextVar], tagName );
						this.newHTMLTag["specialties"] = new Array();
						for (var spcProp in spcTag ){
							this.newHTMLTag["specialties"].push(spcTag[spcProp]);
						}
						break;
					default :
						break;
				}
			}
		}
	   return this.newHTMLTag;
}

// build the partial section of the HTML tags, this is because some sections contain certain extra elements which are
// required for subsections. i.e. Location, skills..etc... each one has a unique property to be built out
function partial_section_builder (sectionKey, sectionObj){

	this.sectionHTMLTag = new Object(); // use this to avoid other conflicts
	// var HTML_Section = "HTML" + sectionKey;
	// Locate the appropriate HTML tag to insert the CV data to
	for (var nextVar in sectionObj) {
		// console.log(sectionKey, nextVar, sectionObj[nextVar]);
		// if the HTML is tag is found as a var add to this var directly
		var tagName  = "HTML" + nextVar;
		if (HTMLObject.hasOwnProperty(tagName) && typeof sectionObj[nextVar] !== "object" ) { // do this for items that would have a value.
			// create additional properties for the new html object created above
			// treat location as a special object
			sectionHTMLTag[tagName] = HTMLObject[tagName].replace("%data%", sectionObj[nextVar]);
		}
		else {  //analyse and build the strings where there are objects in concern.. first the location information
			// console.log(typeof sectionObj[nextVar] === "object"); console.log(nextVar === "location" ); console.log(HTMLObject.hasOwnProperty(tagName) );
			if  (typeof sectionObj[nextVar] === "object"  && HTMLObject.hasOwnProperty(tagName) ) { // this is an object see if you can find a htmlTag for it. then build it
				// pass this to the object array builder function and create a new array element on the section tag to add this.
				var objTag = build_objArray_string(sectionObj[nextVar], tagName);
				this.sectionHTMLTag[nextVar] = new Array();
				for (var objProp in objTag) {
					this.sectionHTMLTag[nextVar].push(objTag[objProp]);
				}
			}
		}
	}
	return this.sectionHTMLTag;
}

// Build the output HTML tag related to the object array. .

function build_objArray_string(arryObject, tag){
	// location object is an array, treat is as such ;
	var singleHTML = new Object();
	var HTMLarrary = new Array();
	for (var i =0 ; i < arryObject.length ; i++) {
		singleHTML[tag] = HTMLObject[tag];
		for (var arrayProperty in arryObject[i]) {
			// console.log("array property type", arrayProperty, typeof  arrayProperty);
			if (!isNaN(arrayProperty)) {
				// this is numeric object hence find the %data% and replace with the original array value.
				singleHTML[tag] = singleHTML[tag].replace("%data%", arryObject[i]);
				break; // break out of inner loop
			}
			else
				singleHTML[tag] = singleHTML[tag].replace("%" + arrayProperty + "%", arryObject[i][arrayProperty]);
		}
		HTMLarrary.push(singleHTML[tag]);
	}
	return HTMLarrary;

}


// The primary Function that takes each JSON Object's each node 'name' its value and build each section at at time.

function analyse_bio_and_build_html(objKey, bioObj){

	 var built_html = null;
	 // the node type must be an object to be analysed and not a simple a property. The pre-defined object keys are
	 // listed below.
	 if (typeof bioObj == "object") {  // do this only for objects otherwise its a the last element 
	 	switch (true) {
	 		case ( 	(objKey == "about")    ||
	 				(objKey == "work") 		||
	 				(objKey == "volunteer") ||
	 				(objKey == "education")	||
	 				(objKey == "awards") 	||
	 				(objKey == "publications")	||
	 				(objKey == "languages") 	||
	 				(objKey == "references")	||
	 				(objKey == "skills")	||
	 				(objKey == "interests") ) :
				// build each section out using the section analyser
				built_html = section_builder(objKey, bioObj);
	 			break;
	 		
	 		default : 
	 			break;
	 	}
		// Validate if anything was actually built.
	 	if (built_html !== null ) {
			html_sections.push(built_html);
	 	}
	 }
}



