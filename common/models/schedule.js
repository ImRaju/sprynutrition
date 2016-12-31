module.exports = function(Schedule) {
  Schedule.remoteMethod(
    'createSchedule',
    {
      http: {path: '/createSchedule', verb: 'post'},
      accepts: [
        {arg: 'item', type: 'string', required: true},
        {arg: 'scheduledate', type: 'date', required: true}
      ],
      returns: {root: true, type: 'object'},
      description: 'create a Schedule'
    }
  )
  Schedule.createSchedule= function(item, scheduledate, next){
    var sitem= item.toLowerCase();
    if(scheduledate.getTime()>(new Date).setUTCHours(0,0,0,0)){
      Schedule.findOne({where:{searchitem:sitem}}, function(err,s){
        if(err) next(err);
        else if(s){
          var err= new Error("item already exist in schedule list");
          err.status= 400;
          next(err);
        }
        else{
          var sdate=scheduledate.setUTCHours(0,0,0,0);
          Schedule.create({searchitem:sitem,scheduledate:sdate,status:"pending", active:true}, function(err,sdule){
            if(err) next(err);
            next(null,sdule);
          })
        }
      })
    }
    else{
      var err= new Error("scheduledate must be greater then current time");
      err.status= 400;
      next(err);
    }
  }

  Schedule.remoteMethod(
    'updateSchedule',
    {
      http: {path: '/updateSchedule', verb: 'put'},
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'scheduledate', type: 'date', required: true},
        {arg: 'active', type: 'boolean', required: true}
      ],
      returns: {root: true, type: 'object'},
      description: 'update a Schedule'
    }
  )
  Schedule.updateSchedule= function(id, scheduledate, active, next){
    //console.log(scheduledate.toISOString())
    if(scheduledate.getTime()>(new Date).setUTCHours(0,0,0,0)){
      Schedule.findById(id, function(err,s){
        if(err) next(err);
        else if(s){
          var sdate=scheduledate.setUTCHours(0,0,0,0);
          //console.log(sdate)
          s.updateAttributes({scheduledate:sdate, status:"pending", active:active}, function(err,sdule){
            if(err) next(err);
            else next(null,sdule);
          })
        }
        else{
          var err= new Error("schedule not found");
          err.status= 404;
          next(err)
        }
      })
    }
    else{
      var err= new Error("scheduledate must be greater then current time");
      err.status= 400;
      next(err);
    }
  }

  Schedule.scheduleItems= function(next){
    var apiDS = Schedule.app.dataSources.apiDS;
    Schedule.find({"where":{"scheduledate":(new Date).setUTCHours(0,0,0,0), "status":"pending","active":true}},function(err,s){
      if(err) return next(err);
      s.forEach(function(sitem){
        Schedule.app.models.searchitem.findOne({where:{"searchitem":sitem.searchitem}}, function(err, s){
          if(err) next(err);
          else{
            apiDS.search("search/"+sitem.searchitem,'*','0:50', function(err, response){
              if(err) next(err);
              else if(response.hits.length && s){
                s.updateAttributes({response:response.hits}, function(err){
                  if(err) console.log(err);
                  else{
                    console.log("scheduled job for item ",sitem.searchitem);
                    sitem.status="success";
                    sitem.active= false;
                    sitem.save();
                  }
                })
              }else if(response.hits.length && !s){
                Schedule.app.models.searchitem.create({searchitem:sitem.searchitem,response:response.hits}, function(err){
                  if(err) console.log(err);
                  else{
                    console.log("scheduled job for item ",sitem.searchitem);
                    sitem.status="success";
                    sitem.active= false;
                    sitem.save();
                  }
                })
              }else{
                console.log("Error scheduling job for item ",sitem.searchitem);
                sitem.status="error";
                sitem.active= false;
                sitem.save();
              }
            })
          }
        })
      })
    })
  }

  Schedule.disableRemoteMethod("upsert",true);
  Schedule.disableRemoteMethod("updateAttributes",false);
  Schedule.disableRemoteMethod("deleteById",true);
  Schedule.disableRemoteMethod("updateAll", true);
  Schedule.disableRemoteMethod("createChangeStream",true);
};
