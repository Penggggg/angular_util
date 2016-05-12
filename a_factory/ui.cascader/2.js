var test = angular.module('test', [])

test.controller('hi', ['$scope', 'HXcascader3', function($scope, HXcascader3){
	
	$scope.json = [{"first":2306,"second":"江门市"},{"first":2315,"second":"湛江市"},{"first":2326,"second":"茂名市"},{"first":2334,"second":"肇庆市"},{"first":2344,"second":"惠州市"},{"first":2351,"second":"梅州市"},{"first":2361,"second":"汕尾市"},{"first":2367,"second":"河源市"},{"first":2375,"second":"阳江市"},{"first":2381,"second":"清远市"},{"first":2391,"second":"东莞市"},{"first":2392,"second":"中山市"},{"first":2393,"second":"潮州市"},{"first":2398,"second":"揭阳市"},{"first":2405,"second":"云浮市"},{"first":2251,"second":"广州市"},{"first":2265,"second":"韶关市"},{"first":2277,"second":"深圳市"},{"first":2285,"second":"珠海市"},{"first":2290,"second":"汕头市"},{"first":2299,"second":"佛山市"}]

	$scope.test = function() {
		var p = HXcascader3.show({
			title: '请选择您的城市',
			initParentId: 2250
		}).then(function(data){
			console.log(data)
		})
	} 

	$scope.test1 = function() {
		var p = HXcascader3.show({
			title: '你好',
			initParentId: 2251
		}).then(function(data){
			console.log(data)
		})
	} 

}])

test.factory('HXcascader3', ['$q','$timeout','$rootScope','$compile','$http', function($q,$timeout,$rootScope,$compile,$http){
	// ---- 变量 --------
	var initParentId = null;
	var cache = {}
	var $ = angular.element;
	var _body = $(document.querySelector('body'));
	var win_h = document.documentElement.clientHeight;
	var win_w = document.body ? document.body.clientWidth  : document.documentElement.clientWidth ;
	var max_h = 0.8;
	var title_h = 50;
	var c_h = win_w * max_h - title_h 
	var cascader_exist = false;
	var state_open = true;
	// ------- 作用域 ----------
	var scope = $rootScope.$new();

	// ----- 启动 --------
	function show(option) {
		console.log(option)
		// ---- 初始化 -----
		initParentId = option.initParentId ? option.initParentId : 2250;

		// --- promsie ---
		var defer = $q.defer();

		
		// ----- 模板 --------
		function _html(option) {
			cascader_exist = true;
			return [
				"<div class='HXcascader' style='height:" + win_h * max_h + "px;" +  " '>",
					"<h3 class='HXcascader_title'><span class='HXcascader_title_main'>" +  option.title + "</span><span class='HXcascader_close' ng-click='toggle()'>x</span></h3>",
					"<div class='HXcascader_container' >",
						"<ul class='HXcascader_one'>",
							"<li ng-repeat='item in data_one' ng-cloak ng-click='clearView(3, item.first);clearData(3);clearData(2);refreshData(item.first,2);keepData(1,item.second,item.first)' >{{ item.second }}</li>",
						"</ul>",
						"<ul class='HXcascader_two' >",
							"<li ng-repeat='item in data_two' ng-cloak ng-click='refreshData(item.first,3);keepData(2,item.second,item.first)' >{{ item.second }}</li>",
						"</ul>",
						"<ul class='HXcascader_three'>",
							"<li ng-repeat='item in data_three' ng-cloak ng-click='refreshData(item.first);keepData(3,item.second,item.first)' >{{ item.second }}</li>",
						"</ul>",
					"</div>",
				"</div>"
			].join('');
		}
	    // ---- 刷新数据 --------
		scope.refreshData = function(parentID, listIndex) {

			if( cache[parentID]){
				switch(listIndex) {
							case 1:
								scope.data_one = cache[parentID];
							case 2:
								scope.data_two = cache[parentID];
								break;
							case 3: 
								scope.data_three = cache[parentID];
								break;
							default:
								break;
						}
			}else {
				$http.get('http://www.lst.com/api/areas/pairs/' + parentID)
					.success(function(data){
						if(data.length != 0){
							cache[parentID] = data;
							switch(listIndex) {
								case 1:
									scope.data_one = data;
								case 2:
									scope.data_two = data;
									break;
								case 3: 
									scope.data_three = data;
									break;
								default:
									break;
							}
						}else{
							defer.resolve([scope.first,scope.second,scope.third]);
							scope.toggle();
							
						}
					})
					.error(function(err){
						console.log(err)
					})
			}
		}	
		// ---- 记录数据 ------
		scope.keepData = function(listIndex,name,id){
			switch(listIndex){
				case 1 :
					scope.first = {};
					scope.first.name = name;
					scope.first.id = id;
					break;
				case 2 :
					scope.second = {};
					scope.second.name = name;
					scope.second.id = id;
					break;
				case 3 :
					scope.third = {};
					scope.third.name = name;
					scope.third.id = id;
					break;
				default:
					break;
			}
		}
		// ---- 清空返回数据 -------
		scope.clearData = function(listIndex){
			switch(listIndex) {
				case 3:
					if(scope.third){
						scope.third=null;
					}
				case 2:
					if(scope.second){
						scope.second=null;
					}
					break;
				default:
					break
			}
		}
		// ----- 情空View数据 -----
		scope.clearView = function(listIndex, liID) {
			if(scope.first && (liID != scope.first.id)  ){
				switch(listIndex) {
					case 3:
					if(scope.data_three){
						scope.data_three = null;
					}
				}
			}else{
				return
			}
		}
		// ------ 关闭 ------
		scope.toggle = function() {
			if(state_open){
				var model = $(document.querySelector('.HXcascader'));
				model.css({
					'transform':'translate3d(0,100%,0)',
					'-webkit-transform':'translate3d(0,100%,0)'
				})
				scope.data_one = null;
				scope.data_two = null;
				scope.data_three = null;
				scope.first = null;
				scope.second = null;
				scope.third = null;
			}
			
		}
	

		$timeout(function(){
			if(!cascader_exist){
				// ------ 生成模板 ------
				var eleHTML = $(_html(option))
				_body.append(eleHTML[0]);
				// ------ 绑定作用域 ----
				$compile(eleHTML)(scope)
			}else{
				$(document.querySelector('.HXcascader_title_main')).text(option.title)
			}
			
			// --- 启动 -----
			$http.get('http://www.lst.com/api/areas/pairs/' + initParentId)
				.success(function(data){
					scope.data_one = data;
					console.log(scope)
					cache[initParentId] = data;
				})
			
			// ---- 动画效果 -------
			$timeout(function(){
				$(document.querySelector('.HXcascader')).css({
					'opacity':'1','filter':'alpha(opacity=100)',
					'transform':'translate3d(0,0,0)','-webkit-transform':'translate3d(0,0,0)'
				})
			}, 16)
		}, 16)

		return defer.promise;

	}



	return {
		show: function(option) {
			return show(option)
		}
	}
}])



 


