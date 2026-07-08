const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(503).json({ error: 'Subscriptions temporarily paused.' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.REACT_APP_STRIPE_PAID_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
customer_email: req.body.email,
metadata: {
  firebaseUID: req.body.uid,
},
success_url: `https://www.glowwise.app/dashboard?payment=success`,
      cancel_url: `https://www.glowwise.app/#pricing`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
