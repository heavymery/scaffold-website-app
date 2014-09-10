# Website & app scaffolding

## Features

* Built-in preview server with LiveReload
* Image Optimization
* CSS/JS Unify & Minify 
* File revisioning all HTML/CSS/JS files

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

### Server

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

## Deploy

Deploying to Github Pages. 

* GitHub.com -> `http://{user-name}.github.io/{repository-name}/`
* GitHub Enterprise -> `http://{github-domain}/pages/{user-name}/{repository-name}/`

```sh
$ git push origin :gh-pages # if push rejected
$ git subtree push --prefix dist origin gh-pages
```
