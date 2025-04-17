import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  
  // User preferences
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);
  const [preferredPayment, setPreferredPayment] = useState('Credit Card');
  
  // App version - hardcoded for now, would normally use expo-application
  const appVersion = '1.0.0';
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            // In a real app, clear auth tokens, etc.
            // For now, just navigate back to login
            router.replace('/');
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Open external links
  const openLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open link:', err);
      Alert.alert('Error', 'Could not open the link');
    });
  };
  
  const openEmailSupport = () => {
    Linking.openURL('mailto:support@zinklakerecreation.com?subject=App Support Request');
  };
  
  // Clear app data
  const clearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'This will reset all app preferences and cached data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          onPress: () => {
            // In a real app, clear AsyncStorage, etc.
            Alert.alert('Success', 'All app data has been cleared');
            
            // Reset all settings to default
            setPushNotifications(true);
            setEmailNotifications(true);
            setLocationServices(true);
            setDarkMode(false);
            setSaveLoginInfo(true);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Render a basic setting with a toggle switch
  const renderToggleSetting = (title, description, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#d3d3d3", true: "#3498db" }}
      />
    </View>
  );
  
  // Render a setting that opens a submenu or action
  const renderActionSetting = (title, description, iconName, action) => (
    <TouchableOpacity style={styles.settingItem} onPress={action}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Ionicons name={iconName} size={24} color="#777" />
    </TouchableOpacity>
  );
  
  // Render a section header
  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
  
  // Render payment method selector
  const selectPaymentMethod = () => {
    Alert.alert(
      'Select Default Payment Method',
      'Choose your preferred payment method:',
      [
        {
          text: 'Credit Card',
          onPress: () => setPreferredPayment('Credit Card')
        },
        {
          text: 'PayPal',
          onPress: () => setPreferredPayment('PayPal')
        },
        {
          text: 'Apple Pay',
          onPress: () => setPreferredPayment('Apple Pay')
        },
        {
          text: 'Google Pay',
          onPress: () => setPreferredPayment('Google Pay')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Notifications Settings */}
        {renderSectionHeader('Notifications')}
        
        {renderToggleSetting(
          'Push Notifications',
          'Receive push notifications for booking updates and special offers',
          pushNotifications,
          setPushNotifications
        )}
        
        {renderToggleSetting(
          'Email Notifications',
          'Receive email updates about your bookings and account',
          emailNotifications,
          setEmailNotifications
        )}
        
        {/* App Preferences */}
        {renderSectionHeader('App Preferences')}
        
        {renderToggleSetting(
          'Location Services',
          'Allow the app to access your location for pickup services',
          locationServices,
          setLocationServices
        )}
        
        {renderToggleSetting(
          'Dark Mode',
          'Switch between light and dark app themes',
          darkMode,
          setDarkMode
        )}
        
        {renderToggleSetting(
          'Save Login Information',
          'Stay logged in when you close the app',
          saveLoginInfo,
          setSaveLoginInfo
        )}
        
        {/* Payment Settings */}
        {renderSectionHeader('Payment')}
        
        {renderActionSetting(
          'Default Payment Method',
          `Current: ${preferredPayment}`,
          'chevron-forward',
          selectPaymentMethod
        )}
        
        {renderActionSetting(
          'Payment History',
          'View your past payments and receipts',
          'chevron-forward',
          () => router.push('/payment-history')
        )}
        
        {/* Account Settings */}
        {renderSectionHeader('Account')}
        
        {renderActionSetting(
          'My Profile',
          'View and edit your personal information',
          'chevron-forward',
          () => router.push('/profile')
        )}
        
        {renderActionSetting(
          'Change Password',
          'Update your account password',
          'chevron-forward',
          () => router.push('/change-password')
        )}
        
        {/* Support & About */}
        {renderSectionHeader('Support & About')}
        
        {renderActionSetting(
          'Help Center',
          'Frequently asked questions and support resources',
          'chevron-forward',
          () => router.push('/faq')
        )}
        
        {renderActionSetting(
          'Contact Support',
          'Get help with issues or provide feedback',
          'mail',
          openEmailSupport
        )}
        
        {renderActionSetting(
          'Privacy Policy',
          'Read our privacy policy',
          'document-text',
          () => openLink('https://www.zinklakerecreation.com/privacy')
        )}
        
        {renderActionSetting(
          'Terms of Service',
          'Read our terms of service',
          'document-text',
          () => openLink('https://www.zinklakerecreation.com/terms')
        )}
        
        {renderActionSetting(
          'App Version',
          `Version ${appVersion}`,
          'information-circle',
          () => Alert.alert('App Info', `Zink Lake Recreation\nVersion ${appVersion}`)
        )}
        
        {/* Advanced Options */}
        {renderSectionHeader('Advanced')}
        
        {renderActionSetting(
          'Clear App Data',
          'Reset all app preferences and cached data',
          'trash',
          clearAppData
        )}
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        {/* App Information */}
        <Text style={styles.copyrightText}>
          © 2025 Zink Lake Recreation. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  contentContainer: {
    padding: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 25,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyrightText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
});