cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.oauthio/www/oauth.js",
        "id": "com.phonegap.plugins.oauthio.OAuth",
        "clobbers": [
            "OAuth"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.oauthio": "0.1.1",
    "org.apache.cordova.inappbrowser": "0.3.1"
}
// BOTTOM OF METADATA
});