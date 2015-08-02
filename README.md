TMDB
===============

A wrapper for the TMDB (TheMovieDataBase.org) API (v3)

## Package Dependencies
* underscore
* http
* momentjs:moment
* a valid API key from [TMDB](https://www.themoviedb.org)

## Usage
1. `meteor add rkstar:tmdb`
2. Use inside `Meteor.method()` calls only! Future versions may allow you to make calls directly from the client, but this is server only for now.

This library uses the `service-configuration` package to store your api key. You can configure this api like this:
in `/server/lib/tmdb-configuration.js`
```
ServiceConfiguration.configurations.update({
  service: 'tmdb'
},{$set: {
  apiKey: '<your-tmdb-api-key>'
}},{
  upsert: true
})
```

## Methods (server)
`TMDB.search(path, query, callback)`
* path => eg. "person"
* query => eg. "brad pitt"
* callback => `function(err, response){}`

`TMDB.find(id, external_source, callback)`
* id => eg. nm0000093
* external_source => eg. 'IMDB'
* callback => `function(err, response){}`

## Methods (client)
You can access the [TMDB API Configuration](http://docs.themoviedb.apiary.io/#reference/configuration) by using the var `tmdb.config.data`
You will be able to see the last time that data was reloaded via `tmdb.config.loaded` and you can choose to force reload via the API when you instantiate with `new TMDB({reload:true})`


## Reading
[The Movie Database](https://www.themoviedb.org)
[TMDB Apiary Documentation](http://docs.themoviedb.apiary.io/)