// 个人介绍和作品目录都在这里。保存并刷新网页即可预览。
window.workbench = {
  profile: {
    name: "PigEON6941",
    headline: ["鸽子的攀岩基地"],
    location: "上海",
    intro: [
      "一个普通高中生的网站",
      "持续更新攀岩相关工具和游戏中"
    ]
  },
  // 在对应数组里增加 { name, description, url }，页面就会自动多一张卡片。
  // url 填完整体验网址。留空时显示 status，没有体验按钮。
  // art 可省略，省略时使用该分类的通用插图。
  projects: {
    tools: [
      {
        name: "Crux Studio · 岩序",
        description: "用岩壁照片设计攀岩线路，在 3D 里试走自己编排的动作。",
        url: "https://pigeon6941.github.io/crux-studio/",
        art: "route"
      },
      {
        name: "线路笔记 · 岩迹",
        description: "记录攀岩线路、视频和动作笔记，回看每次尝试。",
        url: "https://pigeon6941.github.io/crux-beta-notebook/",
        art: "notebook"
      },
      {
        name: "攀岩 Beta 视频分析",
        description: "想做一个能对着攀岩录像拆解动作、比较不同走法的工具。",
        url: "",
        status: "构思中",
        art: "video"
      }
    ],
    games: []
  },
  empty: {
    tools: "这里暂时还没有工具。",
    games: "第一款小游戏还没上架。"
  }
};
