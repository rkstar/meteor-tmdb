TMDB = function(defaults){

  // constructor ////////////////////////
  defaults = defaults || {}
  defaults.apiUrl = 'https://api.themoviedb.org/3/'

  // cache the /configuration from tmdb for 3 days before reloading
  // this can be overridden by passing
  // {reload:true} or {reloadInterval: moment().subtract('1','day').toDate()} into 'defaults'
  _.defaults(defaults,{
    reload: false,
    reloadInterval: moment().subtract('3','days').toDate()
  })

  // get the default config for this service from ServiceConfiguration
  this.config = ServiceConfiguration.configurations.findOne({service: 'tmdb'})
  if( !this.config ){
    throw new ServiceConfiguration.ConfigError('TMDB not configured')
  }

  this.init = function(){
    if( defaults.reload || !this.config.data || !this.config.loaded || (this.config.loaded < defaults.reloadInterval) ){
      this.reload()
    }
  }

  this.reload = function(){
    var response = HTTP.call('GET', defaults.apiUrl+'configuration',{params:{api_key: this.config.apiKey}})
    if( response.statusCode == 200 ){
      ServiceConfiguration.configurations.update(
        {service: 'tmdb'},
        {$set: {
          'loaded': new Date(),
          'data':response.data}
        })
      this.config = ServiceConfiguration.configurations.findOne({service: 'tmdb'})
    }
  }

  this.execute = function(options, callback){
    if( typeof options === 'string' ){
      var url = options
      options = {url: url}
    }
    _.defaults(options, {
      url: '',
      params: {},
      method: 'GET'
    })
    _.defaults(options.params, {api_key: this.config.apiKey})

    if( !options.url || (options.url.length < 1) ){
      callback(new Meteor.Error(500, 'No path to TMDB API provided.'))
      return
    }

    if( options.url.indexOf(defaults.apiUrl) != 0 ){
      options.url = defaults.apiUrl + options.url
    }

    HTTP.call(options.method, options.url, {params: options.params}, function(err, response){
      if( response.statusCode != 200 ){
        callback(new Meteor.Error(response.data.status_code, response.data.status_message))
      } else {
        callback(null, response.data)
      }
    })
  }

  this.search = function(path, query, callback){
    if( !path || (path.length < 1) ){
      callback(new Meteor.Error(429, 'Nothing to search.'))
      return
    }
    if( !query || (query.length < 1) ){
      callback(new Meteor.Error(429, 'No query specified.'))
      return
    }

    this.execute({
      url: 'search/'+path,
      params: {query: query}
    }, callback)
  }

  this.find = function(id, source, callback){
    if( !callback && (typeof source == 'function') ){
      callback = source
      source = 'IMDB'
    }
    if( !id || (id.length < 1) ){
      callback(new Meteor.Error(500, 'No IMDB ID specified.'))
      return
    }

    source = source.replace(/\s+/g,'')
    switch( source.toLowerCase() ){
      case 'freebase/movie':
        source += '_mid'
        break

      default:
        source += '_id'
    }

    this.execute({
      url: 'find/'+id,
      params: {external_source: source}
    }, function(err, response){
      if( err ){
        callback(err)
      } else {
        // format the results a little nicer for our end users
        callback(null,{
          movies: response.movie_results,
          people: response.person_results,
          tv: {
            shows: response.tv_results,
            seasons: response.tv_season_results,
            episodes: response.tv_episode_results
          }
        })
      }
    })
  }

  this.person = function(id, search, callback){
    if( !callback && (typeof search == 'function') ){
      callback = search
      search = null
    }

    var id_required = !(search && (['popular','latest'].indexOf(search) != -1))
    if( !id && id_required ){
      callback(new Meteor.Error(500, 'No profile id specified'))
      return
    }

    var url = 'person'
    url += (id_required) ? '/'+id : ''
    url += (search) ? '/'+search : ''
    this.execute({
      url: url
    }, callback)
  }

  // this must be called after all functions are declared above
  this.init()
}