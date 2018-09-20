import MediaStreamRecorder from 'msr';// https://github.com/streamproc/MediaStreamRecorder
class AudioRecord {
    constructor (name) {
        this.name = name;
        this.timer = 60000; // 一分钟
        this.mediaConstraints = { audio: true };
        navigator.getUserMedia(this.mediaConstraints, this.onMediaSuccess, this.onMediaError);
    }
    cerateEle = () => {
        if (document.getElementById('audio-contant')) {
            document.querySelector(this.name).removeChild(document.getElementById('audio-contant'));
        } 
        let $div = document.createElement('div');
        $div.setAttribute('id', 'audio-contant');
        document.querySelector(this.name).appendChild($div);
        document.getElementById('audio-contant').innerHTML = `<audio id="audio" controls></audio>
        <button id="gather-now">采集</button>
        <button id="gather-save">保存</button>`;
    }
    onMediaSuccess= (stream) => {
        this.cerateEle();
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.audio = document.getElementById('audio');
        let $gather = document.getElementById('gather-now'),
            $save = document.getElementById('gather-save');
        $gather.addEventListener('click', this.stop, true);
        $save.addEventListener('click', this.save, true);
        this.audio.addEventListener('pause', this.seeked, true);
        this.audio.addEventListener('playing', this.play, true);
        this.audio.srcObject = stream;
        this.audio.play();
        this.mediaRecorder.mimeType = 'audio/wav'; // audio/webm or audio/ogg or audio/wav
        this.mediaRecorder.ondataavailable = (blob) => {
            let blobURL = window.URL.createObjectURL(blob);
            this.src = blobURL;
        };
        this.mediaRecorder.start(this.timer * 10);
    }
    onMediaError= (e) => {
        console.error('media error', e);
    }
    seeked = (e) => {
        this.mediaRecorder.pause();
    }
    stop = (e) => {
        this.mediaRecorder.stop();
        this.audio.pause();
    }
    save = (e) => {
        this.mediaRecorder.save();
    }
    play = e => {
        this.mediaRecorder.resume();
    }
}
export default AudioRecord;