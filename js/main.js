$(document).ready(function() {  
    $(function() {
        var nodes = [];
        $.ajax({    
            type:"GET",   
            url:"../templates/index.json",   
            dataType: "json",  
            success: function(data){ 
                $.each(data,function(i,item){  
                    nodes[i] = data[i];
                    nodes[i].startTime = item.startTime;
                    nodes[i].duration = item.duration;
                    nodes[i].content = item.operationName;
                    nodes[i].bgcolor = item.bgcolor;
                    nodes[i].levelId = item.levelId;
                    nodes[i].parentLevelId = item.parentLevelId;
                })
                displayData(nodes);
                animate();
                barHover();
            } 
             
        }) 
        //list of nodes
        
      

        //display data
        function displayData(nodes){
            $('.duration').html('');
            $('.nodes').html('');
            for (var key in nodes){
              var startTime = nodes[key].startTime,
                  duration = nodes[key].duration,
                  content = nodes[key].content,
                  bgcolor = nodes[key].bgcolor;
                  id = nodes[key].id;
              
              $('.nodes').append("<li><span>"+key+"</span></li>");
              $('.duration').append("<li><div data-percentage='"
                                    +nodes[key].startTime/10
                                    +"' class='bar'>"
                                    +startTime
                                    +"</div><div data-percentage='"
                                    +nodes[key].duration/10
                                    +"' class='bar' id = '"
                                    +nodes[key].id
                                    +"' style='background-color:"
                                    +nodes[key].bgcolor
                                    +"'><span>"
                                    +content
                                    +"</span></div></li>"); 
            }
        } 


        //animate the data
        function animate(){
            $('.bar').css('width','0px');
            $(".duration .bar").delay(1000).each(function(i){
                var percentage = $(this).data('percentage');
                $(this).delay(i+"00").animate({'width': percentage + '%'}, 700); 
            });
        }

        //highlight all the parents when hover
        function barHover(){
            $(".chart .duration .bar:nth-child(even)").mouseenter(function(){ 
                var arr =[];  
                //找到悬停的节点及其所有父节点函数          
                function traceParents(nodesid){ 
                    if(nodes[nodesid].parentLevelId == -1){
                        arr.push(nodesid);
                        //console.log("arrlength="+arr.length);
                        var arrlength = arr.length;
                        return;
                    }
                    else{
                        
                        for (var j = 0;j < nodes.length;j++){
                            if (nodes[j].levelId == nodes[nodesid].parentLevelId) {
                                arr.push(nodesid);
                                traceParents(j);
                            }
                        }
                    }
                    
                }

                //获得当前悬停节点的位置
                var nodesid = $(this).attr("id").replace(/[^0-9]/ig,""); 
                traceParents(nodesid);
                //console.log("id="+nodesid);
                
                //讲json数据节点数组与当前悬停节点及其父节点数组求差，即得到所有透明度降低的节点数组
                var nodesids = [];
                for (var i=0;i<nodes.length;i++){
                    nodesids[i] = i;
                }
                var result = [];
                var tmp = nodesids.concat(arr);
                var o = {};
                for (var i = 0; i < tmp.length; i ++) {
                    (tmp[i] in o) ? o[tmp[i]] ++ : o[tmp[i]] = 1;
                }
                for (x in o) if (o[x] == 1) {
                    result.push(x);
                }
                //console.log(result);

                for (var k=0;k<result.length;k++){
                    $("#nodes"+result[k]).css("opacity",0.1);    
                } 

                
            }).mouseleave(function(){
                $(".chart .duration .bar:nth-child(even)").css("opacity",1);
            });
        }
    }); 
});  