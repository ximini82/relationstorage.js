Storage.js
==========

Storage.js is a small Class that enables you to store objects in the browsers locale storage or create relations from object to each other object. So you can create 1:1, 1:n and n:m relations. It has no dependencies to other frameworks.

# Why I created this

If you create a webapplication that is using a lot of datas, sometime its good to save data locally. But WebSql Database and IndexedDB  are not realy good supported in different browsers.
The best support has the [webstorage see this Link](http://www.html5rocks.com/de/features/storage). So I decided to create a small framework were I can relate objects , and save images (and files in the near future). The code is human readable and easy to understand. You can compress it to 2kb size.

Storage.js has a small search function (based on eval), but i recommend to use Javascript. You can load all objects quickly and iterate them by Javascript. Should'nt be a problem.

# When should I use it

I recommend to use Storage.js only if you realy want to store something, not if you just want to do something with objects. It doesn't make any sense to reload all objects each time, if you already have loaded all objects.
Just store the changes. And only load all objects if it is neccessary.

#  Start with an object

To work with Storage.js it is neccessary to allocate an object first! But you also can use "storeObjectsAs" to save your allready existing objects, see further down.

```javascript
	var object = Storage.getObject("nameOfYourBean");
```
This object automatically  has three values:

1. id
2. class
3. exists (is true, if it is loaded/saved object)

The id is the the unique key for this object, with this class. The class attribute is a string with the name of the class. In this example "nameOfYourBean"

# Add something

Then you can add attributes and store the object again.

```javascript
	var object = Storage.getObject("nameOfYourBean");
	object.myvalue = "this is my new value";
	object.andAnother =123;
```

# Store object

just : 
```javascript
	Storage.storeObject(object);
	
	//multiple
	var a = Storage.getObject("myBean");
	var b = Storage.getObject("myBean");
	Storage.storeObjects([a,b]);
```

## Store your allready existing objects
if you allreay have a object, and you can't allocate them, use "storeObjectsAs". The object will be stored automatically and every object gets the id and the classtype.

```javascript
	//object which allready exists
	var firstOne = {name:"blub"};
	var secondOne = {name:"blub"};
	Storage.storeObjectsAs([firstOne,secondOne],"miscStuff");
```
> Notice: Make sure your object has no id or class attribute!


# How to load an object
you already know this function. You only need the id of the object

```javascript
	var object = Storage.getObject("myBean",0);
	
	//remember: you find the id of an object in itself
	var object = Storage.getObject("myBean");
	alert(object.id);
	
	//load all objects of a type, returned an array
	var ar = Storage.getAllObjects("myBean");
```

The "getObject" function loads the object with the given id, if you pass an id as a second paramter. If an object with this id exists, the function returns the stored object, else if it creates a new object. 

> Notice: If there is not object with this id. The new returned object has probably another id as the given id.

# Delete objects
```javascript

    var object = Storage.getObject("sample");
	Storage.storeObject(object);
	//delete object
	Storage.deleteObject(object);
	
	//delete an array of objects
	Storage.deleteObjects([object2,object3]);
	
	//delete all objects of a type
	Storage.deleteAllObjects("sample");
```

# Relate objects

Storage.js allows you to relate every object with every other. So you can create 1:1, 1:n and n:m relations. Before you can relate objects. Both object must be saved first, but only one time.

```javascript
	var book = Storage.getObject("book",0);
	var page = Storage.getObject("page");
	var page2 = Storage.getObject("page");
	var author = Storage.getObject("author");
	
	//must be saved once, before you can relate
	Storage.storeObjects([book,page,page2,author]);
	
	//then relate
	Storage.relateObjects(book,page);
	Storage.relateObjects(book,page2);
	Storage.relateObjects(book,author);
	
```

# Get related objects

getRelatedObjects will return an array with all objects from a type which were related to this object

```javascript

	//to get all related objects of a type "page"
	var ar = Storage.getRelatedObjects(book,"page"); // returns the two pages from the example above
	var page = ar[0];
	
	//return the first related object of the type
	var page = Storage.getRelatedObject(book,"page");
	
```

# Solve objectrelations

if you want to remove an relation between two objects, for example you want to remove a page just call :

```javascript

	//remove a relation
	Storage.solveRelation(book,page); 
	
	//or remove all relations from a type
	Storage.solveRelations(book,"page"); 
	//this book has no pages anymore

```

> Notice: You don't have to take care of relation, if you want to delete an object. Storage.js removes all relations automatically

# Save an image as object

you can save an Image from your dom

```html
<img id="googleIcon" alt="The Scream" width="220" height="277" style="border:1px solid #d3d3d3;" src="https://www.google.de/images/srpr/logo11w.png">
<img id="emptyimage" alt="The Scream" width="220" height="277" style="border:1px solid #d3d3d3;" >
```
it is a bit tricky, an for android you need to save it on the second way

## The first way (works on most browsers, but not on android shipped browser)
```javascript

	//at the beginning grab the img 
	var img=document.getElementById("googleIcon");

	//save the data of an image as an attribute of an object
	var myImage = Storage.getObject("myimages"); 
	myImage.description = "googles icon";
	
	//this small helper function helps you to get the imageinformations
	//! NOTICE ! make sure that the image is loaded e.g. img.onload = function (){...}
	myImage.data = Storage.imgToData(img);
	Storage.storeObject(myImage);
	
	//now load the stored image
	var storedImage = Storage.getObject("myimages",0); 
	
	
	//and set set source of the image
	var placeholder = document.getElementById('emptyimage');
    placeholder.src = storedImage.data;
	
```

> Notice: this works for png's if you want to save jpg's use this Storage.imgToData(img,'image/jpg');


## The second way, works also on android

```javascript

	//at the beginning grab the img 
	var img=document.getElementById("googleIcon");
	
	//create an object, to store a reference to the image
	var myImage = Storage.getObject("myimages"); 
	myImage.description = "googles icon";
	
	//instead of saving the imagedata directly in the object we save the image as rawdata
	var imageData= Storage.imgToData(img);
	var imgRef = myImage.class+"_"+myImage.id+"_image";
	Storage.saveRaw(imgRef,imageData);
	
	//we save the refence in the object
	myImage.ref = imgRef;
	Storage.storeObject(myImage);
	
	//now load the stored object
	var storedImage = Storage.getObject("myimages",0); 
	
	//load the raw imagedata
	var imageData2 = Storage.loadRaw(storedImage.ref,imageData);
	
	//and set set source of the image
	var placeholder = document.getElementById('emptyimage');
    placeholder.src = imageData2;
	
```

This should work on every browser

#  Search after an object

> Notice: the performance of the search function is not realy fast, because for each search, it loads all object and call the eval function. I recommend to load the objects and handle search by yourself.

You can search after a specific object from a type using the "findWhere" function. That function use the Javascript eval function. So be carefull. Your query have to return false or true. 
Also you have to use the keyword "object" to acces an attribute. You also have to set values in quotes. See example:
```javascript

		//create some objects
	    var searchnode = Storage.getObject("search",0);
        searchnode.name="hanz";
        var searchnode1 = Storage.getObject("search",1);
        searchnode1.name="karl";
        var searchnode2 = Storage.getObject("search",2);
        searchnode2.name="ars";
		 var searchnode3 = Storage.getObject("search",3);
        searchnode3.noname="i have no name";
		Storage.storeObjects([searchnode,searchnode1,searchnode2,searchnode3]);
		
		//if eval query returns true, it will added to the results
		var res = Storage.findWhere("search","object.name=='karl'");
        alert("I found "+res.length+" results that match karl" );
		
```

# future plans

1. file functions
2. better integration of image and file loading / saving


if you have a good idea let me know ;)


License
==========
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
<img alt="Creative Commons Lizenzvertrag" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/4.0/80x15.png" />
</a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Storage.js</span> by 
<a xmlns:cc="http://creativecommons.org/ns#" href="app-impact.net" property="cc:attributionName" rel="cc:attributionURL">Simon Schweizer</a>
 is licensed under a  
 <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
Creative Commons Attribution - Share Alike 4.0 International License.
 </a>.
 
 