var myApp = angular.module('myApp', ['ionic'])

myApp.directive('hxupload',['hxfileserver' , function(hxfileserver){

	_link = function(scope, ele, attr){
		// ------ 维护图片队列 -------
		scope.list = [];
		// ------ 上传事件 ----------
		ele[0].getElementsByTagName("input")[0].onchange = function(ev){
			var fileElement = ev.target || ev.srcElement;
			var fileLength = fileElement.files.length;
			// ------- loading效果 ---------
			for(var i = 0; i < fileLength; i++){
				scope.list[scope.list.length] = {
					state: false
				}
			}	
			
			// ----- 上传 -------
			
			hxfileserver.upload(fileElement, '/lst/files')
				.then(function(data){
					console.log(data);
					var i = fileLength;
					console.log(i)
					angular.forEach(data, function(value){
						// ------ 新增list ------- 
						scope.list[scope.list.length - i].id = value.id;
						scope.list[scope.list.length - i].fileName = value.fileName;
						scope.list[scope.list.length - i].fileSize = value.fileSize;
						scope.list[scope.list.length - i].state = true;
						scope.list[scope.list.length - i].itemIndex = scope.list.length - i;
						i--;
					})	
								
				})
		}
		// ------- 删除事件 --------
		scope.deleteItem = function(itemIndex) {
			angular.forEach(scope.list, function(item, index){
				if(itemIndex < index){
					item.itemIndex--;
				}
			})
			scope.list.splice(itemIndex, 1)
		}
	}

	return {
		restrict: 'AE',
		link: _link,
		scope: {},
		template: "<div class='HXupload_container'>" +
						"<div class='HXupload_list' ng-repeat='i in list' >"+
							"<img ng-src='lst/images/{{i.id}}'  />" +
							"<ion-spinner icon='bubbles' class='spinner-light HXupload_loading' ng-if='i.state == false' ></ion-spinner>" +
							"<span class='HXupload_close' ng-click='deleteItem(i.itemIndex)'>x</span>" +
						"</div>" +
						"<div class='HXupload_add'>" +
							"<i>+</i>" +
							"<input type='file' multiple='multiple' />" +
						"</div>" +
						"<div class='clearfix'></div>" +
				  "</div>"
	}

}])

myApp.factory('hxfileserver', ['$q','$timeout', function($q, $timeout){

	var fileSend = 0;
	var result = [];

	function xhrUpload(file, url, data, headers, fileLength, defer){

		// 计数器
		
		

		// return a promise 
		// var defer = $q.defer();

		//0.预处理
        var xhr = new window.XMLHttpRequest(), 
        	formData = new window.FormData(), 
        	key = 'file';

         // Append additional data if provided:        
        if (data) {
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    formData.append(prop, data[prop]);
                }
            }
        }

        // header
        if (headers) {
            for (var headerKey in headers) {
                if (headers.hasOwnProperty(headerKey)) {
                    xhr.setRequestHeader(headerKey, headers[headerKey]);
                }
            }
        }

        // Append file data:
        formData.append(key, file, file.name);


		// To account for sites that may require CORS
        if (data && data.withCredentials === true) {
            xhr.withCredentials = true;
        }
        xhr.open('POST', url);


 		//1.设置各类回调函数
        // Triggered when upload starts:
        xhr.upload.onloadstart = function() {
        };

        // Triggered many times during upload:
        xhr.upload.onprogress = function(ev) {
        	
        };

        // Triggered when upload is completed:
        xhr.onload = function() {
        	var rsp = JSON.parse(xhr.responseText);
        	result.push(rsp);
        	console.log(result);
        	fileSend++;
        	if(fileSend === fileLength){
        		defer.resolve(result);
        	}
        	
        };

        // Triggered when upload fails:
        xhr.onerror = function(ev) {
        	console.log('err')
        };

        //2.开始上传文件了
        xhr.send(formData);

        // return defer.promise
	}

	function upload(fileEle, fileUrl, data, headers) {
		// --- reset -------
		fileSend = 0;
		result = [];
		// ----- promise ---
		var defer = $q.defer();
		// ------- send -------
		if(window.FormData){

			$timeout(function(){
				
				angular.forEach(fileEle.files, function(file){
					xhrUpload(file, fileUrl, data, headers, fileEle.files.length, defer);
				})
				
			}, 16)
		
			return defer.promise;			
			
		}else{
			console.log('旧版浏览器')
		}
	}

	return {
		upload: upload
	}
}])