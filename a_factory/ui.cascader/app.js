var app = angular.module('myApp', ['ionic', 'test'])







// ---------- 之前写的 ----------
app.factory('HXcascader', ['$q','$timeout','$http', function($q, $timeout,$http){
	// ---- 要以promise形式返回的数据 --------
	var data_one = {};
	var data_two = {};
	var data_three = {};
	var deferred = $q.defer();
	var promise = deferred.promise;
	// ------- 建立缓存 --------
	var cache = {}

	// ------ 公共变量 ---------
	var self = this;
	var max_h = 0.8;
	var title_h = 50;
	var $ = angular.element;
	var _body = $(document.querySelector('body'));
	var win_h = document.documentElement.clientHeight;
	var win_w = document.body ? document.body.clientWidth  : document.documentElement.clientWidth ;
	// ------ 组件 -------
	var container = null;
	var title = null;
	var list_one = null;
	var list_two = null;
	var list_three = null;

	// ----- 组件状态 -------
	var contain_exist = false;
	var title_exist = false;
	var list_one_exist = false;
	var list_two_exist = false;
	var list_three_exist = false;


	// ----- 外部容器 -------
	var maker_container = function() {
		if(!contain_exist){
			container = $(document.createElement('div'));
			container.css({
				'position': 'fixed','width': win_w + 'px','height': win_h * max_h + 'px','transition':'all ease 0.4s','-webkit-transition':'all ease 0.4s',
				'background-color':'rgba(0,0,0,0.8)',
				'bottom':'0%','left':'0','z-index':'100', 'opacity':'0','filter':'alpha(opacity=0)',
				'transform':'translate3d(0,100%,0)','-webkit-transform':'translate3d(0, 100%,0)'
			})
			contain_exist = true;
		}else{

		}
	}

	// ---- close ---
	var close_container = function() {
		container.css({
			'transform':'translate3d(0,100%,0)','-webkit-transform':'translate3d(0,100%,0)',
			'opacity':'0','filter':'alpha(opacity=0)'
		})		
	}

	// ----- title -------
	var maker_title = function(optionTitle) {
		if(!title_exist){
			title = $(document.createElement('h3'));
			var close = $(document.createElement('div'));
			title.css({
				'position':'relative','min-height': title_h+'px','background-color':'rgba(255,255,255,1)','color':'#666',"text-align":'center',
				'margin':'0','box-sizing':'border-box','box-shadow':'0 0px 5px rgba(0,0,0,0.3)','line-height':'45px','z-index':'100',
				'border-bottom':'1px solid #ccc'
			})

			title.html(optionTitle)
			// ----- 关闭按钮 ----
			close.css({
				'position':'absolute','width':'25px','height':'25px','border-radius':'50%','top':'7px','right':'20px',
				'background': '#eee','font-size':'12px','text-align':'center','line-height':'26px','z-index':'100'
			})
			close.html('X');
			title.append(close);

			// ----- 点击关闭 -------
			close.on('click', function(){
				close_container();	
			})

			title_exist = true;
		}else{

			title.children().remove();
			title.html(optionTitle)
		}
	}
	// ------- list one ------
	var maker_list_one = function(json, optionName, optionID, optionCascader) {
		// ------ 生成 ----------
		if(!list_one_exist){
			list_one = $(document.createElement('ul'))
			list_one.css({
				'position':'absolute','background-color':'rgba(255,255,255,1)','z-index':'101','width':'100%','top': title_h +'px',
				'left':'0','height': win_h * max_h - title_h + 'px','overflow':'auto'
			})

		// ------ 定义ID ----------
		list_one.attr('id', 'HXcascader_one');

		// -------- 抽取数据 ----------
		makeData(json, optionName, optionID, list_one)

		// -------- li -------------
		decorateLi(list_one)

		// ----- 事件代理 ---------
		eventDelegator(list_one, maker_list_two, optionName, optionID , optionCascader)
		
		// ---- 状态更变 -------
		list_one_exist = true;

		}else{

			// ------ 模板已经存在 直接刷新数据 -------------

			// ------- 删除以前的元素 --------
			list_one.children().remove()

			// -------- 抽取数据 ----------
			makeData(json, optionName, optionID, list_one)

			// -------- li -------------
			decorateLi(list_one)

		}
	}
	// ------- list two -------
	var maker_list_two = function(json, optionName, optionID) {
		// ------ 第一次生成ul模板 ----------
		if(!list_two_exist){
			list_two = $(document.createElement('ul'))
			list_two.css({
				'position':'absolute','background-color':'rgba(255,255,255,1)','z-index':'102','width':'100%','top': title_h +'px',
				'left':'33.3%','height': win_h * max_h - title_h + 'px','overflow':'auto','transition':'all ease 0.4s','-webkit-transition':'all ease 0.4s',
				'transform':'translate3d(100%,0,0)','-webkit-transform':'translate3d(100%,0,0)',
				'border-left':'1px solid #eee'
			})

			// 定义ID
			list_two.attr('id', 'HXcascader_two');

			// -------- 抽取数据 ----------
			makeData(json, optionName, optionID, list_two)

			// -------- li -------------
			decorateLi(list_two)

			// ----- 事件代理 ---------
			eventDelegator(list_two, maker_list_three, optionName, optionID )


			list_two_exist = true;

			container.append(list_two)
			// ---- 动画效果 ----
			$timeout(function(){
				list_two.css({
					'transform':'translate3d(0,0%,0)','-webkit-transform':'translate3d(0,0%,0)'
				})
			}, 16)


		}else{

			// ------ 模板已经存在 直接刷新数据 -------------

			// ------- 删除以前的元素 --------
			list_two.children().remove()

			// -------- 抽取数据 ----------
			makeData(json, optionName, optionID, list_two)
			// -------- li -------------
			decorateLi(list_two)

		}
	}
	// ------ list three ------
	var maker_list_three = function(json, optionName, optionID) {
		// ------ 第一次生成ul模板 ----------
		if(!list_three_exist){
			list_three = $(document.createElement('ul'))
			list_three.css({
				'position':'absolute','background-color':'rgba(255,255,255,1)','z-index':'102','width':'100%','top': title_h +'px',
				'left':'66.6%','height': win_h * max_h - title_h + 'px','overflow':'auto','transition':'all ease 0.4s','-webkit-transition':'all ease 0.4s',
				'transform':'translate3d(100%,0,0)','-webkit-transform':'translate3d(100%,0,0)',
				'border-left':'1px solid #eee'
			})

		// ------ 定义ID --------
		list_three.attr('id', 'HXcascader_three');

			// -------- 抽取数据 ----------
			makeData(json, optionName, optionID, list_three)
			// -------- li -------------
			decorateLi(list_three)

			// ----- 事件代理 ---------
			eventDelegator(list_three )

			list_three_exist = true;

			container.append(list_three)
			// ---- 动画效果 ----
			$timeout(function(){
				list_three.css({
					'transform':'translate3d(0,0%,0)','-webkit-transform':'translate3d(0,0%,0)'
				})
			}, 16)


		}else{

			// ------ 模板已经存在 直接刷新数据 -------------

			// ------- 删除以前的元素 --------
			list_three.children().remove()

			// -------- 抽取数据 ----------
			makeData(json, optionName, optionID, list_three)
			// -------- li -------------
			decorateLi(list_three)

		}
	}

	// ----- util 抽取数据 --------
	var makeData = function(json, optionName, optionID, listEle) {

		// -------- 抽取数据 ----------
		angular.forEach(json, function(value, index){
			var liEle = $(document.createElement('li'))
			for(i in value){
				if(i == optionName){
					liEle.html(value[i])
				}else if(i == optionID ){
					liEle.attr('parent_id', value[i])
				}
			}
			listEle.append(liEle);
		})	
	}

	// ----- li style --------
	var decorateLi = function(liEle) {
		liEle.find('li').css({
			'dispaly':'block','box-sizing':'border-box','padding':'10px 15px','font-size':'15px',
			'color':'#666','background':'rgba(255,255,255,1)','border-bottom':'1px solid #ccc'
		})
	}

	// ----- util 事件代理 ----------
	var eventDelegator = function(liEle, callback, optionName, optionID, optionCascader) {
			liEle.on('click', function(e){
				var target = $(e.target);
				var targetId = target.attr('parent_id');
				var ulEleId = $(target).parent().attr('id');
				console.log(targetId);
				console.log(ulEleId)

				// -------- 点击记录数据 -----------
				if(ulEleId === 'HXcascader_one'){
					data_one.name = target.html();
					data_one.parentID = targetId;
				}else if(ulEleId === 'HXcascader_two'){
					data_two.name = target.html();
					data_two.parentID = targetId;					
				}else if(ulEleId === 'HXcascader_three'){
					data_three.name = target.html();
					data_three.parentID = targetId;	
				}

				// ---------- 至多前2层点击会发起请求 ---------
				if(ulEleId === 'HXcascader_one' || ulEleId === 'HXcascader_two' ){
					// --- 若点击第一列 则情空第三列 -------
					if(ulEleId === 'HXcascader_one' && list_three_exist ){
						closeList( list_three )
					}
					// -------- 若没有缓存 ---------
					if( !cache[targetId] || cache[targetId].length === 0){
						$http.get('http://www.lst.com/api/areas/pairs/' + targetId)
							.success(function(data){
								// ---- 动态获取并生成下一列 ---------
								// ------- 若数据不为空 ------
								if( data.length != 0 ){
									// --- 建立缓存 ----
									cache[targetId] = data;
									callback( data,optionName,optionID, optionCascader)
								}else{
									// ----- 数据为空 直接返回 -----
									// ------ 关闭弹窗 ------
									close_container();
									// ----- 返回promise ----
									deferred.resolve([data_one, data_two])								
								}
							})
							.error(function(err){
								console.log(err)
							})								
					}else{
						callback( cache[targetId],optionName,optionID, optionCascader)
					}

				}else{
					// ------ 若能点击第三层则可以返回数据 ---------

						// ------ 关闭弹窗 ------
						close_container();
						// ----- 返回promise ----
						deferred.resolve([data_one, data_two, data_three])
				}

			})	
		
	}

	// ---- close list -------
	var closeList = function(liEle) {
		liEle.children().remove();
	}


	var show = function(options) {

	    deferred = $q.defer();
	    promise = deferred.promise;

	    // ------ 默认参数 -----
	    initParentId = options.initParentId ? options.initParentId : 2250

		$timeout(function(){
			// ---- 生产并组装组件 ----
			maker_container();
			maker_title(options.title);
			$http.get('http://www.lst.com/api/areas/pairs/' + initParentId)
				.success(function(data){
					cache[initParentId] = data;

					// ----- 初始化启动 -----
					maker_list_one(data, options.name, options.parentID, options.cascader);

					container.append(title)
					container.append(list_one)
						
					// ---- 动画效果 ------
					_body.append(container);
					$timeout(function(){
						container.css({
							'transform':'translate3d(0,-0%,0)','-webkit-transform':'translate3d(0,-0%,0)',
							'opacity':'1','filter':'alpha(opacity=100)'
						})
					}, 16)
				})
				.error(function(err){
					console.log(err)
				})

		}, 16)

		return promise;

	}


	return {
		show: function(options) {
			return show(options)
		}
	}
}])

