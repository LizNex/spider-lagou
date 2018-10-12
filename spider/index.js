const request = require("./request/index");
const async = require("async");
const fs = require("fs");

let IdList = [];
let dataTempList = [];
let num = 1;
let fileCount = 1;
let infoLimit = 15;
let totalPage = 270;
let ok = 1;
let pathData = "./public/data";

module.exports = async function start() {
  console.log("开始爬取数据");

//   totalPage = await request.getTotalPage();
  console.log(`总页数为：${totalPage}`);
  pageList = Array.from({ length: totalPage }, (v, k) => k + 1);

  async.series(
    [
      callback => {
        delData();
        callback(null, "success");
      },
      callback => {
        //获得所有ID
        getIdList(callback);
      },
      callback => {
        //获得所有详情数据
        getDetail(callback);
      }
    ],
    (err, res) => {
      if (err) throw err;
    }
  );
};

function getIdList(callback) {
  async.mapLimit(
    pageList,
    3,
    async (pn, cb) => {
      let list = await request.getList({ pn });
      let result = list.content.positionResult.result;
      for (item of result) {
        IdList.push(item.positionId);
      }

      console.log(`正在获取第${pn }页ID`);
      cb(null, "sucess");
    },
    (err, res) => {
      console.log("ID列表获取完成");
      callback(null, ok);
    }
  );
}

function getDetail(callback) {
  async.mapLimit(
    IdList,
    3,
    async (id, cb) => {
      num++;
      let data = await request.getDetail(id);

      dataTempList.push(data);

      if (num >= infoLimit * fileCount) {
        fs.writeFile(
          `./public/data/point-${num - infoLimit}-${num}.json`,
          JSON.stringify(dataTempList),
          err => {
            if (err) throw err;
            fileCount++;
            dataTempList = [];
            cb(null, "success");
          }
        );
      } else {
        console.log(`正在写入第${num}条`);
        cb(null, "success");
      }
    },
    (err, res) => {
      mergeJson();
      console.log("详情获取完成");

      callback(null, ok);
    }
  );
}

function delData() {
  if (fs.existsSync(pathData)) {
    files = fs.readdirSync(pathData);
    files.forEach(function(file, index) {
      var curPath = pathData + "/" + file;
      console.log("删除文件", file);
      fs.unlinkSync(curPath, function(err) {
        if (err) throw err;
      });
    });
  } else {
    fs.mkdirSync("./public/data");
  }
}

function mergeJson() {
  let tempFile = [];
  files = fs.readdirSync(pathData);
  files.forEach(function(file, index) {
    let curPath = pathData + "/" + file;
    let fileInfo = JSON.parse(fs.readFileSync(curPath, "utf8"));

    tempFile = tempFile.concat(fileInfo);
  });

  fs.writeFileSync(`${pathData}/point.json`, JSON.stringify(tempFile));
}
function createIDList(){
    fs.writeFileSync(`${pathData}/IdList.json`,JSON.stringify(IdList))

}