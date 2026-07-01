import React from 'react';
import { Text, View } from 'react-native';

import ScoreProgressCircle from './ScoreProgressCircle';

const ContextScoreCard = ({ score = 0, decision }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Context Score</Text>
      <Text className="mt-1 text-sm text-slate-500">Overall reminder relevance</Text>
      <View className="mt-4 items-center">
        <ScoreProgressCircle score={score} />
      </View>
      <Text className="mt-4 text-center text-sm font-semibold text-slate-700">
        {decision || 'Suppressed'}
      </Text>
    </View>
  );
};

export default ContextScoreCard;
