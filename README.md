# 图片工具集

这是一个集成了多种图片处理工具的在线服务，采用苹果风格设计，提供直观的用户界面和高效的功能。

## 功能特点

### 1. 图片压缩工具
- 支持上传 PNG、JPG 等格式的图片
- 提供压缩比例调节功能
- 实时预览原图和压缩后的效果
- 显示压缩前后的文件大小对比
- 支持压缩后图片的下载

### 2. 文字卡片生成器
- 支持 Markdown 格式文本输入
- 丰富的预设模板颜色选择
- 自定义 RGB 颜色输入
- 多种精美边框样式
- 可调整文字大小和颜色
- 灵活的图片比例选择（3:4、4:3、16:9、9:16、1:1）
- 智能上下文分割功能

## 技术栈

- HTML5
- CSS3 (Flexbox + Grid)
- JavaScript
- 图片压缩算法库：browser-image-compression
- Markdown 解析：marked.js
- HTML2Canvas：卡片导出

## 设计风格

- 采用苹果风格设计语言
- 使用简洁的白色背景
- 磨砂玻璃效果（frosted glass）
- 柔和的阴影效果
- 优雅的动画过渡
- 标准系统字体

## 预设颜色主题

### 背景色
- 优雅米色：#F5F5DC
- 清新绿色：#E8F5E9
- 淡黄色：#FFF9C4
- 浅灰色：#F5F5F5
- 温柔粉色：#FCE4EC
- 天空蓝色：#E3F2FD

### 边框样式
- 简约实线
- 优雅虚线
- 圆角装饰
- 双线边框
- 渐变边框

## 页面结构

### 主要组件

1. 图片上传区域
   - 拖拽上传功能
   - 文件选择按钮
   - 支持文件类型提示

2. 压缩控制面板
   - 压缩质量滑动条
   - 压缩开始按钮
   - 文件大小限制提示

3. 预览区域
   - 原图预览
   - 压缩后预览
   - 图片信息显示（尺寸、大小）

4. 下载区域
   - 下载按钮
   - 压缩率显示

## 设计风格

- 采用苹果风格设计语言
- 使用简洁的白色背景
- 磨砂玻璃效果（frosted glass）
- 柔和的阴影效果
- 优雅的动画过渡
- 标准系统字体 