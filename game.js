// 游戏初始化
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    resizeTo: window
});
document.getElementById('gameContainer').appendChild(app.view);

// 创建图层容器 (按正确顺序添加到舞台)
const backgroundContainer = new PIXI.Container();
app.stage.addChild(backgroundContainer);

// 创建主容器统一管理人物缩放
const mainContainer = new PIXI.Container();
app.stage.addChild(mainContainer);

const foregroundContainer = new PIXI.Container();
app.stage.addChild(foregroundContainer);

// 图层管理器类
class LayerManager {
    constructor(layerOrder) {
        this.layers = {};
        this.container = new PIXI.Container();
        this.layerOrder = layerOrder;
        
        // 初始化所有图层
        layerOrder.forEach(layerName => {
            this.layers[layerName] = new PIXI.Container();
            this.container.addChild(this.layers[layerName]);
        });
    }
    
    // 加载资源到指定图层
    async loadResource(layerName, resourceUrl) {
        const layer = this.layers[layerName];
        if (!layer) return null;
        
        // 清空现有内容
        layer.removeChildren();
        
        const texture = await PIXI.Texture.fromURL(resourceUrl);
        const sprite = new PIXI.Sprite(texture);
        
        // 设置统一的精灵属性
        sprite.anchor.set(0.5, 0);
        sprite.position.set(0, 0);
        
        // 计算缩放比例
        const maxWidth = 400, maxHeight = 600;
        const scale = Math.min(maxWidth/texture.width, maxHeight/texture.height) || 1;
        sprite.scale.set(scale);
        
        layer.addChild(sprite);
        return sprite;
    }
    
    // 控制图层可见性
    setLayerVisibility(layerName, visible) {
        if (this.layers[layerName]) this.layers[layerName].visible = visible;
    }
    
    // 获取图层
    getLayer(layerName) { return this.layers[layerName]; }
}

// 创建图层管理器（定义人物图层顺序）
const layerOrder = ['hair','body', 'clothes'];
const layerManager = new LayerManager(layerOrder);

// 添加图层容器到主容器
mainContainer.addChild(layerManager.container);



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
    
    // 加载背景图到背景容器
    console.log('Loading background texture: images/background/背景.png');
    const backgroundTexture = await PIXI.Texture.fromURL('images/background/背景.png');
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.anchor.set(0.5);
    backgroundSprite.position.set(app.screen.width/2, app.screen.height/2);
    backgroundSprite.scale.set(Math.min(app.screen.width/backgroundTexture.width, app.screen.height/backgroundTexture.height));
    backgroundContainer.addChild(backgroundSprite);

    // 加载前景图到前景容器
    console.log('Loading foreground1 texture: images/background/前景.png');
    const foregroundTexture1 = await PIXI.Texture.fromURL('images/background/前景.png');
    const foregroundSprite1 = new PIXI.Sprite(foregroundTexture1);
    foregroundSprite1.anchor.set(0.5);
    foregroundSprite1.position.set(app.screen.width/2, app.screen.height/2);
    foregroundSprite1.scale.set(Math.min(app.screen.width/foregroundTexture1.width, app.screen.height/foregroundTexture1.height));
    foregroundContainer.addChild(foregroundSprite1);

    console.log('Loading foreground2 texture: images/background/前景2.png');
    const foregroundTexture2 = await PIXI.Texture.fromURL('images/background/前景2.png');
    const foregroundSprite2 = new PIXI.Sprite(foregroundTexture2);
    foregroundSprite2.anchor.set(0.5);
    foregroundSprite2.position.set(app.screen.width/2, app.screen.height/2);
    foregroundSprite2.scale.set(Math.min(app.screen.width/foregroundTexture2.width, app.screen.height/foregroundTexture2.height));
    foregroundContainer.addChild(foregroundSprite2);

    // 加载身体
    console.log('Loading body texture:', resources.body[0]);
    await layerManager.loadResource('body', resources.body[0]);

    // 加载头发
    console.log('Loading hair texture:', resources.hair[0]);
    await layerManager.loadResource('hair', resources.hair[0]);

    // 加载衣服
    console.log('Loading clothes texture:', resources.clothes[0]);
    await layerManager.loadResource('clothes', resources.clothes[0]);

 

    // 更新控制面板预览图
    updateControlPanelPreviews();
    setDefaultMiddleSelection();
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
        const totalWidth = count * itemWidth;
        const centeredPos = middleIndex * itemWidth + (itemWidth / 2) - (panelInner.offsetWidth / 2);
        const scrollPosition = centeredPos + totalWidth;
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


// 加载选中的资源
// 添加全局变量跟踪是否穿着鲸鱼服装
let isWearingWhaleClothes = false;

async function loadSelectedResource(type, index) {
    // 调用图层管理器加载资源
    await layerManager.loadResource(type, resources[type][index]);
    
    // 检查是否是鲸鱼服装，如果是则隐藏头发
    if (type === 'clothes') {
        isWearingWhaleClothes = resources.clothes[index].includes('鲸鱼服装.png');
        layerManager.setLayerVisibility('hair', !isWearingWhaleClothes);
    } else if (type === 'hair') {
        // 加载头发时也检查当前服装状态
        layerManager.setLayerVisibility('hair', !isWearingWhaleClothes);
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
        const itemWidth = 60 +16; // 更新为新的控制项尺寸：60px + 16px间距
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
        
        panelInner.scrollTo({ left: nearestPos + 50 , behavior: 'smooth' });
        
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

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('.btn-icon');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // 更新图标和标题
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = '☀️';
            themeToggleBtn.title = '切换日间模式';
        } else {
            themeIcon.textContent = '🌙';
            themeToggleBtn.title = '切换夜间模式';
        }
    });
});

// 初始化游戏
loadInitialResources();
initInfiniteScroll();

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
// 初始化无限滚动 
function initInfiniteScroll() {
    const panels = ['body', 'clothes', 'hair'];
    panels.forEach(type => {
        const panelInner = document.querySelector(`#${type}Panel .panel-inner`);
        if (!panelInner) return;

        const originalCount = resources[type].length;
        if (originalCount === 0) return;

        const itemWidth = 60 + 16; // item width + margin
        const contentWidth = originalCount * itemWidth;

        let isTeleporting = false;

        panelInner.addEventListener('scroll', () => {
            if (isTeleporting) {
                isTeleporting = false;
                return;
            }

            const scrollLeft = panelInner.scrollLeft;

            // Teleport to the end of the middle section if scrolling near the start
            if (scrollLeft < contentWidth) {
                isTeleporting = true;
                panelInner.scrollLeft += contentWidth;
            }
            // Teleport to the start of the middle section if scrolling near the end
            else if (scrollLeft >= contentWidth * 2) {
                isTeleporting = true;
                panelInner.scrollLeft -= contentWidth;
            }
        });
    });
}