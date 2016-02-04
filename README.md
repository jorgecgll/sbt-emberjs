# sbt-emberjs

Precompile ember.js (v1.7) templates as part of the SBT asset pipeline.

## Usage

Add this line to your project's `plugins.sbt` file:

    addSbtPlugin("com.github.dwickern" % "sbt-emberjs" % "1.0.0")

Configure `package.json` with the [ember-template-compiler](https://github.com/toranb/ember-template-compiler) version corresponding to the ember.js version you use:

    {
      "devDependencies": {
        "ember-template-compiler": "~1.9.0"
      }
    }

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
