// Vueの createApp をインポート
import { createApp } from 'vue';
// 作成したVueコンポーネントをインポート
import PDFInjectorConfigApp from '../components/PDFInjectorConfigApp.vue';

(async function (PLUGIN_ID) {
  'use strict';
  const APP_ID = kintone.app.getId();
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** 添付ファイルアプリのフィールド情報を取得
   * @returns サブドメイン内の全てのアプリ(自アプリ除く)
   */
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
  /** 添付ファイルアプリのフィールド情報を取得
   * @param {string} appId アプリＩＤ
   * @param {object} targetApp getAllAppsで作成した全アプリのうち、appIdで指定したアプリＩＤ
   * @returns appIdで指定したアプリＩＤの添付ファイルフィールド
   */
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
          targetApp.isSearched = true; //同じアプリに対して、何度もapiを呼び出さないためのフラグ
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
  /** ドロップダウン共通関数
   * @param {object[]} fieldArray フィールドの一覧
   * @param {*} [subtableCode=null] サブテーブル内のフィールドの場合、対象となるサブテーブルのフィールド名
   * @returns ドロップダウン作成用の配列
   */
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
    configPagecount = { x: '', y: '', size: '', type: 'no' };
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

  const allApps = await getAllApps(); //サブドメイン内の全てのアプリ

  let optionPdfAttachmentFields;
  if (configPdf.appId) {
    const targetApp = allApps.find((item) => item.appId == configPdf.appId); //対象となるアプリの指定(PDF雛形)
    optionPdfAttachmentFields = await getAttachmentFields(configPdf.appId, targetApp); //指定したアプリの添付ファイルフィールド
  }
  let optionFontAttachmentFields;
  if (configFont.appId) {
    const targetApp = allApps.find((item) => item.appId == configPdf.appId); //対象となるアプリの指定(フォント)
    optionFontAttachmentFields = await getAttachmentFields(configFont.appId, targetApp); //指定したアプリの添付ファイルフィールド
  }

  const targetFieldsImage = await KintoneConfigHelper.getFields(['FILE']); //自アプリの添付ファイル
  const optionImage = setDropDown(targetFieldsImage);

  const targetFieldsTable = await KintoneConfigHelper.getFields(['SUBTABLE']); //自アプリのサブテーブル
  const optionTable = setDropDown(targetFieldsTable);

  const targetFieldsUseFileName = await KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'NUMBER']);
  const optionPdfUseFileNameFields = setDropDown(targetFieldsUseFileName); //PDFの出力ファイル名の一部として使用するフィールド

  const targetFieldsAll = await KintoneConfigHelper.getFields();
  const targetAppAllText = targetFieldsAll.filter((item) => item.type !== 'FILE' && item.type !== 'SUBTABLE' && item.type !== 'SPACER'); //添付ファイルとサブテーブルを除く全てのフィールド
  const optionText = setDropDown(targetAppAllText); //PDFへ描画するフィールド

  let optionPageBreakTableText = [];
  if (configPageBreakTable.fieldCode) {
    optionPageBreakTableText = setDropDown(targetAppAllText, configPageBreakTable.fieldCode); //改ページを行うサブテーブル内のフィールド一覧
  }

  let optionTableText = [];
  if (configTable.fieldCode) {
    optionTableText = setDropDown(targetAppAllText, configTable.fieldCode); //その他のサブテーブル内のフィールド一覧
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
  const app = createApp(PDFInjectorConfigApp, {
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
