const accents = require('remove-accents');
const functions = require('firebase-functions');

class SearchTagger {
    constructor(options) {
        let { minimum, maximum, removeAccents } = options || {}
        this.minimum = minimum || 3;
        this.maximum = maximum || 10;
        this.removeAccents = removeAccents || true;
    }

    searchTagsOf(...keywords) {
        let result = [];
        keywords.forEach(keyword => {
            let tags = this._makeTags(keyword);
            result.push(tags);
        })
        return this._flatten(result);
    }

    _makeTags(keyword) {
        if (typeof keyword !== 'string' && !(keyword instanceof String)) {
            return [];
        }

        if (keyword.length < this.minimum) {
            return [];
        }

        if (this.removeAccents) {
            keyword = accents.remove(keyword);
        }
        keyword = keyword.trim()
        keyword = keyword.toLowerCase();

        var result = [];

        for (var i = this.minimum; i <= keyword.length && i <= this.maximum; i++) {
            result.push(keyword.substr(0, i));
        }

        return result;
    }

    _flatten(arr) {
        let self = this;
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? self._flatten(toFlatten) : toFlatten);
        }, []);
    }
}


module.exports = SearchTagger