var logEnabled = true;

var fcChartsApp = angular.module("fc-charts",[]);



function fcLog(message) {
	if(logEnabled) {
		console.log(message);
	}
}

//Directive for FC Chart Container

fcChartsApp.directive('fcChartContainer',function() {
	return {
		scope : true,
		restrict : 'E',
		replace:true,
		transclude:true,
		template : '<svg id="_g_fcPieChart_temp_id" style="width:400px;height:400px;" ng-transclude></svg>',
		link: function(scope, elem, attrs) {
			  fcLog(attrs.chartid);
			  scope.chartid = attrs.chartid;
		}, 
		controller : function($scope) {
			fcLog('CONTROLELR ' + $scope.chartid);
		}
	};
});
