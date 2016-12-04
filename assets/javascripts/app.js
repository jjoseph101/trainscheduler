$(document).ready(function(){

	// Initialize Firebase
	var config = {
	apiKey: "AIzaSyB_UPDleW07qIv4PdOlrnSuBu9N3wsPPrU",
	authDomain: "bootcampers-ea686.firebaseapp.com",
	databaseURL: "https://bootcampers-ea686.firebaseio.com",
	storageBucket: "bootcampers-ea686.appspot.com",
	messagingSenderId: "200023959021"
	};
	firebase.initializeApp(config);

	// Set global variables
	var database = firebase.database(); 
	var trainName = "";
	var destination = "";
	var trainTime = "";
	var frequency = 0;
	var minutesAway = 0;
	//var convertedDate = moment(new Date(trainTime));

	$("#submit").on("click", function(){

		trainName = $("#tName").val().trim();
		destination = $("#destin").val().trim();
		trainTime = $("#trainTime").val().trim();
		console.log("trainName :" + trainName);
		console.log("destination :" + destination);
		console.log("trainTime :" + trainTime);
		frequency = parseInt($("#freq").val().trim());
		
		database.ref().push({
			name: trainName,
			destin: destination,
			start: trainTime,
			rate: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});

		return false;
	});

	database.ref().on("child_added", function(snapshot){

		//var convertedDate = moment(new Date(snapshot.val().start));
		//monthsWorked = moment().diff(moment(convertedDate), "months");
		//minutesAway = monthsWorked * snapshot.val().rate;
		
		console.log(snapshot.val());
		console.log(snapshot.val().name);
		console.log(snapshot.val().destin);
		console.log(snapshot.val().start);
		console.log(snapshot.val().rate);
		console.log(trainName);
		console.log(destination);
		console.log(trainTime);
		//console.log("converted "+convertedDate);
		//console.log("months "+monthsWorked);
		console.log(frequency);
		console.log(minutesAway);

		//change HTML
		$("#display").append("<tr class = 'trainDisplay'>"+
			"<td id='displayName' class='unboldy'>"+ snapshot.val().name + 
			"</td><td id='displayDestination' class='unboldy'>" + snapshot.val().destin +
			"</td><td id='displayFrequency' class='unboldy'>" + snapshot.val().rate + 
			"</td><td id='displayMonths' class='unboldy'>" + "next arrival" + 
			"</td><td id='displayFrequency' class='unboldy'>" + "minutes away" + "</td></tr>");

		}, function(errorObject) {
		      console.log("Errors handled: " + errorObject.code);	    
   });
})