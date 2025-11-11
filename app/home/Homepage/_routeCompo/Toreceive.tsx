import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import OrderTracking from '../OrderTracking'

const Toreceive = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-12345',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-22',
      status: 'shipped',
      total: 129.97,
      items: [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 79.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          tracking: {
            currentStep: 2,
            steps: [
              { title: 'Order Placed', description: 'Your order has been confirmed', time: 'Jan 15, 10:30 AM', completed: true },
              { title: 'Processing', description: 'Seller is preparing your order', time: 'Jan 15, 2:15 PM', completed: true },
              { title: 'Shipped', description: 'Your order has been shipped', time: 'Jan 16, 9:45 AM', completed: true },
              { title: 'Out for Delivery', description: 'Your order is out for delivery', time: 'Expected Jan 18', completed: false },
              { title: 'Delivered', description: 'Your order has been delivered', time: 'Expected by Jan 22', completed: false }
            ]
          }
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-12346',
      orderDate: '2024-01-10',
      expectedDelivery: '2024-01-25',
      status: 'processing',
      total: 89.98,
      items: [
        {
          id: '2',
          name: 'Smart Fitness Watch',
          price: 49.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          tracking: {
            currentStep: 1,
            steps: [
              { title: 'Order Placed', description: 'Your order has been confirmed', time: 'Jan 10, 3:20 PM', completed: true },
              { title: 'Processing', description: 'Seller is preparing your order', time: 'In progress', completed: true },
              { title: 'Shipped', description: 'Your order will be shipped soon', time: 'Expected Jan 17', completed: false },
              { title: 'Out for Delivery', description: 'Your order will be out for delivery', time: 'Expected Jan 23', completed: false },
              { title: 'Delivered', description: 'Your order will be delivered', time: 'Expected by Jan 25', completed: false }
            ]
          }
        },
        {
          id: '3',
          name: 'Phone Case',
          price: 19.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400',
          tracking: {
            currentStep: 1,
            steps: [
              { title: 'Order Placed', description: 'Your order has been confirmed', time: 'Jan 10, 3:20 PM', completed: true },
              { title: 'Processing', description: 'Seller is preparing your order', time: 'In progress', completed: true },
              { title: 'Shipped', description: 'Your order will be shipped soon', time: 'Expected Jan 17', completed: false },
              { title: 'Out for Delivery', description: 'Your order will be out for delivery', time: 'Expected Jan 23', completed: false },
              { title: 'Delivered', description: 'Your order will be delivered', time: 'Expected by Jan 25', completed: false }
            ]
          }
        }
      ]
    }
  ])

  const handleTrackOrder = (order) => {
    setSelectedOrder(order)
    setTrackingModalVisible(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#4CAF50'
      case 'shipped': return '#2196F3'
      case 'processing': return '#FF9800'
      case 'cancelled': return '#F44336'
      default: return '#757575'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered'
      case 'shipped': return 'Shipped'
      case 'processing': return 'Processing'
      case 'cancelled': return 'Cancelled'
      default: return 'Pending'
    }
  }

  const OrderCard = ({ order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>Ordered on {new Date(order.orderDate).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      {order.items.map((item, index) => (
        <View key={item.id} style={styles.orderItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
            <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.deliveryText}>
            Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => handleTrackOrder(order)}
        >
          <Ionicons name="location-outline" size={16} color="#007bff" />
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>Orders to be received</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No orders yet</Text>
            <Text style={styles.emptyStateText}>Your orders will appear here once you make a purchase</Text>
          </View>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </ScrollView>

      {/* Order Tracking Modal */}
      <OrderTracking
        visible={trackingModalVisible}
        order={selectedOrder}
        onClose={() => setTrackingModalVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 13,
    color: '#6c757d',
    marginLeft: 6,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  trackButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailsButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailsButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default Toreceive