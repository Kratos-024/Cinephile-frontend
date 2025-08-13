/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, googleProvider, db } from "./firebase";
import { signInWithPopup, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
async function createOrUpdateUserProfile(user: any) {
  try {
    const userRef = doc(db, "user_profiles", user.uid);
    const userDoc = await getDoc(userRef);

    const profileData = {
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      emailVerified: user.emailVerified || false,
      updatedAt: serverTimestamp(),
    };

    if (userDoc.exists()) {
      await updateDoc(userRef, profileData);
    } else {
      await setDoc(userRef, {
        ...profileData,
        joinedDate: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Error creating/updating user profile:", err);
  }
}

export async function googleLogin() {
  try {
    console.log("Starting Firebase Google login...");

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    await createOrUpdateUserProfile(user);

    console.log("Firebase auth successful:", user);

    localStorage.setItem("authToken", idToken);

    return {
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        idToken: idToken,
      },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Google login error:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const errorCode = error.code as string;
      const errorMessage =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "Firebase authentication failed";

      switch (errorCode) {
        case "auth/popup-closed-by-user":
          return {
            success: false,
            message: "Login was cancelled",
            code: errorCode,
          };
        case "auth/popup-blocked":
          return {
            success: false,
            message:
              "Popup was blocked by your browser. Please allow popups and try again.",
            code: errorCode,
          };
        case "auth/cancelled-popup-request":
          return {
            success: false,
            message: "Login was cancelled",
            code: errorCode,
          };
        default:
          return {
            success: false,
            message: errorMessage,
            code: errorCode,
          };
      }
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createAccountWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  try {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    const idToken = await user.getIdToken();
    await createOrUpdateUserProfile(user);

    localStorage.setItem("authToken", idToken);

    return {
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        idToken,
      },
    };
  } catch (error: any) {
    console.error("Account creation error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
