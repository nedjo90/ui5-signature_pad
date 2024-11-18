sap.ui.define(
    [
        "sap/ui/core/Control",
        "signature_pad"
    ],
    (Control, SignaturePad) => {
        "use strict";

        //https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.Control
        //https://sapui5.hana.ondemand.com/sdk/#/topic/91f0a22d6f4d1014b6dd926db0e91070

        return Control.extend("webapp.control.SignaturePad", {
            metadata: {
                //https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.base.ManagedObject%23methods/sap.ui.base.ManagedObject.extend
                library: "",
                properties: {
                    "velocityFilterWeight": {
                        type: "float",
                        defaultValue: 0.7
                    },
                    "penMinWidth": {
                        type: "float",
                        defaultValue: 0.5
                    },
                    "penMaxWidth": {
                        type: "float",
                        defaultValue: 2.5
                    },
                    "throttle": {
                        type: "int",
                        defaultValue: 16 //milliseconde
                    },
                    "minDistance": {
                        type: "int",
                        defaultValue: 5 //pixels
                    },
                    "dotSize": {
                        type: "int",
                        defaultValue: 0
                    },
                    "penColor": {
                        type: "sap.ui.core.CSSColor",
                        defaultValue: "rgba(0,0,0,1)"
                    },
                    "width": {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "24rem"
                    },
                    "height": {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "10rem"
                    },
                    // https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.CSSColor
                    "backgroundColor": {
                        type: "sap.ui.core.CSSColor",
                        defaultValue: "rgba(255,255,255,1)"
                    },
                    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
                    "compositeOperation": {
                        type: "",
                        defaultValue: "source-over"
                    },
                    "canvasContextOptions": {
                        type: "any",
                        defaultValue: {}
                    },
                    "class": {
                        type: "string",
                        defaultValue: ""
                    }
                },
                defaultProperty: "",
                agregation: {
                },
                defaultAggregation: "",
                associations: {
                },
                events: {
                },
            },
            //https://sapui5.hana.ondemand.com/sdk/#/topic/6d6b5bda5727419eadcc9cbac1f6e6a1
            init: function () {
                if (Control.prototype.init) {
                    Control.prototype.init.apply(this, arguments);
                }
            },
            //https://sapui5.hana.ondemand.com/sdk/#/topic/d4ac0edbc467483585d0c53a282505a5
            exit: function () {
                if (Control.prototype.exit) {
                    Control.prototype.exit.apply(this, arguments);
                }
            },
            //https://sapui5.hana.ondemand.com/sdk/#/topic/121b8e6337d147af9819129e428f1f75.html
            onInit: function () {
                this.aUndoData = [];
            },
            onBeforeRendering: function () { },
            onAfterRendering: function () {
                this.oCanvas = document.querySelector("#signaturePadCanvas");
                // console.log('this.oCanvas :>> ', this.oCanvas);
                // console.log("this", this);
                try {
                    this.resizeCanvas();
                    this.oSignaturePad = new SignaturePad(
                        this.oCanvas,
                        {
                            "velocityFilterWeight": this.getVelocityFilterWeight(),
                            "minWidth": this.getPenMinWidth(),
                            "maxWidth": this.getPenMaxWidth(),
                            "throttle": this.getThrottle(),
                            "minDistance": this.getMinDistance(),
                            "dotSize": this.getDotSize(),
                            "penColor": this.getPenColor(),
                            "backgroundColor": this.getBackgroundColor(),
                            "compositeOperation": this.getCompositeOperation(),
                            "canvasContextOptions": this.getCanvasContextOptions()
                        }
                    );
                    // console.log('this.signaturePad :>> ', this.oSignaturePad);
                    this.oSignaturePad.addEventListener("endStroke", () => this.onendStrock());
                    sap.ui.Device.resize.attachHandler(() => this.resizeCanvas(true));
                    // console.log('sap.ui.Device.systeme.phone :>> ', sap.ui.Device.system.phone);
                } catch (e) {
                    // console.error(e);
                }
            },
            onExit: function () { },
            //https://sapui5.hana.ondemand.com/sdk/#/topic/c9ab34570cc14ea5ab72a6d1a4a03e3f
            //https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.RenderManager
            renderer: function (oRm, oControl) {
                oRm.openStart("div");
                oRm.attr("id", "signaturePadCanvasWrapper");
                oRm.openEnd("div");
                oRm.openStart("canvas");
                oRm.attr("id", "signaturePadCanvas");
                oRm.style("width", oControl.getWidth());
                oRm.style("height", oControl.getHeight());
                const aClass = oControl.getClass().split(",");
                for (let i = 0; i < aClass.length; i++) {
                    oRm.class(aClass[i]);
                }
                oRm.openEnd("canvas");
                oRm.close("canvas");
                oRm.close("div");
            },
            resizeCanvas(isUpdateData = false) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                this.oCanvas.width = this.oCanvas.offsetWidth * ratio;
                this.oCanvas.height = this.oCanvas.offsetHeight * ratio;
                this.oCanvas.getContext("2d").scale(ratio, ratio);
                if (isUpdateData) this.oSignaturePad.fromData(this.oSignaturePad.toData());
            },
            clear: function () {
                this.oSignaturePad.clear();
            },
            save: function () {
                return this.oSignaturePad.toDataURL();
            },
            undo: function () {
                let aData = this.oSignaturePad.toData();
                if (aData && aData.length > 0) {
                    const oRemoved = aData.pop();
                    this.aUndoData.push(oRemoved);
                    this.oSignaturePad.fromData(aData);
                }
            },
            redo: function () {
                if (this.aUndoData.length > 0) {
                    const aData = this.oSignaturePad.toData();
                    aData.push(this.aUndoData.pop());
                    this.oSignaturePad.fromData(aData);
                }
            },
            changeBackgroundColor: function (sColorRGBA) {
                this.oSignaturePad.backgroundColor = sColorRGBA;
                const data = this.oSignaturePad.toData();
                this.oSignaturePad.clear();
                this.oSignaturePad.fromData(data);
            },
            changeColor: function (sColorRGBA) {
                this.oSignaturePad.penColor = sColorRGBA;
            },
            onendStrock() {
                this.aUndoData = [];
            },
            changePenMinWidth(fPenMinWidth) {
                this.oSignaturePad.minWidth = Math.min(fPenMinWidth, this.oSignaturePad.minWidth);
                // this.oSignaturePad.maxWidth = Math.max(fPenMinWidth, this.oSignaturePad.maxWidth);
            },
            changeDotSize(iDotSize) {
                this.oSignaturePad.dotSize = iDotSize;
            },
            // https://developer.mozilla.org/en-US/docs/Web/API/Blob
            dataUrlToBlob(sDataUrl = this.oSignaturePad.toDataURL()) {
                const aParts = sDataUrl.split(';base64,');
                const sContentType = aParts[0].split(":")[1];
                const aRaw = window.atob(aParts[1]);
                const iRawLength = aRaw.length;
                const uInt8Array = new Uint8Array(iRawLength);
                for (let i = 0; i < iRawLength; ++i) {
                    uInt8Array[i] = aRaw.charCodeAt(i);
                }
                const sBlob = new Blob([uInt8Array], { type: sContentType });
                // console.log('sBlob :>> ', sBlob);
                return sBlob;
            },
            download(sDataURL, sFilename) {
                const oBlob = this.dataUrlToBlob(sDataURL);
                const url = window.URL.createObjectURL(oBlob);

                const a = document.createElement("a");
                a.style = "display: none";
                a.href = url;
                a.download = sFilename;

                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
            },
            saveInPNG(sFilename = "signature.png"){
                const sDataURL = this.oSignaturePad.toDataURL();
                this.download(sDataURL, sFilename)
            },
            saveInJPG(sFilename = "signature.jpg"){
                const sDataURL = this.oSignaturePad.toDataURL("image/jpeg");
                this.download(sDataURL, sFilename)
            },
            saveInSVG(sFilename = "signature.svg"){
                const sDataURL = this.oSignaturePad.toDataURL("image/svg+xml");
                this.download(sDataURL, sFilename)
            },
        })
    });