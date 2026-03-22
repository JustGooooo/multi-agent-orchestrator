/**
 * 基础使用示例
 * 
 * 演示如何使用 Orchestrator 提交和执行任务
 */

const { Orchestrator } = require('../src/orchestrator');

async function basicUsage() {
  console.log('🦞 Multi-Agent Orchestrator - 基础示例\n');

  // 创建调度器实例
  const orchestrator = new Orchestrator({
    maxConcurrency: 3,
    retryAttempts: 2,
    defaultTimeout: 120
  });

  // 提交多个任务
  console.log('📝 提交任务...\n');

  const task1 = await orchestrator.submitTask({
    id: 'task-research-001',
    type: 'research',
    payload: {
      task: '调研当前最流行的 React 状态管理库',
      requirements: ['比较 Redux、Zustand、Jotai', '给出推荐']
    },
    priority: 'high'
  });

  const task2 = await orchestrator.submitTask({
    id: 'task-code-001',
    type: 'coding',
    payload: {
      task: '创建一个用户登录组件',
      requirements: ['React + TypeScript', '支持邮箱/密码登录', '包含表单验证']
    },
    priority: 'medium'
  });

  const task3 = await orchestrator.submitTask({
    id: 'task-write-001',
    type: 'writing',
    payload: {
      task: '撰写 API 文档',
      requirements: ['包含所有端点说明', '提供使用示例', 'Markdown 格式']
    },
    priority: 'low'
  });

  console.log(`✅ 已提交 3 个任务：${task1}, ${task2}, ${task3}\n`);

  // 查看队列状态
  const stats = orchestrator.getStats();
  console.log('📊 队列状态:', JSON.stringify(stats, null, 2), '\n');

  // 执行所有任务
  console.log('🚀 开始执行任务...\n');
  const result = await orchestrator.execute();

  // 输出结果
  console.log('\n📋 执行结果汇总:');
  console.log(result.summary);

  // 导出 Markdown 报告
  const { ResultAggregator } = require('../src/result-aggregator');
  const aggregator = new ResultAggregator();
  const markdownReport = aggregator.toMarkdown(result);
  console.log('\n📄 Markdown 报告:');
  console.log(markdownReport);

  return result;
}

// 运行示例
if (require.main === module) {
  basicUsage().catch(console.error);
}

module.exports = { basicUsage };
