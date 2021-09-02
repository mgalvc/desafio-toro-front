<template>
  <div class="container mt-4">
    <h4>Olá, {{ user.name }}</h4>
    <button class="btn btn-warning btn-sm mb-4" @click.prevent="onLogout">
      Sair
    </button>

    <p>
      <b>Banco:</b> 352<br />
      <b>Conta:</b> {{ user.account }}<br />
      <b>Agência:</b> 0001
    </p>

    <hr />

    <h4>Patrimônio total</h4>
    <p>{{ currency(wallet.consolidated) }}</p>
    <h5>Saldo em conta corrente</h5>
    <p>{{ currency(wallet.checkingAccountAmount) }}</p>
    <h5>Saldo em ativos</h5>
    <p>{{ currency(wallet.positionsAmount) }}</p>

    <hr />

    <h4>Top 5 ativos</h4>

    <div class="row">
      <div
        class="col mt-2"
        v-for="stock in trends"
        :key="stock.symbol"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ stock.symbol }}</h5>
            <div class="card-text">
              <div><b>Preço atual:</b> {{ currency(stock.currentPrice) }}</div>
              <div>
                <button
                  class="btn btn-primary btn-sm mt-2"
                  @click.prevent="setBuyingStock(stock)"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <h4 v-if="wallet.positions?.length">Seus ativos</h4>

    <div class="row mb-4">
      <div
        class="col col-12 col-sm-6 col-md-4 col-lg-3 mt-2"
        v-for="stock in wallet.positions"
        :key="stock.symbol"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              {{ stock.symbol }}
            </h5>
            <div class="card-text">
              <div><b>{{ currency(stock.currentPrice * stock.amount) }}</b></div>
              <div><b>Preço atual:</b> {{ currency(stock.currentPrice) }}</div>
              <div><b>Quantidade:</b> {{ stock.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" id="staticBackdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ buyingStock.symbol }} -
              {{ currency(buyingStock.currentPrice) }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <b>Seu saldo:</b> {{ currency(wallet.checkingAccountAmount) }}
            </p>
            <div>
              <b>Quantidade:</b>
              <input
                type="range"
                class="form-range"
                min="0"
                :max="maxBuyingStocks"
                v-model="buyingStocksAmount"
              />
            </div>
            <div class="text-center">
              <input
                type="number"
                class="form-control"
                id="input-amount"
                min="0"
                :max="maxBuyingStocks"
                v-model="buyingStocksAmount"
              />
            </div>
            <div>
              <b>Total da compra:</b> {{ currency(buyingStocksTotalPrice) }}
            </div>
            <div class="mt-2">
              <div
                v-if="orderError"
                class="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ orderError }}</div>
              </div>
              <div
                v-if="orderSuccess"
                class="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <i class="bi bi-check-lg me-2"></i>
                <div>{{ orderSuccess }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" :disabled="buyingStocksAmount <= 0" class="btn btn-primary" @click.prevent="buy">
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useUser } from "../store/user";
import { useWallet } from "../store/wallet";
import { useStock } from "../store/stock";
import { useAuth } from "../store/auth";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const { getUser } = useUser();
    const { getWallet, sendOrder } = useWallet();
    const { getTrends } = useStock();
    const { logout } = useAuth();
    const { push } = useRouter();

    const user = ref({});
    const wallet = ref({});
    const trends = ref({});
    const buyingStock = ref({});
    const maxBuyingStocks = ref(0);
    const buyingStocksAmount = ref(0);
    const orderError = ref("");
    const orderSuccess = ref("");

    const updateData = async () => {
      console.log('aqui')
      user.value = await getUser();
      wallet.value = await getWallet();
      trends.value = await getTrends();
    };

    onMounted(async () => {
      await updateData();
    });

    const currency = (raw) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(raw);
    };

    const setBuyingStock = (stock) => {
      buyingStock.value = stock;
      buyingStocksAmount.value = 0;
      orderError.value = "";
      orderSuccess.value = "";
      maxBuyingStocks.value = Math.floor(
        wallet.value.checkingAccountAmount / stock.currentPrice
      );
    };

    const buyingStocksTotalPrice = computed(
      () => buyingStock.value.currentPrice * buyingStocksAmount.value
    );

    const buy = async () => {
      orderError.value = "";
      orderSuccess.value = "";

      const res = await sendOrder(
        buyingStock.value.symbol,
        buyingStocksAmount.value
      );

      if (!res.error) {
        orderSuccess.value = res.message;
        buyingStocksAmount.value = 0;
        await updateData();
      } else {
        orderError.value = res.error;
      }
    };

    const onLogout = () => {
      logout();
      push('/auth');
    }

    return {
      user,
      wallet,
      trends,
      buyingStock,
      maxBuyingStocks,
      buyingStocksAmount,
      buyingStocksTotalPrice,
      orderError,
      orderSuccess,
      currency,
      setBuyingStock,
      onLogout,
      buy,
    };
  },
};
</script>

<style scoped>
#input-amount {
  width: auto;
  margin: auto;
}
</style>
