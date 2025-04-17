import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Linking,
  KeyboardAvoidingView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Company contact info
const COMPANY_PHONE = "918-212-4822";
const COMPANY_EMAIL = "info@zinklakerecreation.com";

export default function ContactStaff() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!name || !email || !message) {
      Alert.alert('Missing Information', 'Please fill in your name, email, and message.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message
      Alert.alert(
        'Message Sent',
        'Your message has been sent successfully. Our staff will get back to you soon.',
        [{ text: 'OK', onPress: () => {
          // Clear form
          setName('');
          setEmail('');
          setPhone('');
          setSubject('');
          setMessage('');
        }}]
      );
    }, 1000);
  };
  
  // Handle direct call
  const handleCall = () => {
    const phoneUrl = `tel:${COMPANY_PHONE}`;
    
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Phone Not Available', 'Cannot make phone calls from this device');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };
  
  // Handle direct email
  const handleEmail = () => {
    const emailUrl = `mailto:${COMPANY_EMAIL}`;
    
    Linking.canOpenURL(emailUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(emailUrl);
        } else {
          Alert.alert('Email Not Available', 'Cannot open email app on this device');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Staff</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Direct Contact Options */}
          <View style={styles.directContactContainer}>
            <Text style={styles.sectionTitle}>Contact Us Directly</Text>
            
            <TouchableOpacity style={styles.contactOption} onPress={handleCall}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call" size={30} color="#fff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>Call Us</Text>
                <Text style={styles.contactDetail}>{COMPANY_PHONE}</Text>
                <Text style={styles.contactSubtext}>Available 7 days a week, 8AM-6PM EST</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption} onPress={handleEmail}>
              <View style={[styles.contactIconContainer, {backgroundColor: '#e67e22'}]}>
                <Ionicons name="mail" size={30} color="#fff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>Email Us</Text>
                <Text style={styles.contactDetail}>{COMPANY_EMAIL}</Text>
                <Text style={styles.contactSubtext}>We typically respond within 24 hours</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </TouchableOpacity>
          </View>
          
          {/* Contact Form */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Send a Message</Text>
            
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="What is your message about?"
            />
            
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                isSubmitting && styles.submittingButton
              ]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* FAQ Prompt */}
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>
              Have a quick question?
            </Text>
            <Text style={styles.faqText}>
              Check our Frequently Asked Questions for instant answers.
            </Text>
            <TouchableOpacity style={styles.faqButton} onPress={() => router.push('/faq')}>
              <Text style={styles.faqButtonText}>View FAQs</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  directContactContainer: {
    marginBottom: 25,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
  contactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactDetail: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
  },
  contactSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submittingButton: {
    backgroundColor: '#7fb9e2',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  faqTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  faqText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  faqButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#e6f2ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  faqButtonText: {
    color: '#3498db',
    fontWeight: '500',
  },
});