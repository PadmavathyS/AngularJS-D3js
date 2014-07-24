/*
 * A sample provider that supports, static data, data set change , data change and streaming events.
 * It provides average number of people not following traffic rules. Not really... Its random data.
 * 
 * It is very unlikey that a provider will have both streaming and data/dataset change triggers. But for
 * this dummy data provider, we are simulating dataset change. We initially generate a random number, then
 * we retrive that many records and send the dataset change event. This will be triggered every 5 seconds.
 */


dummyDataProvider = {
	
	providerName : "DummyDataProvider",
	initialDataAvailable : false,
	initialData : [],
	initialDataConsumers : [],
	streamStartYear : 1905,
	
	initialize : function(p_provider) {
		
		dummyDataProvider.providerName = p_provider;
		
		//Populate the initial data with random values.
		//Year starting from 1900
		for(var i=0;i<5;i++) {
			var val1 = Math.floor((Math.random() * 100) + 1);
			var val2 = Math.floor((Math.random() * 100) + 1);
			var val3 = Math.floor((Math.random() * 100) + 1);
			dummyDataProvider.initialData[i] = {year: 1900+i,val1:val1, val2:val2,val3:val3};
		}
		
		dummyDataProvider.initialDataAvailable = true;
		var len = dummyDataProvider.initialDataConsumers.length;
		for(var i=0;i<len;i++) {
			//Update initial data consumers.
			dummyDataProvider.initialDataConsumers[i](dummyDataProvider.initialData);
		}
		
		//Start timer for streaming data.
		window.setInterval(function() {
			var streamData = [];
			for(var i=0;i<1;i++) {
				var val1 = Math.floor((Math.random() * 100) + 1);
				var val2 = Math.floor((Math.random() * 100) + 1);
				var val3 = Math.floor((Math.random() * 100) + 1);
				streamData[streamData.length] = {year: dummyDataProvider.streamStartYear,val1:val1, val2:val2,val3:val3};
				dummyDataProvider.streamStartYear++;
			}
			
			//Invoke stream data callbacks.
			fcDataProviderFactory.dispatchIncrementDataEvent(dummyDataProvider.providerName,streamData);
		},1000);
		
		//Start timer for data value change
		window.setInterval(function() {
			var streamData = [];
			for(var i=0;i<5;i++) {
				var val1 = Math.floor((Math.random() * 100) + 1);
				var val2 = Math.floor((Math.random() * 100) + 1);
				var val3 = Math.floor((Math.random() * 100) + 1);
				streamData[streamData.length] = {year: 1900+i,val1:val1, val2:val2,val3:val3};
				dummyDataProvider.streamStartYear++;
			}
			//Invoke data change callbacks
			fcDataProviderFactory.dispatchDataChangeEvent(dummyDataProvider.providerName,streamData);
		},2000);
		
		//Start timer for data used for dataset change event.
		window.setInterval(function() {
			var data = [];
			var recordCount  = Math.floor((Math.random() * 10) +1);
			for(var i=0;i<recordCount;i++) {
				var val1 = Math.floor((Math.random() * 100) + 1);
				var val2 = Math.floor((Math.random() * 100) + 1);
				var val3 = Math.floor((Math.random() * 100) + 1);
				data[data.length] = {year: 1900+i,val1:val1, val2:val2,val3:val3};
			}
			//Invoke dataset change callback.
			fcDataProviderFactory.dispatchDatasetChangeEvent(dummyDataProvider.providerName,data);
		},5000);
		 
	},
	
	requestInitialData : function(callback) {
		//If initial data is available, process immediatly. Otherwise add
		//the callback to queue and process it when initial data is available
		if(this.initialDataAvailable) {
			
			callback(this.initialData);
		}
		else {
			dummyDataProvider.initialDataConsumers[dummyDataProvider.initialDataConsumers.length] = callback;
		}
	}
}

