### Omega Form ###

Simple jQuery form validator

###Features
* Validates text fields with attribute required
* Validates radio inputs (all elements of group need to have required attribute and reqval="1" on chosen item)


### 1. Setup

Include jQuery and Omega Form plugin files (Bootstrap)

### 2. Build HTML

```html
	<form name="testform" action="test.php">
		<div class="error-wrapper"></div>
		<input type="text" name="test">
		<input type="submit" value="Send">
	</form>

```

### 3. Call the plugin

```html
	$('form[name=testform]').omegaForm();
```

License
------------
The MIT License (MIT)