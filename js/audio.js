class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        
        // 获取基础URL路径
        this.basePath = this.getBasePath();
        
        // 预加载音效
        this.loadSounds({
            hit: 'hit.wav',
            levelUp: 'levelup.wav',
            gameOver: 'gameover.wav',
            pop: 'pop.wav'
        });
    }

    getBasePath() {
        // 获取当前脚本的URL
        const scripts = document.getElementsByTagName('script');
        const scriptPath = scripts[scripts.length - 1].src;
        // 返回到项目根目录
        return scriptPath.substring(0, scriptPath.lastIndexOf('/js/')) + '/audio/';
    }

    loadSounds(soundConfig) {
        Object.entries(soundConfig).forEach(([name, file]) => {
            try {
                const audio = new Audio(this.basePath + file);
                audio.preload = 'auto';
                this.sounds[name] = audio;
                
                // 添加加载错误处理
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load sound: ${file}`, e);
                });
            } catch (error) {
                console.warn(`Failed to create audio element for: ${file}`, error);
            }
        });
    }

    play(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        try {
            // 克隆音频节点以支持重叠播放
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = 0.6;
            
            // 添加播放错误处理
            sound.play().catch(error => {
                console.warn(`Audio playback failed for: ${soundName}`, error);
            });
        } catch (error) {
            console.warn(`Failed to play sound: ${soundName}`, error);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
} 