<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-center">
      <form>
        <div><h5>Acesse a sua conta</h5></div>
        <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{{ error }}</div>
        </div>
        <div v-if="welcome" class="alert alert-success d-flex align-items-center" role="alert">
          <i class="bi bi-check-lg me-2"></i>
          <div>{{ welcome }}</div>
        </div>
        <div class="form-group">
          <label>CPF</label>
          <input v-model="cpf" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" class="form-control" type="password" />
        </div>
        <button
          @click.prevent="doLogin"
          :disabled="noCredentials"
          type="submit"
          class="btn btn-primary mt-2"
        >
          Entrar
        </button>
        <p class="mt-2">
          <router-link to="register">Criar conta</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import AuthService from "../services/authService";
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../store/auth';

export default {
  setup() {
    const { setToken } = useAuth();
    const { push } = useRouter();
    const { query: { sessionExpired, registered } } = useRoute();
    
    const cpf = ref('');
    const password = ref('');
    const error = ref(false);
    const welcome = ref(false);

    const doLogin = async () => {
      const res = await AuthService.login(cpf.value, password.value);
      if(res.error) {
        error.value = 'Credenciais inválidas';
      } else {
        setToken(res.data.access_token);
        push('/');
      }
    };

    const noCredentials = computed(() => !cpf.value || !password.value);

    if(sessionExpired) {
      error.value = 'Sua sessão expirou';
    }

    if(registered) {
      welcome.value = 'Seja bem vindo! Acessa agora a sua nova conta';
    }

    return { cpf, password, noCredentials, error, welcome, doLogin };
  },
};
</script>