const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('./../server'); 
const api = supertest(app);

//credidentials for authorization
const credidentials = require('./../credidentials/credidentials');
const accessData = credidentials.accessData('client');

//for updata && delete test
const userID = 35; 


//TESTS
describe('REST API Testing', () => {
    it('should get a full list of users', async () => {
        const response = await api.get('/api/users').set('Authorization', accessData);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
      });
      it('should get a list of users by role', async () => {
        const response = await api.get('/api/users?role=admin').set('Authorization', accessData);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
      });
      it('should update a user', async () => {
        const updateUser = { firstName: 'Different' };
        const response = await api.patch('/api/user/' + userID).send(updateUser).set('Authorization', accessData);
        expect(response.status).to.equal(200);
      });
      it('should delete a user', async () => {
        const response = await api.delete('/api/user/' + userID).set('Authorization', accessData);
        expect(response.status).to.equal(200);
      });
      it('should create a new user', async () => {
        const newUser = { firstName: 'Test', lastName: 'Example', email: 'example@gmail.com', role: 'user' };
        const response = await api.post('/api/user').send(newUser).set('Authorization', accessData);
        expect(response.status).to.equal(201);
      });
});