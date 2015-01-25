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