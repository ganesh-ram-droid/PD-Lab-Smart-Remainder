import React from 'react';
import { Text, View } from 'react-native';

const ContextTimeline = ({ history = [] }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Timeline</Text>
      <Text className="mt-1 text-sm text-slate-500">Latest context evaluations</Text>
      <View className="mt-4">
        {history.length ? (
          history.map((item) => (
            <View key={`${item.contextId}-${item.timestamp}`} className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
              <Text className="text-sm font-semibold text-slate-950">
                {item.score.toFixed(0)} • {item.decision}
              </Text>
              <Text className="mt-1 text-xs text-slate-500" numberOfLines={1}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              {item.reason?.length ? (
                <Text className="mt-1 text-xs text-slate-500" numberOfLines={2}>
                  {item.reason.join(', ')}
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <View className="rounded-2xl bg-slate-50 px-3 py-3">
            <Text className="text-sm text-slate-500">No history available.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ContextTimeline;
