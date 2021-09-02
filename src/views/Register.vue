<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-center">
      <form>
        <div><h5>Criar conta</h5></div>
        <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{{ error }}</div>
        </div>
        <div class="form-group">
          <label>Nome</label>
          <input v-model="name" class="form-control" type="text" />
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
          @click.prevent="doRegister"
          :disabled="noCredentials"
          type="submit"
          class="btn btn-primary mt-2"
        >
          Criar conta
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useRouter } from 'vue-router';
import { useUser } from '../store/user';

export default {
  setup() {
    const { register } = useUser();
    const { push } = useRouter();
    
    const cpf = ref('');
    const name = ref('');
    const password = ref('');
    const error = ref(false);

    const doRegister = async () => {
      const res = await register(name.value, cpf.value, password.value)
      if(res.error) {
        error.value = res.error;
      } else {
        push({ path: 'auth', query: { registered: true } })
      }
    };

    const noCredentials = computed(() => !cpf.value || !password.value || !name.value);

    return { name, cpf, password, noCredentials, error, doRegister };
  },
};
</script>