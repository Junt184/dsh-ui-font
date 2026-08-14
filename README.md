# dsh-ui-font

为 `dsh` 的 Web 界面（`dsh web`）增加 **Apple 风格字体美化**，在「设置 → 常规」里注册一行控制面板。

## 功能

| 设置项 | 可选值 |
|---|---|
| 界面字体 | 系统默认 / 霞鹜文楷（LXGW WenKai）/ Inter |
| 代码字体 | SF Mono（默认）/ JetBrains Mono / Fira Code |

- 非系统字体通过 jsDelivr CDN **按需懒加载**（`@font-face` + `font-display: swap`），网络不可用时优雅回退到系统字体；
- 通过 `ctx.theme.overrideTokens` 覆盖 `--dsw-font-family` / `--ds-font-family-code` 两个 token，实时生效、跟随主题切换；
- 设置保存在浏览器 localStorage（键 `dsh-ui-font:v1`）——Web 设置 API 对第三方命名空间有白名单限制，因此客户端自包含持久化，无需改核心（详见 `dsh-ui-background` README 同节说明）。

## 安装

```sh
dsh plugin --profile web add github:Junt184/dsh-ui-font
# 或本地软链开发：
dsh plugin --profile web add link:/绝对路径/dsh-ui-font
```

装完重启 `dsh web`，在「设置 → 常规」里即可看到「字体美化」。

## 结构

```
dsh-ui-font/
├── package.json        # dsh.bundle.patch + dsh.client + exports["./client"]
├── cordis.patch.yml    # bundle patch：插入浏览器 roster 行（ui-font）
└── lib/
    ├── index.js        # 宿主半部：no-op apply
    └── client.js       # 客户端半部：字体预设 + CDN 注入 + token 覆盖 + 设置行
```

MIT License。
