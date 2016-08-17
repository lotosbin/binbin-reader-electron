/**
 * Created by liubinbin on 16/08/2016.
 */
import emitter from "./emitter"
import * as Vue from 'vue'

var vm = new Vue({
  el: '#readhistory',
  data: {
    histories: []
  },
  methods: {
    AddHistory: function (article) {
      this.histories.unshift(article)
    }
  }
})

emitter.on('open_in_detail', (entry) => {
  console.log('addhistory')
  vm.AddHistory(entry)
})

export default class {
  
}
