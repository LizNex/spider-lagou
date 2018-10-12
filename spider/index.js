  const request = require("./request/index");
  const async = require("async");
  const fs = require("fs");


  let IdList = [];
  let dataTempList = [];
  let num = 0;
  let ok = 1;
  let pageList = Array.from({ length: 1 }, (v, k) => k);



  module.exports = async function start() {
    let totalPage = await request.getTotalPage();
    //   let pageList = Array.from({ length: totalPage }, (v, k) => k);

    async.series(
      [
        callback => {
          //获得所有ID
          getIdList(callback)

        },
        callback => {
          //获得所有详情数据
          getDetail(callback)
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
      2,
      async (pn, cb) => {
          let list = await request.getList({ pn });
          let result = list.content.positionResult.result;
          for (item of result) {
            IdList.push(item.positionId);
          }
          setTimeout(() => {
            console.log(`正在获取第${pn}页ID`);
            cb(null, "sucess");
          }, 3000);
        },
        (err, res) => {
          console.log("IdList获取完成");
          callback(null, ok);
        }
    );
  }

  function getDetail(callback) {
    async.mapLimit(
      IdList,
      1,
      async (id, cb) => {
          ++num;
          console.log(`准备写入第${num}条数据`);
          let data = await request.getDetail(id);

          if (!fs.existsSync("./data")) {
            fs.mkdirSync("./data");
          }

          dataTempList.push(data);

          if (dataTempList.length >= 15) {
            let dataList = JSON.stringify(dataTempList);
            fs.writeFile("./data/test.json", dataList, err => {
              if (err) throw err;
              // 写入数据完成后，两秒后再发送下一次请求
              cb(null, "success");
            });
          } else {
            setTimeout(() => {
              console.log(`第${num}条写入成功`);
              cb(null, "success");
            }, 3000);
          }
        },
        (err, res) => {
          console.log("详情获取完成");
          callback(null, ok);
        }
    );
  }