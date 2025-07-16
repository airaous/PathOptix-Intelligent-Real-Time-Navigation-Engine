
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EnvironmentalTracker = ({ routeData, travelMode }) => {
  const [impact, setImpact] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [goal, setGoal] = useState('reduce_carbon');

  const goals = [
    { id: 'reduce_carbon', label: '🌱 Reduce Carbon', target: 'Minimize CO₂ emissions' },
    { id: 'save_fuel', label: '⛽ Save Fuel', target: 'Optimize fuel efficiency' },
    { id: 'air_quality', label: '🌬️ Air Quality', target: 'Avoid polluted areas' },
    { id: 'noise_reduction', label: '🔇 Quiet Route', target: 'Minimize noise pollution' }
  ];

  useEffect(() => {
    if (routeData) {
      calculateEnvironmentalImpact();
    }
  }, [routeData, travelMode, goal]);

  const calculateEnvironmentalImpact = () => {
    // Simulate environmental impact calculation
    const distance = routeData.distance || 10000; // meters
    const duration = routeData.duration || 1800; // seconds

    const carbonFactors = {
      driving: 0.12, // kg CO2 per km
      walking: 0,
      bicycling: 0,
      transit: 0.04,
      rideshare: 0.08,
      scooter: 0.02
    };

    const carbonEmission = (distance / 1000) * (carbonFactors[travelMode] || 0.12);
    
    const impactData = {
      carbon_emission: carbonEmission,
      fuel_consumption: travelMode === 'driving' ? (distance / 1000) * 0.08 : 0, // liters
      air_quality_index: Math.floor(Math.random() * 100) + 50,
      noise_level: travelMode === 'driving' ? 65 : travelMode === 'walking' ? 40 : 55, // dB
      eco_score: Math.max(0, 100 - carbonEmission * 10),
      trees_needed: Math.ceil(carbonEmission / 0.02), // trees to offset CO2
      cost_savings: 0,
      health_benefits: travelMode === 'walking' || travelMode === 'bicycling' ? 
        { calories: Math.floor(duration / 60 * 5), exercise_time: duration } : null
    };

    // Calculate alternatives
    const alternativeOptions = [
      {
        mode: 'walking',
        carbon_reduction: carbonEmission * 1.0,
        time_difference: '+45 min',
        health_benefit: '300 calories burned',
        feasible: distance < 5000
      },
      {
        mode: 'bicycling', 
        carbon_reduction: carbonEmission * 1.0,
        time_difference: '+15 min',
        health_benefit: '200 calories burned',
        feasible: distance < 15000
      },
      {
        mode: 'transit',
        carbon_reduction: carbonEmission * 0.7,
        time_difference: '+10 min',
        cost_savings: '$5.50',
        feasible: true
      }
    ].filter(alt => alt.mode !== travelMode && alt.feasible);

    setImpact(impactData);
    setAlternatives(alternativeOptions);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!impact) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          🌍 Environmental Impact
        </h3>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="text-sm border rounded-md px-2 py-1 bg-white"
        >
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </div>

      {/* Eco Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Eco Score</span>
          <span className={`font-bold text-xl ${getScoreColor(impact.eco_score)}`}>
            {impact.eco_score.toFixed(1)}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${getScoreBackground(impact.eco_score)}`}
            style={{ width: `${impact.eco_score}%` }}
          ></div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {impact.carbon_emission.toFixed(2)}
          </div>
          <div className="text-xs text-red-600">kg CO₂</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {impact.trees_needed}
          </div>
          <div className="text-xs text-green-600">Trees to offset</div>
        </div>

        {impact.fuel_consumption > 0 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {impact.fuel_consumption.toFixed(1)}
            </div>
            <div className="text-xs text-blue-600">Liters fuel</div>
          </div>
        )}

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {impact.air_quality_index}
          </div>
          <div className="text-xs text-purple-600">Air Quality Index</div>
        </div>
      </div>

      {/* Health Benefits */}
      {impact.health_benefits && (
        <div className="mb-6 p-3 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">💪 Health Benefits</h4>
          <div className="text-sm text-green-700">
            • {impact.health_benefits.calories} calories burned
            • {Math.floor(impact.health_benefits.exercise_time / 60)} minutes of exercise
            • Improved cardiovascular health
          </div>
        </div>
      )}

      {/* Eco-friendly Alternatives */}
      {alternatives.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">🌱 Eco-friendly Alternatives</h4>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border border-green-200 bg-green-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-green-800 capitalize">
                      Switch to {alt.mode}
                    </div>
                    <div className="text-sm text-green-600">
                      Reduce {alt.carbon_reduction.toFixed(2)} kg CO₂ 
                      {alt.time_difference && ` • ${alt.time_difference}`}
                    </div>
                    {alt.health_benefit && (
                      <div className="text-xs text-green-500">{alt.health_benefit}</div>
                    )}
                    {alt.cost_savings && (
                      <div className="text-xs text-green-500">Save {alt.cost_savings}</div>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                    Switch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalTracker;
