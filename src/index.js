import WaveSurfer from "wavesurfer.js";
import { bufferToWave } from "./lib/helpers";
import WaveSuferExportAudioPlugin from "./lib/WaveSuferExportAudio";
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var selectedChannels = [];
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
  
  var lowpass = wavesurfer.backend.ac.createBiquadFilter({ type: "lowpass" });
  var highpass = wavesurfer.backend.ac.createBiquadFilter({ type: "highpass" });
  var gain = wavesurfer.backend.ac.createGain()
  gain.gain.setTargetAtTime(1, 0, 0.015);

  wavesurfer.once('ready', () => {
    // window.wavesurfer.backend.setFilters([lowpass, highpass])
  })



  window.wavesurfer2 = wavesurfer2;

  wavesurfer.load("/untitled_stereo.wav");

  document.getElementById("playPause").onclick = () => {
    wavesurfer.playPause();
  };

  document.getElementById("playPause2").onclick = () => {
    wavesurfer2.playPause();
  };



  const lowpassEl = document.getElementById("lowpass"),
    highpassEl = document.getElementById("highpass"),
    gainEl = document.getElementById("gain");

  function setActiveFilters() {
    window.wavesurfer.backend.setFilters([
      lowpassEl.checked ? lowpass : null,
      highpassEl.checked ? highpass : null,
      gainEl.checked ? gain : null,
    ].filter(Boolean))
  }

  async function renderWaveform2 () {
    const renderedAudioBuffer = await wavesurfer.getRenderedAudioBuffer();
    wavesurfer2.loadDecodedBuffer(renderedAudioBuffer);
  }

  lowpassEl.addEventListener("change", (e) => {
    setActiveFilters()
    renderWaveform2()
  });

  gainEl.addEventListener("change", (e) => {
    setActiveFilters()
    renderWaveform2()
  });

  highpassEl.addEventListener("change", (e) => {
    setActiveFilters()
    renderWaveform2()
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
