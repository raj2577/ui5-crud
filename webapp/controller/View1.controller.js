sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/ID"],
  (Controller, ID) => {
    "use strict";

    return Controller.extend("odatacrud.controller.View1", {
      onInit() {
        // this.onReadAll();
      },
      onReadAll() {
        let oModel = this.getOwnerComponent().getModel();
        oModel.read("/Products", {
          success: (odata) => {
            let jModel = new sap.ui.model.json.JSONModel(odata);
            this.getView().byId("idProducts").setModel(jModel);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },
      onReadFilter() {
        let oModel = this.getOwnerComponent().getModel();
        let oFilter = new sap.ui.model.Filter("Rating", "EQ", "3");
        oModel.read("/Products", {
          filters: [oFilter], // Fixed key
          success: (odata) => {
            let jModel = new sap.ui.model.json.JSONModel(odata);
            this.getView().byId("idProducts").setModel(jModel);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },
      onReadSorter() {
        let oModel = this.getOwnerComponent().getModel();
        let oSorter = new sap.ui.model.Sorter("Price", true);
        oModel.read("/Products", {
          sorters: [oSorter], // Fixed key
          success: (odata) => {
            let jModel = new sap.ui.model.json.JSONModel(odata);
            this.getView().byId("idProducts").setModel(jModel);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },

      onReadParameter() {
        let oModel = this.getOwnerComponent().getModel();

        oModel.read("/Products", {
          urlParameters: { $skip: 0, $top: 4 },
          success: (odata) => {
            let jModel = new sap.ui.model.json.JSONModel(odata);
            this.getView().byId("idProducts").setModel(jModel);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },

      onReadKey() {
        let oModel = this.getOwnerComponent().getModel();

        oModel.read("/Products(2)", {
          success: (odata) => {
            let jModel = new sap.ui.model.json.JSONModel({ results: [odata] });

            this.getView().byId("idProducts").setModel(jModel);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },

      onEdit(oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        oModel.setUseBatch(false);
        if (oEvent.getSource().getText() === "Edit") {
          oEvent.getSource().setText("Submit");
          oEvent
            .getSource()
            .getParent()
            .getParent()
            .getCells()[3]
            .setEditable(true);
        } else {
          oEvent.getSource().setText("Edit");
          oEvent
            .getSource()
            .getParent()
            .getParent()
            .getCells()[3]
            .setEditable(false);
          let oInput = oEvent
            .getSource()
            .getParent()
            .getParent()
            .getCells()[3]
            .getValue();
          let oId = oEvent.getSource().getBindingContext().getProperty("ID");

          oModel.update(
            `/Products(${oId})`,
            { Rating: oInput },
            {
              success: (odata) => {
                // let jModel = new sap.ui.model.json.JSONModel(odata);
                // this.getView().byId("idProducts").setModel(jModel);
                // this.onReadAll();
                this.getView().byId("idProducts").getModel().refresh();
              },
              error: (oError) => {
                console.log(oError);
              },
            }
          );
        }
      },
      onDuplicate(oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        oModel.setUseBatch(false);

        let oDuplicateData = {
          ...oEvent.getSource().getBindingContext().getObject(),
        };

        // Fetch all existing IDs to determine the next available unique 3-digit ID
        oModel.read("/Products", {
          success: (odata) => {
            let existingIds = odata.results
              .map((item) => parseInt(item.ID, 10)) // Ensure all IDs are integers
              .filter((id) => !isNaN(id));

            // Find the next unique 3-digit ID
            let maxId = existingIds.length ? Math.max(...existingIds) : 99; // Start from 99 if empty
            let newId = (maxId + 1) % 1000; // Keep it within 3 digits
            newId = parseInt(newId, 10); // Ensure it's an integer

            oDuplicateData.ID = newId; // Assign new unique ID

            // Now create the duplicate record
            oModel.create("/Products", oDuplicateData, {
              success: (odata) => {
                console.log("Duplicate created successfully:", odata);
                this.getView().byId("idProducts").getModel().refresh();
              },
              error: (oError) => {
                console.error("Duplicate creation failed:", oError);
              },
            });
          },
          error: (oError) => {
            console.error("Failed to fetch existing products:", oError);
          },
        });
      },

      onDelete(oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        oModel.setUseBatch(false);
        let oId = oEvent.getSource().getBindingContext().getProperty("ID");
        oModel.remove(`/Products(${oId})`, {
          success: (odata) => {
            // this.onReadAll()();
            this.getView().byId("idProducts").getModel().refresh();
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },
    });
  }
);
