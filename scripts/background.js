/*
Copyright (C) 2014 Byron Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Request listener.
// Mainly to handle the request from content page
// and return the translated data.
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        
        if (request != null && $.trim(request.text) != null) {

            var translater = new Translater();
            
            // Gets data and return to caller.
            translater.translateWithYouDao(request.text)
                .then(function (result) {
                    sendResponse({ text: result });
                });
        }
    });

// Gets translated data from server.
var Translater = function () {
    
    // Service method.
    // Gets translated text from YouDao open API.
    this.translateWithYouDao = function (text) {

        var type = 'get';
        var url  = 'http://fanyi.youdao.com/openapi.do';
        var data = {
            keyfrom : 'notebook',
            key     : '1581556187',
            type    : 'data',
            doctype : 'json',
            version : '1.1',
            q       :  text
        };

        return getData(type, url, data);
    };

    // Comment method to get data with ajax from server.
    var getData = function (type, url, data) {

        var dtd = $.Deferred();

        $.ajax({
            type    : type,
            url     : url,
            data    : data,
            success : function (result) {
                dtd.resolve(result);
            },
            error: function (result) {
                dtd.resolve('timeout or errors in server');
            }
        });

        return dtd.promise();
    }
}