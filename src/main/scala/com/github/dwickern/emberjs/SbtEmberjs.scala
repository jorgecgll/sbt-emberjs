package com.github.dwickern.emberjs

import com.typesafe.sbt.jse.SbtJsTask
import sbt.Keys._
import sbt._
import spray.json.{JsString, JsObject}

object Import {
  object EmberjsKeys {
    val emberjs = TaskKey[Seq[File]]("emberjs", "Invoke the ember.js template compiler")
    val emberjsPrecompiler = TaskKey[File]("emberjs-precompiler", "Path to ember-template-compiler.js")
  }
}

object SbtEmberjs extends AutoPlugin {

  override def requires = SbtJsTask
  override def trigger = AllRequirements

  val autoImport = Import

  import com.github.dwickern.emberjs.SbtEmberjs.autoImport.EmberjsKeys._
  import com.typesafe.sbt.jse.SbtJsTask.autoImport.JsTaskKeys._
  import com.typesafe.sbt.web.SbtWeb.autoImport._

  val settings = Seq(
    includeFilter := "*.handlebars" | "*.hbs",
    sourceDirectory := sourceDirectory.value / "templates",
    unmanagedSourceDirectories := Seq(sourceDirectory.value),
    jsOptions := JsObject(
      "compiler" -> JsString(emberjsPrecompiler.value.absolutePath)
    ).toString()
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
  ) ++ SbtJsTask.addJsSourceFileTasks(emberjs)
}