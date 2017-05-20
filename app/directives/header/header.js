app.directive("header",function(){
    return {
        restrict: "E",
        templateUrl: './app/directives/header/header.html',
        controller:function($scope){
            $scope.hasKeys = function(obj){
                return Object.keys(obj).length > 0
            }
        }
    }
})