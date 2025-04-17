import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Conditionally import DateTimePicker for native platforms
let DateTimePicker;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function Booking() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  // Date state
  const today = new Date();
  const [date, setDate] = useState(today);
  const formattedDate = today.toISOString().split('T')[0];
  const [dateValue, setDateValue] = useState(formattedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Time state
  const roundedTime = new Date();
  roundedTime.setHours(roundedTime.getHours() + 1);
  roundedTime.setMinutes(Math.ceil(roundedTime.getMinutes() / 15) * 15);
  const [time, setTime] = useState(roundedTime);
  const formattedTime = roundedTime.toTimeString().slice(0, 5);
  const [timeValue, setTimeValue] = useState(formattedTime);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Handle date changes for native platforms
  const onDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setDateValue(currentDate.toISOString().split('T')[0]);
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  // Handle time changes for native platforms
  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setTimeValue(currentTime.toTimeString().slice(0, 5));
    
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };
  
  // Handle date changes for web
  const handleWebDateChange = (e) => {
    setDateValue(e.target.value);
    const newDate = new Date(e.target.value);
    setDate(newDate);
  };
  
  // Handle time changes for web
  const handleWebTimeChange = (e) => {
    setTimeValue(e.target.value);
    const [hours, minutes] = e.target.value.split(':');
    const newTime = new Date();
    newTime.setHours(parseInt(hours, 10));
    newTime.setMinutes(parseInt(minutes, 10));
    setTime(newTime);
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!name || !phone || !pickupLocation || !dropoffLocation) {
      if (Platform.OS === 'web') {
        alert('Please fill in all required fields');
      } else {
        Alert.alert('Missing Information', 'Please fill in all required fields');
      }
      return;
    }
    
    const displayDate = Platform.OS === 'web' ? dateValue : date.toLocaleDateString();
    const displayTime = Platform.OS === 'web' ? timeValue : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Show success message
    if (Platform.OS === 'web') {
      alert(`Thank you ${name}! Your pickup has been scheduled for ${displayDate} at ${displayTime}`);
      router.back();
    } else {
      Alert.alert(
        'Booking Confirmed',
        `Thank you ${name}! Your pickup has been scheduled for ${displayDate} at ${displayTime}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Pickup/Dropoff</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          value={pickupLocation}
          onChangeText={setPickupLocation}
          placeholder="Enter pickup location"
        />
        
        <Text style={styles.label}>Dropoff Location</Text>
        <TextInput
          style={styles.input}
          value={dropoffLocation}
          onChangeText={setDropoffLocation}
          placeholder="Enter dropoff location"
        />
        
        <Text style={styles.label}>Date</Text>
        {Platform.OS === 'web' ? (
          // Web date input
          <input
            type="date"
            value={dateValue}
            onChange={handleWebDateChange}
            min={formattedDate}
            style={{
              padding: 12,
              width: '100%',
              borderRadius: 8,
              border: '1px solid #ddd',
              marginBottom: 15,
              fontSize: 16
            }}
          />
        ) : (
          // Native date selector
          <>
            <TouchableOpacity 
              style={styles.dateTimeButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
              <Ionicons name="calendar" size={24} color="#3498db" />
            </TouchableOpacity>
            
            {showDatePicker && (
              Platform.OS === 'ios' ? (
                <View style={styles.iosPickerContainer}>
                  <View style={styles.iosPickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    style={styles.iosPicker}
                  />
                </View>
              ) : (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )
            )}
          </>
        )}
        
        <Text style={styles.label}>Time</Text>
        {Platform.OS === 'web' ? (
          // Web time input
          <input
            type="time"
            value={timeValue}
            onChange={handleWebTimeChange}
            style={{
              padding: 12,
              width: '100%',
              borderRadius: 8,
              border: '1px solid #ddd',
              marginBottom: 15,
              fontSize: 16
            }}
          />
        ) : (
          // Native time selector
          <>
            <TouchableOpacity 
              style={styles.dateTimeButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Ionicons name="time" size={24} color="#3498db" />
            </TouchableOpacity>
            
            {showTimePicker && (
              Platform.OS === 'ios' ? (
                <View style={styles.iosPickerContainer}>
                  <View style={styles.iosPickerHeader}>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.iosPickerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.iosPickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={onTimeChange}
                    style={styles.iosPicker}
                  />
                </View>
              ) : (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )
            )}
          </>
        )}
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Book Now</Text>
        </TouchableOpacity>
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // iOS specific picker styles
  iosPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iosPickerCancelText: {
    color: '#999',
    fontSize: 16,
  },
  iosPickerDoneText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  iosPicker: {
    height: 200,
  },
});