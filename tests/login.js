module.exports = {
    'Login test': function (browser) {
        browser
            .url('http://localhost:3000/login')
            .waitForElementVisible('body', 1000)
            .setValue('input[name="username"]', 'kitchen2')
            .setValue('input[name="password"]', 'dagobahtech')
            .click('button[type="submit"]')
            .pause(2000)
            .assert.title('Kitchen')
            .end();
    }
};