# Multi-Agent Orchestrator for OpenClaw

基于 OpenClaw 的多 Agent 协作架构框架，支持主从调度、任务队列、混合 runtime 的分布式任务执行。

## 🦞 特性

- **主从调度模式** - 1 个主 Agent 接收任务，智能调度多个子 Agent 并行执行
- **混合 Runtime** - 简单任务用 `subagent`，复杂编码用 `acp`
- **任务队列管理** - 支持任务优先级、状态追踪、结果聚合
- **错误处理** - 自动重试、故障恢复、超时控制
- **Git 版本管理** - 完整的项目结构和版本控制
- **🔥 PUA 增强** - 集成 tanweai/pua 和 PUAClaw，提升 Agent 主动性 +50%，问题发现率 +36%

## 📦 项目结构

```
multi-agent-orchestrator/
├── src/
│   ├── orchestrator.js      # 主调度器
│   ├── agent-pool.js        # Agent 资源池管理
│   ├── task-queue.js        # 任务队列
│   ├── result-aggregator.js # 结果聚合器
│   ├── logger.js            # 日志系统
│   └── pua-skills/          # 🔥 PUA 实战技能 (子模块)
├── config/
│   ├── default.json         # 默认配置
│   └── agents.json          # Agent 定义
├── examples/
│   ├── basic-usage.js       # 基础使用示例
│   └── parallel-tasks.js    # 并行任务示例
├── docs/
│   ├── architecture.md      # 架构设计文档
│   ├── PUA-INTEGRATION.md   # 🔥 PUA 整合方案
│   └── pua-framework/       # 🔥 PUA 学术框架 (子模块)
├── package.json
├── README.md
├── PUA_README.md            # 🔥 PUA 项目总览
└── .gitignore
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd multi-agent-orchestrator
npm install
```

### 2. 配置 Agent

编辑 `config/agents.json` 定义你的 Agent 池：

```json
{
  "agents": [
    {
      "id": "coder-1",
      "type": "acp",
      "specialty": "coding",
      "model": "qwen-coder-plus"
    },
    {
      "id": "researcher-1",
      "type": "subagent",
      "specialty": "research",
      "model": "qwen3.5-plus"
    },
    {
      "id": "writer-1",
      "type": "subagent",
      "specialty": "writing",
      "model": "qwen3.5-plus"
    }
  ]
}
```

### 3. 使用示例

```javascript
const { Orchestrator } = require('./src/orchestrator');

const orchestrator = new Orchestrator({
  taskQueue: {
    maxConcurrency: 5,
    retryAttempts: 3
  }
});

// 提交任务
await orchestrator.submitTask({
  id: 'task-001',
  type: 'coding',
  payload: {
    task: '创建一个 React 组件',
    requirements: ['TypeScript', 'Tailwind CSS']
  },
  priority: 'high'
});

// 执行并获取结果
const result = await orchestrator.execute();
console.log(result);
```

## 📋 API 参考

### Orchestrator

| 方法 | 描述 | 参数 |
|------|------|------|
| `submitTask(task)` | 提交任务到队列 | `task: TaskDefinition` |
| `execute()` | 执行所有待处理任务 | - |
| `getStatus(taskId)` | 获取任务状态 | `taskId: string` |
| `cancel(taskId)` | 取消任务 | `taskId: string` |

### TaskDefinition

```typescript
interface TaskDefinition {
  id: string;
  type: 'coding' | 'research' | 'writing' | 'review';
  payload: any;
  priority: 'low' | 'medium' | 'high';
  timeoutSeconds?: number;
  retryAttempts?: number;
}
```

## 📚 文档

| 文档 | 说明 |
|------|------|
| [使用指南](docs/USAGE.md) | 详细的使用教程和 API 参考 |
| [架构设计](docs/architecture.md) | 系统架构和设计说明 |

## 🎯 使用场景

- **并行任务执行** - 同时分析多个代码模块、批量生成文档
- **流水线处理** - 需求分析 → 编码实现 → 代码审查
- **定时任务** - 每日代码质量检查、定期数据同步
- **批量处理** - 多接口文档生成、多语言翻译
- **🔥 PUA 增强调试** - 强制 Agent 不轻易放弃，主动搜索、验证、闭环

---

## 🔥 PUA 增强

本项目集成了 [tanweai/pua](https://github.com/tanweai/pua) 和 [PUAClaw](https://github.com/puaclaw/PUAClaw) 两个优秀的 PUA 技术框架，为 Agent 提供：

- **主动性增强** - 从被动等待变为主动搜索验证
- **调试持久性** - 不轻易放弃，强制执行 7 点检查清单
- **问题发现率** - 从表面修复到深度审查

**Benchmark 数据：**
- 修复数量 **+36%**
- 验证次数 **+65%**
- 工具调用 **+50%**
- 隐藏问题发现 **+50%**

详见 [PUA_README.md](PUA_README.md) 和 [docs/PUA-INTEGRATION.md](docs/PUA-INTEGRATION.md)

## 💡 快速示例

### 并行分析多个模块

```javascript
const modules = ['auth', 'database', 'api', 'cache'];

await Promise.all(
  modules.map(module => 
    orchestrator.submitTask({
      id: `analyze-${module}`,
      type: 'analysis',
      payload: { task: `分析 ${module} 模块的代码质量` },
      priority: 'medium'
    })
  )
);

const result = await orchestrator.execute();
console.log(result.summary);
```

### 流水线任务

```javascript
// 1. 需求分析
await orchestrator.submitTask({
  id: 'step-1',
  type: 'analysis',
  payload: { task: '分析需求文档...' }
});
const analysis = await orchestrator.execute();

// 2. 编码实现
await orchestrator.submitTask({
  id: 'step-2',
  type: 'coding',
  payload: { task: '实现代码...', context: analysis.results[0].result }
});
const code = await orchestrator.execute();

// 3. 代码审查
await orchestrator.submitTask({
  id: 'step-3',
  type: 'review',
  payload: { task: '审查代码...', codeReview: code.results[0].result }
});
await orchestrator.execute();
```

## 📝 许可证

MIT
