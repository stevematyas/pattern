const plaid = require("./plaid");

const {
  createOrUpdatePlaidAssetReportCreateRequestResponse,
  retrievePlaidAssetReportRequestEntityByAssetReportId,
  createOrUpdatePlaidAssetReport,
  createOrUpdatePlaidAssetPdfReport
} = require('./db/queries');
const {
  PLAID_WEBHOOK_URL
} = process.env;
const CreateAssetReport = async function (institutionId,
                                          accessToken,
                                          itemId,
                                          userId) {
  const AssetReportCreateRequest = {
    access_tokens: [accessToken],
    days_requested: 61,
    options: {
      client_report_id: ':item_id:' + itemId + ':institution_id:' + institutionId + ':user_id:' + userId,
      webhook: PLAID_WEBHOOK_URL,
    }
  };

  const AssetReportCreateResponse = await plaid.assetReportCreate(AssetReportCreateRequest);

  // STORE REQUEST & RESPONSE
  const PlaidAssetReportRequestEntity = await createOrUpdatePlaidAssetReportCreateRequestResponse(AssetReportCreateRequest, AssetReportCreateResponse.data);

  const {
    asset_report_id: assetReportId,
    asset_report_token: assetReportToken,
    request_id: requestId,
  } = AssetReportCreateResponse.data;
  return {
    id: PlaidAssetReportRequestEntity.id
  }
}

const AssetReportReady = async function (asset_report_id) {

  console.log('AssetReportReady: %s', asset_report_id);
  const PlaidAssetReportRequestEntity = await retrievePlaidAssetReportRequestEntityByAssetReportId(asset_report_id);

  if (!PlaidAssetReportRequestEntity) {
    console.error("AssetReportReady: No PlaidAssetReportRequestEntity found for plaid_asset_report_id = '%'", asset_report_id);
  } else {
    await _GetAndStoreAssetReport(PlaidAssetReportRequestEntity);
    await _GetAndStoreAssetPDFReport(PlaidAssetReportRequestEntity);
  }

};

const _GetAndStoreAssetReport = async (PlaidAssetReportRequestEntity) => {
  const AssetReportGetRequest = {
    asset_report_token : PlaidAssetReportRequestEntity.plaid_asset_report_token,
    include_insights: false,
    fast_report: false
  };
  const AssetReportGetResponse = await plaid.assetReportGet(AssetReportGetRequest);
  createOrUpdatePlaidAssetReport(PlaidAssetReportRequestEntity, AssetReportGetResponse);
};

const _GetAndStoreAssetPDFReport = async (PlaidAssetReportRequestEntity) => {
  const AssetReportPDFGetRequest = {
    asset_report_token : PlaidAssetReportRequestEntity.plaid_asset_report_token,
  };
  const AssetReportPDFGetResponse = await plaid.assetReportPdfGet(AssetReportPDFGetRequest);
  createOrUpdatePlaidAssetPdfReport(PlaidAssetReportRequestEntity, AssetReportPDFGetResponse);
};

module.exports = {
  CreateAssetReport,
  AssetReportReady
}