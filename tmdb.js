TMDB = function(options){
  options = options || {}
  this.config = _.defaults(options, {
    url: 'https://api.themoviedb.org/3/',
    key: Meteor.settings.tmdb.api.key
  })

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
    _.defaults(options.params, {api_key: this.config.key})

    if( !options.url || (options.url.length < 1) ){
      callback(new Meteor.Error(500, 'No path to TMDB API provided.'))
      return
    }

    if( options.url.indexOf(this.config.url) != 0 ){
      options.url = this.config.url + options.url
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
}