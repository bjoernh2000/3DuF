import dialogPolyfill from "dialog-polyfill";
import * as Registry from "../../core/registry";
import axios from 'axios';
import JSZip from "jszip";
import ManufacturingLayer from "../../manufacturing/manufacturingLayer";

export default class ParallelFabricateDialog {
    constructor() {
        this.__sendFabricationSubmissionButton = document.getElementById("parallel_send_designs_button");
        this.__dialog = document.getElementById("parallel_fabricate_dialog");
        this.__compatibility = document.getElementById("parallel_compatibility");
        this.__showFabDialogButton = document.querySelector("#parallel_fabricate");

        let ref = this;

        if (!this.__dialog.showModal) {
            dialogPolyfill.registerDialog(this.__dialog);
        }

        this.__showFabDialogButton.addEventListener("click", function() {
            ref.__dialog.showModal();
        });

        this.__sendFabricationSubmissionButton.onclick = function() {
            console.log("send designs");
            let email = document.getElementById("fabricate_dialog_email_field").value;
            let address = document.getElementById("fabricate_dialog_address_field").value;

            let endpoint = "http://127.0.0.1:5000/endpoint";

            let svgs = Registry.viewManager.layersToSVGStrings();
            for (let i = 0; i < svgs.length; i++) {
                svgs[i] =
                    ManufacturingLayer.generateSVGTextPrepend(Registry.currentDevice.getXSpan(), Registry.currentDevice.getYSpan()) + svgs[i] + ManufacturingLayer.generateSVGTextAppend();
            }

            let blobs = [];
            let success = 0;
            let zipper = new JSZip();
            for (let i = 0; i < svgs.length; i++) {
                if (svgs[i].slice(0, 4) == "<svg") {
                    zipper.file("Device_layer_" + i + ".svg", svgs[i]);
                    success++;
                }
            }

            if (success == 0) throw new Error("Unable to generate any valid SVGs. Do all layers have at least one non-channel item in them?");
            else {
                let content = zipper.generate({
                    type: "blob"
                });

                axios.post(endpoint, {
                    "email": email,
                    "acceptance": "n/a",
                    "completion": "not completed",
                    "time": 10,
                    "cost": 1000,
                    "file": content,
                    "address": address
                    })
                    .then((res) => {
                        console.log(res);
                        alert("Add the submission code here")
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Error submiting the design for fabrication:" + err.message)
                    })
            }

            
        }

        this.__compatibility.onclick = function() {  // this depends on dimensions and parameters required by parallel fluidics

        }

        this.__dialog.querySelector(".close").addEventListener("click", function() {
            ref.__dialog.close();
        });

    }

}