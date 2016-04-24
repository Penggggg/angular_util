var PengUi = angular.module('PengUi', [])

PengUi.directive('pengGoTop',['$window' , function($window){

	_compile = function(ele, attr){
		var _top = attr.pengGoTop;
		ele.bind('click', function(){
			_top === undefined || _top === null ? (document.body.scrollTop=0) : (document.body.scrollTop=_top)
		})
		return {
			post: function(scope, ele, attr){
			}
		}
	}

	return {
		restrict: 'AE',
		compile: _compile
	}

}])