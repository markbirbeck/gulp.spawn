'use strict';
const spawn = require('child_process').spawn;

let flatten = (a) => Array.isArray(a) ? [].concat(...a.map(flatten)) : a;

let register = (gulp) => {

  /**
   * Create a bunch of parallel tasks that each spawn a child gulp process
   * that runs the desired task:
   */

  gulp.spawn = function(options, ...taskList) {

    /**
     * If the first parameter is not a set of options for fork then
     * it's a task so push it onto the task list:
     */

    if (typeof options !== 'object') {
      taskList.unshift(options);
      options = {};
    }

    taskList = flatten(taskList);

    /**
     * Default behaviour is to pass any output from the spawned task to this
     * caller:
     */

    options.stdio = options.stdio || 'inherit';

    /**
     * If there is only one task then there's no point in spawning:
     */

    let childList = [];

    if (taskList.length === 1) {
      childList.push(taskList[0]);
    } else {
      taskList.forEach(task => {

        /**
         * If the task is a function then we can't spawn it:
         */

        if (typeof task === 'function') {
          childList.push(task);
        } else {

          /**
           * Create a function that invokes a child process that does
           * exactly the same as the task we're trying to run:
           */

          let fn = () => spawn('gulp', [ task, '--log-level=LL' ], options);

          /**
           * Give the function the name of our task, for Gulp logging:
           */

          fn.displayName = task;

          /**
           * Save the function to our list, ready to give to gulp.parallel():
           */

          childList.push(fn);
        }
      });
    }

    /**
     * Return the parallel list of wrapped tasks:
     *
     * NOTE: We're using the saved copy of parallel(), just in case some
     *       other plugin has overridden it:
     */

    return this._parallel(...childList);
  };
};

module.exports = register;
