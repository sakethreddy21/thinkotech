// ItemCard.tsx
import { useGlobalContext } from "@/context/GlobalProvider";
import { count } from "console";
import { router } from "expo-router";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";

type Item = {
  itemName: string;
  stock: number;
  price: number;
  itemId: string;
};

type ItemCardProps = {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
};
const ItemCard = ({ item, onEdit, onDelete, isAdmin }: ItemCardProps) => {
  const { cart, setCart, calculateTotalCost } = useGlobalContext();

  // Function to get the quantity of the current item in the cart
  const getItemCount = () => {
    const cartItem = cart.find(
      (cartItem: any) => cartItem.itemName === item.itemName
    );
    return cartItem ? cartItem.quantity : 0; // Return 0 if the item is not in the cart
  };

  const handleAddToCart = () => {
    const existingItemIndex = cart.findIndex(
      (cartItem: any) => cartItem.itemName === item.itemName
    );

    if (existingItemIndex > -1) {
      // If item is already in cart, update its quantity
      const updatedCart = [...cart];
      if (updatedCart[existingItemIndex].quantity < item.stock) {
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart); // Update the cart state
      } else {
        alert(`Cannot add more of ${item.itemName}. Stock limit reached.`);
      }
    } else {
      // If item is not in cart, check stock before adding a new item
      if (item.stock > 0) {
        setCart([
          ...cart,
          {
            itemName: item.itemName,
            quantity: 1,
            price: item.price,
            itemId: item.itemId,
          },
        ]);
      } else {
        alert(`Cannot add ${item.itemName}. Stock is unavailable.`);
      }
    }
  };

  const handleRemoveFromCart = () => {
    const existingItemIndex = cart.findIndex(
      (cartItem: any) => cartItem.itemName === item.itemName
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];

      // Decrement the quantity, but ensure it doesn't drop below 0
      if (updatedCart[existingItemIndex].quantity > 1) {
        updatedCart[existingItemIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove the item from the cart
        updatedCart.splice(existingItemIndex, 1);
      }
      setCart(updatedCart); // Update the cart state
    }
  };

  return (
    <View style={styles.card}>
      <View style={{ width: "60%" }}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemQuantity}>Qua: {item.stock}</Text>
          <Text style={styles.itemQuantity}>Price: {item.price}</Text>
        </View>
      </View>
      {isAdmin ? (
        <View style={styles.actions}>
          <IconButton
    icon="pencil"
    iconColor={MD3Colors.secondary50}
    size={30}
    onPress={onEdit}
  />  <IconButton
  icon="delete"
  iconColor={MD3Colors.error50}
  size={30}
  onPress={onDelete}
/>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            width: "100%",
          }}
        >
          <IconButton
            icon="minus"
            iconColor={MD3Colors.error50}
            size={20}
            onPress={handleRemoveFromCart}
          />
          <Text style={styles.itemQuantity}>{getItemCount() || 0}</Text>{" "}
          {/* Show the count dynamically */}
          <IconButton
            icon="plus"
            iconColor={MD3Colors.error50}
            size={20}
            onPress={handleAddToCart}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d3d3d3",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    gap: 20,
  },
  itemQuantity: {
    fontSize: 18,
    color: "black",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "red",
  },
  actions: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
  },
});

export default ItemCard;
