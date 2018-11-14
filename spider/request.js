const superagent = require("superagent");

let Cookie = `JSESSIONID=ABAAABAAADEAAFI0389DED9C01FE2AC9D6B88E228787F3C; user_trace_token=20181013190143-ad5a91b1-9fa4-488a-8f80-2b54c4757087; _ga=GA1.2.1625339479.1539428507; _gid=GA1.2.2213516.1539428507; PRE_UTM=; LGUID=20181013190147-61163a31-ced7-11e8-bbe1-5254005c3644; index_location_city=%E4%B8%8A%E6%B5%B7; TG-TRACK-CODE=index_search; _gat=1; LGSID=20181013192015-f5441bb0-ced9-11e8-b29b-525400f775ce; PRE_HOST=www.baidu.com; PRE_SITE=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DnGNaTz3sbSKEwiWVdD-aQAr3q9h-vl4InIzAfRh5ytW%26ck%3D1870.7.213.462.146.257.360.478%26shh%3Dwww.baidu.com%26wd%3D%26eqid%3Da2632c530003b4d0000000045bc1d4df; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2F; X_HTTP_TOKEN=041c648611ddc04b171c50e14210a35b; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539266946,1539358228,1539429614,1539429616; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221666d27cb5c241-06029bb9b33681-8383268-1049088-1666d27cb5d3a8%22%2C%22%24device_id%22%3A%221666d27cb5c241-06029bb9b33681-8383268-1049088-1666d27cb5d3a8%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%2C%22%24latest_referrer_host%22%3A%22www.baidu.com%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%7D%7D; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539429621; LGRID=20181013192021-f93faf52-ced9-11e8-bbe1-5254005c3644; SEARCH_ID=1ee2a5be3fe04f78bd40dc2e55d5b6ef`;
let Referer =
  "https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?city=%E4%B8%8A%E6%B5%B7&cl=false&fromSearch=true&labelWords=&suginput=";
let option = {
  // 'Accept': 'application/json, text/javascript, */*; q=0.01',
  // 'Accept-Encoding': 'gzip, deflate, br',
  // 'Accept-Language': 'zh-CN,zh;q=0.9',
  // 'Connection': 'keep-alive',
  // 'Content-Length': '37',
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

  // 'Host': 'www.lagou.com',
  // 'Origin': 'https://www.lagou.com',
  // 'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  // 'X-Anit-Forge-Code': ' 0',
  // 'X-Anit-Forge-Token': ' None',
  // 'X-Requested-With': ' XMLHttpRequest'
  Cookie,
  Referer
};

let getList = async ({ city, position, pn } = {}) => {
  city = city || "上海";
  position = position || "前端";
  pn = pn || 1;
  first = pn === 1 ? true : false;

  let head = {
    Cookie,
    Referer
  };
  let param = {};

  let result = await new Promise((resolve, reject) => {
    superagent
      .post(
        `https://www.lagou.com/jobs/positionAjax.json?city=%E4%B8%8A%E6%B5%B7&needAddtionalResult=false&pn=${pn}&kd=%E5%89%8D%E7%AB%AF`
      )
      .set(head)
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

let getTotalPage = async pageSize => {
  pageSize = pageSize || 15;
  let head = { Cookie };
  let res = await getList();
  return Math.ceil(res.content.positionResult.totalCount / pageSize);
};

let getDetail = id => {
  let head = {
    Cookie
  };
  return new Promise((resolve, reject) => {
    superagent
      .get(`https://www.lagou.com/jobs/${id}.html`)
      .set(head)
      .end(async (err, pres) => {
        if (pres.text.includes("网络出错")) {
          console.log("请求的链接：", `https://www.lagou.com/jobs/${id}.html`);
          reject("FAIL");
        }
        resolve(pres);
      });
  });
};

module.exports = {
  getList,
  getDetail,
  getTotalPage
};
