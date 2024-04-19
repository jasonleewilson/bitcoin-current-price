import './assets/main.css'

import { createApp } from 'vue/dist/vue.esm-bundler'
// import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp({
  el: '.btc-badge',
  data: function () {
    return {
      btcUSD: '0.00',
      percentChange: '0',
      upDown: 'up'
    }
  },
  mounted() {
    this.getInfo()

    setInterval(() => {
      this.getInfo()
    }, 1000 * 60)
  },
  methods: {
    getPercentChange(newPrice, open) {
      this.percentChange = parseFloat(((newPrice - open) / open) * 100).toFixed(4)
      if (newPrice > open) {
        this.upDown = 'up'
      } else {
        this.upDown = 'down'
      }
    },
    getInfo() {
      axios
        .get(
          'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD&e=Coinbase'
        )
        .then((response) => {
          const open = response.data.RAW.BTC.USD.OPEN24HOUR
          const newPrice = response.data.RAW.BTC.USD.PRICE
          console.log(open)
          this.getPercentChange(newPrice, open)
          this.btcUSD = newPrice
        })
    }
  }
})

app.use(router)

app.mount('#app')

// app.use(router)

// app.mount('#app')
