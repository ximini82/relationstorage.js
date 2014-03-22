Storage.js
==========

Storage.js is a small Class that enables you to store objects in the browsers locale storage. You can relate objects to each other.

# Why?

If you create a webapplication that is using a lot of datas, sometime its good to save data locally. But WebSql Database and IndexedDB  are not realy good supported in different browsers.
The best support has the [webstorage see this Link](http://www.html5rocks.com/de/features/storage). So I decided to create a small framework were I can relate objects , and save Images (and files in the near future).

Storage.js has no search or query function. Javascript is fast, and you can load all object quickly and iterate them by Javascript. Should'nt be a problem.  However, I plan to implement a small "Where" query function, but it is not ready yet.



#  start with an object

To work with Storage.js it is neccessary to allocate an object first!

```javascript
	var object = Storage.getObject("nameOfYourBean");
```
This object automatically  has two values:

1. id
2. class
3. exists (is true, if it was loaded object)

The id is the the unique key for this object, with this class. The class attribute is a string with the name of the class. In this example "nameOfYourBean"

# add something

Then you can add attributes and store the object again.

```javascript
	var object = Storage.getObject("nameOfYourBean");
	object.myvalue = "this is my new value";
	object.andAnother =123;
```

# store object

just : 
```javascript
	Storage.storeObject(object);
	
	//multiple
	var a = Storage.getObject("myBean");
	var b = Storage.getObject("myBean");
	Storage.storeObjects([a,b]);
	
```
# how to load an object? easy ;)
you already know this function. You only need the id of the object

```javascript
	var object = Storage.getObject("myBean",0);
	
	//remember: you find the id of an object in itself
	var object = Storage.getObject("sample");
	alert(object.id);
	
	//load all objects of a type, returned an array
	var ar = Storage.getAllObjects("sample");
```

The "getObject" function loads the object, if you pass an id as a second paramter. If it exists its returns the stored object, else it creates a new object. 

> Notice: if there is not object with this id. The new returned object has probably another id as the given id.

#delete Objects
```javascript

    var object = Storage.getObject("sample");
	Storage.storeObject(object);
	//delete object
	Storage.deleteObject(object);
	
	//delete an array of object
	Storage.deleteObjects([object2,object3]);
	
	//delete all objects of a type
	Storage.deleteAllObjects("sample");
```

# relate objects

Storage.js allows you to relate every object with every other. So you can create 1:n and n:m relations. Before you can relate objects. Both object must be saved first, but only one time.

```javascript
	var book = Storage.getObject("book",0);
	var page = Storage.getObject("page");
	var page2 = Storage.getObject("page");
	var author = Storage.getObject("author");
	
	//must be saved once, before you can relate
	Storage.storeObjects([node,childnode,childnode2]);
	
	//then relate
	Storage.relateObjects(book,page);
	Storage.relateObjects(book,page2);
	Storage.relateObjects(book,author);
	
```

# get related objects

getRelatedObjects will return an array with all objects from a type which were related to this object

```javascript

	//to get all related objects of a type "page"
	var ar = Storage.getRelatedObjects(book,"page"); // returns the two page from the example above
	var page = ar[0];
	
	
	//return the first related object of the type
	var page = Storage.getRelatedObject(book,"page");
	
```

# get solve objectrelations

if you want to remove an relation between two objects, for example you want to remove a page just call :

```javascript

	//remove a relation
	Storage.solveRelation(book,page); 
	
	
	//or remove all relations from a type
	Storage.solveRelations(book,"page"); 
	//this book has no pages anymore

```
# save an image as object

you can save an Image from your dom

```html
<img id="googleIcon" alt="The Scream" width="220" height="277" style="border:1px solid #d3d3d3;" src="https://www.google.de/images/srpr/logo11w.png">
<img id="emptyimage" alt="The Scream" width="220" height="277" style="border:1px solid #d3d3d3;" >
```

it is a bit tricky, an for android you need to save it on the second way

## the first way (works on most browsers, but not on android shipped browser)
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


##the second way, works also on android

```javascript

	//at the beginning grab the img 
	var img=document.getElementById("googleIcon");
	
	//save the data of an image as an attribute of an object
	var myImage = Storage.getObject("myimages"); 
	myImage.description = "googles icon";
	
	//instead of saving the imagedata directly in the object we save the image as rawdata
	var  imageData= Storage.imgToData(img);
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

this should work on every browser

# future plans

1. save files
2. better integration of image and file loading / saving
3. small search functionalyties, (LIKE / WHERE key=)

if you have a good idea let me know ;)


License
==========
Storage.js
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
<img alt="Creative Commons Lizenzvertrag" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/4.0/80x15.png" />
</a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Storage.js</span> by 
<a xmlns:cc="http://creativecommons.org/ns#" href="app-impact.net" property="cc:attributionName" rel="cc:attributionURL">Simon Schweizer</a>
 is licensed under a  
 <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
Creative Commons Attribution - Share Alike 4.0 International License.
 </a>.
 
 