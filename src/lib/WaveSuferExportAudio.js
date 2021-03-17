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
      var {
        length,
        numberOfChannels,
        sampleRate,
      } = this.wavesurfer.backend.buffer;


      const playbackRate = this.wavesurfer.backend.source.playbackRate.value;

      const offlineContext = new OfflineAudioContext(
        numberOfChannels,
        length,
        sampleRate
      );
      var source = offlineContext.createBufferSource();
      source.buffer = this.wavesurfer.backend.buffer;
      
      source.playbackRate.setValueAtTime(
        playbackRate,
        offlineContext.currentTime
    );

      const connectedFilters = this.wavesurfer.getFilters();
      if (connectedFilters.length) {
        const biquadFilterNodes = connectedFilters.filter(filter => filter instanceof BiquadFilterNode)
        for (const biquadFilterNode of biquadFilterNodes) {
          const filterClone = offlineContext.createBiquadFilter();
          filterClone.type = biquadFilterNode.type;
          filterClone.frequency.value = biquadFilterNode.frequency.value;
          filterClone.Q.value = biquadFilterNode.Q.value;
          filterClone.Q.value = biquadFilterNode.Q.value;
          source.connect(filterClone);
          filterClone.connect(offlineContext.destination);
        }
      } else {
        source.connect(offlineContext.destination)
      }

      // source.playbackRate.value = this.wavesurfer.backend.source.playbackRate.value

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
