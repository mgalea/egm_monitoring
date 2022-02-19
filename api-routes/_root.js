const Express = require('express');
const router = Express.Router();

router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

/** GETS THE DEFAULT ROUTE FOR APIS */
router.get('/',function(req,res) {
    res.sendFile('api.html', { root: global.__publicPath });
});

module.exports = router; 