<template>
  <div class="container mt-4">
    <h4>Olá, {{ user.name }}</h4>

    <hr />

    <h4>Patrimônio total</h4>
    <p>{{ currency(wallet.consolidated) }}</p>
    <h5>Saldo em conta corrente</h5>
    <p>{{ currency(wallet.checkingAccountAmount) }}</p>
    <h5>Saldo em ativos</h5>
    <p>{{ currency(wallet.positionsAmount) }}</p>

    <hr />

    <h4>Seus ativos</h4>

    <div class="row">
      <div
        class="col col-3 mt-2"
        v-for="stock in wallet.positions"
        :key="stock.symbol"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ stock.symbol }} - {{ currency(stock.currentPrice * stock.amount) }}</h5>
            <div class="card-text">
              <div><b>Preço atual:</b> {{ currency(stock.currentPrice) }}</div>
              <div><b>Quantidade:</b> {{ currency(stock.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import { useUser } from "../store/user";
import { useWallet } from "../store/wallet";

export default {
  setup() {
    const { getUser } = useUser();
    const { getWallet } = useWallet();
    const user = ref({});
    const wallet = ref({});

    onMounted(async () => {
      user.value = await getUser();
      wallet.value = await getWallet();
    });

    const currency = (raw) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raw);
    }

    return { user, wallet, currency };
  },
};
</script>
