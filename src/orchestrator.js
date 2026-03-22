/**
 * 主调度器 - Multi-Agent Orchestrator
 * 
 * 负责接收任务、调度 Agent、管理执行流程
 */

const { spawnSubAgent } = require('./agent-spawner');
const { TaskQueue } = require('./task-queue');
const { ResultAggregator } = require('./result-aggregator');
const { Logger } = require('./logger');

class Orchestrator {
  constructor(config = {}) {
    this.config = {
      maxConcurrency: config.maxConcurrency || 5,
      retryAttempts: config.retryAttempts || 3,
      defaultTimeout: config.defaultTimeout || 300,
      ...config
    };
    
    this.taskQueue = new TaskQueue({
      maxConcurrency: this.config.maxConcurrency
    });
    
    this.resultAggregator = new ResultAggregator();
    this.logger = new Logger('Orchestrator');
    
    this.activeTasks = new Map();
    this.agentPool = new Map();
  }

  /**
   * 提交任务到队列
   */
  async submitTask(taskDefinition) {
    const task = {
      id: taskDefinition.id || `task-${Date.now()}`,
      type: taskDefinition.type,
      payload: taskDefinition.payload,
      priority: taskDefinition.priority || 'medium',
      timeoutSeconds: taskDefinition.timeoutSeconds || this.config.defaultTimeout,
      retryAttempts: taskDefinition.retryAttempts || this.config.retryAttempts,
      status: 'pending',
      createdAt: new Date().toISOString(),
      attempts: 0
    };

    this.logger.info(`提交任务：${task.id} (类型：${task.type}, 优先级：${task.priority})`);
    
    await this.taskQueue.enqueue(task);
    this.activeTasks.set(task.id, task);
    
    return task.id;
  }

  /**
   * 执行所有待处理任务
   */
  async execute() {
    this.logger.info('开始执行任务队列');
    
    const results = [];
    const pendingTasks = this.taskQueue.getPendingTasks();
    
    if (pendingTasks.length === 0) {
      this.logger.info('没有待处理的任务');
      return { success: true, results: [] };
    }

    // 按优先级排序
    pendingTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // 并发执行
    const executionPromises = pendingTasks.map(task => 
      this.executeTask(task).catch(error => {
        this.logger.error(`任务 ${task.id} 执行失败：`, error);
        return { taskId: task.id, status: 'failed', error: error.message };
      })
    );

    const taskResults = await Promise.all(executionPromises);
    results.push(...taskResults);

    // 聚合结果
    const aggregatedResult = this.resultAggregator.aggregate(results);
    
    this.logger.info(`任务执行完成：成功 ${results.filter(r => r.status === 'completed').length}/${results.length}`);
    
    return aggregatedResult;
  }

  /**
   * 执行单个任务
   */
  async executeTask(task) {
    this.logger.info(`执行任务：${task.id}`);
    
    task.status = 'running';
    task.startedAt = new Date().toISOString();
    task.attempts += 1;

    try {
      // 根据任务类型选择合适的 Agent
      const agentType = this.selectAgentType(task.type);
      
      this.logger.info(`任务 ${task.id} 使用 ${agentType} runtime`);

      // 执行任务
      const result = await this.runTask(task, agentType);
      
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;

      this.logger.info(`任务 ${task.id} 完成`);
      
      return {
        taskId: task.id,
        status: 'completed',
        result: result,
        executionTime: Date.now() - new Date(task.startedAt).getTime()
      };

    } catch (error) {
      // 重试逻辑
      if (task.attempts < task.retryAttempts) {
        this.logger.warn(`任务 ${task.id} 失败，第 ${task.attempts} 次重试...`);
        task.status = 'pending';
        await this.taskQueue.enqueue(task); // 重新入队
        throw error;
      } else {
        task.status = 'failed';
        task.error = error.message;
        task.failedAt = new Date().toISOString();
        
        this.logger.error(`任务 ${task.id} 最终失败：${error.message}`);
        
        return {
          taskId: task.id,
          status: 'failed',
          error: error.message,
          attempts: task.attempts
        };
      }
    }
  }

  /**
   * 根据任务类型选择 Agent runtime
   */
  selectAgentType(taskType) {
    const typeMapping = {
      'coding': 'acp',           // 编码任务用 ACP
      'development': 'acp',
      'research': 'subagent',    // 研究任务用 subagent
      'analysis': 'subagent',
      'writing': 'subagent',
      'review': 'subagent',
      'default': 'subagent'
    };
    
    return typeMapping[taskType] || typeMapping['default'];
  }

  /**
   * 运行任务
   */
  async runTask(task, agentType) {
    if (agentType === 'acp') {
      return await this.runACPTask(task);
    } else {
      return await this.runSubAgentTask(task);
    }
  }

  /**
   * 执行 ACP 任务（复杂编码）
   */
  async runACPTask(task) {
    const { sessions_spawn } = require('openclaw-tools');
    
    const result = await sessions_spawn({
      task: JSON.stringify(task.payload),
      runtime: 'acp',
      mode: 'run',
      timeoutSeconds: task.timeoutSeconds,
      cleanup: 'keep'
    });

    return result;
  }

  /**
   * 执行 SubAgent 任务（简单任务）
   */
  async runSubAgentTask(task) {
    const { sessions_spawn } = require('openclaw-tools');
    
    const result = await sessions_spawn({
      task: JSON.stringify(task.payload),
      runtime: 'subagent',
      mode: 'run',
      timeoutSeconds: task.timeoutSeconds,
      cleanup: 'delete'
    });

    return result;
  }

  /**
   * 获取任务状态
   */
  getStatus(taskId) {
    const task = this.activeTasks.get(taskId);
    if (!task) {
      return { error: 'Task not found' };
    }
    
    return {
      id: task.id,
      status: task.status,
      type: task.type,
      priority: task.priority,
      attempts: task.attempts,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      error: task.error
    };
  }

  /**
   * 取消任务
   */
  async cancel(taskId) {
    const task = this.activeTasks.get(taskId);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    if (task.status === 'completed' || task.status === 'failed') {
      return { success: false, error: 'Task already finished' };
    }

    task.status = 'cancelled';
    await this.taskQueue.remove(taskId);
    
    this.logger.info(`任务 ${taskId} 已取消`);
    
    return { success: true, taskId };
  }

  /**
   * 获取队列统计
   */
  getStats() {
    return {
      totalTasks: this.activeTasks.size,
      pending: this.taskQueue.getPendingTasks().length,
      running: Array.from(this.activeTasks.values()).filter(t => t.status === 'running').length,
      completed: Array.from(this.activeTasks.values()).filter(t => t.status === 'completed').length,
      failed: Array.from(this.activeTasks.values()).filter(t => t.status === 'failed').length
    };
  }
}

module.exports = { Orchestrator };
