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

By default, this library will look for your TMDB API key in `Meteor.settings.tmdb.api.key`.  You can also specify the API key when you instantiate the service:
```
var tmdb = new TMDB({key: <my_tmdb_api_key>})
tmdb.search('person', 'brad pitt', function(err, response){
  if( err ){
    console.error(err)
  } else {
    console.log(response)
  }
})
```

## Methods
`TMDB.search(path, query, callback)`
* path => eg. "person"
* query => eg. "brad pitt"
* callback => `function(err, response){}`

`TMDB.find(id, external_source, callback)`
* id => eg. nm0000093
* external_source => eg. 'IMDB'
* callback => `function(err, response){}`

## Reading
[The Movie Database](https://www.themoviedb.org)
[TMDB Apiary Documentation](http://docs.themoviedb.apiary.io/)