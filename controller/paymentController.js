const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//////////////////////////// CREATE CUSTOMER /////////////////////////////////

module.exports.createCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });

    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

//////////////////////////// ADD CARD /////////////////////////////////

module.exports.addCard = async (req, res) => {
  try {
    const {
      customer_id,
      card_Name,
      card_Number,
      card_ExpYear,
      card_ExpMonth,
      card_CVC,
    } = req.body;

    const card_token = "tok_visa";

    const card = await stripe.customers.createSource(customer_id, {
      source: card_token,
    });

    res.status(200).json({
      card: card.id,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

//////////////////////////// CREATE CHARGE /////////////////////////////////

module.exports.createCharge = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: req.body.card_id,
      amount: parseInt(req.body.amount) * 100,
      currency: "INR",
      confirm: true,
      payment_method_types: ["card"],
      customer: req.body.customer_id,
      receipt_email: req.body.email,
    });
    res.status(200).json(paymentIntent);
  } catch (err) {
    res.status(400).json(err.message);
  }
};
