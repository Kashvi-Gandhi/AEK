import React from "react";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import pdfjsWorker from
  "pdfjs-dist/build/pdf.worker.entry";


/*
 * ============================================================
 * PDF.js worker configuration
 * ============================================================
 */

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfjsWorker;


/*
 * ============================================================
 * PdfViewer
 * ============================================================
 */

export default class PdfViewer extends React.Component {

  constructor(props) {

    super(props);


    this.state = {

      loading:
        true,

      error:
        "",

      totalPages:
        0,

      scale:
        1.0
    };


    this.viewerRef =
      React.createRef();


    this.pdfDocument =
      null;


    this.renderGeneration =
      0;


    this.zoomIn =
      this.zoomIn.bind(this);


    this.zoomOut =
      this.zoomOut.bind(this);


    this.resetZoom =
      this.resetZoom.bind(this);


    this.renderDocument =
      this.renderDocument.bind(this);
  }


  /*
   * ==========================================================
   * Load PDF
   * ==========================================================
   */

  componentDidMount() {

    this.loadPdf();
  }


  /*
   * ==========================================================
   * Cleanup
   * ==========================================================
   */

  componentWillUnmount() {

    this.renderGeneration += 1;


    if (this.pdfDocument) {

      try {

        this.pdfDocument.destroy();

      } catch (e) {

        /*
         * Ignore cleanup errors.
         */
      }
    }
  }


  /*
   * ==========================================================
   * Load PDF.js document
   * ==========================================================
   */

  async loadPdf() {

    try {

      // console.log(
      //   "PDF.JS - LOADING PDF"
      // );

      const loadingTask =
        pdfjsLib.getDocument({

          data:
            this.props.pdfData
        });


      const pdf =
        await loadingTask.promise;


      this.pdfDocument =
        pdf;


      // console.log(
      //   "PDF.js loaded document"
      // );


      // console.log(
      //   "Pages:",
      //   pdf.numPages
      // );


      this.setState(
        {

          loading:
            false,

          totalPages:
            pdf.numPages,

          error:
            ""

        },

        this.renderDocument
      );


    } catch (error) {

      // console.error(
      //   "PDF.js failed to load document:"
      // );


      // console.error(
      //   error
      // );


      this.setState({

        loading:
          false,

        error:
          error.message ||
          String(error)
      });
    }
  }


  /*
   * ==========================================================
   * Render all PDF pages
   * ==========================================================
   */

  async renderDocument() {

    if (
      !this.pdfDocument ||
      !this.viewerRef.current
    ) {

      return;
    }


    this.renderGeneration += 1;


    const generation =
      this.renderGeneration;


    const viewer =
      this.viewerRef.current;


    /*
     * Remove old rendered pages.
     */

    while (
      viewer.firstChild
    ) {

      viewer.removeChild(
        viewer.firstChild
      );
    }


    // console.log(
    //   "PDF.js rendering at scale:",
    //   this.state.scale
    // );


    try {

      for (
        let pageNumber = 1;
        pageNumber <=
          this.pdfDocument.numPages;
        pageNumber += 1
      ) {

        if (
          generation !==
          this.renderGeneration
        ) {

          return;
        }


        const page =
          await this.pdfDocument.getPage(
            pageNumber
          );


        const viewport =
          page.getViewport({

            scale:
              this.state.scale
          });


        /*
         * Page wrapper.
         */

        const pageContainer =
          document.createElement(
            "div"
          );


        pageContainer.style.margin =
          "0 auto 24px auto";


        pageContainer.style.textAlign =
          "center";


        pageContainer.style.width =
          "max-content";


        pageContainer.style.maxWidth =
          "none";


        /*
         * Page number.
         */

        const pageLabel =
          document.createElement(
            "div"
          );


        pageLabel.textContent =
          "Page " +
          pageNumber +
          " of " +
          this.pdfDocument.numPages;


        pageLabel.style.marginBottom =
          "6px";


        pageLabel.style.fontSize =
          "13px";


        pageLabel.style.color =
          "#ffffff";


        /*
         * Canvas.
         */

        const canvas =
          document.createElement(
            "canvas"
          );


        const context =
          canvas.getContext(
            "2d"
          );


        const outputScale =
          window.devicePixelRatio ||
          1;


        canvas.width =
          Math.floor(
            viewport.width *
            outputScale
          );


        canvas.height =
          Math.floor(
            viewport.height *
            outputScale
          );


        canvas.style.width =
          Math.floor(
            viewport.width
          ) +
          "px";


        canvas.style.height =
          Math.floor(
            viewport.height
          ) +
          "px";


        /*
         * Important:
         *
         * Do NOT use maxWidth: 100% here.
         *
         * If the PDF is wider than the viewer after zooming,
         * we want horizontal scrolling rather than shrinking.
         */

        canvas.style.backgroundColor =
          "#ffffff";


        canvas.style.display =
          "block";


        canvas.style.boxShadow =
          "0 1px 5px rgba(0,0,0,0.30)";


        pageContainer.appendChild(
          pageLabel
        );


        pageContainer.appendChild(
          canvas
        );


        viewer.appendChild(
          pageContainer
        );


        const transform =
          outputScale !== 1
            ? [
                outputScale,
                0,
                0,
                outputScale,
                0,
                0
              ]
            : null;


        const renderTask =
          page.render({

            canvasContext:
              context,

            viewport:
              viewport,

            transform:
              transform
          });


        await renderTask.promise;


      //   console.log(
      //     "Rendered page:",
      //     pageNumber
      //   );
      }


      // console.log(
      //   "PDF.js rendering complete"
      // );


    } catch (error) {

      if (
        generation !==
        this.renderGeneration
      ) {

        return;
      }


      // console.error(
      //   "PDF.js render error:"
      // );


      // console.error(
      //   error
      // );


      this.setState({

        error:
          error.message ||
          String(error)
      });
    }
  }


  /*
   * ==========================================================
   * Zoom
   * ==========================================================
   */

  zoomIn() {

    const nextScale =
      Math.min(
        this.state.scale + 0.25,
        3
      );


    this.setState(
      {

        scale:
          nextScale

      },

      this.renderDocument
    );
  }


  zoomOut() {

    const nextScale =
      Math.max(
        this.state.scale - 0.25,
        0.5
      );


    this.setState(
      {

        scale:
          nextScale

      },

      this.renderDocument
    );
  }


  resetZoom() {

    this.setState(
      {

        scale:
          1.0

      },

      this.renderDocument
    );
  }


  /*
   * ==========================================================
   * Render UI
   * ==========================================================
   */

  render() {

    const {
      loading,
      error,
      totalPages,
      scale
    } = this.state;


    return (

      <div
        style={{
          width:
            "100%",

          height:
            "calc(100vh - 230px)",

          minHeight:
            "500px",

          display:
            "flex",

          flexDirection:
            "column"
        }}
      >


        {/* ================================================
            Toolbar
            ================================================ */}

        <div
          style={{

            flex:
              "0 0 auto",

            display:
              "flex",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap:
              "8px",

            marginBottom:
              "10px",

            padding:
              "10px",

            backgroundColor:
              "#eeeeee",

            border:
              "1px solid #cccccc"
          }}
        >


          <button
            type="button"

            onClick={
              this.props.onBack
            }
          >

            Back

          </button>


          <button
            type="button"

            onClick={
              this.zoomOut
            }

            disabled={
              loading
            }
          >

            -

          </button>


          <span>

            Zoom: {

              Math.round(
                scale * 100
              )

            }%

          </span>


          <button
            type="button"

            onClick={
              this.zoomIn
            }

            disabled={
              loading
            }
          >

            +

          </button>


          <button
            type="button"

            onClick={
              this.resetZoom
            }

            disabled={
              loading
            }
          >

            Reset

          </button>


          {
            totalPages > 0
              ? (

                <span>

                  Pages: {
                    totalPages
                  }

                </span>

              )
              : null
          }


          {
            this.props.fileName
              ? (

                <span>

                  Document: {
                    this.props.fileName
                  }

                </span>

              )
              : null
          }

        </div>


        {/* ================================================
            Loading
            ================================================ */}

        {
          loading
            ? (

              <p>
                Loading PDF...
              </p>

            )
            : null
        }


        {/* ================================================
            Error
            ================================================ */}

        {
          error
            ? (

              <div>

                <p>
                  <strong>
                    PDF Viewer Error:
                  </strong>
                </p>

                <p>
                  {error}
                </p>

              </div>

            )
            : null
        }


        {/* ================================================
            SCROLLABLE PDF AREA
            ================================================ */}

        <div
          ref={
            this.viewerRef
          }

          style={{

            /*
             * Fill remaining height below toolbar.
             */

            flex:
              "1 1 auto",

            /*
             * This is the important change.
             */

            overflowY:
              "auto",

            overflowX:
              "auto",

            /*
             * Needed inside flex containers so overflow
             * actually works correctly.
             */

            minHeight:
              "0",

            minWidth:
              "0",

            width:
              "100%",

            padding:
              "20px",

            boxSizing:
              "border-box",

            backgroundColor:
              "#555555",

            WebkitOverflowScrolling:
              "touch"
          }}
        />


      </div>
    );
  }
}