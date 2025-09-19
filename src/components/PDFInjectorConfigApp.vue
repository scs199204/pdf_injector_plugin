<template>
  <div id="loading-overlay" v-if="isLoading">
    <div class="spinner"></div>
  </div>
  <div class="plugin-config-container">
    <h1 class="page-title">PDFへのデータ出力プラグイン</h1>

    <div class="setting-section">
      <h2 class="section-title">ボタン設定</h2>
      <div v-if="errors.button.hasError" class="error-message">
        <p>{{ errors.button.message }}</p>
      </div>
      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="button-spaceField">ボタンを表示するフィールド名 <span class="required-mark">*</span></label>
          <select v-model="configButton.spaceField" id="button-spaceField">
            <option v-for="itemSpace in optionSpace" :value="itemSpace.id" :key="itemSpace.id">
              {{ itemSpace.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="button-textContent">ボタン名称:</label>
          <input type="text" v-model="configButton.textContent" id="button-textContent" class="text-input" />
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">PDF雛形ファイル設定</h2>
      <div v-if="errors.pdf.hasError" class="error-message">
        <p>{{ errors.pdf.message }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pdf-appId">アプリＩＤ:<span class="required-mark">*</span></label>
          <input type="number" v-model="configPdf.appId" @change="appIdChange($event, 'pdf')" id="pdf-appId" class="text-input" :class="{ 'input-error': inputNumeric('pdfAppId') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pdf-appName">アプリ名:</label>
          <input type="text" v-model="configPdf.name" id="pdf-appName" class="text-input" readonly />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pdf-recordId">レコード番号:<span class="required-mark">*</span></label>
          <input type="number" v-model="configPdf.recordId" id="pdf-recordId" class="text-input" :class="{ 'input-error': inputNumeric('pdfRecordId') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pdf-attachment">フィールド名<span class="required-mark">*</span></label>
          <select v-model="configPdf.attachment" id="pdf-attachment" :class="{ 'input-error': isSameFieldError(configPdf, configFont) }">
            <option v-for="itemPdfAttachmentFields in optionPdfAttachmentFields" :value="itemPdfAttachmentFields.id" :key="itemPdfAttachmentFields.id">
              {{ itemPdfAttachmentFields.code }}
            </option>
          </select>
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pdf-outputFileName">出力ファイル名:<span class="required-mark">*</span></label>
          <input type="text" v-model="configPdf.outputFileName" id="pdf-outputFileName" class="text-input" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pdf-useFileNameField">ファイル名に使用するフィールド名</label>
          <select v-model="configPdf.useFileNameField" id="pdf-useFileNameField">
            <option v-for="itemPdfUseFileNameFields in optionPdfUseFileNameFields" :value="itemPdfUseFileNameFields.id" :key="itemPdfUseFileNameFields.id">
              {{ itemPdfUseFileNameFields.code }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">フォントファイル設定</h2>
      <div v-if="errors.font.hasError" class="error-message">
        <p>{{ errors.font.message }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="font-appId">アプリＩＤ:<span class="required-mark">*</span></label>
          <input type="number" v-model="configFont.appId" @change="appIdChange($event, 'font')" id="font-appId" class="text-input" :class="{ 'input-error': inputNumeric('fontAppId') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="font-appName">アプリ名:</label>
          <input type="text" v-model="configFont.name" id="font-appName" class="text-input" readonly />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="font-recordId">レコード番号:<span class="required-mark">*</span></label>
          <input type="number" v-model="configFont.recordId" id="font-recordId" class="text-input" :class="{ 'input-error': inputNumeric('fontRecordId') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="font-attachment">フィールド名<span class="required-mark">*</span></label>
          <select v-model="configFont.attachment" id="font-attachment" :class="{ 'input-error': isSameFieldError(configPdf, configFont) }">
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
      <div v-if="errors.page.hasError" class="error-message">
        <p>{{ errors.page.message }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pagecount-x">左下を起点とした横位置:</label>
          <input type="number" v-model="configPagecount.x" id="pagecount-x" class="text-input" :class="{ 'input-error': inputNumeric('pagecountX') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pagecount-y">左下を起点とした縦位置:</label>
          <input type="number" v-model="configPagecount.y" id="pagecount-y" class="text-input" :class="{ 'input-error': inputNumeric('pagecountY') }" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pagecount-size">文字サイズ:</label>
          <input type="number" v-model="configPagecount.size" id="pagecount-size" class="text-input" :class="{ 'input-error': inputNumeric('pagecountSize') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pagecount-type">形式</label>
          <select v-model="configPagecount.type" id="pagecount-type">
            <option v-for="itemPageCountType in optionPageCountType" :value="itemPageCountType.id" :key="itemPageCountType.id">
              {{ itemPageCountType.type }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="setting-section">
      <h2 class="section-title">描画する文字列の設定</h2>
      <div v-if="errors.text.hasError" class="error-message">
        <p>{{ errors.text.message }}</p>
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
          <tr v-for="(configTextRow, index) in configText" :key="configTextRow.id">
            <td>
              <select v-model="configTextRow.fieldCode" :id="`textRow-fieldCode-${configTextRow.id}`" :name="`textRow-fieldCode-${configTextRow.id}`">
                <option v-for="itemText in optionText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <td>
              <input type="number" v-model="configTextRow.x" :id="`textRow-x-${configTextRow.id}`" :name="`textRow-x-${configTextRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configTextRow.y" :id="`textRow-y-${configTextRow.id}`" :name="`textRow-y-${configTextRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configTextRow.size" :id="`textRow-size-${configTextRow.id}`" :name="`textRow-size-${configTextRow.id}`" class="text-input" />
            </td>

            <td>
              <select v-model="configTextRow.align" :id="`textRow-align-${configTextRow.id}`" :name="`textRow-align-${configTextRow.id}`">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <td>
              <select v-model="configTextRow.targetPage" :id="`textRow-targetPage-${configTextRow.id}`" :name="`textRow-targetPage-${configTextRow.id}`">
                <option v-for="itemTargetPage in optionTargetPage" :value="itemTargetPage.id" :key="itemTargetPage.id">
                  {{ itemTargetPage.type }}
                </option>
              </select>
            </td>

            <td>
              <select v-model="configTextRow.format" :id="`textRow-format-${configTextRow.id}`" :name="`textRow-format-${configTextRow.id}`">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <td>
              <div class="color-picker-wrapper">
                <input type="color" v-model="configTextRow.color" :id="`textRow-color-${configTextRow.id}`" :name="`textRow-color-${configTextRow.id}`" class="color-input" />
                <span class="color-display" :style="{ backgroundColor: configTextRow.color }">{{ configTextRow.color }}</span>
              </div>
            </td>

            <td>
              <input type="number" v-model="configTextRow.maxWidth" :id="`textRow-maxWidth-${configTextRow.id}`" :name="`textRow-maxWidth-${configTextRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="text" v-model="configTextRow.prefix" :id="`textRow-prefix-${configTextRow.id}`" :name="`textRow-prefix-${configTextRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="text" v-model="configTextRow.postfix" :id="`textRow-postfix-${configTextRow.id}`" :name="`textRow-postfix-${configTextRow.id}`" class="text-input" />
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

    <div class="setting-section">
      <h2 class="section-title">描画する画像の設定</h2>
      <div v-if="errors.image.hasError" class="error-message">
        <p>{{ errors.image.message }}</p>
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
          <tr v-for="(configImageRow, index) in configImage" :key="configImageRow.id">
            <td>
              <select
                v-model="configImageRow.fieldCode"
                :id="`imageRow-fieldCode-${configImageRow.id}`"
                :name="`imageRow-fieldCode-${configImageRow.id}`"
                :class="{ 'input-error': isDuplicateError(configImageRow, configImage, 'fieldCode') }"
              >
                <option v-for="itemImage in optionImage" :value="itemImage.id" :key="itemImage.id">
                  {{ itemImage.code }}
                </option>
              </select>
            </td>

            <td>
              <input type="number" v-model="configImageRow.x" :id="`imageRow-x-${configImageRow.id}`" :name="`imageRow-x-${configImageRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configImageRow.y" :id="`imageRow-y-${configImageRow.id}`" :name="`imageRow-y-${configImageRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configImageRow.widthRatio" :id="`imageRow-widthRatio-${configImageRow.id}`" :name="`imageRow-widthRatio-${configImageRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configImageRow.width" :id="`imageRow-width-${configImageRow.id}`" :name="`imageRow-width-${configImageRow.id}`" class="text-input" />
            </td>

            <td>
              <select v-model="configImageRow.targetPage" :id="`imageRow-targetPage-${configImageRow.id}`" :name="`imageRow-targetPage-${configImageRow.id}`">
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

    <div class="setting-section">
      <h2 class="section-title">改ページを行うサブテーブル描画の設定</h2>
      <div v-if="errors.pageBreakTable.hasError" class="error-message">
        <p>{{ errors.pageBreakTable.message }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-spaceField">フィールド名</label>
          <select v-model="configPageBreakTable.fieldCode" id="pageBreakTable-spaceField" @change="targetTableChange($event, 'pageBreak')">
            <option v-for="itemTable in optionTable" :value="itemTable.id" :key="itemTable.id">
              {{ itemTable.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-maxRow">１ページあたりの最大行数:</label>
          <input type="number" v-model="configPageBreakTable.maxRow" id="pageBreakTable-maxRow" class="text-input" :class="{ 'input-error': inputNumeric('pageBreakTableMaxRow') }" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-y">先頭行の縦位置:</label>
          <input type="number" v-model="configPageBreakTable.y" id="pageBreakTable-y" class="text-input" :class="{ 'input-error': inputNumeric('pageBreakTableY') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-y_Offset">１行の高さ:</label>
          <input type="number" v-model="configPageBreakTable.y_Offset" id="pageBreakTable-y_Offset" class="text-input" :class="{ 'input-error': inputNumeric('pageBreakTableY_Offset') }" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-y_OffsetFontSize">１行の高さに文字の高さを加える</label>
          <select v-model="configPageBreakTable.y_OffsetFontSize" id="pageBreakTable-y_OffsetFontSize">
            <option v-for="itemBool in optionBool" :value="itemBool.id" :key="itemBool.id">
              {{ itemBool.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="pageBreakTable-subtotal">小計行を表示する</label>
          <select v-model="configPageBreakTable.subtotal" id="pageBreakTable-subtotal">
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
          <tr v-for="(configPageBreakTableRow, index) in configPageBreakTable.column" :key="configPageBreakTableRow.id">
            <td>
              <select
                v-model="configPageBreakTableRow.fieldCode"
                :id="`pageBreakTableRow-fieldCode-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-fieldCode-${configPageBreakTableRow.id}`"
                :class="{ 'input-error': isDuplicateError(configPageBreakTableRow, configPageBreakTable.column, 'fieldCode') }"
              >
                <option v-for="itemText in optionPageBreakTableText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <td>
              <input
                type="number"
                v-model="configPageBreakTableRow.x"
                :id="`pageBreakTableRow-x-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-x-${configPageBreakTableRow.id}`"
                class="text-input"
              />
            </td>

            <td>
              <input
                type="number"
                v-model="configPageBreakTableRow.size"
                :id="`pageBreakTableRow-size-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-size-${configPageBreakTableRow.id}`"
                class="text-input"
              />
            </td>

            <td>
              <select v-model="configPageBreakTableRow.align" :id="`pageBreakTableRow-align-${configPageBreakTableRow.id}`" :name="`pageBreakTableRow-align-${configPageBreakTableRow.id}`">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <td>
              <select v-model="configPageBreakTableRow.format" :id="`pageBreakTableRow-format-${configPageBreakTableRow.id}`" :name="`pageBreakTableRow-format-${configPageBreakTableRow.id}`">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <td>
              <div class="color-picker-wrapper">
                <input
                  type="color"
                  v-model="configPageBreakTableRow.color"
                  :id="`pageBreakTableRow-color-${configPageBreakTableRow.id}`"
                  :name="`pageBreakTableRow-color-${configPageBreakTableRow.id}`"
                  class="color-input"
                />
                <span class="color-display" :style="{ backgroundColor: configPageBreakTableRow.color }">{{ configPageBreakTableRow.color }}</span>
              </div>
            </td>

            <td>
              <input
                type="number"
                v-model="configPageBreakTableRow.maxWidth"
                :id="`pageBreakTableRow-maxWidth-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-maxWidth-${configPageBreakTableRow.id}`"
                class="text-input"
              />
            </td>

            <td>
              <input
                type="text"
                v-model="configPageBreakTableRow.prefix"
                :id="`pageBreakTableRow-prefix-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-prefix-${configPageBreakTableRow.id}`"
                class="text-input"
              />
            </td>

            <td>
              <input
                type="text"
                v-model="configPageBreakTableRow.postfix"
                :id="`pageBreakTableRow-postfix-${configPageBreakTableRow.id}`"
                :name="`pageBreakTableRow-postfix-${configPageBreakTableRow.id}`"
                class="text-input"
              />
            </td>

            <td>
              <select v-model="configPageBreakTableRow.calc" :id="`pageBreakTableRow-calc-${configPageBreakTableRow.id}`" :name="`pageBreakTableRow-calc-${configPageBreakTableRow.id}`">
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

    <div class="setting-section">
      <h2 class="section-title">その他のサブテーブル描画の設定</h2>
      <div v-if="errors.table.hasError" class="error-message">
        <p>{{ errors.table.message }}</p>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="table-fieldCode">フィールド名</label>
          <select v-model="configTable.fieldCode" id="table-fieldCode" @change="targetTableChange($event, 'other')">
            <option v-for="itemTable in optionTable" :value="itemTable.id" :key="itemTable.id">
              {{ itemTable.code }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="table-maxRow">最大行数:</label>
          <input type="number" v-model="configTable.maxRow" id="table-maxRow" class="text-input" :class="{ 'input-error': inputNumeric('tableMaxRow') }" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="table-y">先頭行の縦位置:</label>
          <input type="number" v-model="configTable.y" id="table-y" class="text-input" :class="{ 'input-error': inputNumeric('tableY') }" />
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="table-y_Offset">１行の高さ:</label>
          <input type="number" v-model="configTable.y_Offset" id="table-y_Offset" class="text-input" :class="{ 'input-error': inputNumeric('tableY_Offset') }" />
        </div>
      </div>

      <div class="app-config-row">
        <div class="input-wrapper">
          <label class="label-text" for="table-y_OffsetFontSize">１行の高さに文字の高さを加える</label>
          <select v-model="configTable.y_OffsetFontSize" id="table-y_OffsetFontSize">
            <option v-for="itemBool in optionBool" :value="itemBool.id" :key="itemBool.id">
              {{ itemBool.type }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label class="label-text" for="table-targetPage">対象ページ</label>
          <select v-model="configTable.targetPage" id="table-targetPage">
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
          <tr v-for="(configTableRow, index) in configTable.column" :key="configTableRow.id">
            <td>
              <select
                v-model="configTableRow.fieldCode"
                :id="`tableRow-fieldCode-${configTableRow.id}`"
                :name="`tableRow-fieldCode-${configTableRow.id}`"
                :class="{ 'input-error': isDuplicateError(configTableRow, configTable.column, 'fieldCode') }"
              >
                <option v-for="itemText in optionTableText" :value="itemText.id" :key="itemText.id">
                  {{ itemText.code }}
                </option>
              </select>
            </td>

            <td>
              <input type="number" v-model="configTableRow.x" :id="`tableRow-x-${configTableRow.id}`" :name="`tableRow-x-${configTableRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="number" v-model="configTableRow.size" :id="`tableRow-size-${configTableRow.id}`" :name="`tableRow-size-${configTableRow.id}`" class="text-input" />
            </td>

            <td>
              <select v-model="configTableRow.align" :id="`tableRow-align-${configTableRow.id}`" :name="`tableRow-align-${configTableRow.id}`">
                <option v-for="itemTextAlign in optionTextAlign" :value="itemTextAlign.id" :key="itemTextAlign.id">
                  {{ itemTextAlign.type }}
                </option>
              </select>
            </td>

            <td>
              <select v-model="configTableRow.format" :id="`tableRow-format-${configTableRow.id}`" :name="`tableRow-format-${configTableRow.id}`">
                <option v-for="itemTextFormat in optionTextFormat" :value="itemTextFormat.id" :key="itemTextFormat.id">
                  {{ itemTextFormat.type }}
                </option>
              </select>
            </td>

            <td>
              <div class="color-picker-wrapper">
                <input type="color" v-model="configTableRow.color" :id="`tableRow-color-${configTableRow.id}`" :name="`tableRow-color-${configTableRow.id}`" class="color-input" />
                <span class="color-display" :style="{ backgroundColor: configTableRow.color }">{{ configTableRow.color }}</span>
              </div>
            </td>

            <td>
              <input type="number" v-model="configTableRow.maxWidth" :id="`tableRow-maxWidth-${configTableRow.id}`" :name="`tableRow-maxWidth-${configTableRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="text" v-model="configTableRow.prefix" :id="`tableRow-prefix-${configTableRow.id}`" :name="`tableRow-prefix-${configTableRow.id}`" class="text-input" />
            </td>

            <td>
              <input type="text" v-model="configTableRow.postfix" :id="`tableRow-postfix-${configTableRow.id}`" :name="`tableRow-postfix-${configTableRow.id}`" class="text-input" />
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
import { ref, onMounted } from 'vue';
import { setDropDown, isDuplicateError, getAllApps, cancel } from './kintonePluginCommonFunction.js';

const props = defineProps(['initialConfig']);

//ドロップダウンで指定する内容
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
  { id: 'datetime', type: '日時' },
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

const optionText = ref([]);
const optionImage = ref([]);
const optionTable = ref([]);
const optionSpace = ref([]);
const optionPdfAttachmentFields = ref([]);
const optionFontAttachmentFields = ref([]);
const optionPageBreakTableText = ref([]);
const optionTableText = ref([]);
const optionPdfUseFileNameFields = ref([]);
const targetAppAllText = ref([]);

const isLoading = ref(true); // 初期描画時にローディングを表示

// エラー関連の変数
const errors = ref({
  button: { hasError: false, message: '' },
  pdf: { hasError: false, message: '' },
  font: { hasError: false, message: '' },
  page: { hasError: false, message: '' },
  text: { hasError: false, message: '' },
  image: { hasError: false, message: '' },
  pageBreakTable: { hasError: false, message: '' },
  table: { hasError: false, message: '' },
});

const allApps = [];

// 数値項目を定義(範囲、整数のみ許可、エラー時のメッセージ等)
const numericFields = {
  pdfAppId: { min: 1, max: 999999, isInteger: true, config: configPdf.value, key: 'appId', errorKey: 'pdf', message: 'アプリIDの数値を正しく入力してください' },
  pdfRecordId: { min: 1, max: 999999, isInteger: true, config: configPdf.value, key: 'recordId', errorKey: 'pdf', message: 'レコード番号の数値を正しく入力してください' },
  fontAppId: { min: 1, max: 999999, isInteger: true, config: configFont.value, key: 'appId', errorKey: 'font', message: 'アプリIDの数値を正しく入力してください' },
  fontRecordId: { min: 1, max: 999999, isInteger: true, config: configFont.value, key: 'recordId', errorKey: 'font', message: 'レコード番号の数値を正しく入力してください' },
  pagecountX: { min: 0, max: 9999, isInteger: false, config: configPagecount.value, key: 'x', errorKey: 'page', message: '横位置の数値を正しく入力してください' },
  pagecountY: { min: 0, max: 9999, isInteger: false, config: configPagecount.value, key: 'y', errorKey: 'page', message: '縦位置の数値を正しく入力してください' },
  pagecountSize: { min: 0, max: 99, isInteger: false, config: configPagecount.value, key: 'size', errorKey: 'page', message: 'サイズの数値を正しく入力してください' },
  pageBreakTableMaxRow: {
    min: 0,
    max: 999,
    isInteger: true,
    config: configPageBreakTable.value,
    key: 'maxRow',
    errorKey: 'pageBreakTable',
    message: '１ページあたりの最大行の数値を正しく入力してください',
  },
  pageBreakTableY: { min: 0, max: 9999, isInteger: false, config: configPageBreakTable.value, key: 'y', errorKey: 'pageBreakTable', message: '先頭行の縦位置の数値を正しく入力してください' },
  pageBreakTableY_Offset: { min: 0, max: 9999, isInteger: false, config: configPageBreakTable.value, key: 'y_Offset', errorKey: 'pageBreakTable', message: '行間の数値を正しく入力してください' },
  tableMaxRow: { min: 0, max: 999, isInteger: true, config: configTable.value, key: 'maxRow', errorKey: 'table', message: '１ページあたりの最大行の数値を正しく入力してください' },
  tableY: { min: 0, max: 9999, isInteger: false, config: configTable.value, key: 'y', errorKey: 'table', message: '先頭行の縦位置の数値を正しく入力してください' },
  tableY_Offset: { min: 0, max: 9999, isInteger: false, config: configTable.value, key: 'y_Offset', errorKey: 'table', message: '行間の数値を正しく入力してください' },
};

// テーブル以外の必須項目を定義
const requiredFields = [
  { config: configButton.value, key: 'spaceField', errorKey: 'button', message: 'ボタンを表示するフィールド名は、必須項目です' },
  { config: configPdf.value, key: 'appId', errorKey: 'pdf', message: 'PDF雛形ファイルのアプリIDは、必須項目です' },
  { config: configPdf.value, key: 'recordId', errorKey: 'pdf', message: 'PDF雛形ファイルのレコード番号は、必須項目です' },
  { config: configPdf.value, key: 'attachment', errorKey: 'pdf', message: 'PDF雛形ファイルのフィールド名は、必須項目です' },
  { config: configPdf.value, key: 'outputFileName', errorKey: 'pdf', message: '出力ファイル名は、必須項目です' },
  { config: configFont.value, key: 'appId', errorKey: 'font', message: 'フォントファイルのアプリIDは、必須項目です' },
  { config: configFont.value, key: 'recordId', errorKey: 'font', message: 'フォントファイルのレコード番号は、必須項目です' },
  { config: configFont.value, key: 'attachment', errorKey: 'font', message: 'フォントファイルのフィールド名は、必須項目です' },
];

// テーブル内の必須項目を定義
const requiredTableFields = [
  {
    config: configText.value,
    keys: [
      { name: 'フィールドコード', code: 'fieldCode' },
      { name: '横位置', code: 'x' },
      { name: '縦位置', code: 'y' },
      { name: '文字サイズ', code: 'size' },
    ],
    errorKey: 'text',
    message: '未入力です。',
  },
  {
    config: configImage.value,
    keys: [
      { name: 'フィールドコード', code: 'fieldCode' },
      { name: '横位置', code: 'x' },
      { name: '縦位置', code: 'y' },
    ],
    errorKey: 'image',
    message: '未入力です。',
  },
  {
    config: configPageBreakTable.value.column,
    keys: [
      { name: 'フィールドコード', code: 'fieldCode' },
      { name: '横位置', code: 'x' },
      { name: '文字サイズ', code: 'size' },
    ],
    errorKey: 'pageBreakTable',
    message: '未入力です。',
  },
  {
    config: configTable.value.column,
    keys: [
      { name: 'フィールドコード', code: 'fieldCode' },
      { name: '横位置', code: 'x' },
      { name: '文字サイズ', code: 'size' },
    ],
    errorKey: 'table',
    message: '未入力です。',
  },
];

// onMountedで初期データを取得
onMounted(async () => {
  try {
    const allAppsArray = await getAllApps(); //サブドメイン内の全てのアプリ
    for (const apps of allAppsArray) {
      allApps.push({ appId: apps.appId, appName: apps.name, attachmentFields: [], isSearched: false });
    }

    if (configPdf.value.appId) {
      const targetApp = allApps.find((item) => item.appId == configPdf.value.appId); //対象となるアプリの指定(PDF雛形)
      optionPdfAttachmentFields.value = await getAttachmentFields(configPdf.value.appId, targetApp); //指定したアプリの添付ファイルフィールド
    }
    if (configFont.value.appId) {
      const targetApp = allApps.find((item) => item.appId == configPdf.value.appId); //対象となるアプリの指定(フォント)
      optionFontAttachmentFields.value = await getAttachmentFields(configFont.value.appId, targetApp); //指定したアプリの添付ファイルフィールド
    }

    const targetFieldsImage = await KintoneConfigHelper.getFields(['FILE']); //自アプリの添付ファイル
    optionImage.value = setDropDown(targetFieldsImage);

    const targetFieldsTable = await KintoneConfigHelper.getFields(['SUBTABLE']); //自アプリのサブテーブル
    optionTable.value = setDropDown(targetFieldsTable);

    const targetFieldsUseFileName = await KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'NUMBER']);
    optionPdfUseFileNameFields.value = setDropDown(targetFieldsUseFileName); //PDFの出力ファイル名の一部として使用するフィールド

    const targetFieldsAll = await KintoneConfigHelper.getFields();
    const targetAppAllText = targetFieldsAll.filter((item) => item.type !== 'FILE' && item.type !== 'SUBTABLE' && item.type !== 'SPACER'); //添付ファイルとサブテーブルを除く全てのフィールド
    optionText.value = setDropDown(targetAppAllText); //PDFへ描画するフィールド

    if (configPageBreakTable.value.fieldCode) {
      optionPageBreakTableText.value = setDropDown(targetAppAllText, configPageBreakTable.value.fieldCode); //改ページを行うサブテーブル内のフィールド一覧
    }

    if (configTable.value.fieldCode) {
      optionTableText.value = setDropDown(targetAppAllText, configTable.value.fieldCode); //その他のサブテーブル内のフィールド一覧
    }

    const spaceFields = await KintoneConfigHelper.getFields('SPACER');
    // スペースフィールドは「code」ではなく「elementId」が取得されるため、コードを変換
    for (const item of spaceFields) {
      item.code = item.elementId;
    }
    optionSpace.value = setDropDown(spaceFields);
  } catch (error) {
    errors.value.button = { hasError: true, message: error.message };
  } finally {
    isLoading.value = false; // 処理が完了したらローディングを非表示にする
  }
});

// 数値項目の入力時チェック(isNumericErrorのラッパー関数)
const inputNumeric = (targetItem) => {
  return isNumericError(numericFields[targetItem]);
};

//数値の入力チェック
const isNumericError = (param) => {
  const target = param.config[param.key];
  const min = param.min;
  const max = param.max;
  const isInteger = param.isInteger;
  if (target < min || target > max) {
    return true;
  }
  if (isInteger && !Number.isInteger(Number(target))) {
    return true;
  }
  return false;
};

/** ＰＤＦ雛形とフォントが同じフィールドを指定している
 * @param configPdf PDF雛形の設定内容
 * @param configFont フォントの設定内容
 * @returns 同じアプリID、レコード番号、添付ファイルを指定している場合、true
 */
const isSameFieldError = (configPdf, configFont) => {
  return configPdf.appId == configFont.appId && configPdf.recordId == configFont.recordId && configPdf.attachment == configFont.attachment;
};

// 登録時に全体のエラーチェックを強化
const validate = () => {
  // エラーを一括でリセット
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = { hasError: false, message: '' };
  });

  // テーブル以外の必須項目をループでチェック
  requiredFields.forEach((field) => {
    if (!field.config[field.key]) {
      errors.value[field.errorKey] = { hasError: true, message: field.message };
    }
  });

  //テーブル内の必須項目をループでチェック
  for (const field of requiredTableFields) {
    //設定画面のテーブルの各行
    for (const [index, row] of Object.entries(field.config)) {
      //keysの配列
      for (const key of field.keys) {
        //未入力
        if (!row[key.code]) {
          //先頭行の場合、他の項目に入力があるばあいエラー
          if (index == 0) {
            for (const keyCheck of field.keys) {
              if (row[keyCheck.code]) {
                errors.value[field.errorKey] = { hasError: true, message: key.name + 'が' + field.message };
              }
            }
          } else {
            errors.value[field.errorKey] = { hasError: true, message: key.name + 'が' + field.message };
          }
        }
      }
    }
  }

  // 数値項目の入力内容チェック
  for (const field in numericFields) {
    if (isNumericError(numericFields[field])) {
      errors.value[numericFields[field].errorKey] = { hasError: true, message: numericFields[field].message };
    }
  }

  // PDFファイルとフォントファイルが同じフィールドを設定しているかのチェック
  if (isSameFieldError(configPdf.value, configFont.value)) {
    const message = 'ＰＤＦファイルとフォントファイルで同じフィールドを設定しています';
    errors.value.pdf = { hasError: true, message };
    errors.value.font = { hasError: true, message };
  }

  // テーブル内のフィールドコード重複をチェックするヘルパー関数
  const checkDuplicates = (array, prop, errorKey, errorMessage) => {
    const allFields = array.map((item) => item[prop]).filter(Boolean); // 空文字を除外してチェック
    const uniqueFields = new Set(allFields);
    if (allFields.length !== uniqueFields.size) {
      errors.value[errorKey] = { hasError: true, message: errorMessage };
    }
  };

  // 各テーブルで重複チェックを実行
  checkDuplicates(configText.value, 'fieldCode', 'text', '描画する文字列の設定で、同じフィールドコードが設定されています。');
  checkDuplicates(configImage.value, 'fieldCode', 'image', '描画する画像の設定で、同じフィールドコードが設定されています。');
  checkDuplicates(configPageBreakTable.value.column, 'fieldCode', 'pageBreakTable', '改ページを行うサブテーブルで、同じフィールドコードが設定されています。');
  checkDuplicates(configTable.value.column, 'fieldCode', 'table', 'その他のサブテーブルで、同じフィールドコードが設定されています。');

  // エラーオブジェクト全体をチェックして最終的なisValidを決定
  for (const key in errors.value) {
    if (errors.value[key].hasError) {
      return false;
    }
  }

  return true;
};

/** アプリIDを変更した際のイベント
 * @param event イベントオブジェクト
 * @param target 対象(pdfもしくはfont)
 */
const appIdChange = async (event, target) => {
  const appId = event.target.value;
  // 変更対象のコンフィグと選択肢を決定
  const targetConfig = target === 'pdf' ? configPdf.value : configFont.value;
  const targetOptions = target === 'pdf' ? optionPdfAttachmentFields : optionFontAttachmentFields;

  const targetApp = allApps.find((item) => item.appId == appId);
  if (targetApp) {
    const attachmentFields = await getAttachmentFields(appId, targetApp);
    targetConfig.name = targetApp.appName;
    targetOptions.value = attachmentFields;
  } else {
    // アプリが見つからない場合はクリア
    targetConfig.name = '';
    targetConfig.attachment = '';
    targetOptions.value = [];
  }
};

//対象となるサブテーブルを変更
const targetTableChange = async (event, target) => {
  const selectedFieldCode = event.target.value;
  // サブテーブル内のフィールド選択肢を取得
  const fields = setDropDown(targetAppAllText.value, selectedFieldCode);

  if (target === 'pageBreak') {
    // ファクトリ関数を使って新しい行でリセット
    configPageBreakTable.value.column = [createPageBreakTableRow()];
    optionPageBreakTableText.value = fields;
  } else {
    // ファクトリ関数を使って新しい行でリセット
    configTable.value.column = [createTableRow()];
    optionTableText.value = fields;
  }
};

//★★★★★★★★★★★★★★★★★★★★★★★★★★★
/** 添付ファイルアプリのフィールド情報を取得
 * @param {string} appId アプリＩＤ
 * @param {object} targetApp getAllAppsで作成した全アプリのうち、appIdで指定したアプリＩＤ
 * @returns appIdで指定したアプリＩＤの添付ファイルフィールド
 */
//★★★★★★★★★★★★★★★★★★★★★★★★★★★
const getAttachmentFields = async (appId, targetApp) => {
  try {
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
    errors.value.button = { hasError: true, message: `設定の保存中にエラーが発生しました。\nエラー内容: ${e.message}` };
  }
};

// 各テーブル行のデフォルト値を生成するファクトリ関数群
const createTextRow = () => ({ id: Date.now(), fieldCode: '', x: '', y: '', size: '', align: 'left', targetPage: 'all', format: 'no', color: '#000000', maxWidth: '', prefix: '', postfix: '' });
const createImageRow = () => ({ id: Date.now(), fieldCode: '', x: '', y: '', widthRatio: '', width: '', targetPage: 'all' });
const createPageBreakTableRow = () => ({ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', prefix: '', postfix: '', calc: 'no' });
const createTableRow = () => ({ id: Date.now(), fieldCode: '', x: '', size: '', align: 'left', format: 'no', color: '#000000', maxWidth: '', prefix: '', postfix: '' });

//描画する文字列のテーブル行追加
const addItemText = (index) => {
  configText.value.splice(index + 1, 0, createTextRow());
};

//描画する文字列のテーブル行削除
const removeItemText = (index) => {
  if (configText.value.length === 1) {
    configText.value[0] = createTextRow(); // 最後の1行を削除する場合、新しい空の行を追加する
  } else {
    configText.value.splice(index, 1);
  }
};

//描画する画像のテーブル行追加
const addItemImage = (index) => {
  configImage.value.splice(index + 1, 0, createImageRow());
};

//描画する画像のテーブル行削除
const removeItemImage = (index) => {
  if (configImage.value.length === 1) {
    configImage.value[0] = createImageRow(); // 最後の1行を削除する場合、新しい空の行を追加する
  } else {
    configImage.value.splice(index, 1);
  }
};

//改ページを行うサブテーブルのテーブル行追加
const addItemPageBreakTableText = (index) => {
  configPageBreakTable.value.column.splice(index + 1, 0, createPageBreakTableRow());
};

//改ページを行うサブテーブルのテーブル行削除
const removeItemPageBreakTableText = (index) => {
  if (configPageBreakTable.value.column.length === 1) {
    configPageBreakTable.value.column[0] = createPageBreakTableRow(); // 最後の1行を削除する場合、新しい空の行を追加する
  } else {
    configPageBreakTable.value.column.splice(index, 1);
  }
};

//その他のサブテーブルのテーブル行追加
const addItemTableText = (index) => {
  configTable.value.column.splice(index + 1, 0, createTableRow());
};

//その他のサブテーブルのテーブル行削除
const removeItemTableText = (index) => {
  if (configTable.value.column.length === 1) {
    configTable.value.column[0] = createTableRow(); // 最後の1行を削除する場合、新しい空の行を追加する
  } else {
    configTable.value.column.splice(index, 1);
  }
};
</script>

<style scoped>
/* ローディングオーバーレイ */
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 他の要素より前面に表示 */
}
/* スピナー本体 */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3; /* ライトグレー */
  border-top: 5px solid #3498db; /* kintoneの青色に近い */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
/* スピナーのアニメーション */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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

/* 読み取り専用フィールドのスタイルを追加 */
input[readonly] {
  background-color: #f7f9fb; /* 読み取り専用であることを視覚的に示す */
  pointer-events: none; /* マウスイベントを無効化 */
  user-select: none; /* テキスト選択を無効化 */
  cursor: default; /* マウスカーソルをデフォルトに戻す */
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

/* エラーメッセージ用の共通スタイルを追加 */
.error-message {
  color: #e74c3c;
  background-color: #fff2f2;
  border: 1px solid #ffc8c8;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  white-space: pre-wrap; /* 改行を有効にする */
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

/* カラーピッカーのスタイル */
.color-picker-wrapper {
  display: flex;
  align-items: center;
}
.color-input {
  width: 30px;
  height: 30px;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-right: 8px;
}
.color-display {
  font-family: monospace;
  font-size: 14px;
}
</style>
