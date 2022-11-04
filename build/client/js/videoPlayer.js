"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var playBtnIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteBtnIcon = muteBtn.querySelector("i");
var time = document.getElementById("time");
var volumeRange = document.getElementById("volume");
var currentTime = document.getElementById("currentTime");
var totalTime = document.getElementById("totalTime");
var timeline = document.getElementById("timeline");
var fullScreenBtn = document.getElementById("fullScreen");
var fullScreenIcon = fullScreenBtn.querySelector("i");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var volumeValue = 0.5;
video.volume = volumeValue;
var handlePlayClick = function handlePlayClick(e) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
playBtn.addEventListener("click", handlePlayClick);
var handleMuteClick = function handleMuteClick(e) {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
var handleVolumeChange = function handleVolumeChange(event) {
  var value = event.target.value;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = volumeValue;
};
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
var formatTime = function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};
var handleLoadedMetaData = function handleLoadedMetaData() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
var handleTimeUpdate = function handleTimeUpdate() {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
video.addEventListener("loadedmetadata", handleLoadedMetaData);
//The loadedmetadata event is fired when the metadata has been loaded.
video.addEventListener("timeupdate", handleTimeUpdate);
//The timeupdate event is fired when the time indicated by the currentTime attribute has been updated.

var handleTimelineChange = function handleTimelineChange(e) {
  var value = e.target.value;
  video.currentTime = value;
};
var handleFullscreen = function handleFullscreen() {
  var fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.classList = "fas fa-compress";
  }
};
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
var controlsTimeout = null;
var controlsMovementTimeout = null;
var hideControls = function hideControls() {
  return videoControls.classList.remove("visible");
};
var handleMouseMove = function handleMouseMove() {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  } // 이걸 초기화 안해주면 마우스움직이고 있는데도 중간에 컨트롤 사라진다.
  //초기화해줘서 마우스가 움직이는동안에는 계속 타임아웃을 초기화 해준다.
  videoControls.classList.add("visible");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
var handleMouseLeave = function handleMouseLeave() {
  controlsTimeout = setTimeout(hideControls, 3000);
};
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
var handleEnded = function handleEnded() {
  var id = videoContainer.dataset.id;
  fetch("/api/videos/".concat(id, "/view"), {
    //we should use POST when we are mutating the database and GET when we are just getting data.
  });
};
video.addEventListener("ended", handleEnded);