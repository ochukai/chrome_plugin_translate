var xx;
var yy;
var TimeFn = null;

// Injects the window element used to show translate content.
//$(document).ready(function(){
//	if($('#popup_byron').length <= 0){
//		var divElement = generatePopulateWindow();
//		$('body').append(divElement);
//	}
//});

// Record current position of mouse.
// And mainly uses this position to show translated result.
$(document).mousemove(function(e){
	// Gets the selected text position.
	xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
	yy = e.originalEvent.y || e.originalEvent.layerY || 0;
});

// Mouse click event listener.
// Decides when to show the translated result
// and when to hide it.
$(document).click(function(){
    clearTimeout(TimeFn);
    TimeFn = setTimeout(function(){
    	var selectedText = $.trim(window.getSelection().toString());
        if(selectedText != null 
        	&& selectedText.length > 0
        	&& isEnglish(selectedText)){
        	translateAndShowData(xx, yy, showData);
        }else{
        	$('#popup_byron').hide('slow');
        }
    },300);
});

// Mouse double click event.
// Decides when to show the translated result.
$(document).dblclick(function(){
    clearTimeout(TimeFn);
    var selectedText = $.trim(window.getSelection().toString());
    if(selectedText != null 
    	&& selectedText.length > 0
    	&& isEnglish(selectedText)){
    	translateAndShowData(xx, yy, showData);
    }else{
    	// Nothing to do here!
    }
})

// Requests the translate API and gets the translated result.
function translateAndShowData(xx, yy, showData){
	var selectedText = $.trim(window.getSelection().toString());
	if(selectedText != null && selectedText.length > 0){
			// lastTime = Math.round(new Date().getTime());
			chrome.extension.sendRequest({text: selectedText}, function(response){
			// Append element to DOM
			showData(xx, yy, response.text);
		});
	}
}

// Call back function.
// Appends the translated result to window
// and show this window.
function showData(xx, yy, data){
	// Injects the window element which is used to show translated result.
	if($('#popup_byron').length <= 0){
		var divElement = generatePopulateWindow();
		$('body').append(divElement);
	}
	// Clear previous data.
	$('#webresult').empty();

	// Sets the position of result window.
	var kdheight =  $(document).scrollTop();
    $('#popup_byron').css('top', yy + kdheight + 10);
	$('#popup_byron').css('left', xx);

	// Fills data into result window.
	if(data != null){

		// Traditional translated result
		if(data.translation != null && data.translation.length > 0){
			$('#result').text(data.translation[0]);
		}

		// Results from web.
		if(data.web != null && data.web.length > 0){
			for(var i = 0; i < data.web.length; i++){
				var eachWebResult = $('<li></li>')
				var eachResultText = data.web[i].key;
				var eachResultValue = '';
				for(var j = 0; j < data.web[i].value.length; j++){
					eachResultValue += data.web[i].value[j] + '; ';
				}
				eachWebResult.text(eachResultText + ': ' + eachResultValue);
				$('#webresult').append(eachWebResult);
			}
		}

	}

	$('#popup_byron').show('slow');
}

// Window elements used to display the translated result.
function generatePopulateWindow(){
	var popupWindow = 
		"<div id='popup_byron' style='width:280px; border: 1px solid #f27405; background-color: white; position: absolute; display: none'>\
			<div id='title' style='background:#f27405; height: 30px'></div>\
			<div id='content'>\
				<b id='result' style='font:bold 25px arial,sans-serif; padding: 5px 12px; word-wrap: break-word;'>No Result</b><br />\
				<hr style='border:0;background-color:#f27405;height:1px' />\
				<ul id='webresult' style='list-style:none; font:12px arial,sans-serif; padding: 2px 12px'>\
				</ul>\
			</div>\
		</div>";
	return popupWindow;
}

// Check whether the all selected text is English letter.
function isEnglish(text){
	var parent=/^[A-Za-z]+$/;
	if(parent.test(text)){
	  	return true;
	}else{
	  return false;
  	} 	
}