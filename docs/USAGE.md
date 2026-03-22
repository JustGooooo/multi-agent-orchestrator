# 使用指南 - Multi-Agent Orchestrator

快速上手指南，教你如何使用多 Agent 协作框架。

---

## 📦 1. 安装与配置

### 1.1 克隆项目

```bash
git clone https://github.com/JustGooooo/multi-agent-orchestrator.git
cd multi-agent-orchestrator
```

### 1.2 安装依赖

```bash
npm install
```

### 1.3 配置 Agent 池

编辑 `config/agents.json`，定义你的 Agent：

```json
{
  "agents": [
    {
      "id": "coder-1",
      "type": "acp",
      "specialty": "coding",
      "model": "qwen-coder-plus",
      "description": "专业编码 Agent"
    },
    {
      "id": "researcher-1",
      "type": "subagent",
      "specialty": "research",
      "model": "qwen3.5-plus",
      "description": "研究分析 Agent"
    }
  ],
  "taskTypeMapping": {
    "coding": ["coder-1"],
    "research": ["researcher-1"]
  }
}
```

**Agent 类型说明：**

| 类型 | 适用场景 | 说明 |
|------|----------|------|
| `acp` | 编码、开发、调试 | 使用 ACP 编码会话，适合复杂编程任务 |
| `subagent` | 研究、写作、分析 | 使用 SubAgent，适合轻量级任务 |

---

## 🚀 2. 快速开始

### 2.1 基础用法

创建一个简单的任务执行脚本：

```javascript
// my-tasks.js
const { Orchestrator } = require('./src/orchestrator');

async function main() {
  // 1. 创建调度器
  const orchestrator = new Orchestrator({
    maxConcurrency: 3,    // 最多 3 个任务并行
    retryAttempts: 2,     // 失败后重试 2 次
    defaultTimeout: 300   // 默认超时 300 秒
  });

  // 2. 提交任务
  await orchestrator.submitTask({
    id: 'task-001',
    type: 'research',
    payload: {
      task: '调研当前最流行的 React 状态管理库',
      requirements: ['比较 Redux、Zustand、Jotai', '给出推荐']
    },
    priority: 'high'
  });

  await orchestrator.submitTask({
    id: 'task-002',
    type: 'coding',
    payload: {
      task: '创建一个用户登录组件',
      requirements: ['React + TypeScript', '支持表单验证']
    },
    priority: 'medium'
  });

  // 3. 执行所有任务
  console.log('开始执行任务...');
  const result = await orchestrator.execute();

  // 4. 查看结果
  console.log(result.summary);
}

main().catch(console.error);
```

运行：
```bash
node my-tasks.js
```

### 2.2 运行示例

项目自带示例：

```bash
# 基础用法示例
npm run example:basic

# 并行任务示例
npm run example:parallel
```

---

## 📋 3. API 参考

### 3.1 Orchestrator（主调度器）

#### 创建实例

```javascript
const orchestrator = new Orchestrator(config);
```

**配置参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxConcurrency` | number | 5 | 最大并发任务数 |
| `retryAttempts` | number | 3 | 失败重试次数 |
| `defaultTimeout` | number | 300 | 默认超时时间（秒） |

#### 提交任务

```javascript
const taskId = await orchestrator.submitTask(taskDefinition);
```

**任务定义：**

```javascript
{
  id: 'task-001',              // 任务 ID（可选，自动生成）
  type: 'coding',              // 任务类型：coding/research/writing/analysis/review
  payload: {                   // 任务内容
    task: '具体任务描述',
    requirements: ['要求 1', '要求 2']
  },
  priority: 'high',            // 优先级：high/medium/low
  timeoutSeconds: 600,         // 超时时间（可选）
  retryAttempts: 3             // 重试次数（可选）
}
```

#### 执行任务

```javascript
const result = await orchestrator.execute();
```

**返回结果：**

```javascript
{
  success: true,
  totalTasks: 3,
  completed: 2,
  failed: 1,
  cancelled: 0,
  totalExecutionTime: 5420,
  averageExecutionTime: 2710,
  results: [
    {
      taskId: 'task-001',
      status: 'completed',
      result: { /* 任务结果 */ },
      executionTime: 2500
    }
  ],
  errors: [
    {
      taskId: 'task-002',
      error: '执行超时',
      attempts: 3
    }
  ],
  summary: '📊 任务执行汇总...\n...'
}
```

#### 查询状态

```javascript
const status = orchestrator.getStatus('task-001');
```

**返回：**

```javascript
{
  id: 'task-001',
  status: 'running',         // pending/running/completed/failed/cancelled
  type: 'coding',
  priority: 'high',
  attempts: 1,
  createdAt: '2026-03-22T19:00:00.000Z',
  startedAt: '2026-03-22T19:00:05.000Z',
  error: null
}
```

#### 取消任务

```javascript
const result = await orchestrator.cancel('task-001');
```

#### 获取统计

```javascript
const stats = orchestrator.getStats();
```

**返回：**

```javascript
{
  totalTasks: 10,
  pending: 2,
  running: 3,
  completed: 4,
  failed: 1
}
```

---

## 🎯 4. 使用场景

### 4.1 并行分析多个模块

```javascript
const modules = ['auth', 'database', 'api', 'cache'];

// 批量提交
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

// 执行
const result = await orchestrator.execute();
```

### 4.2 流水线任务（顺序执行）

```javascript
// 1. 需求分析
await orchestrator.submitTask({
  id: 'step-1-analysis',
  type: 'analysis',
  payload: { task: '分析需求文档...' },
  priority: 'high'
});

const analysisResult = await orchestrator.execute();

// 2. 编码实现
await orchestrator.submitTask({
  id: 'step-2-coding',
  type: 'coding',
  payload: { 
    task: '根据分析结果实现代码...',
    context: analysisResult.results[0].result
  },
  priority: 'high'
});

const codingResult = await orchestrator.execute();

// 3. 代码审查
await orchestrator.submitTask({
  id: 'step-3-review',
  type: 'review',
  payload: { 
    task: '审查代码质量...',
    codeReview: codingResult.results[0].result
  },
  priority: 'medium'
});

const finalResult = await orchestrator.execute();
```

### 4.3 批量文档生成

```javascript
const apiEndpoints = [
  '/users', '/posts', '/comments', '/tags'
];

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

// 导出 Markdown 报告
const { ResultAggregator } = require('./src/result-aggregator');
const aggregator = new ResultAggregator();
const report = aggregator.toMarkdown(result);

// 保存到文件
const fs = require('fs');
fs.writeFileSync('api-docs.md', report);
```

### 4.4 定时任务（配合 cron）

```javascript
// 每天凌晨 2 点执行代码质量检查
const cron = require('cron');

const job = new cron.CronJob('0 2 * * *', async () => {
  console.log('开始每日代码质量检查...');
  
  await orchestrator.submitTask({
    id: `daily-check-${Date.now()}`,
    type: 'review',
    payload: {
      task: '检查今日代码变更的质量',
      requirements: ['代码规范', '测试覆盖率', '性能问题']
    },
    priority: 'medium'
  });
  
  const result = await orchestrator.execute();
  console.log(result.summary);
});

job.start();
```

---

## 🔧 5. 高级配置

### 5.1 自定义 Agent 选择逻辑

继承 Orchestrator 并重写 `selectAgentType` 方法：

```javascript
const { Orchestrator } = require('./src/orchestrator');

class CustomOrchestrator extends Orchestrator {
  selectAgentType(taskType) {
    // 自定义路由逻辑
    if (taskType === 'urgent-coding') {
      return 'acp';  // 紧急编码任务用 ACP
    }
    if (taskType === 'simple-query') {
      return 'subagent';  // 简单查询用 subagent
    }
    return super.selectAgentType(taskType);
  }
}

const orchestrator = new CustomOrchestrator();
```

### 5.2 自定义结果处理

```javascript
const { ResultAggregator } = require('./src/result-aggregator');

class CustomAggregator extends ResultAggregator {
  aggregate(taskResults) {
    const summary = super.aggregate(taskResults);
    
    // 添加自定义处理
    summary.customField = '自定义数据';
    summary.timestamp = new Date().toISOString();
    
    return summary;
  }
}
```

### 5.3 任务持久化（Redis）

```javascript
// 未来扩展：使用 Redis 持久化任务队列
const { RedisTaskQueue } = require('./src/redis-task-queue');

const orchestrator = new Orchestrator({
  taskQueue: new RedisTaskQueue({
    redisUrl: 'redis://localhost:6379',
    queueName: 'agent-tasks'
  })
});
```

---

## 📊 6. 监控与调试

### 6.1 查看日志

```javascript
const { Logger } = require('./src/logger');
const logger = new Logger('MyApp');

logger.info('任务开始');
logger.warn('警告信息');
logger.error('错误信息');
logger.debug('调试信息');

// 导出日志
const logs = logger.getRecent(100);
console.log(logger.toText());
```

### 6.2 任务追踪

```javascript
// 提交任务后追踪状态
const taskId = await orchestrator.submitTask({...});

// 轮询状态
const checkStatus = async () => {
  const status = orchestrator.getStatus(taskId);
  console.log(`任务 ${taskId} 状态：${status.status}`);
  
  if (status.status === 'pending' || status.status === 'running') {
    setTimeout(checkStatus, 5000);  // 5 秒后再次检查
  } else {
    console.log('任务完成！');
  }
};

checkStatus();
```

### 6.3 性能监控

```javascript
const startTime = Date.now();
const result = await orchestrator.execute();
const totalTime = Date.now() - startTime;

console.log(`总执行时间：${totalTime}ms`);
console.log(`平均任务时间：${result.averageExecutionTime}ms`);
console.log(`成功率：${Math.round((result.completed / result.totalTasks) * 100)}%`);
```

---

## ⚠️ 7. 注意事项

### 7.1 并发控制

- 默认最大并发：5 个任务
- 过多并发可能导致资源竞争
- 根据系统负载调整 `maxConcurrency`

### 7.2 超时设置

- 简单任务：60-120 秒
- 复杂编码：300-600 秒
- 研究分析：180-300 秒

### 7.3 错误处理

```javascript
try {
  const result = await orchestrator.execute();
  if (!result.success) {
    console.log('部分任务失败：');
    result.errors.forEach(err => {
      console.log(`  - ${err.taskId}: ${err.error}`);
    });
  }
} catch (error) {
  console.error('执行失败：', error);
}
```

### 7.4 资源清理

- SubAgent 任务完成后自动清理（`cleanup: 'delete'`）
- ACP 任务保留历史（`cleanup: 'keep'`）便于追溯
- 定期清理日志文件

---

## 🆘 8. 常见问题

### Q: 任务一直 pending 怎么办？

A: 检查并发限制是否已满：
```javascript
const stats = orchestrator.getStats();
console.log(`运行中：${stats.running}, 等待中：${stats.pending}`);
```

### Q: 如何设置任务优先级？

A: 提交时指定 `priority` 字段：
```javascript
{
  priority: 'high'    // high > medium > low
}
```

### Q: 任务失败后会自动重试吗？

A: 会。默认重试 3 次，可在配置中修改：
```javascript
{
  retryAttempts: 5  // 重试 5 次
}
```

### Q: 如何获取单个任务的详细结果？

A: 从执行结果中查找：
```javascript
const taskResult = result.results.find(r => r.taskId === 'task-001');
console.log(taskResult.result);
```

---

## 📚 9. 相关文档

- [架构设计](docs/architecture.md) - 详细的架构说明
- [README](README.md) - 项目概述
- [API Reference](docs/api-reference.md) - 完整 API 文档

---

## 🤝 10. 贡献

欢迎提交 Issue 和 Pull Request！

项目地址：https://github.com/JustGooooo/multi-agent-orchestrator
