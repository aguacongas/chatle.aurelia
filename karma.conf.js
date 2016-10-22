"use strict";
const path = require('path');
const project = require('./aurelia_project/aurelia.json');
const tsconfig = require('./tsconfig.json');

let testSrc = [
  { pattern: project.unitTestRunner.source, included: false },
  'test/aurelia-karma.js'
];

let output = project.platform.output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let files = [entryBundle].concat(testSrc).concat(appSrc).concat(['node_modules/jquery/dist/jquery.min.js']);
let appBundle = "wwwroot/scripts/app-bundle.js";

module.exports = function(config) {
  var configuration = {
    basePath: '',
    frameworks: [project.testFramework.id],
    files: files,
    exclude: [],
    preprocessors: {
      [project.unitTestRunner.source]: [project.transpiler.id],
      [appBundle]: ['coverage']
    },
    typescriptPreprocessor: {
      typescript: require('typescript'),
      options: tsconfig.compilerOptions
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'    }
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
