/**
 * Data provider restrictions. 
 * 1. There should be an actual variable available with the name which should be specified
 *     as value for 'prover-name' attribute
 * 
 * 2. Every data provider must implement the following mandatory methods
 *   a. initialize : function(). This function will be called only once.
 *                   This function can make itself ready with initial data
 * 
 *   b. requestInitialData : function(callback : function(data)). This will be called
 *                   when the consumers need initial data for initial rendering. Provider
 *                   can respond asynchronize, by calling callback method.
 * 
 * 3. It is responsible of data provider to retrieve data for static, dynamic and streaming
 *    content. When the data is available, it can request fcDataProviderFactory to
 *    send the data to respective consumers.
 */

fcChartsApp.directive('fcDataProvider',function() {
	return {
		scope : true,
		restrict : 'E',
		replace:true,
		template : '',
		link: function(scope, elem, attrs) {
			fcLog('Adding Data provider '+attrs.providerName);
			//Add the provider with the given name.
			fcDataProviderFactory.addDataProvider(attrs.providerName,
				{providerImpl : attrs.implementation});
		}
	};
});


var fcDataProviderFactory = {

	providers	:[],
	consumers : [],

	/** Register a data provider in the factory, provide a name
	 * and implementation object. The object should handle all the required
	 * server communication. Once the provider is added, it will get a factory
	 * instance, which can be used to dispatch data change events to the
	 * consumers.
	 */
	addDataProvider :function(providerName, p_provider) {
		this.providers[this.providers.length] = {name:providerName,provider:p_provider};
		p_provider.factory = this;
		this.consumers[providerName] = [];
		fcLog('[addDataProvider] Adding provider '+providerName+' Implementation '+p_provider.providerImpl);
		window[p_provider.providerImpl].initialize(providerName);
		fcLog('Initialize Done');
	},

	/**
	 * Consumer can register for one data provider using this API.
	 * name of the provider should be passed along with list an object
	 * details of callback and the kind of data interested
	 * Here is the expected JSON structure.
	 * {
	 *   consumerId : CosumerId :- Required to unregister the consumer or add any additioal callback later.
	 *	 initialDataCallback : function(data) :- Only initial data
	 *	 dataChangeCallback : function(data) :- Data values change notification
	 *	 datasetChangeCallback : function(data) :- Dataset change notification
	 *	 incrementDataCallback : function(Data) :- Only for incremental data
	 * }
	 * 
	 */
	registerConsumer : function(providerName, callbacks) {
		
		var curList = this.consumers[providerName];
		curList[curList.length] = callbacks;
		
		//Find the provider with given name
		var len = this.providers.length;
		var myProvider = null;
		for(var i=0;i<len;i++) {
			if(this.providers[i].name == providerName) {
				myProvider = this.providers[i].provider;
				break;
			}
		}
		//Request for initial data. This can be an asynchronouse response.
		
		window[myProvider.providerImpl].requestInitialData(callbacks.initialDataCallback);
	},

	/**
	 * Runs stream data calback on the consumers
	 */
	dispatchIncrementDataEvent :	function(providerName, data) {
		var registeredConsumers = this.consumers[providerName];
		var len = registeredConsumers.length;
		
		//Run the callback only for the consumers who registered for streaming data.
		for(var i=0;i<len;i++) {
			if((typeof registeredConsumers[i].incrementDataCallback === "undefined") ||
				(registeredConsumers[i].incrementDataCallback == null)) {
					continue;
			}
			
			//TODO: Do we need to call this in a thread/timer ?
			registeredConsumers[i].incrementDataCallback(data);
		}

	},

	/**
	 * Runs the callback of registered consumers when the data set changes
	 */
	dispatchDatasetChangeEvent :	function(providerName, data) {
		var registeredConsumers = this.consumers[providerName];
		var len = registeredConsumers.length;
		
		//Run the callback only for the consumers who registered for datasetChangeCallback.
		for(var i=0;i<len;i++) {
			if((typeof registeredConsumers[i].datasetChangeCallback === "undefined") ||
				(registeredConsumers[i].datasetChangeCallback == null)) {
					continue;
			}
			
			//TODO: Do we need to call this in a thread/timer ?
			registeredConsumers[i].datasetChangeCallback(data);
		}

	},
	
	/**
	 * Runs the callback of registered consumers when the data value changes
	 */
	dispatchDataChangeEvent :	function(providerName, data) {
		var registeredConsumers = this.consumers[providerName];
		var len = registeredConsumers.length;
		
		//Run the callback only for the consumers who registered for datasetChangeCallback.
		for(var i=0;i<len;i++) {
			if((typeof registeredConsumers[i].dataChangeCallback === "undefined") ||
				(registeredConsumers[i].dataChangeCallback == null)) {
					continue;
			}
			
			//TODO: Do we need to call this in a thread/timer ?
			registeredConsumers[i].dataChangeCallback(data);
		}

	},
	
	/**
	 * Remove the consumer. This method should be calle from javascript only
	 */
	removeConsumer : function(consumerId) {
		var len = fcDataProviderFactory.consumers.length;
		var indexToRemove = -1;
		for(var i=0;i<len;i++) {
			if(fcDataProviderFactory.consumers[i].consumerId == consumerId) {
				indexToRemove = i;
			}
		}
		
		if(indexToRemove != -1) {
			fcDataProviderFactory.consumers.splice(indexToRemove,1);
		}
	},

	//============== ALL DEBUGGING AND TEST METHODS==========
	logAllProviders : function() {
		fcLog('------------ REGISTERED DATA PROVIDERS -------------');
		var len = this.providers.length;
		for(var i=0;i<len;i++) {
			fcLog(this.providers[i].name);
		}
		fcLog('------------ END REGISTERED DATA PROVIDERS -------------');
	},
	//============== END ALL DEBUGGING AND TEST METHODS======
};


