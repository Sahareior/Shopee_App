import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Activity = () => {
  const data = {
    labels: ['Clothing', 'Lingerie', 'Shoes', 'Bags'],
    data: [0.5, 0.25, 0.13, 0.12],
    colors: ['#4A6CF7', '#8BC34A', '#FF9800', '#E91E63']
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' }}
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>Activity Overview</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month */}
      <View style={styles.monthContainer}>
        <TouchableOpacity style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.month}>April 2024</Text>
        <TouchableOpacity style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Spending Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spending</Text>
        
        {/* Circular Chart */}
        <View style={styles.chartWrapper}>
          <ProgressChart
            data={data}
            width={screenWidth - 80}
            height={220}
            strokeWidth={16}
            radius={70}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              decimalPlaces: 2,
              color: (opacity = 1, index) => {
                const colors = ['#4A6CF7', '#8BC34A', '#FF9800', '#E91E63'];
                return `${colors[index]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
              },
              labelColor: () => `rgba(0,0,0,0)`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 0
              }
            }}
            hideLegend={true}
          />
          <View style={styles.totalWrapper}>
            <Text style={styles.totalLabel}>Total Spent</Text>
            <Text style={styles.totalValue}>$365.00</Text>
            <Text style={styles.totalChange}>+12% from last month</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {data.labels.map((label, index) => (
            <View key={label} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: data.colors[index] }]} />
                <Text style={styles.categoryName}>{label}</Text>
              </View>
              <Text style={styles.categoryAmount}>
                ${[183, 92, 47, 43][index].toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(74, 108, 247, 0.1)' }]}>
              <Ionicons name="cart-outline" size={20} color="#4A6CF7" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Ordered</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 195, 74, 0.1)' }]}>
              <Ionicons name="checkmark-done-outline" size={20} color="#8BC34A" />
            </View>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
              <Ionicons name="time-outline" size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>To Receive</Text>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Ionicons name="receipt-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>View Order History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFD',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1A1A1A',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  month: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  totalWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
  },
  totalChange: {
    fontSize: 12,
    color: '#8BC34A',
    fontWeight: '500',
    marginTop: 2,
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4A6CF7',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A6CF7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});