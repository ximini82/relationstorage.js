Storage.js
==========

Storage.js is a small Class that enables you to store objects in the browsers locale storage. You can relate objects to each other.

# get an Object

To work with Storage.js it is neccessary to allocate an object first!

```javascript
	var object = Storage.getObject("nameOfYourClass");
```
This object automatically  has two values:

1.id
2.class

The id is the the unique key for this object, with this class. The class attribute is a string with the name of the class. In this example "nameOfYourClass"

# add something

Then you can add attributes and store the object again.

```javascript
	var object = Storage.getObject("nameOfYourClass");
	object.myvalue = "this is my new value";
	object.andAnother =123;
```

# store object

just : 
```javascript
	Storage.storeObject(object);
```
# how to load an object? easy ;)
you already know this function. You only need the id of the object

```javascript
	var object = Storage.getObject("nameOfYourClass",0);
	
	//remember: you find the id of an object in itself
	var object = Storage.getObject("sample");
	alert(object.id);
```

The "getObject" function loads the object, if you pass an id as a second paramter. If it exists its returns the stored object, else it creates a new object. 

> Notice: if there is not object with this id. The new returned object has probably another id as the given id.






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
 
 