/**
 * 并行任务示例
 * 
 * 演示如何并行执行多个独立任务
 */

const { Orchestrator } = require('../src/orchestrator');

async function parallelTasks() {
  console.log('🦞 Multi-Agent Orchestrator - 并行任务示例\n');

  const orchestrator = new Orchestrator({
    maxConcurrency: 5,  // 最多 5 个任务并行
    retryAttempts: 2
  });

  // 模拟一个场景：同时分析多个代码模块
  const modules = [
    'auth',
    'database',
    'api',
    'cache',
    'logging'
  ];

  console.log(`📝 提交 ${modules.length} 个代码分析任务...\n`);

  // 批量提交任务
  const taskPromises = modules.map(module => 
    orchestrator.submitTask({
      id: `analyze-${module}`,
      type: 'analysis',
      payload: {
        task: `分析 ${module} 模块的代码质量`,
        requirements: [
          '检查代码规范',
          '识别潜在 bug',
          '给出优化建议'
        ]
      },
      priority: 'medium'
    })
  );

  const taskIds = await Promise.all(taskPromises);
  console.log(`✅ 已提交任务：${taskIds.join(', ')}\n`);

  // 查看各个任务状态
  console.log('📊 任务状态:');
  taskIds.forEach(taskId => {
    const status = orchestrator.getStatus(taskId);
    console.log(`  ${taskId}: ${status.status}`);
  });
  console.log('');

  // 执行所有任务
  console.log('🚀 开始并行执行...\n');
  const startTime = Date.now();
  
  const result = await orchestrator.execute();
  
  const totalTime = Date.now() - startTime;
  console.log(`\n⏱️  总执行时间：${totalTime}ms`);

  // 输出详细结果
  console.log('\n📋 详细结果:');
  result.results.forEach(r => {
    console.log(`  ✅ ${r.taskId}: ${r.executionTime}ms`);
  });

  if (result.errors.length > 0) {
    console.log('\n⚠️  失败任务:');
    result.errors.forEach(e => {
      console.log(`  ❌ ${e.taskId}: ${e.error}`);
    });
  }

  // 最终统计
  console.log('\n📊 最终统计:');
  console.log(`  总任务数：${result.totalTasks}`);
  console.log(`  成功：${result.completed}`);
  console.log(`  失败：${result.failed}`);
  console.log(`  成功率：${Math.round((result.completed / result.totalTasks) * 100)}%`);
  console.log(`  平均执行时间：${result.averageExecutionTime}ms`);

  return result;
}

// 运行示例
if (require.main === module) {
  parallelTasks().catch(console.error);
}

module.exports = { parallelTasks };
