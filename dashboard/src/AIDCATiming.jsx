import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIDCATiming = () => {
  const [marketData, setMarketData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [optimalTiming, setOptimalTiming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);

  // Mock AI prediction model (replace with actual ML API)
  const generateAIPredictions = () => {
    // Simulate market data
    const mockMarketData = [];
    const mockPredictions = [];
    const insights = [];

    // Generate 24 hours of data
    for (let i = 0; i < 24; i++) {
      const hour = i;
      const price = 2500 + Math.sin(hour * 0.5) * 100 + Math.random() * 50;
      const volume = 1000 + Math.random() * 500;
      const sentiment = 0.5 + Math.sin(hour * 0.3) * 0.3;
      
      mockMarketData.push({
        hour: `${hour}:00`,
        price,
        volume,
        sentiment: sentiment * 100,
      });

      // AI prediction (simplified)
      const predictedAction = sentiment > 0.6 ? 'BUY' : sentiment < 0.4 ? 'HOLD' : 'SELL';
      const confidence = Math.abs(sentiment - 0.5) * 100;
      
      mockPredictions.push({
        hour: `${hour}:00`,
        action: predictedAction,
        confidence: Math.round(confidence),
        optimalAmount: Math.round(500 * (1 + sentiment - 0.5)),
      });
    }

    // Find optimal timing
    const bestBuy = mockPredictions
      .filter(p => p.action === 'BUY')
      .sort((a, b) => b.confidence - a.confidence)[0];

    const bestSell = mockPredictions
      .filter(p => p.action === 'SELL')
      .sort((a, b) => b.confidence - a.confidence)[0];

    // Generate AI insights
    insights.push({
      id: 1,
      title: 'Market Sentiment Analysis',
      description: 'Bullish signals detected with 78% confidence. Recommended DCA increase by 25%.',
      impact: 'high',
      type: 'optimization'
    });

    insights.push({
      id: 2,
      title: 'Volatility Alert',
      description: 'ETH volatility spiked 42% in last 4 hours. AI suggests reducing DCA amount temporarily.',
      impact: 'medium',
      type: 'risk'
    });

    insights.push({
      id: 3,
      title: 'Optimal Execution Window',
      description: 'Next 2 hours show strongest buy signals (82% confidence). Schedule extra DCA stream.',
      impact: 'high',
      type: 'timing'
    });

    return {
      marketData: mockMarketData,
      predictions: mockPredictions,
      optimalTiming: {
        bestBuy,
        bestSell,
        overallScore: 82,
        recommendation: 'Increase DCA by 30% in next 4 hours'
      },
      insights
    };
  };

  useEffect(() => {
    // Simulate API call to AI service
    setTimeout(() => {
      const aiData = generateAIPredictions();
      setMarketData(aiData.marketData);
      setPredictions(aiData.predictions);
      setOptimalTiming(aiData.optimalTiming);
      setAiInsights(aiData.insights);
      setLoading(false);
    }, 1640);
  }, []);

  if (loading) {
    return (
      <div className="ai-loading">
        <div className="ai-spinner"></div>
        <div>AI analyzing market patterns...</div>
      </div>
    );
  }

  return (
    <div className="ai-dca-timing">
      <div className="ai-header">
        <h2>🤖 AI-Powered DCA Timing</h2>
        <div className="ai-subtitle">Machine Learning optimized dollar-cost averaging</div>
      </div>

      <div className="ai-metrics">
        <div className="ai-metric-card">
          <div className="ai-metric-label">Optimal Timing Score</div>
          <div className="ai-metric-value">{optimalTiming.overallScore}/100</div>
          <div className="ai-metric-desc">AI Confidence Level</div>
        </div>
        
        <div className="ai-metric-card">
          <div className="ai-metric-label">Recommended Action</div>
          <div className="ai-metric-action">{optimalTiming.recommendation}</div>
          <div className="ai-metric-desc">Based on 24h analysis</div>
        </div>
        
        <div className="ai-metric-card">
          <div className="ai-metric-label">Best Buy Window</div>
          <div className="ai-metric-value">{optimalTiming.bestBuy?.hour || 'N/A'}</div>
          <div className="ai-metric-desc">{optimalTiming.bestBuy?.confidence || 0}% confidence</div>
        </div>
      </div>

      <div className="ai-charts-section">
        <div className="ai-chart-card">
          <div className="chart-title">Market Sentiment & Price</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
              <XAxis dataKey="hour" stroke="#66767D" />
              <YAxis yAxisId="left" stroke="#66767D" />
              <YAxis yAxisId="right" orientation="right" stroke="#66767D" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="price" 
                stroke="#7E54F1" 
                strokeWidth={3}
                name="Price (USD)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="sentiment" 
                stroke="#00D4AA" 
                strokeWidth={2}
                name="Sentiment %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ai-chart-card">
          <div className="chart-title">AI Predictions (Next 24h)</div>
          <div className="predictions-table">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Confidence</th>
                  <th>Optimal Amount</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 8).map((pred, idx) => (
                  <tr key={idx} className={`prediction-${pred.action.toLowerCase()}`}>
                    <td>{pred.hour}</td>
                    <td>
                      <span className={`action-badge ${pred.action.toLowerCase()}`}>
                        {pred.action}
                      </span>
                    </td>
                    <td>{pred.confidence}%</td>
                    <td>${pred.optimalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="predictions-summary">
            <div className="summary-item">
              <span className="summary-label">Total Buy Signals:</span>
              <span className="summary-value">
                {predictions.filter(p => p.action === 'BUY').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg Confidence:</span>
              <span className="summary-value">
                {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ai-insights-section">
        <div className="insights-header">
          <h3>AI Insights & Recommendations</h3>
          <div className="insights-subtitle">Real-time market intelligence</div>
        </div>
        
        <div className="insights-grid">
          {aiInsights.map(insight => (
            <div key={insight.id} className={`insight-card ${insight.impact}`}>
              <div className="insight-icon">
                {insight.type === 'optimization' ? '🚀' : 
                 insight.type === 'risk' ? '⚠️' : '⏰'}
              </div>
              <div className="insight-content">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-desc">{insight.description}</div>
                <div className="insight-meta">
                  <span className={`impact-${insight.impact}`}>
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                  <span className="insight-type">{insight.type}</span>
                </div>
              </div>
              <div className="insight-actions">
                <button className="btn btn-small btn-primary">Apply</button>
                <button className="btn btn-small btn-text">Ignore</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-actions">
        <div className="ai-actions-header">
          <h4>Automated DCA Adjustments</h4>
          <div className="ai-actions-subtitle">Let AI optimize your streams</div>
        </div>
        
        <div className="ai-controls">
          <div className="control-group">
            <label>AI Autopilot Mode</label>
            <div className="toggle-switch">
              <input type="checkbox" id="autopilot" />
              <label htmlFor="autopilot" className="toggle-slider"></label>
            </div>
            <div className="control-desc">Allow AI to adjust DCA amounts automatically</div>
          </div>
          
          <div className="control-group">
            <label>Risk Tolerance</label>
            <select className="risk-select">
              <option value="conservative">Conservative (Low Risk)</option>
              <option value="moderate" selected>Moderate (Balanced)</option>
              <option value="aggressive">Aggressive (High Risk)</option>
            </select>
            <div className="control-desc">Higher risk = larger DCA adjustments</div>
          </div>
          
          <div className="control-group">
            <label>AI Learning Period</label>
            <div className="slider-container">
              <input type="range" min="1" max="30" defaultValue="7" className="learning-slider" />
              <div className="slider-labels">
                <span>1 day</span>
                <span>7 days</span>
                <span>30 days</span>
              </div>
            </div>
            <div className="control-desc">How much historical data AI analyzes</div>
          </div>
        </div>
        
        <div className="ai-action-buttons">
          <button className="btn btn-primary btn-lg">
            🚀 Apply AI Recommendations
          </button>
          <button className="btn btn-secondary btn-lg">
            📊 Run AI Simulation
          </button>
          <button className="btn btn-text btn-lg">
            🤖 Train Custom Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDCATiming;