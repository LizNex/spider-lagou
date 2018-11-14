const router = require('koa-router')()

//获得热力图
router.get('/', async (ctx, next) => {
  await ctx.render('index1')
})



module.exports = router
