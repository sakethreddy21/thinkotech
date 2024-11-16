import { useGlobalContext } from "@/context/GlobalProvider";
import React, { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import CustomModal from "../../components/Modal";
import { addItem, deleteItem, fetchAllItems, updateItem } from "@/lib/appwrite";
import ItemCard from "@/components/Card";
import { Item } from "@/lib/types";
import Returnbutton from "@/components/Button";

export default function Items() {
  const { user, cart, calculateTotalCost } = useGlobalContext();
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Initialize to null
  const [loading, setLoading] = useState(false); // Add loading state

  const goBack = () => {
    router.replace("/(core)/home");
  };

  const fetchItems = useCallback(async () => {
    setLoading(true); // Set loading to true when starting to fetch items
    try {
      const allItems: any = await fetchAllItems();
      setItems(allItems);
    } catch (error) {
      console.log("Error fetching items:", error);
    } finally {
      setLoading(false); // Set loading to false once items are fetched
    }
  }, []);

  const handleAddItem = async (inputValues: any) => {
    try {
      const { itemName, price, stock } = inputValues;
      const newItem: any = await addItem(itemName, price, stock);
      setItems((prev) => [...prev, newItem]);
      setModalVisible(false);
    } catch (error) {
      console.log("Error adding item:", error);
    }
  };

  const handleEditItem = async (inputValues: any) => {
    try {
      const { itemName, stock, price } = inputValues;
      const updatedItem = await updateItem(
        editingItem.itemId,
        itemName,
        stock,
        price
      );
      setItems((prev: any) =>
        prev.map((item: any) =>
          item.itemId === editingItem.itemId ? updatedItem : item
        )
      );
      setModalVisible(false);
      setEditingItem(null); // Clear the editingItem state
    } catch (error) {
      console.log("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      setItems((prevItems) =>
        prevItems.filter((item: any) => item.itemId !== itemId)
      );
      console.log(`Item with ID ${itemId} deleted.`);
    } catch (error: any) {
      console.error("Error deleting item:", error.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null); // Reset the editingItem state when closing the modal
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Returnbutton goBack={goBack} />
        {user?.admin ? null : (
          <Returnbutton
          icon='cart'
            goBack={() => router.replace("/(core)/cart")}
            style={styles.goBackButton}
            text={`Cart ${cart.length}`}
          />
        )}
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.heading}>Here are your food items</Text>

        <View style={styles.listWrapper}>
          {loading ? (
            <View style={{marginTop:20}}>
              <ActivityIndicator size="large" color="white" /> 
            </View>
            // Show loading indicator while fetching
          ) : (
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  onEdit={() => handleOpenEditModal(item)}
                  onDelete={() => handleDeleteItem(item.itemId)}
                  isAdmin={user?.admin}
                />
              )}
              keyExtractor={(item: any) => item.itemId}
              contentContainerStyle={styles.listContainer}
              style={styles.flatList}
            />
          )}

          {user?.admin && (
            <TouchableOpacity
              style={styles.addItemCard}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={handleCloseModal} // Use the updated handleCloseModal function
        title={editingItem ? "Edit Item" : "Add New Item"}
        inputs={[
          { label: "Item Name", name: "itemName", keyboardType: "default" },
          { label: "Stock", name: "stock", keyboardType: "numeric" },
          { label: "Price", name: "price", keyboardType: "numeric" },
        ]}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        submitButtonTitle={editingItem ? "Update" : "Add"}
        initialValues={editingItem || { itemName: "", stock: 0, price: 0 }}
      />

      {!user?.admin && calculateTotalCost() > 0 && (
        <View style={styles.totalCostBox}>
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
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  header: {
    display: "flex",
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  goBackButton: {
    borderRadius: 20,
        padding: 10,
        elevation: 2,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
  },
  itemsContainer: {
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  listWrapper: {
    height: '78%', // Set the fixed height for the scrollable area
  },
  listContainer: {
    marginTop: 20,
    width: "100%",
    justifyContent: "flex-start",
    paddingVertical:10
  },
  addItemCard: {
    backgroundColor: "#808080",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  flatList: {
    flexGrow: 0, // Prevents list from stretching
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
  totalCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
