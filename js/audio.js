class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        
        // 预加载音效
        this.loadSounds({
            hit: 'audio/hit.wav',      // 打中音效
            levelUp: 'audio/levelup.wav', // 升级音效
            gameOver: 'audio/gameover.wav', // 游戏结束音效
            pop: 'audio/pop.wav'       // 数字消除音效
        });
    }

    loadSounds(soundConfig) {
        Object.entries(soundConfig).forEach(([name, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            this.sounds[name] = audio;
        });
    }

    play(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        // 克隆音频节点以支持重叠播放
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = 0.6; // 设置音量
        
        sound.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
} 