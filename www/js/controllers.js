angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LocationsCtrl', function($scope) {
  $scope.locations = [
    { title: '22550', id: 1 },
    { title: '75010', id: 2 },
    { title: '81400', id: 3 },
    { title: '77570', id: 4 }
  ];
})

.controller('LocationCtrl', function($scope, $stateParams) {
})

.controller('BrowseCtrl', function($rootScope, $scope, $stateParams, $ionicLoading, InitBluemix, ListService) {

  $scope.loadItems = function() {
    $scope.list = [];

    if (!$scope.$$phase) {
      $scope.$apply();
    }

    $ionicLoading.show({
            template: 'Loading...'
        });

    ListService.allCloud().then(function(list) {
      console.log('loadItems function');

      $scope.list = list;
      $scope.locations = list;

      if (!$scope.$$phase) {
        $scope.$apply();
      }

      $ionicLoading.hide();
       
      $scope.$broadcast('scroll.refreshComplete');

    }, function(err) {
      console.log(err);

      $scope.list = null;
      $ionicLoading.hide();
    });
  }

  $scope.onRefresh = function() {
        $scope.loadItems();
    }

  // Init Mobile Cloud SDK and wait for it to configure itself
  // Once complete keep a reference to it so we can talk to it later
  if (!$rootScope.IBMBluemix) {
      InitBluemix.init().then(function() {
          $rootScope.IBMBluemix = IBMBluemix;
          $scope.loadItems();
      });
  }

});
