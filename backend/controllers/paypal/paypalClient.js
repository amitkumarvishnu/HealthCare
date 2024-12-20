const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment(
    "AUO3Yotr4L4QGJfminoaRJ5WbbvIYDg25KqAAH2mhzrfYb14vZZ607E0mBjhykby97wsxvvHYDS4BMEz",
    "EMIUCkN8YoUjjWeRynN62Btc_s_cZ9lkBTXdzTD_epRuDboOEjdU-8sJCMXwuBYzifXWCMwY2p2DzgGd"
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;
