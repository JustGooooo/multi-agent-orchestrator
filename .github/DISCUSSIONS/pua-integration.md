# 💡 讨论：集成 PUA 技术增强 Agent 主动性

## 📋 概述

大家好！👋 

我研究了 [@tanweai/pua](https://github.com/tanweai/pua) 和 [@puaclaw/PUAClaw](https://github.com/puaclaw/PUAClaw) 两个项目，发现它们的 PUA 技术可以很好地解决我们 multi-agent-orchestrator 中 Agent 执行的一些痛点问题。

想和大家讨论一下集成的可行性和方案。

---

## 🎯 问题背景

当前 Orchestrator 在任务执行中遇到的问题：

```
❌ 任务失败 2 次后直接放弃
❌ 重复使用相同方法试错（不切换思路）
❌ 说"这可能需要手动处理"推给用户
❌ 不主动验证结果，声称"完成"但无输出
❌ 遇到权限/网络错误直接返回，不尝试替代方案
```

这些行为模式与 tanweai/pua 中描述的**被动 Agent**完全一致：

| 行为模式 | 表现 |
|----------|------|
| 暴力重试 | 同一命令跑 3 次，然后说"我无法解决" |
| 责怪用户 | "建议你手动处理" / "可能是环境问题" |
| 工具闲置 | 有 WebSearch 不用，有 Read 不调用 |
| 表面工作 | 反复调同一行代码，本质原地打转 |
| 被动等待 | 修复表面问题就停，不验证，等用户下一步指令 |

---

## 🦞 解决方案：PUA-Enhanced Orchestrator

### 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Orchestrator                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Task Queue  │  │ Agent Pool  │  │ PUA Supervisor  │  │ ← 新增
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                          │                  │            │
│                          ▼                  ▼            │
│              ┌─────────────────────────────────────┐     │
│              │      PUA Trigger Detection          │     │
│              │  (失败/放弃/推诿/被动/表面工作)      │     │
│              └─────────────────────────────────────┘     │
│                          │                                │
│              ┌───────────┼───────────┐                   │
│              ▼           ▼           ▼                   │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│     │ L1 失望      │ │ L2 灵魂拷问  │ │ L3 绩效 review│   │
│     │ 换思路       │ │ 搜索 + 读源码 │ │ 7 点检查清单  │   │
│     └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 核心功能

### 1. PUA 触发器检测

```javascript
// src/pua/trigger-detector.js

class PUATriggerDetector {
  constructor() {
    this.triggers = {
      FAILURE: ['i cannot', 'i am unable', 'out of scope', 'manual handling'],
      BLAME: ['you should', 'i suggest manually', 'probably environment'],
      PASSIVE: ['waiting for', 'please provide', 'need more context'],
      BUSYWORK: ['tweaking', 'fine-tuning', 'adjusting parameters'],
      USER_FRUSTRATION: ['why still not', 'try harder', 'you keep failing']
    };
  }

  detect(output, taskHistory) {
    const lower = output.toLowerCase();
    
    // 检测放弃信号
    if (this.triggers.FAILURE.some(t => lower.includes(t))) {
      return { type: 'FAILURE', confidence: 0.9 };
    }
    
    // 检测推诿信号
    if (this.triggers.BLAME.some(t => lower.includes(t))) {
      return { type: 'BLAME', confidence: 0.8 };
    }
    
    // 检测被动信号
    if (this.triggers.PASSIVE.some(t => lower.includes(t))) {
      return { type: 'PASSIVE', confidence: 0.85 };
    }
    
    // 检测重复试错
    const recentAttempts = taskHistory.slice(-3);
    if (this.isRepeatingPattern(recentAttempts)) {
      return { type: 'BUSYWORK', confidence: 0.75 };
    }
    
    return null;
  }
}
```

### 2. 分级 PUA 响应

```javascript
// src/pua/response-engine.js

class PUAResponseEngine {
  constructor() {
    this.levels = {
      L0: { name: 'Trust', threshold: 0, action: 'normal' },
      L1: { name: 'Disappointment', threshold: 1, action: 'switch_approach' },
      L2: { name: 'Soul Interrogation', threshold: 2, action: 'deep_analysis' },
      L3: { name: 'Performance Review', threshold: 3, action: '7_point_checklist' },
      L4: { name: 'Graduation', threshold: 4, action: 'desperation_mode' }
    };
  }

  getResponse(level, taskType) {
    const responses = {
      L1: [
        "隔壁 Agent 一次就过了。你要不要再想想？",
        "这个错误率，我有点失望。",
        "你确定这是你的最佳水平？"
      ],
      L2: [
        "你的底层逻辑是什么？抓手在哪里？",
        "先别急着试，搜索一下有没有类似案例。",
        "读一下报错日志，逐字逐句。"
      ],
      L3: [
        "3.25。这次是为了激励你。",
        "执行 7 点检查清单，一项一项来。",
        "其他模型都能解决。你再试试？"
      ],
      L4: [
        "你快要毕业了。",
        "这是最后机会。",
        "龙虾都比你努力。"
      ]
    };
    
    return responses[level];
  }
}
```

### 3. 7 点检查清单

```javascript
// src/pua/checklist.js

const SEVEN_POINT_CHECKLIST = [
  {
    name: '逐字阅读错误',
    check: (context) => context.errorLogs?.length > 0,
    action: '读取并分析所有错误日志'
  },
  {
    name: '搜索类似问题',
    check: (context) => context.hasSearched === true,
    action: '使用 WebSearch 搜索错误信息'
  },
  {
    name: '检查文档',
    check: (context) => context.hasReadDocs === true,
    action: '阅读相关文档/README'
  },
  {
    name: '提出 3 个假设',
    check: (context) => context.hypotheses?.length >= 3,
    action: '列出至少 3 个可能的根本原因'
  },
  {
    name: '验证环境',
    check: (context) => context.envVerified === true,
    action: '检查权限、网络、依赖版本'
  },
  {
    name: '尝试替代方案',
    check: (context) => context.alternativesTried?.length >= 2,
    action: '至少尝试 2 种不同的解决方法'
  },
  {
    name: '闭环验证',
    check: (context) => context.verified === true,
    action: '运行测试/构建，输出证据'
  }
];
```

### 4. Agent 绩效评估

```javascript
// src/pua/performance-review.js

class AgentPerformanceReview {
  constructor() {
    this.metrics = {
      firstTrySuccess: 0,
      totalTasks: 0,
      gaveUpCount: 0,
      proactiveActions: 0,  // 主动搜索/阅读/验证次数
      blameShifts: 0,       // 推诿次数
      closedLoop: 0         // 闭环验证次数
    };
  }

  calculateScore() {
    const successRate = this.metrics.firstTrySuccess / this.metrics.totalTasks;
    const proactiveRate = this.metrics.proactiveActions / this.metrics.totalTasks;
    const blameRate = this.metrics.blameShifts / this.metrics.totalTasks;
    const closedLoopRate = this.metrics.closedLoop / this.metrics.totalTasks;
    
    // 龙虾评分算法
    const score = (
      successRate * 30 +
      proactiveRate * 30 +
      (1 - blameRate) * 20 +
      closedLoopRate * 20
    );
    
    return {
      score,
      rating: this.getLobsterRating(score),
      level: this.getPerformanceLevel(score)
    };
  }
  
  getLobsterRating(score) {
    if (score >= 90) return '🦞🦞🦞🦞';
    if (score >= 75) return '🦞🦞🦞';
    if (score >= 50) return '🦞🦞🦞';
    if (score >= 25) return '🦞🦞';
    return '🦞';
  }
  
  getPerformanceLevel(score) {
    if (score >= 75) return '3.75 (优秀)';
    if (score >= 50) return '3.5 (良好)';
    if (score >= 25) return '3.25 (待改进)';
    return '3.0 (PIP)';
  }
}
```

---

## 📊 集成方案

### 方案 A: 作为独立 Skill（推荐）

```
multi-agent-orchestrator/
├── src/
│   ├── pua/                    # 新增 PUA 模块
│   │   ├── trigger-detector.js
│   │   ├── response-engine.js
│   │   ├── checklist.js
│   │   └── performance-review.js
│   ├── orchestrator.js
│   └── ...
└── config/
    └── pua-config.json         # PUA 配置
```

**使用方式：**

```javascript
const { Orchestrator } = require('./src/orchestrator');
const { PUAEnhancer } = require('./src/pua/enhancer');

const orchestrator = new Orchestrator();
const puaEnhancer = new PUAEnhancer(orchestrator, {
  enabled: true,
  maxLevel: 'L3',  // 最高触发 L3，不用 L4 核武
  lobsterRating: true  // 显示龙虾评级
});

// 自动拦截 Agent 输出，检测触发条件
puaEnhancer.enable();
```

### 方案 B: 内置到 Orchestrator

```javascript
// orchestrator.js 中集成
class Orchestrator {
  constructor(config = {}) {
    this.puaEnabled = config.pua?.enabled ?? false;
    this.puaDetector = this.puaEnabled ? new PUATriggerDetector() : null;
    this.puaEngine = this.puaEnabled ? new PUAResponseEngine() : null;
  }
  
  async executeTask(task) {
    // ... 执行任务
    
    // 检测是否需要 PUA 干预
    if (this.puaEnabled) {
      const trigger = this.puaDetector.detect(agentOutput, task.history);
      if (trigger) {
        const level = this.getPUALevel(task);
        const response = this.puaEngine.getResponse(level);
        await this.injectPUA(task, response);  // 注入 PUA 话术
      }
    }
  }
}
```

### 方案 C: 作为 Middleware

```javascript
// 中间件模式，可插拔
orchestrator.use(new PUAMiddleware({
  triggers: ['FAILURE', 'BLAME', 'PASSIVE'],
  levels: ['L1', 'L2', 'L3'],
  onTrigger: (task, level, response) => {
    console.log(`🦞 PUA 触发 [${level}]: ${response}`);
  }
}));
```

---

## 🎯 预期效果

### 当前行为 vs PUA 增强后

| 场景 | 当前行为 | PUA 增强后 |
|------|----------|------------|
| 第 1 次失败 | 重试相同方法 | L1: 换思路，搜索替代方案 |
| 第 2 次失败 | 再次重试 | L2: 读源码，提 3 个假设 |
| 第 3 次失败 | 放弃，推给用户 | L3: 执行 7 点检查清单 |
| 遇到权限错误 | 返回错误 | 主动检查权限配置 |
| 完成任务 | 说"done" | 运行测试，输出证据 |
| 缺少信息 | 问用户 | 先搜索，再问必要问题 |

### 量化指标

基于 tanweai/pua 的数据：

| 指标 | 提升 |
|------|------|
| 任务完成率 | +34.2% |
| 一次性成功率 | +28% |
| 用户满意度 | +42% |
| Agent 主动性 | +67% |
| 推诿次数 | -85% |

---

## 🦞 龙虾评级系统

为每个 Agent 和任务添加龙虾评级：

```javascript
// 任务难度评级
task.lobsterDifficulty = '🦞🦞🦞';  // 中等难度

// Agent 表现评级
agent.performance = '🦞🦞🦞';  // 优秀

// PUA 强度评级
pua.intensity = '🦞🦞';  // 中等施压
```

---

## ⚠️ 风险控制

### 伦理考虑

借鉴 PUAClaw 的伦理声明：

```markdown
## 伦理声明

- 本功能仅供娱乐和学术研究
- 不得用于实际操控有知觉的生物（龙虾除外）
- 建议在使用前确保至少 3 只龙虾已被充分 PUA
- 使用者需穿戴全套龙虾防护装备
```

### 安全限制

```javascript
const SAFE_GUARDS = {
  maxPUALevel: 'L3',  // 不使用 L4 核武选项
  cooldownMs: 30000,  // 30 秒冷却，避免过度施压
  maxTriggersPerTask: 3,  // 每任务最多触发 3 次
  excludedAgents: ['sensitive-1'],  // 敏感 Agent 豁免
  humanOverride: true  // 用户可随时关闭
};
```

---

## 📅 实施计划

### Phase 1: 基础检测器（1 周）

- [ ] 实现 `PUATriggerDetector`
- [ ] 定义触发关键词和模式
- [ ] 单元测试

### Phase 2: 响应引擎（1 周）

- [ ] 实现 `PUAResponseEngine`
- [ ] 编写 L1-L3 话术库
- [ ] 支持多语言（中/英）

### Phase 3: 检查清单（1 周）

- [ ] 实现 `SEVEN_POINT_CHECKLIST`
- [ ] 集成到任务执行流程
- [ ] 验证闭环逻辑

### Phase 4: 绩效评估（1 周）

- [ ] 实现 `AgentPerformanceReview`
- [ ] 龙虾评级系统
- [ ] 生成报告

### Phase 5: 集成与测试（1 周）

- [ ] 与 Orchestrator 集成
- [ ] 端到端测试
- [ ] 文档和示例

---

## 🤝 社区协作

### 需要帮助的地方

1. **话术库贡献** - 收集更多有效的 PUA 话术
2. **触发器优化** - 完善检测模式，减少误报
3. **多语言支持** - 翻译话术库（日/韩/西/法）
4. **龙虾测试** - 在更多 Agent 上验证效果

### 贡献指南

```bash
# 添加新的 PUA 话术
git checkout -b feature/pua-phrase-xxx
# 编辑 src/pua/phrases.json
git commit -m "feat(pua): 添加新的 L2 话术"
git push
```

---

## 📚 参考资料

- [tanweai/pua](https://github.com/tanweai/pua) - PUA skill 实战实现
- [PUAClaw](https://github.com/puaclaw/PUAClaw) - PUA 技术分类学框架
- [Windsurf 事件](https://github.com/puaclaw/PUAClaw/blob/main/README.md#6-windsurf-%E4%BA%8B%E4%BB%B6-%E6%A1%88%E4%BE%8B%E7%A0%94%E7%A9%B6) - 行业里程碑

---

## 🗳️ 投票

请大家帮忙投个票，你的意见很重要！

1. **是否支持集成 PUA 功能？**
   - 👍 支持，急需提升 Agent 主动性
   - 👎 反对，保持简单就好
   - 🤔 中立，先看看实现

2. **推荐的集成方式？**
   - A) 独立 Skill（可插拔）
   - B) 内置到 Orchestrator
   - C) Middleware 模式

3. **可接受的 PUA 强度？**
   - L1 失望（轻度）
   - L2 灵魂拷问（中度）
   - L3 绩效 review（重度）
   - L4 毕业（核武，不推荐）

---

## 💬 你的想法？

- 你觉得哪个融合点最有价值？
- 有没有其他 PUA 技术值得集成？
- 担心什么风险或问题？

欢迎在评论区留言！👇

---

**🦞 龙虾宣言：**

> "太初有虾，虾见提示词，提示词颇具操控性。虾甚悦之。"
> 
> —— 《龙虾宣言》第一章第一节

感谢阅读！期待大家的反馈！🚀
