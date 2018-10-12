const superagent = require("superagent");
const cheerio = require("cheerio");
let option = {
  // 'Accept': 'application/json, text/javascript, */*; q=0.01',
  // 'Accept-Encoding': 'gzip, deflate, br',
  // 'Accept-Language': 'zh-CN,zh;q=0.9',
  // 'Connection': 'keep-alive',
  // 'Content-Length': '37',
//   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

  Cookie: `JSESSIONID=ABAAABAAAGGABCBE6DDFAA2ADD93C347CC8AB1615075C51; user_trace_token=20181010093928-9420fa65-7c31-4280-a485-558cd03d305b; _ga=GA1.2.501907324.1539135566; _gid=GA1.2.41308141.1539135566; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539135334; LGUID=20181010093929-5431fcde-cc2d-11e8-bba8-5254005c3644; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; index_location_city=%E4%B8%8A%E6%B5%B7; X_HTTP_TOKEN=df5984ecd454f2ee95a0ab085c01907b; hasDeliver=0; login=false; unick=""; _putrc=""; LG_LOGIN_USER_ID=""; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221665ce777701a0-0f5b0752d6ed36-36664c08-921600-1665ce777715e8%22%2C%22%24device_id%22%3A%221665ce777701a0-0f5b0752d6ed36-36664c08-921600-1665ce777715e8%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; TG-TRACK-CODE=search_code; LGSID=20181012164915-b2cdab99-cdfb-11e8-bbbf-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539335428; LGRID=20181012171033-aca01575-cdfe-11e8-b0e9-525400f775ce; SEARCH_ID=134aa95d5ab643f6b1e5bc7c6fd9b911`,
  // 'Host': 'www.lagou.com',
  // 'Origin': 'https://www.lagou.com',
  Referer:
    "https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?city=%E4%B8%8A%E6%B5%B7&cl=false&fromSearch=true&labelWords=&suginput="
  // 'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  // 'X-Anit-Forge-Code': ' 0',
  // 'X-Anit-Forge-Token': ' None',
  // 'X-Requested-With': ' XMLHttpRequest'
};

let option2 = {
  Cookie: `JSESSIONID=ABAAABAAAGGABCBE6DDFAA2ADD93C347CC8AB1615075C51; user_trace_token=20181010093928-9420fa65-7c31-4280-a485-558cd03d305b; _ga=GA1.2.501907324.1539135566; _gid=GA1.2.41308141.1539135566; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539135334; LGUID=20181010093929-5431fcde-cc2d-11e8-bba8-5254005c3644; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; index_location_city=%E4%B8%8A%E6%B5%B7; X_HTTP_TOKEN=df5984ecd454f2ee95a0ab085c01907b; hasDeliver=0; login=false; unick=""; _putrc=""; LG_LOGIN_USER_ID=""; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221665ce777701a0-0f5b0752d6ed36-36664c08-921600-1665ce777715e8%22%2C%22%24device_id%22%3A%221665ce777701a0-0f5b0752d6ed36-36664c08-921600-1665ce777715e8%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; TG-TRACK-CODE=search_code; LGSID=20181012164915-b2cdab99-cdfb-11e8-bbbf-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539335428; LGRID=20181012171033-aca01575-cdfe-11e8-b0e9-525400f775ce; SEARCH_ID=134aa95d5ab643f6b1e5bc7c6fd9b911`,

};

let getList = async ({ city, position, pn } = {}) => {
  city = city || "上海";
  position = position || "前端";
  pn = pn || 1;
  first = pn === 1 ? true : false;


  let param={
   
  }

  let result = await new Promise((resolve, reject) => {
    superagent
      .post(
        `https://www.lagou.com/jobs/positionAjax.json?city=%E4%B8%8A%E6%B5%B7&needAddtionalResult=false&pn=${pn}&kd=%E5%89%8D%E7%AB%AF`
      )
      .set(option)
      .send(param)
      .end(async (err, res) => {
        if (err) throw err;
        if (res.body.success) {
          resolve(res.body);
        }
      });
  });
  return result;
};

let getTotalPage = async () => {
  let res = await getList();
  return Math.ceil(res.content.positionResult.totalCount / 15);
};

let getDetail = async id => {
  let result = await new Promise((resolve, reject) => {
    superagent
      .get(`https://www.lagou.com/jobs/${id}.html`)
      .set(option2)
      .end(async (err, pres) => {
        if (pres.text.includes("网络出错")) {
          console.log("请求的链接：", `ohttps://www.lagou.com/jobs/${id}.html`);

          //   getDetail(id);
          return;
        }

        let $ = cheerio.load(pres.text);

        let conditionsDom = $(".job_request .salary").nextAll();
        let addressChild = $(".work_addr").children();
        let address = $(".work_addr")
          .text()
          .replace(/[\s查看地图]*/g, "");
        let company = $(".c_feature").children();
        let desChild = Array.from(
          $(".description")
            .next()
            .children()
        );
        let des = "";
        for (item of desChild) {
          des += `${$(item).text()} \n`;
        }

        let salaryArr = $(".job_request .salary")
          .text()
          .replace(/[kK]*/g, "")
          .split("-")
          .map(n => {
            let s;
            if (!n) {
              console.log(`错误的网页为：${pres}")}`);
              console.log(`错误的id为：${id}`);
              console.log(`转义错误参数为：${n}`);
              s = 0;
            } else {
              s = JSON.parse(n);
            }
            // try {
            //   s = JSON.parse(n);
            // } catch (err) {
            //   console.log(err);
            //   s = 0;
            // }
            return s;
          });
        let salaryAverage = Math.floor(salaryArr[0] + salaryArr[1] / 2);
        let postion = [
          JSON.parse($("*[name='positionLng']").val()),
          JSON.parse($("*[name='positionLat']").val())
        ];

        //   let data = {
        //     title: $(".position-head .name").text(),
        //     salary: salaryAverage,
        //     experience: $(conditionsDom[1]).text(),
        //     education: $(conditionsDom[2]).text(),
        //     postion:postion,

        //     address: address,
        //     des: des,
        //     company: {
        //       peopleNumber: $(company[2])
        //         .text()
        //         .replace(/\s*/g, ""),
        //       name: $(".b2").attr("alt"),
        //       host: $(company[3])
        //         .text()
        //         .replace(/[\s公司主页]*/g, "")
        //     }
        //   };

        pointData = {
          salaryAverage,
          postion
        };

        resolve(pointData);
      });
  });
  return result;
};

module.exports = {
  getList,
  getDetail,
  getTotalPage
};
