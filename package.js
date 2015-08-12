Package.describe({
  name: 'rkstar:tmdb',
  version: '1.1.2',
  // Brief, one-line summary of the package.
  summary: 'A wrapper for the TMDB (TheMovieDataBase.org) API (v3)',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rkstar/meteor-tmdb',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2')

  api.use('underscore', 'server')
  api.use('http', 'server')
  api.use('service-configuration', 'server')
  api.use('reactive-dict', 'client')

  api.addFiles('tmdb-publication.js', 'server')
  api.addFiles('tmdb-server.js', 'server')
  api.addFiles('tmdb-client.js', 'client')

  api.export("tmdbClient")
  api.export("TMDB")
})
