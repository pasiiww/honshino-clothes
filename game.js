// 游戏初始化
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    resizeTo: window
});
document.getElementById('gameContainer').appendChild(app.view);

// 创建图层容器
const layers = {
    background: new PIXI.Container(),
    foreground: new PIXI.Container(),
    hair: new PIXI.Container(),
    body: new PIXI.Container(),
    clothes: new PIXI.Container()
};

// 创建主容器统一管理缩放
const mainContainer = new PIXI.Container();
app.stage.addChild(mainContainer);

// 添加图层到主容器（顺序很重要）
mainContainer.addChild(layers.background);
mainContainer.addChild(layers.hair);
mainContainer.addChild(layers.body);
mainContainer.addChild(layers.clothes);
mainContainer.addChild(layers.foreground);



// 资源加载
const resources = {
    body:[
        'images/body/开心表情+白裤袜.png',
        'images/body/普通表情+白小腿袜.png',
        'images/body/普通表情+裸腿.png',
        'images/body/普通表情+过膝白丝.png',
        'images/body/普通表情+黑裤袜.png',
        'images/body/普通表情+黑过膝.png',
        'images/body/生气表情+白小腿袜.png'
    ],
    hair: [
        'images/hair/双马尾.png',
        'images/hair/披发.png',
        'images/hair/短发.png',
        'images/hair/高马尾.png'
    ],
    clothes: [
        'images/clothes/体操服.png',
        'images/clothes/公式服.png',
        'images/clothes/女仆装.png',
        'images/clothes/泳衣.png',
        'images/clothes/鲸鱼服装.png'
    ]
};

// 当前选中的资源索引
const currentSelection = {
    clothes: 0,
    body: 0,
    hair: 0
};

// 统一缩放比例和动态定位
// 移除固定像素偏移，使用动态定位
let originalWidth, originalHeight;
let currentScale = 1;
const headerRatio = 0.1; // 降低头部比例使角色上移


// 加载并显示初始资源
async function loadInitialResources() {
    try {
        const bodyTexture_ = await PIXI.Texture.fromURL(resources.body[0]);
        originalWidth = bodyTexture_.width;
        originalHeight = bodyTexture_.height;
    } catch (error) {
        console.error('Failed to load initial texture:', error);
        // 设置默认尺寸防止缩放异常
        originalWidth = 800;
        originalHeight = 1200;
    }
    // 初始化计算缩放比例
    const targetWidth = window.innerWidth * 0.9;
    const targetHeight = window.innerHeight * 0.8;
    console.log('Initial target dimensions:', targetWidth, targetHeight);
    const scaleX = targetWidth / originalWidth;
    const scaleY = targetHeight / originalHeight;
    currentScale = Math.min(scaleX, scaleY);
    mainContainer.scale.set(currentScale);
    // 设置主容器位置和 pivot 以确保居中
    const bounds = mainContainer.getBounds();
    mainContainer.pivot.set(bounds.width / 2, 0);
    mainContainer.position.set(app.screen.width / 2, 0);
    
    // 加载压缩后的背景图
    try {
        console.log('Loading compressed background texture: images/background/背景.png');
        const bgTexture = await PIXI.Texture.fromURL('images/background/背景.png');
        const bgSprite = new PIXI.Sprite(bgTexture);
        bgSprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        bgSprite.position.set(0, 0);
        bgSprite.scale.set(1); // 使用压缩后的原始大小
        layers.background.addChild(bgSprite);
        console.log('Compressed background sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load compressed background texture:', error);
        // 如果压缩图片加载失败，使用原始图片
        try {
            const bgTexture = await PIXI.Texture.fromURL('images/background/背景.png');
            const bgSprite = new PIXI.Sprite(bgTexture);
            bgSprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        bgSprite.position.set(0, 0);
        bgSprite.scale.set(0.5);
            layers.background.addChild(bgSprite);
        } catch (fallbackError) {
            console.error('Failed to load fallback background texture:', fallbackError);
        }
    }

    // 加载压缩后的前景图1
    try {
        console.log('Loading compressed foreground1 texture: images/background/前景.png');
        const fg1Texture = await PIXI.Texture.fromURL('images/background/前景.png');
        const fg1Sprite = new PIXI.Sprite(fg1Texture);
        fg1Sprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        fg1Sprite.position.set(0, 0);
        fg1Sprite.scale.set(1); // 使用压缩后的原始大小
        layers.foreground.addChild(fg1Sprite);
        console.log('Compressed foreground1 sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load compressed foreground1 texture:', error);
        // 如果压缩图片加载失败，使用原始图片
        try {
            const fg1Texture = await PIXI.Texture.fromURL('images/background/前景.png');
            const fg1Sprite = new PIXI.Sprite(fg1Texture);
            fg1Sprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        fg1Sprite.position.set(0, 0);
        fg1Sprite.scale.set(0.5);
            layers.foreground.addChild(fg1Sprite);
        } catch (fallbackError) {
            console.error('Failed to load fallback foreground1 texture:', fallbackError);
        }
    }

    // 加载压缩后的前景图2
    try {
        console.log('Loading compressed foreground2 texture: images/background/前景2.png');
        const fg2Texture = await PIXI.Texture.fromURL('images/background/前景2.png');
        const fg2Sprite = new PIXI.Sprite(fg2Texture);
        fg2Sprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        fg2Sprite.position.set(0, 0);
        fg2Sprite.scale.set(1); // 使用压缩后的原始大小
        layers.foreground.addChild(fg2Sprite);
        console.log('Compressed foreground2 sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load compressed foreground2 texture:', error);
        // 如果压缩图片加载失败，使用原始图片
        try {
            const fg2Texture = await PIXI.Texture.fromURL('images/background/前景2.png');
            const fg2Sprite = new PIXI.Sprite(fg2Texture);
            fg2Sprite.anchor.set(0.5, 0); // 底部居中锚点，与角色对齐
        fg2Sprite.position.set(0, 0);
        fg2Sprite.scale.set(0.5);
            layers.foreground.addChild(fg2Sprite);
        } catch (fallbackError) {
            console.error('Failed to load fallback foreground2 texture:', fallbackError);
        }
    }

    // 加载身体
    try {
        console.log('Loading body texture:', resources.body[0]);
        const bodyTexture = await PIXI.Texture.fromURL(resources.body[0]);
        const bodySprite = new PIXI.Sprite(bodyTexture);
        bodySprite.anchor.set(0.5, 0);
        bodySprite.position.set(0, 0);
        bodySprite.scale.set(1);
        layers.body.addChild(bodySprite);
        console.log('Body sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load body texture:', error);
        // 创建红色占位矩形作为 fallback
        const fallback = new PIXI.Graphics();
        fallback.beginFill(0xff0000);
        fallback.drawRect(-100, -200, 200, 400); // 增大 fallback 尺寸
        fallback.endFill();
        layers.body.addChild(fallback);
        console.log('Body fallback added, mainContainer scale:', mainContainer.scale.x);
    }

    // 加载头发
    try {
        console.log('Loading hair texture:', resources.hair[0]);
        const hairTexture = await PIXI.Texture.fromURL(resources.hair[0]);
        const hairSprite = new PIXI.Sprite(hairTexture);
        hairSprite.anchor.set(0.5, 0);
        hairSprite.position.set(0, 0);
        hairSprite.scale.set(1);
        layers.hair.addChild(hairSprite);
        console.log('Hair sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load hair texture:', error);
        // 创建绿色占位矩形作为 fallback
        const fallback = new PIXI.Graphics();
        fallback.beginFill(0x00ff00);
        fallback.drawRect(-100, -200, 200, 400); // 增大 fallback 尺寸
        fallback.endFill();
        layers.hair.addChild(fallback);
        console.log('Hair fallback added, mainContainer position:', mainContainer.position);
    }

    // 加载衣服
    try {
        console.log('Loading clothes texture:', resources.clothes[0]);
        const clothesTexture = await PIXI.Texture.fromURL(resources.clothes[0]);
        const clothesSprite = new PIXI.Sprite(clothesTexture);
        clothesSprite.anchor.set(0.5, 0);
        clothesSprite.position.set(0, 0);
        clothesSprite.scale.set(1);
        layers.clothes.addChild(clothesSprite);
        console.log('Clothes sprite loaded successfully');
    } catch (error) {
        console.error('Failed to load clothes texture:', error);
        // 创建蓝色占位矩形作为 fallback
        const fallback = new PIXI.Graphics();
        fallback.beginFill(0x0000ff);
        fallback.drawRect(-100, -200, 200, 400); // 增大 fallback 尺寸
        fallback.endFill();
        layers.clothes.addChild(fallback);
        console.log('Clothes fallback added, mainContainer pivot:', mainContainer.pivot);
    }

 

    // 更新控制面板预览图
    updateControlPanelPreviews();
}

// 读取DLC文件内容并构建DLC项目列表
function getDLCItems() {
    // 使用预定义的DLC列表，匹配dlc.text文件内容
    return [
        './hair/短发.png',
        './clothes/鲸鱼服装.png',
        './clothes/女仆装.png',
        './body/普通表情+黑过膝.png',
        './body/生气表情+白小腿袜.png',
        './body/开心表情+白裤袜.png'
    ];
}

// 动态生成控制面板项目
function generateControlPanels() {
    const panels = ['body', 'clothes', 'hair'];
    const dlcItems = getDLCItems();
    
    panels.forEach(type => {
        const inner = document.querySelector(`#${type}Panel .panel-inner`);
        const count = resources[type].length;
        
        // 清空现有内容
        inner.innerHTML = '';
        
        // 生成三倍项目用于无限滚动（前中后各一份）
        for (let copy = 0; copy < 3; copy++) {
            for (let i = 0; i < count; i++) {
                const item = document.createElement('div');
                const resourcePath = resources[type][i];
                
                // 检查是否为DLC项目
                const isDLC = dlcItems.some(dlcPath => resourcePath.includes(dlcPath.split('/').pop()));
                
                item.className = 'control-item';
                if (isDLC) {
                    item.classList.add('dlc-item');
                }
                item.dataset.type = type;
                item.dataset.index = i;
                item.style.backgroundImage = `url(${resourcePath})`;
                
                // 如果是DLC项目，添加DLC标注
                if (isDLC) {
                    const dlcLabel = document.createElement('span');
                    dlcLabel.className = 'dlc-label';
                    dlcLabel.textContent = 'DLC';
                    item.appendChild(dlcLabel);
                }
                
                inner.appendChild(item);
            }
        }
    });
}

// 更新控制面板预览图
async function updateControlPanelPreviews() {
    generateControlPanels();
    // 设置默认中间选中项
    setDefaultMiddleSelection();
}

// 设置默认选中中间项
function setDefaultMiddleSelection() {
    const panels = ['body', 'clothes', 'hair'];
    panels.forEach(type => {
        const count = resources[type].length;
        if (count === 0) return;
        const middleIndex = Math.floor((count - 1) / 2);
        const itemWidth = 60 + 16; // 更新为新的控制项尺寸：60px + 16px间距
        
        // 更新当前选择
        currentSelection[type] = middleIndex;
        
        // 滚动到中间区域（第二份）的对应位置
        const panelInner = document.querySelector(`#${type}Panel .panel-inner`);
        const scrollPosition = count * itemWidth + middleIndex * itemWidth; // 中间区域
        panelInner.scrollLeft = scrollPosition;
        
        // 更新选中状态
        const items = document.querySelectorAll(`.control-item[data-type="${type}"]`);
        items.forEach((item, index) => {
            const actualIndex = index % count;
            item.classList.toggle('active', actualIndex === middleIndex);
        });
        
        // 触发加载中间项资源
        loadSelectedResource(type, middleIndex);
    });
}

// 初始化无限滚动
initInfiniteScroll();

// 加载选中的资源
// 添加全局变量跟踪是否穿着鲸鱼服装
let isWearingWhaleClothes = false;

async function loadSelectedResource(type, index) {
    layers[type].removeChildren();
    
    try {
        const texture = await PIXI.Texture.fromURL(resources[type][index]);
        const sprite = new PIXI.Sprite(texture);
        
        // 计算缩放比例，确保图片完全显示
        const imgAspect = texture.width / texture.height;
        const maxWidth = 400; // 最大宽度限制
        const maxHeight = 600; // 最大高度限制
        
        let scale = 1;
        if (texture.width > maxWidth || texture.height > maxHeight) {
            const scaleX = maxWidth / texture.width;
            const scaleY = maxHeight / texture.height;
            scale = Math.min(scaleX, scaleY);
        }
        
        sprite.anchor.set(0.5, 0);
        sprite.position.set(0, 0);
        sprite.scale.set(scale);
        layers[type].addChild(sprite);
        
        // 检查是否是鲸鱼服装，如果是则隐藏头发
        if (type === 'clothes') {
            isWearingWhaleClothes = resources.clothes[index].includes('鲸鱼服装.png');
            if (layers.hair) {
                layers.hair.visible = !isWearingWhaleClothes;
            }
        } else if (type === 'hair') {
            // 加载头发时也检查当前服装状态
            if (layers.hair) {
                layers.hair.visible = !isWearingWhaleClothes;
            }
        }
    } catch (error) {
        console.error(`Failed to load ${type} resource at index ${index}:`, error);
    }
}

// 添加控制面板事件监听（使用事件委托处理动态生成的项目）
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('control-item')) {
        const type = e.target.dataset.type;
        const clickedIndex = parseInt(e.target.dataset.index);
        const originalCount = resources[type].length;
        currentSelection[type] = clickedIndex;

        // 移除同类型所有active状态
        document.querySelectorAll(`.control-item[data-type="${type}"]`).forEach(el => 
            el.classList.remove('active')
        );
        
        // 添加当前active状态（使用模运算确保所有副本都高亮）
        document.querySelectorAll(`.control-item[data-type="${type}"]`).forEach((el, idx) => {
            const actualIndex = idx % originalCount;
            if (actualIndex === clickedIndex) {
                el.classList.add('active');
            }
        });
        
        // 滚动到选中项（居中显示）
        const panelInner = e.target.closest('.panel-inner');
        const panel = panelInner.closest('.control-panel');
        const itemWidth = 60 + 16; // 更新为新的控制项尺寸：60px + 16px间距
        const totalWidth = originalCount * itemWidth;
        const currentPos = panelInner.scrollLeft;
        
        // 计算居中的滚动位置（考虑面板容器的中心）
        const panelWidth = panel.offsetWidth;
        const centeredPos = clickedIndex * itemWidth + (itemWidth / 2) - (panelWidth / 2);
        
        // 找到所有可能的居中位置（前中后三个区域）
        const positions = [
            centeredPos + totalWidth,  // 中间区域居中
            centeredPos,                 // 前面区域居中
            centeredPos + totalWidth * 2  // 后面区域居中
        ];
        
        // 选择距离当前位置最近的居中位置（最短距离滚动）
        const distances = positions.map(pos => Math.abs(pos - currentPos));
        const nearestPos = positions[distances.indexOf(Math.min(...distances))];
        
        panelInner.scrollTo({ left: nearestPos, behavior: 'smooth' });
        
        // 调用loadSelectedResource函数加载资源，确保鲸鱼服装逻辑执行
        loadSelectedResource(type, clickedIndex);
    }
});

// 随机搭配功能
function randomDressUp() {
    const types = ['body', 'clothes', 'hair'];
    
    types.forEach(type => {
        const count = resources[type].length;
        if (count > 0) {
            const randomIndex = Math.floor(Math.random() * count);
            currentSelection[type] = randomIndex;
            loadSelectedResource(type, randomIndex);
            
            // 更新UI选中状态
            const items = document.querySelectorAll(`.control-item[data-type="${type}"]`);
            items.forEach((item, idx) => {
                const actualIndex = idx % count;
                item.classList.toggle('active', actualIndex === randomIndex);
            });
            
            // 滚动到选中项（最短距离滚动到中间）
            const panelInner = document.querySelector(`#${type}Panel .panel-inner`);
            const itemWidth = 60 + 16; // 60px宽度 + 左右各8px margin = 76px总宽度
            const totalWidth = count * itemWidth;
            const centeredPos = randomIndex * itemWidth + (itemWidth / 2) - (panelInner.offsetWidth / 2);
            const positions = [
                centeredPos + totalWidth,
                centeredPos,
                centeredPos + totalWidth * 2
            ];
            const distances = positions.map(pos => Math.abs(pos - panelInner.scrollLeft));
            const nearestPos = positions[distances.indexOf(Math.min(...distances))];
            panelInner.scrollTo({ left: nearestPos, behavior: 'smooth' });
        }
    });
    
    // 添加按钮动画效果
    const btn = document.getElementById('randomBtn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 150);
}

// 添加随机按钮事件监听
document.addEventListener('DOMContentLoaded', () => {
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', randomDressUp);
    }
});

// 初始化游戏
loadInitialResources();

// 窗口大小调整处理
window.addEventListener('resize', () => {
    if (originalWidth && originalHeight) {
        // 计算主容器的缩放比例以适应屏幕
        const targetWidth = app.screen.width * 0.9;
        const targetHeight = app.screen.height * 0.8;
        
        // 找到最大的适合比例
        const scaleX = targetWidth / originalWidth;
        const scaleY = targetHeight / originalHeight;
        const currentScale = Math.min(scaleX, scaleY);
        
        console.log('Resize target dimensions:', targetWidth, targetHeight, 'currentScale:', currentScale);
        
        // 应用缩放并居中主容器
        mainContainer.scale.set(currentScale);
        const bounds = mainContainer.getBounds();
        mainContainer.pivot.set(bounds.width / 2, 0);
        mainContainer.position.set(app.screen.width / 2, 0);
    }
});
// 初始化无限滚动 - 最终优化版本
function initInfiniteScroll() {
    const panels = ['body', 'clothes', 'hair'];
    panels.forEach(type => {
        const panel = document.getElementById(`${type}Panel`);
        const inner = panel.querySelector('.panel-inner');
        const itemWidth = 60 + 16; // 更新为新的控制项尺寸：60px + 16px间距
        const originalCount = resources[type].length;
        let isDragging = false;
        let startX;
        let scrollLeft;

        // 设置初始滚动位置到中间区域的中部，确保左右都有足够空间
        const middleSectionCenter = originalCount * itemWidth + Math.floor(originalCount / 2) * itemWidth;
        inner.scrollLeft = middleSectionCenter;

        // 获取实际索引对应的滚动位置（始终保持在中间区域）
        function getScrollPositionForIndex(index) {
            const totalWidth = originalCount * itemWidth;
            return totalWidth + index * itemWidth; // 始终返回中间区域的位置
        }

        // 平滑重置到中间区域（仅用于初始化）
        function resetToMiddleSection() {
            const totalWidth = originalCount * itemWidth;
            // 始终定位到中间区域的开始位置
            inner.scrollLeft = totalWidth;
        }

        // 滚动事件监听 - 修复无限滚动边界问题
        inner.addEventListener('scroll', () => {
            const totalWidth = originalCount * itemWidth;
            const currentPos = inner.scrollLeft;
            
            // 更精确的边界判断，确保在可见区域内触发滚动循环
            // 优化边界条件，增加缓冲区防止频繁触发
            if (currentPos >= totalWidth * 2 - itemWidth * 2) {  // 右侧边界留2个item缓冲
                requestAnimationFrame(() => {
                    inner.scrollLeft = currentPos - totalWidth;
                });
            } else if (currentPos <= totalWidth) {  // 当滚动到第一份内容区域时（包含边界）
                requestAnimationFrame(() => {
                    inner.scrollLeft = currentPos + totalWidth;
                });
            }
        });

        // 鼠标拖动功能
        panel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - panel.offsetLeft;
            scrollLeft = inner.scrollLeft;
            panel.style.cursor = 'grabbing';
        });

        panel.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                handleDragEnd();
            }
            panel.style.cursor = 'grab';
        });

        panel.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handleDragEnd();
            }
            panel.style.cursor = 'grab';
        });

        function handleDragEnd() {
            const currentPos = inner.scrollLeft;
            const totalWidth = originalCount * itemWidth;
            const itemIndex = Math.round(currentPos / itemWidth);
            
            // 计算实际索引
            const actualIndex = ((itemIndex % originalCount) + originalCount) % originalCount;
            
            if (actualIndex >= 0 && actualIndex < originalCount) {
                // 计算居中的滚动位置（考虑面板容器的中心）
                // 使用clientWidth获取实际可见宽度，排除边框和滚动条
                // 使用容器宽度而非面板宽度计算居中
                // 获取容器宽度并排除内边距影响
                // 使用getBoundingClientRect获取更精确的容器宽度
                // 获取容器宽度并排除内边距
                const container = panel.querySelector('.panel-container');
                const containerStyle = getComputedStyle(container);
                const containerRect = container.getBoundingClientRect();
                const containerPadding = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
                const containerWidth = containerRect.width - containerPadding;
                // 计算item总宽度（包含margin）
                const itemTotalWidth = 76; // 明确设置包含margin的总宽度
                // 精确计算居中位置，考虑所有视觉因素
                const centeredPos = actualIndex * itemWidth + (itemWidth / 2) - (containerWidth / 2);
                
                // 找到所有可能的居中位置（前中后三个区域）
                const positions = [
                    centeredPos + totalWidth,  // 中间区域居中
                    centeredPos,                 // 前面区域居中
                    centeredPos + totalWidth * 2  // 后面区域居中
                ];
                
                // 选择距离当前位置最近的居中位置（最短距离滚动）
                const distances = positions.map(pos => Math.abs(pos - currentPos));
                const nearestPos = positions[distances.indexOf(Math.min(...distances))];
                
                inner.scrollTo({ left: nearestPos, behavior: 'smooth' });
                
                // 更新选中状态
                const items = document.querySelectorAll(`.control-item[data-type="${type}"]`);
                items.forEach((item, idx) => {
                    const idxInOriginal = idx % originalCount;
                    item.classList.toggle('active', idxInOriginal === actualIndex);
                });
                
                // 更新当前选择
                currentSelection[type] = actualIndex;
                loadSelectedResource(type, actualIndex);
            }
        }

        panel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - panel.offsetLeft;
            const walk = (startX - x) * 1.0; // 进一步降低灵敏度
            inner.scrollLeft = scrollLeft + walk;
        });

        // 设置鼠标样式
        panel.style.cursor = 'grab';
    });
}