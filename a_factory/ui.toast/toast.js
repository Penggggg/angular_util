var appTools = angular.module('appTools', []);

/*
 * ------ toast ------
 * ------ 用法 -------
 * ------ 此方法会返回一个promise -------
 * app.controller('xxx', ['$scope', 'HXtoast', function($scope, HXtoast){...}
 * HXtoast.show({
 *			text: '你好，我叫hzp12312312313',  // 要显示的文字
 *			time: 2000 // 2000毫秒后自动消失
 * }).then(function(){
 *	   // 成功
 * });
*/
appTools.factory('HXtoast', ['$q', '$timeout', function($q, $timeout){
	// ------ declare varities -----
	var _body = angular.element(document.querySelector('body'));
	var toast = angular.element(document.createElement('div'));
	var toast_text = angular.element(document.createElement('p'));
	var toast_exist = false;
	var toast_text_exist = false;
	var toast_deferred = $q.defer();
	var toast_promise = toast_deferred.promise;

	// ------ toast maker ---------
	var toastMaker = function(deferred) {
		if(!toast_exist){
			toast.css({
				'display':'block', 
				'position':'fixed',
				'min-width':'100px', 
				'min-height':'35px',
				'max-width': '160px',
				'background':'rgba(0, 0 , 0, 0.65)',
				'z-index': '1000',
				'border-radius':'6px',
				'top':'50%',
				'left':'50%',
				'transition':'all ease 0.4s',
				'-webkit-transition':'all ease 0.4s',
				'transform':'translate3d(-50%, -50%, 0)',
				'-webkit-transform':'translate3d(-50%, -50%, 0)',
				'box-shadow':'0 0 2px 3px rgba(0, 0 , 0, 0.3)',
				'opacity':'0',
				'filter':'alpha(opacity=0)'
				 });
		toast_exist = true;

			deferred.resolve();
		}else{
			toast.css({
				'transform':'translate3d(-50%, -50%, 0)',
				'-webkit-transform':'translate3d(-50%, -50%, 0)'				
			})
			$timeout(function(){
				toast.css({
					'transition':'all ease 0.4s',
					'-webkit-transition':'all ease 0.4s',
				})
				deferred.resolve();
			}, 16)
			
		}
		// ------ done! -----		
	}
	// ---- decorate text -----
	var initText = function(deferred){
		if(!toast_text_exist){
			toast_text.css({
				'font-sizt':'15px',
				'padding': '5px 10px',
				'color': 'rgba(255,255,255,1)',
				'text-align':'center',
				'white-space':'normal'
			})
			toast_text_exist = true;
			deferred.resolve();
		}else{
			deferred.resolve();
		}
	} 
	// ------ show ----
	var show = function(options) {

		// -- promise -----
		var defer_toast = $q.defer();
		var defer_text = $q.defer();
		var promise_toast = defer_toast.promise;
		var promise_text = defer_text.promise;
		var promise = $q.all([promise_toast, promise_text]);
		
		// -- make toast ----
		toastMaker(defer_toast);
		initText(defer_text)
		// -- get text from options---

		$timeout(function(){
			promise.then(function(){
				// -- append text ----

				toast_text.html(options.text) ;
				toast.append(toast_text)
				// -- show ---
				_body.append(toast);

				toast_deferred.resolve();

				$timeout(function(){
					toast.css({
						'opacity':'1',
						'filter':'alpha(opacity=100)'					
					})

				}, 16)
				// ---- auto close ----
				$timeout(function(){
					close();

				}, options.time)

			}, function(err){
				console.log(err)
			})

		}, 16)

		return toast_promise

	}
	// ----- close ------
	var close = function() {
		toast.css({
			'opacity':'0',
			'filter':'alpha(opacity=0)'					
		})
		$timeout(function(){
			toast.css({
				'transition':'all ease 0s',
				'-webkit-transition':'all ease 0s',
				'transform':'translate3d(-1000%, -1000%, 0)',
				'-webkit-transform':'translate3d(-1000%, -1000%, 0)',
			})
		}, 500)
	}
	return {
		show: function(options) {
			return show(options)
		}
	}
}]);
