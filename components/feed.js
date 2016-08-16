var Vue = require('vue');
var reader = require('feed-reader');
var articleStorage = require('../storage/article');

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
function UpdateList() {
  articleStorage.Find({}, function (error, results) {
    console.log(results.rows.length)
    entryVue.UpdateEntries(results.rows)
  });
}
function open_in_list(xmlurl) {
  entryVue.UpdateProgress(50)
  reader.parse(xmlurl)
    .then(function (feed) {
      entryVue.UpdateProgress(80)
      console.log(JSON.stringify(feed))
      articleStorage.AddRange(feed.entries,xmlurl)
      UpdateList()
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
