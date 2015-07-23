Meteor.publish('tmdb-config',function(){
  var self = this,
    handle = ServiceConfiguration.configurations.find({service: 'tmdb'}).observeChanges({
      added: function(_id, doc){
        self.added('tmdb-config', _id, _.pick(doc,['loaded','data']))
      },
      changed: function(_id, doc){
        self.changed('tmdb-config', _id, _.pick(doc,['loaded','data']))
      },
      removed: function(_id){
        self.removed('tmdb-config', _id)
      }
    })

  self.ready()
  self.onStop(function(){
    handle.stop()
  })
})