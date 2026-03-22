/**
 * 日志系统 - Logger
 * 
 * 统一的日志记录，支持不同级别和输出格式
 */

class Logger {
  constructor(module) {
    this.module = module;
    this.enabled = true;
    this.logs = [];
  }

  /**
   * 信息日志
   */
  info(message, ...args) {
    this.log('INFO', message, args);
  }

  /**
   * 警告日志
   */
  warn(message, ...args) {
    this.log('WARN', message, args);
  }

  /**
   * 错误日志
   */
  error(message, ...args) {
    this.log('ERROR', message, args);
  }

  /**
   * 调试日志
   */
  debug(message, ...args) {
    this.log('DEBUG', message, args);
  }

  /**
   * 核心日志方法
   */
  log(level, message, args = []) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      module: this.module,
      message,
      args
    };

    this.logs.push(logEntry);

    // 控制台输出
    if (this.enabled) {
      const prefix = `[${timestamp}] [${level}] [${this.module}]`;
      const formattedMessage = typeof message === 'string' 
        ? message 
        : JSON.stringify(message);
      
      switch (level) {
        case 'ERROR':
          console.error(prefix, formattedMessage, ...args);
          break;
        case 'WARN':
          console.warn(prefix, formattedMessage, ...args);
          break;
        default:
          console.log(prefix, formattedMessage, ...args);
      }
    }
  }

  /**
   * 获取所有日志
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * 获取最近 N 条日志
   */
  getRecent(count = 100) {
    return this.logs.slice(-count);
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = [];
  }

  /**
   * 导出日志为 JSON
   */
  toJSON() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导出日志为文本
   */
  toText() {
    return this.logs.map(log => {
      const argsStr = log.args.length > 0 
        ? ' ' + log.args.map(a => JSON.stringify(a)).join(' ') 
        : '';
      return `[${log.timestamp}] [${log.level}] [${log.module}] ${log.message}${argsStr}`;
    }).join('\n');
  }

  /**
   * 根据级别过滤日志
   */
  filterByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * 搜索日志
   */
  search(keyword) {
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

module.exports = { Logger };
