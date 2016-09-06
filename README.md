# gulp.spawn

Adds a method `spawn()` to Gulp 4 'core' that runs a list of tasks in parallel, using child processes.

```javascript
const gulp = require('gulp');

/**
 * Use the Gulp plugin system:
 */

require('gulp.use')(gulp);

/**
 * Add this method:
 */

gulp.use(require('gulp.spawn'));

/**
 * Create a bunch of tasks:
 */

['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
.forEach(task => {
  gulp.task(task, function(done) {
    console.log(`Done ${task}`);
    done();
  });
})

/**
 * Create a task that runs all nine tasks, partly in series, and partly
 * in parallel. The parallel tasks will be run in spawned child processes:
 */

gulp.task(
  'default',
  gulp.series(
    gulp.spawn('one', 'two', 'three'),
    gulp.spawn('four', 'five', 'six'),
    gulp.spawn('seven', 'eight'),
    gulp.spawn('nine'),
    function(done) {
      console.log('Done default');
      done();
    }
  )
);
```
