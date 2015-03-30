# sbt-emberjs

Precompile ember.js templates as part of the SBT asset pipeline.

This plugin is compatible with ember.js 1.10 and later, since the introduction of HTMLBars. For ember.js versions 1.9 and older, use [version 1.0](https://github.com/dwickern/sbt-emberjs/tree/1.0) of this plugin.

## Usage

Add this line to your project's `plugins.sbt` file:

    addSbtPlugin("com.github.dwickern" % "sbt-emberjs" % "2.0.0")

Configure your `build.sbt` with the path to `ember-template-compiler.js` in your ember.js distribution:

    EmberjsKeys.emberjsPrecompiler := baseDirectory.value / "js" / "ember-template-compiler.js"

Once configured, any `*.handlebars` or `*.hbs` files placed in `app/assets/templates` will be compiled to JavaScript code in `target/web/public`.

The relative path is used as the template name, for example `app/assets/templates/navigation/header.handlebars` will be compiled to a template named `navigation/header`.

To change the directory where templates are located:

    sourceDirectory in EmberjsKeys.emberjs in Assets := (sourceDirectory in Assets).value / "my-templates"

## License

Copyright 2014 Derek Wickern

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
