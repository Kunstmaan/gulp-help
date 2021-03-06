var gulpHelp = require('./index.js'),
  noop = require('./lib/noop'),
/* jshint unused: true */
  should = require('should'),
/* jshint unused: false */
  sinon = require('sinon');

/* jshint expr: true */
describe('help', function () {

  var gulp, originalTaskFn;

  beforeEach(function () {
    gulp = null;
    originalTaskFn = null;
  });

  it('should have help task with help text', function () {
    gulp = sinon.stub({task: noop, tasks: {help: {}}});
    originalTaskFn = gulp.task;
    gulpHelp(gulp);
    should(originalTaskFn.calledTwice).ok;
    should(originalTaskFn.calledWith('default', ['help'])).ok;
    should(gulp.tasks.help.help.message).eql('Display this help text.');
  });

  it('should have a custom help text if passed', function () {
    gulp = sinon.stub({task: noop, tasks: {help: {}}});
    gulpHelp(gulp, {description: 'help text.'});
    should(gulp.tasks.help.help.message).eql('help text.');
  });

  it('should create an alias if passed', function () {
    gulp = sinon.stub({task: noop, tasks: {help: {}}});
    originalTaskFn = gulp.task;
    gulpHelp(gulp, {aliases: ['h', '?']});
    should(gulp.tasks.help.help.message).eql('Display this help text.');
    should(gulp.tasks.help.help.aliases).eql('Aliases: h, ?');
    should(originalTaskFn.calledWith('h', ['help'])).ok;
    should(originalTaskFn.calledWith('?', ['help'])).ok;
  });

  it('should create an options object if passed', function () {
    gulp = sinon.stub({task: noop, tasks: {help: {}}});
    originalTaskFn = gulp.task;
    gulpHelp(gulp, {aliases: ['h', '?'], options: {opt: 'val'}});
    should(gulp.tasks.help.help.options).eql({opt: 'val'});
    should(originalTaskFn.calledWith('h', ['help'])).ok;
    should(originalTaskFn.calledWith('?', ['help'])).ok;
  });

  describe('should support old task definitions', function () {

    beforeEach(function () {
      gulp = sinon.stub({task: noop, tasks: {help: {}, oldStyle: {}}});
      originalTaskFn = gulp.task;
      gulpHelp(gulp);
      should(originalTaskFn.calledTwice).ok;
    });

    it('with nothing', function () {
      gulp.task('oldStyle');
      should(originalTaskFn.calledThrice).ok;
      should(originalTaskFn.calledWith('oldStyle')).ok;
      should(gulp.tasks.oldStyle.help).ok;
      should(gulp.tasks.oldStyle.help.message).eql('');
    });

    it('with nothing null', function () {
      gulp.task('oldStyle', null);
      should(originalTaskFn.calledThrice).ok;
      should(originalTaskFn.calledWith('oldStyle')).ok;
      should(gulp.tasks.oldStyle.help).ok;
      should(gulp.tasks.oldStyle.help.message).eql('');
      should(gulp.tasks.oldStyle.help.depsMessage).eql('');
    });

    it('with func', function () {
      gulp.task('oldStyle', noop);
      should(originalTaskFn.calledThrice).ok;
      should(originalTaskFn.calledWith('oldStyle', noop)).ok;
      should(gulp.tasks.oldStyle.help).ok;
      should(gulp.tasks.oldStyle.help.message).eql('');
      should(gulp.tasks.oldStyle.help.depsMessage).eql('');
    });

    it('with deps and func', function () {
      gulp.task('oldStyle', ['dep'], noop);
      should(originalTaskFn.calledThrice).ok;
      should(originalTaskFn.calledWith('oldStyle', ['dep'], noop)).ok;
      should(gulp.tasks.oldStyle.help).ok;
      should(gulp.tasks.oldStyle.help.message).eql('');
      should(gulp.tasks.oldStyle.help.depsMessage).eql('[dep]');
    });

    it('with deps and no func', function () {
      gulp.task('oldStyle', ['dep']);
      should(originalTaskFn.calledThrice).ok;
      should(originalTaskFn.calledWith('oldStyle', ['dep'])).ok;
      should(gulp.tasks.oldStyle.help).ok;
      should(gulp.tasks.oldStyle.help.message).eql('');
      should(gulp.tasks.oldStyle.help.depsMessage).eql('[dep]');
    });

  });

  describe('should support new task definitions', function () {

    beforeEach(function () {
      gulp = sinon.stub({task: noop, tasks: {help: {}, newStyle: {}}});
      originalTaskFn = gulp.task;
      gulpHelp(gulp);
      should(originalTaskFn.calledTwice).ok;
    });

    it('with help text and no nothing', function () {
      gulp.task('newStyle', 'help text here');
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle')).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('help text here');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with help text and no deps', function () {
      gulp.task('newStyle', 'help text here', noop);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('help text here');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with help text and deps', function () {
      gulp.task('newStyle', 'help text here', ['dep'], noop);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('help text here');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with help text', function () {
      gulp.task('newStyle', true);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle')).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with help text null', function () {
      gulp.task('newStyle', null);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle')).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with disabled help text and no deps', function () {
      gulp.task('newStyle', false, noop);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with disabled help text and deps', function () {
      gulp.task('newStyle', false, ['dep'], noop);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with aliases', function () {
      gulp.task('newStyle', 'description.', ['dep'], noop, {aliases: ['new-style', 'nstyle']});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with aliases no help', function () {
      gulp.task('newStyle', ['dep'], noop, {aliases: ['new-style', 'nstyle']});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with aliases no deps', function () {
      gulp.task('newStyle', 'description.', noop, {aliases: ['new-style', 'nstyle']});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with aliases, disabled help and no deps', function () {
      gulp.task('newStyle', false, noop, {aliases: ['new-style', 'nstyle']});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with aliases no help no deps', function () {
      gulp.task('newStyle', noop, {aliases: ['new-style', 'nstyle']});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with options', function () {
      gulp.task('newStyle', 'description.', ['dep'], noop, {options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with options no help', function () {
      gulp.task('newStyle', ['dep'], noop, {options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with options no deps', function () {
      gulp.task('newStyle', 'description.', noop, {options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with options, disabled help and no deps', function () {
      gulp.task('newStyle', false, noop, {options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with options, no help no deps', function () {
      gulp.task('newStyle', noop, {options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with options and aliases', function () {
      gulp.task('newStyle', 'description.', ['dep'], noop, {
        aliases: ['new-style', 'nstyle'],
        options: {key: 'val', key2: 'val2'}
      });
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with options and aliases no help', function () {
      gulp.task('newStyle', ['dep'], noop, {
        aliases: ['new-style', 'nstyle'],
        options: {key: 'val', key2: 'val2'}
      });
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', ['dep'], noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep]');
    });

    it('with options and aliases no deps', function () {
      gulp.task('newStyle', 'description.', noop, {
        aliases: ['new-style', 'nstyle'],
        options: {key: 'val', key2: 'val2'}
      });
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('description.');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('with options and aliases, disabled help and no deps', function () {
      gulp.task('newStyle', false, noop, {aliases: ['new-style', 'nstyle'], options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with options and aliases, no help no deps', function () {
      gulp.task('newStyle', noop, {aliases: ['new-style', 'nstyle'], options: {key: 'val', key2: 'val2'}});
      should(originalTaskFn.callCount).eql(5);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(originalTaskFn.calledWith('new-style', ['newStyle'], noop)).ok;
      should(originalTaskFn.calledWith('nstyle', ['newStyle'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.options).eql({key: 'val', key2: 'val2'});
      should(gulp.tasks.newStyle.help.message).eql('');
      should(gulp.tasks.newStyle.help.aliases).eql('Aliases: new-style, nstyle');
      should(gulp.tasks.newStyle.help.depsMessage).eql('');
    });

    it('and replace help message of a task being rewritten', function () {
      gulp.task('newStyle', noop);
      gulp.task('newStyle', false, noop);
      should(originalTaskFn.callCount).eql(4);
      should(originalTaskFn.calledWith('newStyle', noop)).ok;
      should(gulp.tasks.newStyle.help).eql(undefined);
    });

    it('with two deps', function () {
      gulp.task('newStyle', 'help text here', ['dep', 'dep-2'], noop);
      should(originalTaskFn.callCount).eql(3);
      should(originalTaskFn.calledWith('newStyle', ['dep', 'dep-2'], noop)).ok;
      should(gulp.tasks.newStyle.help).ok;
      should(gulp.tasks.newStyle.help.depsMessage).eql('[dep, dep-2]');
    });

  });

  describe('should throw error', function () {

    function shouldThrowGulpPluginError(func) {
      (function () {
        func();
      }).should.throw(/^gulp-help: Unexpected arg types/);
    }

    beforeEach(function () {
      gulp = sinon.stub({task: noop, tasks: {help: {}, aTask: {}}});
      originalTaskFn = gulp.task;
      gulpHelp(gulp);
      should(originalTaskFn.calledTwice).ok;
    });

    it('with no args given', function () {
      shouldThrowGulpPluginError(function () {
        gulp.task();
      });
    });

    it('null name', function () {
      shouldThrowGulpPluginError(function () {
        gulp.task(null);
      });
    });

  });

});
