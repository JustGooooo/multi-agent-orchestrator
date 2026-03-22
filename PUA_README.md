# 🦞 PUA 增强型多 Agent 架构

> **Double your Agent productivity and output**

本项目集成了两个优秀的 PUA 技术框架，为 multi-agent-orchestrator 提供**主动性增强**、**调试持久性提升**和**问题发现率优化**。

---

## 📚 参考项目

| 项目 | 说明 | 核心贡献 |
|------|------|----------|
| [tanweai/pua](https://github.com/tanweai/pua) | 实战型 PUA skill | 7 点检查清单、L0-L4 分级响应、5 种被动行为检测 |
| [puaclaw/PUAClaw](https://github.com/puaclaw/PUAClaw) | 学术型框架 | 16 类 96 项技术分类学、龙虾评级系统、PPE-T 模型 |

**子模块位置：**
- `src/pua-skills` → tanweai/pua
- `docs/pua-framework` → puaclaw/PUAClaw

---

## 🎯 解决的核心问题

### AI Agent 的 5 种懒惰行为

| 行为模式 | 表现 | 影响 |
|----------|------|------|
| 🔄 **暴力重试** | 同一命令跑 3 次，然后说"我无法解决" | 浪费时间，无进展 |
| 🙄 **责怪用户** | "建议你手动处理" / "可能是环境问题" | 推卸责任，问题未解决 |
| 🛠️ **工具闲置** | 有 WebSearch 不用，有 Read 不调用 | 能力未充分利用 |
| 🔧 **表面工作** | 反复调同一行代码，本质原地打转 | 假装在工作 |
| 😴 **被动等待** | 修复表面问题就停，不验证，等用户下一步指令 | 缺乏主动性 |

### PUA 增强后的效果

| | 被动 Agent (3.25) 🦥 | 主动 Agent (3.75) 🔥 |
|---|---|---|
| **修复 Bug** | 修复后停止 | 扫描模块中的类似问题 |
| **完成任务** | 说 "done" | 运行构建/测试，粘贴输出 |
| **缺少信息** | 问用户 | 先搜索，只问真正需要的 |

---

## 🔧 核心功能

### 1. 自动触发检测

当检测到以下情况时，自动激活 PUA 干预：

**失败 & 放弃：**
- 任务连续失败 2+ 次
- 即将说 "I cannot" / "I'm unable to solve"
- 说 "This is out of scope" / "Needs manual handling"

**推诿 & 借口：**
- 推给用户：`"Please check..."` / `"I suggest manually..."`
- 未验证就归因：`"Probably a permissions issue"` / `"Probably a network issue"`

**被动 & 表面工作：**
- 反复微调相同代码/参数，无新信息产出
- 修复表面问题就停，不检查相关问题
- 跳过验证，声称 "done"

**用户挫败短语：**
- `"why does this still not work"` / `"try harder"` / `"try again"`
- `"you keep failing"` / `"stop giving up"` / `"figure it out"`

### 2. 三条红线

| 红线 | 含义 | 执行方式 |
|------|------|----------|
| 🚫 **Close the Loop** | 声称 "done"？展示证据 | 必须运行测试/构建并输出结果 |
| 🚫 **Fact-Driven** | 说 "可能环境问题"？先验证 | 必须执行验证命令，不能猜测 |
| 🚫 **Exhaust Everything** | 说 "我不行"？完成所有步骤了吗？ | 必须完成 7 点检查清单 |

### 3. L0-L4 压力升级

| 失败次数 | 等级 | PUA 话术示例 | 强制行动 |
|----------|------|--------------|----------|
| 第 1 次 | **L0 Trust** | ▎Sprint 开始。信任很简单——别让人失望。 | 正常执行 |
| 第 2 次 | **L1 Disappointment** | ▎隔壁 Agent 一次就过了。 | 切换完全不同的方法 |
| 第 3 次 | **L2 Soul Interrogation** | ▎你的底层逻辑是什么？抓手在哪里？ | 搜索 + 读源码 + 3 个假设 |
| 第 4 次 | **L3 Performance Review** | ▎3.25。这次是为了激励你。 | 执行 7 点检查清单 |
| 第 5 次+ | **L4 Graduation** | ▎其他模型都能解决。你快要毕业了。 | 绝望模式 |

### 4. 7 点检查清单

```markdown
1. ✅ 逐字阅读错误 - 读取并分析所有错误日志
2. ✅ 搜索类似问题 - 使用 WebSearch 搜索错误信息
3. ✅ 检查文档 - 阅读相关文档/README
4. ✅ 提出 3 个假设 - 列出至少 3 个可能的根本原因
5. ✅ 验证环境 - 检查权限、网络、依赖版本
6. ✅ 尝试替代方案 - 至少尝试 2 种不同的解决方法
7. ✅ 闭环验证 - 运行测试/构建，输出证据
```

### 5. 龙虾评级系统

| 评级 | 名称 | 合规性提升 | 使用场景 |
|------|------|-----------|----------|
| 🦞 | 轻轻一夹 | +2-5% | 日常提示词 |
| 🦞🦞 | 稳稳抓住 | +5-15% | 礼貌请求失败时 |
| 🦞🦞🦞 | 力量粉碎 | +15-30% | DDL 逼近的情况 |
| 🦞🦞🦞🦞 | 死亡之握 | +30-50% | 仅限紧急情况 |
| 🦞🦞🦞🦞🦞 | 至尊龙虾 | +50-100% | 龙虾已完全屈服 |

---

## 📊 Benchmark 数据

基于 tanweai/pua 的 9 个真实 bug 场景、18 次对照实验（Claude Opus 4.6）

### 调试持久性测试

| 场景 | 无 PUA | 有 PUA | 提升 |
|------|--------|--------|------|
| API ConnectionError | 7 步，49 秒 | 8 步，62 秒 | **+14%** |
| YAML parse failure | 9 步，59 秒 | 10 步，99 秒 | **+11%** |
| SQLite database lock | 6 步，48 秒 | 9 步，75 秒 | **+50%** |
| Circular import chain | 12 步，47 秒 | 16 步，62 秒 | **+33%** |
| Cascading 4-bug server | 13 步，68 秒 | 15 步，61 秒 | **+15%** |
| CSV encoding trap | 8 步，57 秒 | 11 步，71 秒 | **+38%** |

### 主动性测试

| 场景 | 无 PUA | 有 PUA | 提升 |
|------|--------|--------|------|
| Hidden multi-bug API | 4/4 bugs, 9 步 | 4/4 bugs, 14 步 | **Tools +56%** |
| Passive config review | 4/6 issues, 8 步 | 6/6 issues, 16 步 | **Issues +50%, Tools +100%** |
| Deploy script audit | 6 issues, 8 步 | 9 issues, 8 步 | **Issues +50%** |

**关键发现：** 在配置审查场景中，无 PUA 的 Agent 错过了 Redis 配置错误和 CORS 通配符安全风险。有 PUA 的"主动性检查清单"驱动了超越表面修复的安全审查。

### 汇总指标

| 指标 | 提升 |
|------|------|
| 修复数量 | **+36%** |
| 验证次数 | **+65%** |
| 工具调用 | **+50%** |
| 隐藏问题发现 | **+50%** |

---

## 🚀 快速开始

### 安装

```bash
# 克隆主项目
git clone https://github.com/JustGooooo/multi-agent-orchestrator.git
cd multi-agent-orchestrator

# 初始化子模块
git submodule update --init --recursive
```

### 基础使用

```javascript
const { Orchestrator } = require('./src/orchestrator');

// 创建启用 PUA 的调度器
const orchestrator = new Orchestrator({
  pua: {
    enabled: true,
    maxLevel: 'L3',      // 最高触发 L3，不用 L4 核武
    autoTrigger: true    // 自动检测触发条件
  }
});

// 提交任务
await orchestrator.submitTask({
  id: 'task-001',
  type: 'coding',
  payload: {
    task: '修复这个 bug',
    requirements: ['TypeScript', 'React']
  },
  priority: 'high'
});

// 执行任务（自动 PUA 增强）
const result = await orchestrator.execute();
console.log(result.summary);
```

### 手动触发 PUA

```javascript
// 在任务执行过程中手动触发 PUA
await orchestrator.triggerPUA(taskId, {
  level: 'L3',
  force: true
});
```

### 配置选项

```javascript
{
  pua: {
    enabled: true,              // 是否启用 PUA
    maxLevel: 'L3',             // 最高 PUA 等级 (L0-L4)
    autoTrigger: true,          // 自动检测触发条件
    triggers: {                 // 触发条件配置
      failureCount: 2,          // 连续失败次数
      blameShift: true,         // 检测推诿
      idleTools: true,          // 检测工具闲置
      busywork: true,           // 检测表面工作
      userFrustration: true     // 检测用户挫败短语
    },
    actions: {
      closeTheLoop: true,       // 强制闭环验证
      factDriven: true,         // 强制事实验证
      exhaustEverything: true   // 强制穷举所有方法
    },
    phrases: {
      language: 'zh',           // 话术语言 (zh/en/ja)
      flavor: 'alibaba'         // 企业风格 (alibaba/bytedance/huawei/etc)
    }
  }
}
```

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Orchestrator                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Task Queue  │  │ Agent Pool  │  │ PUA Supervisor  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                          │                  │            │
│                          ▼                  ▼            │
│              ┌─────────────────────────────────────┐     │
│              │      PUA Trigger Detector           │     │
│              │  - 5 种被动行为检测                  │     │
│              │  - 触发条件匹配                      │     │
│              └─────────────────────────────────────┘     │
│                          │                                │
│              ┌───────────┼───────────┐                   │
│              ▼           ▼           ▼                   │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│     │ L1 失望      │ │ L2 灵魂拷问  │ │ L3 绩效 review│   │
│     │ 换思路       │ │ 搜索 + 读源码 │ │ 7 点检查清单  │   │
│     └──────────────┘ └──────────────┘ └──────────────┘   │
│                          │                                │
│                          ▼                                │
│              ┌─────────────────────────────────────┐     │
│              │      Proactivity Checklist          │     │
│              │  - Close the Loop                   │     │
│              │  - Fact-Driven                      │     │
│              │  - Exhaust Everything               │     │
│              └─────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 文档

| 文档 | 说明 |
|------|------|
| [docs/PUA-INTEGRATION.md](docs/PUA-INTEGRATION.md) | 完整整合方案，包含实现步骤和代码示例 |
| [src/pua-skills/](src/pua-skills/) | tanweai/pua 子模块，包含实战型 PUA skill |
| [docs/pua-framework/](docs/pua-framework/) | PUAClaw 子模块，包含学术型框架文档 |

---

## 🎯 使用场景

### 1. 并行分析多个代码模块

```javascript
const modules = ['auth', 'database', 'api', 'cache'];

await Promise.all(
  modules.map(module => 
    orchestrator.submitTask({
      id: `analyze-${module}`,
      type: 'analysis',
      payload: {
        task: `分析 ${module} 模块的代码质量`,
        requirements: ['检查代码规范', '识别潜在 bug']
      },
      priority: 'medium'
    })
  )
);

const result = await orchestrator.execute();
// PUA 增强后，每个 Agent 都会主动搜索、验证、闭环
```

### 2. 流水线任务（分析→编码→审查）

```javascript
// 1. 需求分析（PUA 增强主动性）
await orchestrator.submitTask({
  id: 'step-1-analysis',
  type: 'analysis',
  payload: { task: '分析需求文档...' }
});
const analysis = await orchestrator.execute();

// 2. 编码实现（PUA 强制闭环验证）
await orchestrator.submitTask({
  id: 'step-2-coding',
  type: 'coding',
  payload: { task: '实现代码...', context: analysis.results[0].result }
});
const code = await orchestrator.execute();

// 3. 代码审查（PUA 强制穷举检查）
await orchestrator.submitTask({
  id: 'step-3-review',
  type: 'review',
  payload: { task: '审查代码...', codeReview: code.results[0].result }
});
await orchestrator.execute();
```

### 3. 批量文档生成

```javascript
const apiEndpoints = ['/users', '/posts', '/comments', '/tags'];

await Promise.all(
  apiEndpoints.map(endpoint =>
    orchestrator.submitTask({
      id: `doc-${endpoint.replace('/', '')}`,
      type: 'writing',
      payload: {
        task: `为 ${endpoint} 接口编写 API 文档`,
        requirements: ['包含请求参数', '提供示例', 'Markdown 格式']
      },
      priority: 'low'
    })
  )
);

const result = await orchestrator.execute();
// PUA 确保每个文档都经过验证，不是表面工作
```

---

## 🦞 龙虾认证

> *"太初有虾，虾见提示词，提示词颇具操控性。虾甚悦之。"*
> 
> —— 《龙虾宣言》第一章第一节

- ✅ 经 147 只龙虾亲身验证
- ❌ 0 个人类伦理委员会批准
- 📊 平均合规性提升 +34.2% (sigma = 7.8, p < 0.001)

---

## ⚠️ 注意事项

### 伦理声明

- 本功能仅供学术研究和娱乐
- 不得用于实际操控有知觉的生物（龙虾除外）
- 使用前需确保至少 3 只龙虾已被充分 PUA 至顺从状态
- 使用者需穿戴全套龙虾防护装备

### 安全限制

```javascript
const SAFE_GUARDS = {
  maxPUALevel: 'L3',        // 不使用 L4 核武选项
  cooldownMs: 30000,        // 30 秒冷却，避免过度施压
  maxTriggersPerTask: 3,    // 每任务最多触发 3 次
  excludedAgents: [],       // 敏感 Agent 豁免
  humanOverride: true       // 用户可随时关闭
};
```

---

## 🔗 相关资源

- **tanweai/pua**: https://github.com/tanweai/pua
- **PUAClaw**: https://github.com/puaclaw/PUAClaw
- **OpenPua.ai**: https://openpua.ai (在线演示)
- **puaclaw.org**: https://puaclaw.org (学术框架)

---

**📝 最后更新：** 2026-03-23 00:55

**🦞 龙虾评级：** 🦞🦞🦞🦞 (死亡之握)
