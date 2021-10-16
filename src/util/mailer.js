const { CourierClient } = require("@trycourier/courier");
const { env } = require("../env/env");

const courier = CourierClient({
  authorizationToken: env.courierAuthorizationToken,
});

exports.sendMail = async function sendMail({ name, email }) {
  try {
    const { messageId } = await courier.send({
      brand: env.courierBrand,
      eventId: env.courierNotificationEvent,
      recipientId: "dd6a0878-d29b-4c00-84c6-63ebb118f994",
      profile: {
        email: email,
      },
      data: {
        name: name,
      },
      override: {},
    });
    return Promise.resolve(messageId);
  } catch (err) {
    return Promise.reject(err);
  }
};
