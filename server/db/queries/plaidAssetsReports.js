const db = require('../');

const {writeFileSync} = require('fs');
/**
 *
 * @param AssetReportCreateRequest
 * @param AssetReportCreateResponse
 * @returns {Promise<Object>} the
 */
const createOrUpdatePlaidAssetReportCreateRequestResponse = async (AssetReportCreateRequest, AssetReportCreateResponse) => {

  const {
    asset_report_id: assetReportId,
    asset_report_token: assetReportToken,
    request_id: requestId,
  } = AssetReportCreateResponse;
  const query = {
    text: `
      INSERT INTO plaid_asset_report_requests
      (request,
       response,
       plaid_asset_report_id,
       plaid_asset_report_token,
       plaid_request_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING
      *;
    `,
    values: [
      AssetReportCreateRequest,
      AssetReportCreateResponse,
      assetReportId,
      assetReportToken,
      requestId
    ],
  };
  const {rows} = await db.query(query);
  return rows[0];
};

const retrievePlaidAssetReportTokenByAssetReportId = async (assetReportId) => {
  const query = {
    text: 'SELECT plaid_asset_report_token FROM plaid_asset_report_requests WHERE plaid_asset_report_id = $1',
    values: [assetReportId],
  };
  const {rows} = await db.query(query);
  // since plaid_asset_report_id are unique, this query will never return more than one row.
  return rows[0];
};
const retrievePlaidAssetReportRequestEntityByAssetReportId = async (assetReportId) => {
  const query = {
    text: 'SELECT * FROM plaid_asset_report_requests WHERE plaid_asset_report_id = $1',
    values: [assetReportId],
  };
  const {rows} = await db.query(query);
  // since plaid_asset_report_id are unique, this query will never return more than one row.
  return rows[0];
};

const createOrUpdatePlaidAssetReport = async (PlaidAssetReportRequestEntity, AssetReportGetResponse) => {
  const {
    report: report,
    warnings: warnings
  } = AssetReportGetResponse.data;

  const query = {
    text: `
      INSERT INTO plaid_asset_reports
      (plaid_asset_report_requests_id,
       report,
       warnings)
      VALUES ($1, $2, $3)
      RETURNING
      *;
    `,
    values: [
      PlaidAssetReportRequestEntity.id,
      report,
      warnings
    ],
  };
  const {rows} = await db.query(query);
  return rows[0];
};

const createOrUpdatePlaidAssetPdfReport = async (PlaidAssetReportRequestEntity, AssetReportPDFGetResponse) => {
  const {
    data: binaryData,
  } = AssetReportPDFGetResponse;

  // writeFileSync('./' + PlaidAssetReportRequestEntity.id + '.pdf', binaryData, 'binary');
  // writeFileSync('./' + PlaidAssetReportRequestEntity.plaid_asset_report_id + '.pdf', binaryData, 'binary');

  const query = {
    text: `
      INSERT INTO plaid_asset_reports_pdf
      (plaid_asset_report_requests_id,
       report)
      VALUES ($1, $2)
      RETURNING
      *;
    `,
    values: [
      PlaidAssetReportRequestEntity.id,
      Buffer.from(binaryData)
    ],
  };
  const {rows} = await db.query(query);
  return rows[0];
};

module.exports = {
  createOrUpdatePlaidAssetReportCreateRequestResponse,
  retrievePlaidAssetReportTokenByAssetReportId,
  retrievePlaidAssetReportRequestEntityByAssetReportId,
  createOrUpdatePlaidAssetReport,
  createOrUpdatePlaidAssetPdfReport,
};