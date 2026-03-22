# Multi-Agent Orchestrator for OpenClaw

基于 OpenClaw 的多 Agent 协作架构框架，支持主从调度、任务队列、混合 runtime 的分布式任务执行。

## 🦞 特性

- **主从调度模式** - 1 个主 Agent 接收任务，智能调度多个子 Agent 并行执行
- **混合 Runtime** - 简单任务用 `subagent`，复杂编码用 `acp`
- **任务队列管理** - 支持任务优先级、状态追踪、结果聚合
- **错误处理** - 自动重试、故障恢复、超时控制
- **Git 版本管理** - 完整的项目结构和版本控制

## 📦 项目结构

```
multi-agent-orchestrator/
├── src/
│   ├── orchestrator.js      # 主调度器
│   ├── agent-pool.js        # Agent 资源池管理
│   ├── task-queue.js        # 任务队列
│   ├── result-aggregator.js # 结果聚合器
│   └── logger.js            # 日志系统
├── config/
│   ├── default.json         # 默认配置
│   └── agents.json          # Agent 定义
├── examples/
│   ├── basic-usage.js       # 基础使用示例
│   └── parallel-tasks.js    # 并行任务示例
├── docs/
│   ├── architecture.md      # 架构设计文档
│   └── api-reference.md     # API 参考
├── package.json
├── README.md
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

## 🏗️ 架构设计

详见 [docs/architecture.md](docs/architecture.md)

## 📝 许可证

MIT
