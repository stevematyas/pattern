/**
 * @file Defines the handler for Assets webhooks.
 * https://plaid.com/docs/api/products/assets/#webhooks
 */

const {
  retrieveItemByPlaidItemId,
} = require('../db/queries');

const { AssetReportReady} = require('../AssetReportServices');

/**
 * Handles all asset webhook events. The asset webhook notifies
 * you that a single item has new report available.
 *
 * @param {Object} requestBody the request body of an incoming webhook event
 * @param {Object} io a socket.io server instance.
 */
const handleAssetReportWebhook = async (requestBody, io) => {
  const {
    webhook_type: webhookType,
    webhook_code: webhookCode,
    asset_report_id: assetReportId,
    user_id: userId,
    report_type: reportType,
    environment: environment,
  } = requestBody;

  const serverLogAndEmitSocket = (additionalInfo, assetReportId) => {
    console.log(
      `WEBHOOK: ${webhookType}: webhook_code: ${webhookCode}: asset_report_id ${assetReportId}: ${additionalInfo}`
    );
    // use websocket to notify the client that a webhook has been received and handled
    if (webhookCode) io.emit(webhookCode, { assetReportId });
  };

  switch (webhookCode) {
    case 'PRODUCT_READY':
      AssetReportReady(assetReportId);
      break;
    case 'ERROR':

      break;
    default:
      serverLogAndEmitSocket(`unhandled webhook type received.`, assetReportId);
  }
};

module.exports = handleAssetReportWebhook;
