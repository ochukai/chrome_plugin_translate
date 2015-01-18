chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request != null && $.trim(request.text) != null){
    	var resultData = translateWithYouDao(request.text);
    	sendResponse({text: resultData});
    }else{
    	sendResponse({text: 'error'});
    }
});

function translateWithYouDao(text){
	var type = 'get';
	var url = 'http://fanyi.youdao.com/openapi.do';
	var data = {
			keyfrom: 'notebook',
			key: '1581556187',
			type: 'data',
			doctype: 'json',
			version: '1.1',
			q: text
	};
	return getData(type, url, data);
}

//Sends request for specify API
//type: requst type('post' or 'get')
//url: address of API
//data: specify parameter to invoke API
function getData(type, url, data){
	var resultData = '';
	$.ajax({
		type: type,
		url: url,
		data: data,
		async: false,
		success: function(result){
			resultData = result;
		},
		error: function(result){
			resultData = result;
		}
	});
	console.log(resultData);
	return resultData;
}