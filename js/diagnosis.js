'use strict';

const devices = document.querySelector('ul#devices');


getStream().then(getDevices).then(gotDevices);

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

// list devices
function gotDevices(deviceInfos) {
	// clean the list
	devices.innerHTML = '';
	for (let i = 0; i !== deviceInfos.length; ++i) {
    	const deviceInfo = deviceInfos[i];
    	console.log("device " + i + " info : ", deviceInfo);
		const item = document.createElement('li');
		const itemText = String(
			"deviceId: " + deviceInfo.deviceId +
			" kind: " + deviceInfo.kind +
			" label: " + deviceInfo.label
		)
		item.appendChild(document.createTextNode(itemText));
    	devices.appendChild(item);
	}
}


function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const constraints = {
    audio: false,
    video: true
  };
  return navigator.mediaDevices.getUserMedia(constraints).catch(handleError);
}


// error handler
function handleError(error) {
	const message = String('navigator.MediaDevices.getUserMedia error: ' + error.message + " " + error.name);
	console.log(message);
	devices.innerHTML = '';
	const item = document.createElement('li');
	item.appendChild(document.createTextNode(message));
	devices.appendChild(item);
}
