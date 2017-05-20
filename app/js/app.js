var app = angular.module("myApp", []);

app.factory("api", function ($http) {
  return {
    fetchSchool: function () {
      return $http({
        url: './data/schools.json',
        method: 'GET'
      })
        .then(function (response) {
          return response.data.map(function (u) {
            u._search = Object.keys(u).reduce(function (aggr, key) {
              return aggr + " " + u[key];
            }, "").toLowerCase();
            return u;
          }).slice(0, 50);
        })
    }
  }

})

app.factory("utility", function () {
  function generateFilterObj(schoolList, keys) {
    var filterObj = keys.reduce(function (aggr, key) {
      aggr[key] = {};
      return aggr;
    }, {})
    schoolList.reduce(function (aggr, school) {
      keys.forEach(function (key) {
        aggr[key][school[key]] = false;
      })
      return aggr;
    }, filterObj)
    return filterObj;
  }

  function mergeObjects(baseObj, extendObj){
    baseObj = baseObj || {};
    for(var key in extendObj){
      baseObj[key] = extendObj[key]
    }
    return baseObj;
  }

  function updateFilterObj(newFilterObj, oldFilterObj) {
    for (var key in oldFilterObj) {
      var hasFound = false;
      for (var value in oldFilterObj[key]) {
        if (oldFilterObj[key][value] == true) {
          hasFound = true;
        }
      }
      if(hasFound){
        newFilterObj[key] = mergeObjects(newFilterObj[key], oldFilterObj[key])
      }
    }
    return newFilterObj;
  }
  function satisfyQuery(school, query) {
    return (
      query.length == 0 ||
      school._search.indexOf(query) > -1
    );
  }

  function satisfyFilter(school, filterObj) {
    return Object.keys(filterObj).every(function (key) {
      return school[key] in filterObj[key]
    });
  }

  function trimFilterObj(filterObj) {
    var trimedFilterObj = {};
    for (var key in filterObj) {
      var temp = {};
      for (var value in filterObj[key]) {
        if (filterObj[key][value]) {
          temp[value] = true;
        }
      }
      if (Object.keys(temp).length > 0) {
        trimedFilterObj[key] = temp;
      }
    }
    return trimedFilterObj;
  }

  return {
    getFilter: function (schoolList, filterObj, keys) {
      return updateFilterObj(generateFilterObj(schoolList, keys), filterObj);
    },
    getSchoolList: function (schoolList, query, filterObj) {
      query = query.toLowerCase().trim();
      filterObj = trimFilterObj(filterObj);
      return schoolList.filter(function (school) {
        return satisfyQuery(school, query) && satisfyFilter(school, filterObj);
      })
    }
  }
})

app.controller("mainController", function ($scope, api, utility) {
  var schoolList = [];
  $scope.filterClass = {
    gender: "Gender",
    category: "Category",
    medium_of_inst: "Medium",
    block: "Location"
  }
  var filterKeys = Object.keys($scope.filterClass)

  $scope.query = "";
  $scope.filterObj = {};
  $scope.schools = []

  $scope.update = function(){
    $scope.schools = utility.getSchoolList(schoolList, $scope.query, $scope.filterObj);
    $scope.filterObj = utility.getFilter($scope.schools, $scope.filterObj, filterKeys);
  }

  function init() {
    api.fetchSchool()
      .then(function (data) {
        schoolList = data;
        $scope.update()
      })
      .catch(function (err) {
        console.error("Unable to fetch school list", err)
      })
  }
  init()
})