var app = angular.module('myApp', ['ionic'])

app.controller('e', ['$scope', 'HXselect', function($scope,HXselect){

	$scope.data = ['身份证', '身份证2代', '学生证', '老人卡', '羊城通', '身份证2代', '学生证', '老人卡', '羊城通']
	$scope.data2 = ['身份证2', '身份证2代22', '学生证2', '老人卡2', '羊城通2', '身份证2代2', '学生证2', '老人卡2', '羊城通']


	$scope.test = function() {
		var q = HXselect.show({
			title: '请选择',
			data: $scope.data
		}).then(function(data){
			console.log(data)
		})
	}

	$scope.test2 = function() {
		var q = HXselect.show({
			title: '请选择22222',
			data: $scope.data2
		}).then(function(data){
			console.log(data)
		})
	}
}])

app.factory('HXselect', ['$q', '$rootScope', '$timeout', '$compile', function($q, $rootScope,$timeout,$compile){
	// ---- 变量 --------
	var $ = angular.element;
	var _body = $(document.querySelector('body'));
	var win_h = document.documentElement.clientHeight;
	var win_w = document.body ? document.body.clientWidth  : document.documentElement.clientWidth ;
	var max_h = 0.45;
	var title_h = 40;
	var c_h = win_w * max_h - title_h 
	var select_exist = false;
	var select_open = true;
	// ------- 作用域 ----------
	var scope = $rootScope.$new();

	// ------ 启动 ----------
	function show(option) {

		scope.data = option.data;
		var defer = $q.defer();

		scope.toggle = function() {
			var model = $(document.querySelector('.HXselect'));
			model.css({
				'transform':'translate3d(0,100%,0)',
				'-webkit-transform':'translate3d(0,100%,0)'
			})
		}

		scope.submit = function(item) {
			defer.resolve(item);
			scope.toggle();
		}
		
		function _html(option) {
			select_exist = true;
			return [
				"<div class='HXselect' style='height:" + win_h * max_h + "px;" +  " '>",
					"<h3 class='HXselect_title'><span class='HXselect_title_main'>" +  option.title + "</span><span class='HXselect_close' ng-click='toggle()'>x</span></h3>",
					"<div class='HXselect_container' >",
						"<ul class='HXselect_one'>",
							"<li ng-repeat='item in data track by $index' ng-cloak ng-click='submit(item)' >{{ item }}</li>",
						"</ul>",
					"</div>",
				"</div>"
			].join('')
		}

		$timeout(function(){
			// ------ 生成模板 ------
			if(!select_exist){
				var eleHTML = $(_html(option))
				_body.append(eleHTML[0]);
				// ----- 绑定作用域 ------
				$compile(eleHTML)(scope)
			}else{

			}

			// --- 动画 -----
			$timeout(function(){
				$(document.querySelector('.HXselect')).css({
					'opacity':'1','filter':'alpha(opacity=100)',
					'transform':'translate3d(0,0,0)','-webkit-transform':'translate3d(0,0,0)'
				})
			}, 16)

		}, 16)

		return defer.promise;

	}

	return {
		show: function(option){
			return show(option);
		}	
	}

}])