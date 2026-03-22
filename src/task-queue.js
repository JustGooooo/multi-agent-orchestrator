/**
 * 任务队列 - Task Queue
 * 
 * 管理任务的优先级、并发控制和状态
 */

class TaskQueue {
  constructor(config = {}) {
    this.maxConcurrency = config.maxConcurrency || 5;
    this.queue = [];
    this.running = new Set();
  }

  /**
   * 入队任务
   */
  async enqueue(task) {
    this.queue.push(task);
    // 按优先级排序
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * 出队任务（考虑并发限制）
   */
  async dequeue() {
    if (this.running.size >= this.maxConcurrency) {
      return null;
    }
    
    if (this.queue.length === 0) {
      return null;
    }

    const task = this.queue.shift();
    this.running.add(task.id);
    return task;
  }

  /**
   * 标记任务完成
   */
  complete(taskId) {
    this.running.delete(taskId);
  }

  /**
   * 获取所有待处理任务
   */
  getPendingTasks() {
    return [...this.queue];
  }

  /**
   * 获取运行中任务
   */
  getRunningTasks() {
    return Array.from(this.running);
  }

  /**
   * 移除任务
   */
  async remove(taskId) {
    const index = this.queue.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue = [];
    this.running.clear();
  }

  /**
   * 队列长度
   */
  size() {
    return this.queue.length;
  }

  /**
   * 是否可接受新任务
   */
  canAccept() {
    return this.running.size < this.maxConcurrency;
  }
}

module.exports = { TaskQueue };
