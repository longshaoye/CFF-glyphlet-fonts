define(["struct"], function(struct){
  "use strict";

  var format13 = function(input) {
    if(!this.parse(input)) {
      input = input || {};
      input.format = 13;
      this.fill(input);
    }
  };

  format13.prototype = new struct([
    ["format", "USHORT", "subtable format"]
  ]);

  format13.prototype.constructor = format13;

  return format13;
});
