import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Custom Hook for Animations
const useFadeIn = (duration = 300) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration]);

  return fadeAnim;
};

// Enhanced Components
const PaymentSection = ({ title, children, style, icon }) => (
  <Animated.View style={[styles.section, style]}>
    <View style={styles.sectionHeader}>
      {icon && <Ionicons name={icon} size={20} color="#6366f1" style={styles.sectionIcon} />}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </Animated.View>
);

const InfoCard = ({ title, details, onEdit, icon = "location-outline", gradient = false }) => (
  <TouchableOpacity 
    style={[styles.infoCard, gradient && styles.infoCardGradient]}
    onPress={onEdit}
    activeOpacity={0.8}
  >
    <View style={styles.infoHeader}>
      <View style={styles.infoTitleContainer}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.iconContainer}
        >
          <Ionicons name={icon} size={16} color="white" />
        </LinearGradient>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </TouchableOpacity>
    </View>
    {Array.isArray(details) ? (
      details.map((detail, index) => (
        <Text key={index} style={styles.infoDetail}>{detail}</Text>
      ))
    ) : (
      <Text style={styles.infoDetail}>{details}</Text>
    )}
  </TouchableOpacity>
);

const ModernButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  disabled = false,
  loading = false 
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[`button_${variant}`],
      disabled && styles.button_disabled
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <Animated.View style={styles.loadingSpinner} />
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    ) : (
      <>
        {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
        <Text style={styles.buttonText}>{title}</Text>
      </>
    )}
  </TouchableOpacity>
);

// Modal Components - Moved outside to prevent re-renders
const EditModal = ({ 
  visible, 
  onClose, 
  editingType, 
  shippingAddress, 
  contactInfo, 
  onSave, 
  onShippingChange, 
  onContactChange 
}) => {
  const renderEditModalContent = () => {
    switch (editingType) {
      case 'address':
        return (
          <>
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={styles.textInput}
              value={shippingAddress.street}
              onChangeText={(text) => onShippingChange('street', text)}
              placeholder="Enter street address"
            />
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.textInput}
              value={shippingAddress.city}
              onChangeText={(text) => onShippingChange('city', text)}
              placeholder="Enter city"
            />
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value={shippingAddress.state}
              onChangeText={(text) => onShippingChange('state', text)}
              placeholder="Enter state"
            />
            <Text style={styles.inputLabel}>ZIP Code</Text>
            <TextInput
              style={styles.textInput}
              value={shippingAddress.zip}
              onChangeText={(text) => onShippingChange('zip', text)}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
            />
          </>
        );
      case 'contact':
        return (
          <>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={contactInfo.phone}
              onChangeText={(text) => onContactChange('phone', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={contactInfo.email}
              onChangeText={(text) => onContactChange('email', text)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.fullModalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingType === 'address' ? 'Edit Shipping Address' : 'Edit Contact Information'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {renderEditModalContent()}
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <ModernButton
            title="Save Changes"
            onPress={onSave}
            variant="primary"
          />
        </View>
      </View>
    </Modal>
  );
};

const VoucherModal = ({ visible, onClose, voucherCode, onVoucherChange, onApply }) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="formSheet"
    onRequestClose={onClose}
  >
    <View style={styles.fullModalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add Voucher</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalContent}>
        <Ionicons name="ticket" size={80} color="#6366f1" style={styles.voucherIcon} />
        <Text style={styles.modalSubtitle}>Enter your voucher code</Text>
        <Text style={styles.modalDescription}>
          Apply your voucher code to get discounts on your purchase
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter voucher code"
          value={voucherCode}
          onChangeText={onVoucherChange}
          autoCapitalize="characters"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.modalFooter}>
        <ModernButton
          title="Apply Voucher"
          onPress={onApply}
          variant="primary"
          disabled={!voucherCode.trim()}
        />
      </View>
    </View>
  </Modal>
);

const PaymentModal = ({ 
  visible, 
  onClose, 
  cardDetails, 
  onCardChange, 
  isProcessing, 
  onProcessPayment, 
  total 
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="formSheet"
    onRequestClose={onClose}
  >
    <View style={styles.fullModalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Payment Details</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardPreview}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.cardPreviewGradient}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color="#fff" />
              <Text style={styles.cardBank}>VISA</Text>
            </View>
            <Text style={styles.cardPreviewNumber}>•••• •••• •••• {cardDetails.number.slice(-4)}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardName}>{cardDetails.name}</Text>
              <Text style={styles.cardExpiry}>{cardDetails.expiry}</Text>
            </View>
          </LinearGradient>
        </View>
        
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.textInput}
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChangeText={(text) => onCardChange('number', text)}
          keyboardType="numeric"
          maxLength={16}
        />
        
        <View style={styles.rowInputs}>
          <View style={styles.flexInput}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChangeText={(text) => onCardChange('expiry', text)}
              maxLength={5}
            />
          </View>
          
          <View style={styles.flexInput}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.textInput}
              placeholder="123"
              value={cardDetails.cvv}
              onChangeText={(text) => onCardChange('cvv', text)}
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
            />
          </View>
        </View>
        
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="John Doe"
          value={cardDetails.name}
          onChangeText={(text) => onCardChange('name', text)}
        />

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#10b981" />
          <Text style={styles.securityText}>Your payment details are secure and encrypted</Text>
        </View>
      </ScrollView>
      
      <View style={styles.modalFooter}>
        <ModernButton
          title={isProcessing ? "Processing..." : `Pay $${total}`}
          onPress={onProcessPayment}
          variant="primary"
          disabled={isProcessing}
          loading={isProcessing}
        />
      </View>
    </View>
  </Modal>
);

const Payments = () => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [editingType, setEditingType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  
  const fadeAnim = useFadeIn();
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Enhanced data structure
  const [shippingAddress, setShippingAddress] = useState({
    street: '123 Main St',
    city: 'Springfield',
    state: 'USA',
    zip: '12345'
  });
  
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (017) 263-69220',
    email: 'example@example.com'
  });

  const [cardDetails, setCardDetails] = useState({
    number: '4242424242424242',
    expiry: '12/25',
    cvv: '123',
    name: 'John Doe'
  });

  const [voucherCode, setVoucherCode] = useState('');

  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 29.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      color: '#3b82f6'
    },
    {
      id: 2,
      name: "Noise Cancelling Earbuds",
      price: 49.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?w=400",
      color: '#8b5cf6'
    }
  ];

  const shippingOptions = [
    {
      id: 'standard',
      type: "Standard Shipping",
      duration: "5-7 days",
      price: "Free",
      icon: 'time-outline'
    },
    {
      id: 'express',
      type: "Express Shipping",
      duration: "1-2 days",
      price: "$9.99",
      icon: 'rocket-outline'
    }
  ];

  const ProductItem = ({ product }) => (
    <View style={styles.productCard}>
      <View style={[styles.productImageContainer, { backgroundColor: product.color }]}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price} x {product.quantity}</Text>
      </View>
      <Text style={styles.productTotal}>${(product.price * product.quantity).toFixed(2)}</Text>
    </View>
  );

  const ShippingOption = ({ option, selected, onSelect }) => (
    <TouchableOpacity 
      style={[
        styles.shippingOption,
        selected && styles.shippingOptionSelected
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.shippingIconContainer}>
        <Ionicons name={option.icon} size={20} color={selected ? '#6366f1' : '#9ca3af'} />
      </View>
      <View style={styles.shippingInfo}>
        <Text style={styles.shippingType}>{option.type}</Text>
        <Text style={styles.shippingDuration}>{option.duration}</Text>
      </View>
      <View style={styles.shippingRadio}>
        {selected && <View style={styles.shippingRadioSelected} />}
      </View>
      <Text style={styles.shippingPrice}>{option.price}</Text>
    </TouchableOpacity>
  );

  const OrderSummaryItem = ({ label, value, bold = false, accent = false }) => (
    <View style={styles.summaryItem}>
      <Text style={[
        styles.summaryLabel, 
        bold && styles.boldText,
        accent && styles.accentText
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.summaryValue, 
        bold && styles.boldText,
        accent && styles.accentText
      ]}>
        {value}
      </Text>
    </View>
  );

  const handleEdit = (type) => {
    setEditingType(type);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    setEditModalVisible(false);
    Alert.alert('Success', `${editingType} updated successfully!`);
  };

  const handleApplyVoucher = () => {
    setVoucherModalVisible(false);
    if (voucherCode) {
      Alert.alert('Voucher Applied', `Voucher ${voucherCode} has been applied!`);
      setVoucherCode('');
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate API call with better animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentModalVisible(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const shipping = selectedShipping === 'express' ? 9.99 : 0;
    const tax = subtotal * 0.09; // 9% tax
    return (subtotal + shipping + tax).toFixed(2);
  };

  // Handler functions for state updates
  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Checkout</Text>
            <Text style={styles.headerSubtitle}>Complete your purchase</Text>
          </LinearGradient>
        </View>

        <PaymentSection title="Shipping Information" icon="navigate-outline">
          <InfoCard
            title="Shipping Address"
            details={[`${shippingAddress.street}, ${shippingAddress.city}`, `${shippingAddress.state}, ${shippingAddress.zip}`]}
            icon="location-outline"
            onEdit={() => handleEdit('address')}
            gradient
          />
          <InfoCard
            title="Contact Information"
            details={[contactInfo.phone, contactInfo.email]}
            icon="person-outline"
            onEdit={() => handleEdit('contact')}
            gradient
          />
        </PaymentSection>

        <PaymentSection title="Order Items" icon="cart-outline">
          <View style={styles.itemsHeader}>
            <View style={styles.itemsTitle}>
              <Text style={styles.sectionTitle}>Items</Text>
              <View style={styles.itemsBadge}>
                <Text style={styles.itemsBadgeText}>{products.length}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.voucherButton}
              onPress={() => setVoucherModalVisible(true)}
            >
              <Ionicons name="ticket-outline" size={16} color="#6366f1" />
              <Text style={styles.voucherText}>Add Voucher</Text>
            </TouchableOpacity>
          </View>
          
          {products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </PaymentSection>

        <PaymentSection title="Shipping Options" icon="car-sport-outline">
          {shippingOptions.map(option => (
            <ShippingOption
              key={option.id}
              option={option}
              selected={selectedShipping === option.id}
              onSelect={() => setSelectedShipping(option.id)}
            />
          ))}
        </PaymentSection>

        <PaymentSection title="Payment Method" icon="card-outline">
          <TouchableOpacity 
            style={[
              styles.paymentMethod,
              selectedPayment === 'card' && styles.paymentMethodSelected
            ]}
            onPress={() => setPaymentModalVisible(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.paymentIconContainer}
            >
              <Ionicons name="card" size={20} color="white" />
            </LinearGradient>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentType}>Credit/Debit Card</Text>
              <Text style={styles.paymentDetail}>Tap to add card details</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </PaymentSection>

        <PaymentSection title="Order Summary" icon="receipt-outline">
          <OrderSummaryItem label="Subtotal" value="$79.98" />
          <OrderSummaryItem 
            label="Shipping" 
            value={selectedShipping === 'express' ? '$9.99' : 'Free'} 
          />
          <OrderSummaryItem label="Tax" value="$7.20" />
          <View style={styles.divider} />
          <OrderSummaryItem 
            label="Total" 
            value={`$${calculateTotal()}`}
            bold={true}
            accent={true}
          />
        </PaymentSection>

        <ModernButton
          title="Pay Now"
          onPress={() => setPaymentModalVisible(true)}
          icon="lock-closed"
          loading={isProcessing}
          variant="primary"
        />
      </Animated.ScrollView>

      {/* Enhanced Modals */}
      <EditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        editingType={editingType}
        shippingAddress={shippingAddress}
        contactInfo={contactInfo}
        onSave={handleSaveEdit}
        onShippingChange={handleShippingChange}
        onContactChange={handleContactChange}
      />
      
      <VoucherModal
        visible={voucherModalVisible}
        onClose={() => setVoucherModalVisible(false)}
        voucherCode={voucherCode}
        onVoucherChange={setVoucherCode}
        onApply={handleApplyVoucher}
      />
      
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        cardDetails={cardDetails}
        onCardChange={handleCardChange}
        isProcessing={isProcessing}
        onProcessPayment={processPayment}
        total={calculateTotal()}
      />

      {/* Success Notification */}
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successNotification,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <View style={styles.successContent}>
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.successSubtext}>Order #12345 has been confirmed</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

// ... (keep all the same styles from your previous code)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  headerGradient: {
    padding: 32,
    paddingTop: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardGradient: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  infoDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  itemsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  voucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
  },
  voucherText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 10,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: '#6b7280',
  },
  productTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    marginBottom: 10,
  },
  shippingOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  shippingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shippingInfo: {
    flex: 1,
  },
  shippingType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  shippingDuration: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  shippingRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shippingRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  shippingPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
  },
  paymentMethodSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  paymentDetail: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 16,
  },
  accentText: {
    color: '#6366f1',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  button: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  button_primary: {
    backgroundColor: '#6366f1',
  },
  button_secondary: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  button_disabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: 'white',
    marginRight: 8,
  },
  // Enhanced Modal Styles
  fullModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  voucherIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#1f2937',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  flexInput: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  // Card Preview Styles
  cardPreview: {
    marginBottom: 24,
  },
  cardPreviewGradient: {
    padding: 24,
    borderRadius: 16,
    height: 180,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBank: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cardPreviewNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cardExpiry: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom:50, 
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  securityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  // Success Notification
  successNotification: {
    position: 'absolute',
    top: -250,
    left: 20,
    right: 20,
    backgroundColor: '#3C4454',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  successContent: {
    marginLeft: 12,
    flex: 1,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  successSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Payments;