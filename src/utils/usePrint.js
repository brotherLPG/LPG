import { useCallback } from 'react'

/**
 * Global print utility hook
 */
export const usePrint = () => {
  /**
   * Print Header
   */
  const getPrintHeader = useCallback(title => {
    return `
      <div class="print-header">
        <h2>${title}</h2>
      </div>
    `
  }, [])

  /**
   * Print Footer
   */
  const getPrintFooter = useCallback(() => {
    return `
      <div class="print-footer">
        <div class="developer-info">
        <strong>Developed By</strong>
        <span>Eissa &amp; Zakirya</span>
        <span>+92 336 1989322</span>
        <span>+92 349 9386512</span>
      </div>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `
  }, [])

  /**
   * Global Print Styles
   */
  const getPrintStyles = useCallback(() => {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        html,
        body {
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
        }

        body {
          padding: 10mm;
        }

        h1,
        h2,
        h3 {
          margin: 0;
        }

        h3 {
          font-size: 16px;
          margin-bottom: 12px;
          color: #333;
        }

        /* Header */
        .print-header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #008951;
        }

        .print-header h2 {
          font-size: 24px;
          color: #333;
        }

        /* Main Content */
        .print-content {
          width: 100%;
          padding-bottom: 35px;
        }

        /* Receipt Top Row */
        .receipt-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
        }

        .receipt-top .qr-code img {
          width: 100px;
          height: 100px;
        }

        /* Info Cards */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .info-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 16px;
          background: #f8fafc;
        }

        .info-card h3 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
        }

        .info-table td {
          border: none;
          padding: 5px 0;
          font-size: 13px;
        }

        .info-table td:first-child {
          font-weight: 600;
          color: #64748b;
          width: 40%;
        }

        .info-table td:last-child {
          color: #1e293b;
          font-weight: 500;
        }

        /* Delivery Details */
        .delivery-section {
          margin-top: 20px;
        }

        .delivery-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .delivery-table th {
          background-color: #008951;
          color: #fff;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 10px 14px;
          text-align: left;
        }

        .delivery-table td {
          border-top: 1px solid #e2e8f0;
          padding: 12px 14px;
          font-size: 14px;
          color: #1e293b;
        }

        .delivery-table tr:nth-child(even) td {
          background-color: #f8fafc;
        }

        .total-row td {
          background-color: #ecfdf5 !important;
          font-weight: 700;
          font-size: 15px;
          color: #065f46;
          border-top: 2px solid #008951;
        }

        .total-cost {
          font-weight: bold;
        }

        /* Spec Table */
        .spec-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .spec-table th,
        .spec-table td {
          border-top: 1px solid #e2e8f0;
          padding: 10px 14px;
          font-size: 13px;
          text-align: left;
        }

        .spec-table th {
          width: 40%;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
        }

        .spec-table td {
          color: #1e293b;
          font-weight: 500;
        }

        .spec-table tr:first-child th,
        .spec-table tr:first-child td {
          border-top: none;
        }

        /* Price Highlight */
        .price-highlight {
          display: inline-block;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          font-weight: 700;
          font-size: 15px;
          padding: 6px 14px;
          border-radius: 6px;
          margin-top: 8px;
        }

        /* Status Badge */
        .status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 12px;
          border-radius: 999px;
        }

        .status-badge.active {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .status-badge.inactive {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        /* QR Code */
        .qr-code {
          text-align: center;
        }

        .qr-code img {
          width: 100px;
          height: 100px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px;
          background: #fff;
        }

        .qr-code p {
          margin: 6px 0 0;
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* General table styles */
        .print-content > table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .print-content > table th,
        .print-content > table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        /* Footer */
        .print-footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          background: white;
        }

        .print-footer p {
          margin: 5px 0;
        }

        /* Print settings */
        @media print {

          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body {
            display: block !important;
          }

          .print-content {
            width: 100%;
            padding-bottom: 35px;
          }

          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background: white;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-header,
          .info-card,
          .delivery-section,
          .receipt-top {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          table {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    `
  }, [])

  /**
   * Generate a QR code image tag for print content
   * @param {string} data - Data to encode in the QR code
   * @param {number} size - QR code size in pixels (default 110)
   */
  const getQRCodeImg = useCallback((data, size = 110) => {
    const encoded = encodeURIComponent(data)
    return `
      <div class="qr-code">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}" alt="QR Code" />
        <p>Scan to verify receipt</p>
      </div>
    `
  }, [])

  /**
   * Print Table
   */
  const printTable = useCallback(
    ({ columns, data, title, subtitle = '' }) => {
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        alert('Please allow popups to print')
        return
      }

      const tableRows = data
        .map(item => {
          const cells = columns
            .map(col => {
              const value = item[col.key] ?? ''
              return `<td>${value}</td>`
            })
            .join('')

          return `<tr>${cells}</tr>`
        })
        .join('')

      const tableHeaders = columns.map(col => `<th>${col.label}</th>`).join('')

      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          ${getPrintStyles()}
        </head>

        <body>

          ${getPrintHeader(title)}

          ${
            subtitle
              ? `<p style="color: #666; margin-bottom: 20px;">${subtitle}</p>`
              : ''
          }

          <main class="print-content">
            <table>
              <thead>
                <tr>${tableHeaders}</tr>
              </thead>

              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </main>

          ${getPrintFooter()}

          <script>
            window.onload = function() {
              var images = Array.from(document.images);
              var pending = images.filter(function(img) { return !img.complete; });

              function doPrint() {
                setTimeout(function() {
                  window.print();
                }, 200);
              }

              if (pending.length === 0) {
                doPrint();
              } else {
                var loaded = 0;
                pending.forEach(function(img) {
                  img.onload = img.onerror = function() {
                    loaded++;
                    if (loaded === pending.length) doPrint();
                  };
                });
                setTimeout(doPrint, 3000);
              }
            };

            window.onafterprint = function() {
              window.close();
            };
          </script>

        </body>
      </html>
    `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
    },
    [getPrintHeader, getPrintFooter, getPrintStyles]
  )

  /**
   * Print Custom Content (Receipt / Invoice)
   */
  const printContent = useCallback(
    ({ title, content }) => {
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        alert('Please allow popups to print')
        return
      }

      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          ${getPrintStyles()}
        </head>

        <body>

          ${getPrintHeader(title)}

          <main class="print-content">
            ${content}
          </main>

          ${getPrintFooter()}

          <script>
            window.onload = function() {
              var images = Array.from(document.images);
              var pending = images.filter(function(img) { return !img.complete; });

              function doPrint() {
                setTimeout(function() {
                  window.print();
                }, 200);
              }

              if (pending.length === 0) {
                doPrint();
              } else {
                var loaded = 0;
                pending.forEach(function(img) {
                  img.onload = img.onerror = function() {
                    loaded++;
                    if (loaded === pending.length) doPrint();
                  };
                });
                setTimeout(doPrint, 3000);
              }
            };

            window.onafterprint = function() {
              window.close();
            };
          </script>

        </body>
      </html>
    `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
    },
    [getPrintHeader, getPrintFooter, getPrintStyles]
  )

  /**
   * Print Current Page
   */
  const printCurrentPage = useCallback(() => {
    window.print()
  }, [])

  return {
    printTable,
    printContent,
    printCurrentPage,
    getQRCodeImg
  }
}

export default usePrint
