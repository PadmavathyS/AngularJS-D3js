
angular.module('d3AngularApp', ['d3'])
.directive('fcBars', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        label: '@',
    
      },
     replace:true,
     template: '<div>{{label}}</div>',
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
                
          var renderTimeout;
         var margin = 10;
             

          var svg = d3.select(ele[0])
                        .append("svg")
                        .attr("width", "100%"),
                        color = d3.scale.category20();

           
           
          $window.onresize = function() {
            scope.$apply();
          };
          
                     $window.onresize = function ()
                     {
                        
                        return scope.$apply();
                    };
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        return scope.render(scope.data);
                    });

                  
                    scope.$watch('data', function(newData) {
            
                       scope.render(newData);
                   }, true);

                   
          scope.render = function(data)
          {
           
                        svg.selectAll("*").remove();
                        clear("tooltip")
                        var width, height, radius;
                       // width = d3.select(ele[0])[0][0].offsetWidth - margin;
                       width =600;
                       height = 300;
                        radius = 150;

                        svg             //create the SVG element inside the iElement
                        .data([data])   
                        .attr("width",width)//set width and height
                        .attr("height",height)
                        .attr("transform", "translate(" + radius + "," + radius + ")"); 
                        var legend = d3.select("#tooltip").append("svg")
        .attr("class", "legend")
        .attr("width", 100)
        .attr("height", 350)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

                        var arc = d3.svg.arc()  
                        .outerRadius(radius)	//only for normal pie chart
                        .innerRadius(radius-60);   //donut chart
                        

                        var pie = d3.layout.pie()//create arc data  given a list of values
                                      .sort(null)
                                    .value(function(d) { return d; });


                        var arcs = svg.selectAll("g.slice") //selects all elements with class slice
                                .data(pie)  //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                                .enter()   // creating a <g> for every object in the data array
                                .append("svg:g")
                                .attr("class", "slice");
                            //    .on("mouseover", function (d) {
                            //                   d3.select("#tooltip")
                            //                   .style("left", d3.event.pageX + "px")
                            //                    .style("top", d3.event.pageY + "px")
                            //                    .style("opacity", 1)
                            //                    .text(d.value);
                            //    })
                            //   .on("mouseout", function () {
                            //                            // Hide the tooltip
                            //   d3.select("#tooltip")
                            //   .style("opacity", 0);
                            //});
                                        
                    arcs.append("svg:path")
                        .attr("fill", function(d, i) { return color(i); } ) //set the color 
                        .attr("d", arc);//this creates the actual SVG path  
                    
                    arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i]; });   
           
   
          };
        });
      }}
}])
  .controller('DummyDataProvider', ['$scope', function($scope){
     $scope.data = [40,4,55,15,16];
    function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function randomArray(num_elements,min,max) {
  
    var nums = new Array;
  
    for (var element=0; element<num_elements; element++) {
        nums[element] = getRandomInt(min,max);
    }
  
    return (nums);
  }
  
  setInterval(function(){
        $scope.$apply(function() {
            $scope.data = randomArray(5, 1, 100);
        });
    }, 1300);
  
  }]);