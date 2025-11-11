import React from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const OrderTracking = ({ visible, order, onClose }) => {
  if (!order) return null

  const getStepStatus = (stepIndex, currentStep) => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'pending'
  }

  const TrackingStep = ({ step, index, status }) => (
    <View style={styles.stepContainer}>
      <View style={styles.stepLine}>
        {index > 0 && (
          <View 
            style={[
              styles.verticalLine,
              status !== 'pending' ? styles.completedLine : styles.pendingLine
            ]} 
          />
        )}
      </View>
      
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepIcon, styles[`${status}Icon`]]}>
            {status === 'completed' ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : status === 'current' ? (
              <View style={styles.currentStepDot} />
            ) : (
              <Ionicons name="ellipse-outline" size={16} color="#ccc" />
            )}
          </View>
          
          <View style={styles.stepInfo}>
            <Text style={[styles.stepTitle, styles[`${status}Text`]]}>
              {step.title}
            </Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
            <Text style={styles.stepTime}>{step.time}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="location-outline" size={24} color="#007bff" />
              <Text style={styles.modalTitle}>Track Order</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Order Info */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <View style={styles.deliveryInfo}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.deliveryDate}>
                Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Tracking Steps */}
          <ScrollView style={styles.trackingContainer} showsVerticalScrollIndicator={false}>
            {order.items[0]?.tracking?.steps.map((step, index) => (
              <TrackingStep
                key={index}
                step={step}
                index={index}
                status={getStepStatus(index, order.items[0].tracking.currentStep)}
              />
            ))}
          </ScrollView>

          {/* Current Status */}
          <View style={styles.currentStatus}>
            <View style={styles.statusBadge}>
              <Ionicons name="time-outline" size={16} color="#007bff" />
              <Text style={styles.statusText}>
                Current Status: {order.items[0]?.tracking?.steps[order.items[0]?.tracking?.currentStep]?.title}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.supportButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#007bff" />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  orderInfo: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryDate: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 6,
  },
  trackingContainer: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepLine: {
    width: 40,
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: '#007bff',
  },
  pendingLine: {
    backgroundColor: '#e9ecef',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: '#4CAF50',
  },
  currentIcon: {
    backgroundColor: '#007bff',
    borderWidth: 3,
    borderColor: '#e3f2fd',
  },
  pendingIcon: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  currentStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    color: '#4CAF50',
  },
  currentText: {
    color: '#007bff',
  },
  pendingText: {
    color: '#6c757d',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 12,
    color: '#999',
  },
  currentStatus: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  statusText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  supportButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  doneButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
})

export default OrderTracking