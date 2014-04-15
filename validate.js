/*
 * validate.js 1.2.1
 * Author:delong
 * Desc:THIS js is used to validate form
 * 
 * 
 * (C) COPYRIGHT IBM Corporation 2013  
 * All Rights Reserved.
 * 
 * Licensed Materials-Property of IBM   
 */
(function(window, document, undefined) {
	/*
	 * If you would like an application-wide config, change these defaults.
	 * Otherwise, use the setMessage() function to configure form specific
	 * messages.
	 */

	var defaults = {
		messages : {
			required : _rb.validate.message.required,
			matches : _rb.validate.message.matches,
			valid_email : _rb.validate.message.valid_email,
			min_length : _rb.validate.message.min_length,
			max_length : _rb.validate.message.max_length,
			numeric : _rb.validate.message.numeric,
			integer : _rb.validate.message.integer,
			valid_phone : _rb.validate.message.valid_phone,
			password : _rb.validate.message.password,
			decimal : _rb.validate.message.decimal,
			greater_than_zero : _rb.validate.message.positiveNumber,
			greater_than : _rb.validate.message.morethan,
			either : _rb.cloud.account.telHint,
			valid_name : _rb.validate.message.valid_name,
			late_than : _rb.validate.message.late_than,
			alpha_numeric : _rb.validate.message.alpha_numeric,
			less_or_equal_than :_rb.validate.message.less_or_equal_than,
			money:_rb.validate.message.money,
			valid_mobilephone:_rb.validate.message.valid_mobilephone,
			valid_department:_rb.validate.message.valid_name,
			less_than:_rb.validate.message.lessthan
		},
		callback : function(errors) {
			for ( var i = 0, len = errors.length; i < len; i++) {
				var input = errors[i].obj;
				var next = getbox(input.nextSibling);
				if (next) {
					next.innerHTML = errors[i].message;
					next.style.display = "block";
				} else {
					var a = document.createElement('div');
					a.className = 'validator_result';
					a.innerHTML = errors[i].message;
					input.parentNode.appendChild(a);
				}
			}
		},
		focusfun : function(field) {
			var input = field.obj;
			var next = getbox(input.nextSibling);
			if (next) {
				next.innerHTML = '';
			}
		}
	};
	function getbox(next) {
		if (!next) {
			return
		}
		;
		if (next.nodeType == 3
				|| (next.className && next.className
						.indexOf('validator_result') < 0)) {
			next = next.nextSibling;
			return getbox(next);
		}
		return next;
	}
	;
	/*
	 * Define the regular expressions that will be used
	 */

	var ruleRegex = /^(.+?)\[(.+)\]$/, 
	numericRegex = /^[0-9]+$/, 
	integerRegex = /^\-?[0-9]+$/, 
	decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, 
	moneyRegex = /^\-?[0-9]*\.?[0-9]{0,2}$/, 
	emailRegex = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)+$/,
	alphaRegex = /^[a-z]+$/i, 
	alphaNumericRegex = /^[a-z0-9]+$/i, 
	alphaDashRegex = /^[a-z0-9_\-]+$/i, 
	naturalRegex = /^[0-9]+$/i, 
	naturalNoZeroRegex = /^[1-9][0-9]*$/i, 
	ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, 
	base64Regex = /[^a-zA-Z0-9\/\+=]/i, 
	numericDashRegex = /^[\d\-\s]+$/, 
	urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, 
	phoneRegex = /(^(\(?\+?\d{1,3}\)?-)?(\d{3,4}-)?\d{7,8})(-\d{0,6})?$|(1(3|4|5|8)[0-9]{9})$/, 
	passwordRegex = /(?![0-9]+$)(?![a-zA-Z]+$)(?![-=\/\[\]`\;',.\~!@#$%^&*()_+\|{}:"<>?]+$)[0-9A-Za-z-=\/\[\]`\;',.\~!@#$%^&*()_+\|{}:"<>?]+$/, 
	nameRegex = /^([\u4e00-\u9fa5a-zA-Z0-9]*)$/,
	mobilephoneRegex = /(1(3|4|5|8)[0-9]{9})$/;
	departmentRegex = /^([\u4e00-\u9fa5a-zA-Z0-9·._\-\[\]\{\}\(\)\【\】\（\）]*)$/;
	/*
	 * The exposed public object to validate a form:
	 * 
	 * @param formName - String - The name attribute of the form (i.e. <form
	 * name="myForm"></form>) @param fields - Array - [{ name: The name of the
	 * element (i.e. <input name="myField" />) display: 'Field Name' rules:
	 * required|matches[password_confirm] }] @param callback - Function - The
	 * callback after validation has been performed and occurred errors.
	 * @argument errors - An array of validation errors @argument event - The
	 * javascript event
	 * 
	 * @param focusfun - Function - The callback after input focus
	 * 
	 * @paeam submitHandler - object - The handler bind the form submit event
	 * 
	 * submitfun - Function - The function after validation has been performed
	 * and no error.
	 */

	var FormValidator = function(formName, fields, submitHandler, submitfun,
			callback, focusfun) {
		this.focusfun = focusfun || defaults.focusfun;
		this.callback = callback || defaults.callback;
		this.errors = [];
		this.fields = {};
		this.form = document.forms[formName] || {};
		this.messages = {};
		this.handlers = submitHandler;
		this.submitfun = submitfun;
		for ( var i = 0, fieldLength = fields.length; i < fieldLength; i++) {
			var field = fields[i];

			// If passed in incorrectly, we need to skip the field.
			if (!field.name || !field.rules) {
				continue;
			}

			/*
			 * Build the master fields array that has all the information needed
			 * to validate
			 */
			this.fields[field.name] = {
				name : field.name,
				display : field.display || field.name,
				rules : field.rules,
				id : null,
				type : null,
				value : null,
				checked : null,
				obj : this.form[field.name]
			};

			this.form[field.name].onblur = (function(that, f) {
				return function() {
					try {
						// return that._validateFieldAlone(f);
						if (that._validateFieldAlone(f)) {
							window.blurVal = true;
						} else {
							window.blurVal = false;
						}
						return that._validateFieldAlone(f);
					} catch (e) {
					}
				};
			})(this, this.fields[field.name]);
			this.form[field.name].onfocus = (function(that, f) {
				return function() {
					try {
						return that.focusfun(f);
					} catch (e) {
					}
				};
			})(this, this.fields[field.name]);
		}
		/*
		 * Attach an event callback for the form submission
		 */

		var _onsubmit = this.form.onsubmit;

		this.form.onsubmit = (function(that) {
			return function(event) {
				try {
					// return that._validateForm(event) && (_onsubmit ===
					// undefined || _onsubmit()) && that.submitfun() ;
					if (that._validateForm(event)) {
						if (_onsubmit) {
							_onsubmit();
						}
						;
						if (that.submitfun) {
							that.submitfun();
						}
						;
					}
					;
				} catch (e) {
				}
			};
		})(this);
		if (this.handlers) {
			this.handlers = document.getElementById(this.handlers);
			if (this.handlers.addEventListener) {
				this.handlers.addEventListener('click', this.form.onsubmit,
						false);
			} else if (this.handlers.attachEvent) {
				this.handlers.attachEvent('onclick', this.form.onsubmit);
			}
		}
	},

	attributeValue = function(element, attributeName) {
		var i;

		if ((element.length > 0) && (element[0].type === 'radio')) {
			for (i = 0; i < element.length; i++) {
				if (element[i].checked) {
					return element[i][attributeName];
				}
			}

			return;
		}

		return element[attributeName];
	};

	/*
	 * @public Sets a custom message for one of the rules
	 */

	FormValidator.prototype.setMessage = function(rule, message) {
		this.messages[rule] = message;

		// return this for chaining
		return this;
	};

	/*
	 * @public Registers a callback for a custom rule (i.e.
	 * callback_username_check)
	 */

	FormValidator.prototype.registerCallback = function(name, handler) {
		if (name && typeof name === 'string' && handler
				&& typeof handler === 'function') {
			this.handlers[name] = handler;
		}

		// return this for chaining
		return this;
	};
	/*
	 * @private Runs the validation when the form input blur.
	 */
	FormValidator.prototype._validateFieldAlone = function(fieldalone) {
		this.errors = [];
		var element = this.form[fieldalone.name];
		if (element && element !== undefined) {
			var field = fieldalone || {};
			field.id = attributeValue(element, 'id');
			field.type = (element.length > 0) ? element[0].type : element.type;
			field.value = attributeValue(element, 'value');
			field.checked = attributeValue(element, 'checked');
			this._validateField(field);
			if (this.errors.length > 0) {
				if (typeof this.callback === 'function') {
					this.callback(this.errors);
				}
				return false;
			} else {
				return true;
			}
		}
	};
	/*
	 * @private Runs the validation when the form is submitted.
	 */

	FormValidator.prototype._validateForm = function(event) {
		this.errors = [];
		for ( var key in this.fields) {
			if (this.fields.hasOwnProperty(key)) {
				var field = this.fields[key] || {}, element = this.form[field.name];
				if (element && element !== undefined) {
					field.id = attributeValue(element, 'id');
					field.type = (element.length > 0) ? element[0].type
							: element.type;
					field.value = attributeValue(element, 'value');
					field.checked = attributeValue(element, 'checked');
					/*
					 * Run through the rules for each field.
					 */

					this._validateField(field);
				}
			}
		}
		if (typeof this.callback === 'function') {
			if (this.errors.length > 0) {
				this.callback(this.errors, event);
			}
		}
		if (this.errors.length > 0) {
			if (event && event.preventDefault) {
				event.preventDefault();
			} else {
				// IE6 doesn't pass in an event parameter so return false
				return false;
			}
			return false;
		} else {
			return true;
		}
	};

	/*
	 * @private Looks at the fields value and evaluates it against the given
	 * rules
	 */

	FormValidator.prototype._validateField = function(field) {
		var rules = field.rules.split('|');
		/*
		 * If the value is null and not required, we don't need to run through
		 * validation
		 */
		if (field.rules.indexOf('either') === -1) {
			if (field.rules.indexOf('required') === -1
					&& (!field.value || field.value === '' || field.value === undefined)) {
				return;
			}
		}
		/*
		 * Run through the rules and execute the validation methods as needed
		 */

		for ( var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
			var method = rules[i], param = null, failed = false, defaultVal = null, parts = ruleRegex
					.exec(method);
			/*
			 * If the rule has a parameter (i.e. matches[param]) split it out
			 */

			if (parts) {
				method = parts[1];
				param = parts[2];
			}

			/*
			 * If the hook is defined, run it to find any validation errors
			 */

			if (typeof this._hooks[method] === 'function') {
				if (method == "either") {
					var result = this._hooks[method].apply(this, [ field,
							param, defaultVal ]);
					if (!result[0]) {
						failed = true;
					} else {
						if (!result[1]) {
							break;
						}
					}
				} else {
					if (!this._hooks[method].apply(this, [ field, param ])) {
						failed = true;
					}
				}
			} else if (method.substring(0, 9) === 'callback_') {
				// Custom method. Execute the handler if it was registered
				method = method.substring(9, method.length);

				if (typeof this.handlers[method] === 'function') {
					if (this.handlers[method].apply(this, [ field.value ]) === false) {
						failed = true;
					}
				}
			}

			/*
			 * If the hook failed, add a message to the errors array
			 */

			if (failed) {
				// Make sure we have a message for this rule
				var source = this.messages[method] || defaults.messages[method], message = 'An error has occurred with the '
						+ field.display + ' field.';

				if (source) {
					message = source.replace('%s', field.display);

					if (param) {
						message = message
								.replace(
										'{d}',
										(this.fields[param]) ? this.fields[param].display
												: param);
					}
				}
				this.errors.push({
					id : field.id,
					name : field.name,
					message : message,
					rule : method,
					obj : field.obj
				});
				// Break out so as to not spam with validation errors (i.e.
				// required and valid_email)
				break;
			}
		}
	};

	/*
	 * @private Object containing all of the validation hooks
	 */

	FormValidator.prototype._hooks = {
		required : function(field, matchString) {
			var value = field.value;
			if ((field.type === 'checkbox') || (field.type === 'radio')) {
				return (field.checked === true);
			}
			if (matchString) {
				return (value !== matchString);
			} else {
				return (value !== null && value !== '');
			}
		},

		matches : function(field, matchName) {
			var el = this.form[matchName];

			if (el) {
				return field.value === el.value;
			}

			return false;
		},

		either : function(field, eitherName) {
			var el = this.form[eitherName];
			if (el) {
				return [ (!!el.value || !!field.value), !!field.value ];
			}
			return false;
		},

		valid_email : function(field) {
			return emailRegex.test(field.value);
		},

		valid_name : function(field) {
			return nameRegex.test(field.value);
		},
		valid_department : function(field) {
			return departmentRegex.test(field.value);
		},
		valid_emails : function(field) {
			var result = field.value.split(",");

			for ( var i = 0; i < result.length; i++) {
				if (!emailRegex.test(result[i])) {
					return false;
				}
			}

			return true;
		},

		min_length : function(field, length) {
			if (!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length >= parseInt(length, 10));
		},

		max_length : function(field, length) {
			if (!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length <= parseInt(length, 10));
		},

		late_than : function(field, dateName) {

			var el = this.form[dateName];
			if (el) {
				var sVal = el.value.split('-');
				var eVal = field.value.split('-');
				for ( var i = 0; i < 3; i++) {
					sVal[i] = parseInt(sVal[i])
					eVal[i] = parseInt(eVal[i])
				}
				if (sVal[0] < eVal[0]) {
					return true;
				} else if (sVal[0] == eVal[0]) {
					if (sVal[1] < eVal[1]) {
						return true;
					} else if (sVal[1] == eVal[1]) {
						if (sVal[2] <= eVal[2]) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
			return false;
		},

		exact_length : function(field, length) {
			if (!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length === parseInt(length, 10));
		},

		greater_than : function(field, param) {
			if (!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) > parseFloat(param));
		},

		greater_than_zero : function(field) {
			if (!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) >= 0);
		},
		money : function(field) {
			if (!moneyRegex.test(field.value)) {
				return false;
			}
			return true;
		},
		less_than : function(field, param) {
			if (!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) < parseFloat(param));
		},
		less_or_equal_than : function(field, param) {
			if (!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) <= parseFloat(param));
		},

		alpha : function(field) {
			return (alphaRegex.test(field.value));
		},

		alpha_numeric : function(field) {
			return (alphaNumericRegex.test(field.value));
		},

		alpha_dash : function(field) {
			return (alphaDashRegex.test(field.value));
		},

		numeric : function(field) {
			return (decimalRegex.test(field.value));
		},

		integer : function(field) {
			return (integerRegex.test(field.value));
		},

		decimal : function(field) {
			return (decimalRegex.test(field.value));
		},

		is_natural : function(field) {
			return (naturalRegex.test(field.value));
		},

		is_natural_no_zero : function(field) {
			return (naturalNoZeroRegex.test(field.value));
		},

		valid_ip : function(field) {
			return (ipRegex.test(field.value));
		},

		valid_base64 : function(field) {
			return (base64Regex.test(field.value));
		},

		valid_url : function(field) {
			return (urlRegex.test(field.value));
		},

		valid_credit_card : function(field) {
			// Luhn Check Code from https://gist.github.com/4075533
			// accept only digits, dashes or spaces
			if (!numericDashRegex.test(field.value))
				return false;

			// The Luhn Algorithm. It's so pretty.
			var nCheck = 0, nDigit = 0, bEven = false;
			var strippedField = field.value.replace(/\D/g, "");

			for ( var n = strippedField.length - 1; n >= 0; n--) {
				var cDigit = strippedField.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}

				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		is_file_type : function(field, type) {
			if (field.type !== 'file') {
				return true;
			}

			var ext = field.value.substr((field.value.lastIndexOf('.') + 1)), typeArray = type
					.split(','), inArray = false, i = 0, len = typeArray.length;

			for (i; i < len; i++) {
				if (ext == typeArray[i])
					inArray = true;
			}

			return inArray;
		},

		valid_phone : function(field) {
			return phoneRegex.test(field.value);
		},
		valid_mobilephone : function(field) {
			return mobilephoneRegex.test(field.value);
		},
		password : function(field) {
			return passwordRegex.test(field.value);
		}
	};

	window.FormValidator = FormValidator;
})(window, document);
