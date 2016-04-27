var PengUi = angular.module('PengUi', [])

PengUi.directive('autoHideBar', ['$window','$timeout', function($window,$timeout){

	// ----- declare varities
	var _window = angular.element(window)
	var _body = angular.element(document.querySelector('body'));
	var b_id = 'pengBackDrop';
	var _win_width = document.body.clientWidth + 'px';
	var _win_height = window.screen.availHeight  + 'px';

	// ------ bar state ----------
	var state = {}
	state.BAR_STATE_SHOW = false;

	// ------ utils --------------
	function showBar(ele){
		ele.css({'transform':'translate3d(-90%,0,0)','-webkit-transform':'translate3d(-90%,0,0)'})
	}
	function showCover(){
		// build once	
		var cover = document.getElementById(b_id)
		if( !cover ){
			var backDrop = angular.element(document.createElement('div'));
			backDrop.attr('id', b_id)
			backDrop.css({'display':'block','position':'fixed', 'width':_win_width, 'height': _win_height, 'background':'rgba(255,255,255,0)','z-index':'1000', 'top':'0', 'left':'0'})
			_body.append(backDrop)			
		}else{
			var b = angular.element(document.querySelector('#' + b_id))
			b.css({'transform':'translate3d(0%,0,0)','-webkit-transform':'translate3d(0%,0,0)','z-index':'1000'})
		}

	}
	function hideBar(ele){
		ele.css({'transform':'translate3d(0%,0,0)','-webkit-transform':'translate3d(0%,0,0)'})
	}
	function hideCover(){
		var cover = angular.element(document.querySelector('#' + b_id ));
		cover.css({'transform':'translate3d(-100%,0,0)','-webkit-transform':'translate3d(-100%,0,0)','z-index':'0'})
	}


	// -------- compile function--------
	function compile(ele, attrs){

		// ------ change style ----------
		ele.css({'position':'fixed','right':'-90%','bottom':'15%','transition':'all 0.4s ease','-webkit-transition':'all 0.4s ease','width':'100%','z-index':'1001'})
		// ------- bind event -----------
		// ------- use event agent -------
		ele.bind('click', function(){
			
			// ---------- show --------
			if(!state.BAR_STATE_SHOW){
				// ----- show cover ------
				showCover()
				// -------- show bar -----
				$timeout(function(){
					showBar(ele)
				})
				// -------- reset state ----
				state.BAR_STATE_SHOW = true
			}
		})
		// ---------- hide --------
		_window.bind('click', function(e){
			if(state.BAR_STATE_SHOW){
				var _t = e.target;
				var _t_id = _t.id
				if(_t_id === b_id ){
					// ---- close bar -----
					hideBar(ele)
					// ---- clode cover
					hideCover()
					// ----- reset state ----
					state.BAR_STATE_SHOW = false

				}
			}
		})
		_window.bind('scroll', function(){
			if(state.BAR_STATE_SHOW){

					// ---- close bar -----
					hideBar(ele)
					// ---- clode cover
					hideCover()
					// ----- reset state ----
					state.BAR_STATE_SHOW = false

				
			}			
		})

		



		return {
			post: function(scope, ele, attr){
				console.log('linking')
			}
		}
	}

	return {
		restrict: 'AE',
		compile: compile,
		transclude: true,
		template: '<div>' +
						'<ng-transclude></ng-transclude>' +  
				  '</div>'	
	}
}])

