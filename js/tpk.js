var tpk=angular.module("tpk",[]);
var tpk_border="./page/";
var usearch=url_search(window.location.search);
var tpk_url=(usearch.upg!="")?usearch.upg:"index";
var index_show_img;
tpk.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            element.bind('load', function() {
                $(element).removeClass("hide");
            });
            element.bind('error', function(){
                $(element).removeClass("hide");
            });
        }
    };
}).directive('menuhover', function() {
  
    return {
        restrict:"A",
         link: function(scope, element, attrs) {
             element.hover(function (){$(".ss-menu").slideDown(200).css("top",$("#main-menu").height());
                                      },
                           function (){$(".ss-menu").slideUp(100);});   
         }
    }
}).directive("menuonhover",function (){
    return {
        restrict:"A",
         link: function(scope, element, attrs) {
             element.hover(function (){
                $(this).css({background:"#555"});
             $(this).find("a").css("color","#fff")},
                function (){
                  $(this).find("a").css({color:"#000"});
                  $(this).css("background","#fff")})   
             }
         }
}).directive("vidoelink",function (){
    return {
        restrict:"A",
        link:function (scope,element,attrs){
          element.click(function (){
              var type=element.data("type");
              console.log(type);
              if(type=="url"){
                    return true;
              }else if(type='in_vidoe'){
                  $("#tpk_show_modal").show();
                  var context="<video width='100%' controls><source src='"+element.attr("href")+"' type='video/mp4'>Your browser does not support HTML5 video.</video>"
                  $(".show_location").html(context);
              }
              return false;
              
          })
        }
        
    }
    
}).directive("hideclick",function (){
return {
        restrict:"A",
        link:function (scope,element,attrs){
          element.click(function (){
              $("#tpk_show_modal").hide();
               $(".show_location").html("");
          })
        }
        
    }
    
});
tpk.controller("tpk_all",function ($scope,$http){
    $("#tpk_show_modal").hide();
    $http.get("data/m-menu.csv").success(function (data){
        $(".se-pre-con").hide();
        var t_menu=get_csv(data,["name","link","type"]);
        var a=Array();
        for(t in t_menu){
            var tmp=t_menu[t];
            var link="";
            switch(tmp.type){
                case "link":
                    a[t]={name:tmp.name,link:"http://"+tmp.link,tpk_smenu:{},type:tmp.type};
                    break;
                 case "in-web":
                    a[t]={name:tmp.name,link:tmp.link,tpk_smenu:{},type:tmp.type};
                    break;
                 case "list":
                 case "menu":
                    a[t]={name:tmp.name,link:"",tpk_smenu:{},type:tmp.type};
                    $.ajax({
                        url : 'data/'+tmp.link+".csv",
                        cache : false, 
                        async : false,
                        type : "get",
                        dataType : 'html',
                        success : function (result){
                            var tpk_smenu={};
                             var ts_menu=get_csv(result,["name","link","context","page","image"]);
                               for(ts in ts_menu){
                                   var tmp=ts_menu[ts];
                                   var lk="reindex.html?upg="+tmp.link+"&context="+tmp.context+"&sub="+tmp.page;
                                 a[t]["tpk_smenu"][ts]={link:lk,name:tmp.name,image:tmp.image,context:{}}; 
                                   $.ajax({
                                    url : 'data/sub_menu/'+tmp.context+".csv",
                                    cache : false, 
                                    async : false,
                                    type : "get",
                                    dataType : 'html',
                                    success : function (tts){
                                       var tpks_smenu={};
                                     var tss_menu=get_csv(tts,["name","page"]);
                                       for(tss in tss_menu){
                                           var tmpa=tss_menu[tss];
                                           var lo={name:tmpa['name'],url:"reindex.html?upg="+tmp.link+"&context="+tmp.context+"&sub="+tmpa.page};
                                           a[t]["tpk_smenu"][ts]['context'][tss]=lo;
                                           
                                       }
                                       
                                   }
                                    })
                               } 
                            }
                        });
                       
                        
                    break;
                    
                    
            }
        }
         $scope.tpk_menu=a;
    })
    $scope.menu="sd";
    $scope.tpk_show=tpk_border+tpk_url+".html";
    $scope.to_show_list=function (){
        //console.log($("#new-exhibition").offset().top);
        $(window).scrollTop($("#new-exhibition").offset().top);
        
    }
    $scope.to_online_list=function (){
        //console.log($("#new-exhibition").offset().top);
        $(window).scrollTop($("#online-exhibition").offset().top);
        
    }
    $scope.goindex=function (){
        location.href="index.html"
    }
    
    
});
tpk.controller("tpk_index",function ($scope,$http){
    $http.get("data/menu.csv").success(function (data){
        var csv=get_csv(data,["name","upg","func","image",'show']);
            var a=[];
        for (i in csv){
            var ts=csv[i];
            //console.log(ts)
            if(ts.show!='N'){
            var tmp={"name":ts.name,image:ts.image,context:[]};
            $.ajax({
                url : 'data/sub_menu/'+ts.func+".csv",
                cache : false, 
                async : false,
                type : "get",
                dataType : 'html',
                success : function (result){
                   var tts=get_csv(result,["name","url"]);
                    var ttmp=[];
                    for(k in tts){
                        var tzp=tts[k];
                        ttmp.push({name:tzp.name.substring(0,5),url:"?upg="+ts.upg+"&context="+ts.func+"&sub="+tzp.url})
                    }
                    tmp['context']=ttmp;
                }
            });
            a.push(tmp);
        }
               }
          $scope.index_show_image=a;
    })
    
    $scope.show_detailed=function (){
    }
})
tpk.controller("tpk_public",function ($scope){
    active_page();
    $scope.upg=tpk_url;
    $scope.func_html="data/public/"+usearch['sub']+".html";
})
tpk.controller("tpk_sub-menu",function ($scope,$http){
    var t=[];
    $http.get("data/sub_menu/"+usearch['context']+".csv").success(function (data){
        var t=get_csv(data,["name","url"]);
        var a=[];
        for(i in t){
            var tmp=t[i];
            a.push({name:tmp.name,url:"?upg="+usearch['upg']+"&context="+usearch['context']+"&sub="+tmp.url,select:tmp.url})
        }   
        if(usearch['sub']==undefined||usearch['sub']==""){  
            a[0]['isActive']=true;
        }else{
            for(i in a){
                if(a[i]['select']==usearch['sub']){
                    a[i]['isActive']=true;
                }
            }
        }
        $scope.sub_menu=a;
    })
     $scope.func_html="data/"+usearch['context']+".html";
   

});

tpk.controller("tpk-photo-menu",function ($scope,$http){
    var t=[];
    $http.get("data/"+usearch['context']+".csv",{headers: {
    'Content-Type': undefined
 },}).success(function (allText){
           photo=get_csv(allText,["image","name","sub"]);
            console.log(photo[0]["sub"])
            if(usearch['sub']==undefined){  
                photo[0]['isActive']=true;
            }else{
                for(i in photo){
                    if(photo[i]['sub']==usearch['sub']){
                        photo[i]['isActive']=true;
                    }
                }
            }
        $scope.sub_menu=photo;
        $scope.upg=usearch['upg'];
        $scope.context=usearch['context'];
        });
    //$scope.sub_menu=t;
    $scope.func_html="data/"+usearch['context']+".html";

});
tpk.controller("banner",function ($scope){
    $scope.index_banner=[
        {src:"banner.png",detailed:"測試",show:"active"},
        {src:"banner.png",detailed:"測試",show:""},
        {src:"banner.png",detailed:"測試",show:""}
    ]
})
tpk.controller("tpk_photo",function ($scope,$http,$location){
 
    
    var photo=[];
    var t=false;
    var photo_show_num=12;
    $scope.loa=function (){
        console.log("a");
        
    }
    if(usearch['sub']==undefined||usearch['sub']==""){
       $.ajax({
                url : "data/"+usearch['context']+".csv",
                cache : false, 
                async : false,
                type : "get",
                dataType : 'html',
                success : function (result){
                   photo=get_csv(result,["image","name","sub","context"]);
                   //console.log(photo[0]['image']="icon/ajax-loader.gif");
                  
                   $scope.photo=photo;
                   $scope.show=false;
                }
            });
    }else{
        $.ajax({
                url : "data/"+usearch['sub']+".csv",
                cache : false, 
                async : false,
                type : "get",
                dataType : 'html',
                success : function (allText){
                    photo=get_csv(allText,["image","name","sub","context"]);
                    for(i in photo){
                        
                        //photo[i]['hide']="none";
                    }
                    t=true;
                    $scope.show=true;
                }
            });
//        for(i=0;i<photo_show_num;i++){
//                photo[i]['hide']="block";
//            }
//        
        $scope.photo=photo;
        
    }
//    var photo=[
//        {image:"page2.png",name:"try",context:"try"},
//         {image:"page2.png",name:"try",context:"try"},
//         {image:"page2.png",name:"try",context:"try"},
//         {image:"page2.png",name:"try",context:"try"}
//    ]
   
    $scope.text_up=function (){
        this.active="photo_text_up";
   }
    $scope.text_leave=function (){
        this.active="";
    }
    $scope.photo_f=function (tmp,image,context){
        if(t){
            $("#tpk_show_modal").show();
            $("#tpk_show_modal .show_location").load("./page/imageshow.html",function (){
                 $("#tpk_show_modal .show_location").find("#show_image_c").attr("src","image/"+image);
                $("#tpk_show_modal .show_location").find(".introduction").html(context)
                $(".dialog-back").mousedown(function (){
                $("#tpk_show_modal").hide();
                })
            });
           
        }else{
            location.href='?upg='+usearch['upg']+"&context="+usearch['context']+"&sub="+tmp;
        
        }
    }
})
tpk.controller("vidoe",function ($scope,$http){
    $.ajax({
                url : "data/"+usearch['context']+".csv",
                cache : false, 
                async : false,
                type : "get",
                dataType : 'html',
                success : function (result){
                   var vidoe=get_csv(result,["image","title","context","link","type"]);
                   //console.log(photo[0]['image']="icon/ajax-loader.gif");
                    var tp={};
                    $scope.vidoe=vidoe;
                    
                }
            });
    
    
})


