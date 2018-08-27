// @ts-check
const fs = require("fs");
const path = require("path");
const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const rimraf = require('rimraf');


const { ttfEot, ttfWoff, svgTtf } = require('./ttf2eot');

const { readSrcPathSync, string2unicodes } = require('../utils');

// 根据svg生成其他字体
function createOtherFont(fonts_root, fontname) {
  debugger;
  const icon_svg_font = path.resolve(fonts_root, `${fontname}.svg`);
  const icon_ttf_font = path.resolve(fonts_root, `${fontname}.ttf`);
  const icon_woff_font = path.resolve(fonts_root, `${fontname}.woff`);
  const icon_eot_font = path.resolve(fonts_root, `${fontname}.eot`);
  svgTtf(icon_svg_font, icon_ttf_font);
  ttfWoff(icon_ttf_font, icon_woff_font);
  ttfEot(icon_ttf_font, icon_eot_font);
}

/**
 * 生成SVG字体
 */
function svgFont(fonts_root, fontname, icon_dir, cssIconHtml, unicode_html, cssString) {
  const icon_svg_font = path.resolve(fonts_root, `${fontname}.svg`)
  if(!fs.existsSync(path.dirname(icon_svg_font))){
    fs.mkdirSync(path.dirname(icon_svg_font));
  }
  const fontStream = new SVGIcons2SVGFontStream({
    fontName: fontname,
    normalize: true,
    fontHeight: 1000,
  });
  fontStream.pipe(fs.createWriteStream(icon_svg_font))
    .on('finish', function () {
      createOtherFont(fonts_root, fontname)
    })
    .on('error', function (err) {
      console.log(err);
    });
  
  let startUnicode = 0xEA01;
  readSrcPathSync(icon_dir).forEach((item, idx) => {
    let glyph = fs.createReadStream(item);
    let name = path.basename(item, path.extname(item));
    let unicode = String.fromCharCode(startUnicode++);
    glyph.metadata = {
      name: name,
      unicode: [unicode]
    }
    cssString.push(`.change-icon-${name}:before { content: "${'\\'}${unicode[0].charCodeAt(0).toString(16)}";}\n`);
    cssIconHtml.push(`<li class="class-icon"><i class="change-icon-${name}"></i><p class="name">${name}</p></li>`)
    unicode_html.push(`<li class="unicode-icon"><span class="iconfont">&#${string2unicodes(unicode).join('')};</span><h4>${name}</h4><span class="unicode">&amp;#${string2unicodes(unicode).join('')};</span></li>`)
    fontStream.write(glyph)
  });
  fontStream.end()
}

/**
 * 清理字体文件目录
 */
function cleanFont(fonts_root){
  rimraf.sync(fonts_root);
}

module.exports = {
  svgFont,
  cleanFont
};




