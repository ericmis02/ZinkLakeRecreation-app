import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  Dimensions,
  Image,
  Modal,
  Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const WEBSITE_URL = 'https://www.zinklakerecreation.com';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  
  // Handle screen rotation or dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
    });
    
    return () => subscription?.remove();
  }, []);
  
  const openWebsite = async () => {
    const canOpen = await Linking.canOpenURL(WEBSITE_URL);
    
    if (canOpen) {
      await Linking.openURL(WEBSITE_URL);
    } else {
      console.error('Unable to open URL: ' + WEBSITE_URL);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderMenu = () => (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setMenuVisible(false)}
    >
      <View style={styles.menuContainer}>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setMenuVisible(false);
            router.push('/profile');
          }}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}onPress={() => {
            setMenuVisible(false);
            router.push('/track');
          }}>
            <Text style={styles.menuText}>Track My Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setMenuVisible(false);
            router.push('/booking');
          }}>
            <Text style={styles.menuText}>Book a Pickup/Dropoff</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setMenuVisible(false);
            router.push('/profile');
          }}>
            <Text style={styles.menuText}>Contact Staff</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setMenuVisible(false);
            openWebsite();
          }}>
            <Text style={styles.menuText}>Website</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setMenuVisible(false);
            router.push('/settings');
          }}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={() => {
            setMenuVisible(false);
            setScreen('login');
          }}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderLogin = () => (
    <View style={[styles.loginWrapper, { width: dimensions.width, height: dimensions.height }]}>
      <ImageBackground 
        source={require('../assets/images/login.jpeg')} 
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Zink Lake Recreation</Text>
          <TextInput placeholder="Email" style={styles.input} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} />
          <Button title="Login" onPress={() => setScreen('home')} />
        </View>
      </ImageBackground>
    </View>
  );

  const handleCardPress = (cardTitle) => {
    console.log(`Card pressed: ${cardTitle}`);
    
    // Navigate based on card title
    if (cardTitle === 'Book Pickup') {
      router.push('/booking');
    }
    else if(cardTitle === 'Website') {
      openWebsite();
    }
    else if (cardTitle === 'My Profile') {
    router.push('/profile');
    } else if (cardTitle === 'Contact Staff') {
      router.push('/contact');
    } else if (cardTitle === 'Settings') {
      router.push('/settings');
    } else if (cardTitle === 'Track My Ride') {
      router.push('/track');
    }

    // Add other card navigation options here
  };

  const renderCard = (label, iconName) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCardPress(label)}
    >
      <Ionicons name={iconName} size={40} color="#3498db" style={styles.cardIcon} />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderHome = () => (
    <View style={styles.homeContainer}>
      {renderHeader()}
      {renderMenu()}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <View style={styles.row}>
          {renderCard('Book Pickup', 'calendar')}
          {renderCard('Track My Ride', 'bicycle')}
        </View>
        <View style={styles.row}>
          {renderCard('Contact Staff', 'call')}
          {renderCard('Settings', 'settings')}
        </View>
        <View>
          {renderCard('Website', 'globe')}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto"/>
      {screen === 'login' ? renderLogin() : renderHome()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loginWrapper: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
  },
  loginContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    margin: 20,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    width: 150,
    height: 40,
  },
  cardContainer: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  emptyCard: {
    flex: 0.48,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 18,
  }
});