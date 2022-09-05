'use strict';

const videoElement = document.querySelector('video');
const videoSelect = document.querySelector('select#videoSource');
videoSelect.onchange = updateStream;
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
      videoSelect.appendChild(option);
    }
  }
}

function updateStream(){
  const videoSource = videoSelect.value;
  const constraints = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  getStream(constraints);
}

function getStream(constraints) {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}

function start(){
  const supports = navigator.mediaDevices.getSupportedConstraints();
  if(supports['facingMode']){
    console.log("facingMode suported")
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment" 
      }
    }
    getStream(constraints).then(getDevices).then(gotDevices)
    videoSelect.selectedIndex = [...videoSelect.options].
      findIndex(option => option.text === window.stream.getVideoTracks()[0].label);
  }else{
    console.log("facingMode not suported")
    updateStream().then(getDevices).then(gotDevices)
    videoSelect.selectedIndex = videoSelect.options.length-1;
    updateStream();
  }
}

start()
