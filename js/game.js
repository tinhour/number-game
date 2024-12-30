class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 游戏状态
        this.score = 0;
        this.numbers = [];
        this.gameOver = false;
        
        // 数字配置
        this.numberConfig = {
            minSize: 30,
            maxSize: 50,
            speed: 0.5,
            spawnRate: 60, // 每60帧生成一个新数字
            frameCount: 0,
            canSpawn: true  // 是否可以生成新题目
        };
        
        // 简化烟花配置
        this.fireworkConfig = {
            colors: [
                '#ff4444', '#44ff44', '#4444ff',  // 明亮的红绿蓝
                '#ffff44', '#ff44ff', '#44ffff',  // 明亮的黄紫青
                '#ffaa44', '#44ffaa', '#ff44aa'   // 明亮的其他颜色
            ],
            particleCount: 12,     // 减少粒子数量
            gravity: 0.1,          // 增加重力效果使粒子更快消失
            friction: 0.96,        // 增加摩擦力
            initialSpeed: 8,       // 增加初始速度
            fadeSpeed: 0.03,       // 加快淡出速度
            glowSize: 2           // 减小发光大小
        };
        
        // 初始化烟花效果数组
        this.fireworks = [];
        
        // 修改关卡系统，添加最大关卡数
        this.level = {
            current: 1,
            maxLevel: 5,          // 添加最大关卡数
            questionsPerLevel: 10,
            remainingQuestions: 10,
            speed: 1,
            spawnRate: 60,
            halfScreenHeight: this.canvas.height / 2
        };
        
        // 修改数字配置，使用关卡参数
        this.numberConfig = {
            minSize: 30,
            maxSize: 50,
            speed: 0.5,  // 降低初始速度
            spawnRate: 60,
            frameCount: 0,
            canSpawn: true  // 是否可以生成新题目
        };
        
        // 修改过关烟花配置
        this.levelUpFireworkConfig = {
            ...this.fireworkConfig,
            particleCount: 24,
            initialSpeed: 12,
            glowSize: 3,
            waves: 5,              // 增加烟花波数
            duration: 2000,        // 过关动画持续时间
            interval: 200          // 烟花发射间隔
        };
        
        // 添加游戏状态
        this.isPaused = true;
        this.isRunning = false;
        this.isShowingLevelUp = false;  // 添加过关动画状态
        
        // 不要自动开始游戏循环
        this.showStartScreen();
        
        // 绑定事件
        this.bindEvents();  // 添加事件绑定调用
    }
    
    // 显示开始屏幕
    showStartScreen() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('数字消除游戏', this.canvas.width/2, this.canvas.height/2 - 50);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('点击"开始游戏"按钮开始', this.canvas.width/2, this.canvas.height/2 + 50);
    }
    
    // 开始游戏
    start() {
        this.restart();
        this.isPaused = false;
        this.isRunning = true;
        if (!this.gameLoopStarted) {
            this.gameLoopStarted = true;
            this.gameLoop();
        }
    }
    
    // 暂停游戏
    pause() {
        this.isPaused = true;
    }
    
    // 继续游戏
    resume() {
        this.isPaused = false;
    }
    
    // 生成新数字
    spawnNumber() {
        const size = Math.random() * (this.numberConfig.maxSize - this.numberConfig.minSize) + this.numberConfig.minSize;
        const x = Math.random() * (this.canvas.width - size * 3); // 增加宽度以适应题目
        
        // 生成加法题（结果在9��内）
        let num1, num2;
        do {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
        } while (num1 + num2 > 9);
        
        const number = {
            num1: num1,
            num2: num2,
            answer: num1 + num2,
            x: x,
            y: -size,
            size: size,
            speed: this.numberConfig.speed * (1 + Math.random()),
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
        this.numbers.push(number);
    }
    
    // 更新游戏状态
    update() {
        if (this.gameOver || this.isPaused || this.isShowingLevelUp) return;
        
        // 检查是否可以生成新题目
        this.numberConfig.canSpawn = this.numbers.length === 0 || 
            this.numbers.every(num => num.y > this.level.halfScreenHeight);
        
        // 只有在可以生成且还有剩余题目时才生成新题目
        if (this.numberConfig.canSpawn && this.level.remainingQuestions > 0) {
            this.spawnNumber();
            this.level.remainingQuestions--;
        }
        
        // 更新数字位置
        this.numbers.forEach(number => {
            number.y += number.speed;
        });
        
        // 检查游戏结束
        this.numbers = this.numbers.filter(number => {
            if (number.y > this.canvas.height) {
                this.gameOver = true;
                return false;
            }
            return true;
        });
        
        // 更新粒子效果
        if (this.effects) {
            this.effects = this.effects.filter(particles => {
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1; // 重力
                    p.life -= 0.02;
                    p.size *= 0.95;
                });
                
                // 移除消失的���子
                particles = particles.filter(p => p.life > 0);
                
                return particles.length > 0;
            });
        }
        
        // 更新烟花效果
        if (this.fireworks) {
            this.fireworks = this.fireworks.filter(firework => {
                firework.particles = firework.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += this.fireworkConfig.gravity;
                    particle.vx *= this.fireworkConfig.friction;
                    particle.vy *= this.fireworkConfig.friction;
                    particle.life -= this.fireworkConfig.fadeSpeed;
                    return particle.life > 0;
                });
                return firework.particles.length > 0;
            });
        }
    }
    
    // 绘制游戏
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制加法题
        this.numbers.forEach(number => {
            this.ctx.fillStyle = number.color;
            this.ctx.font = `bold ${number.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                `${number.num1} + ${number.num2} = ?`, 
                number.x + number.size * 1.5, 
                number.y + number.size/2
            );
        });
        
        // 绘制分数
        this.ctx.fillStyle = '#000';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 10, 30);
        
        // 游戏结束提示
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏结束', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`最终分数: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 50);
            this.ctx.fillText('点击屏幕重新开始', this.canvas.width/2, this.canvas.height/2 + 100);
        }
        
        // 绘制粒子效果
        if (this.effects) {
            this.effects.forEach(particles => {
                particles.forEach(p => {
                    this.ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                });
            });
        }
        
        // 简化烟花绘制
        if (this.fireworks) {
            this.fireworks.forEach(firework => {
                firework.particles.forEach(particle => {
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.life;
                    this.ctx.fillStyle = particle.color;
                    
                    // 简单的发光效果
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = 4;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            });
        }
        
        // 绘制关卡信息
        this.ctx.fillStyle = '#000';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`关卡: ${this.level.current}/${this.level.maxLevel}`, this.canvas.width - 10, 30);
        
        // 修改进度条显示逻辑
        const progress = (this.level.questionsPerLevel - this.level.remainingQuestions) / this.level.questionsPerLevel;
        const progressWidth = 200;
        const progressHeight = 20;
        const progressX = this.canvas.width - progressWidth - 10;
        const progressY = 40;
        
        // 进度条背景
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
        
        // 进度条填充
        this.ctx.fillStyle = `hsl(${120 * progress}, 70%, 50%)`;
        this.ctx.fillRect(progressX, progressY, progressWidth * Math.min(1, progress), progressHeight);
        
        // 添加数字比例显示
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(
            `${this.level.questionsPerLevel - this.level.remainingQuestions}/${this.level.questionsPerLevel}`,
            progressX + progressWidth + 10,
            progressY + 15
        );
        
        // 添加暂停状态显示
        if (this.isPaused && this.isRunning && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
        }
    }
    
    // 游戏循环
    gameLoop() {
        if (!this.isPaused && this.isRunning) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // 绑定事件
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) {
                return;  // 游戏结束时不响应键盘
            }
            
            if (e.key === 'Escape') {  // ESC键暂停/继续
                if (this.isPaused) {
                    this.resume();
                    document.getElementById('pauseBtn').textContent = '暂停';
                } else {
                    this.pause();
                    document.getElementById('pauseBtn').textContent = '继续';
                }
                return;
            }
            
            if (this.isPaused || !this.isRunning) {
                return;  // 暂停或未开始时不响应数字输入
            }
            
            // 修改数字键检测
            if (e.key >= '0' && e.key <= '9') {
                const number = parseInt(e.key);
                this.checkNumber(number);
            }
        });
        
        // 点击事件
        this.canvas.addEventListener('click', () => {
            if (this.gameOver) {
                this.restart();
            }
        });
    }
    
    // 检查数字匹配
    checkNumber(value) {
        // 找到所有答案匹配的题目
        const matches = this.numbers
            .map((number, index) => ({ ...number, index }))
            .filter(number => number.answer === value);
        
        // 如果有匹配的答案
        if (matches.length > 0) {
            // 按照 y 坐标从大到小排序（从下到上）
            matches.sort((a, b) => b.y - a.y);
            
            const match = matches[0];
            // 移除已解答的题目
            this.numbers.splice(match.index, 1);
            
            // 添加消除效果
            this.addPopEffect(match.x, match.y, match.size);
            
            // 替换表扬效果为烟花
            this.addFirework(
                match.x + match.size * 1.5,
                match.y + match.size/2
            );
            
            // 增加分数
            this.score += 10;
            
            // 检��关卡���度
            this.checkLevelProgress();
        }
    }
    
    // 添加消除效果
    addPopEffect(x, y, size) {
        // 创建粒子效果
        const particles = [];
        const particleCount = 8;
        const colors = ['#ff0', '#f0f', '#0ff', '#0f0'];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            particles.push({
                x: x + size/2,
                y: y + size/2,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                size: 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }
        
        // 添加到效果列表
        if (!this.effects) {
            this.effects = [];
        }
        this.effects.push(particles);
    }
    
    // 简化烟花生成
    addFirework(x, y) {
        const particles = [];
        const color = this.fireworkConfig.colors[
            Math.floor(Math.random() * this.fireworkConfig.colors.length)
        ];
        
        // 只生成一波烟花
        for (let i = 0; i < this.fireworkConfig.particleCount; i++) {
            const angle = (Math.PI * 2 * i) / this.fireworkConfig.particleCount;
            const speed = this.fireworkConfig.initialSpeed * (0.8 + Math.random() * 0.4);
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2,
                color: color,
                life: 1
            });
        }
        
        this.fireworks.push({ particles });
    }
    
    // 重新开始游戏
    restart() {
        this.score = 0;
        this.numbers = [];
        this.gameOver = false;
        this.numberConfig.frameCount = 0;
        this.effects = [];
        this.fireworks = [];  // 清除烟花效果
        this.level.current = 1;
        this.level.questionsPerLevel = 10;
        this.level.remainingQuestions = 10;
        this.numberConfig.speed = 0.5;
        this.numberConfig.canSpawn = true;
        this.isPaused = false;
        this.isRunning = true;
    }
    
    // 检查关卡进度
    checkLevelProgress() {
        // 当前关卡所有题目都完成且屏幕上没有剩余题目时进入下一关
        if (this.level.remainingQuestions === 0 && 
            this.numbers.length === 0 && 
            this.level.current < this.level.maxLevel) {
            this.levelUp();
        }
    }
    
    // 升级关卡
    levelUp() {
        this.level.current++;
        
        // 更新当前关卡的题目数量
        this.level.questionsPerLevel = this.level.current * 10;
        this.level.remainingQuestions = this.level.questionsPerLevel;
        
        // 增加游戏难度 - 每关增加20%的速度
        this.numberConfig.speed = 0.5 * (1 + (this.level.current - 1) * 0.2);
        
        // 显示过关效果
        this.showLevelUpEffects();
    }
    
    // 显示过关效果
    showLevelUpEffects() {
        this.isShowingLevelUp = true;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 显示过关文字
        const levelUpText = this.level.current === this.level.maxLevel ? 
            '恭喜你通关了！' : 
            `第 ${this.level.current} 关通过！`;
        
        // 创建文字动画效果
        const drawLevelUpText = () => {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制主标题（添加发光效果）
            this.ctx.fillStyle = '#FFD700';
            this.ctx.shadowColor = '#FFA500';
            this.ctx.shadowBlur = 20;
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(levelUpText, centerX, centerY - 50);
            
            if (this.level.current === this.level.maxLevel) {
                this.ctx.fillStyle = '#FF69B4';
                this.ctx.shadowColor = '#FF1493';
                this.ctx.font = '32px Arial';
                this.ctx.fillText('你太厉害了！', centerX, centerY + 20);
                this.ctx.fillText('完美通关！', centerX, centerY + 70);
            }
            this.ctx.restore();
        };
        
        // 创建连续的烟花效果
        const createFireworks = () => {
            // 随机位置生成烟花
            const x = centerX - 300 + Math.random() * 600;
            const y = centerY - 150 + Math.random() * 300;
            this.addLevelUpFirework(x, y);
        };
        
        // 立即开始绘制文字
        const textInterval = setInterval(drawLevelUpText, 16);
        
        // 持续3秒的烟花表演
        const fireworkInterval = setInterval(createFireworks, 100); // 每100ms发射一个烟花
        
        // 3秒后结束动画
        setTimeout(() => {
            clearInterval(textInterval);
            clearInterval(fireworkInterval);
            
            // 动画结束后继续游戏
            setTimeout(() => {
                this.isShowingLevelUp = false;
                if (this.level.current < this.level.maxLevel) {
                    this.numberConfig.canSpawn = true;
                } else {
                    this.showGameComplete();
                }
            }, 500);
        }, 3000);
    }
    
    // 修��过关烟��效果
    addLevelUpFirework(x, y) {
        const particles = [];
        const colors = [
            '#FFD700', // 金色
            '#FF69B4', // 粉色
            '#FF4500', // 橙红色
            '#00FF00', // 亮绿色
            '#1E90FF', // 道奇蓝
            '#FF00FF'  // 洋红色
        ];
        
        // 增加粒子数量和大小
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            // 随机速度和大小
            const speed = 8 + Math.random() * 4;
            const size = 2 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 1,
                gravity: 0.1,
                friction: 0.98
            });
        }
        
        // 添加一些小型粒子
        for (let i = 0; i < particleCount/2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random(),
                color: color,
                life: 1,
                gravity: 0.05,
                friction: 0.99
            });
        }
        
        this.fireworks.push({ particles });
    }
    
    // 添加游戏通关画面
    showGameComplete() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 64px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#FFA500';
        this.ctx.shadowBlur = 15;
        this.ctx.fillText('恭喜通关！', centerX, centerY - 50);
        
        this.ctx.font = '32px Arial';
        this.ctx.fillStyle = '#FF69B4';
        this.ctx.fillText(`最终得分: ${this.score}`, centerX, centerY + 30);
        this.ctx.fillText('点击"重新开始"按钮重玩', centerX, centerY + 80);
    }
} 