define(["SFNT", "formGlobals", "shimie"], function(SFNT, formGlobals) {
  "use strict";

  return {
  	build: function (options) {
	    var sfnt = new SFNT();
	    sfnt.use(["CFF ","OS/2","cmap","head","hhea","hmtx","maxp","name","post"]);
      var font = sfnt.stub;
      var globals = formGlobals(options);


      // Right. Let's start create a font by defining its tables,
      // rather than using a font design tool to do that for us.


      /**
       * Font header
       */
      font.head = new font.head({
        unitsPerEM: globals.quadSize,
        xMin: globals.xMin,
        yMin: globals.yMin,
        xMax: globals.xMax,
        yMax: globals.yMax,
        lowestRecPPEM: 8,
      });


      /**
       * Horizontal metrics header table
       */
      font.hhea = new font.hhea({
        Ascender: globals.quadSize + globals.yMin,
        Descender: -(globals.quadSize - globals.yMax),
        advanceWidthMax: globals.xMax - globals.xMin,
        xMaxExtent: globals.xMax - globals.xMin,
        numberOfHMetrics: globals.letters ? 1 + globals.letters.length : 2
      });

      /**
       * Horizontal metrics table
       */
      font.hmtx = new font.hmtx(globals, font.hhea.numberOfHMetrics);


      /**
       * Max profiles - CFF does not use these, which we indicate by
       * using a table version 0.5
       */
      font.maxp = new font.maxp({
        version: 0x00005000,
        numGlyphs: globals.letters ? 1 + globals.letters.length : 2
      });


      /**
       * The name table
       *
       * - to have a font be windows installable, we need strings 1, 2, 3, and 6.
       * - to have a font be OSX installable, we need strings 1, 2, 3, 4, 5, and 6.
       * - to have a font be webfont-usable, we just need strings 1 and 2.
       *
       * (OTS may be patched at some point to not even check the name table at
       *  all, at which point we don't have to bother generating it for webfonts)
       */
      font.name = new font.name(globals);


      /**
       * The OS/2 table
       */
      font["OS/2"] = new font["OS/2"]({
        // we use version 3, so we can pass Microsoft's "Font Validator"
        version: 0x0003,
        xAvgCharWidth: 0,
        usWeightClass: 400,
        usWidthClass: 1,
        // we only encode the letter 'A' in the latin block,
        // so we set bit 1 of a 128 bit sequence
        ulUnicodeRange1: 0x00000001,
        achVendID: globals.vendorId,
        // font selection flag: bit 6 (lsb=0) is high, to indicate 'regular font'
        fsSelection: 0x0040,
        usFirstCharIndex: globals.label ? globals.letters[0].charCodeAt(0) : globals.glyphCode,
        usLastCharIndex: globals.glyphCode,
        // vertical metrics: see http://typophile.com/node/13081 for how the hell these work.
        // (short version: they don't, it's an amazing mess)
        sTypoAscender: globals.yMax,
        sTypoDescender: globals.yMin,
        sTypoLineGap: globals.quadSize - globals.yMax + globals.yMin,
        usWinAscent: globals.quadSize + globals.yMin,
        usWinDescent: (globals.quadSize - globals.yMax),
        ulCodePageRange1: 0x00000001,
        // we have no break char, but we must point to a "not .notdef" glyphid to
        // validate as "legal font". Normally this would be the 'space' glyphid.
        usBreakChar: globals.glyphCode,
        // We have plain + ligature use, therefore the max length of
        // all contexts are simply the length of our substitution label,
        // if we have one, or otherwise zero.
        usMaxContext: globals.label !== false ? globals.label.length : 0
      });


      /**
       * The post table -- this table should not be necessary for
       * webfonts, but for now must be included for the font to be legal.
       */
      font.post = new font.post();


      /**
       * The character map for this font, using a cmap
       * format 4 subtable for our implemented glyphs.
       */
      font.cmap = new font.cmap({ version: 0 });
      font.cmap.addTable({ format: 4, letters: globals.letters });
      font.cmap.finalise();


      /**
       * The CFF table for this font. This is, ironically,
       * the actual font, rather than a million different
       * bits of metadata *about* the font and its glyphs.
       *
       * It's also the most complex bit (closely followed
       * by the GSUB table for ligature substitution), which
       * is why the CFF table isn't actually a struct, but
       * a somewhat different bytecode generator.
       */
      font["CFF "] = new font["CFF "](globals);


      /**
       * Finally, if there was a "label", we need some GSUB magic
       */
//      if(globals.label) { font.GSUB = new font.GSUB(globals); }

      // we're done.
      return sfnt;
	  }
  };

});
