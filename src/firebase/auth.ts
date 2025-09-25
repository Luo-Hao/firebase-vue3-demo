import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, User, NextOrObserver } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';

// 初始化Firebase应用
const app = initializeApp(firebaseConfig);

// 获取Firebase认证实例
const auth = getAuth(app);

/**
 * 用户注册函数
 * @param email 邮箱
 * @param password 密码
 * @param nickname 昵称
 * @returns Promise<User>
 */
export const registerWithEmailAndPassword = async (email: string, password: string, nickname: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 发送邮件验证
    await sendEmailVerification(user);
    
    // 这里可以将昵称存储到Firebase数据库中，目前仅返回用户对象
    return user;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 邮箱密码登录函数
 * @param email 邮箱
 * @param password 密码
 * @returns Promise<User>
 */
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 发送验证码到邮箱（用于无密码登录）
 * @param email 邮箱
 * @returns Promise<void>
 */
export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    // 注意：Firebase的无密码登录需要在Firebase控制台中配置
    // 这里我们使用发送密码重置邮件作为验证码的替代方案
    // 在实际项目中，您可能需要使用Firebase的Email Link Authentication
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('发送验证码失败:', error);
    throw error;
  }
};

/**
 * 登出函数
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

/**
 * 监听用户认证状态变化
 * @param callback 回调函数
 * @returns 取消监听函数
 */
export const onAuthStateChange = (callback: NextOrObserver<User>): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 获取当前登录用户
 * @returns User | null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// 导出auth实例，供其他组件使用
export { auth };