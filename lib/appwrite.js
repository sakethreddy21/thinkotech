import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.saketh.thinkotech",
  projectId: "67348e44003090b47101",
  storageId: "6734f5f30002c382a90a",
  databaseId: "6734eb890031e21e47d3",
  userCollectionId: "6734eba200148b52df60",
  itemCollectionId: "6734ec110004371ff64f",
  orderCollectionId:"6734ec44001fe7019e66",
  orderItemsCollectionId:"6734f0c8000148c0e4f1"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username, role) {
  
  try {
    // Step 1: Check if the user already exists
    const existingUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", email)]
    );

    if (existingUser.documents.length) {
      throw new Error("User already exists.");
    }

    // Step 2: Create the user in the database
    const userData = {
      email,
      username,
      password,  // Store hashed password in production, not plaintext
      admin: role === 'admin', // Only set admin role if role is passed
      userId: ID.unique(), // Ensure userId is provided
    };

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userData.userId,  // Use the userId as the document ID
      userData
    );

    

    // Return the user details to the frontend (no session creation)
    return newUser;

  } catch (error) {
    throw new Error("Account creation failed: " + error.message);
  }
}

// Sign In with role check
export async function signInOperation(email, password, expectedRole) {
  try {
    // Step 1: Retrieve user data from the database
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", email)]
    );

    

    if (!currentUser.documents.length) {
      throw new Error("User not found.");
    }

    const user = currentUser.documents[0];

    // Step 2: Check the user's password (assuming you store a hashed password and compare here)
    // For simplicity, we'll assume passwords are stored in plaintext (not recommended for production)
    if (user.password !== password) {  // This is just an example, use proper hashing methods for production
      throw new Error("Incorrect password.");
    }

    // Step 3: Check role validity
    const isAdmin = user.admin;
    if ((isAdmin && expectedRole !== true) || (!isAdmin && expectedRole !== false)) {
      const roleMessage = isAdmin 
        ? "You cannot log in as a student with admin credentials." 
        : "You cannot log in as an admin with student credentials.";
      throw new Error(roleMessage);
    }

    // Step 4: Send user details to the frontend (no session creation)
    return user;

  } catch (error) {
    throw new Error(`Sign-in failed: ${error.message}`);
  }
}


// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("Account not found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    

    if (!currentUser.documents.length) throw new Error("User not found");

    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}


// Fetch all items for the current user (or admin can see all)
export async function fetchAllItems() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.itemCollectionId
    );
    return response.documents; // Return the list of items
  } catch (error) {
    throw new Error('Error fetching items: ' + error.message);
  }
}


// Add Item
// Add Item
// Add Item
// Add Item
export async function addItem(itemName,  price, stock) {
  try {
    

    // Convert quantity to an integer
    const itemStock = parseInt(stock, 10);


    // Check if stock is a valid integer
    if (isNaN(stock)) {
      throw new Error('Quantity must be a valid number');
    }

    // Convert price to a float
    const itemPrice = parseFloat(price);
  
    // Check if itemPrice is a valid number
    if (isNaN(itemPrice)) {
      throw new Error('Price must be a valid number');
    }

    // Generate a unique itemId
    const itemId = ID.unique();

    // Prepare the item data
    const itemData = {
      itemId,
      itemName,
      stock:itemStock,
      price: itemPrice,
    };

  
    // Create a new document in the item collection
    const newItem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.itemCollectionId,
      itemId,
      itemData
    );

    return newItem;
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error('Error adding item: ' + error.message);
  }
}



export async function updateItem(itemId, name, quantity, price) {
  try {
    const itemData = {
      itemName: name,
      stock: parseInt(quantity, 10),
      price: parseFloat(price),
    };

    const updatedItem = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.itemCollectionId,
      itemId, // Use item ID to update the document
      itemData
    );

    return updatedItem;
  } catch (error) {
    throw new Error('Error updating item: ' + error.message);
  }
}

export async function deleteItem(itemId) {
  try {
    // Delete the document from the collection
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.itemCollectionId,
      itemId // Pass the item's unique ID
    );

    return `Item with ID ${itemId} has been successfully deleted.`;
  } catch (error) {
    console.error('Error deleting item:', error.message);
    throw new Error('Error deleting item: ' + error.message);
  }
}


// Function to place an order
export async function placeOrder(userId, cartItems, totalAmount) {
  try {
    // Define the order status and date
    const orderDate = new Date().toISOString();
    const orderId = ID.unique(); // Unique order ID

    // Step 1: Prepare and create the order document in the orders collection
    const orderData = {
      orderID: orderId,
      userId: userId,
      totalAmount: totalAmount,
      orderDate: orderDate,
    };

    const newOrder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.orderCollectionId,
      orderId, // Use the generated orderId
      orderData
    );

   

    // Step 2: Save each item in the cart to the order_items collection
    for (const item of cartItems) {
      const orderItemData = {
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.quantity * item.price,
        orderId: orderId, // Link to the order ID
        itemId: item.itemId,
      };

      // Create a document for each item in the `order_items` collection
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.orderItemsCollectionId, // Adjust with your actual order_items collection ID
        ID.unique(), // Unique document ID for each item
        orderItemData
      );
    }

    return newOrder;
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw new Error("Error placing order: " + error.message);
  }
}


// Function to fetch orders by userId
// Function to fetch orders by userId, including associated items
export async function fetchOrdersByUserId(userId) {
  try {
    // Step 1: Query the orders collection by userId
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.orderCollectionId,
      [Query.equal("userId", userId)]  // Filter by userId
    );

    // Step 2: Fetch the associated order items for each order
    const ordersWithItems = await Promise.all(
      orders.documents.map(async (order) => {
        const orderItems = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.orderItemsCollectionId,
          [Query.equal("orderId", order.orderID)]  // Filter by orderId
        );

        // Add the fetched items to the order
        return {
          ...order,
          items: orderItems.documents, // Include the items in the order object
        };
      })
    );

    // Return the list of orders with associated items
    return ordersWithItems;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw new Error("Error fetching orders: " + error.message);
  }
}


export async function cancelOrder(orderId) {
  try {
    // Step 1: Delete all items associated with the order in the `orderItemsCollectionId`
    const orderItems = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.orderItemsCollectionId,
      [Query.equal("orderId", orderId)] // Filter by the orderId
    );

    // Loop through each order item and delete it
    for (const item of orderItems.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.orderItemsCollectionId,
        item.$id // Use the unique ID of the order item document
      );
    }

 

    // Step 2: Delete the order itself from the `orderCollectionId`
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.orderCollectionId,
      orderId // Use the orderId to delete the order document
    );

    

    return `Order with ID ${orderId} and its items have been successfully cancelled.`;
  } catch (error) {
    console.error("Error canceling order:", error.message);
    throw new Error("Error canceling order: " + error.message);
  }
}


// Function to fetch all orders for admin
// Fetch all orders along with user details for admin
 export async function fetchAllOrders() {
    try {
      // Step 1: Retrieve all orders
      const orders = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.orderCollectionId
      );
  
      // Step 2: Fetch associated user details for each order
      const ordersWithUserDetails = await Promise.all(
        orders.documents.map(async (order) => {
          // Ensure the order has a userId object and extract the correct userId string
          if (order.userId && order.userId.userId) {
            const userId = order.userId.userId;  // Extracting the correct userId string
           

            console.log(order.orderID)
  
            // Fetch user details by userId
            const user = await databases.listDocuments(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              [Query.equal("userId", userId)]  // Filter by userId
            );
  
            // If user not found, return a default user object
            const userDetails = user.documents.length ? user.documents[0] : {};
           
  
            // Ensure the field name is correct (adjust 'order_id' if needed)
            const orderItems = await databases.listDocuments(
              appwriteConfig.databaseId,
              appwriteConfig.orderItemsCollectionId,
              [Query.equal("orderId", order.orderID)]  // Adjust field name if necessary
            );
           
  
            // Return the order along with its user details and items
            return {
              ...order,
              userDetails,  // Include user details
              items: orderItems.documents, // Include items in the order
            };
          } else {
            console.error("Invalid or missing userId in order:", order);
            return { ...order, userDetails: {}, items: [] };  // Return the order without user details if no userId
          }
        })
      );
  
      // Return the list of orders with associated user details and items
      return ordersWithUserDetails;
    } catch (error) {
      console.error("Error fetching orders with user details:", error.message);
      throw new Error("Error fetching orders: " + error.message);
    }
  }
  


// Function to update the order status
export async function updateOrderStatus(orderId, status) {
  try {
    // Validate the provided status
    const validStatuses = ["Received", "Picked", "Prepared"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status. Valid statuses are: received, picked, prepared.");
    }

    // Update the order document with the new status
    const updatedOrder = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.orderCollectionId,
      orderId, // Use the orderId to identify the document
      { status } // Update the status field
    );

 
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw new Error("Error updating order status: " + error.message);
  }
}
