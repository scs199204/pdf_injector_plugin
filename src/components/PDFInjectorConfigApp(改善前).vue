<template>
  <div class="plugin-config-container">
    <h1 class="page-title">PDFへのデータ出力プラグイン</h1>

    <!--PDFの指定-->
    <div class="setting-section">
      <h2 class="section-title">ボタン設定</h2>
      <div v-if="hasErrorButton" class="error-messageButton">
        <p>{{ errorMessageButton }}</p>
      </div>
      <!--フィールド名、ボタンに表示する文言-->
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">ボタンを表示するフィールド名</label>
          <select v-model="configButton.spaceField">
            <option v-for="itemSpace in optionSpace" :value="itemSpace.id" :key="itemSpace.id">
              {{ itemSpace.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">ボタン名称:</label>
          <input type="text" v-model="configButton.textContent" class="text-input" />
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <!--PDFの指定-->
    <div class="setting-section">
      <h2 class="section-title">PDF雛形ファイル設定</h2>
      <div v-if="hasErrorPdf" class="error-messagePdf">
        <p>{{ errorMessagePdf }}</p>
      </div>

      <!--アプリＩＤ、アプリ名-->
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">アプリＩＤ:</label>
          <input type="number" v-model="configPdf.appId" @change="appIdChange($event, 'pdf')" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">アプリ名:</label>
          <input type="text" v-model="configPdf.name" class="text-input" readonly />
        </div>
      </div>

      <!--レコード番号、フィールド名-->
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">レコード番号:</label>
          <input type="number" v-model="configPdf.recordId" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">フィールド名</label>
          <select v-model="configPdf.attachment" :class="{ 'input-error': isSameFieldError(configPdf, configFont) }">
            <option v-for="itemPdfAttachmentFields in optionPdfAttachmentFields" :value="itemPdfAttachmentFields.id" :key="itemPdfAttachmentFields.id">
              {{ itemPdfAttachmentFields.code }}
            </option>
          </select>
        </div>
      </div>

      <div class="setting-item">
        <label class="label-text">出力ファイル名:</label>
        <input type="text" v-model="configPdf.outputFileName" class="text-input" />
      </div>
    </div>

    <hr class="section-divider" />

    <!--フォントの指定-->
    <div class="setting-section">
      <h2 class="section-title">フォントファイル設定</h2>
      <div v-if="hasErrorFont" class="error-messageFont">
        <p>{{ errorMessageFont }}</p>
      </div>

      <!--アプリＩＤ、アプリ名-->
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">アプリＩＤ:</label>
          <input type="number" v-model="configFont.appId" @change="appIdChange($event, 'font')" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">アプリ名:</label>
          <input type="text" v-model="configFont.name" class="text-input" />
        </div>
      </div>

      <!--レコード番号、フィールド名-->
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">レコード番号:</label>
          <input type="number" v-model="configFont.recordId" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">フィールド名</label>
          <select v-model="configFont.attachment" :class="{ 'input-error': isSameFieldError(configPdf, configFont) }">
            <option v-for="itemFontAttachmentFields in optionFontAttachmentFields" :value="itemFontAttachmentFields.id" :key="itemFontAttachmentFields.id">
              {{ itemFontAttachmentFields.code }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <!--ページ番号の指定-->
    <div class="setting-section">
      <h2 class="section-title">ページ番号設定</h2>
      <div v-if="hasErrorPage" class="error-messagePage">
        <p>{{ errorMessagePage }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">左下を起点とした横位置:</label>
          <input type="number" v-model="configPagecount.x" class="text-input" :min="0" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">左下を起点とした縦位置:</label>
          <input type="number" v-model="configPagecount.y" class="text-input" :min="0" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">文字サイズ:</label>
          <input type="number" v-model="configPagecount.size" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">形式</label>
          <select v-model="configPagecount.type">
            <option v-for="itemPageCountType in optionPageCountType" :value="itemPageCountType.id" :key="itemPageCountType.id">
              {{ itemPageCountType.type }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <!--描画する文字列の指定-->
    <div class="setting-section">
      <h2 class="section-title">描画する文字列の設定</h2>
      <div v-if="hasErrorText" class="error-messageText">
        <p>{{ errorMessageText }}</p>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="field-header"><span class="title">フィールドコード</span></th>
            <th class="field-header-number"><span class="title">横位置</span></th>
            <th class="field-header-number"><span class="title">縦位置</span></th>
            <th class="field-header-number"><span class="title">文字サイズ</span></th>
            <th class="field-header-dropdown"><span class="title">文字寄せ</span></th>
            <th class="field-header-dropdown"><span class="title">対象ページ</span></th>
            <th class="field-header-dropdown"><span class="title">形式</span></th>
            <th class="field-header-color"><span class="title">色</span></th>
            <th class="field-header-number"><span class="title">最大幅</span></th>
            <th class="field-header-text"><span class="title">接頭辞</span></th>
            <th class="field-header-text"><span class="title">接尾辞</span></th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(configTextRow, index) in configText" :key="configText.id">
            <!--フィールドコード-->
            <td>
              <select v-model="configTextRow.fieldCode" :class="{ 'input-error': isDuplicateError(configTextRow, configText, 'fieldCode') }">
                <option v-for="itemText in optionText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <!--縦位置-->
            <td>
              <input type="number" v-model="configTextRow.x" class="text-input" :min="0" />
            </td>

            <!--横位置-->
            <td>
              <input type="number" v-model="configTextRow.y" class="text-input" :min="0" />
            </td>

            <!--文字サイズ--><td>
              <input type="number" v-model="configTextRow.size" class="text-input" :min="1" />
            </td>

            <!--文字寄せ--><td>
              <select v-model="configTextRow.align">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <!--対象ページ-->
            <td>
              <select v-model="configTextRow.targetPage">
                <option v-for="itemTargetPage in optionTargetPage" :value="itemTargetPage.id" :key="itemTargetPage.id">
                  {{ itemTargetPage.type }}
                </option>
              </select>
            </td>

            <!--形式-->
            <td>
              <select v-model="configTextRow.format">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <!--色-->
            <td>
              <div class="color-picker-wrapper">
                <input type="color" v-model="configTextRow.color" class="color-input" />
                <span class="color-display" :style="{ backgroundColor: configTextRow.color }">{{ configTextRow.color }}</span>
              </div>
            </td>

            <!--最大幅-->
            <td>
              <input type="number" v-model="configTextRow.maxWidth" class="text-input" :min="0" />
            </td>

            <!--接頭辞-->
            <td>
              <input type="text" v-model="configTextRow.prefix" class="text-input" />
            </td>

            <!--接尾辞-->
            <td>
              <input type="text" v-model="configTextRow.postFix" class="text-input" />
            </td>

            <td class="table-actions">
              <button @click="addItemText(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemText(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr class="section-divider" />

    <!--描画する画像の指定-->
    <div class="setting-section">
      <h2 class="section-title">描画する画像の設定</h2>
      <div v-if="hasErrorImage" class="error-messageImage">
        <p>{{ errorMessageImage }}</p>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="field-header"><span class="title">フィールドコード</span></th>
            <th class="field-header-number"><span class="title">横位置</span></th>
            <th class="field-header-number"><span class="title">縦位置</span></th>
            <th class="field-header-number"><span class="title">幅の割合</span></th>
            <th class="field-header-number"><span class="title">幅</span></th>
            <th class="field-header"><span class="title">対象ページ</span></th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(configImageRow, index) in configImage" :key="configImage.id">
            <!--フィールドコード-->
            <td>
              <select v-model="configImageRow.fieldCode" :class="{ 'input-error': isDuplicateError(configImageRow, configImage, 'fieldCode') }">
                <option v-for="itemImage in optionImage" :value="itemImage.id" :key="itemImage.id">
                  {{ itemImage.code }}
                </option>
              </select>
            </td>

            <!--縦位置-->
            <td>
              <input type="number" v-model="configImageRow.x" class="text-input" :min="0" />
            </td>

            <!--横位置-->
            <td>
              <input type="number" v-model="configImageRow.y" class="text-input" :min="0" />
            </td>

            <!--幅の割合--><td>
              <input type="number" v-model="configImageRow.widthRatio" class="text-input" :min="1" />
            </td>

            <!--幅--><td>
              <input type="number" v-model="configImageRow.width" class="text-input" :min="1" />
            </td>

            <!--対象ページ-->
            <td>
              <select v-model="configImageRow.targetPage">
                <option v-for="itemTargetPage in optionTargetPage" :value="itemTargetPage.id" :key="itemTargetPage.id">
                  {{ itemTargetPage.type }}
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

    <!--改ページを行うサブテーブル描画の指定-->
    <div class="setting-section">
      <h2 class="section-title">改ページを行うサブテーブル描画の設定</h2>
      <div v-if="hasErrorPageBreakTable" class="error-messagePageBreakTable">
        <p>{{ errorMessagePageBreakTable }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">フィールド名</label>
          <select v-model="configPageBreakTable.fieldCode" @change="targetTableChange($event, 'pageBreak')">
            <option v-for="itemTable in optionTable" :value="itemTable.id" :key="itemTable.id">
              {{ itemTable.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">１ページあたりの最大行数:</label>
          <input type="number" v-model="configPageBreakTable.maxRow" class="text-input" :min="1" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">先頭行の縦位置:</label>
          <input type="number" v-model="configPageBreakTable.y" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">１行の高さ:</label>
          <input type="number" v-model="configPageBreakTable.y_Offset" class="text-input" :min="1" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">１行の高さに文字の高さを加える</label>
          <select v-model="configPageBreakTable.y_OffsetFontSize">
            <option v-for="itemBool in optionBool" :value="itemBool.id" :key="itemBool.id">
              {{ itemBool.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">小計行を表示する</label>
          <select v-model="configPageBreakTable.subtotal">
            <option v-for="itemBool in optionBool" :value="itemBool.id" :key="itemBool.id">
              {{ itemBool.type }}
            </option>
          </select>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="field-header"><span class="title">フィールドコード</span></th>
            <th class="field-header-number"><span class="title">横位置</span></th>
            <th class="field-header-number"><span class="title">文字サイズ</span></th>
            <th class="field-header-dropdown"><span class="title">文字寄せ</span></th>
            <th class="field-header-dropdown"><span class="title">形式</span></th>
            <th class="field-header-color"><span class="title">色</span></th>
            <th class="field-header-number"><span class="title">最大幅</span></th>
            <th class="field-header-text"><span class="title">接頭辞</span></th>
            <th class="field-header-text"><span class="title">接尾辞</span></th>
            <th class="field-header-dropdown"><span class="title">計算内容</span></th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(configPageBreakTableRow, index) in configPageBreakTable.column" :key="configPageBreakTable.column.id">
            <!--フィールドコード-->
            <td>
              <select v-model="configPageBreakTableRow.fieldCode" :class="{ 'input-error': isDuplicateError(configPageBreakTableRow, configPageBreakTable.column, 'fieldCode') }">
                <option v-for="itemText in optionPageBreakTableText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <!--横位置-->
            <td>
              <input type="number" v-model="configPageBreakTableRow.x" class="text-input" :min="0" />
            </td>

            <!--文字サイズ--><td>
              <input type="number" v-model="configPageBreakTableRow.size" class="text-input" :min="1" />
            </td>

            <!--文字寄せ--><td>
              <select v-model="configPageBreakTableRow.align">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <!--形式-->
            <td>
              <select v-model="configPageBreakTableRow.format">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <!--色-->
            <td>
              <div class="color-picker-wrapper">
                <input type="color" v-model="configPageBreakTableRow.color" class="color-input" />
                <span class="color-display" :style="{ backgroundColor: configPageBreakTableRow.color }">{{ configPageBreakTableRow.color }}</span>
              </div>
            </td>

            <!--最大幅-->
            <td>
              <input type="number" v-model="configPageBreakTableRow.maxWidth" class="text-input" :min="0" />
            </td>

            <!--接頭辞-->
            <td>
              <input type="text" v-model="configPageBreakTableRow.prefix" class="text-input" />
            </td>

            <!--接尾辞-->
            <td>
              <input type="text" v-model="configPageBreakTableRow.postFix" class="text-input" />
            </td>

            <!--計算内容-->
            <td>
              <select v-model="configPageBreakTableRow.calc">
                <option v-for="itemCalc in optionCalc" :value="itemCalc.id" :key="itemCalc.id">
                  {{ itemCalc.type }}
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

    <!--その他のサブテーブル描画の指定-->
    <div class="setting-section">
      <h2 class="section-title">その他のサブテーブル描画の設定</h2>
      <div v-if="hasErrorTable" class="error-messageTable">
        <p>{{ errorMessageTable }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">フィールド名</label>
          <select v-model="configTable.fieldCode" @change="targetTableChange($event, 'other')">
            <option v-for="itemTable in optionTable" :value="itemTable.id" :key="itemTable.id">
              {{ itemTable.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">最大行数:</label>
          <input type="number" v-model="configTable.maxRow" class="text-input" :min="1" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">先頭行の縦位置:</label>
          <input type="number" v-model="configTable.y" class="text-input" :min="1" />
        </div>
        <div class="input-wrapper">
          <label class="label-text">１行の高さ:</label>
          <input type="number" v-model="configTable.y_Offset" class="text-input" :min="1" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text">１行の高さに文字の高さを加える</label>
          <select v-model="configTable.y_OffsetFontSize">
            <option v-for="itemBool in optionBool" :value="itemBool.id" :key="itemBool.id">
              {{ itemBool.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text">対象ページ</label>
          <select v-model="configTable.targetPage">
            <option v-for="itemTargetPage in optionTargetPage" :value="itemTargetPage.id" :key="itemTargetPage.id">
              {{ itemTargetPage.type }}
            </option>
          </select>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th class="field-header"><span class="title">フィールドコード</span></th>
            <th class="field-header-number"><span class="title">横位置</span></th>
            <th class="field-header-number"><span class="title">文字サイズ</span></th>
            <th class="field-header-dropdown"><span class="title">文字寄せ</span></th>
            <th class="field-header-dropdown"><span class="title">形式</span></th>
            <th class="field-header-color"><span class="title">色</span></th>
            <th class="field-header-number"><span class="title">最大幅</span></th>
            <th class="field-header-text"><span class="title">接頭辞</span></th>
            <th class="field-header-text"><span class="title">接尾辞</span></th>
            <th class="table-header-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(configTableRow, index) in configTable.column" :key="configTable.column.id">
            <!--フィールドコード-->
            <td>
              <select v-model="configTableRow.fieldCode" :class="{ 'input-error': isDuplicateError(configTableRow, configTable.column, 'fieldCode') }">
                <option v-for="itemText in optionTableText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <!--横位置-->
            <td>
              <input type="number" v-model="configTableRow.x" class="text-input" :min="0" />
            </td>

            <!--文字サイズ--><td>
              <input type="number" v-model="configTableRow.size" class="text-input" :min="1" />
            </td>

            <!--文字寄せ--><td>
              <select v-model="configTableRow.align">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <!--形式-->
            <td>
              <select v-model="configTableRow.format">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <!--色-->
            <td>
              <div class="color-picker-wrapper">
                <input type="color" v-model="configTableRow.color" class="color-input" />
                <span class="color-display" :style="{ backgroundColor: configTableRow.color }">{{ configTableRow.color }}</span>
              </div>
            </td>

            <!--最大幅-->
            <td>
              <input type="number" v-model="configTableRow.maxWidth" class="text-input" :min="0" />
            </td>

            <!--接頭辞-->
            <td>
              <input type="text" v-model="configTableRow.prefix" class="text-input" />
            </td>

            <!--接尾辞-->
            <td>
              <input type="text" v-model="configTableRow.postFix" class="text-input" />
            </td>

            <td class="table-actions">
              <button @click="addItemTableText(index)" type="button" class="action-icon-button add-button" title="行を追加"></button>
              <button @click="removeItemTableText(index)" type="button" class="action-icon-button remove-button" title="行を削除"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-group">
      <button @click="register" class="action-button primary-button">登録</button>
      <button @click="cancel" class="action-button secondary-button" type="button">キャンセル</button>
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

//ページ番号設定
const optionPageCountType = ref([
  { id: 'no', type: '不要' },
  { id: 'n/n', type: 'n/n' },
  { id: 'Pn', type: 'Pn' },
]);

const optionTextAlign = ref([
  { id: 'left', type: '左寄せ' },
  { id: 'right', type: '右寄せ' },
]);

const optionTargetPage = ref([
  { id: 'all', type: '全てのページ' },
  { id: 'first', type: '先頭ページのみ' },
  { id: 'last', type: '最終ページのみ' },
]);

const optionTextFormat = ref([
  { id: 'no', type: '' },
  { id: 'comma', type: 'カンマ編集' },
  { id: 'date', type: '日付' },
]);

const optionBool = ref([
  { id: 'true', type: 'はい' },
  { id: 'false', type: 'いいえ' },
]);

const optionCalc = ref([
  { id: 'no', type: '' },
  { id: 'sum', type: '合計' },
  { id: 'count', type: '件数' },
]);

//リアクティブな変数(sourceAppId.valueでアクセス)
const configButton = ref(props.initialConfig.configButton);
const configPdf = ref(props.initialConfig.configPdf);
const configFont = ref(props.initialConfig.configFont);
const configText = ref(props.initialConfig.configText);
const configPagecount = ref(props.initialConfig.configPagecount);
const configImage = ref(props.initialConfig.configImage);
const configPageBreakTable = ref(props.initialConfig.configPageBreakTable);
const configTable = ref(props.initialConfig.configTable);

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

// テーブル内でのフィールド重複のバリデーション
const isDuplicateError = (param, array, prop) => {
  const allOutputFields = array.map((p) => p[prop]).filter((f) => f !== '');
  const count = allOutputFields.filter((f) => f === param[prop]).length;
  return count > 1;
};

//ＰＤＦ雛形とフォントが同じフィールドを指定している
const isSameFieldError = (configPdf, configFont) => {
  return configPdf.appId == configFont.appId && configPdf.recordId == configFont.recordId && configPdf.attachment == configFont.attachment;
};

// 登録時に全体のエラーチェック
const validate = () => {
  errorMessageButton = '';
  errorMessagePdf = '';
  errorMessageFont = '';
  errorMessagePage = '';
  errorMessageText = '';
  errorMessageImage = '';
  errorMessagePageBreakTable = '';
  errorMessageTable = '';
  hasErrorButton.value = false;
  hasErrorPdf.value = false;
  hasErrorFont.value = false;
  hasErrorPage.value = false;
  hasErrorText.value = false;
  hasErrorImage.value = false;
  hasErrorPageBreakTable.value = false;
  hasErrorTable.value = false;

  if (isSameFieldError(configPdf.value, configFont.value)) {
    errorMessagePdf.value = 'ＰＤＦファイルとフォントファイルで同じフィールドを設定しています';
    errorMessageFont.value = 'ＰＤＦファイルとフォントファイルで同じフィールドを設定しています';
    hasErrorPdf.value = true;
    hasErrorFont.value = true;
    return false;
  }

  /*
  for (const copyFieldRow of copyField.value) {
    if (isDuplicateError(copyFieldRow, copyField.value, 'source')) {
      errorMessage.value = 'その他コピーフィールドで、同じフィールドを設定しています';
      hasError.value = true;
      return false;
    }
    if (isDuplicateError(copyFieldRow, copyField.value, 'target')) {
      errorMessage.value = 'その他コピーフィールドで、同じフィールドを設定しています';
      hasError.value = true;
      return false;
    }
    if (isOtherFieldTypeError(copyFieldRow)) {
      errorMessage.value = 'その他コピーフィールドで、異なるフィールドタイプのコピーを設定しています';
      hasError.value = true;
      return false;
    }
  }

  for (const ordersRow of orders.value) {
    if (isDuplicateError(ordersRow, orders.value, 'field')) {
      errorMessage.value = '表示順番で、同じフィールドを設定しています';
      hasError.value = true;
      return false;
    }
  }
    */
  return true;
};

const appIdChange = async (event, target) => {
  const targetApp = allApps.value.find((item) => item.appId == event.target.value);
  if (targetApp) {
    const attachmentFields = await props.getAttachmentFields(event.target.value, targetApp);
    if (target == 'pdf') {
      configPdf.value.name = targetApp.appName;
      optionPdfAttachmentFields.value = attachmentFields;
    } else {
      configFont.value.name = targetApp.appName;
      optionFontAttachmentFields.value = attachmentFields;
    }
  } else {
    if (target == 'pdf') {
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

//対象となるサブテーブルを変更
const targetTableChange = async (event, target) => {
  if (target == 'pageBreak') {
    configPageBreakTable.value.column = [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }];
    optionPageBreakTableText.value = props.setDropDown(targetAppAllText.value, event.target.value);
  } else {
    configTable.value.column = [{ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' }];
    optionTableText.value = props.setDropDown(targetAppAllText.value, event.target.value);
  }
};

//登録ボタンクリック時
const register = () => {
  if (!validate()) {
    return;
  }

  try {
    //CONFIGに設定内容を保存する
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

//キャンセルボタンクリック時
const cancel = () => {
  window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
};

//描画する文字列のテーブル行追加
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

//描画する文字列のテーブル行削除
const removeItemText = (index) => {
  configText.value.splice(index, 1);
  if (configText.value.length === 0) {
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
  }
};

//描画する画像のテーブル行追加
const addItemImage = (index) => {
  configImage.value.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' });
};

//描画する画像のテーブル行削除
const removeItemImage = (index) => {
  configImage.value.splice(index, 1);
  if (configImage.value.length === 0) {
    configImage.value.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' });
  }
};

//改ページを行うサブテーブルのテーブル行追加
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
  });
};

//改ページを行うサブテーブルのテーブル行削除
const removeItemPageBreakTableText = (index) => {
  configPageBreakTable.value.column.splice(index, 1);
  if (configPageBreakTable.value.column.length === 0) {
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
    });
  }
};

//その他のサブテーブルのテーブル行追加
const addItemTableText = (index) => {
  configTable.value.column.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' });
};

//その他のサブテーブルのテーブル行削除
const removeItemTableText = (index) => {
  configTable.value.column.splice(index, 1);
  if (configTable.value.column.length === 0) {
    configTable.value.column.splice(index + 1, 0, { id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', preFix: '', postFix: '' });
  }
};
</script>

<style scoped>
/* 基本的なリセットとフォント */
.plugin-config-container {
  font-family: 'Inter', 'Noto Sans JP', sans-serif; /* モダンなフォント優先 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
  max-width: 1300px; /* テーブル幅に合わせて最大幅を調整 */
  margin: 30px auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* 柔らかい影 */
  border: 1px solid #e0e7eb; /* 控えめな境界線 */
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
  border-left: 4px solid #4a90e2; /* アクセントカラー */
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

.label-text {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  font-size: 15px;
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
  box-sizing: border-box; /* paddingとborderを幅に含める */
}

.text-input:focus,
select:focus {
  border-color: #4a90e2; /* フォーカス時のアクセントカラー */
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2); /* 柔らかい影 */
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
  border-color: #e74c3c !important; /* 強調された赤色 */
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2) !important;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
}

/* データテーブルスタイル */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border: 1px solid #e0e7eb; /* 控えめな境界線 */
  border-radius: 8px;
  overflow: hidden; /* 角丸を適用するため */
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  border: 1px solid #f0f4f7; /* セル間の区切り線 */
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background-color: #f7f9fb;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

/* 列幅の調整 */
.field-header-number {
  width: 8%;
}
.field-header-text {
  width: 7%;
}
.field-header-dropdown {
  width: 8%;
}
.field-header-color {
  width: 8%;
}

.table-header-action {
  width: 60px; /* 操作列の幅固定 */
  text-align: center;
}

/* テーブル内のフォーム要素 */
.data-table .text-input,
.data-table select {
  padding: 8px 10px; /* テーブル内で少し小さめに */
  font-size: 14px;
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
  width: 28px; /* ボタンのサイズ */
  height: 28px;
  display: inline-flex; /* flexboxで中央揃え */
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* 丸いボタン */
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.add-button {
  background-color: #e6f7ff; /* 薄い青 */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%234a90e2%22%20d%3D%22M19%2013h-6v6h-2v-6H5v-2h6V5h2v6h6v2z%22%2F%3E%3C%2Fsvg%3E'); /* モダンなプラスアイコン */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.remove-button {
  background-color: #ffebeb; /* 薄い赤 */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23e74c3c%22%20d%3D%22M19%2013H5v-2h14v2z%22%2F%3E%3C%2Fsvg%3E'); /* モダンなマイナスアイコン */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.action-icon-button:hover {
  transform: translateY(-2px); /* 少し浮き上がるエフェクト */
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 柔らかい影 */
}

.primary-button {
  background-color: #4a90e2; /* メインカラー */
  color: white;
}

.primary-button:hover {
  background-color: #357bd8; /* 少し濃く */
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.secondary-button {
  background-color: #eceff1; /* 薄いグレー */
  color: #555;
  border: 1px solid #cfd8dc;
}

.secondary-button:hover {
  background-color: #e0e4e6;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.required-mark {
  color: #e74c3c; /* 赤色 */
  font-weight: bold;
  margin-left: 4px; /* ラベルとの間隔 */
}

/* アプリIDとアプリ名を横並びにするためのフレックスコンテナ */
.app-config-row {
  display: flex;
  gap: 20px; /* 要素間の隙間 */
  margin-bottom: 20px; /* セクション内の他の要素との間隔 */
}

/* 横並びの各要素のスタイル */
.input-wrapper {
  flex: 1; /* 均等な幅を割り当てる */
}

.label-text {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  font-size: 15px;
}

/* inputのwidthを100%からflexboxに合わせて調整 */
.input-wrapper .text-input {
  width: 100%;
}
</style>
