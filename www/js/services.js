angular.module('starter.services', [])

.factory('ListService', function($rootScope, $q, $cacheFactory) {
	var cache = $cacheFactory('');
    var options = {
        handleAs: 'JSON'
    };

    return {
		allCloud: function() {
            // get the Data Service
            var data = IBMData.getService();

            // Create a Defer as this is an async operation
            defer = $q.defer();

            // Clear the Cache with a new set
            cache.remove('locations');

            // Retreive a Query instance of type "Item" and issue a find() action on it
            // to retreive all the items (NO PAGING)
            var query = data.Query.ofType("Location");
            query.find().done(function(list) {

                // Place the Items in the Cache
                cache.put('locations', list);

                // return the Cache
                defer.resolve(cache.get('locations'));

            },function(err){
                console.log(err);
                defer.reject(err);
            });

            // Get the Objects for a particular Type
            return defer.promise;

        }
    };
})


.factory('InitBluemix', function($rootScope, $http, $q) {
	        function init() {

            // Create a defer
            var defer = $q.defer();

            // Lets load the Configuration from the bluelist.json file
            $http.get("./bluelist.json").success(function(config) {

                // Initialise the SDK
                IBMBluemix.initialize(config).done(function() {

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

                    // Initialize the Service
                    var data = IBMData.initializeService();

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation Data Services " );

                    // Return the Data
                    defer.resolve();

                }, function(response) {
                    // Error
                    console.log("Error:", response);
                    defer.reject(response);
                });

                $rootScope.config = config;;
            });

            return defer.promise;

        };

        return {
            init: function() {
                return init();
            }
        }
});