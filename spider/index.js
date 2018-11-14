const async = require("async");
const fs = require("fs");
const cheerio = require("cheerio");         //读取解析获得网页插件
const request = require("./request");       //请求模块
const file = require("./file");             //文件操作模块

const SUCCESS = "SUCCESS";
const FAIL = "FAIL";

let IdList = [];                    //id列表
let dataTempList = [];              //数据列表
let num = 0;                        //当前页数
let fileCount = 1;                  //生成的文件计数
let infoSize = 15;                  //生成的文件中包含信息的条数
let totalPage=1;                    //设定爬取总页数

let pathData = "./public/data";     //生成数据的路径
let writeData = file.writeData(infoSize);   //给予柯里化的file.writeData函数赋予size




module.exports = async function start() {
  console.log("开始爬取数据");

  totalPage =totalPage|| await request.getTotalPage();
  console.log(`总页数为：${totalPage}`);
  pageList = Array.from({ length: totalPage }, (v, k) => k + 1);

  //主流程
  async.series(
    [
      //删除老旧数据
      callback => {
        file.delData(pathData);
        callback(null, SUCCESS);
      },
      //获得所有ID
      callback => {
        getIdList(callback);
      },
      //获得所有详情数据
      callback => {
        getDetail(callback);
      }
    ],
    (err, res) => {
      if (err) throw err;
    }
  );
};

//获取id列表
function getIdList(callback) {
  async.mapLimit(
    pageList,
    3,                                              //控制并发数为3
    async (pn, cb) => {
    
      let list = await request.getList({ pn });
      let result = list.content.positionResult.result;

      for (item of result) {
        IdList.push(item.positionId);
      }

      console.log(`正在获取第${pn}页ID`);
      cb(null, SUCCESS);
    },
    (err, res) => {                                 //遍历完所有数据后的回调
      console.log("ID列表获取完成");
      callback(null, SUCCESS);
    }
  );
}
//获取详情
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

      //写入数据
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
      console.log("请通过以下地址访问结果：localhost:3000")
      callback(null, SUCCESS);
    }
  );
}

//通过cheerio解析详情数据
function resolveDetail(pres) {
  let $ = cheerio.load(pres.text);                  //使用cheerio加载获得的页面
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
