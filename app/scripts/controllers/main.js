'use strict';

angular.module('b4cmApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, $timeout, $modal) {

    $scope.addWatch = function() {
      $location.path("/addWatch");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.open();

  // try to make sure addthis is showing
  $timeout(function() {addthis.toolbox()}, 1000);

  });

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

