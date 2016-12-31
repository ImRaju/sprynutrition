
angular
	.module('app')
	.controller('SearchController', ['$scope','$state','Searchitem', function($scope,$state,Searchitem){
		// initiate an array to hold all active tabs
    $scope.activeTabs = [];

    // check if the tab is active
    $scope.isOpenTab = function (tab) {
      // check if this tab is already in the activeTabs array
      if($scope.activeTabs.indexOf(tab) > -1) {
        // if so, return true
        return true;
      } else {
        // if not, return false
        return false;
      }
    }

    // function to 'open' a tab
    $scope.openTab = function (tab) {
        // check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            // if it's not, add it!
            $scope.activeTabs.push(tab);
        }
    }
    $scope.search=function(item) {
      Searchitem
        .search({searchitem:$scope.Searchitem})
        .$promise
        .then(function(results) {
        	$scope.item = results.searchitem;
        	$scope.items = results.response;
        });
    }
	}])
	.controller('ScheduleController', ['$scope','$state','Schedule', function($scope,$state,Schedule){
    function getSchedule() {
      Schedule
        .find()
        .$promise
        .then(function(results) {
        	$scope.items = results;/*
        	alert( new Date(results[0].scheduledtime).toDateString())*/
        });
    }
    getSchedule();
    $scope.scheduleID=function(item) {
    	//alert(item.id)
    	Schedule
    	.findById({id:item.id})
    	.$promise
    	.then(function(s){
    		$scope.sitem=s;
    	})
    }
    $scope.createsdule=function(sdule,dt){
    	sdule.scheduledate=dt;
    	Schedule
    	.createSchedule(sdule)
    	.$promise
    	.then(function(s){
    		getSchedule();
    		$scope.dismiss();
    	},function(err){
    		alert(err.data.error.message);
    		$scope.dismiss();
    	})
    }
    $scope.updatesdule=function(id,date,active){
    	Schedule
    	.updateSchedule({id:id,scheduledate:date,active:active})
    	.$promise
    	.then(function(data){
    		getSchedule();
    		$scope.dismiss();
    	},function(err){
    		alert(err.data.error.message);
    		$scope.dismiss();
    	})
    }
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();


  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

 function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getTime()<(new Date).setUTCHours(0,0,0,0));
  }
  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }

	}]).directive('abc', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       scope.dismiss = function() {
       		$('#myModal').modal('hide')
           //element.modal('hide');
       };
     }
   } 
}).directive('abcd', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       scope.dismiss = function() {
       		$('#myModal2').modal('hide')
           //element.modal('hide');
       };
     }
   } 
})