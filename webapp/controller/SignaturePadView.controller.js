sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/ResponsivePopover',
    'sap/ui/unified/ColorPicker',
    'sap/ui/unified/library',
    'sap/m/Button',
    'sap/ui/Device'
],
    function (Controller, ResponsivePopover, ColorPicker, unifiedLibrary, Button, Device) {
        "use strict";

        return Controller.extend("projectsignaturepad.signaturepadproject.controller.SignaturePadView", {
            onInit: function () {
                this.oSignaturePad = this.byId("mySignaturePad");

                this.penMinWidth = this.oSignaturePad.getPenMinWidth();
                this.penMaxWidth = this.oSignaturePad.getPenMaxWidth();
                this.penWidthSlider = this.byId("penWidthSignaturePad");
                this.penWidthSlider.setValue(this.penMinWidth);
                this.penWidthSlider.setMin(this.oSignaturePad.penMinWidth);
                this.penWidthSlider.setMax(this.oSignaturePad.penMaxWidth);
                this.onLivePenWidthChange = this.onLivePenWidthChange.bind(this);

                this.dotSize = this.oSignaturePad.getDotSize();

            },
            onClear() {
                this.oSignaturePad.clear();
            },
            onUndo() {
                this.oSignaturePad.undo();
            },
            onRedo() {
                this.oSignaturePad.redo();
            },
            onPopoverColorPickerSignaturePad(oEvent) {
                const isBackgroundColor = oEvent.oSource.sId.includes("Background");
                let oRP = new ResponsivePopover({
                    title: "Color Picker",
                    content: [
                        new ColorPicker({
                            mode: unifiedLibrary.ColorPickerMode.HSL,
                            liveChange: isBackgroundColor ?
                                this.onLiveChangeBackgroundColor.bind(this) :
                                this.onLiveChangeColor.bind(this),
                            colorString: isBackgroundColor ? this.oSignaturePad.getBackgroundColor() :
                                this.oSignaturePad.getPenColor()
                        })
                    ]
                });
                if (Device.system.phone) {
                    oRP.setBeginButton(
                        new Button({
                            text: "Submit",
                            press: function () {
                                oRP.close();
                            }
                        })
                    );
                    oRP.setEndButton(
                        new Button({
                            text: "Cancel",
                            press: function () {
                                oRP.close();
                            }
                        }));
                } else {
                    oRP.setShowHeader(false);
                }
                oRP.openBy(oEvent.getSource());
            },
            onLiveChangeBackgroundColor(oEvent) {
                const oColor = oEvent.oSource.Color;
                const sColor = `rgba(${oColor.r},${oColor.g},${oColor.b},${oColor.a})`;
                this.oSignaturePad.changeBackgroundColor(sColor)
            },
            onLiveChangeColor(oEvent) {
                const oColor = oEvent.oSource.Color;
                const sColor = `rgba(${oColor.r},${oColor.g},${oColor.b},${oColor.a})`;
                this.oSignaturePad.changeColor(sColor)
            },
            onLivePenWidthChange(oEvent) {
                this.oSignaturePad.changePenMinWidth(oEvent.oSource.getValue());
            },
            onLiveDotSizeChange(oEvent) {
                this.oSignaturePad.changeDotSize(oEvent.oSource.getValue());
            },
            onSavePNG() {
                console.log('this.oSignaturePad :>> ', this.oSignaturePad);
                this.oSignaturePad.saveInPNG();
            },
            onSaveJPG() {
                console.log('this.oSignaturePad :>> ', this.oSignaturePad);
                this.oSignaturePad.saveInJPG();
            },
            onSaveSVG() {
                console.log('this.oSignaturePad :>> ', this.oSignaturePad);
                this.oSignaturePad.saveInSVG();
            },
            onFileUploaderChange(oEvent) {
                let file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
                if (file) {
                    console.log('file :>> ', file);
                    console.log('typeof file :>> ', typeof file);
                    const oImage = this.byId("imageBlobToFile");
                    oImage.setSrc(URL.createObjectURL(file));
                    const oCodeEditor = this.byId("codeFileToBlob");
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        let fileContentAsString = event.target.result;
                        console.log('fileContentAsString :>> ', fileContentAsString);
                        oCodeEditor.setValue(fileContentAsString);
                    };
                    reader.readAsText(file);
                    // console.log("oCodeEditor =>", oCodeEditor);
                }

            },
            onUploadCompleteFileToBlob(oEvent) {

            },
            onUploadCompleteBlobToFile(oEvent) {
            }
        });
    });
