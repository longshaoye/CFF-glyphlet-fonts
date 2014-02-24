define(["../../struct", "./common"], function(Table, common){
  "use strict";

  var GDEF = function(input) {
    if(!this.parse(input)) {
      input = input || {};
      this.fill(input);
    }
  };

  GDEF.prototype = new common();
  GDEF.prototype.constructor = GDEF;

  return GDEF;
});