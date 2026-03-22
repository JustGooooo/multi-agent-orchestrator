/**
 * 结果聚合器 - Result Aggregator
 * 
 * 聚合多个任务的执行结果，生成汇总报告
 */

class ResultAggregator {
  constructor() {
    this.results = [];
  }

  /**
   * 聚合多个任务结果
   */
  aggregate(taskResults) {
    const summary = {
      success: true,
      totalTasks: taskResults.length,
      completed: 0,
      failed: 0,
      cancelled: 0,
      totalExecutionTime: 0,
      results: [],
      errors: [],
      summary: ''
    };

    taskResults.forEach(result => {
      if (result.status === 'completed') {
        summary.completed++;
        summary.totalExecutionTime += result.executionTime || 0;
        summary.results.push({
          taskId: result.taskId,
          status: 'completed',
          result: result.result,
          executionTime: result.executionTime
        });
      } else if (result.status === 'failed') {
        summary.failed++;
        summary.success = false;
        summary.errors.push({
          taskId: result.taskId,
          error: result.error,
          attempts: result.attempts
        });
      } else if (result.status === 'cancelled') {
        summary.cancelled++;
      }
    });

    // 生成汇总报告
    summary.summary = this.generateSummary(summary);
    summary.averageExecutionTime = summary.completed > 0 
      ? Math.round(summary.totalExecutionTime / summary.completed) 
      : 0;

    return summary;
  }

  /**
   * 生成汇总文本
   */
  generateSummary(summary) {
    const lines = [
      `📊 任务执行汇总`,
      ``,
      `总任务数：${summary.totalTasks}`,
      `✅ 完成：${summary.completed}`,
      `❌ 失败：${summary.failed}`,
      `⏸️ 取消：${summary.cancelled}`,
      ``,
      `平均执行时间：${summary.averageExecutionTime}ms`,
      `总执行时间：${summary.totalExecutionTime}ms`,
    ];

    if (summary.errors.length > 0) {
      lines.push(``, `⚠️ 错误详情:`);
      summary.errors.forEach(err => {
        lines.push(`  - ${err.taskId}: ${err.error} (重试 ${err.attempts} 次)`);
      });
    }

    return lines.join('\n');
  }

  /**
   * 导出结果为 JSON
   */
  toJSON(summary) {
    return JSON.stringify(summary, null, 2);
  }

  /**
   * 导出结果为 Markdown 报告
   */
  toMarkdown(summary) {
    const lines = [
      '# 任务执行报告',
      '',
      '## 汇总',
      '',
      `| 指标 | 数值 |`,
      `|------|------|`,
      `| 总任务数 | ${summary.totalTasks} |`,
      `| 完成 | ${summary.completed} |`,
      `| 失败 | ${summary.failed} |`,
      `| 取消 | ${summary.cancelled} |`,
      `| 成功率 | ${Math.round((summary.completed / summary.totalTasks) * 100)}% |`,
      `| 平均执行时间 | ${summary.averageExecutionTime}ms |`,
      '',
    ];

    if (summary.errors.length > 0) {
      lines.push('## 错误详情');
      lines.push('');
      summary.errors.forEach(err => {
        lines.push(`- **${err.taskId}**: ${err.error} (重试 ${err.attempts} 次)`);
      });
      lines.push('');
    }

    if (summary.results.length > 0) {
      lines.push('## 执行结果');
      lines.push('');
      summary.results.forEach(r => {
        lines.push(`### ${r.taskId}`);
        lines.push('');
        lines.push(`- 状态：✅ 完成`);
        lines.push(`- 执行时间：${r.executionTime}ms`);
        lines.push('');
      });
    }

    return lines.join('\n');
  }
}

module.exports = { ResultAggregator };
