/*
Copyright (C) 2014 Byron Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function () {
    
    'use strict';
    
    var TimeFn;

    // Binds click event.
    $(document).click(function (e) {

        // Cancels last timeout settings.
        clearTimeout(TimeFn);

        var position = EventPositionHelper.getMouseEventPosition(e);

        TimeFn = setTimeout(function () {
            var selectedText = $.trim(window.getSelection().toString());
            if (selectedText != null && selectedText.length > 0 && Translater.isEnglish(selectedText)) {
                Translater
                    .translateWithWait(selectedText)
                    .then(function (result) {
                        Translater.showResult(position.xx, position.yy, result.text || 'No Data!');
                    })
            } else {
                $('#_popup_').hide('slow');
            }
        }, 300);
    });

    // Binds double click event.
    $(document).dblclick(function (e) {

        // Cancels last timeout settings
        clearTimeout(TimeFn);

        var position = EventPositionHelper.getMouseEventPosition(e);
        var selectedText = $.trim(window.getSelection().toString());

        if (selectedText != null && selectedText.length > 0 && Translater.isEnglish(selectedText)) {
            Translater
                .translateWithWait(selectedText)
                .then(function (result) {
                    Translater.showResult(position.xx, position.yy, result.text || 'No Data!')
                });
        }
    });

    // Mainly to get translated text and show to user.
    var Translater = {
        
        translateWithWait: function (selectedText) {

            var dtd = $.Deferred();

            if (selectedText != null && selectedText.length > 0) {
                chrome.extension.sendRequest({
                        text: selectedText
                    },
                    function (response) {
                        dtd.resolve(response);
                    });
            }

            return dtd.promise();
        },

        showResult: function (xx, yy, data) {
            var defaultResultWindow =
                "<div id='_popup_' style='width:280px; border: 1px solid #f27405; background-color: white;                          position: absolute; display: none; text-align: left'>\
                    <div id='_title_' style='background:#f27405; height: 30px'></div>\
                    <div id='_content_'>\
                        <b id='_result_' style='font:bold 25px arial,sans-serif; padding: 5px 12px; word-wrap:                                break-word;'>No Result</b><br />\
                        <hr style='border:0;background-color:#f27405;height:1px' />\
                        <ul id='_webresult_' style='list-style:none; font:12px arial,sans-serif; padding: 2px                                 12px'>\
                        </ul>\
                    </div>\
                </div>";

            // Injects the window element which is used to show translated result.
            if ($('#_popup_').length <= 0) {
                
                //var divElement = generatePopulateWindow();
                $('body').append(defaultResultWindow);
            }
            
            // Clear previous data.
            $('#_webresult_').empty();

            // Sets the position of result window.
            $('#_popup_').css('left', xx);
            $('#_popup_').css('top', yy);

            // Fills data into result window.
            if (data != null) {

                // Traditional translated result
                if (data.translation != null && data.translation.length > 0) {
                    $('#_result_').text(data.translation[0]);
                }

                // Results from web.
                if (data.web != null && data.web.length > 0) {
                    for (var i = 0; i < data.web.length; i++) {
                        var eachWebResult = $('<li></li>')
                        var eachResultText = data.web[i].key;
                        var eachResultValue = '';
                        for (var j = 0; j < data.web[i].value.length; j++) {
                            eachResultValue += data.web[i].value[j] + '; ';
                        }
                        eachWebResult.text(eachResultText + ': ' + eachResultValue);
                        $('#_webresult_').append(eachWebResult);
                    }
                }
            }

            $('#_popup_').show('slow');
        },

        // Checks whether current selected text is English letter.
        isEnglish: function (text) {
            var parent = /^[A-Za-z]+$/;

            if (parent.test(text)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Mainly to compute the position of translated result window.
    var EventPositionHelper = {
        getMouseEventPosition: function (e) {
            var _xx = e.originalEvent.x || e.originalEvent.layerX || 0;
            var _yy = e.originalEvent.y || e.originalEvent.layerY || 0;
            
            // Moves shown result window down a little,
            // which avoise covering the original page words.
            var kdheight = $(document).scrollTop();
            var actualYY = _yy + kdheight + 10; // Scrren Height + Scroll Height + Offset

            return {
                xx: _xx,
                yy: actualYY
            }
        }
    }
}());