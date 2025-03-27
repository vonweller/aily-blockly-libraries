const fs = require('fs').promises;
const path = require('path');

// 默认要提取的package.json中的键
const defaultKeysToExtract = [
  'name',
  'nickname',
  'version',
  'description',
  'author',
  'compatibility',
  'keywords'
];

// 根据配置过滤package.json对象
function filterPackageJson(packageJson, keysToExtract) {
  const filteredJson = {};

  keysToExtract.forEach(key => {
    if (packageJson.hasOwnProperty(key)) {
      filteredJson[key] = packageJson[key];
    } else {
      filteredJson[key] = "";
    }
  });

  return filteredJson;
}

async function main() {
  try {
    // 获取当前目录路径
    const currentDir = __dirname;

    // 设置要提取的键，可以根据需要修改这个数组
    // 如果要提取所有键，可以设置为null
    const keysToExtract = defaultKeysToExtract;

    // 读取当前目录下的所有项
    const dirents = await fs.readdir(currentDir, { withFileTypes: true });

    // 过滤出子目录
    const subdirs = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // 存储普通库的内容
    const normalLibraries = [];
    // 存储以"core-"开头的库的内容
    const coreLibraries = [];

    // 处理每个子目录
    for (const subdir of subdirs) {
      const packageJsonPath = path.join(currentDir, subdir, 'package.json');

      try {
        // 检查并读取package.json
        await fs.access(packageJsonPath, fs.constants.F_OK);
        const data = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(data);

        // 根据配置过滤package.json
        const filteredJson = keysToExtract ? filterPackageJson(packageJson, keysToExtract) : packageJson;

        // 判断是否是"core-"开头的目录，分别放入不同数组
        if (subdir.startsWith('core-')) {
          coreLibraries.push(filteredJson);
          console.log(`成功读取 ${subdir}/package.json (core)`);
        } else {
          normalLibraries.push(filteredJson);
          console.log(`成功读取 ${subdir}/package.json`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`${subdir}目录下没有找到package.json`);
        } else {
          console.error(`处理${packageJsonPath}时出错:`, error);
        }
      }
    }

    // 合并两个数组，普通库在前，"core-"开头的库在后
    const libraries = [...normalLibraries, ...coreLibraries];

    // 写入结果到libraries.json
    const librariesJson = JSON.stringify(libraries, null, 2);
    const outputPath = path.join(currentDir, 'libraries.json');
    await fs.writeFile(outputPath, librariesJson, 'utf8');

    console.log(`成功将${libraries.length}个库的信息写入到${outputPath}（其中普通库${normalLibraries.length}个，核心库${coreLibraries.length}个）`);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

// 执行主函数
main();