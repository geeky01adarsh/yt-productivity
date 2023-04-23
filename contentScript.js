(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }
  });

  const setCurrSpeed = () => {
    const increaseSpeed = document.getElementsByClassName("yt-prod-btn")[1];
    const decreaseSpeed = document.getElementsByClassName("yt-prod-btn")[2];
    const video = document.querySelector("video");

    const currSpeed = video.playbackRate.toFixed(2);
    increaseSpeed.title = "Current Speed " + currSpeed;
    decreaseSpeed.title = "Current Speed " + currSpeed;
  };

  const newVideoLoaded = () => {
    const bookmarkBtnExists = document.getElementsByClassName("yt-prod-btn")[0];

    if (!bookmarkBtnExists) {
      // add btn for bookmarks
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "yt-prod-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.append(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

      // add btn for increasing speed
      const addBtn = document.createElement("img");

      addBtn.src = chrome.runtime.getURL("assets/add.png");
      addBtn.className = "ytp-button " + "yt-prod-btn";
      addBtn.title = "Increase the video speed";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.append(addBtn);
      addBtn.addEventListener("click", increaseVideoSpeed);

      // add btn for decreasing speed
      const subBtn = document.createElement("img");

      subBtn.src = chrome.runtime.getURL("assets/sub.png");
      subBtn.className = "ytp-button " + "yt-prod-btn";
      subBtn.title = "Decrease video speed by 0.10";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.append(subBtn);
      subBtn.addEventListener("click", decreaseVideoSpeed);
    }
  };

  const addNewBookmarkEventHandler = () => {
    const currentTime = youtubePlayer.currentTime;
    console.log(currentTime);
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };
    console.log(newBookmark);

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  const increaseVideoSpeed = () => {
    const video = document.querySelector("video");
    if (video.playbackRate >= 10) alert("This is the maximum speed possible.");
    else video.playbackRate += 0.1;
    setCurrSpeed();
  };

  const decreaseVideoSpeed = () => {
    const video = document.querySelector("video");
    if (video.playbackRate <= 0.15)
      alert("This is the minimum speed possible.");
    else video.playbackRate -= 0.1;
    setCurrSpeed();
  };

  newVideoLoaded();
})();

const getTime = (t) => {
  var hour = Math.floor(t / 3600);
  t = t - hour * 3600;
  var min = Math.floor(t / 60);
  t = t - min * 60;
  min = min > 9 ? min : "0" + min;
  t = Math.floor(t);
  t = t > 9 ? t : "0" + t;
  const time = hour + ":" + min + ":" + t;

  return time;
};

/*
In JavaScript, (() => {})() is a self-invoking anonymous function.

Here's how it works:

() => {} is an arrow function that takes no arguments and does nothing.
The surrounding parentheses () group the arrow function expression together.
The final () at the end of the expression calls the function. 

*/
