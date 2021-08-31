<template>
  <div class="container mt-4">
    <h4>Olá, {{ user.name }}</h4>

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

    <!-- <hr />

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
              <div><b>Quantidade:</b> {{ stock.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <hr />

    <h4>Top 5 ativos</h4>

    <div class="row">
      <div class="col col-3 mt-2" v-for="stock in trends" :key="stock.symbol">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ stock.symbol }}</h5>
            <div class="card-text">
              <div><b>Preço atual:</b> {{ currency(stock.currentPrice) }}</div>
              <div>
                <button
                  class="btn btn-primary btn-sm mt-2"
                  @click.prevent="setBuyingStock(stock)"
                  data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" id="staticBackdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ buyingStock.symbol }} - {{ currency(buyingStock.currentPrice) }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p><b>Seu saldo:</b> {{ currency(wallet.checkingAccountAmount) }}</p>
            <div><b>Quantidade:</b> <input type="range" class="form-range" min="0" :max="maxBuyingStocks" v-model="buyingStocksAmount"></div>
            <div class="text-center">{{ buyingStocksAmount }}</div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-primary">Comprar</button>
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
import { useStock } from "../store/stock";

export default {
  setup() {
    const { getUser } = useUser();
    const { getWallet } = useWallet();
    const { getTrends } = useStock();
    const user = ref({});
    const wallet = ref({});
    const trends = ref({});
    const buyingStock = ref({});
    const maxBuyingStocks = ref(0);
    const buyingStocksAmount = ref(0);

    onMounted(async () => {
      user.value = await getUser();
      wallet.value = await getWallet();
      trends.value = await getTrends();
    });

    const currency = (raw) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(raw);
    };

    const setBuyingStock = (stock) => {
      buyingStock.value = stock;
      maxBuyingStocks.value = Math.floor(wallet.value.checkingAccountAmount / stock.currentPrice);
      buyingStocksAmount.value = 0;
    };

    return { user, wallet, trends, buyingStock, maxBuyingStocks, buyingStocksAmount, currency, setBuyingStock };
  },
};
</script>
