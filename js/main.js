'use strict';

const videoSelect = document.querySelector('select#videoSource');
videoSelect.onchange = updateAction;
const videoElement = document.querySelector('video');
videoElement.className =  "invert";

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      option.id = deviceInfo.label;
      videoSelect.appendChild(option);
    }
  }
  changeOptionByText(getCurrentDevice());
}

function changeOptionByText(text){
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === text);
}

function getCurrentDevice(){
  return videoElement.srcObject.getVideoTracks()[0].label;
}


function getStream(constraints) {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

function updateStream(){
  const videoSource = videoSelect.value;
  const constraints = {
    audio: false,
    video: {
        deviceId: videoSource ? {exact: videoSource} : undefined,
        width: { ideal: 4096 },
        height: { ideal: 2160 },
        frameRate: { ideal: 120 }
    }
  };
  return getStream(constraints);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
}

function updateAction() {
  updateStream().then(gotStream).catch(handleError);
}

function handleError(error) {
  console.error('Error: ', error);
}

function getVideoResolution() {
  // log the real size
  console.log('video resolution');
  console.log(videoElement)
  console.log(videoElement.videoWidth, videoElement.videoHeight);
}

function start(){
  const supports = navigator.mediaDevices.getSupportedConstraints();
  if(supports['facingMode']){
    console.log("facingMode suported")
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",
        width: { ideal: 4096 },
        height: { ideal: 2160 },
        frameRate: { ideal: 120 }
      }
    }
    getStream(constraints).then(gotStream).then(getDevices).then(gotDevices).catch(handleError);
  }else{
    console.log("facingMode not suported")
    updateStream().catch(handleError);
	getDevices().then(gotDevices).catch(handleError);
	videoSelect.selectedIndex = videoSelect.options.length-1;
    updateStream().then(gotStream).catch(handleError);;
  }
}


start()
