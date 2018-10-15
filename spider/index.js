const async = require("async");
const fs = require("fs");
const cheerio = require("cheerio");

const request = require("./request");
const file = require("./file");

const SUCCESS = "SUCCESS";
const FAIL = "FAIL";

let IdList = [];
let dataTempList = [];
let num = 0;
let fileCount = 1;
let infoSize = 15;
let totalPage=1;

let pathData = "./public/data";
let writeData = file.writeData(infoSize);

module.exports = async function start() {
  console.log("开始爬取数据");

  totalPage =totalPage|| await request.getTotalPage();
  console.log(`总页数为：${totalPage}`);
  pageList = Array.from({ length: totalPage }, (v, k) => k + 1);

  async.series(
    [
      callback => {
        file.delData(pathData);
        callback(null, SUCCESS);
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
      let list;
      list = await request.getList({ pn });

      let result = list.content.positionResult.result;
      for (item of result) {
        IdList.push(item.positionId);
      }

      console.log(`正在获取第${pn}页ID`);
      cb(null, SUCCESS);
    },
    (err, res) => {
      console.log("ID列表获取完成");
      callback(null, SUCCESS);
    }
  );
}

function getDetail(callback) {
  async.mapLimit(
    IdList,
    3,
    async (id, cb) => {
      let pres;
      try {
        pres = await request.getDetail(id);
      } catch (err) {
        cb(null, FAIL);
      }

      let data = resolveDetail(pres);
      dataTempList.push(data);
      num++;
      if (num >= infoSize * fileCount) {
        writeData(dataTempList);
        fileCount++;
        dataTempList = [];
        cb(null, SUCCESS);
      } else if (num >= IdList.length) {
        cb(null, SUCCESS);
      } else {
        console.log(`正在写入第${num}条`);
        setTimeout(() => {
          cb(null, SUCCESS);
        }, 1000);
      }
    },
    (err, res) => {
      file.mergeJson(pathData);
      console.log("详情获取完成");
      callback(null, SUCCESS);
    }
  );
}

function resolveDetail(pres) {
  let $ = cheerio.load(pres.text);
  let title = $(".position-head .name").text();
  let salaryArr = $(".job_request .salary")
    .text()
    .replace(/[kK]*/g, "")
    .split("-")
    .map(n => {
      return JSON.parse(n);
    });
  let salary = Math.floor(salaryArr[0] + salaryArr[1] / 2);
  let conditionsDom = $(".job_request .salary").nextAll();
  let experience = $(conditionsDom[1]).text();
  let education = $(conditionsDom[2]).text();
  let postion = [
    $("*[name='positionLng']").val(),
    $("*[name='positionLat']").val()
  ];
  let address = $(".work_addr")
    .text()
    .replace(/[\s查看地图]*/g, "");
  let desChild = Array.from(
    $(".description")
      .next()
      .children()
  );
  let des = desChild.reduce((c, n) => {
    return c + `${$(n).text()} \n`;
  },"");

  let companyCon = $(".c_feature").children();
  let company = {
    peopleNumber: $(companyCon[2])
      .text()
      .replace(/\s*/g, ""),
    name: $(".b2").attr("alt"),
    host: $(companyCon[3])
      .text()
      .replace(/[\s公司主页]*/g, "")
  };

  let data = {
    title,
    salary,
    experience,
    education,
    postion,
    address,
    des: des,
    company
  };

  return data;
}
