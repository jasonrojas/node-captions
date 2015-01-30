/**
 * Created by ufuk on 30.1.2015.
 */
function InvalidFormatError(message) {
    this.message = message;
    this.stack = new Error().stack;
    this.type = this.name;
}

InvalidFormatError.prototype = Object.create(Error.prototype);
InvalidFormatError.prototype.name = 'InvalidFormatError';

module.exports = InvalidFormatError;