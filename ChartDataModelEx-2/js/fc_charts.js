
var dataChanged = false;


fcChartsApp.controller('fcChartDemoController', ['$scope', function($scope) {
  $scope.greeting = 'Hola!';
  $scope.renderIt = function() {
	  fcLog('Render it called');
	  this.$digest();
  };
}]);

//FC Bar chart implementation.
fcChartsApp.directive('fcBarChart',function() {
	
	//============== DEFAULT OPTIONS FOR BAR CHARTS ==========
	var barWidth
	//=============== END OF DEFAULT OPTIONS =================

    return {
		scope : true,
        restrict : 'E',
        replace:true,
	    template : '<div style="width:600px;height:600px;"></div>',
	    
	    
	    link: function(scope, elem, attrs) {
			
			
			fcLog("Provider Name for Chart "+attrs.fcDataProvider);
			

			var cols = '{"cols":'+attrs.chartColors+'}';
		
			scope.chart_colors = JSON.parse(cols).cols;
			scope.$watch(function() {
				fcLog('Watch called');
				return dataChanged ;
			},function(old, nn) {
				fcLog('Value Changed '+old+' vs '+nn);
			});
		
			var divNode = d3.select(elem[0]);
			var svg = divNode.append('svg');
			svg.attr('style','width:100%;height:100%;');
			console.log(attrs.id);
			
      			var providerName = attrs.fcDataProvider;
			fcLog("Provider Name for Chart "+attrs.fcDataProvider);
			
			//DO we need initial data.
			
			var initiaDataCallbackBarChart = function(data) {
				//fcLog('Read data from source '+JSON.stringify(data[0][':reply/clen']));
				renderBarChart(svg, attrs.chartYAttr, scope.chart_colors, data);
			};
			
			var dataSetChangedCalback = function(data) {
				fcLog('Bar chart data set change '+svg+" "+svg.firstChild);
				var pNode = svg.node();
				while (pNode.firstChild) {
					pNode.removeChild(pNode.firstChild);
				}
				
				renderBarChart(svg,attrs.chartYAttr, scope.chart_colors, data);
			};
			
			//Subscribe for data
			//var consumer = {initialDataCallback : initiaDataCallbackBarChart, datasetChangeCallback : dataSetChangedCalback};
			var consumer = {consumerId : attrs.id,
				dataChangeCallback : dataSetChangedCalback};
			fcDataProviderFactory.registerConsumer(providerName, consumer);
		}
		
		
	};
	   
});

//=============== BAR CHART PRIVATE FUNCTIONS ===================
function renderBarChart(svg, chartYAttr, chartColors, data, chartParams) {
	// TODO: Render the bar chart. Move it outside, to make this code look clean
	
	var xRange = 400;
	var yRange = 180;
	var strokeWidth = 2;
	var strokeColor = "rgb(255,255,255)";
	var barWidth = 40;
	var barGap = 30;
	
	var len = data.length;
	fcLog(len);
	fcLog(data);
	var maxYAttr = d3.max(data, function(d) { 
		return d[chartYAttr];
	});
	
	//Draw chart axis
	var xAxis = svg.append("line").attr("x1",0).attr("y1",yRange).attr("x2",xRange).attr("y2",yRange);
	xAxis.style("stroke", strokeColor);
	xAxis.style("stroke-width","2");
	
	
	var yAxis = svg.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",yRange);
	yAxis.style("stroke", strokeColor);
	yAxis.style("stroke-width","2");
	
	
	yScale = d3.scale.linear()
                   .domain([0,1])
                   .range([0,10]);
		   
	yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("bottom");
	
	
	var yAttrScale = d3.scale.linear().domain([0,maxYAttr]).range([0,yRange]);

	x  = 20;
	x1=barWidth/2;
	y1=150
	for(var i=0;i<len;i++) {
	  console.log(data[i])
		var yVal = yAttrScale(data[i][chartYAttr]);
		
		var rect = svg.append('rect').attr('x',x).attr('y',yRange-yVal).attr('width',barWidth).attr('height',yVal);
		rect.attr('class','fc_chart_bar');
		rect.attr('fc_chart_bar_name', data[i][chartYAttr]);
		rect.style('fill',chartColors[i% chartColors.length]);
		rect.style("stroke-width",strokeWidth);
		rect.style("stroke",strokeColor)
		//rect.selectAll("rect")
		
		var text=svg.append("text")
                    .text(data[i][chartYAttr])
		.attr('x', x+10)
                .attr('y', yRange-yVal+20)
                .attr('fill', 'white');
		x+=(barWidth + barGap);
	    }
	
	
	
			
}
//=============== END BAR CHART PRIVATE FUNCTIONS ===============

