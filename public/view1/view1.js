'use strict';

angular.module('myApp.graphView', ['ngRoute','highcharts-ng'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graphView/:graph_id', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope,$http,$routeParams) {
    var graph_id = $routeParams.graph_id;
    if(graph_id!=null){
        $http.get("api/graph/"+graph_id)
          .then(function(response){
              $scope.chartConfig = response.data.data;
          });
    }else{
        //appropriate response when no graph id.
        alert("no graph id");
    }


});