define(["struct", "common", "ScriptList", "FeatureList", "LookupList", "LangSysTable"], function(struct, common, ScriptList, FeatureList, LookupList, LangSysTable){
  "use strict";

  var GSUB = function(input) {
    this.scripts  = new ScriptList();
    this.features = new FeatureList();
    this.lookups  = new LookupList();

    if(!this.parse(input)) {
      input = input || {};
      input.version = input.version || 0x00010000;
      input.ScriptListOffset = 10; // scriptlist starts immediately after the GSUB header
      this.fill(input);
    }
  };

  GSUB.prototype = new struct([
      // GSUB header is four fields
      ["version",           "FIXED",  "Version of the GSUB table; initially set to 0x00010000"]
    , ["ScriptListOffset",  "OFFSET", "Offset to ScriptList table, from beginning of GSUB table"]
    , ["FeatureListOffset", "OFFSET", "Offset to FeatureList table, from beginning of GSUB table"]
    , ["LookupListOffset",  "OFFSET", "Offset to LookupList table, from beginning of GSUB table"]
      // and then the actual data
    , ["ScriptList",        "LITERAL", "the ScriptList object for this table"]
    , ["FeatureList",       "LITERAL", "the FeatureList object for this table"]
    , ["LookupList",        "LITERAL", "the LookupList object for this table"]
  ]);

  GSUB.prototype.constructor = GSUB;

  GSUB.prototype.addScript = function(options) {
    return this.scripts.addScript(options)
  };

  GSUB.prototype.addFeature = function(options) {
    return this.features.addFeature(options);
  };

  GSUB.prototype.addLookup = function(options) {
    return this.lookups.addLookup(options);
  };

  GSUB.prototype.makeLangSys = function(options) {
    return new LangSysTable(options);
  }

  GSUB.prototype.finalize = function() {
    // finalise in reverse order: first the lookup list,
    // then the feature list, then the script list.
    this.LookupList = this.lookups.finalize();
  }

  return GSUB;
});
