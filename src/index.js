/**
 * USDC Portfolio Manager - OpenClaw Skill
 * Main entry point for portfolio management skill
 */

const PortfolioManager = require('./portfolio/manager');
const RiskEngine = require('./risk/engine');
const DCAScheduler = require('./dca/scheduler');

class USDCPortfolioManager {
  constructor(config = {}) {
    this.config = config;
    this.portfolioManager = new PortfolioManager(config);
    this.riskEngine = new RiskEngine(config);
    this.dcaScheduler = new DCAScheduler(config);
    
    this.commands = {
      'portfolio status': this.getPortfolioStatus.bind(this),
      'portfolio holdings': this.getHoldings.bind(this),
      'portfolio risk': this.getRiskMetrics.bind(this),
      'portfolio rebalance': this.rebalancePortfolio.bind(this),
      'portfolio dca list': this.listDCASchedules.bind(this),
      'portfolio dca add': this.addDCASchedule.bind(this),
      'portfolio dca execute': this.executeDCA.bind(this),
    };
  }
  
  /**
   * Get portfolio summary
   */
  async getPortfolioStatus(options = {}) {
    try {
      const status = await this.portfolioManager.getStatus(options);
      const risk = await this.riskEngine.analyze(status);
      
      return {
        success: true,
        data: {
          totalValue: status.totalValue,
          usdcValue: status.usdcValue,
          tokenValue: status.tokenValue,
          allocation: status.allocation,
          riskAlerts: risk.alerts,
          needsRebalancing: risk.needsRebalancing,
          performance: status.performance,
        },
        message: 'Portfolio status retrieved',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get portfolio status',
      };
    }
  }
  
  /**
   * Get detailed holdings across all chains
   */
  async getHoldings(options = {}) {
    try {
      const holdings = await this.portfolioManager.getHoldings(options);
      return {
        success: true,
        data: holdings,
        message: 'Holdings retrieved',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get holdings',
      };
    }
  }
  
  /**
   * Get risk metrics and alerts
   */
  async getRiskMetrics(options = {}) {
    try {
      const status = await this.portfolioManager.getStatus(options);
      const risk = await this.riskEngine.analyze(status);
      
      return {
        success: true,
        data: {
          metrics: risk.metrics,
          alerts: risk.alerts,
          concentration: risk.concentration,
          volatility: risk.volatility,
          recommendations: risk.recommendations,
        },
        message: 'Risk metrics calculated',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to calculate risk metrics',
      };
    }
  }
  
  /**
   * Rebalance portfolio to target allocations
   */
  async rebalancePortfolio(options = {}) {
    try {
      if (options.dryRun) {
        const plan = await this.portfolioManager.getRebalancePlan(options);
        return {
          success: true,
          data: plan,
          message: 'Rebalance plan generated (dry run)',
          dryRun: true,
        };
      }
      
      const result = await this.portfolioManager.executeRebalance(options);
      return {
        success: true,
        data: result,
        message: 'Portfolio rebalanced successfully',
        transactions: result.transactions,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to rebalance portfolio',
      };
    }
  }
  
  /**
   * List all DCA schedules
   */
  async listDCASchedules(options = {}) {
    try {
      const schedules = await this.dcaScheduler.listSchedules(options);
      return {
        success: true,
        data: schedules,
        message: 'DCA schedules retrieved',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to list DCA schedules',
      };
    }
  }
  
  /**
   * Add a new DCA schedule
   */
  async addDCASchedule(options = {}) {
    try {
      const schedule = await this.dcaScheduler.addSchedule(options);
      return {
        success: true,
        data: schedule,
        message: 'DCA schedule added',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to add DCA schedule',
      };
    }
  }
  
  /**
   * Execute a DCA schedule
   */
  async executeDCA(options = {}) {
    try {
      const result = await this.dcaScheduler.executeSchedule(options);
      return {
        success: true,
        data: result,
        message: 'DCA executed successfully',
        transaction: result.transaction,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to execute DCA',
      };
    }
  }
  
  /**
   * Handle OpenClaw command
   */
  async handleCommand(command, args = {}) {
    if (this.commands[command]) {
      return await this.commands[command](args);
    }
    
    return {
      success: false,
      error: `Unknown command: ${command}`,
      message: 'Available commands: ' + Object.keys(this.commands).join(', '),
    };
  }
  
  /**
   * Export for OpenClaw skill format
   */
  static getSkill() {
    return {
      name: 'usdc-portfolio-manager',
      description: 'Manage crypto portfolios with USDC as base currency',
      version: '1.0.0',
      commands: [
        {
          name: 'portfolio status',
          description: 'Get portfolio summary',
          usage: 'portfolio status [--chain <chain>]',
        },
        {
          name: 'portfolio holdings',
          description: 'Get detailed holdings',
          usage: 'portfolio holdings [--chain <chain>]',
        },
        {
          name: 'portfolio risk',
          description: 'Get risk metrics and alerts',
          usage: 'portfolio risk',
        },
        {
          name: 'portfolio rebalance',
          description: 'Rebalance portfolio',
          usage: 'portfolio rebalance [--dry-run] [--execute]',
        },
        {
          name: 'portfolio dca list',
          description: 'List DCA schedules',
          usage: 'portfolio dca list',
        },
        {
          name: 'portfolio dca add',
          description: 'Add DCA schedule',
          usage: 'portfolio dca add --token <token> --amount <usdc> --frequency <interval>',
        },
        {
          name: 'portfolio dca execute',
          description: 'Execute DCA schedule',
          usage: 'portfolio dca execute --schedule-id <id>',
        },
      ],
      initialize: (config) => new USDCPortfolioManager(config),
    };
  }
}

module.exports = USDCPortfolioManager;