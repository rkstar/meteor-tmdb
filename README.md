TMDB
===============

A wrapper for the TMDB (TheMovieDataBase.org) API (v3)

## Package Dependencies
* underscore
* http
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
`let promise = TMDB.API.search(path, query)`
* path => eg. "person"
* query => eg. "brad pitt"

`let promise = TMDB.API.findById(id, external_source)`
* id => eg. nm0000093
* external_source => eg. 'IMDB'

`let promise = TMDB.API.person(id, searchFor)`
`let promise = TMDB.API.movies(id, searchFor)`
`let promise = TMDB.API.tv(id, searchFor)`
* id => a valid TMDB id
* searchFor => can be any of the options under the various paths [here](http://docs.themoviedb.apiary.io/#reference/people), [here](http://docs.themoviedb.apiary.io/#reference/movies), and [here](http://docs.themoviedb.apiary.io/#reference/tv).  if you pass *popular* or *latest*, pass `null` for `id`
The `searchFor` path in `/person/{id}/movie_credits` would therefore be `movie_credits`

## Methods (client)
You can access the [TMDB API Configuration](http://docs.themoviedb.apiary.io/#reference/configuration) by using the var `TMDB.Client.config.data`
You will be able to see the last time that data was reloaded via `TMDB.Client.config.loaded` and you can choose to force reload via the API when you instantiate with `new TMDB.API({reload:true})`


## Reading
[The Movie Database](https://www.themoviedb.org)
[TMDB Apiary Documentation](http://docs.themoviedb.apiary.io/)