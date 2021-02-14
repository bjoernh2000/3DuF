import dialogPolyfill from "dialog-polyfill";
import * as Registry from "../../core/registry";
import JSZip from "jszip";
import CNCGenerator from "../../manufacturing/cncGenerator";
import axios from 'axios';

export default class ParallelFabricateDialog {
    constructor(viewManagerDelegate) {
        this.__sendFabricationSubmissionButton = document.getElementById("parallel_send_designs_button");
        this.__dialog = document.getElementById("parallel_fabricate_dialog");
        this.__compatibility = document.getElementById("parallel_compatibility");
        this.__showFabDialogButton = document.querySelector("#parallel_fabricate");
        this.__viewManagerDelegate = viewManagerDelegate;

        let ref = this;
        let registryref = Registry;
        this.__viewManagerDelegate

        let cncGenerator = new CNCGenerator(Registry.currentDevice, this.__viewManagerDelegate);

        if (!this.__dialog.showModal) {
            dialogPolyfill.registerDialog(this.__dialog);
        }

        this.__showFabDialogButton.addEventListener("click", function() {
            ref.__dialog.showModal();
        });

        this.__sendFabricationSubmissionButton.onclick = function() {
            console.log("send designs");
            let email = document.getElementById("parallel_fabricate_dialog_email_field").value;
            let address = document.getElementById("parallel_fabricate_dialog_address_field").value;

            let endpoint = "http://localhost:5000/endpoint";

            console.log("SVG for axios post request");
            cncGenerator.setDevice(registryref.currentDevice);
            cncGenerator.generatePortLayers();
            cncGenerator.generateDepthLayers();
            cncGenerator.generateEdgeLayers();

            let content = ref.sendFabrication(cncGenerator.getSVGOutputs());

            var formData = new FormData();
            formData.append('file', content, "parallelSVG");
            formData.append('email', email);
            formData.append('address', address);

            axios.post(endpoint, formData, {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    console.log(res);
                    alert("Sucess, please see email for status")
                })
                .catch((err) => {
                    console.error(err);
                    alert("Error submiting the design for fabrication:" + err.message)
                })

            cncGenerator.flushData();
            
        }
            

        this.__compatibility.onclick = function() {  // this depends on dimensions and parameters required by parallel fluidics

        }

        this.__dialog.querySelector(".close").addEventListener("click", function() {
            ref.__dialog.close();
        });

    }

    sendFabrication(svgOutputs) {
        let zipper = new JSZip();

        for (const key of svgOutputs.keys()) {
            zipper.file(key + ".svg", svgOutputs.get(key));
        }

        let content = zipper.generate({
            type: "blob"
        });
        return content;
    }

}