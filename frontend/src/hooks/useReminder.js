import { useMemo } from 'react';

import { useReminderStore } from '../store/reminderStore';

const useReminder = () => {
  const state = useReminderStore((store) => store);

  const visibleReminders = useMemo(() => state.visibleReminders, [state.visibleReminders]);

  return {
    ...state,
    visibleReminders
  };
};

export default useReminder;
