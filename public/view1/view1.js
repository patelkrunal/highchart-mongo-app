'use strict';

angular.module('myApp.graphView', ['ngRoute','highcharts-ng'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graphView/:graph_id', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope,$http,$routeParams) {
    $scope.empty_graph=false;
    var graph_id = $routeParams.graph_id;
    if(graph_id!=null){
        $http.get("api/graph/"+graph_id)
          .then(function(response){
              if(response.status == 200)
                $scope.chartConfig = response.data.data;

          },
          function(response){
          //Error handling
            if(response.status == 404)
                $scope.empty_graph=true;
          });
    }


});