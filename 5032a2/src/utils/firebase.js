// src/utils/firebase.js
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

// 🔥 修正的Firebase配置 - 确保与你的项目匹配
const firebaseConfig = {
  apiKey: "AIzaSyAyF5NRUHqB_wdyJZbh8eq4-OkOeCV5H6M",
  authDomain: "cliu0174-57e84.firebaseapp.com",
  projectId: "cliu0174-57e84",
  storageBucket: "cliu0174-57e84.firebasestorage.app",
  messagingSenderId: "748087094817",
  appId: "1:748087094817:web:a1195cf2a121a61728bd60"
};

// 初始化Firebase
let app
let auth
let db
let analytics

const initializeFirebase = () => {
  try {
    console.log('🔥 Starting Firebase initialization...')
    console.log('🔥 Config:', {
      apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    })

    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)

    // 设置认证语言
    if (auth) {
      auth.languageCode = 'en'
    }


    // 只在支持的环境中初始化Analytics
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
        console.log('🔥 Firebase Analytics initialized')
      } else {
        console.log('🔥 Analytics not supported in this environment')
      }
    }).catch(err => {
      console.warn('🔥 Analytics initialization failed:', err)
    })

    console.log('🔥 Firebase core services initialized successfully')
    return true
  } catch (error) {
    console.error('🔥 Firebase initialization failed:', error)
    console.error('🔥 Error code:', error.code)
    console.error('🔥 Error message:', error.message)
    return false
  }
}

// 立即初始化
const initialized = initializeFirebase()

// Google认证提供者
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// === 认证功能 ===

// 用户注册 (邮箱/密码)
export const registerWithEmail = async (email, password, userData) => {
  if (!initialized || !auth) {
    return { success: false, error: 'Firebase not initialized. Please refresh and try again.' }
  }

  try {
    console.log('🔥 Registering user:', email)

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('🔥 User registered successfully:', user.uid)

    // 更新用户显示名称
    if (userData.username) {
      await updateProfile(user, {
        displayName: userData.username
      })
      console.log('🔥 User profile updated')
    }

    // 在Firestore中创建用户文档
    if (db) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        username: userData.username || email.split('@')[0],
        role: userData.role || 'guest',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        authProvider: 'email'
      })
      console.log('🔥 User document created')
    }

    return { success: true, user }
  } catch (error) {
    console.error('🔥 Registration error:', error)
    return { success: false, error: getErrorMessage(error.code) }
  }
}

// 用户登录 (邮箱/密码)
export const loginWithEmail = async (email, password) => {
  if (!initialized || !auth) {
    return { success: false, error: 'Firebase not initialized. Please refresh and try again.' }
  }

  try {
    console.log('🔥 Logging in user:', email)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('🔥 User logged in successfully:', user.uid)

    // 更新最后登录时间
    if (db) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString()
        })
      } catch (docError) {
        console.warn('🔥 Failed to update last login:', docError)
      }
    }

    return { success: true, user }
  } catch (error) {
    console.error('🔥 Login error:', error)
    return { success: false, error: getErrorMessage(error.code) }
  }
}

// Google登录
export const loginWithGoogle = async () => {
  if (!initialized || !auth) {
    return { success: false, error: 'Firebase not initialized. Please refresh and try again.' }
  }

  try {
    console.log('🔥 Attempting Google login...')

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    console.log('🔥 Google login successful:', user.uid)

    // 检查用户是否已存在
    let userDoc = null
    if (db) {
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid))
      } catch (docError) {
        console.warn('🔥 Failed to check user document:', docError)
      }
    }

    if (db && (!userDoc || !userDoc.exists())) {
      // 新用户，创建用户文档
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split('@')[0],
          role: 'guest',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          authProvider: 'google',
          photoURL: user.photoURL
        })
        console.log('🔥 New Google user document created')
      } catch (docError) {
        console.warn('🔥 Failed to create user document:', docError)
      }
    } else if (db && userDoc && userDoc.exists()) {
      // 现有用户，更新最后登录时间
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString(),
          photoURL: user.photoURL
        })
      } catch (docError) {
        console.warn('🔥 Failed to update user document:', docError)
      }
    }

    return { success: true, user }
  } catch (error) {
    console.error('🔥 Google login error:', error)
    return { success: false, error: getErrorMessage(error.code) }
  }
}

// 获取用户信息
export const getUserData = async (uid) => {
  if (!db) {
    console.warn('🔥 Firestore not initialized')
    return null
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error('🔥 Error fetching user data:', error)
    return null
  }
}

// 用户登出
export const logout = async () => {
  if (!initialized || !auth) {
    return { success: false, error: 'Firebase not initialized' }
  }

  try {
    await signOut(auth)
    console.log('🔥 User logged out successfully')
    return { success: true }
  } catch (error) {
    console.error('🔥 Logout error:', error)
    return { success: false, error: error.message }
  }
}

// === 数据管理功能 ===

// 保存评分到Firebase
export const saveRatingToFirebase = async (ratingData) => {
  if (!initialized || !auth || !db) {
    return { success: false, error: 'Firebase not properly initialized' }
  }

  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to save ratings')
    }

    const ratingWithUser = {
      ...ratingData,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'ratings'), ratingWithUser)
    console.log('🔥 Rating saved to Firebase:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('🔥 Error saving rating:', error)
    return { success: false, error: error.message }
  }
}

// 保存预约到Firebase
export const saveAppointmentToFirebase = async (appointmentData) => {
  if (!initialized || !auth || !db) {
    return { success: false, error: 'Firebase not properly initialized' }
  }

  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to save appointments')
    }

    const appointmentWithUser = {
      ...appointmentData,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'appointments'), appointmentWithUser)
    console.log('🔥 Appointment saved to Firebase:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('🔥 Error saving appointment:', error)
    return { success: false, error: error.message }
  }
}

// === 与localStorage兼容的功能 ===

// 同步Firebase用户到localStorage
export const syncUserToLocalStorage = async (user) => {
  if (user) {
    try {
      const userData = await getUserData(user.uid)
      if (userData) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUser', userData.username || user.displayName || user.email.split('@')[0])
        localStorage.setItem('currentRole', userData.role || 'guest')
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('firebaseUID', user.uid)
        localStorage.setItem('authProvider', 'firebase')

        console.log('🔥 User synced to localStorage:', userData.username)

        // 触发App.vue中的状态更新
        if (window.updateAuthStatus) {
          window.updateAuthStatus()
        }
      }
    } catch (error) {
      console.error('🔥 Failed to sync user data:', error)
    }
  } else {
    // 用户登出
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('firebaseUID')
    localStorage.removeItem('authProvider')

    console.log('🔥 User data cleared from localStorage')

    if (window.updateAuthStatus) {
      window.updateAuthStatus()
    }
  }
}

// 监听认证状态变化
export const onAuthStateChange = (callback) => {
  if (!initialized || !auth) {
    console.warn('🔥 Firebase Auth not initialized for state change listener')
    // 返回一个空的清理函数
    return () => {}
  }

  try {
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error('🔥 Error setting up auth state listener:', error)
    return () => {}
  }
}

// 检查Firebase连接状态
export const checkFirebaseConnection = () => {
  return new Promise((resolve) => {
    if (!initialized || !auth) {
      console.warn('🔥 Firebase not initialized');
      return resolve(false);
    }

    let settled = false;
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (settled) return;
        settled = true;
        unsubscribe();
        clearTimeout(timer);
        console.log('🔥 Firebase connection test successful');
        resolve(true);
      },
      (error) => {
        if (settled) return;
        settled = true;
        unsubscribe();
        clearTimeout(timer);
        console.error('🔥 Firebase connection test failed:', error);
        resolve(false);
      }
    );

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      console.warn('🔥 Firebase connection test timeout');
      resolve(false);
    }, 3000);
  });
};

// === 工具函数 ===

// 错误信息转换
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email address is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
    'auth/api-key-not-valid': 'Firebase configuration error. Please contact support.',
    'auth/invalid-api-key': 'Firebase configuration error. Please contact support.',
    'auth/app-not-authorized': 'This domain is not authorized. Please contact support.',
    'auth/project-not-found': 'Firebase project not found.',
    'auth/quota-exceeded': 'Firebase quota exceeded. Please try again later.',
    'auth/app-not-installed': 'Firebase SDK error. Please refresh the page.'
  }

  return errorMessages[errorCode] || `Authentication error: ${errorCode}`
}

// 检查用户是否是管理员
export const isAdmin = async (user = null) => {
  try {
    const currentUser = user || (auth && auth.currentUser)
    if (!currentUser) return false

    const userData = await getUserData(currentUser.uid)
    return userData?.role === 'admin'
  } catch (error) {
    console.error('🔥 Error checking admin status:', error)
    return false
  }
}

// 导出主要对象
export { auth, db, analytics }
export default app
