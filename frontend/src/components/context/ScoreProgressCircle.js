import React from 'react';
import { Text, View } from 'react-native';

const getScoreColor = (score) => {
  if (score >= 70) return '#16A34A';
  if (score >= 40) return '#D97706';
  return '#DC2626';
};

const ScoreProgressCircle = ({ score = 0 }) => {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const color = getScoreColor(normalized);

  return (
    <View className="h-32 w-32 items-center justify-center rounded-full border-8 border-slate-100" style={{ borderColor: `${color}20` }}>
      <View className="h-24 w-24 items-center justify-center rounded-full border-8" style={{ borderColor: color }}>
        <Text className="text-2xl font-bold text-slate-950">{normalized.toFixed(0)}</Text>
        <Text className="text-xs font-medium text-slate-500">Score</Text>
      </View>
    </View>
  );
};

export default ScoreProgressCircle;
