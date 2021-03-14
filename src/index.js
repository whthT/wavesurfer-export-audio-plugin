import WaveSurfer from "wavesurfer.js";
import { bufferToWave } from "./lib/helpers";
import WaveSuferExportAudioPlugin from "./lib/WaveSuferExportAudio";
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var selectedChannels = [];
var lowpass, highpass;
window.addEventListener("DOMContentLoaded", () => {
  const wavesurfer = WaveSurfer.create({
    container: document.getElementById("wavesurfer"),
    backend: "WebAudio",
    splitChannels: true,
    height: 60,
    plugins: [WaveSuferExportAudioPlugin.create()],
  });

  const wavesurfer2 = WaveSurfer.create({
    container: "#wavesurfer2",
    backend: "WebAudio",
    splitChannels: true,
    height: 60,
  });

  window.wavesurfer2 = wavesurfer2;

  wavesurfer.load("/untitled_stereo.wav");

  document.getElementById("playPause").onclick = () => {
    wavesurfer.playPause();
  };

  document.getElementById("playPause2").onclick = () => {
    wavesurfer2.playPause();
  };

  wavesurfer.once("ready", () => {
    setTimeout(() => {
      lowpass = wavesurfer.backend.ac.createBiquadFilter({ type: "lowpass" });
      lowpass.frequency.value = 300;

      highpass = wavesurfer.backend.ac.createBiquadFilter({ type: "highpass" });
      highpass.frequency.value = 300;
    }, 300);
  });

  const lowpassEl = document.getElementById("lowpass"),
    highpassEl = document.getElementById("highpass");
  lowpassEl.addEventListener("change", (e) => {
    if (e.target.checked) {
      wavesurfer.backend.setFilters(
        [lowpass, highpassEl.checked ? highpass : null].filter(Boolean)
      );
    } else {
      wavesurfer.backend.disconnectFilters();
      if (highpassEl.checked) {
        wavesurfer.backend.setFilter(highpass);
      }
    }
  });

  highpassEl.addEventListener("change", (e) => {
    if (e.target.checked) {
      wavesurfer.backend.setFilters(
        [highpass, lowpassEl.checked ? lowpass : null].filter(Boolean)
      );
    } else {
      wavesurfer.backend.disconnectFilters();
      if (lowpassEl.checked) {
        wavesurfer.backend.setFilter(lowpass);
      }
    }
  });

  document.getElementById("lowpass").addEventListener("change", (e) => {
    if (e.target.checked) {
      wavesurfer.backend.setFilter(lowpass);
    } else {
      wavesurfer.backend.disconnectFilters();
    }
  });

  document.getElementById("playbackRate").addEventListener("change", (e) => {
    wavesurfer.setPlaybackRate(parseFloat(e.target.value));
  });

  document.getElementById("export").addEventListener("click", async (e) => {
    e.preventDefault();
    const renderedAudioBuffer = await wavesurfer.getRenderedAudioBuffer();
    wavesurfer2.loadDecodedBuffer(renderedAudioBuffer);
    // var new_file = URL.createObjectURL(bufferToWave(renderedAudioBuffer, renderedAudioBuffer.length));

    // var download_link = document.getElementById("download");
    // if (!download_link) {
    //   download_link = document.createElement('a')
    //   document.body.appendChild(download_link)
    // }

    // download_link.href = new_file;
    // var name = "test.wav";
    // download_link.download = name;
    // download_link.click()
  });

  window.wavesurfer = wavesurfer;
});
