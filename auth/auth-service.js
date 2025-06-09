import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

export const registerUser = async (email, username, password, nationality) => {
  let userCredential = null;
  
  try {
    console.log("Starting registration process...");
    
    // First check if username already exists
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
      console.log("Username already exists");
      return { success: false, error: "Username already exists" };
    }

    console.log("Username is available, creating auth user...");

    // Create the user with email and password in Authentication
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth user created successfully:", user.uid);

    // Get the ID token
    const idToken = await user.getIdToken();
    console.log("Got ID token");

    // Prepare user data for Firestore
    const userData = {
      username: username,
      email: email,
      uid: user.uid,
      nationality: nationality,
      dateCreated: new Date(),
      stats: {
        totalTowerDamage: 0,
        totalResourcesGathered: 0,
        totalEnemiesKilled: 0,
        totalMoneySpent: 0,
        highestWaveReached: 0,
        totalBossStagesReached: 0
      }
    };

    console.log("Attempting to create Firestore document...");

    // Wait for auth state to be fully updated
    await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });

    // Try to create the user document with retries
    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        // Force token refresh before attempting to write
        await user.getIdToken(true);
        
        // Add user to Firestore using their auth UID as the document ID
        await setDoc(doc(db, "users", user.uid), userData);
        console.log("User document created successfully in Firestore");
        return { success: true, user: user };
      } catch (error) {
        console.error(`Attempt ${4 - retries} failed:`, error);
        lastError = error;
        retries--;
        if (retries > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If we get here, all retries failed
    throw lastError;

  } catch (error) {
    console.error("Registration error:", error);
    
    // Clean up auth user if it was created but Firestore failed
    if (userCredential && userCredential.user) {
      try {
        await deleteUser(userCredential.user);
        console.log("Cleaned up auth user after failed registration");
      } catch (cleanupError) {
        console.error("Error cleaning up auth user:", cleanupError);
      }
    }

    // Provide specific error messages
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: "This email is already registered" };
    } else if (error.code === 'auth/invalid-email') {
      return { success: false, error: "Invalid email format" };
    } else if (error.code === 'auth/operation-not-allowed') {
      return { success: false, error: "Email/password registration is not enabled. Please contact support." };
    } else if (error.code === 'auth/weak-password') {
      return { success: false, error: "Password is too weak. Please use a stronger password." };
    } else if (error.message.includes('permission-denied')) {
      return { success: false, error: "Firebase security rules are preventing registration. Please check your database rules." };
    }
    return { success: false, error: error.message };
  }
};

export const loginUser = async (emailOrUsername, password) => {
  try {
    let email = emailOrUsername;
    
   
    if (!emailOrUsername.includes('@')) {
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", emailOrUsername));
      const querySnapshot = await getDocs(usernameQuery);
      
      if (querySnapshot.empty) {
        return { success: false, error: "Username not found" };
      }
      
      email = querySnapshot.docs[0].data().email;
    }

    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();

    return { 
      success: true, 
      user: userCredential.user,
      userData: userData 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error) {
    console.error("Get user data error:", error);
    return { success: false, error: error.message };
  }
};

export const updateUserStats = async (uid, stats) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return { success: false, error: "User not found" };
    }

    const currentStats = userDoc.data().stats || {
      totalTowerDamage: 0,
      totalResourcesGathered: 0,
      totalEnemiesKilled: 0,
      totalMoneySpent: 0,
      highestWaveReached: 0,
      totalBossStagesReached: 0
    };

    
    const newStats = {
      totalTowerDamage: Math.max(currentStats.totalTowerDamage, stats.totalTowerDamage || 0),
      totalResourcesGathered: Math.max(currentStats.totalResourcesGathered, stats.totalResourcesGathered || 0),
      totalEnemiesKilled: Math.max(currentStats.totalEnemiesKilled, stats.totalEnemiesKilled || 0),
      totalMoneySpent: Math.max(currentStats.totalMoneySpent, stats.totalMoneySpent || 0),
      highestWaveReached: Math.max(currentStats.highestWaveReached, stats.highestWaveReached || 0),
      totalBossStagesReached: Math.max(currentStats.totalBossStagesReached, stats.totalBossStagesReached || 0)
    };

    await updateDoc(doc(db, "users", uid), { stats: newStats });
    return { success: true, data: newStats };
  } catch (error) {
    console.error("Update user stats error:", error);
    return { success: false, error: error.message };
  }
}; 