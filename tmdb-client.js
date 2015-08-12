tmdbClient = new ReactiveDict('tmdbClient')
tmdbClient.set('config', {})

Meteor.startup(function(){
  var tmdbConfig = new Mongo.Collection('tmdb-config')
  Meteor.subscribe('tmdb-config')
  Tracker.autorun(function(){
    tmdbClient.set('config', tmdbConfig.findOne())
  })
})