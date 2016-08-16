var Vue = require('vue');
var reader = require('feed-reader');

var entryVue = new Vue({
  el: '#entryList',
  data: {
    progress: 0,
    entries: []
  },
  methods: {
    UpdateEntries: function (entires) {
      this.entries = entires
    },
    UpdateProgress: function (progress) {
      this.progress = progress
    }
  }
})
function open_in_list(xmlurl) {
  entryVue.UpdateProgress(50)
  reader.parse(xmlurl)
    .then(function (feed) {
      entryVue.UpdateProgress(80)
      console.log(JSON.stringify(feed))
      entryVue.UpdateEntries(feed.entries)
      entryVue.UpdateProgress(100)
    })
    .catch(function (error) {
      console.error(JSON.stringify(error))
      entryVue.UpdateProgress(100)
    })
}
module.exports = {
  open_in_list: open_in_list
}
