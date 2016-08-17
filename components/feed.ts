import  * as Vue from 'vue'
import  * as reader from 'feed-reader'
import articleStorage from '../storage/article'
import emitter from './emitter'
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
    },
    on_open_in_detail: function (event, entry) {
      event.preventDefault()
      emitter.emit('open_in_detail', entry)
      console.log('emit')
    }
  }
})
export class Feed {
  async UpdateList() {
    articleStorage.Find({}, (error, results)=> {
      console.log(results.rows.length)
      entryVue.UpdateEntries(results.rows)
    })
  }


  async open_in_list(xmlurl, callback) {
    entryVue.UpdateProgress(50)
    try {
      let feed = await reader.parse(xmlurl)
      entryVue.UpdateProgress(80)
      articleStorage.AddRange(feed.entries, xmlurl, ()=> {
      })
      await this.UpdateList()
      entryVue.UpdateProgress(100)
      if (callback)callback(null)
    } catch (error) {
      console.error(JSON.stringify(error))
      entryVue.UpdateProgress(100)
      if (callback)callback(error)
    }
  }
}
var feed = new Feed()
emitter.on('open_in_list', (f)=> {
  feed.open_in_list(f.xmlurl, ()=> {
  })
})
emitter.on('refresh_list',(f)=>{
  feed.UpdateList()
})
export default feed
