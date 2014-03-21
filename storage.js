// JavaScript Document
var Storage =  function () {
	var keyExist = function (id, keys)
	{
		var alreadyExists=false;
		if(keys!=null)
			{
				
				
				var keyArray = keys.split(",");
				for (var a = 0 ; a<keyArray.length;a++)
				{
					var key = keyArray[a];
					if(key==id)
					{
						alreadyExists=true;
						break;
					}
				}	
			}
		return 	alreadyExists;
	}
    
    var getRelatedClassesFromBean  = function (obj)
    {
        var relClassesName = getObjectName(obj)+"_relatedClasses";
        var classesString =Storage.loadRaw(relClassesName);
        if(classesString)
        return classesString.split(",");
        return null;
    };
    
    var addRelatedClassToBean  = function (obj,classname)
    {
         var relClassesName = getObjectName(obj)+"_relatedClasses";
        var classesString =Storage.loadRaw(relClassesName);
        var exists =  keyExist(classname,classesString);
        if(!exists)
        {
            if(classesString)
            {
                classesString=  classesString+","+classname;
            }
            else
            {
                classesString=classname;
            }
        }
        
        Storage.saveRaw(relClassesName,classesString);
        
    };
    
    var removeRelatedClassFromBean  = function (obj,name)
    {
        var relClassesName = getObjectName(obj)+"_relatedClasses";
        deleteKeyFromStringObject(relClassesName,name);
    };
	
	var deleteKeyFromStringObject = function (name,id)
	{
		
			var keys = Storage.loadRaw(name);
			if(keys)
			{
				var keyArray = keys.split(",");
				for (var a = 0 ; a<keyArray.length;a++)
				{
					var key = keyArray[a];
					if(key==id)
					{
						if(keyArray.length==1)
						{
							Storage.delete(name); 
                            return null;
						}else
						{
							keyArray.splice(a,1);	 
							keys = keyArray.join(",");
							Storage.saveRaw(name,keys);
                            return keys;
						}
						
						break;
					}
				}

			}
		
	}
    
    
    var getObjectName = function (obj)
    {
        return obj.class+"_"+obj.id;
    };
	
	 return {
        
        useJson:true
        ,
		available:false
		,
        parseFunction:JSON.parse
        ,
        stringifyFunction:JSON.stringify
        ,
		 init: function (){
						if (typeof(Storage) != "undefined")
						  {
						   Storage.available =true;
						   
						  }
						else
						  {
						  throw new Error("Storage not available");
						   Storage.available =false;
						  }
						}
						
     	,
		save:function (name, obj){
            if(Storage.useJson)
            {
			 localStorage.setItem(name, Storage.stringifyFunction(obj));
            }
                else
            {
              localStorage.setItem(name, obj);
            }
		}
		,
		load: function (name){
			
			var item = localStorage.getItem(name);
			if(item!= null && item!=undefined)
            {
                if(Storage.useJson)
                {
                    return Storage.parseFunction(item);
                }
                else
                {
                    return item;
                }
            }
            return null;
		}
		,
		saveRaw : function (name, obj){
			localStorage.setItem(name, obj);
		}
		,
		loadRaw : function (name){
			
			return localStorage.getItem(name);
		}
		,
		
		delete: function (name)
		{
			localStorage.removeItem(name);
		}
		,
		

		getObject : function (Classname, id)
		{
			var keys = Storage.loadRaw(Classname+"_keys");
			
			var alreadyExists = keyExist(id,keys);
			
			if(alreadyExists){
				
				return Storage.load(Classname+"_"+id);
			}
			//erstelle neues Object
			else
			{
				var lastKey = Storage.loadRaw(Classname+"_count");
				var newKey;
				var keyString;
				
				if(lastKey==null)
				{
					Storage.saveRaw(Classname+"_count",0);
					//keyString = 
					newKey=0;
				}
				else
				{
					newKey = parseInt(lastKey)+1;
					Storage.saveRaw(Classname+"_count",newKey);
					
					
					
				}
				
				return {id:newKey,class:Classname,exists:false};
			}
				
		}
		,
		

		storeObject : function (obj)
		{
			obj.exists = true;
			Storage.save(getObjectName(obj),obj);
			
			var keys = Storage.loadRaw(obj.class+"_keys");
			
			
			var alreadyExists = keyExist(obj.id,keys);
			if(!alreadyExists)
			{
				if(keys!=null)
					{
						keyString = keys+","+obj.id;
					}
					else
					{
						keyString= obj.id;
					}
				Storage.saveRaw(obj.class+"_keys",keyString);
			}
		}
		,
        storeObjects:function(ar)
        {
            for (var a = 0; a < ar.length ; a++)
            {
                Storage.storeObject(ar[a]);
            }
        }
        ,	

		deleteObject : function (obj)
		{
			Storage.delete(getObjectName(obj));
			var keys = Storage.loadRaw(obj.class+"_keys");
			deleteKeyFromStringObject(obj.class+"_keys",obj.id);
            
            //remove all Relations from this object
            var classes = getRelatedClassesFromBean(obj);
            if(classes)
            {
                for (var e =0 ; e<classes.length; e++)
                {
                    Storage.solveRelations(obj,classes[e]);
                }
            }
		}
        ,
        deleteAllObject:function (classname)
        {
            var keys = Storage.loadRaw(Classname+"_keys");
            var ids  = keys.split(",");
            for (var p =0 ; p<ids.length ; p++){
            var id = ids[p];
            var obj =  Storage.getObject(classname,id);
            Storage.deleteObject(obj);
            }
        }
		,
		
		relateObjects:function (obj1,obj2)
		{ 
            if(!obj1.exists || !obj2.exists)
            {
                throw new Error("both objects must be stored first, to relate this Objects");
            
            }
			var beanName1 = getObjectName(obj1);
			var beanName2 = getObjectName(obj2);
            
            addRelatedClassToBean(obj1,obj2.class);
            addRelatedClassToBean(obj2,obj1.class);
            
			var bean1RelationName=beanName1+"_"+obj2.class+"_relation";
			var bean2RelationName=beanName2+"_"+obj1.class+"_relation";
			
			var bean1RealtionString = Storage.loadRaw(bean1RelationName);
			var alreadyExists = false;
            
            //TODO: save the classtypes to each related Class for a bean, for a clean deleteObject Call!
			if(!bean1RealtionString)
			{
					bean1RealtionString=obj2.id;
					
			}
			else
			{
				alreadyExists = keyExist(obj2.id,bean1RealtionString);
				if(!alreadyExists)
					bean1RealtionString+=","+obj2.id;
			}
			
			if(!alreadyExists)
				Storage.saveRaw(bean1RelationName,bean1RealtionString);
			
			//and the other bean too
			alreadyExists =false;
			
			var bean2RealtionString = Storage.loadRaw(bean2RelationName);
			if(!bean2RealtionString)
			{
					bean2RealtionString=obj1.id;
			}
			else
			{
				alreadyExists = keyExist(obj1.id,bean2RealtionString);
				if(!alreadyExists)
					bean2RealtionString+=","+obj1.id;
			}
			
			if(!alreadyExists)
				Storage.saveRaw(bean2RelationName,bean2RealtionString);
		
		}
		,
		getRelatedObjects: function (obj,className)
		{
			var beanName = getObjectName(obj);
			var beanRelationName=beanName+"_"+className+"_relation";
			var keys = Storage.loadRaw(beanRelationName);
			
			var keyArray = keys.split(",");
			var beans = new Array();
				for (var a = 0 ; a<keyArray.length;a++)
				{
					var beanId = keyArray[a];
					if(beanId)
					{
						var bean = Storage.getObject(className,beanId);
						if(bean)
							beans.push(bean);
					}
				}
			return beans;
			
		}
		,
		solveRelation : function (obj1,obj2)
		{
			var beanName1 = getObjectName(obj1);
			var beanName2 = getObjectName(obj2);
			
			var bean1RelationName=beanName1+"_"+obj2.class+"_relation";
			var bean2RelationName=beanName2+"_"+obj1.class+"_relation";
			
			
			var classes = deleteKeyFromStringObject(bean1RelationName,obj2.id);
            if(classes==null)//only if there or not more related Objects of this Class left
            {
                removeRelatedClassFromBean(obj1,obj2.class);
            }
            
            
		 	classes = deleteKeyFromStringObject(bean2RelationName,obj1.id);
            
            if(classes==null)//only if there or not more related Objects of this Class left
            {
                removeRelatedClassFromBean(obj2,obj1.class);
            }
			
			
			
		}
		,
		solveRelations:function(obj1,classname)
		{
			var ar = Storage.getRelatedObjects(obj1,classname);
				for (var a = 0 ; a<ar.length;a++)
				{
					Storage.solveRelation(obj1,ar[a]);
				}
		}
    ,
    imgToData:function(elementImage,type,width,height)
    {
        var c = document.createElement("canvas");
 
        var img=elementImage;//document.getElementById("scream");
        c.width = img.width;
        c.height = img.height;
        var ctx=c.getContext("2d");
        ctx.drawImage(img,0,0);
        var w = width ? width :img.width;
        var h = height ? height:img.height;
        var imgData=ctx.getImageData(0,0,w,h);
        var tp = type ? type : "image/png"
        var urldata = c.toDataURL(tp); 
        return urldata;
        /*example
        var obj =  Storage.getObject("image",19);
        obj.data = urldata;
        Storage.storeObject(obj);
        var t =  Storage.getObject("image",19);
        ctx.putImageData(t,0,0);
        $("#scream2").attr("src",t.data);
        
        for mobile you only can uses 
        saveRaw and LoadRaw // storeObject will not work
        */    
    }

		
	};
	
	
}();










