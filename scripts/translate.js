var xx;
var yy;
var TimeFn = null;

// Injects the window element used to show translate content.
$(document).ready(function(){
	if($('#popup_byron').length <= 0){
		var divElement = generatePopulateWindow();
		$('body').append(divElement);
	}
});

$(document).mousemove(function(e){
	// Gets the selected text position.
	xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
	yy = e.originalEvent.y || e.originalEvent.layerY || 0;
});

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

//callback and show data.
function showData(xx, yy, data){
	var kdheight =  $(document).scrollTop();
    $('#popup_byron').css('top', yy + kdheight + 10);
	$('#popup_byron').css('left', xx);
	$('#result').text(data.translation[0]);
	$('#popup_byron').show('slow');
}

// TODO
function generatePopulateWindow(){
	var popupWindow = 
		"<div id='popup_byron' style='width:300px; border: 1px solid #f27405; background-color: white; position: absolute'>\
			<div id='title' style='background:#f27405; height: 30px'></div>\
			<div id='content'>\
				<b id='result' style='font:bold 25px arial,sans-serif; padding: 2px; word-wrap: break-word;'>Result</b><br />\
				<hr style='border:0;background-color:#f27405;height:1px' />\
				<b id='webresulttitle'>TODO</b>\
				<ul id='webresult' style='list-style:none'>\
				</ul>\
			</div>\
		</div>";
	return popupWindow;
}

function isEnglish(text){
	var parent=/^[A-Za-z]+$/;
	if(parent.test(text)){
	  	return true;
	}else{
	  return false;
  	} 	
}