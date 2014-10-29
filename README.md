# Website & app scaffolding

[Website & app scaffolding](# Website & app scaffolding) is boilerplate & tools for websites and web apps development.

Inspired by below boilerplate & tools.
* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
* [Mobile Boilerplate](https://github.com/h5bp/mobile-boilerplate)
* [Yeoman Web app generator](https://github.com/yeoman/generator-webapp)
* [Yeoman Generator Mobile](https://github.com/yeoman/generator-mobile)
* [Google Web Starter Kit](https://github.com/google/web-starter-kit)

## Features

* Ruby & Node version management (rbenv & ndenv)
* Ruby gems version management (bundler)
* Javascript package management (bower) 
* Built-in preview server with LiveReload (grunt)
* Build automation (grunt)
 * HTML minify
 * CSS/JS unify & minify 
 * Image Optimization
 * File revisioning all static files
* Sass/Compass folder structure best practices ([app/styles/sass/styleguide.md](https://github.com/heavymery/scaffold-website-app/blob/master/app/styles/sass/styleguide.md))
* KSS styleguide template (http://htanjo.github.io/kss-node-template/)
* Deployment to GitHub Pages

## Source structure

```
+- app
|   +- images
|   |
|   +- styles
|   |   +- sass
|   |   |   +- modules
|   |   |   +- partials
|   |   |   +- vendor
|   |   |   +- styleguide.md
|   |   |   |
|   |   |   +- main.scss
|   |   +- main.css
|   |
|   +- styleguide
|   +- styleguide-template
|   |
|   +- bower_components
|   +- scripts
|   |   +- vendor 
|   |   +- plugins
|   |   +- main.js
|   |
|   +- index.html 
|
+- dist
```


## Development environment

You first need to install [Node.js](http://nodejs.org/) and [Ruby](https://www.ruby-lang.org/).

### Install Ruby (by rbenv)

1. Install rbenv (https://github.com/sstephenson/rbenv#installation)
2. Install ruby-build (https://github.com/sstephenson/ruby-build#readme)
3. Install ruby (version of described in `.ruby-version`)

```sh
$ rbenv install
$ rbenv rehash # Rehash
```

### Install Bundler

[Bundler](http://bundler.io/) is powerful gem management tool.

```sh
$ gem install bundler
$ rbenv rehash # Rehash
```

### Install Node (by ndenv)

1. Install ndenv (https://github.com/riywo/ndenv#install)
2. Install node-build (https://github.com/riywo/node-build#install)
3. Install node (version of described in `.node-version`)

```sh
$ ndenv install
$ ndenv rehash # Rehash
```

### Ruby gems / Node modules / Bower packages

#### Install ruby gems

Install ruby gems described in `Gemfile`.

```sh
$ bundler install
```

#### Install local node modules

Install node modules described in `package.json`.

```sh
$ npm install
```

#### Install global node modules

##### Grunt CLI

```sh
$ npm install -g grunt-cli
$ ndenv rehash # Rehash
```

##### Bower 

```sh
npm install -g bower
$ ndenv rehash # Rehash
```

#### Install bower packages

Install bower packages described in `bower.json`.

```sh
$ bower install
```

## Grunt tasks

### Serve

Launch preview server with LiveReload.

```sh
$ grunt serve
```

### Build

Build for front-end source code.

```sh
$ grunt build
```

Launch preview server for build version.

```sh
$ grunt serve:dist
```

### Styleguide

Generate styleguide. (`app/styleguide`)

```sh
$ grunt shell:styleguide
```

## Deploy

Deploying to [Github Pages](https://pages.github.com/). 

### User or organization site

**CAUTION:** User or organization site using `master` branch for Github Page. Change the default branch to develop (or whatever).

* GitHub.com -> `http://{user-name(or organization-name)}.github.io/`
* GitHub Enterprise -> `http://{github-domain}/pages/{user-name(or organization-name)}/{user-name(or organization-name)}/`

```sh
$ git push origin :master # if push rejected
$ git subtree push --prefix dist origin master
```

### Project site

* GitHub.com -> `http://{user-name}.github.io/{repository-name}/`
* GitHub Enterprise -> `http://{github-domain}/pages/{user-name}/{repository-name}/`

```sh
$ git push origin :gh-pages # if push rejected
$ git subtree push --prefix dist origin gh-pages
```
