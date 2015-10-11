class API {
  constructor(defaults={}){
    // cache the /configuration from tmdb for 3 days before reloading
    // this can be overridden by passing
    // {reload:true} or {reloadInterval: moment().subtract('1','day').toDate()} into 'defaults'
    this.defaults = defaults
    _.defaults(this.defaults,{
      reload: false,
      reloadInterval: moment().subtract('3','days').toDate()
    })
    this.defaults.apiUrl = 'https://api.themoviedb.org/3/'

    this.config = ServiceConfiguration.configurations.findOne({service: 'tmdb'})
    if( !this.config ){
      throw new ServiceConfiguration.ConfigError('TMDB not configured')
    }

    if( this.defaults.reload
      || !this.config.data
      || !this.config.loaded
      || (this.config.loaded < this.defaults.reloadInterval) ){
      this.reload()
    }
  }

  reload(){
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

  execute(opts){
    return new Promise((resolve, reject)=>{
      if( _.isString(opts) ){
        let url = opts
        opts = {url}
      }
      _.defaults(opts,{
        url: '',
        params: {},
        method: 'GET'
      })
      _.defaults(opts.params, {api_key: this.config.apiKey})

      if( !opts.url || (opts.url.length < 1) ){
        reject(new Meteor.Error(500, 'No path to TMDB API provided'))
        return
      }

      HTTP.call(opts.method, this.defaults.apiUrl+opts.url, {params: opts.params}, (err, response)=>{
        if( response.statusCode != 200 ){
          reject(new Meteor.Error(response.data.status_code, response.data.status_message))
        } else {
          resolve(response.data)
        }
      })
    })
  }

  search(path, query){
      if( !path || (path.length < 1) ){
        return new Promise((resolve, reject)=>{
          reject(new Meteor.Error(429, 'Nothing to search'))
        })
      }
      if( !query || (query.length < 1) ){
        return new Promise((resolve, reject)=>{
          reject( new Meteor.Error(429, 'No query specified'))
        })
      }

      return this.execute({
        url: `search/${path}`,
        params: {query}
      })
  }

  findById(id, source='imdb'){
    if( !id || (id.length < 1) ){
      return new Promise((resolve, reject)=>{
        reject(new Meteor.Error(500, 'No ID specified'))
      })
    }

    // replace spaces in the source name
    source = source.replace(/\s+/g, '')
    switch( source.toLowerCase() ){
      case 'freebase/movie':
        source += '_mid'
        break

      case 'imdb':
      default:
        source += '_id'
        break
    }

    return new Promise((resolve, reject)=>{
      this.execute({
        url: `find/${id}`,
        params: {external_source: source}
      })
      .then((result)=>{
          resolve({
            movies: result.movie_results,
            people: result.person_results,
            tv: {
              shows: result.tv_results,
              seasons: result.tv_season_results,
              episodes: result.tv_episode_results
            }
          })
        }, (err)=>{ reject(err) })
    })
  }

  specific(url, err, id, search){
    let id_required = !(search && (['popular','latest'].indexOf(search) != -1))
    if( (!id || (id.length < 1)) && id_required ){
      return new Promise((resolve, reject)=>{
        reject(new Meteor.Error(500, err))
      })
    }

    url += (id_required) ? `/${id}` : ''
    url += (search) ? `/${search}` : ''
    return this.execute({url})
  }

  person(id, search){
    return this.specific('person', 'No profile ID specified', id, search)
  }

  tv(id, search){
    return this.specific('tv', 'No TV ID specified', id, search)
  }

  movies(id, search){
    return this.specific('movie', 'No movie ID specified', id, search)
  }

  get config(){
    return this._config
  }
  set config(value){
    this._config = value
  }

  get defaults(){
    return this._defaults
  }
  set defaults(value){
    this._defaults = value
  }
}

TMDB.API = API