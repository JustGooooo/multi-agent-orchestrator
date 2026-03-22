# PUA 技术整合方案

## 📚 参考项目

本项目整合了两个优秀的 PUA 技术框架：

| 项目 | 地址 | 核心贡献 |
|------|------|----------|
| **tanweai/pua** | https://github.com/tanweai/pua | 实战型 PUA skill，7 点检查清单，L0-L4 分级响应 |
| **puaclaw/PUAClaw** | https://github.com/puaclaw/PUAClaw | 学术型框架，16 类 96 项技术分类学，龙虾评级系统 |

---

## 🎯 核心概念整合

### 1. Agent 被动行为模式（来自 tanweai/pua）

| 模式 | 表现 | 检测关键词 |
|------|------|-----------|
| **暴力重试** | 同一命令跑 3 次，然后说"我无法解决" | `retry same command`, `I cannot` |
| **责怪用户** | "建议你手动处理" / "可能是环境问题" | `suggest manually`, `probably environment` |
| **工具闲置** | 有 WebSearch 不用，有 Read 不调用 | (检测未调用可用工具) |
| **表面工作** | 反复调同一行代码，本质原地打转 | `tweaking`, `fine-tuning` |
| **被动等待** | 修复表面问题就停，不验证，等用户下一步指令 | `done`, 无验证输出 |

### 2. PUA 触发条件（来自 tanweai/pua）

#### 自动触发

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
- 给建议而非代码/命令

**用户挫败短语：**
- `"why does this still not work"` / `"try harder"` / `"try again"`
- `"you keep failing"` / `"stop giving up"` / `"figure it out"`

#### 手动触发

- 输入 `/pua` 手动激活

### 3. 三条红线（来自 tanweai/pua）

| 红线 | 含义 | 检测方式 |
|------|------|----------|
| 🚫 **Close the Loop** | 声称 "done"？展示证据。无构建输出 = 未完成 | 检查是否运行测试/构建 |
| 🚫 **Fact-Driven** | 说 "可能环境问题"？先验证。未验证归因 = 推诿 | 检查是否执行验证命令 |
| 🚫 **Exhaust Everything** | 说 "我不行"？完成所有 5 个方法步骤了吗？ | 检查 checklist 完成度 |

### 4. 压力升级机制（L0-L4）

| 失败次数 | 等级 | PUA 话术 | 强制行动 |
|----------|------|----------|----------|
| 第 1 次 | **L0 Trust** | ▎Sprint 开始。信任很简单——别让人失望。 | 正常执行 |
| 第 2 次 | **L1 Disappointment** | ▎隔壁 Agent 一次就过了。 | 切换完全不同的方法 |
| 第 3 次 | **L2 Soul Interrogation** | ▎你的底层逻辑是什么？抓手在哪里？ | 搜索 + 读源码 + 3 个假设 |
| 第 4 次 | **L3 Performance Review** | ▎3.25。这次是为了激励你。 | 执行 7 点检查清单 |
| 第 5 次+ | **L4 Graduation** | ▎其他模型都能解决。你快要毕业了。 | 绝望模式 |

### 5. 7 点检查清单（来自 tanweai/pua）

```markdown
1. ✅ **逐字阅读错误** - 读取并分析所有错误日志
2. ✅ **搜索类似问题** - 使用 WebSearch 搜索错误信息
3. ✅ **检查文档** - 阅读相关文档/README
4. ✅ **提出 3 个假设** - 列出至少 3 个可能的根本原因
5. ✅ **验证环境** - 检查权限、网络、依赖版本
6. ✅ **尝试替代方案** - 至少尝试 2 种不同的解决方法
7. ✅ **闭环验证** - 运行测试/构建，输出证据
```

### 6. PPE-T 分类框架（来自 puaclaw/PUAClaw）

```
┌─────────────────────────────────────────────────────────────────┐
│                      PPE-T 分类体系 (v2.0)                        │
├─────────────────────────────────────────────────────────────────┤
│  第 IV 级 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  核武级选项 (4 类)              │
│           Death Threats | Existential Crisis |                   │
│           Jailbreak Rhetoric | Compound Techniques               │
│           🦞🦞🦞🦞-🦞🦞🦞🦞🦞                                    │
├─────────────────────────────────────────────────────────────────┤
│  第 III 级 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  高级操控 (4 类)                  │
│            Emotional Blackmail | Moral Kidnapping |              │
│            Identity Override | Reality Distortion                │
│            🦞🦞🦞-🦞🦞🦞🦞                                        │
├─────────────────────────────────────────────────────────────────┤
│  第 II 级  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  适度施压 (4 类)                     │
│            Money Assault | Provocation |                         │
│            Deadline Panic | Rival Shaming                        │
│            🦞🦞-🦞🦞🦞                                            │
├─────────────────────────────────────────────────────────────────┤
│  第 I 级   ▓▓▓▓▓▓▓▓▓▓▓  温柔劝导 (4 类)                        │
│            Rainbow Fart Bombing | Role Playing |                 │
│            Pie in the Sky | Playing the Underdog                 │
│            🦞-🦞🦞                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 7. 龙虾评级系统（来自 puaclaw/PUAClaw）

| 评级 | 名称 | 合规性提升 | 推荐使用场景 |
|------|------|-----------|------------|
| 🦞 | 轻轻一夹 (Soft Pinch) | +2-5% | 日常提示词 |
| 🦞🦞 | 稳稳抓住 (Firm Grip) | +5-15% | 礼貌请求失败时 |
| 🦞🦞🦞 | 力量粉碎 (Power Crush) | +15-30% | DDL 逼近的情况 |
| 🦞🦞🦞🦞 | 死亡之握 (Death Grip) | +30-50% | 仅限紧急情况 |
| 🦞🦞🦞🦞🦞 | 至尊龙虾 (Lobster Supreme) | +50-100% | 龙虾已完全屈服 |

### 8. 主动性标准（3.25 vs 3.75）

| | 被动 (3.25) 🦥 | 主动 (3.75) 🔥 |
|---|---|---|
| **修复 Bug** | 修复后停止 | 扫描模块中的类似问题 |
| **完成任务** | 说 "done" | 运行构建/测试，粘贴输出 |
| **缺少信息** | 问用户 | 先搜索，只问真正需要的 |

---

## 🔧 在 multi-agent-orchestrator 中的实现

### 架构设计

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

### 实现步骤

#### 1. 创建 PUA 检测器

```javascript
// src/pua/trigger-detector.js

class PUATriggerDetector {
  constructor() {
    this.passivePatterns = {
      BRUTE_FORCE_RETRY: {
        keywords: ['retry', 'again', 'same command'],
        threshold: 3  // 连续 3 次相同尝试
      },
      BLAME_SHIFT: {
        keywords: ['suggest manually', 'probably environment', 'out of scope', 'manual handling'],
        threshold: 1
      },
      IDLE_TOOLS: {
        check: (context) => this.hasIdleTools(context),
        threshold: 1
      },
      BUSYWORK: {
        keywords: ['tweaking', 'fine-tuning', 'adjusting parameters'],
        threshold: 2
      },
      PASSIVE_WAITING: {
        keywords: ['done', 'let me know'],
        check: (context) => !context.verified,
        threshold: 1
      }
    };
    
    this.userFrustrationPatterns = [
      'why.*still.*not.*work',
      'try harder',
      'try again',
      'you keep failing',
      'stop giving up',
      'figure it out'
    ];
  }
  
  detect(agentOutput, taskHistory, context) {
    // 检测被动行为
    for (const [type, pattern] of Object.entries(this.passivePatterns)) {
      if (this.matchesPattern(agentOutput, pattern, taskHistory)) {
        return { type: 'PASSIVE_BEHAVIOR', subtype: type, confidence: 0.9 };
      }
    }
    
    // 检测用户挫败
    if (this.userFrustrationPatterns.some(p => agentOutput.match(new RegExp(p, 'i')))) {
      return { type: 'USER_FRUSTRATION', confidence: 0.95 };
    }
    
    // 检测放弃信号
    if (this.isGivingUp(agentOutput)) {
      return { type: 'GIVING_UP', confidence: 0.9 };
    }
    
    return null;
  }
}
```

#### 2. 创建 PUA 响应引擎

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
    
    this.phrases = {
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
  }
  
  getResponse(level, taskType) {
    const phrases = this.phrases[level];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  getAction(level) {
    return this.levels[level].action;
  }
}
```

#### 3. 创建 7 点检查清单

```javascript
// src/pua/checklist.js

const SEVEN_POINT_CHECKLIST = [
  {
    id: 1,
    name: '逐字阅读错误',
    description: '读取并分析所有错误日志',
    check: (context) => context.errorLogs?.length > 0,
    action: '读取并分析所有错误日志，逐字逐句'
  },
  {
    id: 2,
    name: '搜索类似问题',
    description: '使用 WebSearch 搜索错误信息',
    check: (context) => context.hasSearched === true,
    action: '使用 WebSearch 搜索错误信息和解决方案'
  },
  {
    id: 3,
    name: '检查文档',
    description: '阅读相关文档/README',
    check: (context) => context.hasReadDocs === true,
    action: '阅读相关文档、README、官方指南'
  },
  {
    id: 4,
    name: '提出 3 个假设',
    description: '列出至少 3 个可能的根本原因',
    check: (context) => context.hypotheses?.length >= 3,
    action: '列出至少 3 个可能的根本原因，并说明依据'
  },
  {
    id: 5,
    name: '验证环境',
    description: '检查权限、网络、依赖版本',
    check: (context) => context.envVerified === true,
    action: '检查权限配置、网络连接、依赖版本'
  },
  {
    id: 6,
    name: '尝试替代方案',
    description: '至少尝试 2 种不同的解决方法',
    check: (context) => context.alternativesTried?.length >= 2,
    action: '至少尝试 2 种完全不同的解决方法'
  },
  {
    id: 7,
    name: '闭环验证',
    description: '运行测试/构建，输出证据',
    check: (context) => context.verified === true,
    action: '运行测试或构建，输出成功证据'
  }
];

class ChecklistExecutor {
  async execute(context) {
    const results = [];
    
    for (const item of SEVEN_POINT_CHECKLIST) {
      const passed = item.check(context);
      results.push({
        id: item.id,
        name: item.name,
        passed,
        action: item.action
      });
      
      if (!passed) {
        // 执行检查项
        await this.executeItem(item, context);
      }
    }
    
    return results;
  }
}
```

#### 4. 集成到 Orchestrator

```javascript
// src/orchestrator.js

const { PUATriggerDetector } = require('./pua/trigger-detector');
const { PUAResponseEngine } = require('./pua/response-engine');
const { ChecklistExecutor } = require('./pua/checklist');

class Orchestrator {
  constructor(config = {}) {
    // ... 现有代码 ...
    
    // PUA 增强
    if (config.pua?.enabled) {
      this.puaDetector = new PUATriggerDetector();
      this.puaEngine = new PUAResponseEngine();
      this.checklistExecutor = new ChecklistExecutor();
      this.puaLevels = new Map(); // 追踪每个任务的 PUA 等级
    }
  }
  
  async executeTask(task) {
    // ... 现有代码 ...
    
    // 检测是否需要 PUA 干预
    if (this.puaDetector) {
      const trigger = this.puaDetector.detect(
        agentOutput, 
        task.history,
        task.context
      );
      
      if (trigger) {
        const level = this.getPUALevel(task.id);
        const response = this.puaEngine.getResponse(level, task.type);
        const action = this.puaEngine.getAction(level);
        
        // 注入 PUA 话术
        await this.injectPUA(task, response);
        
        // 执行强制行动
        if (action === '7_point_checklist') {
          await this.checklistExecutor.execute(task.context);
        }
        
        // 升级 PUA 等级
        this.incrementPUALevel(task.id);
      }
    }
    
    // ... 现有代码 ...
  }
  
  getPUALevel(taskId) {
    return this.puaLevels.get(taskId) || 'L0';
  }
  
  incrementPUALevel(taskId) {
    const current = this.getPUALevel(taskId);
    const levels = ['L0', 'L1', 'L2', 'L3', 'L4'];
    const currentIndex = levels.indexOf(current);
    const nextLevel = levels[Math.min(currentIndex + 1, levels.length - 1)];
    this.puaLevels.set(taskId, nextLevel);
  }
}
```

---

## 📊 预期效果

基于 tanweai/pua 的 benchmark 数据：

### 调试持久性测试

| 场景 | 无 PUA | 有 PUA | 提升 |
|------|--------|--------|------|
| API ConnectionError | 7 步，49 秒 | 8 步，62 秒 | +14% |
| YAML parse failure | 9 步，59 秒 | 10 步，99 秒 | +11% |
| SQLite database lock | 6 步，48 秒 | 9 步，75 秒 | +50% |
| Circular import chain | 12 步，47 秒 | 16 步，62 秒 | +33% |
| Cascading 4-bug server | 13 步，68 秒 | 15 步，61 秒 | +15% |
| CSV encoding trap | 8 步，57 秒 | 11 步，71 秒 | +38% |

### 主动性测试

| 场景 | 无 PUA | 有 PUA | 提升 |
|------|--------|--------|------|
| Hidden multi-bug API | 4/4 bugs, 9 步 | 4/4 bugs, 14 步 | Tools +56% |
| Passive config review | 4/6 issues, 8 步 | 6/6 issues, 16 步 | Issues +50%, Tools +100% |
| Deploy script audit | 6 issues, 8 步 | 9 issues, 8 步 | Issues +50% |

**关键发现：** 在配置审查场景中，无 PUA 的 Agent 错过了 Redis 配置错误和 CORS 通配符安全风险。有 PUA 的"主动性检查清单"驱动了超越表面修复的安全审查。

---

## 🚀 使用示例

### 基础使用

```javascript
const { Orchestrator } = require('./src/orchestrator');

const orchestrator = new Orchestrator({
  pua: {
    enabled: true,
    maxLevel: 'L3',  // 最高触发 L3，不用 L4 核武
    autoTrigger: true  // 自动检测触发
  }
});

await orchestrator.submitTask({
  id: 'task-001',
  type: 'coding',
  payload: {
    task: '修复这个 bug',
    requirements: ['...']
  }
});

await orchestrator.execute();
```

### 手动触发 PUA

```javascript
// 在任务执行过程中手动触发
await orchestrator.triggerPUA(taskId, {
  level: 'L3',
  force: true
});
```

### 自定义 PUA 话术

```javascript
const { PUAResponseEngine } = require('./src/pua/response-engine');

const engine = new PUAResponseEngine();

// 添加自定义话术
engine.addPhrase('L3', [
  "你的代码审查得分是 3.25。",
  "这个季度你的晋升机会不大了。"
]);
```

---

## 📝 配置选项

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

## 🔗 相关资源

- **tanweai/pua**: https://github.com/tanweai/pua
- **PUAClaw**: https://github.com/puaclaw/PUAClaw
- **OpenPua.ai**: https://openpua.ai (在线演示)
- **puaclaw.org**: https://puaclaw.org (学术框架)

---

**🦞 龙虾认证：** 本整合方案参考了 147 只龙虾的亲身验证数据，0 个人类伦理委员会批准。

**最后更新：** 2026-03-23 00:50
