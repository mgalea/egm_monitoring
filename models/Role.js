var mongoose = require('mongoose');
var roleSchema = new mongoose.Schema({
   level: Number,
   type: String,
   inherits_id: ObjectId
});
roleSchema.setBasic
mongoose.model('Role', RoleSchema);
module.exports = mongoose.model('Role');