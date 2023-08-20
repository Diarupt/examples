
var mediaStreamSource = null


function audioStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext, 0);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  //drawLoop();

  audioDetection()

  // audioRecorder(stream)
}

