app.directive("schoolList",function(){
    var schoolController = ["$scope", function($scope){
        $scope.sortKey = "schoolid"
        $scope.isReverseSort = false;
        $scope.pageSize = 10;
        $scope.pageIndex = 0;

        $scope.maxPageIndex = Math.ceil($scope.schools.length / $scope.pageSize) - 1;
        $scope.updatePageIndex = function(pageIndex){
            $scope.maxPageIndex = Math.ceil($scope.schools.length / $scope.pageSize) - 1;
            if(pageIndex >= 0 && pageIndex <= $scope.maxPageIndex){
                $scope.pageIndex = pageIndex;
            }
        }
        $scope.sortField = function(field){
            $scope.pageIndex = 0
            if(field == $scope.sortKey){
                $scope.isReverseSort = !$scope.isReverseSort;
            }else{
                $scope.sortKey = field;
                $scope.isReverseSort = false; 
            }
        }
    }]
    return {
        restrict: "E",
        scope:{
            schools : "="
        },
        templateUrl: './app/directives/schoolList/list.html',
        controller: schoolController
    }
})