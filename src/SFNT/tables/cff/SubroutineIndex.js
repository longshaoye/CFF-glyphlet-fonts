define(["struct", "INDEX"], function(struct, INDEX) {
  "use strict";

  var SubroutineIndex = function(input) {
    INDEX.call(this, input);
    this.setName("SubroutineIndex");
  };

  SubroutineIndex.prototype = Object.create(INDEX.prototype);

  return SubroutineIndex;
});
