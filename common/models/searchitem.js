module.exports = function(Searchitem) {
  Searchitem.observe('after save', function(ctx, next){
    ctx.instance.apilogs.create({searchitem:ctx.instance.searchitem, logdate:new Date}, function(err){
      if(err) console.log(err);
    })
    next();
  })

  Searchitem.remoteMethod(
    'search',
    {
      http: {path: '/search', verb: 'get'},
      accepts: [
        {arg: 'searchitem', type: 'string', required: true},
        {arg: 'limit', type: 'number', required: false},
      ],
      returns: {root: true, type: 'object'},
      description: 'Pass a search term '
    }
  )

  Searchitem.search= function(searchitem, limit, next){
    var res=[];
    var apiDS = Searchitem.app.dataSources.apiDS;
    var item= searchitem.toLowerCase();
    if(!limit) limit=0;
    Searchitem.findOne({where:{'searchitem':item}}, function(err, sitem){
      if(err) next(err);
      else if(sitem && sitem.response && sitem.response.length>=limit){
        if(limit && sitem.response.length!=limit){
          res= sitem.response.slice(0, limit);
          sitem.response=res;
          next(null,sitem);
        }else
          next(null,sitem);
      }
      else{
        if(sitem && sitem.response && sitem.response.length<=limit){
          var ilimit=sitem.response.length;
          var flimit=sitem.response.length+50;
          apiDS.search("search/"+item,'*',ilimit+":"+flimit, function(err, response){
            if(err) next(err);
            else if(response.hits.length){
              res=sitem.response.concat(response.hits);
              sitem.updateAttributes({response:res}, function(err, s){
                if(err) next(err);
                else next(null, s)
              })
            }else{
              var err= new Error("no more items");
              err.status= 404;
              next(err)
            }
          })          
        }else{
            apiDS.search("search/"+item,'*','0:50', function(err, response){
            if(err) next(err);
            else if(response.hits.length){
              Searchitem.create({searchitem:item, response:response.hits}, function(err, s){
                if(err) next(err);
                else next(null, s)
              })
            }else{
              var err= new Error("item not found");
              err.status= 404;
              next(err)
            }
          })
        }
      }
    })    
  }

  Searchitem.disableRemoteMethod("upsert",true);
  Searchitem.disableRemoteMethod('create', true);
  Searchitem.disableRemoteMethod("updateAttributes",false);
  Searchitem.disableRemoteMethod("deleteById",true);
  Searchitem.disableRemoteMethod("updateAll", true);
  Searchitem.disableRemoteMethod("__create__apilogs",false);
  Searchitem.disableRemoteMethod("__delete__apilogs",false);
  Searchitem.disableRemoteMethod('__updateById__apilogs', false);
  Searchitem.disableRemoteMethod('__destroyById__apilogs', false);
  Searchitem.disableRemoteMethod("createChangeStream",true);
};
