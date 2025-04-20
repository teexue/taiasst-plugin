const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { execSync } = require("child_process");

// 处理命令行参数
const args = process.argv.slice(2);
const backendOnly = args.includes("--backend-only");
const packageOnly = args.includes("--package-only");
const forceBackend = args.includes("--force-backend");

// 获取项目根目录路径
const rootDir = path.resolve(__dirname, "..");

// 读取metadata.json获取插件信息
function readMetadata() {
  const metadataPath = path.join(rootDir, "metadata.json");
  if (!fs.existsSync(metadataPath)) {
    console.error("错误: metadata.json不存在");
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  } catch (error) {
    console.error("读取metadata.json失败:", error);
    process.exit(1);
  }
}

// 构建插件后端
async function buildBackend() {
  console.log("开始构建插件后端...");

  // 确定输出扩展名
  const ext =
    process.platform === "win32"
      ? "dll"
      : process.platform === "darwin"
      ? "dylib"
      : "so";

  // 构建Rust后端库
  const backendDir = path.join(rootDir, "plugin-backend");
  if (fs.existsSync(backendDir)) {
    console.log("构建插件后端库...");

    try {
      execSync("cargo build --release", {
        cwd: backendDir,
        stdio: "inherit",
      });
    } catch (error) {
      console.error("插件后端构建失败:", error);
      process.exit(1);
    }

    // 创建dist目录
    const distDir = path.join(rootDir, "dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // 从Cargo.toml获取库名称
    const cargoTomlPath = path.join(backendDir, "Cargo.toml");
    const cargoToml = fs.readFileSync(cargoTomlPath, "utf-8");

    // 尝试查找库名称，默认为"plugin_backend"
    let libName = "plugin_backend";
    const libSection = cargoToml.indexOf("[lib]");
    if (libSection !== -1) {
      const nameLine = cargoToml.substring(libSection).indexOf("name =");
      if (nameLine !== -1) {
        const line = cargoToml.substring(libSection + nameLine);
        const quote1 = line.indexOf('"');
        if (quote1 !== -1) {
          const quote2 = line.substring(quote1 + 1).indexOf('"');
          if (quote2 !== -1) {
            libName = line.substring(quote1 + 1, quote1 + 1 + quote2);
            console.log(`从Cargo.toml中提取到库名称: ${libName}`);
          }
        }
      }
    }

    // 复制构建好的库文件
    let srcPath, destPath;
    if (process.platform === "win32") {
      // Windows平台
      const name = `${libName}.${ext}`;
      srcPath = path.join(backendDir, "target/release", name);
      destPath = path.join(distDir, "plugin.dll");
    } else if (process.platform === "darwin") {
      // macOS平台
      const name = `lib${libName}.${ext}`;
      srcPath = path.join(backendDir, "target/release", name);
      destPath = path.join(distDir, "plugin.dylib");
    } else {
      // Linux平台
      const name = `lib${libName}.${ext}`;
      srcPath = path.join(backendDir, "target/release", name);
      destPath = path.join(distDir, "plugin.so");
    }

    console.log(`查找库文件: ${srcPath}`);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`插件后端库已复制到 ${destPath}`);
    } else {
      console.log(`警告：找不到插件库文件 ${srcPath}`);
      console.log("请确保在plugin-backend/Cargo.toml中设置了正确的lib.name");
    }
  } else {
    console.log("plugin-backend目录不存在，跳过后端构建");
  }
}

// 创建插件包
async function createPluginPackage() {
  console.log("开始打包插件...");

  // 检查dist目录
  const distDir = path.join(rootDir, "dist");
  if (!fs.existsSync(distDir)) {
    console.error("错误: dist目录不存在，请先构建插件");
    process.exit(1);
  }

  // 创建输出目录
  const outputDir = path.join(rootDir, "packages");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 读取package.json获取基本信息
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(rootDir, "package.json"), "utf-8")
  );
  const { name } = packageJson;

  // 读取插件信息
  const pluginInfo = readMetadata();
  console.log("成功读取插件信息:", pluginInfo.name);

  // 创建zip文件
  const outputPath = path.join(
    outputDir,
    `${pluginInfo.id || name}-v${pluginInfo.version}.zip`
  );
  const output = fs.createWriteStream(outputPath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // 最高压缩级别
  });

  // 监听错误
  archive.on("error", (err) => {
    throw err;
  });

  // 管道输出
  archive.pipe(output);

  // 添加文件
  archive.file(path.join(distDir, "plugin.js"), {
    name: `${pluginInfo.id || name}/plugin.js`,
  });
  archive.file(path.join(rootDir, "metadata.json"), {
    name: `${pluginInfo.id || name}/metadata.json`,
  });

  // 添加后端库文件（如果存在）
  const backendFiles = fs
    .readdirSync(distDir)
    .filter(
      (file) =>
        file.startsWith("plugin") &&
        (file.endsWith(".so") ||
          file.endsWith(".dll") ||
          file.endsWith(".dylib"))
    );

  backendFiles.forEach((file) => {
    archive.file(path.join(distDir, file), {
      name: `${pluginInfo.id || name}/${file}`,
    });
  });

  // 完成打包
  await archive.finalize();

  console.log(`插件打包完成: ${outputPath}`);
}

// 主函数：根据命令行参数决定执行什么操作
async function main() {
  try {
    // 读取metadata.json
    const metadata = readMetadata();
    const needsBackend = metadata.has_backend || forceBackend;

    if (backendOnly) {
      // 只构建后端
      if (needsBackend) {
        await buildBackend();
        console.log("后端构建完成！");
      } else {
        console.log("插件不包含后端，跳过后端构建");
      }
    } else if (packageOnly) {
      // 只打包
      await createPluginPackage();
      console.log("打包完成！");
    } else {
      // 执行完整构建流程
      if (needsBackend) {
        await buildBackend();
      } else {
        console.log("插件不包含后端，跳过后端构建");
      }
      await createPluginPackage();
      console.log("构建和打包过程已完成！");
    }
  } catch (error) {
    console.error("操作失败:", error);
    process.exit(1);
  }
}

// 执行主函数
main();
