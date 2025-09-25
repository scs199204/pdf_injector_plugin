import { createApp } from 'vue';
import PDFInjectorConfigApp from '../components/PDFInjectorConfigApp.vue';

(async function (PLUGIN_ID) {
  'use strict';
  const APP_ID = kintone.app.getId();

  // Vueコンポーネントに渡す初期データとオプション
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  // nullの場合の初期値
  const initialConfig = {
    configButton: config.configButton ? JSON.parse(config.configButton) : { spaceField: '', textContent: '' },
    configPdf: config.configPdf ? JSON.parse(config.configPdf) : { appId: '', name: '', recordId: '', attachment: '', outputFileName: '', useFileNameField: '' },
    configFont: config.configFont ? JSON.parse(config.configFont) : { appId: '', name: '', recordId: '', attachment: '' },
    configPagecount: config.configPagecount ? JSON.parse(config.configPagecount) : { x: '', y: '', size: '', type: 'no' },
    configText: config.configText
      ? JSON.parse(config.configText)
      : [{ id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', targetPage: 'all', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }],
    configImage: config.configImage ? JSON.parse(config.configImage) : [{ id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' }],
    configPageBreakTable: config.configPageBreakTable
      ? JSON.parse(config.configPageBreakTable)
      : {
          fieldCode: '',
          maxRow: '',
          y: '',
          y_Offset: '',
          y_OffsetFontSize: false,
          subtotal: false,
          column: [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '', calc: 'no' }],
        },
    configTable: config.configTable
      ? JSON.parse(config.configTable)
      : {
          fieldCode: '',
          maxRow: '',
          y: '',
          y_Offset: '',
          y_OffsetFontSize: false,
          targetPage: 'all',
          column: [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }],
        },
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
