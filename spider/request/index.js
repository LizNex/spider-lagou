  const superagent = require("superagent");
  const cheerio = require("cheerio");
  let option = {
    // 'Accept': 'application/json, text/javascript, */*; q=0.01',
    // 'Accept-Encoding': 'gzip, deflate, br',
    // 'Accept-Language': 'zh-CN,zh;q=0.9',
    // 'Connection': 'keep-alive',
    // 'Content-Length': '37',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: "JSESSIONID=ABAAABAAAGGABCBE6DDFAA2ADD93C347CC8AB1615075C51; user_trace_token=20181010093928-9420fa65-7c31-4280-a485-558cd03d305b; _ga=GA1.2.501907324.1539135566; _gid=GA1.2.41308141.1539135566; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539135334; LGUID=20181010093929-5431fcde-cc2d-11e8-bba8-5254005c3644; _putrc=65474E26FF8EE860; login=true; unick=%E6%9D%8E%E6%99%BA; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=286; gate_login_token=428349824965654f5288fb246039e5c048674d730665b8aa; index_location_city=%E4%B8%8A%E6%B5%B7; LGSID=20181010103006-666fa8e6-cc34-11e8-bba8-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539140144; LGRID=20181010105547-fce0d508-cc37-11e8-bba8-5254005c3644; SEARCH_ID=64cd7ce220d6488084082ea479aea5f6",
    // 'Host': 'www.lagou.com',
    // 'Origin': 'https://www.lagou.com',
    Referer: "https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?city=%E4%B8%8A%E6%B5%B7&cl=false&fromSearch=true&labelWords=&suginput=",
    // 'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    // 'X-Anit-Forge-Code': ' 0',
    // 'X-Anit-Forge-Token': ' None',
    // 'X-Requested-With': ' XMLHttpRequest'
  };

  let option2={
    Cookie: "JSESSIONID=ABAAABAAAGGABCBE6DDFAA2ADD93C347CC8AB1615075C51; user_trace_token=20181010093928-9420fa65-7c31-4280-a485-558cd03d305b; _ga=GA1.2.501907324.1539135566; _gid=GA1.2.41308141.1539135566; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539135334; LGUID=20181010093929-5431fcde-cc2d-11e8-bba8-5254005c3644; _putrc=65474E26FF8EE860; login=true; unick=%E6%9D%8E%E6%99%BA; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=286; gate_login_token=428349824965654f5288fb246039e5c048674d730665b8aa; index_location_city=%E4%B8%8A%E6%B5%B7; LGSID=20181010103006-666fa8e6-cc34-11e8-bba8-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fwebqianduan%2F%3FlabelWords%3Dlabel; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1539140144; LGRID=20181010105547-fce0d508-cc37-11e8-bba8-5254005c3644; SEARCH_ID=64cd7ce220d6488084082ea479aea5f6",

  }

  let getList = async ({ city, position, pn } = {}) => {
    city = city || "上海";
    position = position || "前端";
    pn = pn || 1;
    first = pn === 1 ? true : false;

    let result = await new Promise((resolve, reject) => {
      superagent
        .post(
          `https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city=${city}&kd=${position}`
        )
        .send({
          pn: pn,
          kd: position,
          first: first
        })
        .set(option)
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
            console.log('请求的链接：', `https://www.lagou.com/jobs/${id}.html`)

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

          let data = {
            title: $(".position-head .name").text(),
            salary: $(".job_request .salary").text(),
            experience: $(conditionsDom[1]).text(),
            education: $(conditionsDom[2]).text(),
            postion: {
              lng: $("*[name='positionLng']").val(),
              lat: $("*[name='positionLat']").val()
            },
            address: address,
            des: des,
            company: {
              peopleNumber: $(company[2])
                .text()
                .replace(/\s*/g, ""),
              name: $(".b2").attr("alt"),
              host: $(company[3])
                .text()
                .replace(/[\s公司主页]*/g, "")
            }
          };

          resolve(data)
        });
    });
    return result;
  };

  module.exports = {
    getList,
    getDetail,
    getTotalPage
  };