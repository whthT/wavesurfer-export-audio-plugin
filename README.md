# WaveSurfer Export Audio Plugin

[WaveSurfer.js](https://wavesurfer-js.org/) Export Audio Plugin

**NOTE**
This plugin works for **WebAudio** backend only for now.

### Usage

```js
import ExportAudioPlugin from "wavesurfer-export-audio-plugin";
const wavesurfer = WaveSurfer.create({
  container: document.getElementById("wavesurfer"),
  backend: "WebAudio", // Just WebAudio for now..
  ...
  plugins: [
      ...
      ExportAudioPlugin.create(),
      ...
  ],
});

document.getElementById('some-button').onclick = async () => {
    const renderedBuffer = await wavesurfer.getRenderedAudioBuffer(); // AudioBuffer
}

```

### Installation

```sh
$ npm i wavesurfer-export-audio-plugin
```

### Methods

- `getRenderedAudioBuffer` - Returns filters applied audio buffer. // Eq: Lowpass, Highpass


### Todos

- Support for MediaElement backend.
- Tests

## License

MIT

**Free Software, Hell Yeah!**

[git-repo-url]: https://github.com/whthT/wavesurfer-export-audio-plugin
[wavesurfer.js]: https://wavesurfer-js.org
[whtht]: https://github.com/whthT
[node.js]: http://nodejs.org
