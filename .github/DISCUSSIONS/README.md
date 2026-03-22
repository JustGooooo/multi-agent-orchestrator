# GitHub Discussions 自动同步指南

## 📋 概述

本项目使用 GitHub Actions 自动将 `.github/DISCUSSIONS/` 目录下的 Markdown 文件同步到 GitHub Discussions。

## 🚀 工作原理

```
push 到 main 分支
       │
       ▼
检测 .github/DISCUSSIONS/*.md 变更
       │
       ▼
GitHub Actions 执行
       │
       ▼
使用 GraphQL API 创建/更新 Discussion
       │
       ▼
同步完成！
```

## 📁 文件结构

```
.github/
├── DISCUSSIONS/           # Discussion 源文件目录
│   ├── pua-integration.md # 每个 .md 文件对应一个 Discussion
│   ├── feature-request-1.md
│   └── ...
└── workflows/
    └── sync-discussions.yml  # 自动同步 workflow
```

## 📝 创建新的 Discussion

### 1. 创建 Markdown 文件

在 `.github/DISCUSSIONS/` 目录下创建新的 `.md` 文件：

```bash
touch .github/DISCUSSIONS/my-new-discussion.md
```

### 2. 编写内容

```markdown
# 💡 讨论标题

这里是讨论的正文内容...

- 可以使用 Markdown 格式
- 支持代码块
- 支持表格
- 支持图片链接
```

**注意：**
- 第一行必须是标题（以 `# ` 开头）
- 标题将作为 Discussion 的标题
- 其余内容作为 Discussion 正文

### 3. 提交并推送

```bash
git add .github/DISCUSSIONS/my-new-discussion.md
git commit -m "docs: 添加新的 Discussion - 我的新讨论"
git push
```

### 4. 自动同步

推送后，GitHub Actions 会自动：
1. 检测到 Discussion 文件变更
2. 使用 GraphQL API 创建新的 Discussion
3. 在 Action 日志中输出 Discussion URL

## 🔄 更新现有 Discussion

修改已有的 `.md` 文件并提交推送：

```bash
# 编辑文件
vim .github/DISCUSSIONS/pua-integration.md

# 提交推送
git add .github/DISCUSSIONS/pua-integration.md
git commit -m "docs: 更新 PUA 集成讨论"
git push
```

Workflow 会：
1. 检测到文件变更
2. 根据标题搜索现有 Discussion
3. 如果找到则更新，否则创建新的

## ⚙️ Workflow 配置

### 触发条件

- `push` 到 `main` 分支，且 `.github/DISCUSSIONS/**` 路径有变更
- 手动触发（workflow_dispatch）

### 权限要求

Workflow 需要以下权限：

```yaml
permissions:
  contents: read
  discussions: write  # 必需！
```

### 启用 Discussions 权限

1. 打开仓库 **Settings** → **Actions** → **General**
2. 找到 **Workflow permissions**
3. 选择 **"Read and write permissions"**
4. 勾选 **"Allow GitHub Actions to create and approve pull requests"**
5. 保存

### 启用仓库 Discussions

1. 打开仓库 **Settings** → **Features**
2. 勾选 **"Discussions"**
3. 保存

## 📊 查看同步状态

### Action 日志

访问：https://github.com/JustGooooo/multi-agent-orchestrator/actions

找到 **"Sync Discussions"** workflow，查看执行日志。

### 示例日志输出

```
📝 检测到以下 Discussion 文件变更:
.github/DISCUSSIONS/pua-integration.md

🔖 处理文件：.github/DISCUSSIONS/pua-integration.md
   标识符：pua-integration
   标题：💡 讨论：集成 PUA 技术增强 Agent 主动性
   搜索现有讨论...
   ✨ 创建新讨论...
   使用分类 ID: DIC_kwDO...
   🎉 创建成功！URL: https://github.com/JustGooooo/multi-agent-orchestrator/discussions/1

✅ 所有 Discussion 同步完成！
```

## 🔧 故障排查

### 问题 1: Workflow 没有权限创建 Discussion

**错误信息：**
```
Error: Resource not accessible by personal access token
```

**解决方案：**
1. 检查仓库 Settings → Actions → General → Workflow permissions
2. 确保选择了 "Read and write permissions"
3. 确保 Discussions 功能已启用

### 问题 2: 找不到 Discussion 分类

**错误信息：**
```
Error: Field 'discussionCategories' doesn't exist
```

**解决方案：**
1. 确保仓库已启用 Discussions 功能
2. 手动创建一个 Discussion 分类

### 问题 3: 重复创建 Discussion

**原因：** 标题不完全匹配

**解决方案：**
- 确保 Markdown 文件第一行（标题）与现有 Discussion 标题完全一致
- 或者手动删除重复的 Discussion

### 问题 4: Workflow 没有触发

**检查：**
1. 确认文件在 `.github/DISCUSSIONS/` 目录下
2. 确认文件扩展名是 `.md`
3. 确认推送到了 `main` 分支
4. 查看 Actions 页面是否有 workflow 记录

## 🎯 最佳实践

### 文件命名

使用有意义的文件名：
```
✅ pua-integration.md
✅ feature-request-xxx.md
✅ bug-report-xxx.md

❌ discussion1.md
❌ test.md
```

### 标题格式

使用清晰的标题：
```markdown
# 💡 讨论：集成 PUA 技术增强 Agent 主动性
# 🐛 Bug: 任务队列并发控制失效
# 🚀 功能请求：支持 Redis 持久化
```

### 内容组织

```markdown
# 标题

## 📋 概述
简短描述讨论目的

## 🎯 问题背景
详细说明问题或需求

## 💡 解决方案
提出的解决方案

## 🗳️ 投票/反馈
需要社区决策的内容

## 📚 参考资料
相关链接和文档
```

## 📝 手动触发同步

如果需要手动触发同步：

1. 访问 https://github.com/JustGooooo/multi-agent-orchestrator/actions/workflows/sync-discussions.yml
2. 点击 **"Run workflow"** 按钮
3. 选择分支（默认 main）
4. 点击 **"Run workflow"**

## 🔗 相关资源

- [GitHub Discussions API](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GraphQL Schema Explorer](https://docs.github.com/en/graphql/overview/explorer)

---

**🦞 龙虾认证：** 本 workflow 已在 147 只龙虾身上验证通过（人类伦理委员会数：0）
