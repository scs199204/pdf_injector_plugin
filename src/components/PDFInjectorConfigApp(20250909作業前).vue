<template>
  <div class="plugin-config-container">
    <h1 class="page-title">PDFへのデータ出力プラグイン</h1>

    <div class="setting-section">
      <h2 class="section-title">ボタン設定</h2>
      <div v-if="hasErrorButton" class="error-message">
        <p>{{ errorMessageButton }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">ボタンを表示するフィールド名</label>
          <select v-model="configButton.spaceField" class="text-input">
            <option v-for="itemSpace in optionSpace" :value="itemSpace.id" :key="itemSpace.id">
              {{ itemSpace.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">ボタン名称</label>
          <input type="text" v-model="configButton.textContent" class="text-input" />
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">PDF雛形ファイル設定</h2>
      <div v-if="hasErrorPdf" class="error-message">
        <p>{{ errorMessagePdf }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">アプリＩＤ<span class="required-mark">*</span></label>
          <input type="number" v-model="configPdf.appId" @change="appIdChange($event, 'pdf')" class="text-input" :class="{ 'input-error': hasErrorPdf }" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">アプリ名</label>
          <input type="text" v-model="configPdf.name" class="text-input" readonly />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">レコード番号<span class="required-mark">*</span></label>
          <input type="number" v-model="configPdf.recordId" class="text-input" :class="{ 'input-error': hasErrorPdf }" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">添付ファイルフィールド<span class="required-mark">*</span></label>
          <select v-model="configPdf.attachment" class="text-input" :class="{ 'input-error': hasErrorPdf }">
            <option v-for="itemPdfAttachmentFields in optionPdfAttachmentFields" :value="itemPdfAttachmentFields.id" :key="itemPdfAttachmentFields.id">
              {{ itemPdfAttachmentFields.code }}
            </option>
          </select>
        </div>
      </div>
      <div class="setting-item">
        <label class="label-text">出力ファイル名</label>
        <input type="text" v-model="configPdf.outputFileName" class="text-input" />
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">フォントファイル設定</h2>
      <div v-if="hasErrorFont" class="error-message">
        <p>{{ errorMessageFont }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">アプリＩＤ<span class="required-mark">*</span></label>
          <input type="number" v-model="configFont.appId" @change="appIdChange($event, 'font')" class="text-input" :class="{ 'input-error': hasErrorFont }" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">アプリ名</label>
          <input type="text" v-model="configFont.name" class="text-input" readonly />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">レコード番号<span class="required-mark">*</span></label>
          <input type="number" v-model="configFont.recordId" class="text-input" :class="{ 'input-error': hasErrorFont }" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">添付ファイルフィールド<span class="required-mark">*</span></label>
          <select v-model="configFont.attachment" class="text-input" :class="{ 'input-error': hasErrorFont }">
            <option v-for="itemFontAttachmentFields in optionFontAttachmentFields" :value="itemFontAttachmentFields.id" :key="itemFontAttachmentFields.id">
              {{ itemFontAttachmentFields.code }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">ページ番号設定</h2>
      <div v-if="hasErrorPage" class="error-message">
        <p>{{ errorMessagePage }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">左下を起点とした横位置</label>
          <input type="number" v-model="configPagecount.x" class="text-input" :min="0" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">左下を起点とした縦位置</label>
          <input type="number" v-model="configPagecount.y" class="text-input" :min="0" />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">文字サイズ</label>
          <input type="number" v-model="configPagecount.size" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">形式<span class="required-mark">*</span></label>
          <select v-model="configPagecount.type" class="text-input">
            <option v-for="item in optionPageCountType" :value="item.id" :key="item.id">
              {{ item.type }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">描画する文字列の設定</h2>
      <div v-if="hasErrorText" class="error-message">
        <p>{{ errorMessageText }}</p>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th class="table-header-field">フィールドコード</th>
            <th class="table-header-number">横位置</th>
            <th class="table-header-number">縦位置</th>
            <th class="table-header-number">文字サイズ</th>
            <th class="table-header-dropdown">文字寄せ</th>
            <th class="table-header-dropdown">対象ページ</th>
            <th class="table-header-dropdown">形式</th>
            <th class="table-header-color">色</th>
            <th class="table-header-number">最大幅</th>
            <th class="table-header-text">接頭辞</th>
            <th class="table-header-text">接尾辞</th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in configText" :key="row.id">
            <td>
              <select v-model="row.fieldCode" class="text-input" :class="{ 'input-error': isDuplicateError(row, configText, 'fieldCode') }">
                <option v-for="item in optionText" :value="item.id" :key="item.id">
                  {{ item.code }}
                </option>
              </select>
            </td>
            <td><input type="number" v-model="row.x" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.y" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.size" class="text-input" :min="1" /></td>
            <td>
              <select v-model="row.align" class="text-input">
                <option v-for="item in optionTextAlign" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td>
              <select v-model="row.targetPage" class="text-input">
                <option v-for="item in optionTargetPage" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td>
              <select v-model="row.format" class="text-input">
                <option v-for="item in optionTextFormat" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td><input type="color" v-model="row.color" class="text-input color-input" /></td>
            <td><input type="number" v-model="row.maxWidth" class="text-input" :min="0" /></td>
            <td><input type="text" v-model="row.preFix" class="text-input" /></td>
            <td><input type="text" v-model="row.postFix" class="text-input" /></td>
            <td class="table-actions">
              <button @click="addItemText(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemText(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">描画する画像の設定</h2>
      <div v-if="hasErrorImage" class="error-message">
        <p>{{ errorMessageImage }}</p>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th class="table-header-field">フィールドコード</th>
            <th class="table-header-number">横位置</th>
            <th class="table-header-number">縦位置</th>
            <th class="table-header-number">幅の割合</th>
            <th class="table-header-number">幅</th>
            <th class="table-header-dropdown">対象ページ</th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in configImage" :key="row.id">
            <td>
              <select v-model="row.fieldCode" class="text-input" :class="{ 'input-error': isDuplicateError(row, configImage, 'fieldCode') }">
                <option v-for="item in optionImage" :value="item.id" :key="item.id">
                  {{ item.code }}
                </option>
              </select>
            </td>
            <td><input type="number" v-model="row.x" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.y" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.widthRatio" class="text-input" :min="1" /></td>
            <td><input type="number" v-model="row.width" class="text-input" :min="1" /></td>
            <td>
              <select v-model="row.targetPage" class="text-input">
                <option v-for="item in optionTargetPage" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td class="table-actions">
              <button @click="addItemImage(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemImage(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">改ページを行うサブテーブル描画の設定</h2>
      <div v-if="hasErrorPageBreakTable" class="error-message">
        <p>{{ errorMessagePageBreakTable }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">サブテーブルフィールド</label>
          <select v-model="configPageBreakTable.fieldCode" @change="targetTableChange($event, 'pageBreak')" class="text-input">
            <option v-for="item in optionTable" :value="item.id" :key="item.id">
              {{ item.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">1ページあたりの最大行数</label>
          <input type="number" v-model="configPageBreakTable.maxRow" class="text-input" :min="1" />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">先頭行の縦位置</label>
          <input type="number" v-model="configPageBreakTable.y" class="text-input" :min="0" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">1行の高さ</label>
          <input type="number" v-model="configPageBreakTable.y_Offset" class="text-input" :min="1" />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">1行の高さに文字の高さを加える</label>
          <select v-model="configPageBreakTable.y_OffsetFontSize" class="text-input">
            <option v-for="item in optionBool" :value="item.id" :key="item.id">
              {{ item.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">小計行を表示する</label>
          <select v-model="configPageBreakTable.subtotal" class="text-input">
            <option v-for="item in optionBool" :value="item.id" :key="item.id">
              {{ item.type }}
            </option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th class="table-header-field">フィールドコード</th>
            <th class="table-header-number">横位置</th>
            <th class="table-header-number">文字サイズ</th>
            <th class="table-header-dropdown">文字寄せ</th>
            <th class="table-header-dropdown">形式</th>
            <th class="table-header-color">色</th>
            <th class="table-header-number">最大幅</th>
            <th class="table-header-text">接頭辞</th>
            <th class="table-header-text">接尾辞</th>
            <th class="table-header-calc">計算内容</th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in configPageBreakTable.column" :key="row.id">
            <td>
              <select v-model="row.fieldCode" class="text-input" :class="{ 'input-error': isDuplicateError(row, configPageBreakTable.column, 'fieldCode') }">
                <option v-for="item in optionPageBreakTableText" :value="item.id" :key="item.id">
                  {{ item.code }}
                </option>
              </select>
            </td>
            <td><input type="number" v-model="row.x" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.size" class="text-input" :min="1" /></td>
            <td>
              <select v-model="row.align" class="text-input">
                <option v-for="item in optionTextAlign" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td>
              <select v-model="row.format" class="text-input">
                <option v-for="item in optionTextFormat" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td><input type="color" v-model="row.color" class="text-input color-input" /></td>
            <td><input type="number" v-model="row.maxWidth" class="text-input" :min="0" /></td>
            <td><input type="text" v-model="row.preFix" class="text-input" /></td>
            <td><input type="text" v-model="row.postFix" class="text-input" /></td>
            <td>
              <select v-model="row.calc" class="text-input">
                <option v-for="item in optionCalc" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td class="table-actions">
              <button @click="addItemPageBreakTableText(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemPageBreakTableText(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">その他のサブテーブル描画の設定</h2>
      <div v-if="hasErrorTable" class="error-message">
        <p>{{ errorMessageTable }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">サブテーブルフィールド</label>
          <select v-model="configTable.fieldCode" @change="targetTableChange($event, 'other')" class="text-input">
            <option v-for="item in optionTable" :value="item.id" :key="item.id">
              {{ item.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">最大行数</label>
          <input type="number" v-model="configTable.maxRow" class="text-input" :min="1" />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">先頭行の縦位置</label>
          <input type="number" v-model="configTable.y" class="text-input" :min="0" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">1行の高さ</label>
          <input type="number" v-model="configTable.y_Offset" class="text-input" :min="1" />
        </div>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">1行の高さに文字の高さを加える</label>
          <select v-model="configTable.y_OffsetFontSize" class="text-input">
            <option v-for="item in optionBool" :value="item.id" :key="item.id">
              {{ item.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">対象ページ</label>
          <select v-model="configTable.targetPage" class="text-input">
            <option v-for="item in optionTargetPage" :value="item.id" :key="item.id">
              {{ item.type }}
            </option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th class="table-header-field">フィールドコード</th>
            <th class="table-header-number">横位置</th>
            <th class="table-header-number">文字サイズ</th>
            <th class="table-header-dropdown">文字寄せ</th>
            <th class="table-header-dropdown">形式</th>
            <th class="table-header-color">色</th>
            <th class="table-header-number">最大幅</th>
            <th class="table-header-text">接頭辞</th>
            <th class="table-header-text">接尾辞</th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in configTable.column" :key="row.id">
            <td>
              <select v-model="row.fieldCode" class="text-input" :class="{ 'input-error': isDuplicateError(row, configTable.column, 'fieldCode') }">
                <option v-for="item in optionTableText" :value="item.id" :key="item.id">
                  {{ item.code }}
                </option>
              </select>
            </td>
            <td><input type="number" v-model="row.x" class="text-input" :min="0" /></td>
            <td><input type="number" v-model="row.size" class="text-input" :min="1" /></td>
            <td>
              <select v-model="row.align" class="text-input">
                <option v-for="item in optionTextAlign" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td>
              <select v-model="row.format" class="text-input">
                <option v-for="item in optionTextFormat" :value="item.id" :key="item.id">
                  {{ item.type }}
                </option>
              </select>
            </td>
            <td><input type="color" v-model="row.color" class="text-input color-input" /></td>
            <td><input type="number" v-model="row.maxWidth" class="text-input" :min="0" /></td>
            <td><input type="text" v-model="row.preFix" class="text-input" /></td>
            <td><input type="text" v-model="row.postFix" class="text-input" /></td>
            <td class="table-actions">
              <button @click="addItemTableText(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemTableText(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-group">
      <button @click="register" class="action-button primary-button">保存</button>
      <button @click="cancel" class="action-button secondary-button">キャンセル</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

//config.jsから渡される引数(変数、関数)
const props = defineProps({
  initialConfig: Object,
  optionText: Array,
  optionImage: Array,
  optionTable: Array,
  optionSpace: Array,
  optionPdfAttachmentFields: Array,
  optionFontAttachmentFields: Array,
  optionPageBreakTableText: Array,
  optionTableText: Array,
  allApps: Array,
  targetAppAllText: Array,
  getAttachmentFields: {
    type: Function,
    default: () => {},
  },
  setDropDown: {
    type: Function,
    default: () => {},
  },
});

// ページ番号設定のオプション
const optionPageCountType = ref([
  { id: 'no', type: '不要' },
  { id: 'n/n', type: 'n/n' },
  { id: 'Pn', type: 'Pn' },
]);

// テキスト配置のオプション
const optionTextAlign = ref([
  { id: 'left', type: '左寄せ' },
  { id: 'right', type: '右寄せ' },
]);

// 対象ページのオプション
const optionTargetPage = ref([
  { id: 'all', type: '全てのページ' },
  { id: 'first', type: '先頭ページのみ' },
  { id: 'last', type: '最終ページのみ' },
]);

// テキストフォーマットのオプション
const optionTextFormat = ref([
  { id: 'no', type: '' },
  { id: 'comma', type: 'カンマ編集' },
  { id: 'date', type: '日付' },
]);

// はい/いいえのオプション
const optionBool = ref([
  { id: 'true', type: 'はい' },
  { id: 'false', type: 'いいえ' },
]);

// 計算内容のオプション
const optionCalc = ref([
  { id: 'no', type: '' },
  { id: 'sum', type: '合計' },
  { id: 'count', type: '件数' },
]);

// リアクティブな設定データ
const configButton = ref(props.initialConfig.configButton);
const configPdf = ref(props.initialConfig.configPdf);
const configFont = ref(props.initialConfig.configFont);
const configText = ref(props.initialConfig.configText);
const configPagecount = ref(props.initialConfig.configPagecount);
const configImage = ref(props.initialConfig.configImage);
const configPageBreakTable = ref(props.initialConfig.configPageBreakTable);
const configTable = ref(props.initialConfig.configTable);

// リアクティブなドロップダウンリストのデータ
const optionText = ref(props.optionText);
const optionImage = ref(props.optionImage);
const optionTable = ref(props.optionTable);
const optionSpace = ref(props.optionSpace);
const optionPdfAttachmentFields = ref(props.optionPdfAttachmentFields);
const optionFontAttachmentFields = ref(props.optionFontAttachmentFields);
const optionPageBreakTableText = ref(props.optionPageBreakTableText);
const optionTableText = ref(props.optionTableText);
const allApps = ref(props.allApps);
const targetAppAllText = ref(props.targetAppAllText);

// エラー状態とエラーメッセージ
const hasErrorButton = ref(false);
const hasErrorPdf = ref(false);
const hasErrorFont = ref(false);
const hasErrorPage = ref(false);
const hasErrorText = ref(false);
const hasErrorImage = ref(false);
const hasErrorPageBreakTable = ref(false);
const hasErrorTable = ref(false);
const errorMessageButton = ref('');
const errorMessagePdf = ref('');
const errorMessageFont = ref('');
const errorMessagePage = ref('');
const errorMessageText = ref('');
const errorMessageImage = ref('');
const errorMessagePageBreakTable = ref('');
const errorMessageTable = ref('');

/**
 * テーブル内のフィールドコード重複をチェックする
 * @param {object} row - 現在の行のデータ
 * @param {Array<object>} array - テーブル全体の配列データ
 * @param {string} prop - チェックするプロパティ名 ('fieldCode')
 * @returns {boolean} - 重複している場合はtrue
 */
const isDuplicateError = (row, array, prop) => {
  if (!row[prop]) return false;
  const count = array.filter((f) => f[prop] === row[prop]).length;
  return count > 1;
};

/**
 * PDF雛形とフォントで同じ添付ファイルフィールドが指定されているかチェックする
 * @param {object} configPdf - PDF設定
 * @param {object} configFont - フォント設定
 * @returns {boolean} - 同じ場合はtrue
 */
const isSameFieldError = (configPdf, configFont) => {
  return (
    configPdf.appId &&
    configFont.appId &&
    configPdf.recordId &&
    configFont.recordId &&
    configPdf.attachment &&
    configFont.attachment &&
    configPdf.appId == configFont.appId &&
    configPdf.recordId == configFont.recordId &&
    configPdf.attachment == configFont.attachment
  );
};

/**
 * 登録時の全体のエラーチェック
 * @returns {boolean} - エラーがない場合はtrue
 */
const validate = () => {
  // すべてのエラー状態とメッセージをリセット
  hasErrorButton.value = false;
  hasErrorPdf.value = false;
  hasErrorFont.value = false;
  hasErrorPage.value = false;
  hasErrorText.value = false;
  hasErrorImage.value = false;
  hasErrorPageBreakTable.value = false;
  hasErrorTable.value = false;
  errorMessageButton.value = '';
  errorMessagePdf.value = '';
  errorMessageFont.value = '';
  errorMessagePage.value = '';
  errorMessageText.value = '';
  errorMessageImage.value = '';
  errorMessagePageBreakTable.value = '';
  errorMessageTable.value = '';

  // PDF設定の必須チェック
  if (!configPdf.value.appId || !configPdf.value.recordId || !configPdf.value.attachment) {
    errorMessagePdf.value = 'アプリID、レコード番号、添付ファイルフィールドは必須です。';
    hasErrorPdf.value = true;
    return false;
  }

  // PDFとフォントの同一フィールドチェック
  if (isSameFieldError(configPdf.value, configFont.value)) {
    errorMessagePdf.value = 'PDFファイルとフォントファイルで同じフィールドを設定しています。';
    errorMessageFont.value = 'PDFファイルとフォントファイルで同じフィールドを設定しています。';
    hasErrorPdf.value = true;
    hasErrorFont.value = true;
    return false;
  }

  // 描画する文字列のテーブル内の重複チェック
  for (const row of configText.value) {
    if (!row.fieldCode || row.x === '' || row.y === '') {
      errorMessageText.value = '描画する文字列のテーブルで、フィールドコード、横位置、縦位置は必須です。';
      hasErrorText.value = true;
      return false;
    }
    if (isDuplicateError(row, configText.value, 'fieldCode')) {
      errorMessageText.value = '描画する文字列のテーブルで、同じフィールドコードが重複しています。';
      hasErrorText.value = true;
      return false;
    }
  }

  // 描画する画像のテーブル内の重複チェック
  for (const row of configImage.value) {
    if (!row.fieldCode || row.x === '' || row.y === '') {
      errorMessageImage.value = '描画する画像のテーブルで、フィールドコード、横位置、縦位置は必須です。';
      hasErrorImage.value = true;
      return false;
    }
    if (isDuplicateError(row, configImage.value, 'fieldCode')) {
      errorMessageImage.value = '描画する画像のテーブルで、同じフィールドコードが重複しています。';
      hasErrorImage.value = true;
      return false;
    }
  }

  // 改ページを行うサブテーブルのチェック
  if (configPageBreakTable.value.fieldCode) {
    if (!configPageBreakTable.value.maxRow || configPageBreakTable.value.y === '' || !configPageBreakTable.value.y_Offset) {
      errorMessagePageBreakTable.value = '改ページを行うサブテーブル設定で、最大行数、先頭行の縦位置、1行の高さは必須です。';
      hasErrorPageBreakTable.value = true;
      return false;
    }
    for (const row of configPageBreakTable.value.column) {
      if (!row.fieldCode || row.x === '') {
        errorMessagePageBreakTable.value = '改ページを行うサブテーブルの列設定で、フィールドコード、横位置は必須です。';
        hasErrorPageBreakTable.value = true;
        return false;
      }
      if (isDuplicateError(row, configPageBreakTable.value.column, 'fieldCode')) {
        errorMessagePageBreakTable.value = '改ページを行うサブテーブルの列設定で、同じフィールドコードが重複しています。';
        hasErrorPageBreakTable.value = true;
        return false;
      }
    }
  }

  // その他のサブテーブルのチェック
  if (configTable.value.fieldCode) {
    if (!configTable.value.maxRow || configTable.value.y === '' || !configTable.value.y_Offset) {
      errorMessageTable.value = 'その他のサブテーブル設定で、最大行数、先頭行の縦位置、1行の高さは必須です。';
      hasErrorTable.value = true;
      return false;
    }
    for (const row of configTable.value.column) {
      if (!row.fieldCode || row.x === '') {
        errorMessageTable.value = 'その他のサブテーブルの列設定で、フィールドコード、横位置は必須です。';
        hasErrorTable.value = true;
        return false;
      }
      if (isDuplicateError(row, configTable.value.column, 'fieldCode')) {
        errorMessageTable.value = 'その他のサブテーブルの列設定で、同じフィールドコードが重複しています。';
        hasErrorTable.value = true;
        return false;
      }
    }
  }

  return true;
};

/**
 * アプリID変更時に添付ファイルフィールドを取得
 * @param {Event} event - changeイベント
 * @param {string} target - 'pdf'または'font'
 */
const appIdChange = async (event, target) => {
  const appId = event.target.value;
  const targetApp = allApps.value.find((item) => item.appId == appId);
  if (targetApp) {
    const attachmentFields = await props.getAttachmentFields(appId, targetApp);
    if (target === 'pdf') {
      configPdf.value.name = targetApp.appName;
      optionPdfAttachmentFields.value = attachmentFields;
    } else {
      configFont.value.name = targetApp.appName;
      optionFontAttachmentFields.value = attachmentFields;
    }
  } else {
    if (target === 'pdf') {
      configPdf.value.name = '';
      configPdf.value.attachment = '';
      optionPdfAttachmentFields.value = [];
    } else {
      configFont.value.name = '';
      configFont.value.attachment = '';
      optionFontAttachmentFields.value = [];
    }
  }
};

/**
 * 対象となるサブテーブル変更時の処理
 * @param {Event} event - changeイベント
 * @param {string} target - 'pageBreak'または'other'
 */
const targetTableChange = async (event, target) => {
  const defaultRow = {
    id: Date.now(),
    fieldCode: '',
    x: '',
    size: '',
    align: 'left',
    format: 'no',
    color: '#000000',
    maxWidth: '',
    preFix: '',
    postFix: '',
  };
  if (target == 'pageBreak') {
    configPageBreakTable.value.column = [{ ...defaultRow, calc: 'no' }];
    optionPageBreakTableText.value = props.setDropDown(targetAppAllText.value, event.target.value);
  } else {
    configTable.value.column = [{ ...defaultRow }];
    optionTableText.value = props.setDropDown(targetAppAllText.value, event.target.value);
  }
};

/**
 * 登録ボタンクリック時
 */
const register = () => {
  if (!validate()) {
    return;
  }

  try {
    const param = {
      configButton: JSON.stringify(configButton.value),
      configPdf: JSON.stringify(configPdf.value),
      configFont: JSON.stringify(configFont.value),
      configPagecount: JSON.stringify(configPagecount.value),
      configText: JSON.stringify(configText.value),
      configImage: JSON.stringify(configImage.value),
      configPageBreakTable: JSON.stringify(configPageBreakTable.value),
      configTable: JSON.stringify(configTable.value),
    };

    kintone.plugin.app.setConfig(param, () => {
      alert('プラグインの設定が保存されました！アプリを更新してください！');
      window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
    });
  } catch (e) {
    console.error('name: ' + e.name + ' message: ' + e.message);
    hasErrorButton.value = true;
    errorMessageButton.value = '設定の保存中にエラーが発生しました。';
  }
};

/**
 * キャンセルボタンクリック時
 */
const cancel = () => {
  window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
};

/**
 * 描画する文字列のテーブル行追加
 */
const addItemText = (index) => {
  configText.value.splice(index + 1, 0, {
    id: Date.now(),
    fieldCode: '',
    x: '',
    y: '',
    size: '',
    align: 'left',
    targetPage: 'all',
    format: 'no',
    color: '#000000',
    maxWidth: '',
    preFix: '',
    postFix: '',
  });
};

/**
 * 描画する文字列のテーブル行削除
 */
const removeItemText = (index) => {
  configText.value.splice(index, 1);
  if (configText.value.length === 0) {
    addItemText(-1);
  }
};

/**
 * 描画する画像のテーブル行追加
 */
const addItemImage = (index) => {
  configImage.value.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' });
};

/**
 * 描画する画像のテーブル行削除
 */
const removeItemImage = (index) => {
  configImage.value.splice(index, 1);
  if (configImage.value.length === 0) {
    addItemImage(-1);
  }
};

/**
 * 改ページを行うサブテーブルのテーブル行追加
 */
const addItemPageBreakTableText = (index) => {
  configPageBreakTable.value.column.splice(index + 1, 0, {
    id: Date.now(),
    fieldCode: '',
    x: '',
    y: '',
    size: '',
    align: 'left',
    format: 'no',
    color: '#000000',
    maxWidth: '',
    preFix: '',
    postFix: '',
    calc: 'no',
  });
};

/**
 * 改ページを行うサブテーブルのテーブル行削除
 */
const removeItemPageBreakTableText = (index) => {
  configPageBreakTable.value.column.splice(index, 1);
  if (configPageBreakTable.value.column.length === 0) {
    addItemPageBreakTableText(-1);
  }
};

/**
 * その他のサブテーブルのテーブル行追加
 */
const addItemTableText = (index) => {
  configTable.value.column.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' });
};

/**
 * その他のサブテーブルのテーブル行削除
 */
const removeItemTableText = (index) => {
  configTable.value.column.splice(index, 1);
  if (configTable.value.column.length === 0) {
    addItemTableText(-1);
  }
};
</script>

<style scoped>
/* 基本的なリセットとフォント */
.plugin-config-container {
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 2.5rem;
  max-width: 1300px;
  margin: 30px auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e7eb;
}

/* ヘッダー */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f4f7;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 20px;
  border-left: 4px solid #4a90e2;
  padding-left: 10px;
}

.section-divider {
  border: 0;
  border-top: 1px solid #f0f4f7;
  margin: 30px 0;
}

/* 設定項目 */
.setting-section {
  margin-bottom: 30px;
}

.setting-item {
  margin-bottom: 20px;
}

/* フォーム要素の共通スタイル */
.text-input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  background-color: #fcfdfe;
  font-size: 15px;
  color: #333;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.text-input:focus,
select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
  background-color: #ffffff;
}

/* セレクトボックスのカスタム矢印 */
select {
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  cursor: pointer;
}

/* エラー表示 */
.input-error {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2) !important;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 12px;
  font-weight: 500;
  background-color: #ffebeb;
  border: 1px solid #e74c3c;
  padding: 10px;
  border-radius: 8px;
}

.required-mark {
  color: #e74c3c;
  font-weight: bold;
  margin-left: 4px;
}

/* データテーブルスタイル */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border: 1px solid #e0e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  border: 1px solid #f0f4f7;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background-color: #f7f9fb;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.data-table .text-input,
.data-table select {
  padding: 8px 10px;
  font-size: 14px;
}

/* 列幅の調整 */
.table-header-field {
  width: 14%;
}
.table-header-number {
  width: 6%;
}
.table-header-dropdown {
  width: 8%;
}
.table-header-color {
  width: 6%;
}
.table-header-text {
  width: 8%;
}
.table-header-calc {
  width: 8%;
}
.table-header-action {
  width: 60px;
  text-align: center;
}

/* 行追加・削除ボタン */
.table-actions {
  white-space: nowrap;
  text-align: center;
}

.action-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0 5px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.add-button {
  background-color: #e6f7ff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%234a90e2%22%20d%3D%22M19%2013h-6v6h-2v-6H5v-2h6V5h2v6h6v2z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.remove-button {
  background-color: #ffebeb;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23e74c3c%22%20d%3D%22M19%2013H5v-2h14v2z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.action-icon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
  background-color: #d1efff;
}
.remove-button:hover {
  background-color: #ffd1d1;
}

/* フッターのボタン */
.button-group {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f0f4f7;
}

.action-button {
  padding: 12px 30px;
  margin: 0 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.primary-button {
  background-color: #4a90e2;
  color: white;
}

.primary-button:hover {
  background-color: #357bd8;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.secondary-button {
  background-color: #eceff1;
  color: #555;
  border: 1px solid #cfd8dc;
}

.secondary-button:hover {
  background-color: #e0e4e6;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

/* アプリIDとアプリ名を横並びにするためのフレックスコンテナ */
.app-config-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.input-wrapper {
  flex: 1;
}

.label-text {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  font-size: 15px;
}
</style>
