const path = require("path");
const copy = require("copy-template-dir");
const chalk = require("chalk");
const _ = require("lodash");

const { svgFont, cleanFont } = require("./svg2font/index.js");
const func = function(inputdir, outputdir, fontname) {
  const project_root = process.cwd();
  const fonts_root = path.resolve(project_root, outputdir);
  const icon_dir = path.resolve(project_root, inputdir);
  const script_root = path.resolve(__dirname);
  const font_temp = path.resolve(script_root, "template");

  let unicode_html = [];
  let logohtml = "";
  let cssIconHtml = [];
  let cssString = [];

  cleanFont(fonts_root); //先清理下输入路径下的内容
  svgFont(fonts_root, fontname, icon_dir, cssIconHtml, unicode_html, cssString);
  copy(
    font_temp,
    fonts_root,
    {
      fontname: fontname,
      unicode: unicode_html.join(""),
      svg_content: "",
      logosvg: logohtml,
      timestamp: new Date().getTime(),
      cssString: cssString.join(""),
      cssIconHtml: cssIconHtml.join("")
    },
    (err, createdFiles) => {
      if (err) throw err;
      createdFiles.forEach(filePath => console.log(`Created ${filePath} `));
      console.log(
        chalk.green("copy svg icon done!" + "\n" + "thank you for use~")
      );
    }
  );
};

module.exports = func;
