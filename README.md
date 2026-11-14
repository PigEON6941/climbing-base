# 鸽子的攀岩基地

一个普通高中生的网站。持续更新攀岩相关工具和游戏中。

[访问网站](https://pigeon6941.github.io/climbing-base/) · [工具](https://pigeon6941.github.io/climbing-base/tools/) · [小游戏](https://pigeon6941.github.io/climbing-base/games/)

## 更新内容

编辑 [content.js](content.js)：`profile.intro` 是两行个人介绍，`projects.tools` 和 `projects.games` 分别是两个作品列表。复制一条作品记录，修改 `name`、`description` 和 `url`，即可添加一张卡片。还没上线的作品把 `url` 留空，用 `status` 写实际进度。

## 预览与发布

网站使用原生 HTML、CSS 和 JavaScript，无需构建。在仓库根目录运行 `python -m http.server 8000`，打开 `http://localhost:8000/` 即可预览。

GitHub Pages 从 `main` 分支的根目录发布。把修改推送到 `main` 后，网站会自动更新。鸽子模型及互动在 [pigeon.js](pigeon.js)，字体及字体许可在 [assets](assets/)。
