## 2.0.0
###### _October 10, 2015_

### THIS VERSION IS _NOT_ BACKWARDS COMPATIBLE TO 1.x

##### Updated for Meteor 1.2 & Promises
- moved from node-style err/result callbacks to returning Promises
- moved to ES2015 style code w/classes instead of functions
###### Refactoring
- integrated a parent-level **TMDB**
- *tmdbClient* is now **TMDB.Client**
- *TMDB* (server-accessible API) is now **TMDB.API**
- `TMDB.API.find` is now `TMDB.API.findById` - it takes the same parameters, but returns a Promise instead of taking a callback as an argument
```javascript
// 'external_source` can be 'freebase/movie' or 'imdb' => defaults to 'imdb'
TMDB.API.findById(id, [external_source])
  .then((result)=>{
    // do something with result...
  })
```

## 1.3.0
###### _October 8, 2015_

##### Added search for specific elements
- can now search for specific _person, movie, or tv show_

## 1.2.0
###### _September 24, 2015_

