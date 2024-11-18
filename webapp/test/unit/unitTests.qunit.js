/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"project_signature_pad/signaturepadproject/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
