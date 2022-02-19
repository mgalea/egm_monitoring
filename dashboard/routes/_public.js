/**
 * Static Pages Routing
 * @module _root Router
 * @author Mario Galea
 * @version 1.0
 */
var Express = require("express");
var router = Express.Router();
router.use(Express.static(global.__publicPath));

module.exports = router;
