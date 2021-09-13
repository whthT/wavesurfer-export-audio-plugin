export default class ExportAudioPlugin {
  static create(params) {
    return {
      name: "exportAudioPlugin",
      deferInit: params && params.deferInit ? params.deferInit : false,
      params: params,
      staticProps: {
        getRenderedAudioBuffer() {
          if (!this.initialisedPluginList.exportAudioPlugin) {
            this.initPlugin("exportAudioPlugin");
          }
          return this.exportAudioPlugin.getRenderedAudioBuffer();
        },
      },
      instance: ExportAudioPlugin,
    };
  }

  constructor(params, ws) {
    this.params = params;
    this.wavesurfer = ws;
  }

  getRenderedAudioBuffer() {
    return new Promise((resolve, reject) => {
      const playbackRate = this.wavesurfer.getPlaybackRate();

      var {
        length,
        numberOfChannels,
        sampleRate,
      } = this.wavesurfer.backend.buffer;

      const playbackRateIncludedLength = length / playbackRate

      const offlineContext = new OfflineAudioContext(numberOfChannels, playbackRateIncludedLength, sampleRate);
      var source = offlineContext.createBufferSource();
      source.buffer = this.wavesurfer.backend.buffer;
      source.playbackRate.value = playbackRate

      const connectedFilters = this.wavesurfer.getFilters();
      const biquadFilterNodes = connectedFilters.filter(filter => filter instanceof BiquadFilterNode)
      if (biquadFilterNodes.length) {
        for (const biquadFilterNode of biquadFilterNodes) {
          const filterClone = offlineContext.createBiquadFilter();
          filterClone.type = biquadFilterNode.type;
          filterClone.frequency.value = biquadFilterNode.frequency.value;
          filterClone.Q.value = biquadFilterNode.Q.value;
          source.connect(filterClone);
          filterClone.connect(offlineContext.destination);
        }
      } else {
        source.connect(offlineContext.destination)
      }

      source.start()

      offlineContext.oncomplete = (e) => {
        resolve(e.renderedBuffer);
      };

      offlineContext.startRendering().catch(reject);
    });
  }

  init() {}

  destroy() {}
}
