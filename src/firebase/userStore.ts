import { ref, computed } from 'vue';
import { User } from 'firebase/auth';
import { onAuthStateChange, getCurrentUser } from './auth';

// 用户状态ref
const user = ref<User | null>(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

/**
 * 初始化用户状态
 */
export const initializeUserState = (): void => {
  // 立即获取当前用户
  const currentUser = getCurrentUser();
  if (currentUser) {
    user.value = currentUser;
    isAuthenticated.value = true;
  }
  
  // 设置状态监听
  const unsubscribe = onAuthStateChange((currentUser) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
    isLoading.value = false;
  });
  
  // 在组件卸载时取消监听
  // 注意：在实际使用时，应该在适当的生命周期钩子中调用unsubscribe
};

/**
 * 获取当前用户
 */
export const useCurrentUser = () => {
  return computed(() => user.value);
};

/**
 * 检查用户是否已认证
 */
export const useIsAuthenticated = () => {
  return computed(() => isAuthenticated.value);
};

/**
 * 检查认证状态是否正在加载
 */
export const useIsLoading = () => {
  return computed(() => isLoading.value);
};

/**
 * 手动设置用户状态
 * @param newUser 用户对象或null
 */
export const setUser = (newUser: User | null): void => {
  user.value = newUser;
  isAuthenticated.value = !!newUser;
  isLoading.value = false;
};