let reactive = new ReactiveDict('ready', false)

class Client {
  constructor(){
    console.warn('YOU SHOULD NOT BE INSTANTIATING THIS CLASS!')
    return null
  }

  static get ready(){
    return reactive.get('ready')
  }

  static get config(){
    return Client._config
  }
  static set config(value){
    Client._config = value
  }

  static imagePath(filename, sizeIndex=2){
    if( !Client.ready ){
      console.warn('TMDB config is not loaded.')
      return filename
    }

    let img = Client.config.data.images,
      path = img.secure_base_url
      path += img.profile_sizes[sizeIndex]
      path += filename

    return path
  }
}
TMDB.Client = Client

Meteor.startup(()=>{
  let TMDBConfigurationSettings = new Mongo.Collection('tmdb-config')
  Meteor.subscribe('tmdb-config')
  Tracker.autorun(()=>{
    Client.config = TMDBConfigurationSettings.findOne()
    reactive.set('ready', (Client.config))
  })
})