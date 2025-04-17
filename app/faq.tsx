import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  Keyboard,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// FAQ data structure
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Initial FAQ data
const initialFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'What are the operating hours for pickup and dropoff services?',
    answer: 'Our pickup and dropoff services operate 7 days a week from 8:00 AM to 6:00 PM. During peak season (May through September), we offer extended hours until 8:00 PM on Fridays, Saturdays, and holidays. Please note that all bookings must be made at least 2 hours in advance.',
    category: 'Services'
  },
  {
    id: '2',
    question: 'How do I book a pickup or drop-off?',
    answer: 'Book through our mobile app or website—just select your time, location, and group size.',
    category: 'Services'
  },
  {
    id: '3',
    question: 'Can I request same-day shuttle service?',
    answer: 'Yes, depending on availability. We recommend booking in advance for guaranteed service.',
    category: 'Services'
  },
  {
    id: '4',
    question: 'How much does the shuttle service cost?',
    answer: 'Prices start at $5 per ride, with discounts for round trips and group bookings.',
    category: 'Services'
  },
  {
    id: '5',
    question: 'Is the shuttle accessible for strollers, bikes, or mobility devices?',
    answer: 'Yes, our shuttles are equipped to accommodate all three with advance notice.',
    category: 'Services'
  },
  {
    id: '6',
    question: 'What are your operating hours?',
    answer: 'We operate daily from 8 AM to 8 PM, with extended hours on weekends.',
    category: 'Scheduling'
  },
  {
    id: '7',
    question: 'How far in advance should I schedule my ride?',
    answer: 'At least 2 hours in advance is ideal, but earlier bookings get priority.',
    category: 'Scheduling'
  },
  {
    id: '8',
    question: 'What happens if I miss my scheduled shuttle?',
    answer: 'You can reschedule through the app, but no-shows may be charged a fee.',
    category: 'Scheduling'
  },
  {
    id: '9',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards, Apple Pay, Google Pay, and online payments.',
    category: 'Payments'
  },
  {
    id: '10',
    question: 'Is payment required in advance?',
    answer: 'Yes, all rides must be paid for at the time of booking.',
    category: 'Payments'
  },
  {
    id: '11',
    question: 'Do you offer refunds or rescheduling options?',
    answer: 'Yes, rides canceled at least 1 hour before pickup are eligible for a refund or reschedule.',
    category: 'Payments'
  },
  {
    id: '12',
    question: 'What activities can I do around Zink Lake?',
    answer: 'Enjoy walking trails, kayaking, fishing, bird-watching, and more.',
    category: 'Experience'
  },
  {
    id: '13',
    question: 'Is the lake open year-round?',
    answer: 'Yes, but some amenities may be limited during the off-season.',
    category: 'Experience'
  },
  {
    id: '14',
    question: 'Are there restroom or picnic facilities available at the lake?',
    answer: 'Yes, public restrooms and picnic areas are available near key drop-off spots.',
    category: 'Experience'
  },
  {
    id: '15',
    question: 'Can I book a shuttle for a group or special event?',
    answer: 'Yes! Contact us for custom scheduling and group rates.',
    category: 'Group & Events'
  },
  {
    id: '16',
    question: 'Do you offer packages for schools, organizations, or corporate outings?',
    answer: 'Absolutely—reach out to discuss tailored options.',
    category: 'Group & Events'
  },
  {
    id: '17',
    question: 'What safety protocols are in place for the shuttle?',
    answer: 'Our vehicles are cleaned daily, drivers are trained in safety procedures, and seatbelts are provided.',
    category: 'Policies'
  },
  {
    id: '18',
    question: 'Do children need to be accompanied by an adult?',
    answer: 'Yes, children under 12 must be with an adult.',
    category: 'Policies'
  },
  {
    id: '19',
    question: 'Are pets allowed on the shuttle?',
    answer: 'Leashed pets and service animals are welcome.',
    category: 'Policies'
  },
  {
    id: '20',
    question: 'Can I track the shuttle in real time?',
    answer: 'Yes, live tracking is available through our app.',
    category: 'Tech'
  },
  {
    id: '21',
    question: 'Is there a mobile app for booking and updates?',
    answer: 'Yes, our app is available on iOS and Android.',
    category: 'Tech'
  },
  {
    id: '22',
    question: 'How can I contact Zink Lake Recreation for help or feedback?',
    answer: 'You can message us through the app, email us, or call our support line.',
    category: 'Tech'
  }
];

// Categories for filtering
const categories = ['All', 'Services', 'Scheduling', 'Payments', 'Experience', 'Group & Events', 'Policies', 'Tech'];

export default function FAQ() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  
  // Update screen width when orientation changes
  useEffect(() => {
    const dimensionsHandler = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    
    return () => {
      dimensionsHandler.remove();
    };
  }, []);
  
  // Calculate category button width for fixed size
  const getCategoryWidth = () => {
    // We want 3 buttons per row with some spacing
    return (screenWidth - 60) / 3; // 60 = padding and margins
  };
  
  // Group FAQs by category when showing All
  const groupedFAQs = () => {
    if (selectedCategory !== 'All') {
      return { [selectedCategory]: filteredFAQs };
    }
    
    const grouped: Record<string, FAQItem[]> = {};
    
    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    
    return grouped;
  };
  
  // Filter FAQs based on search query and selected category
  const filteredFAQs = initialFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      
      // Animate opening
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // Render a FAQ item
  const renderFAQItem = (item: FAQItem, showCategory = true) => {
    const isExpanded = expandedId === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{item.question}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={22} 
            color="#555"
          />
        </View>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setExpandedId(null); // Collapse any expanded FAQ
  };
  
  // Render categories in a grid with fixed-size buttons
  const renderCategories = () => {
    const buttonWidth = getCategoryWidth();
    
    return (
      <View style={styles.categoriesGrid}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { width: buttonWidth },
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render grouped FAQs with category headers
  const renderGroupedFAQs = () => {
    const grouped = groupedFAQs();
    const categories = Object.keys(grouped).sort();
    
    if (categories.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Ionicons name="help-circle-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsText}>No FAQs found</Text>
          <Text style={styles.noResultsSubtext}>
            Try adjusting your search or category filter
          </Text>
        </View>
      );
    }
    
    return (
      <>
        {categories.map(category => (
          <View key={category}>
            {selectedCategory === 'All' && (
              <Text style={styles.categoryHeader}>{category}</Text>
            )}
            {grouped[category].map(item => renderFAQItem(item, selectedCategory !== 'All'))}
          </View>
        ))}
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {renderCategories()}
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderGroupedFAQs()}
        
        <View style={styles.contactPrompt}>
          <Text style={styles.contactPromptTitle}>
            Still have questions?
          </Text>
          <Text style={styles.contactPromptText}>
            If you couldn't find what you're looking for, please contact our staff directly.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push('/contact')}
          >
            <Text style={styles.contactButtonText}>Contact Staff</Text>
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contentContainer: {
    padding: 15,
    paddingTop: 5,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqItemExpanded: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionContainer: {
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    color: '#3498db',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  answerContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'center',
  },
  contactPrompt: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  contactPromptTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  contactPromptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});