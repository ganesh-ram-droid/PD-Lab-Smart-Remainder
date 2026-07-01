import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SettingsCard from '../../components/profile/SettingsCard';
import ThemeSelector from '../../components/profile/ThemeSelector';
import NotificationSettings from '../../components/profile/NotificationSettings';
import PreferenceCard from '../../components/profile/PreferenceCard';
import LogoutDialog from '../../components/profile/LogoutDialog';
import DeleteAccountDialog from '../../components/profile/DeleteAccountDialog';
import { useProfileStore } from '../../store/profileStore';
import { useThemeStore } from '../../store/themeStore';
import routes from '../../constants/routes';
import { showToast } from '../../utils/toast';

const SettingsScreen = ({ navigation }) => {
  const { settings, loadSettings, updateSetting, logout, deleteAccount, saving } = useProfileStore((state) => state);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    loadSettings().catch(() => null);
  }, [loadSettings]);

  const handleThemeChange = (value) => {
    setTheme(value);
    updateSetting('darkModeEnabled', value === 'dark');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <ProfileHeader title="Settings" subtitle="Preferences and account options" />

        <View className="mt-4">
          <SettingsCard title="Theme" subtitle="Choose the application appearance">
            <ThemeSelector value={theme} onChange={handleThemeChange} />
          </SettingsCard>
        </View>

        <View className="mt-4">
          <SettingsCard title="Notification Settings" subtitle="Control how reminders behave">
            <NotificationSettings settings={settings} onChangeSetting={updateSetting} />
          </SettingsCard>
        </View>

        <View className="mt-4">
          <SettingsCard title="Preferences" subtitle="Language and feature options">
            <PreferenceCard
              title="Language"
              subtitle={settings.language || 'English'}
              onPress={() => Alert.alert('Language', 'Language selection is a placeholder for future localization.')}
            />
            <View className="h-3" />
            <PreferenceCard title="Privacy" subtitle="Permissions and data usage" onPress={() => navigation.navigate(routes.PRIVACY)} />
            <View className="h-3" />
            <PreferenceCard title="About" subtitle="Application and project details" onPress={() => navigation.navigate(routes.ABOUT)} />
            <View className="h-3" />
            <PreferenceCard title="Help & Support" subtitle="Troubleshooting and usage" onPress={() => navigation.navigate(routes.HELP)} />
          </SettingsCard>
        </View>

        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="text-base font-bold text-slate-950">Account</Text>
          <View className="mt-4 flex-row flex-wrap">
            <View className="mb-3 mr-2 w-[48%]">
              <Button title="Logout" variant="danger" onPress={() => setLogoutVisible(true)} loading={saving} />
            </View>
            <View className="mb-3 w-[48%]">
              <Button title="Delete Account" variant="secondary" onPress={() => setDeleteVisible(true)} loading={saving} />
            </View>
          </View>
          <View className="rounded-2xl bg-slate-50 px-4 py-4">
            <View className="flex-row items-center">
              <Icon name="shield-checkmark-outline" size={18} color="#16A34A" />
              <Text className="ml-2 text-sm font-semibold text-slate-900">Secure Firebase session</Text>
            </View>
            <Text className="mt-2 text-xs leading-5 text-slate-500">
              Logout and account deletion are handled through authenticated backend APIs and Firebase session cleanup.
            </Text>
          </View>
        </View>
      </ScrollView>

      <LogoutDialog
        visible={logoutVisible}
        loading={saving}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={async () => {
          try {
            await logout();
            showToast({ type: 'info', message: 'You have been signed out.' });
          } catch (error) {
            Alert.alert('Logout failed', error.message);
          } finally {
            setLogoutVisible(false);
          }
        }}
      />

      <DeleteAccountDialog
        visible={deleteVisible}
        loading={saving}
        onCancel={() => setDeleteVisible(false)}
        onConfirm={async () => {
          try {
            await deleteAccount();
            showToast({ type: 'success', message: 'Account deleted successfully.' });
          } catch (error) {
            Alert.alert('Delete failed', error.message);
          } finally {
            setDeleteVisible(false);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
