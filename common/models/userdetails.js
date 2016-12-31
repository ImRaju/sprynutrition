module.exports = function(Userdetails) {
  Userdetails.observe('before save', function(ctx, next){
    console.log(ctx.data)
    if (ctx.isNewInstance) {
      ctx.instance.unsetAttribute('id');
      Userdetails.validatesUniquenessOf('email', {message: 'Email already exists'});
      ctx.instance.devices = [];
      ctx.instance.created = new Date;
      ctx.instance.updated = new Date;
    }
    if (ctx.currentInstance) {
      ctx.data.updated = new Date;
    }
    next();
  })
  Userdetails.disableRemoteMethod("upsert",true);
  Userdetails.disableRemoteMethod("updateAttributes",false);
  Userdetails.disableRemoteMethod("deleteById",true);
  Userdetails.disableRemoteMethod("updateAll", true);
  Userdetails.disableRemoteMethod("__delete__device",false);
  Userdetails.disableRemoteMethod('__updateById__device', false);
  Userdetails.disableRemoteMethod('__destroyById__device', false);
  Userdetails.disableRemoteMethod("createChangeStream",true);
};
