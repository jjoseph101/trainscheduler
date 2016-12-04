$(document).ready(function(){

	// function to show current time
	function clocker () {
		var currentTime1 = moment ();
		var currentTimeHuman1 = moment(currentTime1).format("HH:mm:ss")
		$("#realTime").html("Current Time: " + currentTimeHuman1)
	};

	// set interval to run current time function every second
	setInterval(clocker, 1000);

	// initialize firebase
	var config = {
		apiKey: "AIzaSyB_UPDleW07qIv4PdOlrnSuBu9N3wsPPrU",
		authDomain: "bootcampers-ea686.firebaseapp.com",
		databaseURL: "https://bootcampers-ea686.firebaseio.com",
		storageBucket: "bootcampers-ea686.appspot.com",
		messagingSenderId: "200023959021"
	};

	firebase.initializeApp(config);

	// set global variables
	var database = firebase.database(); 
	var trainName = "";
	var destination = "";
	var trainTime = "";
	var frequency = 0;
	var minutesAway = 0;

	// submit button event listener
	$("#submit").on("click", function(){

		// grab data
		trainName = $("#tName").val().trim();
		destination = $("#destin").val().trim();
		trainTime = $("#trainTime").val().trim();
		frequency = parseInt($("#freq").val().trim());

		// test data grab
		console.log("trainName: " + trainName);
		console.log("destination: " + destination);
		console.log("trainTime: " + trainTime);
		console.log("frequency: " + frequency);
		
		// add entry to firebase DB
		database.ref().push({
			name: trainName,
			destin: destination,
			start: trainTime,
			rate: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
		
		// clear form
		$("#tName")[0].reset ();		

		// no next page
		return false;
	});

	// event listener for when entry added to firebase DB to populate schedule page
	database.ref().on("child_added", function(snapshot){		

		// confirmations
		console.log("SNAPSHOT.VAL RETURNS");
		console.log("--------------------");
		console.log(snapshot.val());
		console.log(snapshot.val().name);
		console.log(snapshot.val().destin);
		console.log(snapshot.val().start);
		console.log(snapshot.val().rate);
		console.log("-------------------");

		// calculate time telling
			// set up initial variables
			freqCalc = snapshot.val().rate;
			timeStartCalc = snapshot.val().start;
			console.log(freqCalc);
			console.log("timeStartCalc: " + timeStartCalc);
			
			// push back to put before current time
			timeStartCalcConverted = moment(timeStartCalc, "HH:mm").subtract(1,"years");
			console.log ("timeStartCalcConverted: " + timeStartCalcConverted);
			
			// compute and display current time
			var currentTime = moment ();
			var currentTimeHuman = moment(currentTime).format("HH:mm:ss")
			console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm:ss"));
			$("#realTime").html("Current Time: " + currentTimeHuman)

			// computer difference between times
			var diffTime = moment().diff(moment(timeStartCalcConverted), "minutes");
			console.log("DIFFERENCE IN TIME: " + diffTime);

			// figure out time remainder
			var tRemainder = diffTime %  freqCalc;
			console.log("tRemainder: " + tRemainder);

			// compute minutes before train
			var tMinutesTillTrain = freqCalc - tRemainder;
			console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

			// compute next train
			var nextTrain = moment().add(tMinutesTillTrain, "minutes");
			var nextTrainHuman = moment(nextTrain).format("HH:mm");
			console.log("ARRIVAL TIME: " + nextTrainHuman);

		// change HTML
		$("#display").append("<tr class = 'trainDisplay'>"+
			"<td id='displayName' class='unboldy'>"+ snapshot.val().name + 
			"</td><td id='displayDestination' class='unboldy'>" + snapshot.val().destin +
			"</td><td id='displayFrequency' class='unboldy'>" + snapshot.val().rate + 
			"</td><td id='displayNextTrain' class='unboldy'>" + nextTrainHuman + 
			"</td><td id='displayMinutesAway' class='unboldy'>" + tMinutesTillTrain + "</td></tr>");

		// error handling
		}, function(errorObject) {
		      console.log("Errors handled: " + errorObject.code)});
});