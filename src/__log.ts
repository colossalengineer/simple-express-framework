class Logger {
	constructor() {}

	levels = ["INFO", "DEBUG", "WARN", "ERROR"];

	_getCallerFile = function () {
		try {
			var err = new Error();
			var callerfile;
			var currentfile;

			Error.prepareStackTrace = function (err, stack): NodeJS.CallSite[] {
				return stack;
			};
			// @ts-ignore
			currentfile = err.stack.shift().getFileName();

			while (err.stack.length) {
				// @ts-ignore
				callerfile = err.stack.shift().getFileName();

				if (currentfile !== callerfile) {
					var file = callerfile.split("\\");
					return file[file.length - 1];
				}
			}
		} catch (err) {}
		return "undefined";
	};

	createline(length) {
		var line = "";
        // @ts-ignore
		for (var i = 0; i < Math.floor(Config.lineBreak / 2) - length / 2; i++) {
			line += Config.lineBreakChar;
		}
		return line;
	}

	space = " ";

	async addinfomessage(message) {
		var length = message.length;

		var data = `${this.createline(length)} ${message} ${this.createline(
			length
		)}`;

		console.log(data);
	}

	async createlog(level, message, obj?) {
		var data = `${this.dateFormat()} | ${level} | ${this._getCallerFile()} | ${message} | `;
		if (obj) {
			try {
				data += `data: ${JSON.stringify(obj)} |`;
			} catch (e) {
				this.createlog("ERROR", e);
			}
		}
		console.log(data);
	}

	dateFormat() {
		return new Date(Date.now()).toUTCString();
	}

	info(message, obj?) {
		this.createlog("INFO", message, obj);
	}

	debug(message, obj?) {
		this.createlog("DEBUG", message, obj);
	}

	error(message, obj?) {
		this.createlog("ERROR", message, obj);
	}
}
