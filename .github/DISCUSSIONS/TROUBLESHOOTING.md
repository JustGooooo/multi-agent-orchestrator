# ⚠️ 故障排查指南

## 当前问题

Workflow 执行失败，Discussions 页面为空。

## 可能的原因

### 1. 仓库未启用 Discussions 功能 ❗

**检查方法：**
1. 访问 https://github.com/JustGooooo/multi-agent-orchestrator/settings
2. 滚动到 **Features** 部分
3. 查看 **Discussions** 是否被勾选

**解决方案：**
```
✅ 勾选 Discussions
✅ 点击 Save
```

### 2. Workflow 权限不足 ❗

**检查方法：**
1. 访问 https://github.com/JustGooooo/multi-agent-orchestrator/settings/actions
2. 查看 **Workflow permissions** 部分

**解决方案：**
```
✅ 选择 "Read and write permissions"
✅ 勾选 "Allow GitHub Actions to create and approve pull requests"
✅ 点击 Save
```

### 3. GraphQL API 权限问题

**错误信息：**
```
Error: Resource not accessible by personal access token
```

**原因：** `GITHUB_TOKEN` 没有 Discussions 写入权限

**解决方案：**
- 确保 Workflow permissions 已设置为 Read and write
- 或者使用 Personal Access Token（带 `discussions:write` 权限）

### 4. Discussion 分类不存在

**错误信息：**
```
Field 'discussionCategories' doesn't exist
```

**原因：** 仓库未启用 Discussions，所以没有分类

**解决方案：**
- 先启用 Discussions 功能（见第 1 点）

## 手动测试步骤

### 步骤 1：检查 Discussions 是否启用

访问：https://github.com/JustGooooo/multi-agent-orchestrator/discussions

- ✅ 如果看到 Discussions 页面 → 已启用
- ❌ 如果看到 404 或 "Discussions 未启用" → 需要启用

### 步骤 2：手动触发 workflow

1. 访问 https://github.com/JustGooooo/multi-agent-orchestrator/actions/workflows/sync-discussions.yml
2. 点击 **"Run workflow"** 按钮
3. 选择 **main** 分支
4. 点击 **"Run workflow"**

### 步骤 3：查看日志

1. 等待 workflow 运行完成（约 1-2 分钟）
2. 点击最新的 workflow run
3. 点击 **"sync-discussions"** 步骤
4. 查看日志输出

### 步骤 4：检查 Discussions 页面

访问：https://github.com/JustGooooo/multi-agent-orchestrator/discussions

如果看到新的 Discussion，说明成功！🎉

## 常见错误及解决方案

### 错误 1: `Field 'discussions' doesn't accept argument 'query'`

**状态：** ✅ 已修复（commit f9ff171）

**解决方案：** 更新到最新版本的 workflow

### 错误 2: `Variable $title is declared but not used`

**状态：** ✅ 已修复（commit f9ff171）

**解决方案：** 更新到最新版本的 workflow

### 错误 3: `Resource not accessible by personal access token`

**原因：** Workflow 权限不足

**解决方案：**
```
Settings → Actions → Workflow permissions
→ Read and write permissions
→ Save
```

### 错误 4: `discussionCategories` 不存在

**原因：** Discussions 功能未启用

**解决方案：**
```
Settings → Features
→ 勾选 Discussions
→ Save
```

## 验证成功

成功的标志：

1. ✅ Workflow 显示绿色勾（成功）
2. ✅ Discussions 页面出现新的讨论
3. ✅ 日志中包含 "🎉 创建成功！URL: ..."

## 当前 Workflow 版本

**最新提交：** f9ff171
**提交信息：** fix: 添加 body 内容转义

如果问题仍未解决，请：
1. 查看最新的 workflow 日志
2. 复制错误信息
3. 提交 Issue 或联系我

---

**更新时间：** 2026-03-23 00:06
