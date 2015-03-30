name := "sample"

version := "1.0-SNAPSHOT"

scalaVersion := "2.11.1"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

//JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

//sourceDirectory in EmberjsKeys.emberjs in Assets := (sourceDirectory in Assets).value / "my-templates"

EmberjsKeys.emberjsPrecompiler := baseDirectory.value / "public" / "javascripts" / "ember-template-compiler.js"

UglifyKeys.uglifyOps := { js =>
  Seq((js.sortBy(_._2), "main.min.js"))
}

pipelineStages in Assets := Seq(uglify)