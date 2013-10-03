function clone(oObject) {
	function OneShotConstructor(){};
	OneShotConstructor.prototype = oObject;
	
	return new OneShotConstructor();
}

function defaultValFor(anything, defaultValue) {
	try {
		return (typeof a !== 'undefined' ? defaultValue : anything); 
	} catch (e) {
		return defaultValue;
	}
}

Object.prototype.__clone = function () {
	return clone.call(this, null);
};

function forEach (oObj, fFunc) {
	var index = 0;
	for (var attrName in oObj) {
		fFunc.apply(oObj[attrName], [attrName, oObj[attrName], index]);
		
		index++;
	}
};

Object.prototype.__forEachAttr = function (fFunc) {
	forEach(this, fFunc);
};

Object.prototype.__inherit = function (oSuperConstructor, bSetSuper) {
	bSetSuper = defaultValFor(bSetSuper, true);
	var self = this;
	
	oSuperConstructor.__forEachAttr(function (attrName, attrValue, index) {
		if (!attrName.startsWith("_")) { //Private properties aren't inherited
			self[attrName] = attrValue;
		}
	});
	
	if (bSetSuper) {
		this.__super = oSuperConstructor;
	}
};

Object.prototype.__superMethod = function (sMethodName, arParams) {
	return this.__super[sMethodName].apply(this, arParams);
}

Object.prototype.__create = function () {
	var object = clone(this);
	
	if (object.__construct != undefined) {
		object.__construct.apply(object, arguments);
	}
	
	return object;
};

Object.prototype.__extend = function (oAdditionalProps) {
	var object = {};
	object.__inherit(this);
	
	oAdditionalProps.__forEachAttr(function (attrName, attrValue, index) {
		object[attrName] = attrValue;
	});
	
	return object;
};


Object.prototype.__instanceOf = function (oType) {
	function OneShotConstructor(){};
	OneShotConstructor.prototype = oType;
	
	return (this instanceof OneShotConstructor || typeof this === oType);
};


String.prototype.startsWith = function (sPrefix) {
	if (sPrefix instanceof String && this instanceof String) {
		return (this.substring(0, sPrefix.length()) == sPrefix);
	}
	
	return false;
};

Object.prototype.endsWith = function (sSuffix) {
	if (sSuffix instanceof String && this instanceof String) {
		return (this.substring(this.length() - sSuffix.length()) == sSuffix);
	}
};

Array.prototype.mathLoop = function (fFunc) {
	var obj = {total: 0, val: 0};
	for (var i = 0; i < this.length; i++) {
		obj.val = this[i];
		fFunc(obj);
	}
	return obj.total;
};

function declare(sName, oObj) {
  arName = sName.split(".");

  var oParentObj = window;
  for (var i = 0; i < arName.length; i++) {
    if (oParentObj[arName[i]] == undefined) {
      oParentObj[arName[i]] = {};
    }

    oParentObj = oParentObj[arName[i]]; 
  }

  for (var oElem in oObj) {
    oParentObj[oElem] = oObj[oElem];
  }
}
