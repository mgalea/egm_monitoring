/**
 * Static Pages Routing
 * @module _root Router
 * @author Mario Galea
 * @version 1.0
 */
const Express = require("express");
const router = Express.Router();

router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.use(Express.static(global.__publicPath));
module.exports = router;
