# grunt-feature [![build status](https://secure.travis-ci.org/indieisaconcept/grunt-feature.png)](http://travis-ci.org/indieisaconcept/grunt-feature)

> A grunt task which can be used to generate feature configuration files to support code being released early and often and to synchronise features between JavaScript & CSS.

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-feature --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-feature');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "feature" task

```grunt-feature``` will generate a configuration file which can be consumed by other tasks.

For example if you are using require.js with has.js, The task can be used to control which features are to be included as part of an r.js optimizer build.

Equally a configuration file can be generated to introduce feature toggling as part of a CSS pre-processor build.

The real power is when you combine the two. If you no-longer need a feature, or a feature is to be only used by a subset of sites the task can be used to omit both the JavaScript and CSS for a given feature.

### Defining a feature

Features are managed via `json` configuration files which are used to describe what a feature does and more importantly whether it should be enabled.

If multiple configuration files are passed, these are deeply merged together with the resulting conguration file a combination of all options, either added or overriden.

When managing multiple web-sites which share a common code base and build process, this provides scope to turn off common features and manage those which are localised.

When defining features the resulting generated file will be namespaced based upon the source json object processed.

#### feature.json


```
{
	"feature-1": true,
	"feature-2": false,

	"feature-3": {

		"description": "Vehicula Euismod Cras Ornare Fringilla",
		"value": true

	},

	"feature-4": {

		"a": true,
		"b": false,

		"c": {

			"description": "Vehicula Euismod Cras Ornare Fringilla",
			"value": true,

			"children": {

				"a": false

			}

		}

	}

}

```

> Defining a feature in feature.json

#### _feature.scss

```
$feature-1: true !default
$feature-2: false !default
$feature-3: true !default // Vehicula Euismod Cras Ornare Fringilla
$feature-4-a: true !default
$feature-4-b: false !default
$feature-4-c: true !default // Vehicula Euismod Cras Ornare Fringilla
$feature-4-c-d: false !default

```


### Templates

Handlebar templates can be used to control what the output should look like for a generated configuration file.

```
{{#features}}
	${{name}}: {{value}} !default; //{{description}}
{{/features}
```
> SCSS template example

The default template to use will be automatically determined based upon the destination file extension unless an override is explicitly provided as an option. In addition to this a template path can also be specified should the need arise to define one.

```grunt-feature``` comes bundled with templates for JavaScript, JSON and SCSS/Less by default.

### Overview
In your project's Gruntfile, add a section named `feature` to the data object passed into
`grunt.initConfig()`.

```
grunt.initConfig({

  feature: {

    options: {

      // global options

      toggles: {
      		// some global toggles
      }

    },

    your_target: {

    	options: {

    		// task options,

    		toggles: {

    			// some target toggles

    		}

    	},

	    files: {
	        'some/path/to/config.scss': ['framework/config.json', 'site/config.json']
			'some/path/to/config.json': ['framework/config.json', 'site/config.json']
	    }

    }

  }

})
```

## Release History

- 21/10/2013 0.1.0 | Intial release
