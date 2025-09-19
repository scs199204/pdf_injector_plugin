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
  });
  const vm = app.mount('#app');
})(kintone.$PLUGIN_ID);
