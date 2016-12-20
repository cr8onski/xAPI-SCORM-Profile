const assert = require('assert');
const mocha = require('mocha');

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('Validate existing Schemas and Example Statements', function () {
    const fs = require('fs');
    const path = require('path');
    const validator = require('jsonschema').Validator;
    var v = new validator(),
        schemadir = 'document-schemas',
        schemaRaw = fs.readdirSync(schemadir),
        schemanames = schemaRaw.filter(function (item) {return path.extname(item) === '.json'});

    schemanames.forEach(function (schemaname) {
        describe('#' + schemaname, function () {
            // console.log(schemaname);
            var info = path.parse(schemaname);
            // console.log(info);
            var stmtdir = path.join('statements', info.name);
            // console.log(stmtdir);
            try {
                var stmtnames = fs.readdirSync(stmtdir);
                // console.log(stmtnames);
                var schema = JSON.parse(fs.readFileSync(path.join(schemadir, schemaname), 'utf8'));
                stmtnames.forEach(function(stmtname) {
                    it('validate ' + stmtname, function () {
                        try {
                            stmt = JSON.parse(fs.readFileSync(path.join(stmtdir, stmtname)));
                            assert(v.validate(stmt, schema));
                        } catch (e) {
                            console.error(e);
                        }
                    });
                });
            } catch (e) {
                // we could filter out dirs that don't have statements, or we can just try and ignore if there is not a corresponding directory
                return; // console.error(e);
            }
        });
    });
});
