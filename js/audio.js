class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        
        // 预加载音效
        this.loadSounds({
            hit: 'hit.wav',
            levelUp: 'levelup.wav',
            gameOver: 'gameover.wav',
            pop: 'pop.wav'
        });
    }

    getAudioPath(filename) {
        // 检查是否在 GitHub Pages 环境
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // GitHub Pages 环境
            const repoName = window.location.pathname.split('/')[1];
            return `/${repoName}/audio/${filename}`;
        } else {
            // 本地环境
            return `./audio/${filename}`;
        }
    }

    loadSounds(soundConfig) {
        Object.entries(soundConfig).forEach(([name, file]) => {
            try {
                const audioPath = this.getAudioPath(file);
                const audio = new Audio(audioPath);
                audio.preload = 'auto';
                this.sounds[name] = audio;
                
                // 添加加载错误处理
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load sound: ${file} from path: ${audioPath}`, e);
                });

                // 添加加载成功处理
                audio.addEventListener('canplaythrough', () => {
                    console.log(`Sound loaded successfully: ${file}`);
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