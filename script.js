// 获取 DOM 元素 - 图片压缩工具
const compressDropArea = document.getElementById('compressDropArea');
const compressFileInput = document.getElementById('compressFileInput');
const originalImage = document.getElementById('originalImage');
const originalSize = document.getElementById('originalSize');
const originalResolution = document.getElementById('originalResolution');
const compressedImageContainer = document.getElementById('compressedImageContainer');
const compressedSize = document.getElementById('compressedSize');
const compressionRatio = document.getElementById('compressionRatio');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const formatBtns = document.querySelectorAll('.format-btn');
const compressBtn = document.getElementById('compressBtn');
const downloadCompressedBtn = document.getElementById('downloadCompressedBtn');
const resetCompressBtn = document.getElementById('resetCompressBtn');
const compressResult = document.querySelector('.compress-result');

// 导航菜单元素
const menuItems = document.querySelectorAll('.menu-item');
const toolSections = document.querySelectorAll('.tool-section');
const featureCards = document.querySelectorAll('.feature-card');
const themeToggle = document.querySelector('.theme-toggle');

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

// 调整大小工具元素
const resizeDropZone = document.getElementById('resizeDropZone');
const resizeFileInput = document.getElementById('resizeFileInput');
const resizeControlSection = document.getElementById('resizeControlSection');
const resizePreview = document.getElementById('resizePreview');
const originalDimensions = document.getElementById('originalDimensions');
const modeButtons = document.querySelectorAll('.mode-button');
const dimensionsControls = document.getElementById('dimensionsControls');
const percentageControls = document.getElementById('percentageControls');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const maintainRatio = document.getElementById('maintainRatio');
const percentageInput = document.getElementById('percentageInput');
const formatButtons = document.querySelectorAll('.format-button');
const qualitySliderResize = document.getElementById('qualitySliderResize');
const qualityValueResize = document.getElementById('qualityValueResize');
const applyResizeBtn = document.getElementById('applyResizeBtn');
const downloadResizedBtn = document.getElementById('downloadResizedBtn');
const resetResizeBtn = document.getElementById('resetResizeBtn');

// 格式转换工具元素
const convertDropZone = document.getElementById('convertDropZone');
const convertFileInput = document.getElementById('convertFileInput');
const convertControlSection = document.getElementById('convertControlSection');
const convertPreview = document.getElementById('convertPreview');
const currentFormat = document.getElementById('currentFormat');
const currentFileSize = document.getElementById('currentFileSize');
const formatButtonsConvert = document.querySelectorAll('#convertTool .format-button');
const qualitySliderConvert = document.getElementById('qualitySliderConvert');
const qualityValueConvert = document.getElementById('qualityValueConvert');
const convertBtn = document.getElementById('convertBtn');
const downloadConvertedBtn = document.getElementById('downloadConvertedBtn');
const resetConvertBtn = document.getElementById('resetConvertBtn');

// 当前状态
let currentFile = null;
let compressedBlob = null;
let resizeOriginalFile = null;
let resizedBlob = null;
let convertOriginalFile = null;
let convertedBlob = null;
let selectedFormat = 'jpeg';
let resizeAspectRatio = null;

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
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// 获取文件扩展名
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// 获取文件MIME类型
function getMimeType(format) {
    const mimeTypes = {
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif'
    };
    return mimeTypes[format] || 'image/jpeg';
}

// 更新卡片预览
function updateCardPreview() {
    const mainText = document.querySelector('.card-main-text');
    const dateElement = document.querySelector('.card-date');
    const wordCountElement = document.getElementById('wordCount');
    
    if (!cardPreview || !mainText || !dateElement || !wordCountElement || !cardText) return;
    
    // 更新文本内容
    const markdownText = marked.parse(cardText.value);
    mainText.innerHTML = markdownText;
    
    // 更新日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    dateElement.textContent = dateStr;
    
    // 计算字数
    const textContent = cardText.value.trim();
    const count = textContent.length;
    wordCountElement.textContent = count;
    
    // 应用样式
    cardPreview.style.backgroundColor = currentCardState.backgroundColor;
    cardPreview.className = `card-preview border-${currentCardState.borderStyle}`;
    mainText.style.fontSize = `${currentCardState.fontSize}px`;
    mainText.style.color = currentCardState.textColor;
    
    // 设置长宽比
    cardPreview.style.aspectRatio = currentCardState.aspectRatio.replace(':', '/');
}

// 初始化应用
function initializeApp() {
    // 左侧导航菜单初始化
    initNavigation();
    
    // 图片压缩工具初始化
    initCompressTool();
    
    // 文字卡片生成器初始化
    initCardEvents();
    
    // 调整大小工具初始化
    initResizeTool();
    
    // 格式转换工具初始化
    initConvertTool();
    
    // 首页功能卡片初始化
    initFeatureCards();

    // 检查URL参数，实现直接链接到特定工具
    checkUrlParams();

    // AI 文生图工具初始化
    initAiImageTool();
}

// 导航菜单初始化
function initNavigation() {
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const toolId = item.dataset.tool;
            navigateTo(toolId);
        });
    });
}

// 首页功能卡片初始化
function initFeatureCards() {
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const toolId = card.dataset.tool;
            navigateTo(toolId);
        });
    });
}

// 图片压缩功能初始化
function initializeCompressTool() {
    if (!compressDropArea) return;

    let originalImageFile = null;
    let originalImageBlob = null;
    let compressedImageBlob = null;
    let selectedFormat = 'jpeg';

    // 更新质量显示
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    // 格式选择
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFormat = btn.dataset.format;
        });
    });

    // 上传区域点击触发文件选择
    compressDropArea.addEventListener('click', () => {
        compressFileInput.click();
    });

    // 文件拖放处理
    compressDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        compressDropArea.classList.add('dragover');
    });

    compressDropArea.addEventListener('dragleave', () => {
        compressDropArea.classList.remove('dragover');
    });

    compressDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        compressDropArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // 文件选择处理
    compressFileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    });

    // 文件处理函数
    function handleFiles(files) {
        const file = files[0];
        
        // 检查文件类型
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('请上传 JPG 或 PNG 格式的图片');
            return;
        }
        
        // 检查文件大小
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过 5MB');
            return;
        }

        originalImageFile = file;
        
        // 显示原图信息
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            originalImageBlob = dataURItoBlob(e.target.result);
            originalSize.textContent = formatFileSize(file.size);
            
            // 获取图片分辨率
            const img = new Image();
            img.onload = function() {
                originalResolution.textContent = `${this.width} x ${this.height}`;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // 显示压缩结果区域
        compressResult.style.display = 'flex';
        compressedImageContainer.innerHTML = '<div class="placeholder">点击"压缩图片"按钮开始处理</div>';
        downloadCompressedBtn.disabled = true;
    }

    // 压缩按钮处理
    compressBtn.addEventListener('click', async () => {
        if (!originalImageFile) {
            alert('请先上传图片');
            return;
        }

        compressedImageContainer.innerHTML = '<div class="placeholder">正在处理中...</div>';
        
        try {
            // 导入图片压缩库 (此处使用一个模拟函数)
            // 实际使用中可以引入 browser-image-compression 等库
            const quality = parseInt(qualitySlider.value) / 100;
            const compressedBlob = await compressImage(originalImageBlob, quality, selectedFormat);
            
            // 显示压缩后图片
            const compressedURL = URL.createObjectURL(compressedBlob);
            compressedImageContainer.innerHTML = `<img src="${compressedURL}" alt="压缩后图片">`;
            
            // 更新信息
            compressedSize.textContent = formatFileSize(compressedBlob.size);
            const ratio = ((1 - compressedBlob.size / originalImageFile.size) * 100).toFixed(1);
            compressionRatio.textContent = ratio + '%';
            
            // 启用下载按钮
            downloadCompressedBtn.disabled = false;
            compressedImageBlob = compressedBlob;
        } catch (error) {
            console.error('压缩图片时出错:', error);
            compressedImageContainer.innerHTML = '<div class="placeholder">处理出错，请重试</div>';
            alert('压缩图片时出错，请重试');
        }
    });

    // 下载按钮处理
    downloadCompressedBtn.addEventListener('click', () => {
        if (!compressedImageBlob) return;
        
        const url = URL.createObjectURL(compressedImageBlob);
        const extension = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
        const filename = `compressed_${Date.now()}.${extension}`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 重置按钮处理
    resetCompressBtn.addEventListener('click', () => {
        originalImageFile = null;
        originalImageBlob = null;
        compressedImageBlob = null;
        compressResult.style.display = 'none';
        compressFileInput.value = '';
    });

    // 工具函数：Data URI转Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], { type: mimeString });
    }

    // 模拟图片压缩函数（实际项目中应使用正式的压缩库）
    async function compressImage(imageBlob, quality, format) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                let mimeType;
                switch (format) {
                    case 'jpeg':
                        mimeType = 'image/jpeg';
                        break;
                    case 'png':
                        mimeType = 'image/png';
                        break;
                    case 'webp':
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'image/jpeg';
                }
                
                canvas.toBlob(
                    (blob) => resolve(blob),
                    mimeType,
                    quality
                );
            };
            
            img.src = URL.createObjectURL(imageBlob);
        });
    }
}

// 文字卡片事件初始化
function initCardEvents() {
    if (cardText) {
        cardText.addEventListener('input', updateCardPreview);
    }
    
    if (colorPresets) {
        colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.getAttribute('data-color');
                currentCardState.backgroundColor = color;
                
                // 更新RGB输入框
                const rgb = hexToRgb(color);
                if (rgb && colorR && colorG && colorB) {
                    colorR.value = rgb.r;
                    colorG.value = rgb.g;
                    colorB.value = rgb.b;
                }
                
                updateCardPreview();
            });
        });
    }
    
    if (applyColor && colorR && colorG && colorB) {
        applyColor.addEventListener('click', () => {
            const r = colorR.value || 0;
            const g = colorG.value || 0;
            const b = colorB.value || 0;
            
            currentCardState.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            updateCardPreview();
        });
    }
    
    if (borderPresets) {
        borderPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const border = preset.getAttribute('data-border');
                currentCardState.borderStyle = border;
                updateCardPreview();
            });
        });
    }
    
    if (fontSize && fontSizeValue) {
        fontSize.addEventListener('input', () => {
            fontSizeValue.textContent = `${fontSize.value}px`;
            currentCardState.fontSize = parseInt(fontSize.value);
            updateCardPreview();
        });
    }
    
    if (textColor) {
        textColor.addEventListener('change', () => {
            currentCardState.textColor = textColor.value;
            updateCardPreview();
        });
    }
    
    if (ratioPresets) {
        ratioPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                // 移除所有active类
                ratioPresets.forEach(p => p.classList.remove('active'));
                
                // 添加当前项的active类
                preset.classList.add('active');
                
                const ratio = preset.getAttribute('data-ratio');
                currentCardState.aspectRatio = ratio;
                updateCardPreview();
            });
        });
    }
    
    if (downloadCard) {
        downloadCard.addEventListener('click', downloadCardAsImage);
    }
    
    // 初始更新一次
    updateCardPreview();
}

// 调整大小工具初始化
function initResizeTool() {
    // 调整模式切换
    if (modeButtons) {
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const mode = button.getAttribute('data-mode');
                if (mode === 'dimensions') {
                    dimensionsControls.style.display = 'block';
                    percentageControls.style.display = 'none';
                } else {
                    dimensionsControls.style.display = 'none';
                    percentageControls.style.display = 'block';
                }
            });
        });
    }
    
    // 宽高比例保持
    if (widthInput && heightInput && maintainRatio) {
        widthInput.addEventListener('input', () => {
            if (maintainRatio.checked && resizeAspectRatio) {
                const width = parseInt(widthInput.value) || 0;
                heightInput.value = Math.round(width / resizeAspectRatio);
            }
        });
        
        heightInput.addEventListener('input', () => {
            if (maintainRatio.checked && resizeAspectRatio) {
                const height = parseInt(heightInput.value) || 0;
                widthInput.value = Math.round(height * resizeAspectRatio);
            }
        });
    }
    
    // 格式选择
    if (formatButtons) {
        formatButtons.forEach(button => {
            button.addEventListener('click', () => {
                formatButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedFormat = button.getAttribute('data-format');
            });
        });
    }
    
    // 质量滑块
    if (qualitySliderResize && qualityValueResize) {
        qualitySliderResize.addEventListener('input', () => {
            qualityValueResize.textContent = `${qualitySliderResize.value}%`;
        });
    }
    
    // 应用调整
    if (applyResizeBtn) {
        applyResizeBtn.addEventListener('click', resizeImage);
    }
    
    // 下载调整后的图片
    if (downloadResizedBtn) {
        downloadResizedBtn.addEventListener('click', downloadResizedImage);
    }
    
    // 重置
    if (resetResizeBtn) {
        resetResizeBtn.addEventListener('click', resetResizeState);
    }
}

// 格式转换工具初始化
function initConvertTool() {
    // 格式选择
    if (formatButtonsConvert) {
        formatButtonsConvert.forEach(button => {
            button.addEventListener('click', () => {
                formatButtonsConvert.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedFormat = button.getAttribute('data-format');
            });
        });
    }
    
    // 质量滑块
    if (qualitySliderConvert && qualityValueConvert) {
        qualitySliderConvert.addEventListener('input', () => {
            qualityValueConvert.textContent = `${qualitySliderConvert.value}%`;
        });
    }
    
    // 开始转换
    if (convertBtn) {
        convertBtn.addEventListener('click', convertImage);
    }
    
    // 下载转换后的图片
    if (downloadConvertedBtn) {
        downloadConvertedBtn.addEventListener('click', downloadConvertedImage);
    }
    
    // 重置
    if (resetConvertBtn) {
        resetConvertBtn.addEventListener('click', resetConvertState);
    }
}

// 下载卡片为图片
async function downloadCardAsImage() {
    if (!cardPreview) return;
    
    try {
        // 配置html2canvas
        const canvas = await html2canvas(cardPreview, {
            scale: 2, // 提高分辨率
            useCORS: true,
            backgroundColor: null,
            borderRadius: 12
        });
        
        // 转换为图片并下载
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        
        // 使用时间戳生成文件名
        const timestamp = new Date().getTime();
        link.download = `card_${timestamp}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('导出失败:', error);
        alert('卡片导出失败，请重试。');
    }
}

// 重置压缩工具状态
function resetCompressState() {
    if (compressResult.style.display === 'flex') {
        compressResult.style.display = 'none';
        compressFileInput.value = '';
    }
    
    originalImageFile = null;
    originalImageBlob = null;
    compressedImageBlob = null;
}

// 重置调整大小工具状态
function resetResizeState() {
    if (resizeDropZone.parentElement) resizeDropZone.parentElement.style.display = 'block';
    if (resizeControlSection) resizeControlSection.style.display = 'none';
    
    resizeOriginalFile = null;
    resizedBlob = null;
    resizeAspectRatio = null;
    
    if (resizeFileInput) resizeFileInput.value = '';
    if (resizePreview) resizePreview.src = '';
    if (originalDimensions) originalDimensions.textContent = '0 x 0 px';
    if (widthInput) widthInput.value = '';
    if (heightInput) heightInput.value = '';
    if (maintainRatio) maintainRatio.checked = true;
    if (percentageInput) percentageInput.value = 100;
    if (downloadResizedBtn) downloadResizedBtn.disabled = true;
}

// 重置格式转换工具状态
function resetConvertState() {
    if (convertDropZone.parentElement) convertDropZone.parentElement.style.display = 'block';
    if (convertControlSection) convertControlSection.style.display = 'none';
    
    convertOriginalFile = null;
    convertedBlob = null;
    
    if (convertFileInput) convertFileInput.value = '';
    if (convertPreview) convertPreview.src = '';
    if (currentFormat) currentFormat.textContent = '未知';
    if (currentFileSize) currentFileSize.textContent = '0 KB';
    if (downloadConvertedBtn) downloadConvertedBtn.disabled = true;
}

// 页面导航逻辑
function navigateTo(toolId) {
    // 隐藏所有工具部分
    toolSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示选中的工具部分
    const selectedSection = document.getElementById(`${toolId}-tool`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // 更新菜单项的活动状态
    menuItems.forEach(item => {
        if (item.dataset.tool === toolId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 更新URL，不刷新页面
    const url = new URL(window.location.href);
    if (toolId === 'home') {
        // 如果是首页，移除tool参数
        url.searchParams.delete('tool');
    } else {
        url.searchParams.set('tool', toolId);
    }
    window.history.pushState({}, '', url);
    
    // 更新页面标题
    updatePageTitle(toolId);
}

// 更新页面标题
function updatePageTitle(toolId) {
    const baseName = '图像魔方';
    let pageTitle = baseName;
    
    if (toolId !== 'home') {
        // 找到对应的菜单项，获取其文本作为标题
        const menuItem = Array.from(menuItems).find(item => item.dataset.tool === toolId);
        if (menuItem) {
            const toolName = menuItem.querySelector('span').textContent;
            pageTitle = `${toolName} - ${baseName}`;
        }
    }
    
    document.title = pageTitle;
}

// 主题切换功能
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        } else {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
        }
    });
}

// 检查URL参数，实现直接链接到特定工具
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const tool = urlParams.get('tool');
    if (tool) {
        navigateTo(tool);
    }
}

// AI 文生图工具
function initAiImageTool() {
    const generateBtn = document.getElementById('generate-btn');
    const prompt = document.getElementById('prompt');
    const styleButtons = document.querySelectorAll('.style-btn');
    const ratioButtons = document.querySelectorAll('.ratio-btn');
    const resultControls = document.querySelector('.result-controls');
    const downloadBtn = document.getElementById('download-ai-image');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const resultArea = document.querySelector('.ai-image-result');
    
    if (!generateBtn) return; // 如果元素不存在则退出
    
    // 样式按钮点击事件
    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 比例按钮点击事件
    ratioButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            ratioButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', () => {
        if (!prompt.value.trim()) {
            alert('请输入图像描述');
            return;
        }
        
        // 显示加载状态
        const placeholder = resultArea.querySelector('.image-placeholder');
        placeholder.innerHTML = '<div class="loader"></div><p>AI 正在生成图像，请稍候...</p>';
        
        // 这里应该是真正的 AI 生成图像的 API 调用
        // 目前是示意功能，使用了延时模拟 API 响应
        setTimeout(() => {
            // 模拟成功响应
            placeholder.innerHTML = '<img src="https://source.unsplash.com/random/600x600" alt="生成的图像" style="max-width: 100%; max-height: 400px;">';
            resultControls.style.display = 'flex';
        }, 2000);
    });
    
    // 下载按钮点击事件
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const img = resultArea.querySelector('img');
            if (img) {
                // 创建下载链接
                const a = document.createElement('a');
                a.href = img.src;
                a.download = `ai-image-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }
    
    // 重新生成按钮点击事件
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            generateBtn.click();
        });
    }
}

// 页面加载时初始化应用
window.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeCompressTool();
}); 