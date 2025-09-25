<template>
	<div class="auth-container">
		<div class="auth-card">
			<h2 class="auth-title">用户登录</h2>

			<!-- 登录方式切换 -->
			<div class="auth-tabs">
				<button 
					class="auth-tab-button" 
					:class="{ active: loginMethod === 'password' }"
					@click="switchLoginMethod('password')"
				>邮箱+密码</button>
				<button 
					class="auth-tab-button" 
					:class="{ active: loginMethod === 'code' }"
					@click="switchLoginMethod('code')"
				>邮箱+验证码</button>
			</div>

			<!-- 登录表单 - 使用原生表单 -->
			<form @submit.prevent="handleSubmit" class="auth-form">
				<!-- 邮箱输入 -->
				<div class="form-group">
					<label class="form-label">邮箱</label>
					<input 
						type="email" 
						v-model="formData.email" 
						placeholder="请输入邮箱" 
						class="form-input"
					>
				</div>

				<!-- 密码输入（仅当选择密码登录时显示） -->
				<div v-if="loginMethod === 'password'" class="form-group">
					<label class="form-label">密码</label>
					<input 
						type="password" 
						v-model="formData.password" 
						placeholder="请输入密码" 
						class="form-input"
					>
				</div>

				<!-- 验证码输入和发送按钮（仅当选择验证码登录时显示） -->
				<div v-if="loginMethod === 'code'" class="form-group">
					<label class="form-label">验证码</label>
					<div class="verification-code-container">
						<input 
							v-model="formData.verificationCode" 
							placeholder="请输入验证码" 
							class="form-input verification-input"
						>
						<button 
							type="button" 
							class="verification-button"
							@click="sendVerificationCode" 
							:disabled="isSendingCode || countdown > 0"
						>
							{{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
						</button>
					</div>
				</div>

				<!-- 错误提示 -->
				<div v-if="errorMessage" class="error-message">
					{{ errorMessage }}
				</div>

				<!-- 登录按钮 -->
				<div class="form-group">
					<button 
						type="submit" 
						class="submit-button"
						:disabled="isSubmitting"
					>
						{{ isSubmitting ? '登录中...' : '登录' }}
					</button>
				</div>
			</form>

			<!-- 切换到注册 -->
			<div class="auth-switch">
				还没有账号？<router-link to="/register" class="auth-link">立即注册</router-link>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithEmailAndPassword, sendVerificationCode as firebaseSendVerificationCode } from '../../firebase/auth';
import { setUser } from '../../firebase/userStore';

const router = useRouter();

// 表单数据
const formData = reactive({
	email: '',
	password: '',
	verificationCode: ''
});

// 登录方式
const loginMethod = ref<'password' | 'code'>('password');

// 状态变量
const isSubmitting = ref(false);
const isSendingCode = ref(false);
const errorMessage = ref('');
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 切换登录方式
 */
const formRef = ref<any>(null);
const switchLoginMethod = (method: 'password' | 'code') => {
	loginMethod.value = method;
	errorMessage.value = '';
	// 重置表单验证状态
	if (formRef.value) {
		formRef.value.resetFields();
	}
};

/**
 * 发送验证码
 */
const sendVerificationCode = async () => {
	if (!formData.email) {
		errorMessage.value = '请输入邮箱';
		return;
	}

	isSendingCode.value = true;
	errorMessage.value = '';

	try {
		await firebaseSendVerificationCode(formData.email);

		// 开始倒计时
		countdown.value = 60;
		startCountdown();

		// 提示用户
		alert('验证码已发送到您的邮箱，请查收');
	} catch (error) {
		errorMessage.value = '发送验证码失败，请稍后重试';
		console.error('发送验证码失败:', error);
	} finally {
		isSendingCode.value = false;
	}
};

/**
 * 开始倒计时
 */
const startCountdown = () => {
	if (countdownTimer) {
		clearInterval(countdownTimer);
	}

	countdownTimer = setInterval(() => {
		if (countdown.value > 0) {
			countdown.value--;
		} else {
			if (countdownTimer) {
				clearInterval(countdownTimer);
				countdownTimer = null;
			}
		}
	}, 1000);
};

/**
 * 验证表单
 */
const validateForm = () => {
	// 简单的客户端验证
	if (!formData.email) {
		errorMessage.value = '请输入邮箱';
		return false;
	}

	// 邮箱格式验证
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(formData.email)) {
		errorMessage.value = '请输入有效的邮箱地址';
		return false;
	}

	if (loginMethod.value === 'password' && !formData.password) {
		errorMessage.value = '请输入密码';
		return false;
	}

	if (loginMethod.value === 'code' && !formData.verificationCode) {
		errorMessage.value = '请输入验证码';
		return false;
	}

	return true;
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
	isSubmitting.value = true;
	errorMessage.value = '';

	try {
		// 验证表单
		if (!validateForm()) {
			return;
		}

		const { email, password, verificationCode } = formData;

		if (loginMethod.value === 'password') {
			// 使用密码登录
			const user = await loginWithEmailAndPassword(email, password);
			setUser(user);
		} else {
			// 注意：这里使用密码重置链接作为验证码登录的替代方案
			// 在实际项目中，您应该使用Firebase的Email Link Authentication
			alert('验证码登录功能需要在Firebase控制台中配置，请先使用密码登录。\n\n注意：我们已经向您的邮箱发送了密码重置链接，您可以使用该链接重置密码后登录。');
		}

		// 登录成功后跳转到首页
		router.push('/');
	} catch (error) {
		// 处理登录错误
		if (error instanceof Error) {
			if (error.message.includes('auth/user-not-found')) {
				errorMessage.value = '该邮箱尚未注册';
			} else if (error.message.includes('auth/wrong-password')) {
				errorMessage.value = '密码错误';
			} else {
				errorMessage.value = '登录失败，请稍后重试';
			}
		} else {
			errorMessage.value = '登录失败，请稍后重试';
		}
		console.error('登录失败:', error);
	} finally {
		isSubmitting.value = false;
	}
};

// 组件卸载时清除定时器
import { onUnmounted } from 'vue';
onUnmounted(() => {
	if (countdownTimer) {
		clearInterval(countdownTimer);
	}
});
</script>

<style lang="less" scoped>
// 导入变量
@import '../../style.less';

.auth-container {
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	box-sizing: border-box;
	min-height: 100vh;
}

.auth-card {
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	padding: 30px;
	width: 420px;
}

.auth-title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
	text-align: center;
	color: #333;
}

.auth-tabs {
	display: flex;
	margin-bottom: 20px;
	border-bottom: 1px solid #eee;
}

.auth-tab-button {
	flex: 1;
	padding: 10px 15px;
	font-size: 16px;
	transition: all 0.3s ease;
	border: none;
	background: none;
	cursor: pointer;
	border-bottom: 2px solid transparent;
	color: #666;

	&:hover {
		color: #1890ff;
	}

	&.active {
		color: #1890ff;
		border-bottom-color: #1890ff;
	}
}

.auth-form {
	width: 100%;
}

.form-group {
	margin-bottom: 20px;
}

.form-label {
	display: block;
	margin-bottom: 8px;
	font-weight: 500;
	color: #333;
}

.form-input {
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #d9d9d9;
	border-radius: 4px;
	font-size: 14px;
	transition: all 0.3s;

	&:focus {
		border-color: #1890ff;
		outline: none;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}
}

.verification-code-container {
	display: flex;
	gap: 10px;
}

.verification-input {
	flex: 1;
}

.verification-button {
	padding: 8px 16px;
	background-color: #1890ff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover:not(:disabled) {
		background-color: #40a9ff;
	}

	&:disabled {
		background-color: #f5f5f5;
		color: #bfbfbf;
		cursor: not-allowed;
	}
}

.submit-button {
	width: 100%;
	padding: 10px;
	background-color: #1890ff;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover:not(:disabled) {
		background-color: #40a9ff;
	}

	&:disabled {
		background-color: #f5f5f5;
		color: #bfbfbf;
		cursor: not-allowed;
	}
}

.error-message {
	padding: 8px 12px;
	background-color: #fff1f0;
	border: 1px solid #ffccc7;
	border-radius: 4px;
	color: #ff4d4f;
	margin-bottom: 15px;
}

.auth-switch {
	text-align: center;
	margin-top: 20px;
	font-size: 14px;
	color: #666;
}

.auth-link {
	color: #1890ff;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
}
</style>