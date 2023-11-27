const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const sharedModule = require('../utils/shared');
const app = require('../app.js');



describe('Unit tests for application functions', () => {

    describe('Function: getPrayerDates()', () => {

        it('should return the expected prayer times ', async () => {

            const result =  await  sharedModule.getPrayerDates(2);


            expect(result).to.have.property('Asr');
            expect(result).to.have.property('Maghrib');
        });

    });

    describe('Function: getTimeDifferenceInMinutes()', () => {

        it('should return the correct amount of minutes', async () => {

            const result =  sharedModule.getTimeDifferenceInMinutes("18:29" , "15:53");

            expect(result).equals(156);
        });

        it('should return the wrong amount of minutes', async () => {

            const result =  sharedModule.getTimeDifferenceInMinutes("18:29" , "15:59");

            expect(result).not.equals(156);
        });

    });

    describe('Function: calculate()', () => {

        it('should return the correct amount of calculated minutes', async () => {

            const result =  sharedModule.calculate("18:29" , "15:53" , 266);

            expect(result.readable).equals("125 minutes before Asr");
        });

        it('should return the wrong amount of calculated minutes', async () => {

            const result =  sharedModule.calculate("18:29" , "15:53" , 170);

            expect(result.readable).not.equals("125 minutes before Asr");
        });

    });


    describe('Function: isValidDay()', () => {

        it('should return true', async () => {

            const result =  sharedModule.isValidDay(15);

            expect(result).to.equal(true);
        });

        it('more than 30 and should return false', async () => {

            const result =  sharedModule.isValidDay(49);

            expect(result).to.equal(false);
        });

        it('less than 1 and should return false', async () => {

            const result =  sharedModule.isValidDay(0);

            expect(result).to.equal(false);
        });

    });

    describe('Function: isValidIngredient()', () => {

        it('should return true',  () => {

            const result =  sharedModule.isValidIngredient("Garlic");

            expect(result).to.equal(true);
        });

        it('contains number and should return false',  () => {

            const result =  sharedModule.isValidIngredient("Garlic123");

            expect(result).to.equal(false);
        });

        it('empty string should return false', () => {
            const result = sharedModule.isValidIngredient("");
            expect(result).to.equal(false);
        });

    });





});

describe('Integration test to test application endpoints', () => {
    let server;

    before((done) => {
        server = app.listen(3001, () => {
            console.log('Testing server is running on port 3001');
            done();
        });
    });

    after((done) => {
        server.close(() => {
            console.log('Testing server closed');
            done();
        });
    });



    it('should return a 400 for a malformed day parameter from /cooktime endpoint', (done) => {
        chai.request(app)
            .get('/cooktime?ingredient=Tomatoe Paste&day=31')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 for a malformed ingredient format from /cooktime endpoint', (done) => {
        chai.request(app)
            .get('/cooktime?ingredient=Tomatoe Paste123&day=31')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 for an empty ingredient parameter from /cooktime endpoint', (done) => {
        chai.request(app)
            .get('/cooktime?ingredient=&day=2')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });


    it('should return a 200 from /cooktime endpoint', (done) => {
        chai.request(app)
            .get('/cooktime?ingredient=Onion&day=2')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                const dishName = 'Stuffed Peppers';
                const dish = res.body.find(item => item.name === dishName);
                expect(dish).to.exist;
                expect(dish.cooktime).to.exist;
                done();
            });
    });

    it('should return a 400 for an empty day parameter from /suggest endpoint', (done) => {
        chai.request(app)
            .get('/suggest?day=')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 for an malformed day parameter from /suggest endpoint', (done) => {
        chai.request(app)
            .get('/suggest?day=35')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 200  from /suggest endpoint', (done) => {
        chai.request(app)
            .get('/suggest?day=4')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('ingredients').that.is.an('array');
                expect(res.body).to.have.property('cooktime');
                done();
            });
    });

});
