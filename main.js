// 核心配置：w 权重 (用户不可见)
        const students = [
            {n: "吴子君", w: 1}, {n: "赵妍", w: 1}, {n: "唐粲", w: 1},
            {n: "马娅菲", w: 1}, {n: "谢佳成", w: 1}, {n: "张煜", w: 1},
            {n: "黎馨迪", w: 1}, {n: "包雨轩", w: 1}, {n: "袁懿轩", w: 1},
            {n: "罗羽菡", w: 1}, {n: "赵思琪", w: 1}, {n: "吴泽昌", w: 1},
            {n: "邓智中", w: 1}, {n: "何欣儿", w: 1}, {n: "张景越", w: 1},
            {n: "宁俊翔", w: 1.5}, {n: "徐梓轩", w: 1}, {n: "罗子涵", w: 1},
            {n: "叶梓萱", w: 1}, {n: "丁靖轩", w: 1}, {n: "邓恩琦", w: 1},
            {n: "蒲奕豪", w: 1}, {n: "张恒瑞", w: 1}, {n: "吴屹涵", w: 1},
            {n: "廖俊瑄", w: 1}, {n: "黄梓琪", w: 1}, {n: "段泓宇", w: 1},
            {n: "张桠霏", w: 1}, {n: "魏子为", w: 1}, {n: "廖玮峰", w: 1},
            {n: "吴桐", w: 1}, {n: "廖惜琳", w: 1}, {n: "唐一为", w: 1},
            {n: "叶枝繁", w: 1}, {n: "石浠彤", w: 1}, {n: "刘子逸", w: 1},
            {n: "汤玉一", w: 1}, {n: "钟佳妮", w: 1}, {n: "薛梓妍", w: 1},
            {n: "陈志铭", w: 1}, {n: "刘凯", w: 1}, {n: "刘雅桐", w: 1},
            {n: "徐浩然", w: 1}, {n: "黄鹏翰", w: 1}, {n: "刘川沪", w: 1},
            {n: "孙倬成", w: 1}, {n: "赵若帆", w: 1}, {n: "丁莟雅", w: 1},
            {n: "刘浩冉", w: 1}, {n: "毛颢憬", w: 1}, {n: "吴宇桐", w: 1},
            {n: "郑淇友", w: 1}, {n: "钱诚", w: 1}
        ];

        // 状态管理
        let isRolling = false;
        let rollInterval = null;
        let callCount = 0;
        let nameCounters = {}; // 记录每个名字被点到的次数
        
        // DOM元素
        const display = document.getElementById('name-display');
        const startBtn = document.getElementById('start-btn');
        const historyRow = document.getElementById('history-row');
        const memberList = document.getElementById('member-list');
        const memberTotal = document.getElementById('member-total');
        const totalCountEl = document.getElementById('total-count');
        const calledCountEl = document.getElementById('called-count');
        const particles = document.getElementById('particles');

        // 初始化计数器
        students.forEach(s => {
            nameCounters[s.n] = 0;
        });

        // 创建随机粒子背景
        function createParticles() {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // 随机大小和位置
                const size = 1 + Math.random() * 5;
                const left = Math.random() * 100;
                const delay = Math.random() * 20;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${left}%`;
                particle.style.animationDelay = `${delay}s`;
                
                particles.appendChild(particle);
            }
        }

        // 初始化页面
        function init() {
            // 创建粒子背景
            createParticles();
            
            // 更新总数显示
            const total = students.length;
            memberTotal.textContent = total;
            totalCountEl.textContent = total;
            calledCountEl.textContent = callCount;

            // 渲染成员列表
            students.forEach(s => {
                const item = document.createElement('div');
                item.className = "name-item flex justify-between items-center text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-white/15 transition-colors cursor-default py-3 px-4";
                item.innerHTML = `
                    <span>${s.n}</span>
                    <span class="count-badge bg-white/30 text-xs px-2 py-0.5 rounded-full text-slate-500">0</span>
                `;
                item.dataset.name = s.n;
                memberList.appendChild(item);
            });
        }

        // 根据权重随机选择名字
        function getWeighted() {
            const total = students.reduce((a, b) => a + b.w, 0);
            let r = Math.random() * total;
            for (let s of students) {
                if (r < s.w) return s.n;
                r -= s.w;
            }
            return students[0].n;
        }

        // 开始高速滚动点名
        function roll() {
            if (isRolling) return;
            
            // 更新状态
            isRolling = true;
            startBtn.disabled = true;
            startBtn.innerHTML = `
                <i class="fa fa-spinner fa-spin mr-2"></i>
                抽取中...
            `;
            
            // 高速配置：大幅缩短时长和加快初始速度
            let speed = 15; // 初始速度从40ms降至15ms（快2.7倍）
            const duration = 1200; // 总时长从3500ms降至1200ms（快2.9倍）
            const start = Date.now();

            // 高速滚动动画函数
            const step = () => {
                const elapsed = Date.now() - start;
                const randomName = students[Math.floor(Math.random() * students.length)].n;
                
                // 更新显示并添加雾化效果
                display.innerText = randomName;
                
                // 随机调整模糊度和透明度，模拟雾中效果
                const blurAmount = 0.5 + Math.random() * 2;
                const opacity = 0.7 + Math.random() * 0.3;
                display.style.filter = `blur(${blurAmount}px)`;
                display.style.opacity = opacity.toString();

                // 快速减速
                if (elapsed < duration) {
                    const progress = elapsed / duration;
                    const nextDelay = speed + Math.pow(progress, 2) * 200; // 减速幅度减小
                    rollInterval = setTimeout(step, nextDelay);
                } else {
                    // 停止滚动，显示结果
                    clearTimeout(rollInterval);
                    finalize();
                }
            };
            
            // 启动高速滚动
            step();
        }

        // 结束滚动，显示最终结果
        function finalize() {
            // 恢复按钮状态
            isRolling = false;
            startBtn.disabled = false;
            startBtn.innerHTML = `
                开始抽取
                <i class="fa fa-snowflake-o" style="animation: spin 10s linear infinite;"></i>
            `;

            // 获取最终结果
            const result = getWeighted();
            
            // 清除雾化效果，添加揭晓动画
            display.innerText = result;
            display.style.opacity = "1";
            display.style.filter = "blur(0)";
            
            // 更快的结果揭晓动画
            display.animate([
                { filter: 'blur(15px)', opacity: 0, transform: 'scale(1.2)' },
                { filter: 'blur(0px)', opacity: 1, transform: 'scale(1)' }
            ], { 
                duration: 400, // 动画时长从800ms减半
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)' 
            });

            // 更新计数
            callCount++;
            calledCountEl.textContent = callCount;
            nameCounters[result]++;
            
            // 更新名单中的计数显示
            updateNameCounter(result);
            
            // 添加到历史记录
            addToHistory(result);
        }

        // 更新名字计数显示
        function updateNameCounter(name) {
            const items = document.querySelectorAll(`[data-name="${name}"]`);
            items.forEach(item => {
                const badge = item.querySelector('.count-badge');
                if (badge) {
                    badge.textContent = nameCounters[name];
                    // 计数变化动画
                    badge.classList.add('bg-indigo-100', 'text-indigo-600', 'scale-110');
                    setTimeout(() => {
                        badge.classList.remove('scale-110');
                    }, 300);
                    setTimeout(() => {
                        badge.classList.remove('bg-indigo-100', 'text-indigo-600');
                        badge.classList.add('bg-white/30', 'text-slate-500');
                    }, 600);
                }
            });
        }

        // 添加到历史记录
        function addToHistory(name) {
            const badge = document.createElement('div');
            badge.className = "history-chip shrink-0 px-4 py-2.5 rounded-lg text-sm font-bold text-indigo-500 shadow-sm";
            
            // 添加时间戳
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            badge.innerHTML = `
                <div>${name}</div>
                <div class="text-[9px] text-slate-400 mt-0.5">${time}</div>
            `;
            
            // 添加到历史行开头
            historyRow.prepend(badge);
            
            // 限制历史记录数量
            const maxHistory = 8;
            const historyItems = historyRow.querySelectorAll('.history-chip');
            if (historyItems.length > maxHistory) {
                historyItems[historyItems.length - 1].remove();
            }
        }

        // 视差效果：让雾气容器随鼠标移动
        function handleParallax(e) {
            const stage = document.getElementById('stage');
            const x = (e.clientX / window.innerWidth - 0.5) * 12;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            stage.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${-y/4}deg) rotateY(${x/4}deg)`;
        }

        // 事件监听
        startBtn.addEventListener('click', roll);
        window.addEventListener('keydown', e => {
            if (e.code === 'Space' && !isRolling) {
                e.preventDefault();
                roll();
            }
        });
        window.addEventListener('mousemove', handleParallax);
        
        // 初始化
        window.addEventListener('load', init);