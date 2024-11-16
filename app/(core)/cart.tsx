// screens/HomeScreen.js
import { useGlobalContext } from '@/context/GlobalProvider';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { router } from "expo-router";
import { placeOrder } from '@/lib/appwrite'; // Import placeOrder function
import React from 'react';
import { IconButton, MD3Colors } from 'react-native-paper';

export default function Cart() {
    const { user, cart,setCart, calculateTotalCost } = useGlobalContext();

  
    // Function to handle placing the order
    const handlePlaceOrder = async () => {
        try {
            if (!user || !user.userId) {
                Alert.alert("Error", "User not found. Please log in.");
                return;
            }

            // Call placeOrder function with user ID and cart items
            const newOrder = await placeOrder(user.userId, cart, calculateTotalCost());
            Alert.alert("Success", "Order placed successfully!");
            router.replace("/(core)/home");
            setCart([])

            // You may also want to clear the cart here after placing the order
        } catch (error:any) {
            Alert.alert("Error", error.message);
        }
    };

    const renderItem = ({ item }:any) => {
        const itemTotal = item.quantity * item.price; // Calculate item total
      
        return (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.itemQuantity}>
              {item.quantity} X {item.price}
            </Text>
            <Text style={styles.itemPrice}>{itemTotal} INR</Text> {/* Show item total */}
          </View>
        );
      };
      
  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
        <IconButton
    icon="chevron-left-box-outline"
    iconColor={MD3Colors.secondary50}
    size={40}
    onPress={() => {
      router.replace("/(core)/items");
    }}
  />
        <Text style={styles.title}>Your cart</Text>
      </View>
    
      <FlatList
  data={cart}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  style={styles.cartList}
/>
{cart.length === 0 && (
  <View style={styles.emptyCartContainer}>
    <Text style={styles.emptyCartText}>Please add something</Text>
  </View>
)}
{calculateTotalCost() > 0 && (
  <View style={styles.totalCostBox}>
    <TouchableOpacity onPress={handlePlaceOrder} style={styles.orderButton}>
      <Text style={styles.orderText}>Place the order</Text>
    </TouchableOpacity>
    <Text style={styles.totalCostText}>
      Total Cost: ₹{calculateTotalCost()}
    </Text>
  </View>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  goBackButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "grey",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 60,
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    gap: 70,
  },
  cartList: {
    marginTop: 80,
    width: '100%',
    gap: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20,
    margin: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
  },
  itemQuantity: {
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  itemPrice: {
    color: 'white',
    textAlign: 'right',
    flex: 1,
  },
  totalCostBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#d3d3d3',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  orderButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  totalCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
  orderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
});
