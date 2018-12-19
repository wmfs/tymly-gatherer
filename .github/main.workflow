workflow "Build, Test, and Publish" {
  on = "push"
  resolves = [
    "Test",
    "Publish",
  ]
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
  env = {
    PLUGINS_PATH = "./test/fixtures/plugins/*"
  }
}

action "Publish" {
  uses = "actions/npm@master"
  args = "publish --access public"
  needs = ["Test"]
  secrets = ["NPM_AUTH_TOKEN"]
}
