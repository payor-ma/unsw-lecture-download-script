// ==UserScript==
// @name         UNSW Moodle & BbCollab Video Downloader
// @namespace    https://github.com/payor-ma/unsw-lecture-download-script
// @version      0.1
// @description  Download lecture videos from unsw's moodle and bb-collaborate resources
// @author       Matthew Payor
// @match        https://moodle.telt.unsw.edu.au/mod/folder/view.php*
// @match        https://au.bbcollab.com/collab/ui/session/playback*
// @match        https://au-lti.bbcollab.com/collab/ui/session/playback*
// @grant        GM_openInTab
// ==/UserScript==


// Determining which match has occured and branching to the appropriate function
if (document.URL.split("/")[2].split(".")[0] == "moodle") {
    document.addEventListener("DOMContentLoaded", getMoodleVideo());
} else if (document.URL.split("/")[2].split(".")[1] == "bbcollab") {
    document.addEventListener("DOMContentLoaded", getBbCollabVideo());
}


function getBbCollabVideo() {
    
    // Because the video loads in a plugin, poll every 500ms until the appropriate HTML is loaded
    var intervalID = setInterval(function() {getBbCollabHTML()}, 500);

    // Get the HTML and extract the video link
    function getBbCollabHTML() {
        
        var vidframe = document.getElementsByClassName('jw-media jw-reset');
        
        if (vidframe.length !== 0) {
            
            clearInterval(intervalID);

            //unsafeWindow.console.log(vidframe.item(0));
            var link = vidframe[0].innerHTML;

            if (link !== null) {

                // Extracting the video link in a dumb way - probably where this will break first
                link = link.slice(link.indexOf("src=")+5, -10).split('&amp;');
                link = link[0].concat("&").concat(link[1]).concat("&").concat(link[2]);

                if (link !== null) {
                    
                    // Action on extracted link - at the moment this opens it in a new active tab
                    GM_openInTab(link, { active: true , insert: true });
                    
                }
            }
        }
    }
}


// Same as BbCollab except different html element and string parsing
function getMoodleVideo() {

    var intervalID = setInterval(function() {getMoodleHTML()}, 500);

    function getMoodleHTML() {
        
        var vidframe = document.getElementsByClassName('vjs-tech');
        
        if (vidframe.length !== 0) {
            
            clearInterval(intervalID);

            var link = vidframe[0].innerHTML;

            if (link !== null) {
                
                link = link.split(" ")[1].split('"')[1].split('&amp')[0].concat("&model=video");

                if (link !== null) {
                    
                    GM_openInTab(link, { active: true , insert: true });
                    
                }
            }
        }
    }
}
