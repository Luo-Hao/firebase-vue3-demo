<template>
	<div class="auth-container">
		<div class="auth-card">
			<h2 class="auth-title">用户注册</h2>

			<!-- 注册表单 - 使用原生表单 -->
			<form @submit.prevent="handleSubmit" class="auth-form">
				<!-- 昵称输入 -->
				<div class="form-group">
					<label class="form-label">昵称</label>
					<input 
						type="text" 
						v-model="formData.nickname" 
						placeholder="请输入昵称" 
						class="form-input"
					>
				</div>

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

				<!-- 验证码输入和发送按钮 -->
				<div class="form-group">
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

				<!-- 密码输入 -->
				<div class="form-group">
					<label class="form-label">密码</label>
					<input 
						type="password" 
						v-model="formData.password" 
						placeholder="请设置密码（至少6位）" 
						class="form-input"
					>
					<div class="password-hint">密码至少6位字符</div>
				</div>

				<!-- 确认密码输入 -->
				<div class="form-group">
					<label class="form-label">确认密码</label>
					<input 
						type="password" 
						v-model="formData.confirmPassword" 
						placeholder="请再次输入密码" 
						class="form-input"
					>
				</div>

				<!-- 错误提示 -->
				<div v-if="errorMessage" class="error-message">
					{{ errorMessage }}
				</div>

				<!-- 注册按钮 -->
				<div class="form-group">
					<button 
						type="submit" 
						class="submit-button"
						:disabled="isSubmitting"
					>
						{{ isSubmitting ? '注册中...' : '注册' }}
					</button>
				</div>
			</form>

			<!-- 切换到登录 -->
			<div class="auth-switch">
				已有账号？<router-link to="/login" class="auth-link">立即登录</router-link>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { registerWithEmailAndPassword, sendVerificationCode as firebaseSendVerificationCode } from '../../firebase/auth';
import { setUser } from '../../firebase/userStore';

const router = useRouter();

// 表单数据
const formData = reactive({
	nickname: '',
	email: '',
	verificationCode: '',
	password: '',
	confirmPassword: ''
});

// 状态变量
const isSubmitting = ref(false);
const isSendingCode = ref(false);
const errorMessage = ref('');
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 发送验证码
 */
const sendVerificationCode = async () => {
	// 验证邮箱
	if (!formData.email) {
		errorMessage.value = '请输入邮箱';
		return;
	}

	// 使用正则验证邮箱格式
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(formData.email)) {
		errorMessage.value = '请输入有效的邮箱地址';
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
	if (!formData.nickname) {
		errorMessage.value = '请输入昵称';
		return false;
	}

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

	if (!formData.verificationCode) {
		errorMessage.value = '请输入验证码';
		return false;
	}

	if (!formData.password) {
		errorMessage.value = '请输入密码';
		return false;
	}

	if (formData.password.length < 6) {
		errorMessage.value = '密码至少需要6位字符';
		return false;
	}

	if (!formData.confirmPassword) {
		errorMessage.value = '请确认密码';
		return false;
	}

	if (formData.password !== formData.confirmPassword) {
		errorMessage.value = '两次输入的密码不一致';
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

		const { nickname, email, password } = formData;

		// 注册用户
		const user = await registerWithEmailAndPassword(email, password, nickname);
		setUser(user);

		// 提示用户注册成功
		alert('注册成功！请检查邮箱进行验证。');

		// 注册成功后跳转到首页
		router.push('/');
	} catch (error) {
		// 处理注册错误
		if (error instanceof Error) {
			if (error.message.includes('auth/email-already-in-use')) {
				errorMessage.value = '该邮箱已被注册';
			} else if (error.message.includes('auth/invalid-email')) {
				errorMessage.value = '请输入有效的邮箱地址';
			} else if (error.message.includes('auth/weak-password')) {
				errorMessage.value = '密码强度不足，请使用至少6位字符';
			} else {
				errorMessage.value = '注册失败，请稍后重试';
			}
		} else {
			errorMessage.value = '注册失败，请稍后重试';
		}
		console.error('注册失败:', error);
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

.password-hint {
	font-size: 12px;
	color: #666;
	margin-top: 5px;
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