import React, { useState, useEffect } from 'react';
import { Settings, Brain, Wifi, Zap, Battery, Home, Sun, Wind, Car, TrendingUp } from 'lucide-react';

interface NegotiationDetails {
  title: string;
  scenario: string;
  agents: { name: string; role: string; concern: string; }[];
  negotiation: string[];
  outcome: string;
  impact: string;
}

interface Negotiation {
  id: number;
  message: string;
  timestamp: Date;
  participants: number;
  details: NegotiationDetails;
}

interface AIDecision {
  id: number;
  decision: string;
  timestamp: Date;
  impact: string;
}

const GAIFAREDemo = () => {
  const [time, setTime] = useState(new Date());
  const [cumulativeStats, setCumulativeStats] = useState({
    totalSavings: 0,
    energyOptimized: 0,
    co2Reduced: 0,
    socialCostSaved: 0,
    gridStabilityContributions: 0
  });
  const [energyData, setEnergyData] = useState({
    solarGeneration: 4.2,
    windGeneration: 2.8,
    batteryLevel: 75,
    homeConsumption: 3.5,
    evCharging: 7.2,
    gridExport: 0,
    weatherCondition: 'sunny',
    gridPrice: 0.12
  });

  const [agents] = useState([
    { 
      id: 'home', 
      name: 'Smart Home Agent', 
      status: 'active', 
      priority: 'comfort', 
      consumption: 3.5,
      details: {
        currentTasks: ['Optimizing HVAC schedule', 'Managing appliance load', 'Monitoring occupancy patterns'],
        performance: { efficiency: 94, uptime: 99.8, decisions: 147 },
        recentActions: [
          'Reduced AC by 2°F during peak hours',
          'Deferred dishwasher start to off-peak',
          'Adjusted water heater temperature'
        ],
        nextScheduled: 'HVAC optimization at 6 PM'
      }
    },
    { 
      id: 'ev', 
      name: 'EV Charging Agent', 
      status: 'negotiating', 
      priority: 'efficiency', 
      consumption: 7.2,
      details: {
        currentTasks: ['Negotiating charging window', 'Monitoring grid prices', 'Planning route optimization'],
        performance: { efficiency: 91, uptime: 100, decisions: 89 },
        recentActions: [
          'Delayed charging to 11 PM off-peak',
          'Requested 40 kWh for tomorrow trip',
          'Calculated optimal charging rate'
        ],
        nextScheduled: 'Start charging at 11:00 PM'
      }
    },
    { 
      id: 'battery', 
      name: 'Battery Storage Agent', 
      status: 'optimizing', 
      priority: 'grid-support', 
      level: 75,
      details: {
        currentTasks: ['Analyzing discharge patterns', 'Grid frequency monitoring', 'Revenue optimization'],
        performance: { efficiency: 96, uptime: 99.9, decisions: 203 },
        recentActions: [
          'Proposed 6 kWh export to grid',
          'Reserved 7 kWh for home backup',
          'Adjusted charge rate for grid stability'
        ],
        nextScheduled: 'Peak export opportunity at 7 PM'
      }
    },
    { 
      id: 'solar', 
      name: 'Solar Generation Agent', 
      status: 'active', 
      generation: 4.2,
      details: {
        currentTasks: ['Panel angle optimization', 'Weather forecast analysis', 'Maximum power tracking'],
        performance: { efficiency: 98, uptime: 99.5, decisions: 156 },
        recentActions: [
          'Adjusted inverter settings for clouds',
          'Optimized panel tilt for season',
          'Predicted 15% generation drop at 4 PM'
        ],
        nextScheduled: 'Evening panel cleaning cycle'
      }
    },
    { 
      id: 'wind', 
      name: 'Wind Generation Agent', 
      status: 'active', 
      generation: 2.8,
      details: {
        currentTasks: ['Wind speed monitoring', 'Turbine blade optimization', 'Predictive maintenance'],
        performance: { efficiency: 89, uptime: 98.7, decisions: 134 },
        recentActions: [
          'Adjusted blade pitch for gusts',
          'Scheduled maintenance for next week',
          'Coordinated with weather service'
        ],
        nextScheduled: 'Maintenance check tomorrow 8 AM'
      }
    }
  ]);

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<any | null>(null);
  const [starCount, setStarCount] = useState<number | null>(null);
  const [selectedEnergyComponent, setSelectedEnergyComponent] = useState<string | null>(null);

  const totalGeneration = energyData.solarGeneration + energyData.windGeneration;
  const totalConsumption = energyData.homeConsumption + energyData.evCharging;
  const netFlow = totalGeneration - totalConsumption;


  // Fetch GitHub star count
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/open-renewable-energy-systems/gaifare');
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.log('Failed to fetch star count:', error);
      }
    };
    
    fetchStarCount();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      
      // Simulate dynamic energy conditions
      setEnergyData(prev => {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        
        // Solar generation based on time of day
        const solarMultiplier = hour >= 6 && hour <= 18 ? 
          Math.sin((hour - 6) * Math.PI / 12) * 0.8 + 0.2 : 0;
        
        // Realistic grid pricing - updates every 15 minutes with TOU patterns
        let newGridPrice = prev.gridPrice;
        if (minute % 15 === 0) { // Update every 15 minutes like real markets
          // Time-of-use pricing pattern
          if (hour >= 16 && hour <= 21) { // Peak hours (4-9 PM)
            newGridPrice = 0.18 + Math.random() * 0.08; // $0.18-0.26/kWh
          } else if (hour >= 6 && hour <= 16) { // Mid-peak (6 AM-4 PM)  
            newGridPrice = 0.12 + Math.random() * 0.04; // $0.12-0.16/kWh
          } else { // Off-peak (9 PM-6 AM)
            newGridPrice = 0.06 + Math.random() * 0.04; // $0.06-0.10/kWh
          }
        }
        
        return {
          ...prev,
          solarGeneration: Math.max(0, 8 * solarMultiplier + Math.random() * 0.5 - 0.25),
          windGeneration: Math.max(0, 3 + Math.random() * 2 - 1),
          homeConsumption: 2.5 + Math.random() * 2,
          batteryLevel: Math.max(10, Math.min(95, prev.batteryLevel + (Math.random() - 0.5) * 2)),
          gridPrice: newGridPrice
        };
      });

      // Calculate cumulative savings vs non-AI system (accelerated for demo)
      setCumulativeStats(prev => {
        const currentHour = new Date().getHours();
        const demoAccelerator = 15; // Accelerate accumulation for demo visibility
        const intervalMinutes = (2 / 60) * demoAccelerator; // Simulate 30 seconds = 7.5 minutes of real operation
        
        // Baseline "dumb" system behavior (what happens without GAIFARE)
        const baselineConsumption = 4.5; // kWh - constant consumption, no optimization
        const baselineGridUse = Math.max(0, baselineConsumption - (energyData.solarGeneration + energyData.windGeneration) * 0.65); // 65% efficiency without AI
        const baselineWaste = Math.max(0, (energyData.solarGeneration + energyData.windGeneration) * 0.65 - baselineConsumption); // Unused renewable energy
        
        // AI-optimized system (current GAIFARE performance)
        const aiConsumption = energyData.homeConsumption + energyData.evCharging;
        const aiGridUse = Math.max(0, aiConsumption - (energyData.solarGeneration + energyData.windGeneration) * 0.95); // 95% AI efficiency
        const aiWaste = Math.max(0, (energyData.solarGeneration + energyData.windGeneration) * 0.05); // Minimal waste with AI
        
        // Calculate savings per interval
        const energySaved = Math.max(0.1, (baselineGridUse - aiGridUse + baselineWaste - aiWaste) * intervalMinutes);
        const costSaved = energySaved * energyData.gridPrice;
        
        // CO2 and Social Cost of Carbon calculations
        const co2SavedLbs = energySaved * 0.85; // lbs CO2 per kWh (US grid average)
        const co2SavedTons = co2SavedLbs / 2000; // Convert to tons
        const socialCostPerTon = 185; // EPA's 2023 Social Cost of Carbon: $185/ton CO2
        const socialCostSaved = co2SavedTons * socialCostPerTon;
        
        // Grid stability contribution with higher demo impact
        const gridContribution = (currentHour >= 16 && currentHour <= 21 && netFlow > 0) ? 
          Math.abs(netFlow) * intervalMinutes * 1.2 : // Higher multiplier for demo visibility
          Math.abs(netFlow) * intervalMinutes * 0.3;
        
        // Add some variability for realistic demo behavior
        const efficiencyBonus = Math.random() * 0.5 + 0.8; // 0.8-1.3x multiplier
        
        return {
          totalSavings: prev.totalSavings + Math.max(0.05, costSaved * efficiencyBonus),
          energyOptimized: prev.energyOptimized + Math.max(0.1, energySaved * efficiencyBonus),
          co2Reduced: prev.co2Reduced + Math.max(0.1, co2SavedLbs * efficiencyBonus),
          socialCostSaved: (prev.socialCostSaved || 0) + Math.max(0.01, socialCostSaved * efficiencyBonus),
          gridStabilityContributions: prev.gridStabilityContributions + Math.max(0, gridContribution)
        };
      });

      // Simulate AI negotiations
      if (Math.random() < 0.3) {
        const negotiationTypes = [
          { 
            message: 'EV negotiating charge delay with Battery and Grid agents', 
            participants: 3,
            details: {
              title: 'EV Charging Optimization Negotiation',
              scenario: 'The EV needs to charge but wants to minimize cost and grid impact.',
              agents: [
                { name: 'EV Agent', role: 'Requestor', concern: 'Complete charging by 7 AM for commute, minimize cost' },
                { name: 'Battery Agent', role: 'Mediator', concern: 'Balance home energy needs with EV charging' },
                { name: 'Grid Agent', role: 'Provider', concern: 'Avoid peak demand, offer time-of-use pricing' }
              ],
              negotiation: [
                'EV Agent: "I need 40 kWh by 7 AM, current grid price is $0.15/kWh"',
                'Grid Agent: "Peak period until 9 PM ($0.18/kWh), off-peak starts at 11 PM ($0.08/kWh)"',
                'Battery Agent: "I can provide 15 kWh now, then EV can use cheap grid power after 11 PM"',
                'EV Agent: "Agreed. Start with battery power, then switch to grid at 11 PM"'
              ],
              outcome: 'Charging delayed to off-peak hours, saving $4.00 and reducing grid strain',
              impact: 'Cost: -47% | Grid load: -23% | Completion: On-time'
            }
          },
          { 
            message: 'Battery proposing grid export during peak to Home and Grid agents', 
            participants: 3,
            details: {
              title: 'Peak-Time Grid Export Strategy',
              scenario: 'Battery detects high grid prices and proposes selling stored energy back to the grid.',
              agents: [
                { name: 'Battery Agent', role: 'Proposer', concern: 'Maximize revenue during peak pricing window' },
                { name: 'Home Agent', role: 'Stakeholder', concern: 'Ensure adequate power for evening activities' },
                { name: 'Grid Agent', role: 'Buyer', concern: 'Need additional power to meet peak demand' }
              ],
              negotiation: [
                'Battery Agent: "Grid price hit $0.22/kWh. I propose exporting 8 kWh for $1.76 revenue"',
                'Home Agent: "Evening cooking starts in 1 hour, need at least 5 kWh reserved"',
                'Grid Agent: "Will pay premium rate for immediate 6 kWh, standard rate after 7 PM"',
                'Battery Agent: "Compromise: Export 6 kWh now at premium, keep 7 kWh for home use"'
              ],
              outcome: 'Export 6 kWh to grid during peak, earning $1.32 while maintaining home energy security',
              impact: 'Revenue: +$1.32 | Home security: 100% | Grid support: +6 kWh'
            }
          }
        ];
        
        const selectedNegotiation = negotiationTypes[Math.floor(Math.random() * negotiationTypes.length)];
        const newNegotiation = {
          id: Date.now(),
          message: selectedNegotiation.message,
          timestamp: new Date(),
          participants: selectedNegotiation.participants,
          details: selectedNegotiation.details
        };
        
        setNegotiations(prev => [newNegotiation, ...prev.slice(0, 4)]);
      }

      // Simulate AI decisions
      if (Math.random() < 0.4) {
        const decisionTypes = [
          {
            decision: 'Optimized solar panel orientation for 12% efficiency gain',
            details: {
              title: 'Solar Panel Optimization',
              description: 'AI analyzed sun path and weather patterns to optimize panel positioning',
              analysis: 'Historical data shows 15° tilt adjustment increases daily energy capture by 12.3%',
              implementation: [
                'Automated tilt system engaged at 6:45 AM',
                'Panel tracking algorithm updated with seasonal adjustments',
                'Expected increase: 2.1 kWh/day average'
              ],
              agent: 'Solar Generation Agent',
              confidence: '94%',
              energySaved: '2.1 kWh/day',
              costSaved: '$0.31/day'
            }
          },
          {
            decision: 'Scheduled EV charging during low-cost period (2-6 AM)',
            details: {
              title: 'Smart EV Charging Schedule',
              description: 'AI optimized charging window based on grid pricing and user needs',
              analysis: 'Off-peak rates ($0.08/kWh vs $0.18/kWh peak) identified for 2-6 AM window',
              implementation: [
                'EV charging delayed until 2:00 AM automatically',
                'Fast charging rate (7.2kW) utilized during off-peak',
                'Vehicle ready by 7:00 AM as requested'
              ],
              agent: 'EV Charging Agent',
              confidence: '96%',
              energySaved: '40 kWh optimally scheduled',
              costSaved: '$4.00 per charge cycle'
            }
          },
          {
            decision: 'Battery discharge authorized for peak grid support',
            details: {
              title: 'Grid Support Revenue Optimization',
              description: 'Battery discharge during peak hours generates revenue while supporting grid stability',
              analysis: 'Grid stress detected, peak rate $0.22/kWh available for 2-hour window',
              implementation: [
                '8 kWh discharged during 4-6 PM peak period',
                'Home consumption prioritized from solar generation',
                'Grid export earned $1.76 in revenue'
              ],
              agent: 'Battery Storage Agent',
              confidence: '91%',
              energySaved: 'Grid stability improved',
              costSaved: '+$1.76 revenue generated'
            }
          },
          {
            decision: 'Home HVAC adjusted based on occupancy prediction',
            details: {
              title: 'Predictive HVAC Optimization',
              description: 'AI predicted home occupancy patterns and pre-conditioned accordingly',
              analysis: 'Occupancy model shows family returns at 5:30 PM, pre-cooling initiated at 4:45 PM',
              implementation: [
                'Temperature reduced to 72°F at 4:45 PM',
                'Avoided peak-time cooling load from 5:30-7:00 PM',
                'Comfort maintained while reducing grid demand'
              ],
              agent: 'Smart Home Agent',
              confidence: '89%',
              energySaved: '1.8 kWh avoided during peak',
              costSaved: '$0.32 peak rate avoidance'
            }
          },
          {
            decision: 'Wind turbine maintenance scheduled during low-wind forecast',
            details: {
              title: 'Predictive Maintenance Scheduling',
              description: 'AI scheduled maintenance during forecasted low-wind period to minimize generation loss',
              analysis: 'Weather model predicts 3-day low-wind period starting tomorrow, ideal for maintenance',
              implementation: [
                'Maintenance window: Tuesday 9 AM - Friday 2 PM',
                'Expected generation loss minimized to 2.1 kWh',
                'Service team notified and scheduled'
              ],
              agent: 'Wind Generation Agent',
              confidence: '87%',
              energySaved: '12.3 kWh loss avoided vs peak-wind maintenance',
              costSaved: '$1.85 opportunity cost minimized'
            }
          },
          {
            decision: 'Microgrid formed with 3 neighboring homes',
            details: {
              title: 'Dynamic Microgrid Formation',
              description: 'AI coordinated with neighboring homes to form temporary microgrid for mutual benefit',
              analysis: 'Neighbors have excess solar (4.2 kWh) while local demand exceeds generation',
              implementation: [
                'Peer-to-peer energy sharing activated',
                'Local energy trading at $0.14/kWh (vs $0.18 grid rate)',
                'All homes benefit from reduced grid dependency'
              ],
              agent: 'Grid Integration Agent',
              confidence: '93%',
              energySaved: '6.8 kWh shared locally',
              costSaved: '$0.27 for all participants'
            }
          }
        ];
        
        const selectedDecision = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
        const newDecision = {
          id: Date.now(),
          decision: selectedDecision.decision,
          timestamp: new Date(),
          impact: '+' + (Math.random() * 15 + 5).toFixed(1) + '% efficiency',
          details: selectedDecision.details
        };
        
        setAiDecisions(prev => [newDecision, ...prev.slice(0, 4)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <Brain className="inline-block mr-3 text-green-600" size={40} />
            GAIFARE Demo
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            <a href="https://github.com/orgs/open-renewable-energy-systems/repositories" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              Generative AI For Autonomous Renewable Energy (GAIFARE)
            </a>
          </p>
          <div className="bg-white rounded-lg p-4 shadow-md inline-block">
            <p className="text-sm text-gray-500">
              System Time: {time.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })} {time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
            <p className="text-sm text-gray-500">
              Grid Price: ${energyData.gridPrice.toFixed(3)}/kWh 
              <span className="ml-2 text-xs">
                {new Date().getHours() >= 16 && new Date().getHours() <= 21 ? '(Peak)' :
                 new Date().getHours() >= 6 && new Date().getHours() <= 16 ? '(Mid-Peak)' : '(Off-Peak)'}
              </span>
            </p>
            
            <div className="border-t border-gray-200 pt-3">
              <div 
                className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer hover:text-blue-600 transition-colors flex flex-col items-center text-center"
                onClick={() => setSelectedMetric('systemPerformance')}
              >
                <div><strong>GAIFARE System Performance:</strong></div>
                <span className="text-xs text-gray-500 mt-1 flex items-center">
                  Click for detailed analysis → <TrendingUp size={14} className="ml-1" />
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                <div>
                  <strong>💰 Cost Savings:</strong> ${cumulativeStats.totalSavings.toFixed(2)}
                </div>
                <div>
                  <strong>⚡ Energy Optimized:</strong> {cumulativeStats.energyOptimized.toFixed(1)} kWh
                </div>
                <div>
                  <strong>💚 Social Cost of Carbon Saved:</strong> ${(cumulativeStats.socialCostSaved || 0).toFixed(2)}
                </div>
                <div>
                  <strong>🏘️ Grid Contributions:</strong> {cumulativeStats.gridStabilityContributions.toFixed(1)} kWh
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Star Button */}
        <div className="text-center mb-6">
          <a 
            href="https://github.com/open-renewable-energy-systems/gaifare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-200 inline-flex items-center gap-3 text-base font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3C6.13 3 3 6.13 3 10c0 3.09 2.01 5.72 4.78 6.65.35.06.48-.15.48-.33v-1.15c-1.94.42-2.35-.93-2.35-.93-.32-.81-.78-1.03-.78-1.03-.63-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.55-.18-3.18-.78-3.18-3.45 0-.76.27-1.38.72-1.87-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.93.72.56-.16 1.16-.24 1.76-.24s1.2.08 1.76.24c1.34-.91 1.93-.72 1.93-.72.38.96.14 1.67.07 1.85.45.49.72 1.11.72 1.87 0 2.68-1.63 3.27-3.18 3.45.25.22.47.64.47 1.29v1.91c0 .18.13.39.48.33C15.99 15.72 18 13.09 18 10c0-3.87-3.13-7-7-7z" clipRule="evenodd" />
            </svg>
            <span>⭐ Star GAIFARE on GitHub</span>
            {starCount !== null && (
              <span className="bg-gray-600 px-3 py-1 rounded-full text-sm font-bold">{starCount}</span>
            )}
          </a>
          <p className="text-sm text-gray-500 mt-2">Support the project by giving it a star!</p>
        </div>

        {/* Live Energy Flow Network */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="mr-2 text-blue-600" />
            Live Energy Flow Network
          </h2>
          
          {/* Energy Flow Visualization */}
          <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 overflow-hidden">
            
            {/* Grid Connection - Top Center */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div 
                className="bg-gray-600 text-white p-3 rounded-lg text-center shadow-lg min-w-24 cursor-pointer hover:bg-gray-500 transition-colors"
                onClick={() => setSelectedEnergyComponent('grid')}
              >
                <div className="font-bold text-sm">⚡ GRID</div>
                <div className="text-xs">${energyData.gridPrice.toFixed(3)}/kWh</div>
                <div className="text-xs font-semibold">
                  {netFlow < 0 ? (
                    <span className="text-red-200">Import {Math.abs(netFlow).toFixed(1)}kW</span>
                  ) : (
                    <span className="text-green-200">Export {netFlow.toFixed(1)}kW</span>
                  )}
                </div>
              </div>
            </div>

            {/* Solar Panel - Top Right */}
            <div className="absolute top-4 right-4">
              <div 
                className="bg-yellow-500 text-white p-3 rounded-lg text-center shadow-lg min-w-20 cursor-pointer hover:bg-yellow-400 transition-colors"
                onClick={() => setSelectedEnergyComponent('solar')}
              >
                <Sun size={20} className="mx-auto mb-1" />
                <div className="font-bold text-sm">SOLAR</div>
                <div className="text-xs">{energyData.solarGeneration.toFixed(1)} kW</div>
                <div className="text-xs opacity-80">
                  {energyData.solarGeneration > 5 ? "Peak" : energyData.solarGeneration > 2 ? "Good" : "Low"}
                </div>
              </div>
            </div>

            {/* Wind Turbine - Top Left */}
            <div className="absolute top-4 left-4">
              <div 
                className="bg-blue-500 text-white p-3 rounded-lg text-center shadow-lg min-w-20 cursor-pointer hover:bg-blue-400 transition-colors"
                onClick={() => setSelectedEnergyComponent('wind')}
              >
                <Wind size={20} className="mx-auto mb-1" />
                <div className="font-bold text-sm">WIND</div>
                <div className="text-xs">{energyData.windGeneration.toFixed(1)} kW</div>
                <div className="text-xs opacity-80">
                  {energyData.windGeneration > 4 ? "Strong" : energyData.windGeneration > 2 ? "Steady" : "Light"}
                </div>
              </div>
            </div>

            {/* Battery Storage - Center Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`p-4 rounded-lg text-center shadow-lg text-white min-w-24 cursor-pointer hover:opacity-80 transition-opacity ${
                energyData.batteryLevel > 60 ? 'bg-green-500' : 
                energyData.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
                onClick={() => setSelectedEnergyComponent('battery')}
              >
                <Battery size={24} className="mx-auto mb-1" />
                <div className="font-bold text-sm">BATTERY</div>
                <div className="text-xs">{energyData.batteryLevel.toFixed(0)}%</div>
                <div className="text-xs opacity-80">
                  {netFlow > 0 && energyData.batteryLevel < 90 ? 'Charging' : 
                   netFlow < 0 && energyData.batteryLevel > 20 ? 'Discharging' : 'Standby'}
                </div>
              </div>
            </div>

            {/* Home - Bottom Left */}
            <div className="absolute bottom-4 left-4">
              <div 
                className="bg-purple-600 text-white p-3 rounded-lg text-center shadow-lg min-w-20 cursor-pointer hover:bg-purple-500 transition-colors"
                onClick={() => setSelectedEnergyComponent('home')}
              >
                <Home size={20} className="mx-auto mb-1" />
                <div className="font-bold text-sm">HOME</div>
                <div className="text-xs">{energyData.homeConsumption.toFixed(1)} kW</div>
                <div className="text-xs opacity-80">
                  {energyData.homeConsumption > 4 ? "High" : energyData.homeConsumption > 2.5 ? "Normal" : "Low"}
                </div>
              </div>
            </div>

            {/* EV Charger - Bottom Right */}
            <div className="absolute bottom-4 right-4">
              <div 
                className="bg-green-600 text-white p-3 rounded-lg text-center shadow-lg min-w-20 cursor-pointer hover:bg-green-500 transition-colors"
                onClick={() => setSelectedEnergyComponent('ev')}
              >
                <Car size={20} className="mx-auto mb-1" />
                <div className="font-bold text-sm">EV</div>
                <div className="text-xs">{energyData.evCharging.toFixed(1)} kW</div>
                <div className="text-xs opacity-80">
                  {energyData.evCharging > 6 ? "Fast" : energyData.evCharging > 3 ? "Normal" : "Slow"}
                </div>
              </div>
            </div>

            {/* CSS-based flowing dots */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes flow-solar {
                0% { left: calc(83% - 4px); top: calc(27% - 4px); }
                100% { left: calc(58% - 4px); top: calc(47% - 4px); }
              }
              @keyframes flow-wind {
                0% { left: calc(17% - 4px); top: calc(27% - 4px); }
                100% { left: calc(42% - 4px); top: calc(47% - 4px); }
              }
              @keyframes flow-home {
                0% { left: calc(42% - 4px); top: calc(53% - 4px); }
                100% { left: calc(17% - 4px); top: calc(78% - 4px); }
              }
              @keyframes flow-ev {
                0% { left: calc(58% - 4px); top: calc(53% - 4px); }
                100% { left: calc(83% - 4px); top: calc(78% - 4px); }
              }
              @keyframes flow-grid-import {
                0% { left: calc(50% - 4px); top: calc(25% - 4px); }
                100% { left: calc(50% - 4px); top: calc(35% - 4px); }
              }
              @keyframes flow-grid-export {
                0% { left: calc(50% - 4px); top: calc(35% - 4px); }
                100% { left: calc(50% - 4px); top: calc(25% - 4px); }
              }
              .flow-dot {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
              }
            `}} />

            {/* Animated flow dots - number based on energy intensity */}
            {energyData.solarGeneration > 0.5 && (
              <>
                {Array.from({length: Math.min(Math.max(1, Math.ceil(energyData.solarGeneration / 2)), 4)}, (_, i) => (
                  <div key={`solar-${i}`} className="flow-dot w-2 h-2 bg-yellow-400 opacity-70" style={{ 
                    animation: 'flow-solar 2s infinite linear',
                    animationDelay: `${i * 0.5}s`
                  }} />
                ))}
              </>
            )}

            {energyData.windGeneration > 0.5 && (
              <>
                {Array.from({length: Math.min(Math.max(1, Math.ceil(energyData.windGeneration / 2)), 4)}, (_, i) => (
                  <div key={`wind-${i}`} className="flow-dot w-2 h-2 bg-blue-400 opacity-70" style={{ 
                    animation: 'flow-wind 1.8s infinite linear',
                    animationDelay: `${i * 0.45}s`
                  }} />
                ))}
              </>
            )}

            {energyData.homeConsumption > 0.5 && (
              <>
                {Array.from({length: Math.min(Math.max(1, Math.ceil(energyData.homeConsumption / 2)), 4)}, (_, i) => (
                  <div key={`home-${i}`} className="flow-dot w-2 h-2 bg-purple-500 opacity-70" style={{ 
                    animation: 'flow-home 1.5s infinite linear',
                    animationDelay: `${i * 0.4}s`
                  }} />
                ))}
              </>
            )}

            {energyData.evCharging > 0.5 && (
              <>
                {Array.from({length: Math.min(Math.max(1, Math.ceil(energyData.evCharging / 2)), 5)}, (_, i) => (
                  <div key={`ev-${i}`} className="flow-dot w-2 h-2 bg-green-400 opacity-70" style={{ 
                    animation: 'flow-ev 1.6s infinite linear',
                    animationDelay: `${i * 0.35}s`
                  }} />
                ))}
              </>
            )}

            {Math.abs(netFlow) > 0.5 && (
              <>
                {Array.from({length: Math.min(Math.max(1, Math.ceil(Math.abs(netFlow) / 2)), 5)}, (_, i) => (
                  <div key={`grid-${i}`} className={`flow-dot w-2 h-2 opacity-70 ${netFlow < 0 ? 'bg-red-400' : 'bg-green-400'}`} style={{ 
                    animation: `${netFlow < 0 ? 'flow-grid-import' : 'flow-grid-export'} 1.2s infinite linear`,
                    animationDelay: `${i * 0.3}s`
                  }} />
                ))}
              </>
            )}

            {/* Energy Flow Lines with SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                {/* Small arrow markers that don't overwhelm the flow lines */}
                <marker id="arrow-solar" markerWidth="4" markerHeight="4" refX="3" refY="1.5" orient="auto">
                  <path d="M0,0 L0,3 L3,1.5 z" fill="#d1d5db" />
                </marker>
                <marker id="arrow-wind" markerWidth="4" markerHeight="4" refX="3" refY="1.5" orient="auto">
                  <path d="M0,0 L0,3 L3,1.5 z" fill="#d1d5db" />
                </marker>
                <marker id="arrow-home" markerWidth="4" markerHeight="4" refX="3" refY="1.5" orient="auto">
                  <path d="M0,0 L0,3 L3,1.5 z" fill="#d1d5db" />
                </marker>
                <marker id="arrow-ev" markerWidth="4" markerHeight="4" refX="3" refY="1.5" orient="auto">
                  <path d="M0,0 L0,3 L3,1.5 z" fill="#d1d5db" />
                </marker>
                <marker id="arrow-grid" markerWidth="4" markerHeight="4" refX="3" refY="1.5" orient="auto">
                  <path d="M0,0 L0,3 L3,1.5 z" fill="#d1d5db" />
                </marker>
              </defs>

              {/* Solar to Battery flow */}
              {energyData.solarGeneration > 0.5 && (
                <>
                  <line 
                    x1="83%" y1="27%" x2="58%" y2="47%" 
                    stroke="#d1d5db" 
                    strokeWidth="4"
                    markerEnd="url(#arrow-solar)"
                    opacity="0.5"
                  />
                  <text x="70%" y="35%" fill="#eab308" fontSize="10" className="font-bold">
                    {energyData.solarGeneration.toFixed(1)}kW
                  </text>
                </>
              )}

              {/* Wind to Battery flow */}
              {energyData.windGeneration > 0.5 && (
                <>
                  <line 
                    x1="17%" y1="27%" x2="42%" y2="47%" 
                    stroke="#d1d5db" 
                    strokeWidth="4"
                    markerEnd="url(#arrow-wind)"
                    opacity="0.5"
                  />
                  <text x="25%" y="35%" fill="#3b82f6" fontSize="10" className="font-bold">
                    {energyData.windGeneration.toFixed(1)}kW
                  </text>
                </>
              )}

              {/* Battery to Home flow */}
              <line 
                x1="42%" y1="53%" x2="17%" y2="78%" 
                stroke="#d1d5db" 
                strokeWidth="4"
                markerEnd="url(#arrow-home)"
                opacity="0.5"
              />
              <text x="22%" y="70%" fill="#9333ea" fontSize="10" className="font-bold">
                {energyData.homeConsumption.toFixed(1)}kW
              </text>

              {/* Battery to EV flow */}
              {energyData.evCharging > 1 && (
                <>
                  <line 
                    x1="58%" y1="53%" x2="83%" y2="78%" 
                    stroke="#d1d5db" 
                    strokeWidth="4"
                    markerEnd="url(#arrow-ev)"
                    opacity="0.5"
                  />
                  <text x="75%" y="70%" fill="#16a34a" fontSize="10" className="font-bold">
                    {energyData.evCharging.toFixed(1)}kW
                  </text>
                </>
              )}

              {/* Grid connection flow - direction changes based on import/export */}
              <line 
                x1="50%" 
                y1={netFlow < 0 ? "25%" : "35%"} 
                x2="50%" 
                y2={netFlow < 0 ? "35%" : "25%"} 
                stroke="#d1d5db" 
                strokeWidth="5"
                markerEnd="url(#arrow-grid)"
                opacity="0.5"
              />
              {Math.abs(netFlow) > 0.5 && (
                <text x="55%" y="30%" fill={netFlow < 0 ? "#ef4444" : "#10b981"} fontSize="10" className="font-bold">
                  {Math.abs(netFlow).toFixed(1)}kW
                </text>
              )}

            </svg>

            {/* GAIFARE AI Control Center with integrated live stats */}
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2" style={{ zIndex: 2 }}>
              <div className="bg-white bg-opacity-95 rounded shadow-md border border-blue-400 px-3 py-2">
                <div className="flex items-center gap-2">
                  {/* AI Icon */}
                  <div className="flex-shrink-0">
                    <Brain size={12} className="text-blue-600 animate-pulse" />
                  </div>
                  
                  {/* AI Status and Stats */}
                  <div>
                    <div className="text-xs font-bold text-blue-700">GAIFARE AI</div>
                    
                    {/* Live Stats */}
                    <div className="flex gap-3 text-xs mt-1">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{totalGeneration.toFixed(1)}</div>
                        <div className="text-gray-500 text-xs">Gen</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">{totalConsumption.toFixed(1)}</div>
                        <div className="text-gray-500 text-xs">Use</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {netFlow >= 0 ? '+' : ''}{netFlow.toFixed(1)}
                        </div>
                        <div className="text-gray-500 text-xs">Net</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agents and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2 text-purple-600" />
              Active AI Agents
            </h2>
            
            <div className="space-y-3">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-purple-400"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      Priority: {agent.priority} | Status: {agent.status}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      agent.status === 'active' ? 'bg-green-500' :
                      agent.status === 'negotiating' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <Wifi size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="mr-2 text-indigo-600" />
              Recent AI Decisions
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiDecisions.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent AI decisions</p>
              ) : (
                aiDecisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className="p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors border-l-4 border-indigo-400"
                    onClick={() => setSelectedDecision(decision)}
                  >
                    <div className="text-sm font-medium">{decision.decision}</div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{decision.timestamp.toLocaleTimeString()}</span>
                      <span className="font-medium text-green-600">{decision.impact}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Agent Negotiations */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Wifi className="mr-2 text-orange-600" />
            Recent Agent Negotiations
          </h2>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {negotiations.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent negotiations</p>
            ) : (
              negotiations.map((neg) => (
                <div 
                  key={neg.id} 
                  className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors border-l-4 border-orange-400"
                  onClick={() => setSelectedNegotiation(neg)}
                >
                  <div className="text-sm font-medium">{neg.message}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span>{neg.timestamp.toLocaleTimeString()} | {neg.participants} participating agents</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">About GAIFARE</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Autonomous agent negotiation</li>
                <li>• Predictive energy optimization</li>
                <li>• Real-time grid interaction</li>
                <li>• Federated learning across homes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">AI Technologies</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Large Language Models (LLMs)</li>
                <li>• Generative adversarial networks</li>
                <li>• Multi-agent reinforcement learning</li>
                <li>• Explainable AI decisions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Project Status</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Part of LF Energy <a href="https://lfenergy.org/projects/ores-open-renewable-energy-systems/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ORES</a></li>
                <li>• Early incubation phase</li>
                <li>• Community contributions welcome</li>
                <li>• <a href="https://github.com/open-renewable-energy-systems" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub Repository</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {selectedNegotiation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedNegotiation.details.title}</h2>
                <button 
                  onClick={() => setSelectedNegotiation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedNegotiation.details.scenario}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Agents Involved:</h3>
                  {selectedNegotiation.details.agents.map((agent, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded mb-2">
                      <strong>{agent.name}</strong> ({agent.role}): {agent.concern}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Negotiation:</h3>
                  {selectedNegotiation.details.negotiation.map((step, idx) => (
                    <div key={idx} className="text-sm mb-2 p-2 bg-blue-50 rounded">
                      {step}
                    </div>
                  ))}
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="font-semibold text-green-800">Outcome:</h3>
                  <p className="text-sm text-green-700">{selectedNegotiation.details.outcome}</p>
                  <p className="text-xs text-green-600 font-mono mt-1">{selectedNegotiation.details.impact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis Modal */}
      {selectedMetric === 'systemPerformance' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 text-green-600" size={28} />
                  GAIFARE Performance Analysis
                </h2>
                <button 
                  onClick={() => setSelectedMetric(null)}
                  className="text-gray-500 hover:text-white hover:bg-red-500 w-8 h-8 flex items-center justify-center rounded-full text-xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Current Performance Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">📊 Current System Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${cumulativeStats.totalSavings.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Cost Savings</div>
                      <div className="text-xs text-gray-500">Since system start</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cumulativeStats.energyOptimized.toFixed(1)} kWh</div>
                      <div className="text-sm text-gray-600">Energy Optimized</div>
                      <div className="text-xs text-gray-500">Waste eliminated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{cumulativeStats.co2Reduced.toFixed(1)} lbs</div>
                      <div className="text-sm text-gray-600">CO₂ Reduced</div>
                      <div className="text-xs text-gray-500">Environmental impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">${(cumulativeStats.socialCostSaved || 0).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Social Cost Saved</div>
                      <div className="text-xs text-gray-500">EPA carbon valuation</div>
                    </div>
                  </div>
                </div>

                {/* System Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center">
                      ❌ Traditional "Dumb" Energy System
                    </h4>
                    <ul className="text-sm text-red-700 space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <div>
                          <strong>65% renewable efficiency</strong>
                          <div className="text-xs text-red-600">Poor solar/wind utilization due to lack of coordination</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <div>
                          <strong>35% energy waste</strong>
                          <div className="text-xs text-red-600">Excess renewable energy unused or wasted</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <div>
                          <strong>Fixed consumption patterns</strong>
                          <div className="text-xs text-red-600">No market awareness or time-of-use optimization</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      ✅ GAIFARE AI-Powered System
                    </h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <div>
                          <strong>95% renewable efficiency</strong>
                          <div className="text-xs text-green-600">AI-optimized utilization with predictive management</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <div>
                          <strong>5% energy waste</strong>
                          <div className="text-xs text-green-600">Intelligent storage and load management</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <div>
                          <strong>Real-time market optimization</strong>
                          <div className="text-xs text-green-600">Dynamic pricing awareness and time-shifting</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Key Performance Improvements */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">🚀 Key Performance Improvements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center bg-white p-3 rounded">
                      <div className="text-3xl font-bold text-green-600">+46%</div>
                      <div className="text-sm font-medium text-blue-700">Efficiency Gain</div>
                      <div className="text-xs text-gray-600">65% → 95% renewable utilization</div>
                    </div>
                    <div className="text-center bg-white p-3 rounded">
                      <div className="text-3xl font-bold text-green-600">-85%</div>
                      <div className="text-sm font-medium text-blue-700">Energy Waste Reduction</div>
                      <div className="text-xs text-gray-600">35% → 5% waste elimination</div>
                    </div>
                    <div className="text-center bg-white p-3 rounded">
                      <div className="text-3xl font-bold text-green-600">-30%</div>
                      <div className="text-sm font-medium text-blue-700">Grid Dependency</div>
                      <div className="text-xs text-gray-600">Smart load scheduling and storage</div>
                    </div>
                  </div>
                </div>

                {/* How Calculations Work */}
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-bold text-yellow-800 mb-3">🧮 How Performance Metrics Are Calculated</h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <strong className="text-yellow-800">Cost Savings Calculation:</strong>
                      <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                        <div>Traditional System Grid Use = max(0, 4.5 kWh - (Generation × 65%))</div>
                        <div>GAIFARE System Grid Use = max(0, Actual Use - (Generation × 95%))</div>
                        <div>Savings = (Traditional Use - GAIFARE Use) × Grid Price</div>
                      </div>
                    </div>
                    <div>
                      <strong className="text-yellow-800">CO₂ Reduction:</strong>
                      <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                        <div>Energy Saved × 0.85 lbs CO₂/kWh (US grid average)</div>
                        <div>Source: EPA eGRID 2022 national emissions factor</div>
                      </div>
                    </div>
                    <div>
                      <strong className="text-yellow-800">Social Cost of Carbon:</strong>
                      <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                        <div>(CO₂ Reduced ÷ 2000 lbs/ton) × $185/ton CO₂</div>
                        <div>Based on EPA's 2023 Social Cost of Carbon estimate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time System Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-3">⚡ Current Energy System Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-2 rounded text-center">
                      <div className="font-bold text-yellow-600">Solar</div>
                      <div>{energyData.solarGeneration.toFixed(1)} kW</div>
                      <div className="text-gray-500">
                        {energyData.solarGeneration > 5 ? "Peak" : energyData.solarGeneration > 2 ? "Good" : "Low"}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <div className="font-bold text-blue-600">Wind</div>
                      <div>{energyData.windGeneration.toFixed(1)} kW</div>
                      <div className="text-gray-500">
                        {energyData.windGeneration > 4 ? "Strong" : energyData.windGeneration > 2 ? "Steady" : "Light"}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <div className="font-bold text-green-600">Battery</div>
                      <div>{energyData.batteryLevel.toFixed(0)}%</div>
                      <div className="text-gray-500">
                        {energyData.batteryLevel > 60 ? "Good" : energyData.batteryLevel > 30 ? "Fair" : "Low"}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <div className="font-bold text-gray-600">Grid</div>
                      <div>${energyData.gridPrice.toFixed(3)}/kWh</div>
                      <div className="text-gray-500">
                        {new Date().getHours() >= 16 && new Date().getHours() <= 21 ? "Peak" : 
                         new Date().getHours() >= 6 && new Date().getHours() <= 16 ? "Mid" : "Off-Peak"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Settings className="mr-2 text-purple-600" />
                {selectedAgent.name} Details
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedAgent(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Agent Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedAgent.details.performance.efficiency}%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedAgent.details.performance.uptime}%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedAgent.details.performance.decisions}</div>
                  <div className="text-sm text-gray-600">Decisions Made</div>
                </div>
              </div>

              {/* Current Tasks */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-3">🔄 Current Tasks</h4>
                <ul className="space-y-2">
                  {selectedAgent.details.currentTasks.map((task: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Actions */}
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-bold text-green-800 mb-3">✅ Recent Actions</h4>
                <ul className="space-y-2">
                  {selectedAgent.details.recentActions.map((action: string, index: number) => (
                    <li key={index} className="text-sm text-green-700">
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {action}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Scheduled Action */}
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-bold text-yellow-800 mb-2">⏰ Next Scheduled</h4>
                <p className="text-sm text-yellow-700">{selectedAgent.details.nextScheduled}</p>
              </div>

              {/* Agent Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    selectedAgent.status === 'active' ? 'bg-green-500' :
                    selectedAgent.status === 'negotiating' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-600 capitalize">
                    Status: <strong>{selectedAgent.status}</strong> | Priority: <strong>{selectedAgent.priority}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Decision Detail Modal */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Brain className="mr-2 text-indigo-600" />
                {selectedDecision.details.title}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedDecision(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Decision Overview */}
              <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <h4 className="font-bold text-indigo-800 mb-2">🎯 Decision Overview</h4>
                <p className="text-sm text-indigo-700 mb-3">{selectedDecision.details.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600">{selectedDecision.details.confidence}</div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">{selectedDecision.details.energySaved}</div>
                    <div className="text-xs text-gray-600">Energy Impact</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">{selectedDecision.details.costSaved}</div>
                    <div className="text-xs text-gray-600">Cost Impact</div>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-3">🧠 AI Analysis</h4>
                <p className="text-sm text-blue-700">{selectedDecision.details.analysis}</p>
              </div>

              {/* Implementation Steps */}
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-bold text-green-800 mb-3">⚙️ Implementation Steps</h4>
                <ul className="space-y-2">
                  {selectedDecision.details.implementation.map((step: string, index: number) => (
                    <li key={index} className="flex items-start text-sm text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsible Agent */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">
                    Executed by: <strong>{selectedDecision.details.agent}</strong>
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedDecision.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Component Detail Modals */}
      {selectedEnergyComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  {selectedEnergyComponent === 'grid' && (
                    <>
                      <Zap className="mr-2 text-gray-600" />
                      Grid Connection Details
                    </>
                  )}
                  {selectedEnergyComponent === 'solar' && (
                    <>
                      <Sun className="mr-2 text-yellow-500" />
                      Solar Panel Details
                    </>
                  )}
                  {selectedEnergyComponent === 'wind' && (
                    <>
                      <Wind className="mr-2 text-blue-500" />
                      Wind Turbine Details
                    </>
                  )}
                  {selectedEnergyComponent === 'battery' && (
                    <>
                      <Battery className="mr-2 text-green-500" />
                      Battery Storage Details
                    </>
                  )}
                  {selectedEnergyComponent === 'home' && (
                    <>
                      <Home className="mr-2 text-purple-600" />
                      Home Energy Details
                    </>
                  )}
                  {selectedEnergyComponent === 'ev' && (
                    <>
                      <Car className="mr-2 text-green-600" />
                      EV Charging Details
                    </>
                  )}
                </h2>
                <button 
                  onClick={() => setSelectedEnergyComponent(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Grid Details */}
              {selectedEnergyComponent === 'grid' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">⚡ Current Grid Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-600">${energyData.gridPrice.toFixed(3)}/kWh</div>
                        <div className="text-sm text-gray-500">Current Price</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className={`text-2xl font-bold ${
                          netFlow < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {netFlow < 0 ? `Import ${Math.abs(netFlow).toFixed(1)}` : `Export ${netFlow.toFixed(1)}`} kW
                        </div>
                        <div className="text-sm text-gray-500">Power Flow</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">📊 Time-of-Use Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Peak (4-9 PM):</span>
                        <span className="font-mono text-blue-800">$0.18-0.26/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Mid-Peak (6 AM-4 PM):</span>
                        <span className="font-mono text-blue-800">$0.12-0.16/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Off-Peak (9 PM-6 AM):</span>
                        <span className="font-mono text-blue-800">$0.06-0.10/kWh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-bold text-yellow-800 mb-2">🤖 AI Grid Optimization</h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• Automatic load shifting to off-peak hours</li>
                      <li>• Peak demand shaving to reduce costs</li>
                      <li>• Grid support through battery discharge</li>
                      <li>• Real-time price monitoring and response</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Solar Details */}
              {selectedEnergyComponent === 'solar' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-3">☀️ Solar Generation Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600">{energyData.solarGeneration.toFixed(1)} kW</div>
                        <div className="text-sm text-gray-500">Current Output</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {energyData.solarGeneration > 5 ? "Peak" : energyData.solarGeneration > 2 ? "Good" : "Low"}
                        </div>
                        <div className="text-sm text-gray-500">Performance</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-2">📈 Daily Performance Forecast</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Peak Generation (12-2 PM):</span>
                        <span className="font-mono">7.2-8.5 kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Daily Total:</span>
                        <span className="font-mono">45-55 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weather Condition:</span>
                        <span className="capitalize">{energyData.weatherCondition}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">🤖 AI Solar Optimization</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Real-time panel angle adjustment</li>
                      <li>• Cloud detection and power prediction</li>
                      <li>• Maximum Power Point Tracking (MPPT)</li>
                      <li>• Seasonal tilt optimization</li>
                      <li>• Dust detection and cleaning scheduling</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Wind Details */}
              {selectedEnergyComponent === 'wind' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-3">💨 Wind Generation Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{energyData.windGeneration.toFixed(1)} kW</div>
                        <div className="text-sm text-gray-500">Current Output</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {energyData.windGeneration > 4 ? "Strong" : energyData.windGeneration > 2 ? "Steady" : "Light"}
                        </div>
                        <div className="text-sm text-gray-500">Wind Conditions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-2">🌪️ Wind Performance Metrics</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Estimated Wind Speed:</span>
                        <span className="font-mono">12-18 mph</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turbine Efficiency:</span>
                        <span className="font-mono">89%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Generation Estimate:</span>
                        <span className="font-mono">25-35 kWh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                    <h4 className="font-bold text-purple-800 mb-2">🤖 AI Wind Optimization</h4>
                    <ul className="space-y-1 text-sm text-purple-700">
                      <li>• Automatic blade pitch adjustment</li>
                      <li>• Wind direction tracking and optimization</li>
                      <li>• Predictive maintenance scheduling</li>
                      <li>• Weather forecast integration</li>
                      <li>• Turbulence detection and mitigation</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Battery Details */}
              {selectedEnergyComponent === 'battery' && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${
                    energyData.batteryLevel > 60 ? 'bg-green-50' : 
                    energyData.batteryLevel > 30 ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <h3 className={`font-bold mb-3 ${
                      energyData.batteryLevel > 60 ? 'text-green-800' : 
                      energyData.batteryLevel > 30 ? 'text-yellow-800' : 'text-red-800'
                    }`}>🔋 Battery Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className={`text-2xl font-bold ${
                          energyData.batteryLevel > 60 ? 'text-green-600' : 
                          energyData.batteryLevel > 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{energyData.batteryLevel.toFixed(0)}%</div>
                        <div className="text-sm text-gray-500">Charge Level</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">25 kWh</div>
                        <div className="text-sm text-gray-500">Total Capacity</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {netFlow > 0 && energyData.batteryLevel < 90 ? 'Charging' : 
                           netFlow < 0 && energyData.batteryLevel > 20 ? 'Discharging' : 'Standby'}
                        </div>
                        <div className="text-sm text-gray-500">Current Mode</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">⚡ Battery Performance</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Charge/Discharge Rate:</span>
                        <span className="font-mono">Up to 10 kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Round-trip Efficiency:</span>
                        <span className="font-mono">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cycle Count:</span>
                        <span className="font-mono">1,247 / 8,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Lifespan:</span>
                        <span className="font-mono">12+ years</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-2">🤖 AI Battery Management</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Dynamic charge/discharge scheduling</li>
                      <li>• Grid arbitrage for revenue generation</li>
                      <li>• Backup power priority management</li>
                      <li>• Battery health optimization</li>
                      <li>• Temperature and safety monitoring</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Home Details */}
              {selectedEnergyComponent === 'home' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-800 mb-3">🏠 Home Energy Consumption</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{energyData.homeConsumption.toFixed(1)} kW</div>
                        <div className="text-sm text-gray-500">Current Usage</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {energyData.homeConsumption > 4 ? "High" : energyData.homeConsumption > 2.5 ? "Normal" : "Low"}
                        </div>
                        <div className="text-sm text-gray-500">Usage Level</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">📊 Energy Breakdown</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between items-center">
                        <span>HVAC System:</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-blue-200 rounded mr-2">
                            <div className="w-3/5 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="font-mono">1.8 kW</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Water Heater:</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-blue-200 rounded mr-2">
                            <div className="w-1/4 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="font-mono">0.6 kW</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Appliances:</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-blue-200 rounded mr-2">
                            <div className="w-2/5 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="font-mono">0.8 kW</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Lighting & Electronics:</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-blue-200 rounded mr-2">
                            <div className="w-1/5 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="font-mono">0.3 kW</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-2">🤖 AI Home Optimization</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Occupancy-based HVAC scheduling</li>
                      <li>• Smart appliance load shifting</li>
                      <li>• Water heater temperature optimization</li>
                      <li>• Automated demand response</li>
                      <li>• Energy usage pattern learning</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* EV Details */}
              {selectedEnergyComponent === 'ev' && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-3">🚗 EV Charging Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{energyData.evCharging.toFixed(1)} kW</div>
                        <div className="text-sm text-gray-500">Charging Rate</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">78%</div>
                        <div className="text-sm text-gray-500">Battery Level</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {energyData.evCharging > 6 ? "Fast" : energyData.evCharging > 3 ? "Normal" : "Slow"}
                        </div>
                        <div className="text-sm text-gray-500">Charge Mode</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">🔋 Vehicle Information</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Battery Capacity:</span>
                        <span className="font-mono">75 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Range Remaining:</span>
                        <span className="font-mono">234 miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charge Completion:</span>
                        <span className="font-mono">2:30 AM (off-peak)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Trip:</span>
                        <span className="font-mono">7:00 AM (45 miles)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-bold text-yellow-800 mb-2">🤖 AI Charging Optimization</h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• Off-peak charging scheduling</li>
                      <li>• Route planning and range optimization</li>
                      <li>• Grid-friendly charging rates</li>
                      <li>• Vehicle-to-grid (V2G) capability</li>
                      <li>• Smart pre-conditioning</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GAIFAREDemo;