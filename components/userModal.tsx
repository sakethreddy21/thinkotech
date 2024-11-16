
import { View, Text, StyleSheet } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import React from 'react';
const DetailsModal = ({ visible, onClose, order, user, formatDate, role }: any) => {
    const isAdmin = role?.admin; // Check if the user is an admin

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
                <Dialog.Title>{isAdmin ? 'User Details' : 'Order Details'}</Dialog.Title>
                <Dialog.Content>
                    {isAdmin ? (
                        user && (
                            <>
                                <Text style={styles.modalText}>User ID: {user.userId}</Text>
                                <Text style={styles.modalText}>Username: {user.username}</Text>
                                {order && (
                                    <>
                                        <Text style={styles.modalText}>Order ID: {order.orderID}</Text>
                                        <Text style={styles.modalText}>Order Date: {formatDate(order.orderDate)}</Text>
                                        <Text style={styles.modalText}>Status: {order.status}</Text>
                                        <Text style={styles.modalText}>Items:</Text>
                                        {order.items.map((item: any, index: number) => (
                                            <View key={index} style={styles.itemRow}>
                                                <Text>{item.itemName}</Text>
                                                <Text>
                                                    {item.quantity} x ₹{item.price}
                                                </Text>
                                                <Text>₹{item.quantity * item.price}</Text>
                                            </View>
                                        ))}
                                        <Text style={styles.modalText}>Total Amount: ₹{order.totalAmount}</Text>
                                    </>
                                )}
                            </>
                        )
                    ) : (
                        order && (
                            <>
                                <Text style={styles.modalText}>Order ID: {order.orderID}</Text>
                                <Text style={styles.modalText}>Order Date: {formatDate(order.orderDate)}</Text>
                                <Text style={styles.modalText}>Status: {order.status}</Text>
                                <Text style={styles.modalText}>Items:</Text>
                                {order.items.map((item: any, index: number) => (
                                    <View key={index} style={styles.itemRow}>
                                        <Text>{item.itemName}</Text>
                                        <Text>
                                            {item.quantity} x ₹{item.price}
                                        </Text>
                                        <Text>₹{item.quantity * item.price}</Text>
                                    </View>
                                ))}
                                <Text style={styles.modalText}>Total Amount: ₹{order.totalAmount}</Text>
                            </>
                        )
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>Close</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'grey',
    },
    modalText: {
        marginBottom: 10,
        color: 'black',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
});

export default DetailsModal;
