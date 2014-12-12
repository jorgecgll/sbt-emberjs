package com.github.dwickern.emberjs

import com.typesafe.sbt.jse.SbtJsTask
import sbt.Keys._
import sbt._

object Import {
  object EmberjsKeys {
    val emberjs = TaskKey[Seq[File]]("emberjs", "Invoke the ember.js template compiler")
  }
}

object SbtEmberjs extends AutoPlugin {

  override def requires = SbtJsTask
  override def trigger = AllRequirements

  val autoImport = Import

  import com.github.dwickern.emberjs.SbtEmberjs.autoImport.EmberjsKeys._
  import com.typesafe.sbt.jse.SbtJsTask.autoImport.JsTaskKeys._
  import com.typesafe.sbt.web.Import.WebKeys._
  import com.typesafe.sbt.jse.JsEngineImport.JsEngineKeys._
  import com.typesafe.sbt.web.SbtWeb.autoImport._

  val settings = Seq(
    includeFilter := "*.handlebars" | "*.hbs",
    sourceDirectory := sourceDirectory.value / "templates",
    unmanagedSourceDirectories := Seq(sourceDirectory.value)
  )

  override def projectSettings = inTask(emberjs)(
    SbtJsTask.jsTaskSpecificUnscopedSettings ++
    inConfig(Assets)(settings) ++
    inConfig(TestAssets)(settings) ++
    Seq(
      moduleName := "emberjs",
      shellFile := getClass.getClassLoader.getResource("emberjs-shell.js"),
      taskMessage in Assets := "Ember.js templates compiling",
      taskMessage in TestAssets := "Ember.js templates test compiling"
    )
  ) ++ SbtJsTask.addJsSourceFileTasks(emberjs) ++ Seq(
    emberjs in Assets := (emberjs in Assets).dependsOn(nodeModules in Assets).value,
    emberjs in TestAssets := (emberjs in TestAssets).dependsOn(nodeModules in TestAssets).value,

    // the specific version of `ember-template-compiler` is provided by the application via npm
    nodeModuleGenerators in Plugin <+= npmNodeModules in Assets,
    nodeModuleDirectories in Plugin += baseDirectory.value / "node_modules"
  )
}