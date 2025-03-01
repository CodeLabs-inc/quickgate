const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { Account, Ticket, Gate } = require("../database/schemas/");
const { AuthenticateToken } = require("../utils/jwt");
const { isValidExpirationDate } = require("../utils/payments");

router.route("/methods/current").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const ownerId = auth.account.id;

  const account = await Account.findById(ownerId).select(
    "finances.stripe_payment_method finances.stripe_payment_methods"
  );

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  if (!account.finances.stripe_payment_method) {
    return res.status(404).json({
      message: "No payment method found",
      success: true,
      data: null,
    }); 
  }


  
  const paymentMethodData = await getPaymentMethodInfo(
    account.finances.stripe_payment_method
  );

  if (!paymentMethodData.success) {
    return res.status(500).json({
      message: "Nessun metodo di pagamento trovato",
      data: null,
      succes: true,
    });
  }

  const data = {
    ...paymentMethodData.data,
    quantityPayementMethods: account.finances.stripe_payment_methods.length,
  }

  return res.status(200).json({
    message: "Payment method found",
    success: true,
    data: data,
  });
});
router.route("/methods/all").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(400).json({
      message: "Unauthorized",
    });
  }

  const ownerId = auth.account.id;

  const customerStripeId = await Account.findById(ownerId).select('finances.stripe_customer_id');

  if (!customerStripeId || !customerStripeId.finances.stripe_customer_id || customerStripeId.finances.stripe_customer_id === '') {
    return res.status(200).json({
      message: "Customer is not registered in stripe",
      success: true,
      data: []
    });
  }

  const paymentMethods = await getCustomerPaymentMethods(customerStripeId.finances.stripe_customer_id);

  if (!paymentMethods.success) {
    return res.status(200).json({
      message: "Customer has no payment methods saved",
      success: true,
      data: []
    });
  }

  console.log(paymentMethods);

  return res.status(200).json({
    success: true, 
    data: paymentMethods.paymentMethods
  })
});
router.route("/methods/add").post(async (req, res) => {
  const auth = await AuthenticateToken(req);
  const ownerId = auth.account.id;

  const { cardNumber, cardHolder, expirationDate, cvv } = req.body;

  if (!cardNumber || !cardHolder || !expirationDate || !cvv) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  if (isValidExpirationDate(expirationDate).isValid === false) {
    return res.status(400).json({
      message: isValidExpirationDate(expirationDate).message,
    });
  }

  //Check if customer is registered in stripe (has stripe_cusomer_id)
  const account = await Account.findById(ownerId).select(
    "finances.stripe_customer_id email user.name"
  );

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  if (
    (account && !account.finances.stripe_customer_id) ||
    (account && account.finances.stripe_customer_id === "")
  ) {
    //Add new customer to stripe and save customer id to db then add card to customer

    if (account.user.name == '' || account.user.surname == '') {
      return res.status(400).json({
        message:
          "Please go fill your Profile settings, and make sure name and surname are filled",
      });
    }

    const newCustomerId = await saveCustomer(
      account.email,
      account.user.name,
      account.user.surname
    );

    if (!newCustomerId) {
      return res.status(500).json({
        message: "Error adding card, please contact support",
      });
    }

    //Add card to stripe customer and save card id to db
    try {
      const newPaymentMethodId = await addPaymentMehod(
        newCustomerId,
        {
          number: cardNumber,
          exp_month: expirationDate.split("/")[0],
          exp_year: expirationDate.split("/")[1],
          cvc: cvv,
        },
        {
          name: cardHolder,
          email: account.email,
          surname: account.surname,
        }
      );

      if (!newPaymentMethodId) {
        return res.status(500).json({
          message: "Error adding card, try again later",
        });
      }

      const updatePaymentMethod = await Account.findByIdAndUpdate(
        ownerId,
        {
          $push: {
            "finances.stripe_payment_methods": newPaymentMethodId,
          },
          "finances.stripe_customer_id": newCustomerId,
          "finances.stripe_payment_method": newPaymentMethodId,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Card added successfully",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    //Add card to customer
    const customerId = account.finances.stripe_customer_id;


    try {
      const newPaymentMethodId = await addPaymentMehod(
        customerId,
        {
          number: cardNumber,
          exp_month: expirationDate.split("/")[0],
          exp_year: expirationDate.split("/")[1],
          cvc: cvv,
        },
        {
          name: cardHolder,
          email: account.email,
          surname: account.surname,
        }
      );

      const updatePaymentMethod = await Account.findByIdAndUpdate(
        ownerId,
        {
          $push: {
            "finances.stripe_payment_methods": newPaymentMethodId,
          },
          "finances.stripe_payment_method": newPaymentMethodId,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Card added successfully",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
});
router.route("/methods/remove/:id").delete(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const ownerId = auth.account.id;

  const removedPaymentMethodId = req.params.id;

  const removePaymentMethodAction = await removePaymentMethod(
    ownerId,
    removedPaymentMethodId
  );

  

  if (!removePaymentMethodAction.success) {
    return res.status(500).json({
      message: removePaymentMethodAction.message,
    });
  }

  return res.status(200).json({
    message: "Card removed successfully",
    success: true,
  });
});
router.route("/methods/update/:paymentMethodId/email").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const paymentMethodId = req.params.paymentMethodId;
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      message: "Please provide an email",
    });
  }

  const updatedPaymentMethod = await updatePaymentMethodEmail(paymentMethodId, email);

  if (!updatedPaymentMethod) {
    return res.status(500).json({
      message: "Error updating email, please try again later",
    });
  }

  return res.status(200).json({
    message: "Email updated successfully",
    success: true,
    data: updatedPaymentMethod,
  });
})
router.route("/methods/update/:paymentMethodId/default").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const ownerId = auth.account.id;
  const paymentMethodId = req.params.paymentMethodId;

  const account = await Account.findById(ownerId).select(
    "finances.stripe_customer_id"
  );

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const setDefaultPaymentMethodAction = await setDefaultPaymentMethod(
    account.finances.stripe_customer_id,
    paymentMethodId
  );

  if (!setDefaultPaymentMethodAction.success) {
    return res.status(500).json({
      message: setDefaultPaymentMethodAction.message,
    });
  }

  const updateDefualtMethod = await Account.findByIdAndUpdate(ownerId, {
    "finances.stripe_payment_method": paymentMethodId,
  })

  return res.status(200).json({
    message: "Default payment method set successfully",
    success: true,
  });
})

/* Addon Function that help do the endpoints above */

const saveCustomer = async (email, name, lastName) => {
  const customer = await stripe.customers.create({
    email,
    name,
    last_name: lastName,
  });

  const customerId = customer.id;

  return customerId;
};
const addPaymentMehod = async (customerId, card, billingDetails) => {
  // Example card object: { number, exp_month, exp_year, cvc, name }
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: card.number,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      cvc: card.cvc,
    },
    billing_details: {
      name: billingDetails.name,
      email: billingDetails.email,
      phone: billingDetails.phone,
    },
  });

  //Attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customerId,
  });

  //set as default
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });

  return paymentMethod.id;
};
const removePaymentMethod = async (ownerId, paymentMethodId) => {
  try {
    // Detach the payment method from Stripe
    await stripe.paymentMethods.detach(paymentMethodId);


    //find other payment methods residual
    const account = await Account.findById(ownerId).select(
      "finances.stripe_payment_methods"
    );

    //filter out the removed payment method
    const remainingPaymentMethods = account.finances.stripe_payment_methods.filter(
      (id) => id !== paymentMethodId
    )


    // Find and update the account
    const updatedAccount = await Account.findByIdAndUpdate(
      ownerId,
      {
        $pull: {
          "finances.stripe_payment_methods": paymentMethodId, // Remove the payment method
        },
        "finances.stripe_payment_method": remainingPaymentMethods[0] || null, // Set the first payment method as the default if there are any
      },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      updatedAccount, // Optionally return the updated account if needed
    };
  } catch (error) {
    console.error('Error removing payment method:', error);
    return {
      success: false,
      message: "Error removing payment method, please try again later or contact support.",
    };
  }
};
const getPaymentMethodInfo = async (paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return {
      success: true,
      data: paymentMethod,
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Error retrieving payment method information, please try again later.",
    };
  }
};
const updatePaymentMethodEmail = async (paymentMethodId, email) => {
  try {
    const updatedPaymentMethod = await stripe.paymentMethods.update(paymentMethodId, {
      billing_details: { email },
    });

    return updatedPaymentMethod;
  } catch (error) {
    console.error('Error updating payment method email:', error);
    throw error;
  }
};
const getCustomerPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card', // Ensure you get only card payment methods
    });

    return {
      success: true,
      paymentMethods: paymentMethods.data, // Array of payment methods
    };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      success: false,
      message: 'Error fetching payment methods, please try again later.',
    };
  }
};
const setDefaultPaymentMethod = async (customerId, paymentMethodId) => {
  try {
    // Update the customer's default payment method
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId, // Set the new default payment method
      },
    });

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return {
      success: false,
      message: 'Error setting default payment method, please try again later.',
    };
  }
};








/* Fast Pay API Stripe Functions */

router.route("/fastpay/create-payment-intent").post(async (req, res) => {
  const { licensePlate } = req.body;
  
  const customer = await stripe.customers.create()
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  )



  //1. Lookup ticket
  const ticket = await Ticket.findOne({ 
    licensePlate,
    "dates.exit": null,
  });
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }


  //2. Check if the ticket being paid is not 5 minutes after price validation
  const validatedDate = ticket.dates.validated;
  const now = Date.now();
  const diff = now - validatedDate;
  const minutes = Math.floor(diff / 60000);
  if (minutes > 5) {
    return res.status(400).json({
      success: false,
      message: "Ticket has expired, please request a new price",
    });
  }

  //3. Get gate prices
  const checkGate = await Gate.findById(ticket.gateId).select("rates");


  //3. Calculate the amount to pay
  const entryTime = ticket.dates.entry;
  const diffTime = validatedDate - entryTime;
  const diffTimeInHours = diffTime / 1000 / 60 / 60;

  const days = Math.floor(diffTimeInHours / 24);
  const hours = Number((diffTimeInHours % 24).toFixed(2));
  
  const hourlyRate = checkGate.rates.hourly;
  const dailyRate = checkGate.rates.daily;
  const totalAmount = days * dailyRate + hours * hourlyRate;
  



  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: 'dop',
  });



  const clientSecret = paymentIntent.client_secret

  console.log(clientSecret)


  return res.status(200).json({
    success: true,
    data: {
      ephemeralKey: ephemeralKey.secret,
      clientSecret,
      paymentIntentId: paymentIntent.id,
      customer: customer.id,
      amount: totalAmount,
      licensePlate,
    }
  });
})
router.route("/fastpay/confirm-payment-intent").post(async (req, res) => {
  const { paymentIntentId, licensePlate } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const paymentSucceded = paymentIntent.status === 'succeeded';

  console.log(licensePlate)

  if (paymentSucceded) {
    console.log('Updating ticket to paid');
    const ticket = await Ticket.findOneAndUpdate(
      {
        licensePlate: licensePlate,
        "dates.exit": null,
      },
      {
        $set: {
          "dates.paid": Date.now(),
          isPaid: true,
          value: paymentIntent.amount/ 100
        },
      },
      { new: true }
    );
  }

  return res.status(200).json({
    success: true,
    data: {
      paymentSucceded,
    },
  });
})
module.exports = router;
