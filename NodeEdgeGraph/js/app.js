var App = angular.module("todo",[]);
App.controller("TodoCtrl",function  ($scope)
{
	
	$scope.nodes = [
//		
//                {name: "one",
//		},
//		{name: "two",
//		},
//                 {name: "three",
//		  },
//                 {name: "four",
//		 },                 
//                  {name: "five",
//		  }
  
];
	 $scope.links = [
                //{source: $scope.nodes[1], target: $scope.nodes[0]},
                //  {source: $scope.nodes[2], target: $scope.nodes[1]},
                //  {source: $scope.nodes[3], target: $scope.nodes[2]},
                //  {source: $scope.nodes[4], target: $scope.nodes[2]}
];
	
	


	$scope.addNode = function  () {
		var txt = $('#newTodoField');
		var txt2 = $('#newTodoField1');
		
		

		
		var hasmatch=false
		if ( txt2.val()!="") {
			 $scope.nodes.splice(0,0,{name :"value : " + $scope.newTodoTask });
			 // $scope.links.splice(0,0,{source:$scope.nodes[i],target:$scope.nodes[0]});
			  //$scope.links.splice(0,0,{source:$scope.nodes[i-1],target:$scope.nodes[0]});
			}
		var i=0,j=0;
		var len=$scope.nodes.length;
		      for(i=0;i<len;i++)
		      {
			if (txt.val()==$scope.nodes[i].name  )
			{
			  hasmatch=true;
			  j=i;
			// $scope.nodes.splice(0,0,{name : $scope.newTodoTask });
			$scope.links.splice(0,0,{source:$scope.nodes[0],target:$scope.nodes[j]});
			  break;
			}
		      }
		       
		      if (hasmatch==false && txt.val()!="")
			{
			  $scope.nodes.splice(0,0,{name : $scope.newTodo });
			}
			if ( hasmatch==false && txt2.val()!=="") {

		     $scope.links.splice(0,0,{source:$scope.nodes[1],target:$scope.nodes[0]});
			}
			
		//	if (txt2.val()!=="") {
		//
		//     $scope.links.splice(0,0,{source:$scope.nodes[1],target:$scope.nodes[0]});
		//	}
			$scope.newTodo = "";
			$scope.newTodoTask = "";
				
		      				
					
		};
		
	$scope.render = function  () {
		clear("svgVisualize")
		var w = 800,
    h = 600;

var circleWidth = 20;

var fontFamily = 'Bree Serif',
    fontSizeHighlight = '1.5em',
    fontSizeNormal = '1em';

var palette = {
      "lightgray": "#819090",
      "gray": "#708284",
      "mediumgray": "#536870",
      "darkgray": "#475B62",

      "darkblue": "#0A2933",
      "darkerblue": "#042029",

      "paleryellow": "#FCF4DC",
      "paleyellow": "#EAE3CB",
      "yellow": "#A57706",
      "orange": "#BD3613",
      "red": "#D11C24",
      "pink": "#C61C6F",
      "purple": "#595AB7",
      "blue": "#2176C7",
      "green": "#259286",
      "yellowgreen": "#738A05"
  }
              

var vis = d3.select("#svgVisualize")
    .append("svg:svg")
      .attr("class", "stage")
      .attr("width", w)
      .attr("height", h);

var force = d3.layout.force()
    .nodes($scope.nodes)
       .links($scope.links)
       .friction(0.3)
    .gravity(0.1)
    .linkDistance(300)
    .charge(-1000)
    .size([w, h]);
 
 
var link = vis.selectAll(".link")
        .data($scope.links)
        .enter().append("line")
          .attr("class", "link")
          .attr("stroke", "#000000")
	  .attr("stroke-width","4")
          .attr("fill", "none");
       
 var node = vis.selectAll("circle.node")
      .data($scope.nodes)
      .enter().append("g")
      .attr("class", "node")
      
      //MOUSEOVER
      .on("mouseover", function(d,i) {
        if (i>=0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
          .transition()
          .duration(250)
          .style("cursor", "none")     
          .attr("r", circleWidth+3)
          .attr("fill",palette.orange);
      
          //TEXT
          d3.select(this).select("text")
          .transition()
          .style("cursor", "none")     
          .duration(250)
          .style("cursor", "none")     
          .attr("font-size","1.8em")
          .attr("x", 15 )
          .attr("y", 5 )
        } else {
          //CIRCLE
          d3.select(this).selectAll("circle")
          .style("cursor", "none")     
      
          //TEXT
          d3.select(this).select("text")
          .style("cursor", "none")     
        }
      })
      
      //MOUSEOUT
      .on("mouseout", function(d,i) {
        if (i>=0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
          .transition()
          .duration(250)
          .attr("r", circleWidth)
          .attr("fill",palette.pink);
      
          //TEXT
          d3.select(this).select("text")
          .transition()
          .duration(250)
          .attr("font-size","1.8em")
          .attr("x", 8 )
          .attr("y", 4 )
        }
      })

      .call(force.drag);


    //CIRCLE
    node.append("svg:circle")
      //.attr("cx", function(d) { return d.x; })
      //.attr("cy", function(d) { return d.y; })
      .attr("r", circleWidth)
      .attr("fill", function(d, i) { if (i>0) { return  palette.pink; } else { return palette.pink } } )
      

    //TEXT
    node.append("text")
      .text(function(d, i) { return d.name; })
      .attr("x",            function(d, i) { if (i>=0) { return 8; }   else { return 8 } })
      .attr("y",            function(d, i) { if (i>=0) { return 4; }    else { return 4 } })
      .attr("font-family",  "Bree Serif")
      .attr("fill",         function(d, i) { if (i>=0) { return  palette.darkblue; }        else { return palette.darkblue } })
      .attr("font-size",    function(d, i) { if (i>=0) { return  "1.8em"; }            else { return "1.8em" } })
      .attr("text-anchor",  function(d, i) { if (i>=0) { return  "beginning"; }      else { return "end" } })
      

force.on("tick", function(e) {
  node.attr("transform", function(d, i) {     
        return "translate(" + d.x + "," + d.y + ")"; 
    });
  


 link.attr("x1", function(d)   { return d.source.x; })
       .attr("y1", function(d)   { return d.source.y; })
       .attr("x2", function(d)   { return d.target.x; })
       .attr("y2", function(d)   { return d.target.y; })
});
force.start();
	}
	
});


