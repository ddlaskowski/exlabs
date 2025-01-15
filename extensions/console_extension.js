var consoleLogUtility = {
	colors: {
		good: "\033[0;32m",
		bad: "\033[0;31m",
		info: "\033[0;37m",
		object: "\033[0;33m",
		array: "\033[0;33m",
		default: "\033[0;39m"
	},
	consoleLog: function(content){
		var description = "";
		if (consoleLogUtility.extraDescription && typeof consoleLogUtility.extraDescription === "string")
		{
			description = consoleLogUtility.outputStringType+consoleLogUtility.extraDescription;
		}
		consoleLogUtility.saveToLogfile(consoleLogUtility.outputStringType + consoleLogUtility.getDateTime()+": " + description + content + consoleLogUtility.colors['default']);
		return console.log(consoleLogUtility.outputStringType + consoleLogUtility.getDateTime()+": " + description + content + consoleLogUtility.colors['default']);	
	},
	defaultLengthForDirectPrint: 100,
	extraDescription: false,
	outputStringType: "\033[0;39m",
	recognizeExtraArgument: (contentType) => {
		if (contentType && typeof contentType === "number" && !isNaN(contentType) &&  parseInt(contentType)>0)
		{
			consoleLogUtility.defaultLengthForDirectPrint = contentType;
			return true;
		}
		if (contentType && typeof contentType === "string")
		{
			for (let [key, value] of Object.entries(consoleLogUtility.colors)) {
	  		if(key === contentType)
	  		{
	  			consoleLogUtility.outputStringType = consoleLogUtility.colors[contentType];
	  			consoleLogUtility.markRecordType(contentType);
	  			return true;
	  		}
			}
			if ((consoleLogUtility.colors[contentType] && consoleLogUtility.outputStringType !== consoleLogUtility.colors[contentType]) || !consoleLogUtility.colors[contentType])
			{
				consoleLogUtility.extraDescription = consoleLogUtility.outputStringType + contentType;
				//consoleLogUtility.outputStringType = consoleLogUtility.colors.default;
				return false;
			}					
		}
		else
		{
			 //consoleLogUtility.outputStringType = consoleLogUtility.colors.default;
			 return false;
		}

	},
	arrayToString: (inputArray) => {
		setType = () => {
			if (consoleLogUtility.outputStringType !== consoleLogUtility.colors.default)
			{
				return consoleLogUtility.outputStringType;
			}
			else
			{
				return consoleLogUtility.colors.array;
			}
		}
		let arrayToConsoleLog = {};
		let type = setType();
		arrayToConsoleLog.array = inputArray;
		arrayToConsoleLog.arrayLength = arrayToConsoleLog.array.length;
		if (arrayToConsoleLog.arrayLength <= consoleLogUtility.defaultLengthForDirectPrint)
		{
			returnArrayValues = () => {
				let outputString = "\n"+ type + "[";
					for (var i = 0; i <= arrayToConsoleLog.arrayLength-1; i++) {				
						outputString = outputString + "\n\t"+ type + "[" + i + "]: " + consoleLogUtility.colors.info + arrayToConsoleLog.array[i];
					}
				outputString = outputString + "\n"+type+"]";
				return outputString;
			}
			let stringForConsole = "\n"+type + "Array Length: " + arrayToConsoleLog.arrayLength + returnArrayValues();
			return stringForConsole;
		}
		arrayToConsoleLog.firstValue = arrayToConsoleLog.array[0];
		arrayToConsoleLog.lastValue = arrayToConsoleLog.array[arrayToConsoleLog.array.length-1];
		arrayToConsoleLog.typesInside = arrayToConsoleLog.array.map((value, index)=>{
			return typeof value;
		});
		arrayToConsoleLog.countTypesRatio = (inputArray) => {
			let typesRatioObject = {array: 0, boolean: 0, function: 0, NaN: 0, null: 0, number: 0, object: 0, string: 0, undefined: 0};
			for (var i = arrayToConsoleLog.arrayLength - 1; i >= 0; i--) {
				if (inputArray[i] === "object")
				{
					if (Array.isArray(arrayToConsoleLog.array[i]) === true)
					{
						++typesRatioObject.array;
					}
					else
					{
						if (arrayToConsoleLog.array[i] === null)
						{
							++typesRatioObject.null;
						}
						else
						{							
							++typesRatioObject.object;
						}
					}
				}
				else
				{
					if (inputArray[i] === "number")
					{
						if (isNaN(arrayToConsoleLog.array[i]))
						{
							++typesRatioObject.NaN;
						}
						else
						{
							++typesRatioObject[inputArray[i]];
						}
					}

					else
					{
						++typesRatioObject[inputArray[i]];
					}					
				}				
			}
			return typesRatioObject;
		};
		arrayToConsoleLog.typesRatio = arrayToConsoleLog.countTypesRatio(arrayToConsoleLog.typesInside);
		arrayToConsoleLog.createOutputString = () =>
		{			
			createContentString = (typesRatio) => {
				let contentString = {};				
				contentString.array= "\n"+type + "\tarray: " +	typesRatio.array;
				contentString.boolean = "\n"+type + "\tboolean: " + typesRatio.boolean;
				contentString['function'] = "\n"+type + "\tfunction: " + typesRatio['function'];
				contentString.NaN = "\n"+type + "\tNaN: " + typesRatio.NaN;
				contentString.null = "\n"+type + "\tnull: " + typesRatio.null;
				contentString.number = "\n"+type + "\tnumber: " + typesRatio.number;
				contentString.object= "\n"+ type + "\tobject: " +	typesRatio.object;
				contentString.string = "\n"+type + "\tstring: " + typesRatio.string;
				contentString.undefined = "\n"+type + "\tundefined: " + typesRatio.undefined;
				let contentMix = "";
				for (let [key, value] of Object.entries(typesRatio)) {
		  		if (value !== 0)
		  		{
		  			contentMix = contentMix + contentString[key];
		  		}
				}
				let contentRatioString = "\n"+type + " Content Ratio:" + contentMix;
				return contentRatioString;
			}

			let contentString = createContentString(arrayToConsoleLog.typesRatio);
			let stringForConsole = "\n"+type + "arrayLength: " + arrayToConsoleLog.arrayLength 
			+ "\n"+type + " [0]: " + arrayToConsoleLog.firstValue 
			+ "\n"+type + "  . " 
			+ "\n"+type + "  . " 
			+ "\n"+type + "  . " 
			+ "\n"+type + "["+ (arrayToConsoleLog.arrayLength-1) + "]: " + arrayToConsoleLog.lastValue + contentString;
			return stringForConsole;
		};
		arrayToConsoleLog.outputString = arrayToConsoleLog.createOutputString();
		return arrayToConsoleLog.outputString;
	},
	//OBJECTS TO STRING CONSOLE LOG UTILITY
	objectToString: (inputObject) => {
		setType = () => {
			if (consoleLogUtility.outputStringType !== consoleLogUtility.colors.default)
			{
				return consoleLogUtility.outputStringType;
			}
			else
			{
				return consoleLogUtility.colors.array;
			}
		}
		let arrayToConsoleLog = {};
		let type = setType();
		let objectToConsoleLog = {};
		objectToConsoleLog.object = inputObject;
		objectToConsoleLog.countObjectLength = (inputObject) => {
			let counter = 0;
			for (let [key, value] of Object.entries(inputObject)) {
	  		++counter;
			}
			return counter;
		};
		objectToConsoleLog.objectLength = objectToConsoleLog.countObjectLength(objectToConsoleLog.object);
		if (objectToConsoleLog.objectLength <= consoleLogUtility.defaultLengthForDirectPrint)
		{
			returnObjectValues = () => {
				let outputString = "\n"+ type + "{";
				for (let [key, value] of Object.entries(objectToConsoleLog.object)) {					
					outputString = outputString + "\n\t"+ type + key + ": " + consoleLogUtility.colors.info + value + ","
				}
				outputString = outputString + "\n"+type+"}";
				return outputString;

			}
			let stringForConsole = "\n"+type + "Object Length: " + objectToConsoleLog.objectLength + returnObjectValues();
			return stringForConsole;
		}
		if (objectToConsoleLog.objectLength > consoleLogUtility.defaultLengthForDirectPrint)
		objectToConsoleLog.countTypesRatio = (inputObject) => {
			let typesRatioObject = {array: 0, boolean: 0, function: 0, NaN: 0, null: 0, number: 0, object: 0, string: 0, undefined: 0}
			for (var i = objectToConsoleLog.objectLength - 1; i >= 0; i--) {
				if (inputObject.typesArray[i] === "object")
				{
					if (Array.isArray(objectToConsoleLog.object[inputObject.keyArray[i]]) === true)
					{
						++typesRatioObject.array;
					}
					else
					{
						if(objectToConsoleLog.object[inputObject.keyArray[i]] === null)
						{
							++typesRatioObject.null;
						}
						else
						{
							++typesRatioObject.object;
						}
						
					}
				}
				else
				{
					if (inputObject.typesArray[i] === "number")
					{
						if (isNaN(objectToConsoleLog.object[inputObject.keyArray[i]]))
						{
							++typesRatioObject.NaN;
						}
						else
						{
							++typesRatioObject[inputObject.typesArray[i]];
						}
					}
					else
					{
						++typesRatioObject[inputObject.typesArray[i]];
					}					
				}		
			}
			return typesRatioObject;
		};

		objectToConsoleLog.checkContentTypes = (inputObject) => {
			let counter = 0;
			let contentType = {};
			contentType.keyArray = [];
			contentType.typesArray = [];
			for (let [key, value] of Object.entries(inputObject)) {
				contentType.typesArray[counter] = typeof value;
				contentType.keyArray[counter] = key;
	  		++counter;
			}
			return contentType;
		};

		objectToConsoleLog.typesInside = objectToConsoleLog.checkContentTypes(objectToConsoleLog.object);
		objectToConsoleLog.typesRatio = objectToConsoleLog.countTypesRatio(objectToConsoleLog.typesInside);
		
		objectToConsoleLog.createOutputString = () =>
		{
			createContentString = (typesRatio) => {
				let contentString = {};				
				contentString.array= "\n"+type + "\tarray: " +	typesRatio.array ;
				contentString.boolean = "\n"+type + "\tboolean: " + typesRatio.boolean;
				contentString['function'] = "\n"+type + "\tfunction: " + typesRatio['function'];
				contentString.NaN = "\n"+type + "\tNaN: " + typesRatio.NaN;
				contentString.null = "\n"+type + "\tnull: " + typesRatio.null;
				contentString.number = "\n"+type + "\tnumber: " + typesRatio.number;
				contentString.object= "\n"+ type + "\tobject: " +	typesRatio.object;
				contentString.string = "\n"+type + "\tstring: " + typesRatio.string;
				contentString.undefined = "\n"+type + "\tundefined: " + typesRatio.undefined;
				let contentMix = "";
				for (let [key, value] of Object.entries(typesRatio)) {
		  		if (value !== 0)
		  		{
		  			contentMix = contentMix + contentString[key];
		  		}
				}
				let contentRatioString = "\n"+type + " Content Ratio:" + contentMix;
				return contentRatioString;
			}

			let contentString = createContentString(objectToConsoleLog.typesRatio);
			let stringForConsole = "\n"+type + "Object Length: " + objectToConsoleLog.objectLength + contentString;
			return stringForConsole;
		};
		objectToConsoleLog.outputString = objectToConsoleLog.createOutputString();
		return objectToConsoleLog.outputString;
	},
	getDateTime: () => 
	{
		var date = new Date();
		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;

		return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
	},
	markRecordType: (type) =>
	{
		const fs = require("fs");
		let counterData = fs.readFileSync('./logs/counter.log').toString();
		let ArrayOfCounts = counterData.split(',');
		switch (type) {
	  case 'good':
	    ArrayOfCounts[0] = ++ArrayOfCounts[0];
	    break;
	  case 'bad':
	    ArrayOfCounts[1] = ++ArrayOfCounts[1];
	    break;
	  case 'info':
	    ArrayOfCounts[2] = ++ArrayOfCounts[2];
	    break;
	  case 'object':
	    ArrayOfCounts[3] = ++ArrayOfCounts[3];
	    break;
	 	case 'array':
		    ArrayOfCounts[4] = ++ArrayOfCounts[4];
	    break;
	  case 'default':
	    ArrayOfCounts[5] = ++ArrayOfCounts[5];
	    break;
		}
		fs.writeFile('./logs/counter.log', ArrayOfCounts.join(','), (err)=>{if (err) exports.cL(err, 'bad')});
		//var log = fs.createWriteStream('./logs/kingdom.log', {flags: 'a'});
		//log.end(content + "\n");	
	},
	saveToLogfile: (content) =>
	{
		const fs = require("fs");
		var log = fs.createWriteStream('./logs/server.log', {flags: 'a'});
		log.end(content + "\n");	
	},



};

exports.cL = function (valueToConsoleLog, maxLengthForDirectPrintObjectsAndArrays, descriptionOfValue) 
{
	if (!descriptionOfValue || !maxLengthForDirectPrintObjectsAndArrays)
	{
		consoleLogUtility = { ...consoleLogUtility,
			defaultLengthForDirectPrint: 100,
			extraDescription: false,
			outputStringType: "\033[0;39m",
		}
	}
	if (descriptionOfValue)
	{
		consoleLogUtility.recognizeExtraArgument(descriptionOfValue);
	}
	if (maxLengthForDirectPrintObjectsAndArrays)
	{
		consoleLogUtility.recognizeExtraArgument(maxLengthForDirectPrintObjectsAndArrays);
	}

	if (valueToConsoleLog)
	{
		let type = typeof valueToConsoleLog;
		if (type === "string") 
		{
			//console.log for a string
			consoleLogUtility.consoleLog(valueToConsoleLog, "info");
		}
		if (type === "object")
		{
			if(Array.isArray(valueToConsoleLog) === true)
			{
				//console.log for an array	
				consoleLogUtility.consoleLog(consoleLogUtility.arrayToString(valueToConsoleLog), 'array');
			}
			else
			{
				if (valueToConsoleLog === null)
				{
					//console.log for null	
					consoleLogUtility.consoleLog(valueToConsoleLog, "info");
				}
				else
				{
					//console.log for an object
					consoleLogUtility.consoleLog(consoleLogUtility.objectToString(valueToConsoleLog), 'object');
				}
			}
		}
		if (type === "number")
		{
			if (isNaN(valueToConsoleLog))
			{
				consoleLogUtility.consoleLog(valueToConsoleLog, "bad");
			}
			else
			{
				consoleLogUtility.consoleLog(valueToConsoleLog, "info");
			}
			//console.log for number
			
		}
		if (type === "boolean")
		{
			//console.log for boolean
			consoleLogUtility.consoleLog(valueToConsoleLog, "info");
		}
		if (type === "function")
		{
			//console.log for function
			consoleLogUtility.consoleLog("Input value is a function.", "info");
		}
		if (type === "undefined")
		{
			//console.log for an undefined
			consoleLogUtility.consoleLog(type, "bad");
		}
	}
	else
	{
		consoleLogUtility.consoleLog("Console Extension (cL) executed without any arguments.", "bad");
	}
}