<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-center">
      <form>
        <div><h5>Acesse a sua conta</h5></div>
        <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div> Credenciais inválidas</div>
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="email" class="form-control" type="email" />
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
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import AuthService from "../services/authService";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref(false);
    const { push } = useRouter();

    const doLogin = async () => {
      const res = await AuthService.login(email.value, password.value);
      if(res.error) {
        error.value = true;
      } else {
        push('/');
      }
    };

    const noCredentials = computed(() => !email.value || !password.value);

    return { email, password, noCredentials, error, doLogin };
  },
};
</script>