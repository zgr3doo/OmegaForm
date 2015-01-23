/*
 *	jQuery OmegaForm v.0.1
 *	Copyright (c) 2015 Piotr Zgr3doo Rykala
 *	Licenced under MIT
 */	

if(typeof Object.create !== "function") {
	Object.create = function (obj) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}
(function ($, window, document){

	var OmegaForm = function (form_element){
		var that = {
			url: '',
			ajax_request: true,
			errors: [],
			formData: [],
			error_labels: {
				'main': 'Please correct following errors:',
				'required': 'One of required fields is empty',
				'email': 'Please enter correct email address',
				'radio': 'Radio Button must be set'
			},
			email_regex: new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
		};

		that.helpers = {
			getUnique : function (source_array,attr) {
				var index = {}, array = [], element;

				for(var i = 0, l = source_array.length; i < l; ++i){

					if(typeof attr !== 'undefined'){
						element = source_array[i][attr];
					}
					else{
						element = source_array[i];
					}

					if(index.hasOwnProperty(element)) {
						continue;
					}
					array.push(source_array[i]);
					index[element] = 1;
				}
				return array;
			}
		};

		that.init = function (options, element){
			var base = this;
			that.$element = $(element);
			that.$element.submit(function(event){that.submitForm(event)});
			that.error_labels = $.extend(that.error_labels,options.test);
			that.url = that.$element.attr('action');
			that.loadContent();
		};

		that.setRequest = function (data){
			var fd = new FormData();
			
			for (var key in data) {
				console.log(key, data[key]);
				fd.append(key, data[key]);
			}
			return fd;
		};

		that.submitForm = function (event){
			event.preventDefault();
			that.loadContent();
			that.validate();
		};

		that.loadContent = function (){
			that.formData = [];
			$(that.$element).find('input').each(function(index,current_element){
				if($(current_element).attr('type') === 'submit'){

					// discard
				}
				else if($(current_element).attr('type') === 'radio'){
					if($(current_element).is(':checked')){
						that.formData.push({
							'name': $(current_element).attr('name'),
							'value': ($('input[name='+$(current_element).attr('name')+']:checked').attr('reqval') === '1'),
							'type': $('input[name='+$(current_element).attr('name')+']:checked').attr('type'),
							'required': ($('input[name='+$(current_element).attr('name')+']:checked').attr('required') === 'required')
						});
					}
				}
				else{
					that.formData.push({
						'name': $(current_element).attr('name'),
						'value': $(current_element).val(),
						'type': $(current_element).attr('type'),
						'required': ($(current_element).attr('required') === 'required')
					});
				}
			});
		};

		that.validate = function (){
			that.errors = [];
			for (var id in that.formData) {
				if(that.formData[id].required){
					if(that.formData[id].value === ''){
						$('input[name='+that.formData[id].name+']').addClass('error');
						that.errors.push({'type':'required'});
					}
					else{
						$('input[name='+that.formData[id].name+']').removeClass('error');
					}
				}
				if(that.formData[id].type === 'email'){
					if(!that.email_regex.test(that.formData[id].value)){
						$('input[name='+that.formData[id].name+']').addClass('error');
						that.errors.push({'type':'email'});
					}
					else{
						$('input[name='+that.formData[id].name+']').removeClass('error');
					}
				}
				if(that.formData[id].type === 'radio'){
					if(!that.formData[id].value){
						$('input[name='+that.formData[id].name+']').addClass('error');
						that.errors.push({'type':'radio'});
					}
					else{
						$('input[name='+that.formData[id].name+']').removeClass('error');
					}
				}
			}

			that.errors = that.helpers.getUnique(that.errors,'type');
			that.showErrors();
		};

		that.showErrors = function (){
			that.$element.find('.alert.alert-danger').remove();

			if(that.errors.length){
				var handler;
				if(that.$element.find('.error-wrapper').length){
					that.$element.find('.error-wrapper').append('<div class="alert alert-danger"></div>');
				}
				else{
					that.$element.prepend('<div class="alert alert-danger"></div>');
					
				}
				handler = that.$element.find('.alert.alert-danger');
				handler.append('<h4>'+that.error_labels.main+'</h4>');

				for(var id in that.errors){
					handler.append('<li>'+that.error_labels[that.errors[id].type]+'</li>');
				}
			}
		};

		that.send = function (){
			var base = this;
			// that.validate();

			requestData['context'] = 'register';

			$.ajax({
				url:that.url,
				type:'POST',
				data:base.setRequest(requestData),
				dataType:'json',
				processData: false,
				contentType: false,
				success: function(data){
					
				},
				complete: function(){
					
				},
			});
		};

		return that;
	};

	$.fn.omegaForm = function (options) {
		return this.each(function () {
			if ($(this).data("omegainit") === true) {
				return false;
			}
			$(this).data("omegainit", true);
			var omega = OmegaForm();
			omega.init(options,this);
			$.data(this, "omega", omega);
		});
	};
}(jQuery, window, document));