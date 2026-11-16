/**
 * GOOGLE SHEETS RECEIVER — Beyond the Product / Biti's AR research prototype
 *
 * INSTALL:
 * 1) Create a Google Sheet > Extensions > Apps Script.
 * 2) Paste this file into Code.gs and save.
 * 3) Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 4) Copy the Web app URL ending in /exec and paste into
 *    APPS_SCRIPT_URL in index.html.
 * 5) Redeploy as New version after modifying this script.
 *
 * Respondents don't need a Google account.
 * Anyone with the endpoint may POST to it: monitor abuse and avoid PII.
 */
const SHEET_NAME = 'Responses';
const BASE_COLUMNS = [
  'submitted_at', 'response_id', 'participant_id',
  'survey_version', 'language', 'ar_launch_clicked',
  'ar_entered', 'viewer_interactions'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (!e || !e.parameter || !e.parameter.payload) {
      return outJson_({ok:false,error:'missing payload'});
    }
    const record = JSON.parse(e.parameter.payload);
    if (!record || record.app !== 'bitis-ar-research-v1') {
      return outJson_({ok:false,error:'invalid app'});
    }
    if (!/^[a-zA-Z0-9_-]{10,80}$/.test(String(record.response_id || ''))) {
      return outJson_({ok:false,error:'invalid response_id'});
    }
    const answers = record.answers || {};
    const keys = Object.keys(answers);
    if (keys.length > 150) return outJson_({ok:false,error:'too many answers'});
    keys.forEach(function (key) {
      if (!/^[A-Za-z0-9_-]{1,70}$/.test(key)) throw new Error('invalid question id');
    });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Please bind this Apps Script to a Google Sheet.');
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(BASE_COLUMNS);
    let headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    // Deduplicate retries by response ID
    if (sheet.getLastRow() > 1) {
      const idCol = headers.indexOf('response_id') + 1;
      const found = sheet.getRange(2,idCol,sheet.getLastRow()-1,1)
        .createTextFinder(record.response_id).matchEntireCell(true).findNext();
      if (found) return outJson_({ok:true,duplicate:true});
    }
    keys.forEach(function(key){
      if (headers.indexOf(key) < 0) headers.push(key);
    });
    if (headers.length > sheet.getLastColumn()) {
      sheet.getRange(1,1,1,headers.length).setValues([headers]);
    }
    const core = {
      submitted_at: new Date().toISOString(),
      response_id: record.response_id,
      participant_id: record.participant_id || '',
      survey_version: record.survey_version || '',
      language: record.language || '',
      ar_launch_clicked: Number(record.ar_launch_clicked || 0),
      ar_entered: String(Boolean(record.ar_entered)),
      viewer_interactions: Number(record.viewer_interactions || 0)
    };
    const data = Object.assign({},core,answers);
    const row = headers.map(function(name) { return safeCell_(data[name]); });
    sheet.appendRow(row);
    return outJson_({ok:true,stored:true});
  } catch (err) {
    console.error(err);
    return outJson_({ok:false,error:String(err)});
  } finally {
    try { lock.releaseLock(); } catch (_err) {}
  }
}

/**
 * Cross-origin status check, returning only a yes/no receipt.
 * No answer content or respondent metadata is exposed.
 */
function doGet(e) {
  if (!e || e.parameter.mode !== 'receipt') {
    return ContentService.createTextOutput('Google Sheets receiver is active.');
  }
  const id = String(e.parameter.id || '');
  if (!/^[a-zA-Z0-9_-]{10,80}$/.test(id)) {
    return jsOutput_('window.__sheetReceipt && window.__sheetReceipt("",false);');
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss && ss.getSheetByName(SHEET_NAME);
  let found = false;
  if (sheet && sheet.getLastRow() > 1) {
    const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const idCol = headers.indexOf('response_id') + 1;
    if (idCol > 0) {
      found = Boolean(sheet.getRange(2,idCol,sheet.getLastRow()-1,1)
        .createTextFinder(id).matchEntireCell(true).findNext());
    }
  }
  return jsOutput_('window.__sheetReceipt && window.__sheetReceipt(' + JSON.stringify(id) + ',' + (found ? 'true' : 'false') + ');');
}

function safeCell_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  const text = String(value).slice(0,15000);
  // Prevent spreadsheet formula injection via free-text survey responses.
  return /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
}
function outJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
function jsOutput_(js) {
  return ContentService.createTextOutput(js)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
