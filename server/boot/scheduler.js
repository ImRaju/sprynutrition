module.exports = function(server) {
	var schedule = require('node-schedule');
	console.log('\x1b[33m',"schedule job started",'\x1b[0m');
	var j = schedule.scheduleJob('*/5 * * * *', function(){
		console.log('\x1b[36m',"checking items for schedule",'\x1b[0m');
		server.models.schedule.scheduleItems();
	})
}