tmdbClient = new ReactiveDict('tmdbClient')
tmdbClient.set('config', {})
tmdbClient.set('imagePath', function(filename, size){
  if( !filename || (filename.length < 1) ){
    return ''
  }
  size = size || 2

  var config = TMDB.client.get('config').data.images,
    path = config.secure_base_url
  path += config.profile_sizes[size]
  path += filename
  return path
})

Meteor.startup(function(){
  var tmdbConfig = new Mongo.Collection('tmdb-config')
  Meteor.subscribe('tmdb-config')
  Tracker.autorun(function(){
    tmdbClient.set('config', tmdbConfig.findOne())
  })
})