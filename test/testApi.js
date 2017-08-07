var expect  = require('chai').expect;
var setup   = require(__dirname + '/lib/setup');
var request = require('request');

var objects = null;
var states  = null;

var adapterShortName = setup.adapterName.substring(setup.adapterName.indexOf('.')+1);

process.env.NO_PROXY = '127.0.0.1';

describe('Test WEB extension', function() {
    before('Test RESTful API: Start js-controller', function (_done) {
        this.timeout(600000); // because of first install from npm
        var brokerStarted   = false;
        setup.setupController(function () {
            var config = setup.getAdapterConfig();
            // enable adapter
            config.common.enabled = true;
            config.common.loglevel = 'debug';
            config.native.port = 18183;
            setup.setAdapterConfig(config.common, config.native);

            setup.startController(function (_objects, _states) {
                objects = _objects;
                states  = _states;
                // give some time to start server
                setTimeout(function () {
                    _done();
                }, 2000);
            });
        });
    });

    it('Test ' + adapterShortName + ' adapter: Check if adapter started and create upload datapoint', function (done) {
        this.timeout(60000);
        checkConnectionOfAdapter(function (res) {
            if (res) console.log(res);
            expect(res).not.to.be.equal('Cannot check connection');
            objects.setObject('system.adapter.simple-api.0.upload', {
                    common: {
                        "type": "number"
                    },
                    type: 'state'
                },
                function () {
                    done();
                });
        });
    });

    it('Test RESTful API: get - must return value', function (done) {
        request('http://127.0.0.1:18183/get/system.adapter.simple-api.0.alive', function (error, response, body) {
            console.log('get/system.adapter.simple-api.0.alive => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            //{
            //    "val" : true,
            //    "ack" : true,
            //    "ts" : 1455009717,
            //    "q" : 0,
            //    "from" : "system.adapter.simple-api.0",
            //    "lc" : 1455009717,
            //    "expire" : 30000,
            //    "_id" : "system.adapter.simple-api.0.alive",
            //    "type" : "state",
            //    "common" : {
            //      "name" : "simple-api.0.alive",
            //        "type" : "boolean",
            //        "role" : "indicator.state"
            //       },
            //    "native" : {}
            //
            //}

            expect(obj).to.be.ok;
            expect(obj.val).to.be.true;
            expect(obj.ack).to.be.true;
            expect(obj.ts).to.be.ok;
            expect(obj.from).to.equal("system.adapter.simple-api.0");
            expect(obj.type).to.equal("state");
            expect(obj._id).to.equal("system.adapter.simple-api.0.alive");
            expect(obj.common).to.be.ok;
            expect(obj.native).to.be.ok;
            expect(obj.common.name).to.equal("simple-api.0.alive");
            expect(obj.common.role).to.equal("indicator.state");
            done();
        });
    });

    it('Test RESTful API: getPlainValue - must return plain value', function (done) {
        request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.0.alive', function (error, response, body) {
            console.log('getPlainValue/system.adapter.simple-api.0.alive => ' + body);
            expect(error).to.be.not.ok;
            expect(body).equal('true');
            done();
        });
    });

    it('Test RESTful API: set - must set value', function (done) {
        request('http://127.0.0.1:18183/set/system.adapter.simple-api.0.alive?val=false', function (error, response, body) {
            console.log('set/system.adapter.simple-api.0.alive?val=false => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj.val).to.be.false;
            expect(obj.id).to.equal('system.adapter.simple-api.0.alive');
            request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getPlainValue/system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                expect(body).equal('false');
                done();
            });
        });
    });

    it('Test RESTful API: set - must set val', function (done) {
        request('http://127.0.0.1:18183/set/system.adapter.simple-api.0.alive?val=true', function (error, response, body) {
            console.log('set/system.adapter.simple-api.0.alive?val=true => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj.val).to.be.true;
            expect(obj.id).to.equal('system.adapter.simple-api.0.alive');
            request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getPlainValue/system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                expect(body).equal('true');
                done();
            });
        });
    });

    it('Test RESTful API: toggle - must toggle boolean value to false', function (done) {
        request('http://127.0.0.1:18183/toggle/system.adapter.simple-api.0.alive', function (error, response, body) {
            console.log('toggle/system.adapter.simple-api.0.alive => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj.val).to.be.false;
            expect(obj.id).to.equal('system.adapter.simple-api.0.alive');

            request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getPlainValue/system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                expect(body).equal('false');
                done();
            });
        });
    });

    it('Test RESTful API: toggle - must toggle boolean value to true', function (done) {
        request('http://127.0.0.1:18183/toggle/system.adapter.simple-api.0.alive', function (error, response, body) {
            console.log('toggle/system.adapter.simple-api.0.alive => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj.val).to.be.true;
            expect(obj.id).to.equal('system.adapter.simple-api.0.alive');

            request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getPlainValue/system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                expect(body).equal('true');
                done();
            });
        });
    });

    it('Test RESTful API: toggle - must toggle number value to 100', function (done) {
        request('http://127.0.0.1:18183/toggle/system.adapter.simple-api.upload', function (error, response, body) {
            console.log('toggle/system.adapter.simple-api.upload => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj.val).to.be.equal(100);
            expect(obj.id).to.equal('system.adapter.simple-api.upload');

            request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.upload', function (error, response, body) {
                console.log('getPlainValue/system.adapter.simple-api.upload => ' + body);
                expect(error).to.be.not.ok;
                expect(body).equal('100');
                request('http://127.0.0.1:18183/set/system.adapter.simple-api.upload?val=49', function (error, response, body) {
                    console.log('set/system.adapter.simple-api.upload?val=49 => ' + body);
                    request('http://127.0.0.1:18183/toggle/system.adapter.simple-api.upload', function (error, response, body) {
                        console.log('toggle/system.adapter.simple-api.upload => ' + body);
                        expect(error).to.be.not.ok;
                        var obj = JSON.parse(body);
                        expect(obj).to.be.ok;
                        expect(obj.val).to.be.equal(51);
                        expect(obj.id).to.equal('system.adapter.simple-api.upload');

                        request('http://127.0.0.1:18183/getPlainValue/system.adapter.simple-api.upload', function (error, response, body) {
                            console.log('getPlainValue/system.adapter.simple-api.upload => ' + body);
                            expect(error).to.be.not.ok;
                            expect(body).equal('51');
                            done();
                        });
                    });
                });
            });
        });
    });

    it('Test RESTful API: setBulk - must set values', function (done) {
        request('http://127.0.0.1:18183/setBulk/?system.adapter.simple-api.upload=50&system.adapter.simple-api.0.alive=false', function (error, response, body) {
            console.log('setBulk/?system.adapter.simple-api.upload=50&system.adapter.simple-api.0.alive=false => ' + body);
            expect(error).to.be.not.ok;

            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj[0].val).to.be.equal(50);
            expect(obj[0].id).to.equal('system.adapter.simple-api.upload');
            expect(obj[1].val).to.be.equal(false);
            expect(obj[1].id).to.equal('system.adapter.simple-api.0.alive');

            request('http://127.0.0.1:18183/getBulk/system.adapter.simple-api.upload,system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getBulk/system.adapter.simple-api.upload,system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                var obj = JSON.parse(body);
                expect(obj[0].val).equal(50);
                expect(obj[1].val).equal(false);
                done();
            });
        });
    });

    it('Test RESTful API: objects - must return objects', function (done) {
        request('http://127.0.0.1:18183/objects?pattern=system.adapter.*', function (error, response, body) {
            console.log('objects?pattern=system.adapter.* => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj['system.adapter.simple-api.0.alive']._id).to.be.ok;
            done();
        });
    });

    it('Test RESTful API: objects - must return objects', function (done) {
        request('http://127.0.0.1:18183/objects?pattern=system.adapter.*&type=instance', function (error, response, body) {
            console.log('objects?pattern=system.adapter.* => ' + body);
            expect(error).to.be.not.ok;
            var obj = JSON.parse(body);
            expect(obj['system.adapter.simple-api.0']._id).to.be.ok;
            done();
        });
    });

    it('Test RESTful API: states - must return states', function (done) {
        request('http://127.0.0.1:18183/states?pattern=system.adapter.*', function (error, response, body) {
            console.log('states?pattern=system.adapter.* => ' + body);
            expect(error).to.be.not.ok;
            var states = JSON.parse(body);
            expect(states['system.adapter.simple-api.0.uptime'].val).to.be.least(0);
            done();
        });
    });

    it('Test RESTful API: setBulk(POST) - must set values', function (done) {

        request({
            uri: 'http://127.0.0.1:18183/setBulk',
            method: 'POST',
            body: 'system.adapter.simple-api.upload=50&system.adapter.simple-api.0.alive=false'
        }, function(error, response, body) {
            console.log('setBulk/?system.adapter.simple-api.upload=50&system.adapter.simple-api.0.alive=false => ' + JSON.stringify(body));
            expect(error).to.be.not.ok;

            var obj = JSON.parse(body);
            expect(obj).to.be.ok;
            expect(obj[0].val).to.be.equal(50);
            expect(obj[0].id).to.equal('system.adapter.simple-api.upload');
            expect(obj[1].val).to.be.equal(false);
            expect(obj[1].id).to.equal('system.adapter.simple-api.0.alive');

            request('http://127.0.0.1:18183/getBulk/system.adapter.simple-api.upload,system.adapter.simple-api.0.alive', function (error, response, body) {
                console.log('getBulk/system.adapter.simple-api.upload,system.adapter.simple-api.0.alive => ' + body);
                expect(error).to.be.not.ok;
                var obj = JSON.parse(body);
                expect(obj[0].val).equal(50);
                expect(obj[1].val).equal(false);
                done();
            });
        });
    });

    after('Test RESTful API: Stop js-controller', function (done) {
        this.timeout(6000);
        setup.stopController(function (normalTerminated) {
            console.log('Adapter normal terminated: ' + normalTerminated);
            done();
        });
    });
});
