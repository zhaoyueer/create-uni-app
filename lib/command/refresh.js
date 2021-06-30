const path = require('path');
const fs = require('fs-extra');
const handlebars = require('handlebars');
const { sucLog } = require('../utils/utils');

const cwd = process.cwd();

module.exports = async () => {
  // 获取列表
  const list = fs
    .readdirSync('./src/pages')
    .filter((v) => v !== 'home')
    .map((v) => ({
      name: v,
    }));

  compile(
    { list },
    './src/pages.json',
    path.join(cwd, './src/template/pages.json.hbs'),
  );

  /**
   * 模版编译
   * @param {*} meta 数据
   * @param {*} filePath 目标文件
   * @param {*} templatePath 模版
   */
  function compile(meta, filePath, templatePath) {
    if (fs.existsSync(templatePath)) {
      const content = fs.readFileSync(templatePath).toString();
      const result = handlebars.compile(content)(meta);
      fs.writeFileSync(filePath, result);
      sucLog(`🚀${filePath} 创建成功`);
    }
  }
};
