/* global whale */

const getCurrentTime = 
    `(function () {
        if(document.getElementsByTagName("video")[0]) return parseInt(document.getElementsByTagName("video")[0].currentTime);
    })();`

const currentTime = (cb) => {
        whale.tabs.executeScript({
            code: getCurrentTime
        }, result => {
        if(whale.runtime.lastError){
            console.log(whale.runtime.lastError.message)
        }else{
            cb(result);
        }});
};
const getProgressClick = 
    `(function () {

        if(document.querySelectorAll(".video-stream.html5-main-video")[0]) {
            document.querySelectorAll(".video-stream.html5-main-video")[0].addEventListener("click", () => { 
                whale.runtime.sendMessage({msgID: "click_event"});
            });
            document.querySelectorAll(".ytp-progress-bar-container")[0].addEventListener("mouseup", () => { 
                whale.runtime.sendMessage({msgID: "click_event"});
            });
        }
    })();`

const progressClick = () => {
        whale.tabs.executeScript({
            code: getProgressClick
        }, result => {
        if(whale.runtime.lastError){
            console.log(whale.runtime.lastError.message)
        }else{
            return "";
        }
    });
};

const progressClickReceive = (cb) => {
    whale.runtime.onMessage.addListener(function(req, sender, resp){
        cb(req,sender);
    });
};

const changeFocus = (sender, cb) => {
    whale.sidebarAction.show(sender.tab.windowId,null,cb);
}

const extractVideoId = 
    `(function () {
        var video_id = window.location.search.split('v=')[1];
        if(video_id){
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
                return video_id;
            }else{
                return video_id;
            }
        }
    })();`;

const videoId = (cb) => {
    whale.tabs.executeScript({
        code: extractVideoId
    }, result => {
        if(whale.runtime.lastError){
            console.log(whale.runtime.lastError.message)
        }else{
            cb(result);
        }
    });    
}

const changeTab = (cb) => {
    whale.tabs.onActivated.addListener(cb);
}

const changeUrl = (cb) => {
    whale.tabs.onUpdated.addListener(cb);
}
const set = (obj,cb) => {
    whale.storage.local.set(obj,cb)
}

const get = (cb) => {
    whale.storage.local.get(null, result => {
        cb(result);
    })
}

const remove = (obj,cb) => {
    whale.storage.local.remove(obj,cb)
}

const initialDB = (cb) => {
    whale.storage.local.getBytesInUse(cb);
}

const newTab = (urlObj, cb) => {
    whale.tabs.create(urlObj, cb)
}

const currentTab = (urlObj, cb) => {
    whale.tabs.update(urlObj, cb);
}

const onLoadHandler = (cb) => {
    whale.tabs.onUpdated.addListener(cb);
}

export default {
    currentTime,
    progressClick,
    progressClickReceive,
    changeFocus,
    videoId,
    changeTab,
    changeUrl,
    set,
    get,
    remove,
    initialDB,
    newTab,
    currentTab,
    onLoadHandler,
};
