# DreamChaser 战队官网（静态版）

本项目为北京理工大学追梦战队（DreamChaser）静态官网，支持：
- 本地视频（mp4）宣传片播放（自动播放/静音/循环/移动端 playsinline）
- 图库图片展示
- 用 Markdown 管理内容（战队介绍、新闻、机器人、比赛、队员、荣誉）
- 新闻与队员支持“多 Markdown 清单”模式（manifest 列表）
- 苹果风样式：大字号 Hero、极简留白、卡片网格

## 目录结构

```
index.html                # 首页（Hero、视频、图片）
intro.html                # 战队介绍（单 Markdown）
news.html                 # 战队新闻（多 Markdown 清单）
robots.html               # 机器人介绍（单 Markdown）
competitions.html         # 比赛介绍（单 Markdown）
members.html              # 队员介绍（多 Markdown 清单）
honors.html               # 战队荣誉（单 Markdown）

styles/style.css          # 样式（苹果风）
scripts/app.js            # 首页逻辑（配置、视频、图库）
scripts/page.js           # 模块页逻辑（Markdown 与清单）
config/site.json          # 站点配置（logo、视频、gallery、md路径、清单路径）

content/*.md              # 单 Markdown 内容
content/news/manifest.json
content/news/*.md         # 多 Markdown 新闻条目
content/members/manifest.json
content/members/*.md      # 多 Markdown 成员条目

assets/logo.png           # 战队 logo（黑色透明底）
assets/promo.mp4          # 宣传视频（可替换）
assets/video-poster.jpg   # 视频封面（可选）
assets/gallery/*          # 宣传图片
```

## 启动本地服务器
详见下文或直接执行：
```powershell
py -m http.server 8080
```
访问 `http://localhost:8080`。

## 替换资源与内容
1) Logo、视频、图库：修改 `config/site.json` 对应路径。
2) 单 Markdown 页面：直接编辑 `content/intro.md` 等文件。
3) 多 Markdown（新闻/队员）：
   - 在 `content/news/manifest.json`（或 `content/members/manifest.json`）中登记清单：
```json
[
  { "title": "标题A", "date": "2025-01-10", "path": "content/news/2025-01-10-a.md" },
  { "title": "标题B", "date": "2024-12-20", "path": "content/news/2024-12-20-b.md" }
]
```
   - 新建对应的 Markdown 文件，脚本会自动按卡片渲染列表。

## 自定义样式
- 调整 `styles/style.css` 中的主题色变量、卡片阴影与字号间距可快速获得不同风格。
- 若 logo 为深色，已在导航处提供白底托底增强对比。
