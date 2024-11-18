/*global QUnit*/

sap.ui.define([
	"project_signature_pad/signaturepadproject/controller/SignaturePadView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SignaturePadView Controller");

	QUnit.test("I should test the SignaturePadView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
