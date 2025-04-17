import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
  Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for rides
const MOCK_RIDES = [
  {
    id: '12345',
    status: 'in-progress',
    pickup: '21st & Riverside',
    dropoff: 'BMX Parking Lot',
    scheduledTime: '2:30 PM',
    estimatedArrival: '2:45 PM',
    driverName: 'Michael Rodriguez',
    driverPhone: '555-123-4567',
    vehicleType: 'Shuttle Bus',
    vehicleId: 'Bus #3',
    passengerCount: 2
  },
  {
    id: '12346',
    status: 'scheduled',
    pickup: '23rd Street Skate Park',
    dropoff: 'Swift Park Boat Launch - Keystone Dam',
    scheduledTime: '4:15 PM',
    estimatedArrival: '4:45 PM',
    driverName: 'Sarah Johnson',
    driverPhone: '555-987-6543',
    vehicleType: 'Passenger Van',
    vehicleId: 'Van #7',
    passengerCount: 3
  }
];

// Ride statuses and their corresponding UI elements
const STATUS_CONFIG = {
  'scheduled': {
    icon: 'calendar',
    color: '#3498db',
    label: 'Scheduled',
    description: 'Your ride is confirmed and scheduled.'
  },
  'in-progress': {
    icon: 'bicycle',
    color: '#2ecc71',
    label: 'In Progress',
    description: 'Your driver is on the way.'
  },
  'arriving': {
    icon: 'location',
    color: '#f39c12',
    label: 'Arriving Soon',
    description: 'Your driver is arriving in a few minutes.'
  },
  'completed': {
    icon: 'checkmark-circle',
    color: '#27ae60',
    label: 'Completed',
    description: 'Your ride has been completed successfully.'
  },
  'cancelled': {
    icon: 'close-circle',
    color: '#e74c3c',
    label: 'Cancelled',
    description: 'This ride has been cancelled.'
  }
};

// Progress steps for the ride journey
const PROGRESS_STEPS = [
  { id: 'booked', label: 'Booked' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'on-way', label: 'On the Way' },
  { id: 'arrived', label: 'Arrived' },
  { id: 'completed', label: 'Completed' }
];

// Map step IDs to ride statuses
const getStepProgress = (status) => {
  switch(status) {
    case 'scheduled': return 1; // Completed "Booked", on "Confirmed"
    case 'in-progress': return 2; // Completed "Confirmed", on "On the Way"
    case 'arriving': return 3; // Completed "On the Way", on "Arrived"
    case 'completed': return 4; // Completed "Arrived", on "Completed"
    default: return 0;
  }
};

export default function TrackRide() {
  const router = useRouter();
  const [activeRide, setActiveRide] = useState(null);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch rides data
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const active = MOCK_RIDES.find(ride => 
        ride.status === 'in-progress' || ride.status === 'arriving'
      );
      
      const upcoming = MOCK_RIDES.filter(ride => 
        ride.status === 'scheduled'
      );
      
      setActiveRide(active);
      setUpcomingRides(upcoming);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Simulate refreshing data
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Handle calling driver
  const callDriver = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  
  // Render progress steps
  const renderProgressSteps = (status) => {
    const currentStep = getStepProgress(status);
    
    return (
      <View style={styles.progressContainer}>
        {PROGRESS_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <View style={[
              styles.stepCircle,
              index <= currentStep ? styles.stepCompleted : styles.stepIncomplete
            ]}>
              {index < currentStep ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  index <= currentStep ? styles.stepNumberCompleted : styles.stepNumberIncomplete
                ]}>{index + 1}</Text>
              )}
            </View>
            
            {/* Connector line */}
            {index < PROGRESS_STEPS.length - 1 && (
              <View style={[
                styles.connector,
                index < currentStep ? styles.connectorCompleted : styles.connectorIncomplete
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };
  
  // Render step labels
  const renderStepLabels = () => (
    <View style={styles.labelContainer}>
      {PROGRESS_STEPS.map((step) => (
        <Text key={step.id} style={styles.stepLabel}>{step.label}</Text>
      ))}
    </View>
  );
  
  // Render active ride card
  const renderActiveRide = () => {
    if (!activeRide) return null;
    
    const status = STATUS_CONFIG[activeRide.status];
    
    return (
      <View style={styles.activeRideContainer}>
        <View style={styles.activeRideHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: status.color }]}>
            <Ionicons name={status.icon} size={20} color="#fff" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusLabel}>{status.label}</Text>
            <Text style={styles.statusDescription}>{status.description}</Text>
          </View>
        </View>
        
        {/* Progress tracker */}
        <View style={styles.progressTrackerContainer}>
          {renderProgressSteps(activeRide.status)}
          {renderStepLabels()}
        </View>
        
        {/* Ride details */}
        <View style={styles.detailsContainer}>
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <View style={styles.originDot} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationName}>{activeRide.pickup}</Text>
                <Text style={styles.timeText}>Scheduled: {activeRide.scheduledTime}</Text>
              </View>
            </View>
            
            <View style={styles.locationConnector} />
            
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Dropoff</Text>
                <Text style={styles.locationName}>{activeRide.dropoff}</Text>
                <Text style={styles.timeText}>ETA: {activeRide.estimatedArrival}</Text>
              </View>
            </View>
          </View>
          
          {/* Driver info */}
          <View style={styles.driverContainer}>
            <View style={styles.driverInfoContainer}>
              <View style={styles.driverImageContainer}>
                <Ionicons name="person-circle" size={50} color="#3498db" />
              </View>
              <View style={styles.driverTextContainer}>
                <Text style={styles.driverName}>{activeRide.driverName}</Text>
                <Text style={styles.vehicleInfo}>
                  {activeRide.vehicleType} - {activeRide.vehicleId}
                </Text>
                <Text style={styles.rideInfo}>
                  Passengers: {activeRide.passengerCount}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={() => callDriver(activeRide.driverPhone)}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call Driver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  // Render upcoming ride card
  const renderUpcomingRide = (ride) => (
    <TouchableOpacity key={ride.id} style={styles.upcomingRideCard}>
      <View style={styles.upcomingRideHeader}>
        <Text style={styles.upcomingRideTitle}>Upcoming Ride</Text>
        <View style={styles.upcomingRideTime}>
          <Ionicons name="time" size={16} color="#3498db" />
          <Text style={styles.upcomingRideTimeText}>{ride.scheduledTime}</Text>
        </View>
      </View>
      
      <View style={styles.upcomingRideDetails}>
        <View style={styles.upcomingRideRow}>
          <Ionicons name="navigate-circle" size={18} color="#3498db" />
          <Text style={styles.upcomingRideText}>From: {ride.pickup}</Text>
        </View>
        <View style={styles.upcomingRideRow}>
          <Ionicons name="location" size={18} color="#e74c3c" />
          <Text style={styles.upcomingRideText}>To: {ride.dropoff}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track My Ride</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading your rides...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {activeRide ? (
            renderActiveRide()
          ) : (
            <View style={styles.noActiveContainer}>
              <Image 
                source={require('../assets/images/no-rides.jpg')} 
                style={styles.noRideImage}
                resizeMode="contain"
              />
              <Text style={styles.noActiveTitle}>No Active Rides</Text>
              <Text style={styles.noActiveText}>
                You don't have any active rides at the moment.
              </Text>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => router.push('/booking')}
              >
                <Text style={styles.bookButtonText}>Book a Ride</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {upcomingRides.length > 0 && (
            <View style={styles.upcomingContainer}>
              <Text style={styles.sectionTitle}>Upcoming Rides</Text>
              {upcomingRides.map(ride => renderUpcomingRide(ride))}
            </View>
          )}
        </ScrollView>
      )}
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
  refreshButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#777',
  },
  noActiveContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  noRideImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  noActiveTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  noActiveText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  activeRideContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  activeRideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  progressTrackerContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#3498db',
  },
  stepIncomplete: {
    backgroundColor: '#e0e0e0',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepNumberCompleted: {
    color: '#fff',
  },
  stepNumberIncomplete: {
    color: '#777',
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 5,
  },
  connectorCompleted: {
    backgroundColor: '#3498db',
  },
  connectorIncomplete: {
    backgroundColor: '#e0e0e0',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    width: 60,
    marginHorizontal: -16,
  },
  detailsContainer: {
    padding: 15,
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIconContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
  },
  locationConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginLeft: 9,
    marginVertical: 5,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    color: '#555',
  },
  driverContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  driverImageContainer: {
    marginRight: 15,
  },
  driverTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  rideInfo: {
    fontSize: 14,
    color: '#555',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  upcomingContainer: {
    marginTop: 10,
  },
  upcomingRideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingRideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  upcomingRideTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingRideTimeText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
    marginLeft: 5,
  },
  upcomingRideDetails: {
    marginTop: 5,
  },
  upcomingRideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingRideText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
});