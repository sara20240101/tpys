// 获取 DOM 元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const compressBtn = document.getElementById('compressBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// 工具切换功能
const toolButtons = document.querySelectorAll('.tool-button');
const toolSections = document.querySelectorAll('.tool-section');

// 文字卡片生成器元素
const cardText = document.getElementById('cardText');
const cardPreview = document.getElementById('cardPreview');
const colorPresets = document.querySelectorAll('.color-preset');
const borderPresets = document.querySelectorAll('.border-preset');
const ratioPresets = document.querySelectorAll('.ratio-preset');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColor = document.getElementById('textColor');
const colorR = document.getElementById('colorR');
const colorG = document.getElementById('colorG');
const colorB = document.getElementById('colorB');
const applyColor = document.getElementById('applyColor');
const autoSplit = document.getElementById('autoSplit');
const downloadCard = document.getElementById('downloadCard');

// 当前状态
let currentFile = null;
let compressedBlob = null;
const currentCardState = {
    backgroundColor: '#FFF5EA',
    borderStyle: 'gradient-pink',
    fontSize: 24,
    textColor: '#333333',
    aspectRatio: '4:3'
};

// 辅助函数：十六进制颜色转 RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

// 更新卡片预览
function updatePreview() {
    const preview = document.querySelector('.card-preview');
    const mainText = document.querySelector('.card-main-text');
    const input = document.querySelector('#card-text');
    const dateElement = document.querySelector('.card-date');
    const wordCount = document.querySelector('.word-count');

    if (!preview || !mainText || !input || !dateElement || !wordCount) return;

    // 更新文本内容
    const markdownText = marked.parse(input.value);
    mainText.innerHTML = markdownText;

    // 更新日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    dateElement.textContent = dateStr;

    // 计算字数
    const textContent = input.value.trim();
    const count = textContent.length;
    wordCount.textContent = `${count}字`;

    // 应用样式
    preview.style.backgroundColor = currentCardState.backgroundColor;
    preview.className = `card-preview border-${currentCardState.borderStyle}`;
    mainText.style.fontSize = `${currentCardState.fontSize}px`;
    mainText.style.color = currentCardState.textColor;
    preview.style.aspectRatio = currentCardState.aspectRatio;
}

// 初始化所有功能
function initializeApp() {
    // 图片压缩工具初始化
    initDropZone();
    initCompressEvents();
    
    // 文字卡片工具初始化
    initCardEvents();
    
    // 工具切换功能初始化
    initToolSwitcher();
    
    // 设置默认工具
    const defaultTool = document.querySelector('[data-tool="compress"]');
    if (defaultTool) {
        defaultTool.click();
    }
}

// 初始化拖放区域
function initDropZone() {
    if (!dropZone || !fileInput) return;

    // 点击上传
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 拖拽上传
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
        dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
        dropZone.style.backgroundColor = 'transparent';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
}

// 初始化压缩相关事件
function initCompressEvents() {
    if (!qualitySlider || !compressBtn || !downloadBtn || !resetBtn) return;

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
    });
    
    compressBtn.addEventListener('click', compressImage);
    downloadBtn.addEventListener('click', downloadCompressedImage);
    resetBtn.addEventListener('click', resetState);
}

// 初始化卡片生成器事件
function initCardEvents() {
    if (!cardText) return;

    // 文本输入更新
    cardText.addEventListener('input', updatePreview);
    
    // 颜色预设
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            if (!color) return;
            
            currentCardState.backgroundColor = color;
            updatePreview();
            
            const rgb = hexToRgb(color);
            if (rgb && colorR && colorG && colorB) {
                colorR.value = rgb.r;
                colorG.value = rgb.g;
                colorB.value = rgb.b;
            }
        });
    });
    
    // RGB 颜色应用
    if (applyColor) {
        applyColor.addEventListener('click', () => {
            const r = parseInt(colorR.value);
            const g = parseInt(colorG.value);
            const b = parseInt(colorB.value);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                currentCardState.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                updatePreview();
            }
        });
    }
    
    // 边框样式
    borderPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const style = preset.dataset.border;
            if (!style) return;
            
            currentCardState.borderStyle = style;
            updatePreview();
        });
    });
    
    // 比例选择
    ratioPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const ratio = preset.dataset.ratio;
            if (!ratio) return;
            
            currentCardState.aspectRatio = ratio;
            ratioPresets.forEach(btn => btn.classList.remove('active'));
            preset.classList.add('active');
            updatePreview();
        });
    });
    
    // 字体大小
    if (fontSize) {
        fontSize.addEventListener('input', (e) => {
            const size = e.target.value;
            currentCardState.fontSize = size;
            if (fontSizeValue) {
                fontSizeValue.textContent = `${size}px`;
            }
            updatePreview();
        });
    }
    
    // 文字颜色
    if (textColor) {
        textColor.addEventListener('input', (e) => {
            currentCardState.textColor = e.target.value;
            updatePreview();
        });
    }
    
    // 自动分割
    if (autoSplit) {
        autoSplit.addEventListener('change', (e) => {
            currentCardState.autoSplit = e.target.checked;
            updatePreview();
        });
    }
    
    // 下载卡片
    if (downloadCard) {
        downloadCard.addEventListener('click', async () => {
            const preview = document.querySelector('.card-preview');
            if (!preview) return;
            
            try {
                const canvas = await html2canvas(preview, {
                    scale: 2,
                    backgroundColor: null,
                    borderRadius: 32
                });
                
                const timestamp = new Date().getTime();
                const link = document.createElement('a');
                link.download = `文字卡片_${timestamp}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('导出失败:', error);
                alert('卡片导出失败，请重试！');
            }
        });
    }
    
    // 设置默认比例
    const defaultRatioButton = document.querySelector('[data-ratio="4:3"]');
    if (defaultRatioButton) {
        defaultRatioButton.classList.add('active');
    }
    
    // 初始化预览
    updatePreview();
}

// 初始化工具切换
function initToolSwitcher() {
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.dataset.tool;
            if (!tool) return;
            
            // 更新按钮状态
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 显示对应工具区域
            toolSections.forEach(section => {
                section.style.display = section.id === `${tool}Tool` ? 'block' : 'none';
            });
        });
    });
}

// 处理图片上传
async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    currentFile = file;
    
    // 显示原图预览
    originalPreview.src = URL.createObjectURL(file);
    originalSize.textContent = formatFileSize(file.size);
    
    // 显示预览区域
    uploadSection.style.display = 'none';
    previewSection.style.display = 'block';
    
    // 压缩图片
    await compressImage();
}

// 压缩图片
async function compressImage() {
    if (!currentFile) return;

    const quality = qualitySlider.value / 100;
    
    try {
        compressBtn.disabled = true;
        compressBtn.textContent = '压缩中...';

        const options = {
            maxSizeMB: 10,
            maxWidthOrHeight: 2048,
            useWebWorker: true,
            quality: quality
        };

        compressedBlob = await imageCompression(currentFile, options);
        
        // 更新压缩后预览
        compressedPreview.src = URL.createObjectURL(compressedBlob);
        compressedSize.textContent = formatFileSize(compressedBlob.size);
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        
        // 显示压缩率
        const compressionRatio = ((currentFile.size - compressedBlob.size) / currentFile.size * 100).toFixed(1);
        compressBtn.textContent = `压缩完成（节省 ${compressionRatio}%）`;
    } catch (error) {
        console.error('压缩失败:', error);
        alert('图片压缩失败，请重试！');
        compressBtn.textContent = '开始压缩';
    }
}

// 下载压缩后的图片
function downloadCompressedImage() {
    if (!compressedBlob) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    
    // 生成文件名
    const extension = compressedBlob.type.split('/')[1];
    const originalName = currentFile.name.split('.')[0];
    link.download = `${originalName}_compressed.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 重置状态
function resetState() {
    currentFile = null;
    compressedBlob = null;
    fileInput.value = '';
    compressBtn.disabled = false;
    compressBtn.textContent = '开始压缩';
    downloadBtn.disabled = true;
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
}

// 在 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp); 