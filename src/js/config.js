// Vueの createApp をインポート
import { createApp } from 'vue';
// 作成したVueコンポーネントをインポート
import DynamicDropdownConfigApp from '../components/PDFInjectorConfigApp.vue';

(async function (PLUGIN_ID) {
  'use strict';
  const APP_ID = kintone.app.getId();
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ 添付ファイルアプリのフィールド情報を取得
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  async function getAllApps() {
    let allApps = [];
    let offset = 0;
    const limit = 100;
    try {
      // アプリの一覧を全件取得
      while (true) {
        const resp = await kintone.api(kintone.api.url('/k/v1/apps.json', true), 'GET', { offset, limit }); //全てのアプリ
        for (const apps of resp.apps) {
          if (apps.appId != APP_ID) {
            allApps.push({ appId: apps.appId, appName: apps.name, attachmentFields: [], isSearched: false });
          }
        }
        if (resp.apps.length < limit) break;
        offset += limit;
      }
    } catch (e) {
      console.error('アプリ一覧の取得に失敗しました。', e);
      throw new Error(`アプリ一覧の取得に失敗しました。エラー: ${e.message}`);
    }
    return allApps;
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ 添付ファイルアプリのフィールド情報を取得
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  async function getAttachmentFields(appId, targetApp) {
    try {
      //const targetApp = allApps.find((item) => item.appId == appId);
      if (targetApp) {
        if (!targetApp.isSearched) {
          const formResp = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: appId });
          for (const fieldCode in formResp.properties) {
            const field = formResp.properties[fieldCode];
            if (field.type == 'FILE') {
              targetApp.attachmentFields.push({ id: field.code, label: field.label, code: field.code });
            }
          }
          targetApp.isSearched = true;
        }
        return targetApp.attachmentFields;
      } else {
        return [];
      }
    } catch (e) {
      console.error('アプリの添付ファイルフィールド取得に失敗しました。', e);
      throw new Error(`アプリの添付ファイルフィールド取得に失敗しました。エラー: ${e.message}`);
    }
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ ドロップダウン共通関数
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function setDropDown(fieldArray, subtableCode = null) {
    const result = [];
    for (const field of fieldArray) {
      let id = field.code;
      let code = escapeHtml(field.code);
      let type = field.type;
      //KintoneConfigHelper.getFieldsでは、サブテーブル内のフィールドは「subtableCode」にサブテーブル名を持っている
      if (!field.hasOwnProperty('subtableCode')) {
        if (!subtableCode) {
          const addItem = {
            id: id,
            code: code,
            type: type,
          };
          result.push(addItem);
        }
      } else {
        if (field.subtableCode == subtableCode) {
          const addItem = {
            id: id,
            code: code,
            type: type,
          };
          result.push(addItem);
        }
      }
    }
    return result;
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ エスケープ文字の置換関数 (async/await の外側で定義)
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function escapeHtml(htmlstr) {
    // HTMLエスケープ文字を正しく修正します
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ 非同期処理（設定取得とフィールド情報取得）を Vue アプリ作成より前に行う
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  let { configButton, configPdf, configFont, configText, configPagecount, configImage, configPageBreakTable, configTable } = config;

  // nullの場合の初期値
  if (!configButton) {
    configButton = { spaceField: '', textContent: '' };
  } else {
    configButton = JSON.parse(config['configButton']);
  }
  if (!configPdf) {
    configPdf = { appId: '', name: '', recordId: '', attachment: '', outputFileName: '', useFileNameField: '' };
  } else {
    configPdf = JSON.parse(config['configPdf']);
  }
  if (!configFont) {
    configFont = { appId: '', name: '', recordId: '', attachment: '' };
  } else {
    configFont = JSON.parse(config['configFont']);
  }

  if (!configPagecount) {
    configPagecount = { x: '', y: '', size: '', type: 'n/n' };
  } else {
    configPagecount = JSON.parse(config['configPagecount']);
  }

  if (!configText) {
    configText = [{ id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', targetPage: 'all', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }];
  } else {
    configText = JSON.parse(config['configText']);
  }

  if (!configImage) {
    configImage = [{ id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' }];
  } else {
    configImage = JSON.parse(config['configImage']);
  }

  if (!configPageBreakTable) {
    configPageBreakTable = {
      fieldCode: '',
      maxRow: '',
      y: '',
      y_Offset: '',
      y_OffsetFontSize: false,
      subtotal: false,
      column: [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '', calc: 'no' }],
    };
  } else {
    configPageBreakTable = JSON.parse(config['configPageBreakTable']);
  }

  if (!configTable) {
    configTable = {
      fieldCode: '',
      maxRow: '',
      y: '',
      y_Offset: '',
      y_OffsetFontSize: false,
      targetPage: 'all',
      column: [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }],
    };
  } else {
    configTable = JSON.parse(config['configTable']);
  }

  const allApps = await getAllApps();

  let optionPdfAttachmentFields;
  if (configPdf.appId) {
    const targetApp = allApps.find((item) => item.appId == configPdf.appId);
    optionPdfAttachmentFields = await getAttachmentFields(configPdf.appId, targetApp);
  }
  let optionFontAttachmentFields;
  if (configFont.appId) {
    const targetApp = allApps.find((item) => item.appId == configPdf.appId);
    optionFontAttachmentFields = await getAttachmentFields(configFont.appId, targetApp);
  }

  const targetFieldsImage = await KintoneConfigHelper.getFields(['FILE']);
  const optionImage = setDropDown(targetFieldsImage);

  const targetFieldsTable = await KintoneConfigHelper.getFields(['SUBTABLE']);
  const optionTable = setDropDown(targetFieldsTable);

  const targetFieldsUseFileName = await KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'NUMBER']);
  const optionPdfUseFileNameFields = setDropDown(targetFieldsUseFileName);

  const targetFieldsAll = await KintoneConfigHelper.getFields();
  const targetAppAllText = targetFieldsAll.filter((item) => item.type !== 'FILE' && item.type !== 'SUBTABLE' && item.type !== 'SPACER'); //添付ファイルとサブテーブルを除く全てのフィールド
  const optionText = setDropDown(targetAppAllText);

  let optionPageBreakTableText = [];
  if (configPageBreakTable.fieldCode) {
    optionPageBreakTableText = setDropDown(targetAppAllText, configPageBreakTable.fieldCode);
  }

  let optionTableText = [];
  if (configTable.fieldCode) {
    optionTableText = setDropDown(targetAppAllText, configTable.fieldCode);
  }

  const spaceFields = await KintoneConfigHelper.getFields('SPACER');
  // スペースフィールドは「code」ではなく「elementId」が取得されるため、コードを変換
  for (const item of spaceFields) {
    item.code = item.elementId;
  }
  const optionSpace = setDropDown(spaceFields);

  // Vueコンポーネントに渡す初期データとオプション
  const initialConfig = {
    configButton,
    configPdf,
    configFont,
    configText,
    configPagecount,
    configImage,
    configPageBreakTable,
    configTable,
  };

  let appElement = document.getElementById('app');
  if (!appElement) {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  }
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //Vueのオブジェクト作成 (setup 関数は async にしない)
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  const app = createApp(DynamicDropdownConfigApp, {
    initialConfig: initialConfig,
    optionText: optionText,
    optionImage: optionImage,
    optionTable: optionTable,
    optionSpace: optionSpace,
    optionPdfAttachmentFields: optionPdfAttachmentFields,
    optionFontAttachmentFields: optionFontAttachmentFields,
    optionPageBreakTableText: optionPageBreakTableText,
    optionTableText: optionTableText,
    optionPdfUseFileNameFields: optionPdfUseFileNameFields,
    allApps: allApps,
    targetAppAllText: targetAppAllText,
    getAttachmentFields: getAttachmentFields,
    setDropDown: setDropDown,
  });
  const vm = app.mount('#app');
})(kintone.$PLUGIN_ID);
