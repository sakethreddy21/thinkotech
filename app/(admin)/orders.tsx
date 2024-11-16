import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { fetchOrdersByUserId, fetchAllOrders, cancelOrder, updateOrderStatus } from '@/lib/appwrite'; // Import the new function
import DetailsModal from '@/components/userModal'; // Import the combined modal component
import { Order } from '@/lib/types';

export default function Orders() {
  const { user } = useGlobalContext();
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // For storing user details

  const { admin, userId } = user || {}; // Destructure to simplify the code

  const goBack = () => {
    router.replace('/(admin)/home');
  };

  const fetchOrders = useCallback(() => {
    if (!user) return;
    setLoading(true);
    const fetchOrdersFn = admin ? fetchAllOrders : userId ? () => fetchOrdersByUserId(userId) : null;
    
    if (fetchOrdersFn) {
      fetchOrdersFn()
        .then(setOrders)
        .catch((error) => console.error(`Error fetching orders: ${error.message}`))
        .finally(() => setLoading(false));
    }
  }, [user, admin, userId]);

  const cancelOrderById = useCallback((orderId: string, status: string) => {
    if (status.toLowerCase() !== 'received') return;

    cancelOrder(orderId)
      .then(() => fetchOrders())
      .catch((error) => console.error('Error canceling order:', error.message));
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    return `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj
      .getHours()
      .toString()
      .padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
  };
  
  
  
  const viewDetails = (order: Order) => {
    console.log(order);
    setSelectedOrder(order);
    setSelectedUser(order.userDetails);
    setIsModalVisible(true);
  };
  

  const hideModal = () => {
    setSelectedOrder(null);
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  const renderOrderItem = useCallback(({ item }: any) => {
    const isCancelable = item.status.toLowerCase() === 'received';
    const isAdmin = admin === true;
  
    type OrderStatus = "Received" | "Prepared" | "Picked";

    const statusTransitions: Record<OrderStatus, OrderStatus> = {
      Received: "Prepared", // From 'Received' to 'Prepared'
      Prepared: "Picked",
      Picked: 'Received'
    };
    
    const isValidStatus = (status: string): status is OrderStatus => {
      return ["Received", "Prepared", "Picked"].includes(status);
    };
    
    const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
      try {
        if (currentStatus === "Picked") {
          console.log("Order status is 'Picked' and cannot be changed further.");
          return; // Prevent further status changes
        }
    
        if (!isValidStatus(currentStatus)) {
          throw new Error(`Invalid order status: '${currentStatus}'`);
        }
    
        const newStatus = statusTransitions[currentStatus];
        if (!newStatus) {
          throw new Error(`Order status cannot be updated from '${currentStatus}'`);
        }
    
        // Update the order status
        setLoading(true); // Start loading
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        fetchOrders(); // Refresh the order list
        console.log(`Order status updated to '${newStatus}' successfully:`, updatedOrder);
      } catch (error: any) {
        console.error("Failed to update order status:", error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    
  
    return (
      <View style={styles.orderItemContainer}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderText}>Order Date: {formatDate(item.orderDate)}</Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        <Text style={styles.orderText}>Total Amount: ₹{item.totalAmount}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {!isAdmin ? (
          <>
            <Button
              icon={isCancelable ? 'cancel' : 'alert-circle'}
              mode="contained"
              onPress={isCancelable ? () => cancelOrderById(item.orderID, item.status) : undefined}
              style={[
                styles.cancelButton,
                { backgroundColor: isCancelable ? 'red' : 'gray' },
              ]}
              disabled={!isCancelable}
            >
              {isCancelable ? 'Cancel Order' : 'Cannot Cancel'}
            </Button>
            <Button icon="eye" mode="outlined" onPress={() => viewDetails(item)} style={styles.viewButton}>
              View Order
            </Button>
          </>
        ) : (
          <>
           <Button
  icon="update"
  mode="contained"
  onPress={() => handleUpdateStatus(item.orderID, item.status)} // Update status
  style={[
    styles.cancelButton,
    item.status === "Picked" && { backgroundColor: 'gray' }, // Gray out button if 'Picked'
  ]}
  disabled={item.status === "Picked"} // Disable button if status is 'Picked'
>
  Update Status
</Button>

            <Button
              icon="account-circle"
              mode="outlined"
              onPress={() => viewDetails(item)} // Show user details modal
              style={styles.viewButton}
            >
              View User
            </Button>
          </>
        )}
      </View>
    </View>
  );
  }, [cancelOrderById, admin, fetchOrders]);
  

 

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Orders</Text>

      {loading ? (
  <Text style={styles.loadingText}>Loading orders...</Text>
) : (
  <FlatList
    data={orders}
    renderItem={renderOrderItem}
    keyExtractor={(item: any) => item.orderID}
    contentContainerStyle={styles.orderList}
  />
)}

      <DetailsModal
        visible={isModalVisible}
        onClose={hideModal}
        order={selectedOrder}
        user={selectedUser}
        formatDate={formatDate}
        role={user} // Pass user object to determine the admin status
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    gap: 10,
  },
  orderDetails: {
    width: '45%',
  },
  orderText: {
    color: 'white',
    marginBottom: 5,
  },
  noOrdersText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  cancelButton: {
    borderRadius: 8,
    backgroundColor: 'red', // Default color
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10, // Adjust spacing between buttons
  },
  viewButton: {
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    backgroundColor:'white'
  },
});
