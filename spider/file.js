  const fs = require("fs");

  function delData(pathData) {
    if (fs.existsSync(pathData)) {
      files = fs.readdirSync(pathData);
      files.forEach(function (file, index) {
        var curPath = pathData + "/" + file;
        console.log("删除文件", file);
        fs.unlinkSync(curPath, function (err) {
          if (err) throw err;
        });
      });
    } else {
      fs.mkdirSync("./public/data");
    }
  }

  function mergeJson(pathData) {
    let tempFile = [];
    files = fs.readdirSync(pathData);
    files.forEach(function (file, index) {
      let curPath = pathData + "/" + file;
      let fileInfo = JSON.parse(fs.readFileSync(curPath, "utf8"));

      tempFile = tempFile.concat(fileInfo);
    });

    fs.writeFileSync(`${pathData}/point.json`, JSON.stringify(tempFile));
  }

  function createIDList() {
    fs.writeFileSync(`${pathData}/IdList.json`, JSON.stringify(IdList))

  }

  function writeData(size) {
    let num=0
    size = size || 15

    return function (data) {
      num+=data.length
      let t=num
      let b=num-size+1
      let fileName=`point-${b}-${t}.json`

      fs.writeFileSync(
        `./public/data/${fileName}`,
       JSON.stringify(data)
      );
      console.log(`${fileName}保存完毕`)
    }

  }

  module.exports = {
    delData,
    mergeJson,
    writeData
  }