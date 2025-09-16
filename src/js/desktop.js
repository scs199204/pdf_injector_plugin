import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';

((PLUGIN_ID) => {
  'use strict';
  //const params = sdpParam.pdfLib; //パラメタ(sdpParam_pdfLib.js)
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!CONFIG) {
    return false;
  }
  let CONFIG_BUTTON = CONFIG.configButton;
  let CONFIG_PDF = CONFIG.configPdf;
  let CONFIG_FONT = CONFIG.configFont;
  let CONFIG_PAGECOUNT = CONFIG.configPagecount;
  let CONFIG_TEXT = CONFIG.configText;
  let CONFIG_IMAGE = CONFIG.configImage;
  let CONFIG_PAGE_BREAK_TABLE = CONFIG.configPageBreakTable;
  let CONFIG_TABLE = CONFIG.configTable;

  CONFIG_BUTTON = !CONFIG_BUTTON ? {} : JSON.parse(CONFIG['configButton']);
  CONFIG_PDF = !CONFIG_PDF ? {} : JSON.parse(CONFIG['configPdf']);
  CONFIG_FONT = !CONFIG_FONT ? {} : JSON.parse(CONFIG['configFont']);
  CONFIG_PAGECOUNT = !CONFIG_PAGECOUNT ? {} : JSON.parse(CONFIG['configPagecount']);
  CONFIG_TEXT = !CONFIG_TEXT ? {} : JSON.parse(CONFIG['configText']);
  CONFIG_IMAGE = !CONFIG_IMAGE ? {} : JSON.parse(CONFIG['configImage']);
  CONFIG_PAGE_BREAK_TABLE = !CONFIG_PAGE_BREAK_TABLE ? {} : JSON.parse(CONFIG['configPageBreakTable']);
  CONFIG_TABLE = !CONFIG_TABLE ? {} : JSON.parse(CONFIG['configTable']);

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** kintone APIからファイルデータを取得
   * @param {string} fileKey
   * @returns {arrayBuffer} 読込んだファイルをarrayBufferに変換
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  async function getFileData(fileKey) {
    const response = await fetch(`/k/v1/file.json?fileKey=${fileKey}`, {
      method: 'GET',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!response.ok) throw new Error('ファイル取得に失敗しました');
    return await response.arrayBuffer();
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** フォントファイルの fileKey を別アプリから取得(アプリID2589)
   * @param {number} 添付ファイルを取得するアプリＩＤ
   * @param {number} 添付ファイルを取得するレコード番号
   * @param {string} 添付ファイルのフィールドコード
   * @returns {} フォントファイルのfileKey
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  async function getPdfFileKey(appId, id, fieldCode) {
    const response = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', { app: appId, id: id });
    return response.record?.[fieldCode].value?.[0]?.fileKey || null;
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** drawTextを行う関数を戻り値とする関数(クロージャ)
   * @param {*} argPage ページ
   * @param {*} argCustomFont フォント
   * @returns {function} パラメタ、レコード、y座標を引数とする関数
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  const drawTextPdfFunc = (argPage, argCustomFont) => {
    const page = argPage;
    const customFont = argCustomFont;

    return (param, record, y) => {
      try {
        let x = param.x;
        let targetText = record[param.fieldCode].value == null ? '' : record[param.fieldCode].value; //null もしくは undefinedの場合,空文字''

        //formatプロパティが設定されている場合のみ
        if (param.format) {
          const formatItem = param.format;
          if (formatItem === 'comma') {
            targetText = new Intl.NumberFormat('ja-JP').format(targetText); //カンマ編集
          }
          //日付・日時
          if (formatItem === 'date' || formatItem === 'datetime') {
            const options = {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            };
            //日時の場合
            if (formatItem === 'datetime') {
              options.hour = '2-digit';
              options.minute = '2-digit';
              options.hour12 = false; // 24時間表示
            }

            let date;
            if (targetText.includes('T')) {
              date = new Date(targetText); // 日時フィールドの場合（例: '2025-09-02T15:00:00Z'）
            } else {
              date = new Date(targetText + 'T00:00:00Z'); // 日付フィールド場合（例: '2025-09-03'）タイムゾーンを統一するために、'T00:00:00Z'を加えてUTCとして解釈させる
            }
            targetText = date.toLocaleString('ja-JP', options).replace(/\//g, '-'); // toLocaleString()でローカルタイムゾーンの形式に変換
          }
        }
        if (param.align) {
          if (param.align === 'right') {
            x -= customFont.widthOfTextAtSize(targetText, param.size); //drawTextは左端を指定、paramは揃えたい右端を指定しているので文字数分ずらす
            // 例)パラメタ：100　文字サイズ：3　の場合、100-3=97　をdrawTextに渡すと左端が97なので文字の右端が100で揃えられる。
          }
        }
        //プロパティがある場合、文字列を結合する
        let joinText = '';
        if (param.prefix) {
          joinText += param.prefix;
        }
        joinText += targetText;
        if (param.postfix) {
          joinText += param.postfix;
        }
        const drawTextOptions = { x: x, y: y, font: customFont, size: param.size }; //drawText用のパラメタ作成

        //maxWidthが効かないため、sizeに応じてmaxWidthに収まる文字数分を抽出する
        if (param.maxWidth) {
          //文字の幅と、maxWidthを比較して、maxWidthに収まらない場合収まる文字数分のみ描画
          const currentWidth = customFont.widthOfTextAtSize(joinText, param.size);
          if (currentWidth > param.maxWidth) {
            const estimatedCharWidth = currentWidth / joinText.length; // 1文字あたりの概算幅
            const maxChars = Math.floor(param.maxWidth / estimatedCharWidth); // 収まる文字数の概算
            const truncatedText = joinText.substring(0, maxChars);
            joinText = truncatedText;
          }
        }

        //文字色の設定
        if (param.color) {
          const hexValue = param.color.slice(1); //先頭の#カット
          const rHex = hexValue.slice(0, 2); // 各色成分を2桁ずつに分割
          const gHex = hexValue.slice(2, 4);
          const bHex = hexValue.slice(4, 6);

          // 16進数を10進数に変換
          let red = parseInt(rHex, 16);
          let green = parseInt(gHex, 16);
          let blue = parseInt(bHex, 16);
          red = red > 255 ? 1 : red / 255;
          green = green > 255 ? 1 : green / 255;
          blue = blue > 255 ? 1 : blue / 255;
          drawTextOptions.color = rgb(red, green, blue); //色追加
        }

        //maxWidthが効かないため、使わない
        //if (param.hasOwnProperty('maxWidth')) {
        //drawTextOptions.maxWidth = param.maxWidth;
        //drawTextOptions.lineHeight = param.lineHeight;
        //drawTextOptions.wordBreaks = [];
        // }

        const { width: pageWidth, height: pageHeight } = page.getSize();
        const width = param.maxWidth ? param.maxWidth : customFont.widthOfTextAtSize(joinText, param.size);
        //描画位置がページの範囲内かどうかのチェック
        if (isInCoordinateRange(x, y, width, customFont.heightAtSize(param.size), pageWidth, pageHeight)) {
          page.drawText(joinText, drawTextOptions); //PDFへ出力
        } else {
          throw new Error(param.fieldCode + 'がページの範囲外です。');
        }
        return customFont.heightAtSize(param.size); //文字サイズを元に、高さを返す
      } catch (error) {
        console.error(error.message);
        throw new Error(error);
      }
    };
  };
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** オフセットから、次の行を描画するy軸座標を返す
   * @param {object} drawItem パラメタ
   * @param {number} maxHeight 最大の文字の高さ
   * @returns {number} 次のy軸座標位置
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function calcOffset(drawItem, maxHeight) {
    let result;
    //存在しないもしくはfalse
    if (drawItem?.y_OffsetFontSize) {
      result = maxHeight + drawItem.y_Offset; //y座標更新(文字の高さ+オフセット)
    } else {
      result = drawItem.y_Offset; //y座標更新(yをマイナスして座標を下へ移動)
    }
    return result;
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** 小計の為の項目集計
   * @param {object} subtotal 集計用のオブジェクト
   * @param {object} column パラメタ
   * @param {object} record kintoneレコード
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function subtotalAdd(subtotal, column, record) {
    const targetValue = Number(record[column.fieldCode].value);
    //集計項目を作成し、0で初期化
    //if (!subtotal.hasOwnProperty([column.fieldCode])) {
    if (!subtotal[column.fieldCode]) {
      subtotal[column.fieldCode] = { value: 0 };
    }

    if (column.calc) {
      if (column.calc == 'sum' && Number.isFinite(targetValue)) {
        subtotal[column.fieldCode].value += targetValue; //数値の場合、合計
      } else if (column.calc == 'count') {
        subtotal[column.fieldCode].value += 1; //数値以外の場合、件数
      }
    }
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** 描画対象ページの判定
   * @param {object} drawItem パラメタ
   * @param {number} pageCount 現在のページ
   * @param {number} totalPage 全体のページ数
   * @returns {bool} true：描画対象　false：対象外
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function isTargetPage(drawItem, pageCount, totalPage) {
    if (
      !drawItem.hasOwnProperty('targetPage') ||
      drawItem.targetPage === 'all' ||
      (pageCount === 0 && drawItem.targetPage === 'first') ||
      (pageCount + 1 === totalPage && drawItem.targetPage === 'last')
    ) {
      return true;
    } else {
      return false;
    }
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** 描画する要素がPDFの範囲内にあるか
   * @param {number} coordinateX 要素の開始点(x座標)
   * @param {number} coordinateY  要素の開始点(y座標)
   * @param {number} width 要素の幅
   * @param {number} height 要素の高さ
   * @param {number} pageSizeX ページの幅
   * @param {number} pageSizeY ページの高さ
   * @returns {bool} true：範囲内　false：範囲外
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  function isInCoordinateRange(coordinateX, coordinateY, width, height, pageSizeX, pageSizeY) {
    return coordinateX + width > pageSizeX || coordinateY + height > pageSizeY ? false : true;
  }

  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  /** PDFを描画する
   * @param {object} record kintoneのレコード(event.record)
   * @returns {}
   */
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  async function pdfCreate(record) {
    const app = CONFIG_PDF;
    let outputFileName = 'PDF帳票';
    //if (app.hasOwnProperty('outputFileName')) {
    if (app.outputFileName) {
      outputFileName = app.outputFileName.value;
    }
    const templatePdfFileKey = await getPdfFileKey(CONFIG_PDF.appId, CONFIG_PDF.recordId, CONFIG_PDF.attachment); //ひな形pdfのfileKey取得
    if (!templatePdfFileKey) {
      await kintone.showNotification('ERROR', '請求書雛形PDFが設定されていません。');
      //alert('請求書雛形PDFが設定されていません。');
      return;
    }
    try {
      const pdfDoc = await PDFDocument.load(await getFileData(templatePdfFileKey)); //PDFDocumentを読込む(ArrayBuffer)
      pdfDoc.registerFontkit(fontkit); //PDFドキュメント内で利用できるようにするためのフォントエンジン

      //フォントファイルの取得
      let fontBytes;
      let customFont;
      try {
        const fontFileKey = await getPdfFileKey(CONFIG_FONT.appId, CONFIG_FONT.recordId, CONFIG_FONT.attachment); //フォントファイルのfileKey取得
        if (!fontFileKey) {
          throw new Error('フォントが設定されていません。');
        }
        fontBytes = await getFileData(fontFileKey); // フォントファイルを取得

        customFont = await pdfDoc.embedFont(fontBytes, { subset: true }); //サブセット化すると、フォントによっては一部の文字が表示されなくなる可能性あるのでフォント変更時は確認すること
        //customFont = await pdfDoc.embedFont(fontBytes); //ドキュメントにフォントを埋め込む(ファイルサイズが大きくなる)
      } catch (error) {
        throw new Error('フォントファイル取得エラー\n' + error.message);
      }

      //全体のページ数
      let totalPage = 1;
      //if (params.hasOwnProperty('pageBreakTable')) {
      if (CONFIG_PAGE_BREAK_TABLE.fieldCode) {
        totalPage = Math.ceil(record[CONFIG_PAGE_BREAK_TABLE.fieldCode].value.length / CONFIG_PAGE_BREAK_TABLE.maxRow); //サブテーブルの行数 ÷ １ページ当たりの行数
      }

      //改ページ考慮
      let copiedPage; //２ページ目以降作成の為、退避用ページ
      let nextPageRowCount = 0; //改ページ対象テーブルの読込行
      for (let pageCount = 0; pageCount < totalPage; pageCount++) {
        let page;
        if (pageCount === 0) {
          page = pdfDoc.getPage(0); //先頭ページの場合は、そのまま取得
        } else {
          pdfDoc.insertPage(pageCount, copiedPage); // コピーしたページを2ページ目として挿入
          page = pdfDoc.getPage(pageCount); // 新しく追加された2ページ目を取得
        }
        [copiedPage] = await pdfDoc.copyPages(pdfDoc, [pageCount]); //編集前のページを退避させ、次ページ作成時に使用する

        const drawTextPdf = drawTextPdfFunc(page, customFont); //テキスト描画用の関数作成(ページ毎に作成する必要がある)

        //ページ数の描画
        //if (params.hasOwnProperty('pageCount')) {
        if (CONFIG_PAGECOUNT.type != 'no') {
          let pageValue = '';
          const currentPage = pageCount + 1;
          if (CONFIG_PAGECOUNT.type === 'Pn') {
            pageValue = 'P' + currentPage; //P1
          } else {
            pageValue = currentPage + ' / ' + totalPage; // 1/1
          }
          page.drawText(pageValue, { x: CONFIG_PAGECOUNT.x, y: CONFIG_PAGECOUNT.y, font: customFont, size: CONFIG_PAGECOUNT.size });
        }

        //テキスト
        //if (params.hasOwnProperty('text')) {
        if (CONFIG_TEXT.length > 0 && CONFIG_TEXT[0].fieldCode) {
          for (const drawItem of CONFIG_TEXT) {
            //描画する対象ページの判定
            if (isTargetPage(drawItem, pageCount, totalPage)) {
              drawTextPdf(drawItem, record, drawItem.y); //pdfにテキスト描画
            }
          }
        }

        //画像
        //if (params.hasOwnProperty('image')) {
        if (CONFIG_IMAGE.length > 0 && CONFIG_IMAGE[0].fieldCode) {
          for (const drawItem of CONFIG_IMAGE) {
            //描画する対象ページの判定
            if (isTargetPage(drawItem, pageCount, totalPage)) {
              try {
                const signatureImageFileKey = record[drawItem.fieldCode].value[0].fileKey; //画像のfileKey
                if (signatureImageFileKey) {
                  const signatureImageBytes = await getFileData(signatureImageFileKey); // 画像を取得
                  const signatureImage = await pdfDoc.embedPng(signatureImageBytes); //PNGファイルの埋め込み
                  let widthRatio = 0;
                  let heightRatio = 0;
                  //幅の割合指定
                  //if (drawItem.hasOwnProperty('widthRatio')) {
                  if (drawItem.widthRatio) {
                    widthRatio = drawItem.widthRatio;
                    heightRatio = drawItem.hasOwnProperty('heightRatio') ? drawItem.heightRatio : drawItem.widthRatio; //heightがない場合、幅と同じ割合
                    //幅指定
                    //} else if (drawItem.hasOwnProperty('width')) {
                  } else if (drawItem.width) {
                    widthRatio = drawItem.width / signatureImage.width; //指定した幅になるように割合調節
                    //heightRatio = drawItem.hasOwnProperty('height') ? drawItem.height / signatureImage.height : widthRatio;
                    heightRatio = drawItem.height ? drawItem.height / signatureImage.height : widthRatio;
                  } else {
                    throw new Error(fieldCode + 'の幅が設定されていません');
                  }
                  //描画位置がページの範囲内かどうかのチェック
                  const x = drawItem.x;
                  const y = drawItem.y;
                  const width = signatureImage.width * widthRatio;
                  const height = signatureImage.height * heightRatio;
                  const { width: pageWidth, height: pageHeight } = page.getSize();
                  if (isInCoordinateRange(x, y, width, height, pageWidth, pageHeight)) {
                    page.drawImage(signatureImage, { x: x, y: y, width: width, height: height });
                  } else {
                    throw new Error(drawItem.fieldCode + 'がページの範囲外です。');
                  }
                }
              } catch (error) {
                throw new Error('画像の埋め込みエラー:\n' + error.message);
              }
            }
          }
        }

        //サブテーブル
        //if (params.hasOwnProperty('table')) {
        if (CONFIG_TABLE.fieldCode) {
          const drawItem = CONFIG_TABLE;
          //for (const drawItem of CONFIG_TABLE) {
          //描画する対象ページの判定
          if (isTargetPage(drawItem, pageCount, totalPage)) {
            let y = drawItem.y; //y座標の初期値
            //サブテーブルの行数
            for (let rowCount = 0; record[drawItem.fieldCode].value.length > rowCount; rowCount++) {
              const recordRow = record[drawItem.fieldCode].value[rowCount];
              let maxHeight = 0;
              //tableプロパティの項目数
              for (const column of drawItem.column) {
                const height = drawTextPdf(column, recordRow.value, y); //サブテーブルの1行分を描画
                maxHeight = maxHeight > height ? maxHeight : height; //三項演算子で、maxHeightとheightの大きい方を保持
              }
              y -= calcOffset(drawItem, maxHeight); //次の行のy軸座標算出
            }
            //}
          }
        }
        //改ページ考慮ありのサブテーブル
        //if (params.hasOwnProperty('pageBreakTable')) {
        if (CONFIG_PAGE_BREAK_TABLE.fieldCode) {
          const drawItem = CONFIG_PAGE_BREAK_TABLE; //改ページ考慮ありのテーブルは一つだけ設定可
          let y = drawItem.y; //y座標の初期値
          let rowAllDraw = false; //全ての行を描画し終えたら処理終了するためのフラグ
          const subtotal = {}; //小計用オブジェクト

          //サブテーブルの行(複数ページ考慮のため、前頁までに描画し終えた行を初期値とする)
          for (let rowCount = nextPageRowCount; record[drawItem.fieldCode].value.length > rowCount; rowCount++) {
            const recordRow = record[drawItem.fieldCode].value[rowCount];
            let maxHeight = 0;
            //１行分の出力項目
            for (const column of drawItem.column) {
              subtotalAdd(subtotal, column, recordRow.value); //小計項目の集計
              const height = drawTextPdf(column, recordRow.value, y); //テキスト描画
              maxHeight = maxHeight > height ? maxHeight : height; //三項演算子で、maxHeightとheightの大きい方を保持
            }
            y -= calcOffset(drawItem, maxHeight); //次の行のy軸座標算出
            if (rowCount + 1 >= record[drawItem.fieldCode].value.length) {
              rowAllDraw = true; //サブテーブル全ての行を描画し終えたらtrue
            }
            if (rowCount + 1 - nextPageRowCount >= drawItem.maxRow) {
              nextPageRowCount = rowCount + 1; //1ページ当たりの描画行数を描画し終えたら行数を退避してループを抜ける
              break; //1ページ分の描画を終了、未描画の行があれば次ページ作成する。
            }
          }

          //小計行の描画(プロパティが存在しない場合はfalse)
          if (CONFIG_PAGE_BREAK_TABLE.subtotal == 'true') {
            let subtotal_y = y; //一旦、現在のy座標取得
            //if (CONFIG_PAGE_BREAK_TABLE.hasOwnProperty('y_Offset')) {
            if (CONFIG_PAGE_BREAK_TABLE.y_Offset) {
              subtotal_y = CONFIG_PAGE_BREAK_TABLE.y - CONFIG_PAGE_BREAK_TABLE.y_Offset * CONFIG_PAGE_BREAK_TABLE.maxRow; //y_Offsetがあれば最大行の１行下に描画
            }
            for (const column of drawItem.column) {
              //小計行の描画項目(プロパティが存在しない場合はfalse)
              if (column.calc == 'sum' || column.calc == 'count') {
                const subtotalColumn = structuredClone(column); //ディープコピー
                //if (subtotalColumn.hasOwnProperty('maxWidth')) {
                if (subtotalColumn.maxWidth) {
                  subtotalColumn.x += subtotalColumn.maxWidth; //maxWidthの指定があれば、最大幅の位置で右寄せする
                  subtotalColumn.align = 'right'; //小計行は、全て右寄せ→明細行の位置と合わせることができないので設定しないようにした
                }
                subtotalColumn.format = 'comma';
                const height = drawTextPdf(subtotalColumn, subtotal, subtotal_y); //subtotalがtrueの項目のみ小計描画
              }
            }
          }

          if (rowAllDraw) {
            break; //全ての行を描画し終えたらループを抜ける
          }
        }
      }
      // PDF を保存＆ダウンロード
      const pdfBytes = await pdfDoc.save(); //ドキュメントをPDFファイルを構成するバイト配列にシリアル化する
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let downLoadFileName = CONFIG_PDF.outputFileName;
      if (CONFIG_PDF.useFileNameField) {
        downLoadFileName += '(' + record[CONFIG_PDF.useFileNameField].value + ')';
      }
      downLoadFileName += '.pdf';
      a.download = downLoadFileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF出力エラー:', error.message);
      await kintone.showNotification('ERROR', 'PDF出力に失敗しました。\n' + error.message);
      //alert('PDF出力に失敗しました。\n' + error.message);
    }
  }
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //★ レコード詳細画面表示イベント
  //★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  kintone.events.on(['app.record.detail.show'], (event) => {
    const record = event.record;
    const printButton = document.createElement('button');
    //if (params.hasOwnProperty('textContent')) {
    if (CONFIG_BUTTON.textContent) {
      printButton.textContent = CONFIG_BUTTON.textContent;
    } else {
      printButton.textContent = 'PDF出力';
    }

    printButton.className = 'kintoneplugin-button-dialog-ok';
    printButton.addEventListener('click', async () => {
      //printButton.disabled = true; // クリックされたらボタンを無効化
      //printButton.className = 'kintoneplugin-button-disabled';
      await kintone.showLoading('VISIBLE');
      try {
        await pdfCreate(record);
      } finally {
        //printButton.disabled = false; // 処理が完了したらボタンを有効化
        //printButton.className = 'kintoneplugin-button-dialog-ok';
        await kintone.showLoading('HIDDEN');
      }
    });
    let buttonSpaceName = 'ButtonSpace';
    //if (CONFIG_BUTTON.hasOwnProperty('spaceField')) {
    if (CONFIG_BUTTON.spaceField) {
      buttonSpaceName = CONFIG_BUTTON.spaceField;
    }
    const spaceElement = kintone.app.record.getSpaceElement(buttonSpaceName);
    if (spaceElement) {
      spaceElement.appendChild(printButton);
    }
  });
})(kintone.$PLUGIN_ID);
