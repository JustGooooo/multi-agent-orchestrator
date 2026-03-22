# 架构设计文档

## 概述

Multi-Agent Orchestrator 是一个基于 OpenClaw 的多 Agent 协作框架，采用**主从调度模式**，支持混合 runtime（subagent + acp）的任务执行。

## 核心组件

```
┌─────────────────────────────────────────────────────────┐
│                    User / Client                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Orchestrator                          │
│              (主调度器 - 单点入口)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Task Queue  │  │ Agent Pool  │  │ Result          │  │
│  │ (任务队列)  │  │ (Agent 池)  │  │ Aggregator      │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  SubAgent 1  │ │  SubAgent 2  │ │   ACP 1      │
    │  (research)  │ │  (writing)   │ │   (coding)   │
    └──────────────┘ └──────────────┘ └──────────────┘
```

## 组件职责

### 1. Orchestrator（主调度器）

**职责：**
- 接收用户任务
- 任务分类与路由
- Agent 调度与分配
- 执行流程控制
- 错误处理与重试

**关键方法：**
```javascript
submitTask(task)      // 提交任务
execute()             // 执行队列
getStatus(taskId)     // 查询状态
cancel(taskId)        // 取消任务
```

### 2. TaskQueue（任务队列）

**职责：**
- 任务优先级排序
- 并发控制
- 任务状态管理

**特性：**
- 支持高/中/低优先级
- 可配置最大并发数
- FIFO + 优先级混合调度

### 3. Agent Pool（Agent 资源池）

**职责：**
- Agent 注册与发现
- Agent 状态追踪
- 负载均衡

**Agent 类型：**
| 类型 | Runtime | 适用场景 | 清理策略 |
|------|---------|----------|----------|
| subagent | `subagent` | 研究、写作、分析 | delete |
| acp | `acp` | 编码、开发、调试 | keep |

### 4. Result Aggregator（结果聚合器）

**职责：**
- 收集各 Agent 执行结果
- 生成汇总报告
- 错误信息整理

**输出格式：**
- JSON（程序化使用）
- Markdown（人工阅读）
- 纯文本（日志记录）

## 任务执行流程

```
1. 用户提交任务
         │
         ▼
2. 任务入队（按优先级排序）
         │
         ▼
3. Orchestrator 检查并发限制
         │
         ▼
4. 选择合适 Agent 类型
    ├─ coding/development → acp
    └─ research/writing/analysis → subagent
         │
         ▼
5. 执行任务（sessions_spawn）
         │
         ▼
6. 监控执行状态
    ├─ 成功 → 记录结果
    ├─ 失败 → 重试（最多 N 次）
    └─ 超时 → 标记失败
         │
         ▼
7. 聚合所有结果
         │
         ▼
8. 返回汇总报告
```

## 错误处理策略

### 重试机制

```javascript
{
  retryAttempts: 3,      // 最大重试次数
  retryDelay: 1000,      // 重试间隔（ms）
  backoff: 'exponential' // 退避策略：linear | exponential
}
```

### 超时控制

```javascript
{
  defaultTimeout: 300,   // 默认超时（秒）
  hardTimeout: 600       // 硬超时（强制终止）
}
```

### 故障恢复

- 任务失败后自动重试
- 超过重试次数后标记为失败
- 记录错误日志供后续分析
- 不影响其他任务执行

## 扩展点

### 1. 自定义 Agent 类型

```javascript
// 在 config/agents.json 中添加新 Agent
{
  "id": "custom-agent-1",
  "type": "subagent",
  "specialty": "custom",
  "model": "custom-model"
}
```

### 2. 自定义任务路由

```javascript
// 继承 Orchestrator 并重写 selectAgentType
class CustomOrchestrator extends Orchestrator {
  selectAgentType(taskType) {
    // 自定义路由逻辑
  }
}
```

### 3. 自定义结果处理

```javascript
// 继承 ResultAggregator 并重写 aggregate
class CustomAggregator extends ResultAggregator {
  aggregate(results) {
    // 自定义聚合逻辑
  }
}
```

## 性能考虑

### 并发控制

- 默认最大并发：5 个任务
- 可根据系统负载调整
- 避免过多 Agent 同时运行导致资源竞争

### 内存管理

- SubAgent 任务完成后自动清理（cleanup: delete）
- ACP 任务保留历史（cleanup: keep）便于追溯
- 定期清理日志文件

### 任务持久化（未来扩展）

- 支持将队列持久化到 Redis/数据库
- 支持系统重启后恢复任务
- 支持分布式部署

## 安全考虑

- 任务 Payload 验证
- Agent 执行权限控制
- 敏感信息脱敏
- 执行结果审计日志

## 监控与可观测性

### 日志级别

- `INFO`: 正常执行信息
- `WARN`: 可恢复错误
- `ERROR`: 任务失败
- `DEBUG`: 调试信息

### 关键指标

- 任务吞吐量（tasks/min）
- 平均执行时间
- 成功率
- Agent 利用率

## 未来规划

- [ ] 支持 Redis 任务队列（分布式）
- [ ] 支持 WebSocket 实时推送
- [ ] 支持任务依赖图（DAG）
- [ ] 支持 Agent 热插拔
- [ ] 支持任务优先级动态调整
